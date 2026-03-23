using PhuongXa.API.TienIch;
using System.Security.Cryptography;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PhuongXa.Application.Chung;
using PhuongXa.Application.DTOs.DonUng;
using PhuongXa.Application.CacGiaoDien;
using PhuongXa.Domain.CacThucThe;
using PhuongXa.Domain.CacKieuLietKe;

namespace PhuongXa.API.Controllers;

[ApiController]
[Route("api/applications")]
public class DonUngController : BaseApiController
{
    private readonly IDonViCongViec _donViCongViec;
    private readonly IMapper _anhXa;
    private readonly IDichVuLuuTruTep _luuTruTep;
    private readonly IDichVuEmail _dichVuEmail;
    private readonly ILogger<DonUngController> _nhatKy;

    public DonUngController(
        IDonViCongViec donViCongViec,
        IMapper anhXa,
        IDichVuLuuTruTep luuTruTep,
        IDichVuEmail dichVuEmail,
        ILogger<DonUngController> nhatKy)
    {
        _donViCongViec = donViCongViec;
        _anhXa = anhXa;
        _luuTruTep = luuTruTep;
        _dichVuEmail = dichVuEmail;
        _nhatKy = nhatKy;
    }

    [HttpPost("submit")]
    [EnableRateLimiting("submit-application")]
    public async Task<IActionResult> NopDon([FromBody] NopDonUngDto dto)
    {
        var dichVu = await _donViCongViec.DichVus.LayTheoIdAsync(dto.DichVuId);
        if (dichVu == null || !dichVu.DangHoatDong)
            return BadRequest(PhanHoiApi.ThatBai("Dịch vụ không tồn tại hoặc không còn hoạt động"));

        var donUng = _anhXa.Map<DonUngDichVu>(dto);
        donUng.MaTheoDoi = $"HS{DateTime.UtcNow:yyyyMMdd}{Convert.ToHexString(RandomNumberGenerator.GetBytes(4)).ToUpper()}";

        var chuoiIdNguoiDung = IdNguoiDungGuidHoacNull;
        if (chuoiIdNguoiDung.HasValue)
            donUng.NguoiDungId = chuoiIdNguoiDung.Value;

        await _donViCongViec.DonUngs.ThemAsync(donUng);
        await _donViCongViec.LuuThayDoiAsync();

        try
        {
            await _dichVuEmail.GuiDaNopDonAsync(
                donUng.EmailNguoiNop, donUng.TenNguoiNop, donUng.MaTheoDoi, dichVu.Ten);
        }
        catch (Exception ex) { _nhatKy.LogWarning(ex, "Gửi email xác nhận nộp đơn thất bại cho {Email}", donUng.EmailNguoiNop); }

        return Ok(PhanHoiApi<object>.ThanhCongKetQua(new { donUng.Id, donUng.MaTheoDoi },
            "Nộp đơn thành công. Vui lòng lưu mã theo dõi của bạn."));
    }

    private static readonly string[] DuoiTepChoPhep =
        { ".jpg", ".jpeg", ".png", ".gif", ".webp", ".pdf", ".doc", ".docx", ".xls", ".xlsx" };

