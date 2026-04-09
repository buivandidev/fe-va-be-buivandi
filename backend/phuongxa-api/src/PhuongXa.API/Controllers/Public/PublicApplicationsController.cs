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

namespace PhuongXa.API.Controllers.Public;
[Route("api/public/applications")]
public class PublicApplicationsController : BaseApiController
{
    private static readonly HashSet<string> DuoiTepChoPhep = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".pdf", ".doc", ".docx", ".xls", ".xlsx"];
    private readonly IDonViCongViec _donViCongViec;
    private readonly IMapper _anhXa;
    private readonly IDichVuEmail _dichVuEmail;
    private readonly IDichVuLuuTruTep _dichVuLuuTruTep;
    private readonly IDichVuThanhToanVnPay _dichVuThanhToanVnPay;
    private readonly IDichVuXuatPhieuHoSoPdf _dichVuXuatPhieuHoSoPdf;
    private readonly UserManager<NguoiDung> _quanLyNguoiDung;
    private readonly string _duongDanFrontend;
    public PublicApplicationsController(IDonViCongViec donViCongViec, IMapper anhXa, IDichVuEmail dichVuEmail, IDichVuLuuTruTep dichVuLuuTruTep, IDichVuThanhToanVnPay dichVuThanhToanVnPay, IDichVuXuatPhieuHoSoPdf dichVuXuatPhieuHoSoPdf, UserManager<NguoiDung> quanLyNguoiDung, IConfiguration cauHinh)
    {
        _donViCongViec = donViCongViec;
        _anhXa = anhXa;
        _dichVuEmail = dichVuEmail;
        _dichVuLuuTruTep = dichVuLuuTruTep;
        _dichVuThanhToanVnPay = dichVuThanhToanVnPay;
        _dichVuXuatPhieuHoSoPdf = dichVuXuatPhieuHoSoPdf;
        _quanLyNguoiDung = quanLyNguoiDung;
        _duongDanFrontend = cauHinh["Frontend:BaseUrl"]
            ?? throw new InvalidOperationException("Thiếu cấu hình bắt buộc: Frontend:BaseUrl");
    }

    [HttpPost("submit")]
    [AllowAnonymous]
    public async Task<IActionResult> NopHoSo([FromBody] NopDonUngDto yeuCau, CancellationToken ct)
    {
        var dichVu = await _donViCongViec.DichVus.TruyVan().AsNoTracking().FirstOrDefaultAsync(x => x.Id == yeuCau.DichVuId && x.DangHoatDong, ct);
        if (dichVu is null)
            return BadRequest(PhanHoiApi.ThatBai("Dich vu khong ton tai hoac da ngung hoat dong"));
        var donUng = _anhXa.Map<DonUngDichVu>(yeuCau);
        donUng.MaTheoDoi = await TaoMaTheoDoiDuyNhatAsync(ct);
        donUng.NguoiDungId = IdNguoiDungGuidHoacNull;
        donUng.TrangThai = TrangThaiDonUng.ChoXuLy;
        donUng.NgayNop = DateTime.UtcNow;
        donUng.LePhiTaiThoiDiemNop = dichVu.LePhi ?? 0m;
        donUng.TrangThaiThanhToanLePhi = donUng.LePhiTaiThoiDiemNop > 0 ? TrangThaiThanhToanLePhi.ChoThanhToan : TrangThaiThanhToanLePhi.KhongYeuCau;
        if (dichVu.SoNgayXuLy > 0)
        {
            donUng.HanXuLy = DateTime.UtcNow.AddDays(dichVu.SoNgayXuLy);
            donUng.NgayHenTra = donUng.HanXuLy;
        }

        await _donViCongViec.DonUngs.ThemAsync(donUng, ct);
        var nguoiThayDoiId = donUng.NguoiDungId;
        if (!nguoiThayDoiId.HasValue)
        {
            nguoiThayDoiId = await _quanLyNguoiDung.Users.AsNoTracking().OrderBy(x => x.NgayTao).Select(x => (Guid? )x.Id).FirstOrDefaultAsync(ct);
            if (!nguoiThayDoiId.HasValue)
                return StatusCode(StatusCodes.Status500InternalServerError, PhanHoiApi.ThatBai("Khong the tiep nhan ho so vi chua co tai khoan he thong de ghi nhan nhat ky"));
        }

        await _donViCongViec.LichSuTrangThais.ThemAsync(new LichSuTrangThaiDonUng { DonUngId = donUng.Id, TrangThaiCu = TrangThaiDonUng.ChoXuLy, TrangThaiMoi = TrangThaiDonUng.ChoXuLy, GhiChu = "Tiep nhan ho so", NguoiThayDoiId = nguoiThayDoiId.Value }, ct);
        await _donViCongViec.LuuThayDoiAsync(ct);
        _ = Task.Run(async () =>
        {
            try
            {
                await _dichVuEmail.GuiDaNopDonAsync(donUng.EmailNguoiNop, donUng.TenNguoiNop, donUng.MaTheoDoi, dichVu.Ten);
            }
            catch
            {
            // Khong chan luong nop ho so neu gui email that bai.
            }
        }, CancellationToken.None);
        var ketQua = await LayDonUngDayDuAsync(donUng.Id, ct);
        var dto = _anhXa.Map<DonUngDto>(ketQua);
        return Ok(PhanHoiApi<DonUngDto>.ThanhCongKetQua(dto, "Nop ho so thanh cong. Vui long luu ma tra cuu cua ban."));
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

    [HttpGet("track")]
    [AllowAnonymous]
    public async Task<IActionResult> TraCuu([FromQuery] string maTheoDoi, [FromQuery] string email, CancellationToken ct)
    {
        return await TraCuuNoiBoAsync(maTheoDoi, email, ct);
    }

    [HttpGet("track/{maTheoDoi}")]
    [AllowAnonymous]
    public async Task<IActionResult> TraCuuTuongThich([FromRoute] string maTheoDoi, [FromQuery] string? emailNguoiNop, [FromQuery] string? email, CancellationToken ct)
    {
        var emailTraCuu = string.IsNullOrWhiteSpace(emailNguoiNop) ? email : emailNguoiNop;
        return await TraCuuNoiBoAsync(maTheoDoi, emailTraCuu ?? string.Empty, ct);
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
        
        // DEBUG: Log tổng số hồ sơ trước khi filter
        var tongSoTruocFilter = await _donViCongViec.DonUngs.TruyVan().AsNoTracking().CountAsync(ct);
        Console.WriteLine($"[DEBUG] Tổng số hồ sơ trong DB: {tongSoTruocFilter}");
        
        // SECURITY FIX: Đã tắt test mode - chỉ hiển thị hồ sơ của user hiện tại
        if (!VaiTroTienIch.LaQuanTriHoacBienTap(User))
        {
            var idNguoiDung = IdNguoiDungHienTai;
            var emailNguoiDung = await _quanLyNguoiDung.Users
                .AsNoTracking()
                .Where(x => x.Id == idNguoiDung)
                .Select(x => x.Email)
                .FirstOrDefaultAsync(ct);

            Console.WriteLine($"[DEBUG] User ID: {idNguoiDung}");
            Console.WriteLine($"[DEBUG] User Email: {emailNguoiDung}");

            if (!string.IsNullOrWhiteSpace(emailNguoiDung))
            {
                var emailDaChuanHoa = emailNguoiDung.Trim().ToLower();
                Console.WriteLine($"[DEBUG] Email chuẩn hóa: {emailDaChuanHoa}");
                
                // DEBUG: Kiểm tra hồ sơ có email khớp
                var hoSoCoEmailKhop = await _donViCongViec.DonUngs.TruyVan()
                    .AsNoTracking()
                    .Where(x => x.EmailNguoiNop != null && x.EmailNguoiNop.ToLower() == emailDaChuanHoa)
                    .CountAsync(ct);
                Console.WriteLine($"[DEBUG] Số hồ sơ có email khớp: {hoSoCoEmailKhop}");
                
                // DEBUG: Kiểm tra hồ sơ có userId khớp
                var hoSoCoUserIdKhop = await _donViCongViec.DonUngs.TruyVan()
                    .AsNoTracking()
                    .Where(x => x.NguoiDungId == idNguoiDung)
                    .CountAsync(ct);
                Console.WriteLine($"[DEBUG] Số hồ sơ có userId khớp: {hoSoCoUserIdKhop}");
                
                truyVan = truyVan.Where(x =>
                    x.NguoiDungId == idNguoiDung
                    || (x.NguoiDungId == null && x.EmailNguoiNop != null && x.EmailNguoiNop.ToLower() == emailDaChuanHoa));
            }
            else
            {
                truyVan = truyVan.Where(x => x.NguoiDungId == idNguoiDung);
            }
        }
        
        if (trangThai.HasValue)
            truyVan = truyVan.Where(x => x.TrangThai == trangThai.Value);
        if (!string.IsNullOrWhiteSpace(tuKhoa))
        {
            var khoa = tuKhoa.Trim().ToLower();
            truyVan = truyVan.Where(x => x.MaTheoDoi.ToLower().Contains(khoa) || x.TenNguoiNop.ToLower().Contains(khoa) || x.EmailNguoiNop.ToLower().Contains(khoa));
        }

        var tongSo = await truyVan.CountAsync(ct);
        Console.WriteLine($"[DEBUG] Tổng số sau filter: {tongSo}");
        
        var danhSach = await truyVan.OrderByDescending(x => x.NgayNop).Skip((trang - 1) * kichThuocTrang).Take(kichThuocTrang).ToListAsync(ct);
        
        // DEBUG: Log thông tin hồ sơ
        foreach (var hs in danhSach.Take(3))
        {
            Console.WriteLine($"[DEBUG] Hồ sơ: {hs.MaTheoDoi}, Email: {hs.EmailNguoiNop}, UserId: {hs.NguoiDungId}");
        }
        
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


    [HttpGet("payments/vnpay/return")]
    public async Task<IActionResult> XyLyKetQuaVnPay(CancellationToken ct)
    {
        var thamSo = Request.Query.ToDictionary(k => k.Key, v => (string?)v.Value.ToString());
        if (!_dichVuThanhToanVnPay.KiemTraPhanHoiHopLe(thamSo))
            return BadRequest("Chu ky khong hop le hoac thieu tham so.");

        var maThamChieu = thamSo["vnp_TxnRef"];
        var maPhanHoi = thamSo.GetValueOrDefault("vnp_ResponseCode");

        if (string.IsNullOrWhiteSpace(maThamChieu)) return BadRequest("Khong co ma tham chieu.");

        var donUng = await _donViCongViec.DonUngs.TruyVan()
            .FirstOrDefaultAsync(x => x.MaThamChieuThanhToan == maThamChieu || x.MaTheoDoi == maThamChieu, ct);

        if (donUng == null)
            return NotFound("Khong tim thay ho so");

        if (maPhanHoi == "00")
        {
            donUng.TrangThaiThanhToanLePhi = TrangThaiThanhToanLePhi.ThanhCong;
            donUng.NgayThanhToan = DateTimeOffset.UtcNow;
            donUng.HeThongThanhToan = "VNPay";
            donUng.ThamChieuGiaoDich = thamSo.GetValueOrDefault("vnp_TransactionNo");

            var emailContent = $"<p>Ch?o b?n,</p><p>H? s? <b>{donUng.MaTheoDoi}</b> ?? ???c thanh to?n l? ph? ( {donUng.LePhiTaiThoiDiemNop} VN? ) th?nh c?ng.</p>";
            await _dichVuEmail.GuiAsync(donUng.EmailNguoiNop, "Thanh to�n th�nh c�ng h? s�: " + donUng.MaTheoDoi, emailContent);
        }
        else
        {
            donUng.TrangThaiThanhToanLePhi = TrangThaiThanhToanLePhi.ThatBai;
        }

        _donViCongViec.DonUngs.CapNhat(donUng);
        await _donViCongViec.LuuThayDoiAsync(ct);

        var duongDanDieuHuong = $"{_duongDanFrontend.TrimEnd('/')}/ca-nhan/thanh-toan?paymentStatus={Uri.EscapeDataString(maPhanHoi ?? string.Empty)}";
        return Redirect(duongDanDieuHuong);
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







