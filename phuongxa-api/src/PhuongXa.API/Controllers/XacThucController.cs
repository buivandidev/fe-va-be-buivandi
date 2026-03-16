using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using PhuongXa.Application.Chung;
using PhuongXa.Application.DTOs.XacThuc;
using PhuongXa.Application.CacGiaoDien;
using PhuongXa.Domain.CacThucThe;

namespace PhuongXa.API.Controllers;

[ApiController]
[Route("api/auth")]
public class XacThucController : BaseApiController
{
    private readonly UserManager<NguoiDung> _quanLyNguoiDung;
    private readonly SignInManager<NguoiDung> _quanLyDangNhap;
    private readonly IDichVuJwt _dichVuJwt;
    private readonly IDonViCongViec _donViCongViec;
    private readonly IConfiguration _cauHinh;
    private readonly IDichVuEmail _dichVuEmail;

    public XacThucController(
        UserManager<NguoiDung> quanLyNguoiDung,
        SignInManager<NguoiDung> quanLyDangNhap,
        IDichVuJwt dichVuJwt,
        IDonViCongViec donViCongViec,
        IConfiguration cauHinh,
        IDichVuEmail dichVuEmail)
    {
        _quanLyNguoiDung = quanLyNguoiDung;
        _quanLyDangNhap = quanLyDangNhap;
        _dichVuJwt = dichVuJwt;
        _donViCongViec = donViCongViec;
        _cauHinh = cauHinh;
        _dichVuEmail = dichVuEmail;
    }

    // ── Helpers ──────────────────────────────────────────────

    private int SoNgayHetHanMaLamMoi =>
        int.TryParse(_cauHinh["Jwt:RefreshTokenDays"], out var ngay) ? ngay : 7;

    private MaLamMoi TaoThucTheMaLamMoi(Guid idNguoiDung, string maToken)
    {
        return new MaLamMoi
        {
            NguoiDungId = idNguoiDung,
            MaToken = maToken,
            HetHanLuc = DateTime.UtcNow.AddDays(SoNgayHetHanMaLamMoi),
            TaoBoiIp = HttpContext.Connection.RemoteIpAddress?.ToString()
        };
    }

