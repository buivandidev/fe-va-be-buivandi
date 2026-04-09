using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PhuongXa.API.TienIch;
using PhuongXa.Application.CacGiaoDien;
using PhuongXa.Application.Chung;
using PhuongXa.Application.DTOs.BinhLuan;
using PhuongXa.Domain.CacKieuLietKe;
using PhuongXa.Domain.CacThucThe;
using PhuongXa.API.Controllers;

namespace PhuongXa.API.Controllers.Admin;
[Route("api/admin/comments")]
public class AdminCommentsController : BaseApiController
{
    private readonly IDonViCongViec _donViCongViec;
    private readonly IMapper _anhXa;
    private readonly IDichVuLamSachHtml _dichVuLamSachHtml;
    public AdminCommentsController(IDonViCongViec donViCongViec, IMapper anhXa, IDichVuLamSachHtml dichVuLamSachHtml)
    {
        _donViCongViec = donViCongViec;
        _anhXa = anhXa;
        _dichVuLamSachHtml = dichVuLamSachHtml;
    }

    [HttpGet]
    [Authorize(Roles = HangSoPhanQuyen.QuanTriHoacBienTap)]
    public async Task<IActionResult> LayDanhSach([FromQuery] bool? daDuyet, [FromQuery] int trang = 1, [FromQuery] int kichThuocTrang = 20, CancellationToken ct = default)
    {
        (trang, kichThuocTrang) = ChuanHoaPhanTrang(trang, kichThuocTrang, 100);
        var truyVan = _donViCongViec.BinhLuans.TruyVan()
            .AsNoTracking()
            .Include(x => x.NguoiDung)
            .Include(x => x.BaiViet)
            .AsQueryable();
        if (daDuyet.HasValue)
            truyVan = truyVan.Where(x => x.DaDuyet == daDuyet.Value);
        var tongSo = await truyVan.CountAsync(ct);
        var danhSach = await truyVan
            .OrderByDescending(x => x.NgayTao)
            .Skip((trang - 1) * kichThuocTrang)
            .Take(kichThuocTrang)
            .ToListAsync(ct);
        var duLieu = _anhXa.Map<List<BinhLuanDto>>(danhSach);
        return Ok(PhanHoiApi<KetQuaPhanTrang<BinhLuanDto>>.ThanhCongKetQua(new KetQuaPhanTrang<BinhLuanDto>
        {
            DanhSach = duLieu,
            TongSo = tongSo,
            Trang = trang,
            KichThuocTrang = kichThuocTrang
        }));
    }

    [HttpPatch("{id:guid}/approve")]
    [Authorize(Roles = HangSoPhanQuyen.QuanTriHoacBienTap)]
    public async Task<IActionResult> Duyet(Guid id, CancellationToken ct)
    {
        var binhLuan = await _donViCongViec.BinhLuans.LayTheoIdAsync(id, ct);
        if (binhLuan is null)
            return NotFound(PhanHoiApi.ThatBai("Khong tim thay binh luan"));
        binhLuan.DaDuyet = true;
        binhLuan.NgayCapNhat = DateTime.UtcNow;
        _donViCongViec.BinhLuans.CapNhat(binhLuan);
        await _donViCongViec.LuuThayDoiAsync(ct);
        return Ok(PhanHoiApi.ThanhCongKetQua("Duyet binh luan thanh cong"));
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = HangSoPhanQuyen.QuanTriHoacBienTap)]
    public async Task<IActionResult> Xoa(Guid id, CancellationToken ct)
    {
        var binhLuan = await _donViCongViec.BinhLuans.LayTheoIdAsync(id, ct);
        if (binhLuan is null)
            return NotFound(PhanHoiApi.ThatBai("Khong tim thay binh luan"));
        _donViCongViec.BinhLuans.Xoa(binhLuan);
        await _donViCongViec.LuuThayDoiAsync(ct);
        return Ok(PhanHoiApi.ThanhCongKetQua("Xoa binh luan thanh cong"));
    }
}