    [HttpPost("{id:guid}/upload-files")]
    [Authorize]
    [EnableRateLimiting("file-upload")]
    [RequestSizeLimit(20_000_000)]
    public async Task<IActionResult> TaiLenTepTin(Guid id, [FromForm] List<IFormFile> cacTep)
    {
        var donUng = await _donViCongViec.DonUngs.LayTheoIdAsync(id);
        if (donUng == null)
            return NotFound(PhanHoiApi.ThatBai("Không tìm thấy đơn ứng"));

        var idNguoiDung = IdNguoiDungGuidHoacNull;
        if (donUng.NguoiDungId.HasValue && donUng.NguoiDungId != idNguoiDung)
            return StatusCode(403, PhanHoiApi.ThatBai("Bạn không có quyền tải tệp cho đơn ứng này"));
        if (!donUng.NguoiDungId.HasValue)
            return StatusCode(403, PhanHoiApi.ThatBai("Không thể tải tệp cho đơn ứng ẩn danh"));

        // Validate all file extensions first before uploading any
        foreach (var tep in cacTep.Where(f => f.Length > 0))
        {
            var duoiTep = Path.GetExtension(tep.FileName).ToLowerInvariant();
            if (!DuoiTepChoPhep.Contains(duoiTep))
                return BadRequest(PhanHoiApi.ThatBai($"Định dạng tệp '{duoiTep}' không được phép"));
        }

        foreach (var tep in cacTep.Where(f => f.Length > 0))
        {
            using var luongTep = tep.OpenReadStream();
            var tenTepAnToan = Path.GetFileName(tep.FileName);
            var duongDan = await _luuTruTep.LuuTepAsync(luongTep, tenTepAnToan, tep.ContentType, "uploads/applications");
            await _donViCongViec.TepDonUngs.ThemAsync(new TepDonUng
            {
                DonUngId = id,
                TenTep = tenTepAnToan,
                DuongDanTep = duongDan,
                UrlTep = _luuTruTep.LayUrlTep(duongDan),
                KichThuocTep = tep.Length,
                LoaiNoiDung = tep.ContentType
            });
        }
        await _donViCongViec.LuuThayDoiAsync();
        return Ok(PhanHoiApi.ThanhCongKetQua("Tải tệp lên thành công"));
    }

    [HttpGet("track/{maTheoDoi}")]
    [EnableRateLimiting("application-track")]
    public async Task<IActionResult> TheoDoi(string maTheoDoi, [FromQuery] string? emailNguoiNop)
    {
        if (string.IsNullOrWhiteSpace(maTheoDoi) || string.IsNullOrWhiteSpace(emailNguoiNop))
            return BadRequest(PhanHoiApi.ThatBai("Mã theo dõi và email là bắt buộc"));

        var donUng = await _donViCongViec.DonUngs.TruyVan().AsNoTracking()
            .Include(a => a.DichVu)
            .Include(a => a.DanhSachTep)
            .FirstOrDefaultAsync(a => a.MaTheoDoi == maTheoDoi
                && a.EmailNguoiNop.ToLower() == emailNguoiNop.Trim().ToLower());

        if (donUng == null)
            return NotFound(PhanHoiApi.ThatBai("Không tìm thấy đơn ứng hoặc thông tin không khớp"));

        return Ok(PhanHoiApi<DonUngDto>.ThanhCongKetQua(_anhXa.Map<DonUngDto>(donUng)));
    }

    [HttpGet("{id:guid}")]
    [Authorize(Roles = "Admin,Editor")]
    public async Task<IActionResult> LayTheoId(Guid id)
    {
        var donUng = await _donViCongViec.DonUngs.TruyVan().AsNoTracking()
            .Include(a => a.DichVu)
            .Include(a => a.DanhSachTep)
            .FirstOrDefaultAsync(a => a.Id == id);
        if (donUng == null)
            return NotFound(PhanHoiApi.ThatBai("Không tìm thấy đơn ứng"));

        return Ok(PhanHoiApi<DonUngDto>.ThanhCongKetQua(_anhXa.Map<DonUngDto>(donUng)));
    }

    [HttpGet("{id:guid}/history")]
    [Authorize(Roles = "Admin,Editor")]
    public async Task<IActionResult> LayLichSu(Guid id)
    {
        var lichSu = await _donViCongViec.LichSuTrangThais.TruyVan().AsNoTracking()
            .Include(h => h.NguoiThayDoi)
            .Where(h => h.DonUngId == id)
            .OrderBy(h => h.NgayTao)
            .ToListAsync();
        return Ok(PhanHoiApi<List<LichSuTrangThaiDonUngDto>>.ThanhCongKetQua(
            _anhXa.Map<List<LichSuTrangThaiDonUngDto>>(lichSu)));
    }

