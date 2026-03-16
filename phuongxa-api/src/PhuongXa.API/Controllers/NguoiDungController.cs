using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PhuongXa.Application.Chung;
using PhuongXa.Application.DTOs.NguoiDung;
using PhuongXa.Application.CacGiaoDien;
using PhuongXa.Domain.CacThucThe;

namespace PhuongXa.API.Controllers;

[ApiController]
[Route("api/users")]
[Authorize]
public class NguoiDungController : BaseApiController
{
    private readonly UserManager<NguoiDung> _quanLyNguoiDung;
    private readonly IMapper _anhXa;
    private readonly IDonViCongViec _donViCongViec;

    public NguoiDungController(UserManager<NguoiDung> quanLyNguoiDung, IMapper anhXa, IDonViCongViec donViCongViec)
    {
        _quanLyNguoiDung = quanLyNguoiDung;
        _anhXa = anhXa;
        _donViCongViec = donViCongViec;
    }

    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> LayTatCa([FromQuery] string? timKiem, [FromQuery] bool? dangHoatDong,
        [FromQuery] int trang = 1, [FromQuery] int kichThuocTrang = 20)
    {
        (trang, kichThuocTrang) = ChuanHoaPhanTrang(trang, kichThuocTrang);

        var truyVan = _quanLyNguoiDung.Users.AsQueryable();

        if (!string.IsNullOrEmpty(timKiem))
            truyVan = truyVan.Where(u => u.HoTen.Contains(timKiem) || u.Email!.Contains(timKiem));
        if (dangHoatDong.HasValue)
            truyVan = truyVan.Where(u => u.DangHoatDong == dangHoatDong.Value);

        var tongSo = await truyVan.CountAsync();
        var nguoiDungs = await truyVan
            .OrderByDescending(u => u.NgayTao)
            .Skip((trang - 1) * kichThuocTrang)
            .Take(kichThuocTrang)
            .ToListAsync();

        var danhSachId = nguoiDungs.Select(u => u.Id).ToList();
        var vaiTroNguoiDung = await _donViCongViec.LayVaiTroNguoiDungAsync(danhSachId);

        var dtos = nguoiDungs.Select(u =>
        {
            var dto = _anhXa.Map<NguoiDungDto>(u);
            dto.DanhSachVaiTro = vaiTroNguoiDung.TryGetValue(u.Id, out var danhSachVaiTro) ? danhSachVaiTro : new List<string>();
            return dto;
        }).ToList();

        return Ok(PhanHoiApi<KetQuaPhanTrang<NguoiDungDto>>.ThanhCongKetQua(new KetQuaPhanTrang<NguoiDungDto>
        {
            DanhSach = dtos,
            TongSo = tongSo,
            Trang = trang,
            KichThuocTrang = kichThuocTrang
        }));
    }

