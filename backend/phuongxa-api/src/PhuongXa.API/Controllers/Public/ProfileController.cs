using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PhuongXa.API.TienIch;
using PhuongXa.Application.CacGiaoDien;
using PhuongXa.Application.Chung;
using PhuongXa.Application.DTOs.DonUng;
using PhuongXa.Application.DTOs.HoSo;
using PhuongXa.Domain.CacThucThe;

using PhuongXa.API.Controllers;
namespace PhuongXa.API.Controllers.Public;

[Route("api/public/profile")]
[Authorize]
public class ProfileController : BaseApiController
{
    private static readonly HashSet<string> DuoiTepAnhChoPhep =
    [
        ".jpg", ".jpeg", ".png", ".webp", ".gif"
    ];

    private readonly UserManager<NguoiDung> _quanLyNguoiDung;
    private readonly IDonViCongViec _donViCongViec;
    private readonly IDichVuLuuTruTep _dichVuLuuTruTep;
    private readonly IMapper _anhXa;

    public ProfileController(
        UserManager<NguoiDung> quanLyNguoiDung,
        IDonViCongViec donViCongViec,
        IDichVuLuuTruTep dichVuLuuTruTep,
        IMapper anhXa)
    {
        _quanLyNguoiDung = quanLyNguoiDung;
        _donViCongViec = donViCongViec;
        _dichVuLuuTruTep = dichVuLuuTruTep;
        _anhXa = anhXa;
    }

    [HttpGet]
    public async Task<IActionResult> LayHoSo()
    {
        var nguoiDung = await _quanLyNguoiDung.FindByIdAsync(IdNguoiDungHienTai.ToString());
        if (nguoiDung is null)
            return NotFound(PhanHoiApi.ThatBai("Khong tim thay nguoi dung"));

        var vaiTro = await _quanLyNguoiDung.GetRolesAsync(nguoiDung);
        var dto = _anhXa.Map<HoSoDto>(nguoiDung);
        dto.DanhSachVaiTro = vaiTro.ToList();

        return Ok(PhanHoiApi<HoSoDto>.ThanhCongKetQua(dto));
    }

    [HttpPut]
    public async Task<IActionResult> CapNhatHoSo([FromBody] CapNhatHoSoDto yeuCau)
    {
        var nguoiDung = await _quanLyNguoiDung.FindByIdAsync(IdNguoiDungHienTai.ToString());
        if (nguoiDung is null)
            return NotFound(PhanHoiApi.ThatBai("Khong tim thay nguoi dung"));

        nguoiDung.HoTen = yeuCau.HoTen.Trim();
        nguoiDung.PhoneNumber = yeuCau.SoDienThoai;
        nguoiDung.NgayCapNhat = DateTime.UtcNow;

        var ketQua = await _quanLyNguoiDung.UpdateAsync(nguoiDung);
        if (!ketQua.Succeeded)
            return BadRequest(PhanHoiApi.ThatBai(
                "Cap nhat that bai",
                ketQua.Errors.Select(e => e.Description).ToList()));

        return Ok(PhanHoiApi.ThanhCongKetQua("Cap nhat thong tin thanh cong"));
    }

    [HttpPost("avatar")]
    public async Task<IActionResult> TaiLenAnhDaiDien([FromForm] TaiAnhDaiDienRequest yeuCau)
    {
        var tep = yeuCau.Tep;
        if (tep is null || tep.Length == 0)
            return BadRequest(PhanHoiApi.ThatBai("Vui long chon file anh"));

        var duoiTep = Path.GetExtension(tep.FileName).ToLowerInvariant();
        if (!DuoiTepAnhChoPhep.Contains(duoiTep))
            return BadRequest(PhanHoiApi.ThatBai($"Dinh dang file '{duoiTep}' khong duoc phep"));

        var nguoiDung = await _quanLyNguoiDung.FindByIdAsync(IdNguoiDungHienTai.ToString());
        if (nguoiDung is null)
            return NotFound(PhanHoiApi.ThatBai("Khong tim thay nguoi dung"));

        await using var luong = tep.OpenReadStream();
        var duongDanTep = await _dichVuLuuTruTep.LuuTepAsync(
            luong,
            tep.FileName,
            tep.ContentType ?? "application/octet-stream",
            "uploads/avatars");

        nguoiDung.AnhDaiDien = _dichVuLuuTruTep.LayUrlTep(duongDanTep);
        nguoiDung.NgayCapNhat = DateTime.UtcNow;

        var ketQua = await _quanLyNguoiDung.UpdateAsync(nguoiDung);
        if (!ketQua.Succeeded)
            return BadRequest(PhanHoiApi.ThatBai(
                "Cap nhat anh dai dien that bai",
                ketQua.Errors.Select(e => e.Description).ToList()));

        return Ok(PhanHoiApi<object>.ThanhCongKetQua(new { nguoiDung.AnhDaiDien }, "Cap nhat anh dai dien thanh cong"));
    }

