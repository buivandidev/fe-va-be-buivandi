using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PhuongXa.API.TienIch;
using PhuongXa.Application.CacGiaoDien;
using PhuongXa.Application.Chung;
using PhuongXa.Application.DTOs.XacThuc;
using PhuongXa.Domain.CacThucThe;

using PhuongXa.API.Controllers;
namespace PhuongXa.API.Controllers.Public;

[Route("api/auth")]
public class AuthController : BaseApiController
{
    private const string TenCookieMaTruyCap = "auth_token";
    private const string TenCookieMaLamMoi = "refreshToken";

    private readonly UserManager<NguoiDung> _quanLyNguoiDung;
    private readonly RoleManager<VaiTro> _quanLyVaiTro;
    private readonly IDichVuJwt _dichVuJwt;
    private readonly IDonViCongViec _donViCongViec;
    private readonly IDichVuEmail _dichVuEmail;
    private readonly IConfiguration _cauHinh;

    public AuthController(
        UserManager<NguoiDung> quanLyNguoiDung,
        RoleManager<VaiTro> quanLyVaiTro,
        IDichVuJwt dichVuJwt,
        IDonViCongViec donViCongViec,
        IDichVuEmail dichVuEmail,
        IConfiguration cauHinh)
    {
        _quanLyNguoiDung = quanLyNguoiDung;
        _quanLyVaiTro = quanLyVaiTro;
        _dichVuJwt = dichVuJwt;
        _donViCongViec = donViCongViec;
        _dichVuEmail = dichVuEmail;
        _cauHinh = cauHinh;
    }

    [HttpPost("register")]
    [AllowAnonymous]
    public async Task<IActionResult> DangKy([FromBody] DangKyDto yeuCau, CancellationToken ct)
    {
        if (!string.Equals(yeuCau.MatKhau, yeuCau.XacNhanMatKhau, StringComparison.Ordinal))
            return BadRequest(PhanHoiApi.ThatBai("Xac nhan mat khau khong khop"));

        var nguoiDungDaTonTai = await _quanLyNguoiDung.FindByEmailAsync(yeuCau.Email);
        if (nguoiDungDaTonTai is not null)
            return BadRequest(PhanHoiApi.ThatBai("Email da duoc su dung"));

        var nguoiDung = new NguoiDung
        {
            HoTen = yeuCau.HoTen.Trim(),
            Email = yeuCau.Email.Trim(),
            UserName = yeuCau.Email.Trim(),
            PhoneNumber = yeuCau.SoDienThoai,
            DangHoatDong = true,
            EmailConfirmed = true
        };

        var ketQuaTao = await _quanLyNguoiDung.CreateAsync(nguoiDung, yeuCau.MatKhau);
        if (!ketQuaTao.Succeeded)
            return BadRequest(PhanHoiApi.ThatBai(
                "Tao tai khoan that bai",
                ketQuaTao.Errors.Select(e => e.Description).ToList()));

        await DamBaoVaiTroTonTaiAsync(HangSoPhanQuyen.NguoiXem);
        var ketQuaGanVaiTro = await _quanLyNguoiDung.AddToRoleAsync(nguoiDung, HangSoPhanQuyen.NguoiXem);
        if (!ketQuaGanVaiTro.Succeeded)
            return BadRequest(PhanHoiApi.ThatBai(
                "Gan vai tro mac dinh that bai",
                ketQuaGanVaiTro.Errors.Select(e => e.Description).ToList()));

        var phanHoiXacThuc = await TaoPhanHoiXacThucAsync(nguoiDung, ct);

        _ = Task.Run(async () =>
        {
            try
            {
                await _dichVuEmail.GuiChaoMungAsync(nguoiDung.Email!, nguoiDung.HoTen);
            }
            catch
            {
                // Khong chan luong dang ky neu gui email that bai.
            }
        }, CancellationToken.None);

        return Ok(TaoPhanHoiXacThucTuongThich(phanHoiXacThuc, "Dang ky tai khoan thanh cong"));
    }

    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<IActionResult> DangNhap([FromBody] DangNhapDto yeuCau, CancellationToken ct)
    {
        var nguoiDung = await _quanLyNguoiDung.FindByEmailAsync(yeuCau.Email.Trim());
        if (nguoiDung is null)
            return Unauthorized(PhanHoiApi.ThatBai("Email hoac mat khau khong dung"));

        if (!nguoiDung.DangHoatDong)
            return Unauthorized(PhanHoiApi.ThatBai("Tai khoan da bi vo hieu hoa"));

        var matKhauHopLe = await _quanLyNguoiDung.CheckPasswordAsync(nguoiDung, yeuCau.MatKhau);
        if (!matKhauHopLe)
            return Unauthorized(PhanHoiApi.ThatBai("Email hoac mat khau khong dung"));

        var phanHoiXacThuc = await TaoPhanHoiXacThucAsync(nguoiDung, ct);
        return Ok(TaoPhanHoiXacThucTuongThich(phanHoiXacThuc, "Dang nhap thanh cong"));
    }

