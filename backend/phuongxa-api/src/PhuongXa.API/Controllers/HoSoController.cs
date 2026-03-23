using PhuongXa.API.TienIch;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PhuongXa.Application.Chung;
using PhuongXa.Application.DTOs.DonUng;
using PhuongXa.Application.DTOs.HoSo;
using PhuongXa.Application.CacGiaoDien;
using PhuongXa.Domain.CacThucThe;

namespace PhuongXa.API.Controllers;

[ApiController]
[Route("api/profile")]
[Authorize]
public class HoSoController : BaseApiController
{
    private readonly UserManager<NguoiDung> _quanLyNguoiDung;
    private readonly IDonViCongViec _donViCongViec;
    private readonly IMapper _anhXa;
    private readonly IDichVuLuuTruTep _luuTruTep;

    public HoSoController(
        UserManager<NguoiDung> quanLyNguoiDung,
        IDonViCongViec donViCongViec,
        IMapper anhXa,
        IDichVuLuuTruTep luuTruTep)
    {
        _quanLyNguoiDung = quanLyNguoiDung;
        _donViCongViec = donViCongViec;
        _anhXa = anhXa;
        _luuTruTep = luuTruTep;
    }

    [HttpGet]
    public async Task<IActionResult> LayHoSo()
    {
        var nguoiDung = await _quanLyNguoiDung.FindByIdAsync(IdNguoiDungHienTai.ToString());
        if (nguoiDung == null)
            return NotFound(PhanHoiApi.ThatBai("Không tìm thấy người dùng"));

        var vaiTros = await _quanLyNguoiDung.GetRolesAsync(nguoiDung);
        var dto = _anhXa.Map<HoSoDto>(nguoiDung);
        dto.DanhSachVaiTro = vaiTros.ToList();

        return Ok(PhanHoiApi<HoSoDto>.ThanhCongKetQua(dto));
    }

    [HttpPut]
    public async Task<IActionResult> CapNhatHoSo([FromBody] CapNhatHoSoDto dto)
    {
        var nguoiDung = await _quanLyNguoiDung.FindByIdAsync(IdNguoiDungHienTai.ToString());
        if (nguoiDung == null)
            return NotFound(PhanHoiApi.ThatBai("Không tìm thấy người dùng"));

        nguoiDung.HoTen = dto.HoTen;
        nguoiDung.PhoneNumber = dto.SoDienThoai;
        nguoiDung.NgayCapNhat = DateTime.UtcNow;

        var ketQua = await _quanLyNguoiDung.UpdateAsync(nguoiDung);
        if (!ketQua.Succeeded)
            return BadRequest(PhanHoiApi.ThatBai("Cập nhật thất bại",
                ketQua.Errors.Select(e => e.Description).ToList()));

        return Ok(PhanHoiApi.ThanhCongKetQua("Cập nhật thông tin thành công"));
    }

    [HttpPost("avatar")]
    [RequestSizeLimit(5_000_000)]
    public async Task<IActionResult> TaiLenAnhDaiDien([FromForm] IFormFile tep)
    {
        if (tep == null || tep.Length == 0)
            return BadRequest(PhanHoiApi.ThatBai("Vui lòng chọn file ảnh"));

        var loaiChoPhep = new[] { "image/jpeg", "image/png", "image/webp", "image/gif" };
        if (!loaiChoPhep.Contains(tep.ContentType.ToLower()))
            return BadRequest(PhanHoiApi.ThatBai("Chỉ chấp nhận file ảnh (jpg, png, webp, gif)"));

        var duoiChoPhep = new[] { ".jpg", ".jpeg", ".png", ".webp", ".gif" };
        var duoiTep = Path.GetExtension(tep.FileName).ToLowerInvariant();
        if (!duoiChoPhep.Contains(duoiTep))
            return BadRequest(PhanHoiApi.ThatBai($"Định dạng tệp '{duoiTep}' không được phép"));

        var nguoiDung = await _quanLyNguoiDung.FindByIdAsync(IdNguoiDungHienTai.ToString());
        if (nguoiDung == null)
            return NotFound(PhanHoiApi.ThatBai("Không tìm thấy người dùng"));

        if (!string.IsNullOrEmpty(nguoiDung.AnhDaiDien))
            await _luuTruTep.XoaTepAsync(nguoiDung.AnhDaiDien);

        using var luongTep = tep.OpenReadStream();
        var duongDan = await _luuTruTep.LuuTepAsync(luongTep, Path.GetFileName(tep.FileName), tep.ContentType, "uploads/avatars");
        nguoiDung.AnhDaiDien = duongDan;
        nguoiDung.NgayCapNhat = DateTime.UtcNow;
        var ketQua = await _quanLyNguoiDung.UpdateAsync(nguoiDung);
        if (!ketQua.Succeeded)
            return BadRequest(PhanHoiApi.ThatBai("Cập nhật ảnh đại diện thất bại",
                ketQua.Errors.Select(e => e.Description).ToList()));

        return Ok(PhanHoiApi<object>.ThanhCongKetQua(new { avatarUrl = _luuTruTep.LayUrlTep(duongDan) },
            "Cập nhật ảnh đại diện thành công"));
    }

    [HttpGet("applications")]
    public async Task<IActionResult> LayDonUngCuaToi([FromQuery] int trang = 1, [FromQuery] int kichThuocTrang = 10)
    {
        (trang, kichThuocTrang) = ChuanHoaPhanTrang(trang, kichThuocTrang);
        var idNguoiDung = IdNguoiDungHienTai;
        var truyVan = _donViCongViec.DonUngs.TruyVan().AsNoTracking()
            .Include(a => a.DichVu)
            .Include(a => a.DanhSachTep)
            .Where(a => a.NguoiDungId == idNguoiDung);

        var ketQua = await truyVan
            .OrderByDescending(a => a.NgayNop)
            .PhanTrangAsync<DonUngDichVu, DonUngDto>(trang, kichThuocTrang, _anhXa);

        return Ok(PhanHoiApi<KetQuaPhanTrang<DonUngDto>>.ThanhCongKetQua(ketQua));
    }
}