    [HttpDelete("avatar")]
    public async Task<IActionResult> XoaAnhDaiDien()
    {
        var nguoiDung = await _quanLyNguoiDung.FindByIdAsync(IdNguoiDungHienTai.ToString());
        if (nguoiDung is null)
            return NotFound(PhanHoiApi.ThatBai("Khong tim thay nguoi dung"));

        if (string.IsNullOrWhiteSpace(nguoiDung.AnhDaiDien))
            return Ok(PhanHoiApi.ThanhCongKetQua("Tai khoan hien khong co anh dai dien"));

        var duongDanTep = TrichXuatDuongDanTep(nguoiDung.AnhDaiDien);
        if (!string.IsNullOrWhiteSpace(duongDanTep))
            await _dichVuLuuTruTep.XoaTepAsync(duongDanTep);

        nguoiDung.AnhDaiDien = null;
        nguoiDung.NgayCapNhat = DateTime.UtcNow;

        var ketQua = await _quanLyNguoiDung.UpdateAsync(nguoiDung);
        if (!ketQua.Succeeded)
            return BadRequest(PhanHoiApi.ThatBai(
                "Xoa anh dai dien that bai",
                ketQua.Errors.Select(e => e.Description).ToList()));

        return Ok(PhanHoiApi.ThanhCongKetQua("Xoa anh dai dien thanh cong"));
    }

    [HttpGet("applications")]
    public async Task<IActionResult> LayDonUngCuaToi(
        [FromQuery] int trang = 1,
        [FromQuery] int kichThuocTrang = 10,
        CancellationToken ct = default)
    {
        (trang, kichThuocTrang) = ChuanHoaPhanTrang(trang, kichThuocTrang, 100);

        var truyVan = _donViCongViec.DonUngs
            .TruyVan()
            .AsNoTracking()
            .Include(x => x.DichVu)
            .Include(x => x.DanhSachTep)
            .Where(x => x.NguoiDungId == IdNguoiDungHienTai)
            .OrderByDescending(x => x.NgayNop);

        var ketQua = await truyVan.PhanTrangAsync<DonUngDichVu, DonUngDto>(trang, kichThuocTrang, _anhXa);
        return Ok(PhanHoiApi<KetQuaPhanTrang<DonUngDto>>.ThanhCongKetQua(ketQua));
    }

    private static string? TrichXuatDuongDanTep(string? duongDanAnh)
    {
        if (string.IsNullOrWhiteSpace(duongDanAnh))
            return null;

        var giaTri = duongDanAnh.Trim();
        if (Uri.TryCreate(giaTri, UriKind.Absolute, out var uri))
            giaTri = uri.AbsolutePath;

        giaTri = giaTri.Replace("\\", "/").TrimStart('/');
        var viTriUploads = giaTri.IndexOf("uploads/", StringComparison.OrdinalIgnoreCase);
        if (viTriUploads >= 0)
            giaTri = giaTri[viTriUploads..];

        return giaTri.StartsWith("uploads/", StringComparison.OrdinalIgnoreCase) ? giaTri : null;
    }
}

public sealed class TaiAnhDaiDienRequest
{
    public IFormFile Tep { get; set; } = null!;
}

