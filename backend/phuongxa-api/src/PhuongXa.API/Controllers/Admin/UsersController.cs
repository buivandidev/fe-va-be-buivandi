using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PhuongXa.API.TienIch;
using PhuongXa.Application.CacGiaoDien;
using PhuongXa.Application.Chung;
using PhuongXa.Application.DTOs.NguoiDung;
using PhuongXa.Domain.CacThucThe;
using PhuongXa.API.Controllers;

namespace PhuongXa.API.Controllers.Admin;
[Route("api/admin/users")]
[Authorize(Roles = HangSoPhanQuyen.QuanTriHeThong)]
public class UsersController : BaseApiController
{
    private readonly UserManager<NguoiDung> _quanLyNguoiDung;
    private readonly RoleManager<VaiTro> _quanLyVaiTro;
    private readonly IDonViCongViec _donViCongViec;
    private readonly IMapper _anhXa;
    public UsersController(UserManager<NguoiDung> quanLyNguoiDung, RoleManager<VaiTro> quanLyVaiTro, IDonViCongViec donViCongViec, IMapper anhXa)
    {
        _quanLyNguoiDung = quanLyNguoiDung;
        _quanLyVaiTro = quanLyVaiTro;
        _donViCongViec = donViCongViec;
        _anhXa = anhXa;
    }