    [HttpGet]
    [Authorize(Roles = "Admin,Editor")]
    public async Task<IActionResult> LayTatCa([FromQuery] TrangThaiDonUng? trangThai,
        [FromQuery] Guid? dichVuId, [FromQuery] string? timKiem,
        [FromQuery] DateTime? tuNgay, [FromQuery] DateTime? denNgay,
        [FromQuery] int trang = 1, [FromQuery] int kichThuocTrang = 20)
    {
        (trang, kichThuocTrang) = ChuanHoaPhanTrang(trang, kichThuocTrang);

        IQueryable<DonUngDichVu> truyVan = _donViCongViec.DonUngs.TruyVan().AsNoTracking()
            .Include(a => a.DichVu);

        if (trangThai.HasValue)
            truyVan = truyVan.Where(a => a.TrangThai == trangThai);
        if (dichVuId.HasValue)
            truyVan = truyVan.Where(a => a.DichVuId == dichVuId);
        if (!string.IsNullOrEmpty(timKiem))
            truyVan = truyVan.Where(a => a.TenNguoiNop.Contains(timKiem)
                || a.MaTheoDoi.Contains(timKiem)
                || a.DienThoaiNguoiNop.Contains(timKiem));
        if (tuNgay.HasValue)
            truyVan = truyVan.Where(a => a.NgayNop >= tuNgay.Value.ToUniversalTime());
        if (denNgay.HasValue)
            truyVan = truyVan.Where(a => a.NgayNop <= denNgay.Value.ToUniversalTime().AddDays(1));

        var ketQua = await truyVan
            .OrderByDescending(a => a.NgayNop)
            .PhanTrangAsync<DonUngDichVu, DonUngDto>(trang, kichThuocTrang, _anhXa);

        return Ok(PhanHoiApi<KetQuaPhanTrang<DonUngDto>>.ThanhCongKetQua(ketQua));
    }

    [HttpPatch("{id:guid}/status")]
    [Authorize(Roles = "Admin,Editor")]
    public async Task<IActionResult> CapNhatTrangThai(Guid id, [FromBody] CapNhatTrangThaiDonUngDto dto)
    {
        var donUng = await _donViCongViec.DonUngs.TruyVan()
            .Include(a => a.DichVu)
            .FirstOrDefaultAsync(a => a.Id == id);
        if (donUng == null)
            return NotFound(PhanHoiApi.ThatBai("Không tìm thấy đơn ứng"));

        var nguoiXuLyId = IdNguoiDungHienTai;

        await _donViCongViec.LichSuTrangThais.ThemAsync(new LichSuTrangThaiDonUng
        {
            DonUngId = id,
            TrangThaiCu = donUng.TrangThai,
            TrangThaiMoi = dto.TrangThai,
            GhiChu = dto.GhiChuNguoiXuLy,
            NguoiThayDoiId = nguoiXuLyId
        });

        donUng.TrangThai = dto.TrangThai;
        donUng.GhiChuNguoiXuLy = dto.GhiChuNguoiXuLy;
        donUng.NgayXuLy = DateTime.UtcNow;
        donUng.NguoiXuLyId = nguoiXuLyId;
        donUng.NgayCapNhat = DateTime.UtcNow;
        _donViCongViec.DonUngs.CapNhat(donUng);
        await _donViCongViec.LuuThayDoiAsync();

        try
        {
            await _dichVuEmail.GuiTrangThaiDonThayDoiAsync(
                donUng.EmailNguoiNop, donUng.TenNguoiNop, donUng.MaTheoDoi,
                donUng.DichVu.Ten, dto.TrangThai.ToString(), dto.GhiChuNguoiXuLy);
        }
        catch (Exception ex) { _nhatKy.LogWarning(ex, "Gửi email cập nhật trạng thái thất bại cho {Email}", donUng.EmailNguoiNop); }

        return Ok(PhanHoiApi.ThanhCongKetQua("Cập nhật trạng thái đơn ứng thành công"));
    }
}