    private void DatCookieMaLamMoi(string maToken, DateTime hetHanLuc)
    {
        Response.Cookies.Append("refreshToken", maToken, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Strict,
            Expires = hetHanLuc
        });
    }

    // ── Endpoints ───────────────────────────────────────────

    [HttpPost("login")]
    [EnableRateLimiting("login")]
    public async Task<IActionResult> DangNhap([FromBody] DangNhapDto dto)
    {
        var nguoiDung = await _quanLyNguoiDung.FindByEmailAsync(dto.Email);
        if (nguoiDung == null || !nguoiDung.DangHoatDong)
            return Unauthorized(PhanHoiApi.ThatBai("Email hoặc mật khẩu không đúng"));

        var ketQua = await _quanLyDangNhap.CheckPasswordSignInAsync(nguoiDung, dto.MatKhau, lockoutOnFailure: true);
        if (!ketQua.Succeeded)
        {
            if (ketQua.IsLockedOut)
                return Unauthorized(PhanHoiApi.ThatBai("Tài khoản tạm thời bị khóa"));
            return Unauthorized(PhanHoiApi.ThatBai("Email hoặc mật khẩu không đúng"));
        }

        var vaiTros = await _quanLyNguoiDung.GetRolesAsync(nguoiDung);
        var maTruyCap = _dichVuJwt.TaoMaTruyCap(nguoiDung, vaiTros);
        var maLamMoi = _dichVuJwt.TaoMaLamMoi();

        var thucTheMaLamMoi = TaoThucTheMaLamMoi(nguoiDung.Id, maLamMoi);
        await _donViCongViec.MaLamMois.ThemAsync(thucTheMaLamMoi);
        await _donViCongViec.LuuThayDoiAsync();

        DatCookieMaLamMoi(maLamMoi, thucTheMaLamMoi.HetHanLuc);

        var phanHoi = new PhanHoiXacThucDto
        {
            MaTruyCap = maTruyCap,
            HetHanLuc = DateTime.UtcNow.AddMinutes(
                double.TryParse(_cauHinh["Jwt:AccessTokenMinutes"], out var phut) ? phut : 15),
            NguoiDung = new ThongTinNguoiDungDto
            {
                Id = nguoiDung.Id,
                HoTen = nguoiDung.HoTen,
                Email = nguoiDung.Email!,
                AnhDaiDien = nguoiDung.AnhDaiDien,
                DanhSachVaiTro = vaiTros.ToList()
            }
        };

        return Ok(PhanHoiApi<PhanHoiXacThucDto>.ThanhCongKetQua(phanHoi, "Đăng nhập thành công"));
    }

    [HttpPost("register")]
    [EnableRateLimiting("register")]
    public async Task<IActionResult> DangKy([FromBody] DangKyDto dto)
    {
        var daTonTai = await _quanLyNguoiDung.FindByEmailAsync(dto.Email);
        if (daTonTai != null)
            return BadRequest(PhanHoiApi.ThatBai("Email đã được sử dụng"));

        var nguoiDung = new NguoiDung
        {
            HoTen = dto.HoTen,
            Email = dto.Email,
            UserName = dto.Email,
            PhoneNumber = dto.SoDienThoai,
            DangHoatDong = true
        };

        var ketQua = await _quanLyNguoiDung.CreateAsync(nguoiDung, dto.MatKhau);
        if (!ketQua.Succeeded)
            return BadRequest(PhanHoiApi.ThatBai("Tạo tài khoản thất bại",
                ketQua.Errors.Select(e => e.Description).ToList()));

        await _quanLyNguoiDung.AddToRoleAsync(nguoiDung, "Viewer");

        try
        {
            await _dichVuEmail.GuiChaoMungAsync(nguoiDung.Email!, nguoiDung.HoTen);
        }
        catch { /* logged in email service */ }

        return Ok(PhanHoiApi.ThanhCongKetQua("Đăng ký tài khoản thành công"));
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> LamMoi([FromBody] MaLamMoiDto dto)
    {
        var maToken = dto.MaLamMoi ?? Request.Cookies["refreshToken"];
        if (string.IsNullOrEmpty(maToken))
            return Unauthorized(PhanHoiApi.ThatBai("Mã làm mới không hợp lệ"));

        var thucTheMaLamMoi = await _donViCongViec.MaLamMois.TruyVan()
            .Include(r => r.NguoiDung)
            .FirstOrDefaultAsync(r =>
                r.MaToken == maToken && !r.DaBiThuHoi && r.HetHanLuc > DateTime.UtcNow);

        if (thucTheMaLamMoi == null)
            return Unauthorized(PhanHoiApi.ThatBai("Mã làm mới đã hết hạn hoặc không hợp lệ"));

        if (!thucTheMaLamMoi.NguoiDung.DangHoatDong)
            return Unauthorized(PhanHoiApi.ThatBai("Tài khoản đã bị vô hiệu hóa"));

        thucTheMaLamMoi.DaBiThuHoi = true;

        var vaiTros = await _quanLyNguoiDung.GetRolesAsync(thucTheMaLamMoi.NguoiDung);
        var maTruyCapMoi = _dichVuJwt.TaoMaTruyCap(thucTheMaLamMoi.NguoiDung, vaiTros);
        var maLamMoiMoi = _dichVuJwt.TaoMaLamMoi();

        var thucTheMoiLamMoi = TaoThucTheMaLamMoi(thucTheMaLamMoi.NguoiDungId, maLamMoiMoi);
        await _donViCongViec.MaLamMois.ThemAsync(thucTheMoiLamMoi);
        await _donViCongViec.LuuThayDoiAsync();

        DatCookieMaLamMoi(maLamMoiMoi, thucTheMoiLamMoi.HetHanLuc);

        return Ok(PhanHoiApi<object>.ThanhCongKetQua(new
        {
            maTruyCap = maTruyCapMoi,
            maLamMoi = maLamMoiMoi
        }));
    }

    [Authorize]
    [HttpPost("logout")]
    public async Task<IActionResult> DangXuat([FromBody] MaLamMoiDto? dto)
    {
        var maToken = dto?.MaLamMoi ?? Request.Cookies["refreshToken"];
        if (!string.IsNullOrEmpty(maToken))
        {
            var thucTheMaLamMoi = await _donViCongViec.MaLamMois.TimDauTienAsync(r => r.MaToken == maToken);
            if (thucTheMaLamMoi != null)
            {
                thucTheMaLamMoi.DaBiThuHoi = true;
                await _donViCongViec.LuuThayDoiAsync();
            }
        }

        Response.Cookies.Delete("refreshToken");
        return Ok(PhanHoiApi.ThanhCongKetQua("Đăng xuất thành công"));
    }

    [Authorize]
    [HttpPost("revoke-all")]
    public async Task<IActionResult> ThuHoiTatCa()
    {
        var cacMaLamMoi = await _donViCongViec.MaLamMois.TruyVan()
            .Where(r => r.NguoiDungId == IdNguoiDungHienTai && !r.DaBiThuHoi)
            .ToListAsync();

        foreach (var ma in cacMaLamMoi)
            ma.DaBiThuHoi = true;

        await _donViCongViec.LuuThayDoiAsync();
        Response.Cookies.Delete("refreshToken");
        return Ok(PhanHoiApi.ThanhCongKetQua($"Đã thu hồi {cacMaLamMoi.Count} phiên đăng nhập"));
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<IActionResult> ThongTinCuaToi()
    {
        var nguoiDung = await _quanLyNguoiDung.FindByIdAsync(IdNguoiDungHienTai.ToString());
        if (nguoiDung == null)
            return NotFound(PhanHoiApi.ThatBai("Không tìm thấy người dùng"));

        var vaiTros = await _quanLyNguoiDung.GetRolesAsync(nguoiDung);
        return Ok(PhanHoiApi<ThongTinNguoiDungDto>.ThanhCongKetQua(new ThongTinNguoiDungDto
        {
            Id = nguoiDung.Id,
            HoTen = nguoiDung.HoTen,
            Email = nguoiDung.Email!,
            AnhDaiDien = nguoiDung.AnhDaiDien,
            DanhSachVaiTro = vaiTros.ToList()
        }));
    }

    [Authorize]
    [HttpPatch("change-password")]
    public async Task<IActionResult> DoiMatKhau([FromBody] DoiMatKhauDto dto)
    {
        var nguoiDung = await _quanLyNguoiDung.FindByIdAsync(IdNguoiDungHienTai.ToString());
        if (nguoiDung == null)
            return NotFound(PhanHoiApi.ThatBai("Không tìm thấy người dùng"));

        if (dto.MatKhauMoi != dto.XacNhanMatKhauMoi)
            return BadRequest(PhanHoiApi.ThatBai("Xác nhận mật khẩu không khớp"));

        var ketQua = await _quanLyNguoiDung.ChangePasswordAsync(nguoiDung, dto.MatKhauHienTai, dto.MatKhauMoi);
        if (!ketQua.Succeeded)
            return BadRequest(PhanHoiApi.ThatBai("Đổi mật khẩu thất bại",
                ketQua.Errors.Select(e => e.Description).ToList()));

        return Ok(PhanHoiApi.ThanhCongKetQua("Đổi mật khẩu thành công"));
    }
}