    [HttpGet]
    public async Task<IActionResult> LayDanhSach([FromQuery] string? tuKhoa, [FromQuery] int trang = 1, [FromQuery] int kichThuocTrang = 20, CancellationToken ct = default)
    {
        (trang, kichThuocTrang) = ChuanHoaPhanTrang(trang, kichThuocTrang, 100);
        var truyVan = _quanLyNguoiDung.Users.AsNoTracking();
        if (!string.IsNullOrWhiteSpace(tuKhoa))
        {
            var khoa = tuKhoa.Trim().ToLower();
            truyVan = truyVan.Where(x => x.HoTen.ToLower().Contains(khoa) || (x.Email != null && x.Email.ToLower().Contains(khoa)));
        }

        var tongSo = await truyVan.CountAsync(ct);
        var danhSachNguoiDung = await truyVan.OrderByDescending(x => x.NgayTao).Skip((trang - 1) * kichThuocTrang).Take(kichThuocTrang).ToListAsync(ct);
        var bangVaiTro = await _donViCongViec.LayVaiTroNguoiDungAsync(danhSachNguoiDung.Select(x => x.Id).ToList(), ct);
        var ketQua = _anhXa.Map<List<NguoiDungDto>>(danhSachNguoiDung);
        foreach (var nguoiDung in ketQua)
            nguoiDung.DanhSachVaiTro = bangVaiTro.TryGetValue(nguoiDung.Id, out var vaiTro) ? vaiTro : [];
        return Ok(PhanHoiApi<KetQuaPhanTrang<NguoiDungDto>>.ThanhCongKetQua(new KetQuaPhanTrang<NguoiDungDto> { DanhSach = ketQua, TongSo = tongSo, Trang = trang, KichThuocTrang = kichThuocTrang }));
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> LayTheoId(Guid id)
    {
        var nguoiDung = await _quanLyNguoiDung.FindByIdAsync(id.ToString());
        if (nguoiDung is null)
            return NotFound(PhanHoiApi.ThatBai("Khong tim thay nguoi dung"));
        var vaiTro = await _quanLyNguoiDung.GetRolesAsync(nguoiDung);
        var dto = _anhXa.Map<NguoiDungDto>(nguoiDung);
        dto.DanhSachVaiTro = vaiTro.ToList();
        return Ok(PhanHoiApi<NguoiDungDto>.ThanhCongKetQua(dto));
    }

    [HttpPost]
    public async Task<IActionResult> TaoMoi([FromBody] TaoNguoiDungDto yeuCau)
    {
        var daTonTai = await _quanLyNguoiDung.FindByEmailAsync(yeuCau.Email.Trim());
        if (daTonTai is not null)
            return BadRequest(PhanHoiApi.ThatBai("Email da duoc su dung"));
        var vaiTro = VaiTroTienIch.ChuanHoaVaiTro(yeuCau.VaiTro);
        await DamBaoVaiTroTonTaiAsync(vaiTro);
        var nguoiDung = new NguoiDung
        {
            HoTen = yeuCau.HoTen.Trim(),
            Email = yeuCau.Email.Trim(),
            UserName = yeuCau.Email.Trim(),
            PhoneNumber = yeuCau.SoDienThoai,
            DangHoatDong = yeuCau.DangHoatDong,
            EmailConfirmed = true
        };
        var ketQuaTao = await _quanLyNguoiDung.CreateAsync(nguoiDung, yeuCau.MatKhau);
        if (!ketQuaTao.Succeeded)
            return BadRequest(PhanHoiApi.ThatBai("Tao tai khoan that bai", ketQuaTao.Errors.Select(e => e.Description).ToList()));
        var ketQuaVaiTro = await _quanLyNguoiDung.AddToRoleAsync(nguoiDung, vaiTro);
        if (!ketQuaVaiTro.Succeeded)
            return BadRequest(PhanHoiApi.ThatBai("Gan vai tro that bai", ketQuaVaiTro.Errors.Select(e => e.Description).ToList()));
        return Ok(PhanHoiApi<object>.ThanhCongKetQua(new { nguoiDung.Id }, "Tao tai khoan thanh cong"));
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> CapNhat(Guid id, [FromBody] CapNhatNguoiDungDto yeuCau)
    {
        var nguoiDung = await _quanLyNguoiDung.FindByIdAsync(id.ToString());
        if (nguoiDung is null)
            return NotFound(PhanHoiApi.ThatBai("Khong tim thay nguoi dung"));
        nguoiDung.HoTen = yeuCau.HoTen.Trim();
        nguoiDung.PhoneNumber = yeuCau.SoDienThoai;
        nguoiDung.AnhDaiDien = yeuCau.AnhDaiDien;
        nguoiDung.DangHoatDong = yeuCau.DangHoatDong;
        nguoiDung.NgayCapNhat = DateTime.UtcNow;
        var vaiTroMoi = VaiTroTienIch.ChuanHoaVaiTro(yeuCau.VaiTro);
        await DamBaoVaiTroTonTaiAsync(vaiTroMoi);
        var vaiTroHienTai = await _quanLyNguoiDung.GetRolesAsync(nguoiDung);
        if (vaiTroHienTai.Count > 0)
        {
            var boVaiTro = await _quanLyNguoiDung.RemoveFromRolesAsync(nguoiDung, vaiTroHienTai);
            if (!boVaiTro.Succeeded)
                return BadRequest(PhanHoiApi.ThatBai("Cap nhat vai tro that bai", boVaiTro.Errors.Select(e => e.Description).ToList()));
        }

        var themVaiTro = await _quanLyNguoiDung.AddToRoleAsync(nguoiDung, vaiTroMoi);
        if (!themVaiTro.Succeeded)
            return BadRequest(PhanHoiApi.ThatBai("Cap nhat vai tro that bai", themVaiTro.Errors.Select(e => e.Description).ToList()));
        var ketQua = await _quanLyNguoiDung.UpdateAsync(nguoiDung);
        if (!ketQua.Succeeded)
            return BadRequest(PhanHoiApi.ThatBai("Cap nhat nguoi dung that bai", ketQua.Errors.Select(e => e.Description).ToList()));
        return Ok(PhanHoiApi.ThanhCongKetQua("Cap nhat thanh cong"));
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> VoHieuHoa(Guid id, CancellationToken ct)
    {
        if (id == IdNguoiDungHienTai)
            return BadRequest(PhanHoiApi.ThatBai("Khong the vo hieu hoa tai khoan dang dang nhap"));
        var nguoiDung = await _quanLyNguoiDung.FindByIdAsync(id.ToString());
        if (nguoiDung is null)
            return NotFound(PhanHoiApi.ThatBai("Khong tim thay nguoi dung"));
        nguoiDung.DangHoatDong = false;
        nguoiDung.LockoutEnabled = true;
        nguoiDung.LockoutEnd = DateTimeOffset.UtcNow.AddYears(100);
        nguoiDung.NgayCapNhat = DateTime.UtcNow;
        var ketQua = await _quanLyNguoiDung.UpdateAsync(nguoiDung);
        if (!ketQua.Succeeded)
            return BadRequest(PhanHoiApi.ThatBai("Vo hieu hoa tai khoan that bai", ketQua.Errors.Select(e => e.Description).ToList()));
        var danhSachToken = await _donViCongViec.MaLamMois.TruyVan().Where(x => x.NguoiDungId == nguoiDung.Id && !x.DaBiThuHoi).ToListAsync(ct);
        foreach (var token in danhSachToken)
        {
            token.DaBiThuHoi = true;
            _donViCongViec.MaLamMois.CapNhat(token);
        }

        if (danhSachToken.Count > 0)
            await _donViCongViec.LuuThayDoiAsync(ct);
        return Ok(PhanHoiApi.ThanhCongKetQua("Vo hieu hoa tai khoan thanh cong"));
    }

    private async Task DamBaoVaiTroTonTaiAsync(string vaiTro)
    {
        if (!await _quanLyVaiTro.RoleExistsAsync(vaiTro))
            await _quanLyVaiTro.CreateAsync(new VaiTro { Name = vaiTro });
    }
}