    [HttpPost("refresh")]
    [AllowAnonymous]
    public async Task<IActionResult> LamMoiPhien([FromBody] MaLamMoiDto? yeuCau, CancellationToken ct)
    {
        var maLamMoi = LayMaLamMoiTuYeuCau(yeuCau);
        if (string.IsNullOrWhiteSpace(maLamMoi))
            return Unauthorized(PhanHoiApi.ThatBai("Refresh token khong hop le"));

        var banGhiMaLamMoi = await _donViCongViec.MaLamMois
            .TruyVan()
            .Include(x => x.NguoiDung)
            .FirstOrDefaultAsync(x => x.MaToken == maLamMoi, ct);

        if (banGhiMaLamMoi is null || banGhiMaLamMoi.DaBiThuHoi || banGhiMaLamMoi.HetHanLuc <= DateTime.UtcNow)
            return Unauthorized(PhanHoiApi.ThatBai("Refresh token da het han hoac khong hop le"));

        if (!banGhiMaLamMoi.NguoiDung.DangHoatDong)
            return Unauthorized(PhanHoiApi.ThatBai("Tai khoan da bi vo hieu hoa"));

        banGhiMaLamMoi.DaBiThuHoi = true;
        _donViCongViec.MaLamMois.CapNhat(banGhiMaLamMoi);

        var phanHoiXacThuc = await TaoPhanHoiXacThucAsync(banGhiMaLamMoi.NguoiDung, ct);
        return Ok(TaoPhanHoiXacThucTuongThich(phanHoiXacThuc, "Lam moi phien thanh cong"));
    }

    [HttpPost("logout")]
    [Authorize]
    public async Task<IActionResult> DangXuat([FromBody] MaLamMoiDto? yeuCau, CancellationToken ct)
    {
        var maLamMoi = LayMaLamMoiTuYeuCau(yeuCau);
        if (!string.IsNullOrWhiteSpace(maLamMoi))
        {
            var banGhiMaLamMoi = await _donViCongViec.MaLamMois
                .TruyVan()
                .FirstOrDefaultAsync(x => x.MaToken == maLamMoi && x.NguoiDungId == IdNguoiDungHienTai, ct);

            if (banGhiMaLamMoi is not null && !banGhiMaLamMoi.DaBiThuHoi)
            {
                banGhiMaLamMoi.DaBiThuHoi = true;
                _donViCongViec.MaLamMois.CapNhat(banGhiMaLamMoi);
                await _donViCongViec.LuuThayDoiAsync(ct);
            }
        }

        XoaCookieMaLamMoi();
        XoaCookieMaTruyCap();
        return Ok(PhanHoiApi.ThanhCongKetQua("Dang xuat thanh cong"));
    }

