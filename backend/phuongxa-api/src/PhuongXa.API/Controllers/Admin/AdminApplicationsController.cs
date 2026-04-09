using System.Linq;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PhuongXa.API.TienIch;
using PhuongXa.Application.CacGiaoDien;
using PhuongXa.Application.Chung;
using PhuongXa.Application.DTOs.DonUng;
using PhuongXa.Domain.CacKieuLietKe;
using PhuongXa.Domain.CacThucThe;
using PhuongXa.API.Controllers;

namespace PhuongXa.API.Controllers.Admin;
[Route("api/admin/applications")]
public class AdminApplicationsController : BaseApiController
{
    private static readonly HashSet<string> DuoiTepChoPhep = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".pdf", ".doc", ".docx", ".xls", ".xlsx"];
    private readonly IDonViCongViec _donViCongViec;
    private readonly IMapper _anhXa;
    private readonly IDichVuEmail _dichVuEmail;
    private readonly IDichVuLuuTruTep _dichVuLuuTruTep;
    private readonly IDichVuThanhToanVnPay _dichVuThanhToanVnPay;
    private readonly IDichVuXuatPhieuHoSoPdf _dichVuXuatPhieuHoSoPdf;
    private readonly UserManager<NguoiDung> _quanLyNguoiDung;
    public AdminApplicationsController(IDonViCongViec donViCongViec, IMapper anhXa, IDichVuEmail dichVuEmail, IDichVuLuuTruTep dichVuLuuTruTep, IDichVuThanhToanVnPay dichVuThanhToanVnPay, IDichVuXuatPhieuHoSoPdf dichVuXuatPhieuHoSoPdf, UserManager<NguoiDung> quanLyNguoiDung)
    {
        _donViCongViec = donViCongViec;
        _anhXa = anhXa;
        _dichVuEmail = dichVuEmail;
        _dichVuLuuTruTep = dichVuLuuTruTep;
        _dichVuThanhToanVnPay = dichVuThanhToanVnPay;
        _dichVuXuatPhieuHoSoPdf = dichVuXuatPhieuHoSoPdf;
        _quanLyNguoiDung = quanLyNguoiDung;
    }

    [HttpPost("{id:guid}/upload")]
    [Authorize]
    [RequestSizeLimit(20_000_000)]
    public async Task<IActionResult> TaiTepLenHoSo(Guid id, [FromForm] TaiTepDonUngRequest yeuCau, CancellationToken ct)
    {
        var tep = yeuCau.Tep;
        if (tep is null || tep.Length == 0)
            return BadRequest(PhanHoiApi.ThatBai("Vui long chon file de tai len"));
        var duoiTep = Path.GetExtension(tep.FileName).ToLowerInvariant();
        if (!DuoiTepChoPhep.Contains(duoiTep))
            return BadRequest(PhanHoiApi.ThatBai($"Dinh dang file '{duoiTep}' khong duoc phep"));
        var donUng = await LayDonUngDayDuAsync(id, ct);
        if (donUng is null)
            return NotFound(PhanHoiApi.ThatBai("Khong tim thay ho so"));
        if (!CoQuyenTruyCapHoSo(donUng))
            return StatusCode(StatusCodes.Status403Forbidden, PhanHoiApi.ThatBai("Ban khong co quyen tai file cho ho so nay"));
        if (donUng.NguoiDungId is null && !VaiTroTienIch.LaQuanTriHoacBienTap(User))
            return StatusCode(StatusCodes.Status403Forbidden, PhanHoiApi.ThatBai("Khong the tai file cho ho so an danh"));
        await using var luong = tep.OpenReadStream();
        var duongDanTep = await _dichVuLuuTruTep.LuuTepAsync(luong, tep.FileName, tep.ContentType ?? "application/octet-stream", "uploads/applications");
        var tepDonUng = new TepDonUng
        {
            DonUngId = donUng.Id,
            TenTep = tep.FileName,
            DuongDanTep = duongDanTep,
            UrlTep = _dichVuLuuTruTep.LayUrlTep(duongDanTep),
            KichThuocTep = tep.Length,
            LoaiNoiDung = tep.ContentType
        };
        await _donViCongViec.TepDonUngs.ThemAsync(tepDonUng, ct);
        await _donViCongViec.LuuThayDoiAsync(ct);
        return Ok(PhanHoiApi<object>.ThanhCongKetQua(new { tepDonUng.Id, tepDonUng.TenTep, tepDonUng.UrlTep }, "Tai file len thanh cong"));
    }

    [HttpPost("{id:guid}/upload-files")]
    [Authorize]
    [RequestSizeLimit(20_000_000)]
    public async Task<IActionResult> TaiNhieuTepLenHoSo(Guid id, [FromForm] List<IFormFile> cacTep, CancellationToken ct)
    {
        if (cacTep.Count == 0 || cacTep.All(x => x.Length == 0))
            return BadRequest(PhanHoiApi.ThatBai("Vui long chon file de tai len"));
        var donUng = await LayDonUngDayDuAsync(id, ct);
        if (donUng is null)
            return NotFound(PhanHoiApi.ThatBai("Khong tim thay ho so"));
        if (!CoQuyenTruyCapHoSo(donUng))
            return StatusCode(StatusCodes.Status403Forbidden, PhanHoiApi.ThatBai("Ban khong co quyen tai file cho ho so nay"));
        if (donUng.NguoiDungId is null && !VaiTroTienIch.LaQuanTriHoacBienTap(User))
            return StatusCode(StatusCodes.Status403Forbidden, PhanHoiApi.ThatBai("Khong the tai file cho ho so an danh"));
        var tepDaTaiLen = new List<object>();
        foreach (var tep in cacTep.Where(x => x.Length > 0))
        {
            var duoiTep = Path.GetExtension(tep.FileName).ToLowerInvariant();
            if (!DuoiTepChoPhep.Contains(duoiTep))
                return BadRequest(PhanHoiApi.ThatBai($"Dinh dang file '{duoiTep}' khong duoc phep"));
            await using var luong = tep.OpenReadStream();
            var duongDanTep = await _dichVuLuuTruTep.LuuTepAsync(luong, tep.FileName, tep.ContentType ?? "application/octet-stream", "uploads/applications");
            var tepDonUng = new TepDonUng
            {
                DonUngId = donUng.Id,
                TenTep = tep.FileName,
                DuongDanTep = duongDanTep,
                UrlTep = _dichVuLuuTruTep.LayUrlTep(duongDanTep),
                KichThuocTep = tep.Length,
                LoaiNoiDung = tep.ContentType
            };
            await _donViCongViec.TepDonUngs.ThemAsync(tepDonUng, ct);
            tepDaTaiLen.Add(new { tepDonUng.Id, tepDonUng.TenTep, tepDonUng.UrlTep });
        }

        await _donViCongViec.LuuThayDoiAsync(ct);
        return Ok(PhanHoiApi<object>.ThanhCongKetQua(new { tepDaTaiLen }, "Tai file len thanh cong"));
    }

    private async Task<IActionResult> TraCuuNoiBoAsync(string maTheoDoi, string email, CancellationToken ct)
    {
        var maTheoDoiDaChuanHoa = maTheoDoi.Trim();
        var emailDaChuanHoa = email.Trim();
        if (string.IsNullOrWhiteSpace(maTheoDoiDaChuanHoa) || string.IsNullOrWhiteSpace(emailDaChuanHoa))
            return BadRequest(PhanHoiApi.ThatBai("Can cung cap ma tra cuu va email"));
        var donUng = await _donViCongViec.DonUngs.TruyVan().AsNoTracking().Include(x => x.DichVu).Include(x => x.PhongBanHienTai).Include(x => x.DanhSachTep).FirstOrDefaultAsync(x => x.MaTheoDoi == maTheoDoiDaChuanHoa && x.EmailNguoiNop == emailDaChuanHoa, ct);
        if (donUng is null)
            return NotFound(PhanHoiApi.ThatBai("Khong tim thay ho so hoac thong tin khong khop"));
        return Ok(PhanHoiApi<DonUngDto>.ThanhCongKetQua(_anhXa.Map<DonUngDto>(donUng)));
    }

    [HttpGet]
    [Authorize]
    public async Task<IActionResult> LayDanhSach([FromQuery] TrangThaiDonUng? trangThai, [FromQuery] string? tuKhoa, [FromQuery] int trang = 1, [FromQuery] int kichThuocTrang = 20, CancellationToken ct = default)
    {
        (trang, kichThuocTrang) = ChuanHoaPhanTrang(trang, kichThuocTrang, 100);
        var truyVan = _donViCongViec.DonUngs.TruyVan().AsNoTracking().Include(x => x.DichVu).Include(x => x.PhongBanHienTai).Include(x => x.DanhSachTep).AsQueryable();
        if (!VaiTroTienIch.LaQuanTriHoacBienTap(User))
            truyVan = truyVan.Where(x => x.NguoiDungId == IdNguoiDungHienTai);
        if (trangThai.HasValue)
            truyVan = truyVan.Where(x => x.TrangThai == trangThai.Value);
        if (!string.IsNullOrWhiteSpace(tuKhoa))
        {
            var khoa = tuKhoa.Trim().ToLower();
            truyVan = truyVan.Where(x => x.MaTheoDoi.ToLower().Contains(khoa) || x.TenNguoiNop.ToLower().Contains(khoa) || x.EmailNguoiNop.ToLower().Contains(khoa));
        }

        var tongSo = await truyVan.CountAsync(ct);
        var danhSach = await truyVan.OrderByDescending(x => x.NgayNop).Skip((trang - 1) * kichThuocTrang).Take(kichThuocTrang).ToListAsync(ct);
        var duLieu = _anhXa.Map<List<DonUngDto>>(danhSach);
        return Ok(PhanHoiApi<KetQuaPhanTrang<DonUngDto>>.ThanhCongKetQua(new KetQuaPhanTrang<DonUngDto> { DanhSach = duLieu, TongSo = tongSo, Trang = trang, KichThuocTrang = kichThuocTrang }));
    }

    [HttpGet("{id:guid}")]
    [Authorize]
    public async Task<IActionResult> LayTheoId(Guid id, CancellationToken ct)
    {
        var donUng = await LayDonUngDayDuAsync(id, ct);
        if (donUng is null)
            return NotFound(PhanHoiApi.ThatBai("Khong tim thay ho so"));
        if (!CoQuyenTruyCapHoSo(donUng))
            return StatusCode(StatusCodes.Status403Forbidden, PhanHoiApi.ThatBai("Ban khong co quyen truy cap ho so nay"));
        return Ok(PhanHoiApi<DonUngDto>.ThanhCongKetQua(_anhXa.Map<DonUngDto>(donUng)));
    }

    [HttpGet("{id:guid}/history")]
    [Authorize(Roles = HangSoPhanQuyen.QuanTriHoacBienTap)]
    public async Task<IActionResult> LayLichSu(Guid id, CancellationToken ct)
    {
        var tonTaiHoSo = await _donViCongViec.DonUngs.TruyVan().AsNoTracking().AnyAsync(x => x.Id == id, ct);
        if (!tonTaiHoSo)
            return NotFound(PhanHoiApi.ThatBai("Khong tim thay ho so"));
        var lichSu = await _donViCongViec.LichSuTrangThais.TruyVan().AsNoTracking().Include(x => x.NguoiThayDoi).Where(x => x.DonUngId == id).OrderBy(x => x.NgayTao).ToListAsync(ct);
        return Ok(PhanHoiApi<List<LichSuTrangThaiDonUngDto>>.ThanhCongKetQua(_anhXa.Map<List<LichSuTrangThaiDonUngDto>>(lichSu)));
    }

    [HttpPatch("{id:guid}/status")]
    [Authorize(Roles = HangSoPhanQuyen.QuanTriHoacBienTap)]
    public async Task<IActionResult> CapNhatTrangThai(Guid id, [FromBody] CapNhatTrangThaiDonUngDto yeuCau, CancellationToken ct)
    {
        var donUng = await LayDonUngDayDuAsync(id, ct);
        if (donUng is null)
            return NotFound(PhanHoiApi.ThatBai("Khong tim thay ho so"));
        var trangThaiCu = donUng.TrangThai;
        donUng.TrangThai = yeuCau.TrangThai;
        donUng.GhiChuNguoiXuLy = yeuCau.GhiChuNguoiXuLy;
        donUng.NguoiXuLyId = IdNguoiDungHienTai;
        donUng.NgayCapNhat = DateTime.UtcNow;
        if (yeuCau.TrangThai is TrangThaiDonUng.HoanThanh or TrangThaiDonUng.TuChoi)
            donUng.NgayXuLy = DateTime.UtcNow;
        _donViCongViec.DonUngs.CapNhat(donUng);
        await _donViCongViec.LichSuTrangThais.ThemAsync(new LichSuTrangThaiDonUng { DonUngId = donUng.Id, TrangThaiCu = trangThaiCu, TrangThaiMoi = donUng.TrangThai, GhiChu = yeuCau.GhiChuNguoiXuLy, NguoiThayDoiId = IdNguoiDungHienTai }, ct);
        if (donUng.NguoiDungId.HasValue)
        {
            await _donViCongViec.ThongBaos.ThemAsync(new ThongBao { NguoiDungId = donUng.NguoiDungId.Value, TieuDe = $"Ho so {donUng.MaTheoDoi} da thay doi trang thai", NoiDung = $"Trang thai moi: {donUng.TrangThai}", LienKet = $"/ho-so/{donUng.Id}", Loai = LoaiThongBao.TrangThaiDonUngThayDoi, DaDoc = false }, ct);
        }

        await _donViCongViec.LuuThayDoiAsync(ct);
        _ = Task.Run(async () =>
        {
            try
            {
                await _dichVuEmail.GuiTrangThaiDonThayDoiAsync(donUng.EmailNguoiNop, donUng.TenNguoiNop, donUng.MaTheoDoi, donUng.DichVu.Ten, donUng.TrangThai.ToString(), yeuCau.GhiChuNguoiXuLy);
            }
            catch
            {
            // Bo qua loi gui email de khong anh huong cap nhat trang thai.
            }
        }, CancellationToken.None);
        return Ok(PhanHoiApi.ThanhCongKetQua("Cap nhat trang thai ho so thanh cong"));
    }

    [HttpPost("{id:guid}/assign")]
    [Authorize(Roles = HangSoPhanQuyen.QuanTriHoacBienTap)]
    public async Task<IActionResult> PhanCongXuLy(Guid id, [FromBody] PhanCongXuLyDonUngDto yeuCau, CancellationToken ct)
    {
        var donUng = await _donViCongViec.DonUngs.LayTheoIdAsync(id, ct);
        if (donUng is null)
            return NotFound(PhanHoiApi.ThatBai("Khong tim thay ho so"));
        if (!yeuCau.PhongBanId.HasValue)
            return BadRequest(PhanHoiApi.ThatBai("Phong ban khong hop le"));
        var phongBanId = yeuCau.PhongBanId.Value;
        var phongBan = await _donViCongViec.PhongBans.TruyVan().FirstOrDefaultAsync(x => x.Id == phongBanId && x.DangHoatDong, ct);
        if (phongBan is null)
            return BadRequest(PhanHoiApi.ThatBai("Phong ban khong ton tai hoac da ngung hoat dong"));
        var phongBanCuId = donUng.PhongBanHienTaiId;
        donUng.PhongBanHienTaiId = phongBanId;
        donUng.NguoiXuLyId = yeuCau.NguoiXuLyId;
        donUng.HanXuLy = yeuCau.HanXuLy;
        donUng.NgayCapNhat = DateTime.UtcNow;
        _donViCongViec.DonUngs.CapNhat(donUng);
        await _donViCongViec.LichSuPhanCongDonUngs.ThemAsync(new LichSuPhanCongDonUng { DonUngId = donUng.Id, PhongBanTuId = phongBanCuId, PhongBanDenId = phongBanId, NguoiXuLyId = yeuCau.NguoiXuLyId, HanXuLy = yeuCau.HanXuLy, GhiChu = yeuCau.GhiChu, NguoiThayDoiId = IdNguoiDungHienTai }, ct);
        await _donViCongViec.LuuThayDoiAsync(ct);
        return Ok(PhanHoiApi.ThanhCongKetQua("Phan cong xu ly ho so thanh cong"));
    }

    [HttpPost("{id:guid}/payment-link")]
    [Authorize]
    public async Task<IActionResult> TaoLienKetThanhToan(Guid id, [FromBody] TaoLienKetThanhToanLePhiDto? yeuCau, CancellationToken ct)
    {
        var donUng = await LayDonUngDayDuAsync(id, ct);
        if (donUng is null)
            return NotFound(PhanHoiApi.ThatBai("Khong tim thay ho so"));
        if (!CoQuyenTruyCapHoSo(donUng))
            return StatusCode(StatusCodes.Status403Forbidden, PhanHoiApi.ThatBai("Ban khong co quyen truy cap ho so nay"));
        var ketQua = await _dichVuThanhToanVnPay.TaoLienKetThanhToanAsync(donUng, HttpContext.Connection.RemoteIpAddress?.ToString(), ct);
        if (!string.IsNullOrWhiteSpace(ketQua.MaThamChieuThanhToan))
        {
            donUng.MaThamChieuThanhToan = ketQua.MaThamChieuThanhToan;
            _donViCongViec.DonUngs.CapNhat(donUng);
            await _donViCongViec.LuuThayDoiAsync(ct);
        }

        return Ok(PhanHoiApi<KetQuaTaoLienKetThanhToanLePhiDto>.ThanhCongKetQua(ketQua, "Tao lien ket thanh toan thanh cong"));
    }

    [HttpGet("{id:guid}/receipt")]
    [Authorize]
    public async Task<IActionResult> XuatPhieuHoSo(Guid id, [FromQuery] XuatPhieuHoSoPdfQueryDto? yeuCau, CancellationToken ct)
    {
        var donUng = await LayDonUngDayDuAsync(id, ct);
        if (donUng is null)
            return NotFound(PhanHoiApi.ThatBai("Khong tim thay ho so"));
        if (!CoQuyenTruyCapHoSo(donUng))
            return StatusCode(StatusCodes.Status403Forbidden, PhanHoiApi.ThatBai("Ban khong co quyen truy cap ho so nay"));
        var tepPdf = await _dichVuXuatPhieuHoSoPdf.XuatPhieuAsync(donUng, ct);
        return File(tepPdf, "application/pdf", $"phieu-ho-so-{donUng.MaTheoDoi}.pdf");
    }

    private bool CoQuyenTruyCapHoSo(DonUngDichVu donUng)
    {
        if (VaiTroTienIch.LaQuanTriHoacBienTap(User))
            return true;
        return donUng.NguoiDungId.HasValue && donUng.NguoiDungId == IdNguoiDungGuidHoacNull;
    }

    private async Task<DonUngDichVu?> LayDonUngDayDuAsync(Guid id, CancellationToken ct)
    {
        return await _donViCongViec.DonUngs.TruyVan().Include(x => x.DichVu).Include(x => x.PhongBanHienTai).Include(x => x.DanhSachTep).FirstOrDefaultAsync(x => x.Id == id, ct);
    }

    private async Task<string> TaoMaTheoDoiDuyNhatAsync(CancellationToken ct)
    {
        var boDemThu = 0;
        while (true)
        {
            boDemThu++;
            var maTheoDoi = $"HS{DateTime.UtcNow:yyyyMMdd}{Random.Shared.Next(100000, 999999)}";
            var daTonTai = await _donViCongViec.DonUngs.TruyVan().AnyAsync(x => x.MaTheoDoi == maTheoDoi, ct);
            if (!daTonTai)
                return maTheoDoi;
            if (boDemThu >= 10)
                throw new InvalidOperationException("Khong the tao ma theo doi duy nhat");
        }
    }
}

public sealed class TaiTepDonUngRequest
{
    public IFormFile Tep { get; set; } = null!;
}