    [HttpGet("{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> LayTheoId(Guid id)
    {
        var nguoiDung = await _quanLyNguoiDung.FindByIdAsync(id.ToString());
        if (nguoiDung == null)
            return NotFound(PhanHoiApi.ThatBai("Không tìm thấy người dùng"));

        var dto = _anhXa.Map<NguoiDungDto>(nguoiDung);
    dto.DanhSachVaiTro = (await _quanLyNguoiDung.GetRolesAsync(nguoiDung)).ToList();
        return Ok(PhanHoiApi<NguoiDungDto>.ThanhCongKetQua(dto));
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Tao([FromBody] TaoNguoiDungDto dto)
    {
        var nguoiDung = new NguoiDung
        {
            HoTen = dto.HoTen,
            Email = dto.Email,
            UserName = dto.Email,
            PhoneNumber = dto.SoDienThoai,
            DangHoatDong = dto.DangHoatDong
        };
        var ketQua = await _quanLyNguoiDung.CreateAsync(nguoiDung, dto.MatKhau);
        if (!ketQua.Succeeded)
            return BadRequest(PhanHoiApi.ThatBai("Tạo tài khoản thất bại",
                ketQua.Errors.Select(e => e.Description).ToList()));

        await _quanLyNguoiDung.AddToRoleAsync(nguoiDung, dto.VaiTro);
        return CreatedAtAction(nameof(LayTheoId), new { id = nguoiDung.Id },
            PhanHoiApi<object>.ThanhCongKetQua(new { nguoiDung.Id }, "Tạo tài khoản thành công"));
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CapNhat(Guid id, [FromBody] CapNhatNguoiDungDto dto)
    {
        var nguoiDung = await _quanLyNguoiDung.FindByIdAsync(id.ToString());
        if (nguoiDung == null)
            return NotFound(PhanHoiApi.ThatBai("Không tìm thấy người dùng"));

        nguoiDung.HoTen = dto.HoTen;
        nguoiDung.PhoneNumber = dto.SoDienThoai;
        nguoiDung.AnhDaiDien = dto.AnhDaiDien;
        nguoiDung.DangHoatDong = dto.DangHoatDong;
        nguoiDung.NgayCapNhat = DateTime.UtcNow;
        var ketQuaCapNhat = await _quanLyNguoiDung.UpdateAsync(nguoiDung);
        if (!ketQuaCapNhat.Succeeded)
            return BadRequest(PhanHoiApi.ThatBai("Cập nhật thất bại",
                ketQuaCapNhat.Errors.Select(e => e.Description).ToList()));

        var vaiTroHienTai = await _quanLyNguoiDung.GetRolesAsync(nguoiDung);
        if (!vaiTroHienTai.Contains(dto.VaiTro, StringComparer.OrdinalIgnoreCase))
        {
            var ketQuaGanVaiTro = await _quanLyNguoiDung.AddToRoleAsync(nguoiDung, dto.VaiTro);
            if (!ketQuaGanVaiTro.Succeeded)
                return BadRequest(PhanHoiApi.ThatBai("Gán vai trò mới thất bại",
                    ketQuaGanVaiTro.Errors.Select(e => e.Description).ToList()));

            var cacVaiTroCanXoa = vaiTroHienTai.Where(r => !string.Equals(r, dto.VaiTro, StringComparison.OrdinalIgnoreCase)).ToList();
            if (cacVaiTroCanXoa.Count > 0)
                await _quanLyNguoiDung.RemoveFromRolesAsync(nguoiDung, cacVaiTroCanXoa);
        }

        if (!dto.DangHoatDong)
        {
            await _donViCongViec.MaLamMois.TruyVan()
                .Where(r => r.NguoiDungId == id && !r.DaBiThuHoi)
                .ExecuteUpdateAsync(s => s.SetProperty(r => r.DaBiThuHoi, true));
        }

        return Ok(PhanHoiApi.ThanhCongKetQua("Cập nhật thành công"));
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Xoa(Guid id)
    {
        var idHienTai = IdNguoiDungGuidHoacNull;
        if (idHienTai == id)
            return BadRequest(PhanHoiApi.ThatBai("Không thể xóa tài khoản đang đăng nhập"));

        var nguoiDung = await _quanLyNguoiDung.FindByIdAsync(id.ToString());
        if (nguoiDung == null)
            return NotFound(PhanHoiApi.ThatBai("Không tìm thấy người dùng"));

        var coBaiViet = await _donViCongViec.BaiViets.TruyVan().AnyAsync(a => a.TacGiaId == id);
        if (coBaiViet)
            return BadRequest(PhanHoiApi.ThatBai("Không thể xóa người dùng có bài viết. Vui lòng chuyển bài viết sang tác giả khác trước"));

        var coPhuongTien = await _donViCongViec.PhuongTiens.TruyVan().AnyAsync(m => m.NguoiTaiLenId == id);
        if (coPhuongTien)
            return BadRequest(PhanHoiApi.ThatBai("Không thể xóa người dùng có tệp phương tiện. Vui lòng xóa phương tiện trước"));

        nguoiDung.DangHoatDong = false;
        nguoiDung.NgayCapNhat = DateTime.UtcNow;
        await _quanLyNguoiDung.UpdateAsync(nguoiDung);

        await _donViCongViec.MaLamMois.TruyVan()
            .Where(r => r.NguoiDungId == id && !r.DaBiThuHoi)
            .ExecuteUpdateAsync(s => s.SetProperty(r => r.DaBiThuHoi, true));

        return Ok(PhanHoiApi.ThanhCongKetQua("Vô hiệu hóa tài khoản thành công"));
    }
}