    [HttpPost("logout-all")]
    [Authorize]
    public async Task<IActionResult> DangXuatTatCa(CancellationToken ct)
    {
        var danhSachToken = await _donViCongViec.MaLamMois
            .TruyVan()
            .Where(x => x.NguoiDungId == IdNguoiDungHienTai && !x.DaBiThuHoi)
            .ToListAsync(ct);

        foreach (var token in danhSachToken)
        {
            token.DaBiThuHoi = true;
            _donViCongViec.MaLamMois.CapNhat(token);
        }

        if (danhSachToken.Count > 0)
            await _donViCongViec.LuuThayDoiAsync(ct);

        XoaCookieMaLamMoi();
        XoaCookieMaTruyCap();
        return Ok(PhanHoiApi.ThanhCongKetQua($"Da thu hoi {danhSachToken.Count} phien dang nhap"));
    }

    [HttpPost("revoke-all")]
    [Authorize]
    public async Task<IActionResult> ThuHoiTatCaPhienDangNhap(CancellationToken ct)
    {
        return await DangXuatTatCa(ct);
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<IActionResult> LayThongTinToi(CancellationToken ct)
    {
        var nguoiDung = await _quanLyNguoiDung.Users.FirstOrDefaultAsync(x => x.Id == IdNguoiDungHienTai, ct);
        if (nguoiDung is null)
            return NotFound(PhanHoiApi.ThatBai("Khong tim thay nguoi dung"));

        var danhSachVaiTro = await _quanLyNguoiDung.GetRolesAsync(nguoiDung);
        var phanHoi = TaoThongTinNguoiDungDto(nguoiDung, danhSachVaiTro);

        return Ok(TaoPhanHoiThongTinNguoiDungTuongThich(phanHoi));
    }

    [HttpPost("change-password")]
    [Authorize]
    public async Task<IActionResult> DoiMatKhau([FromBody] DoiMatKhauDto yeuCau, CancellationToken ct)
    {
        var nguoiDung = await _quanLyNguoiDung.Users.FirstOrDefaultAsync(x => x.Id == IdNguoiDungHienTai, ct);
        if (nguoiDung is null)
            return NotFound(PhanHoiApi.ThatBai("Khong tim thay nguoi dung"));

        var ketQua = await _quanLyNguoiDung.ChangePasswordAsync(nguoiDung, yeuCau.MatKhauHienTai, yeuCau.MatKhauMoi);
        if (!ketQua.Succeeded)
            return BadRequest(PhanHoiApi.ThatBai(
                "Doi mat khau that bai",
                ketQua.Errors.Select(e => e.Description).ToList()));

        await ThuHoiTatCaPhienAsync(nguoiDung.Id, ct);
        XoaCookieMaLamMoi();
        XoaCookieMaTruyCap();

        return Ok(PhanHoiApi.ThanhCongKetQua("Doi mat khau thanh cong"));
    }

    private async Task DamBaoVaiTroTonTaiAsync(string vaiTro)
    {
        if (!await _quanLyVaiTro.RoleExistsAsync(vaiTro))
            await _quanLyVaiTro.CreateAsync(new VaiTro { Name = vaiTro });
    }

    private string LayMaLamMoiTuYeuCau(MaLamMoiDto? yeuCau)
    {
        if (!string.IsNullOrWhiteSpace(yeuCau?.MaLamMoi))
            return yeuCau.MaLamMoi;

        if (Request.Cookies.TryGetValue(TenCookieMaLamMoi, out var maLamMoiCookie) && !string.IsNullOrWhiteSpace(maLamMoiCookie))
            return maLamMoiCookie;

        return string.Empty;
    }

    private void DatCookieMaLamMoi(string maLamMoi, DateTime hetHan)
    {
        Response.Cookies.Append(TenCookieMaLamMoi, maLamMoi, new CookieOptions
        {
            HttpOnly = true,
            Secure = Request.IsHttps,
            SameSite = SameSiteMode.Lax,
            Expires = hetHan,
            IsEssential = true
        });
    }

    private void DatCookieMaTruyCap(string maTruyCap, DateTime hetHan)
    {
        Response.Cookies.Append(TenCookieMaTruyCap, maTruyCap, new CookieOptions
        {
            HttpOnly = true,
            Secure = Request.IsHttps,
            SameSite = SameSiteMode.Lax,
            Expires = hetHan,
            IsEssential = true
        });
    }

    private void XoaCookieMaLamMoi()
    {
        Response.Cookies.Delete(TenCookieMaLamMoi);
    }

    private void XoaCookieMaTruyCap()
    {
        Response.Cookies.Delete(TenCookieMaTruyCap);
    }

    private int LaySoNgayHetHanMaLamMoi()
    {
        return int.TryParse(_cauHinh["Jwt:RefreshTokenDays"], out var soNgay)
            ? Math.Max(soNgay, 1)
            : 7;
    }

    private double LaySoPhutHetHanMaTruyCap()
    {
        return int.TryParse(_cauHinh["Jwt:AccessTokenMinutes"], out var soPhut)
            ? Math.Max(soPhut, 1)
            : 15;
    }

    private async Task ThuHoiTatCaPhienAsync(Guid nguoiDungId, CancellationToken ct)
    {
        var danhSachToken = await _donViCongViec.MaLamMois
            .TruyVan()
            .Where(x => x.NguoiDungId == nguoiDungId && !x.DaBiThuHoi)
            .ToListAsync(ct);

        foreach (var token in danhSachToken)
        {
            token.DaBiThuHoi = true;
            _donViCongViec.MaLamMois.CapNhat(token);
        }

        if (danhSachToken.Count > 0)
            await _donViCongViec.LuuThayDoiAsync(ct);
    }

    private async Task<PhanHoiXacThucDto> TaoPhanHoiXacThucAsync(NguoiDung nguoiDung, CancellationToken ct)
    {
        var danhSachVaiTro = await _quanLyNguoiDung.GetRolesAsync(nguoiDung);
        var maTruyCap = _dichVuJwt.TaoMaTruyCap(nguoiDung, danhSachVaiTro);
        var maLamMoi = _dichVuJwt.TaoMaLamMoi();
        var hetHanMaTruyCap = DateTime.UtcNow.AddMinutes(LaySoPhutHetHanMaTruyCap());

        var hetHanMaLamMoi = DateTime.UtcNow.AddDays(LaySoNgayHetHanMaLamMoi());
        await _donViCongViec.MaLamMois.ThemAsync(new MaLamMoi
        {
            NguoiDungId = nguoiDung.Id,
            MaToken = maLamMoi,
            HetHanLuc = hetHanMaLamMoi,
            TaoBoiIp = HttpContext.Connection.RemoteIpAddress?.ToString()
        }, ct);
        await _donViCongViec.LuuThayDoiAsync(ct);

        DatCookieMaLamMoi(maLamMoi, hetHanMaLamMoi);
        DatCookieMaTruyCap(maTruyCap, hetHanMaTruyCap);

        return new PhanHoiXacThucDto
        {
            MaTruyCap = maTruyCap,
            MaLamMoi = maLamMoi,
            HetHanLuc = hetHanMaTruyCap,
            NguoiDung = TaoThongTinNguoiDungDto(nguoiDung, danhSachVaiTro)
        };
    }

    private static ThongTinNguoiDungDto TaoThongTinNguoiDungDto(NguoiDung nguoiDung, IList<string> danhSachVaiTro)
    {
        return new ThongTinNguoiDungDto
        {
            Id = nguoiDung.Id,
            HoTen = nguoiDung.HoTen,
            Email = nguoiDung.Email ?? string.Empty,
            AnhDaiDien = nguoiDung.AnhDaiDien,
            DanhSachVaiTro = danhSachVaiTro.ToList()
        };
    }

    private static object TaoPhanHoiXacThucTuongThich(PhanHoiXacThucDto duLieu, string thongDiep)
    {
        return new
        {
            ThanhCong = true,
            ThongDiep = thongDiep,
            DuLieu = duLieu,
            LoiDanhSach = (List<string>?)null,
            Token = duLieu.MaTruyCap,
            User = duLieu.NguoiDung
        };
    }

    private static object TaoPhanHoiThongTinNguoiDungTuongThich(ThongTinNguoiDungDto duLieu)
    {
        return new
        {
            ThanhCong = true,
            ThongDiep = (string?)null,
            DuLieu = duLieu,
            LoiDanhSach = (List<string>?)null,
            User = duLieu
        };
    }
}

