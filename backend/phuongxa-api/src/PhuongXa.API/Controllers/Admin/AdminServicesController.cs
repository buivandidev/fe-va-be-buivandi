using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PhuongXa.API.TienIch;
using PhuongXa.Application.CacGiaoDien;
using PhuongXa.Application.Chung;
using PhuongXa.Application.DTOs.DichVu;
using PhuongXa.Domain.CacThucThe;
using PhuongXa.API.Controllers;

namespace PhuongXa.API.Controllers.Admin;
[Route("api/admin/services")]
public class AdminServicesController : BaseApiController
{
    private readonly IDonViCongViec _donViCongViec;
    private readonly IMapper _anhXa;
    public AdminServicesController(IDonViCongViec donViCongViec, IMapper anhXa)
    {
        _donViCongViec = donViCongViec;
        _anhXa = anhXa;
    }

    [HttpGet("admin")]
    [Authorize(Roles = HangSoPhanQuyen.QuanTriHoacBienTap)]
    public async Task<IActionResult> LayDanhSachQuanTri([FromQuery] string? timKiem, [FromQuery] Guid? danhMucId, [FromQuery] bool? dangHoatDong, [FromQuery] int trang = 1, [FromQuery] int kichThuocTrang = 20, CancellationToken ct = default)
    {
        (trang, kichThuocTrang) = ChuanHoaPhanTrang(trang, kichThuocTrang, 100);
        var truyVan = _donViCongViec.DichVus.TruyVan().AsNoTracking().Include(x => x.DanhMuc).AsQueryable();
        if (!string.IsNullOrWhiteSpace(timKiem))
        {
            var khoa = timKiem.Trim().ToLower();
            truyVan = truyVan.Where(x => x.Ten.ToLower().Contains(khoa) || x.MaDichVu.ToLower().Contains(khoa) || (x.MoTa != null && x.MoTa.ToLower().Contains(khoa)));
        }

        if (danhMucId.HasValue)
            truyVan = truyVan.Where(x => x.DanhMucId == danhMucId.Value);
        if (dangHoatDong.HasValue)
            truyVan = truyVan.Where(x => x.DangHoatDong == dangHoatDong.Value);
        var ketQua = await truyVan.OrderBy(x => x.ThuTuSapXep).ThenBy(x => x.Ten).PhanTrangAsync<DichVu, DichVuDto>(trang, kichThuocTrang, _anhXa);
        return Ok(PhanHoiApi<KetQuaPhanTrang<DichVuDto>>.ThanhCongKetQua(ketQua));
    }

    [HttpPost]
    [Authorize(Roles = HangSoPhanQuyen.QuanTriHoacBienTap)]
    public async Task<IActionResult> TaoMoi([FromBody] TaoDichVuDto yeuCau, CancellationToken ct)
    {
        var maDichVuDaTonTai = await _donViCongViec.DichVus.TruyVan().AnyAsync(x => x.MaDichVu == yeuCau.MaDichVu, ct);
        if (maDichVuDaTonTai)
            return BadRequest(PhanHoiApi.ThatBai("Ma dich vu da ton tai"));
        var dichVu = _anhXa.Map<DichVu>(yeuCau);
        await _donViCongViec.DichVus.ThemAsync(dichVu, ct);
        await _donViCongViec.LuuThayDoiAsync(ct);
        return Ok(PhanHoiApi<object>.ThanhCongKetQua(new { dichVu.Id }, "Tao dich vu thanh cong"));
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = HangSoPhanQuyen.QuanTriHoacBienTap)]
    public async Task<IActionResult> CapNhat(Guid id, [FromBody] CapNhatDichVuDto yeuCau, CancellationToken ct)
    {
        var dichVu = await _donViCongViec.DichVus.LayTheoIdAsync(id, ct);
        if (dichVu is null)
            return NotFound(PhanHoiApi.ThatBai("Khong tim thay dich vu"));
        var maDichVuDaTonTai = await _donViCongViec.DichVus.TruyVan().AnyAsync(x => x.Id != id && x.MaDichVu == yeuCau.MaDichVu, ct);
        if (maDichVuDaTonTai)
            return BadRequest(PhanHoiApi.ThatBai("Ma dich vu da ton tai"));
        _anhXa.Map(yeuCau, dichVu);
        dichVu.NgayCapNhat = DateTime.UtcNow;
        _donViCongViec.DichVus.CapNhat(dichVu);
        await _donViCongViec.LuuThayDoiAsync(ct);
        return Ok(PhanHoiApi.ThanhCongKetQua("Cap nhat dich vu thanh cong"));
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = HangSoPhanQuyen.QuanTriHoacBienTap)]
    public async Task<IActionResult> Xoa(Guid id, CancellationToken ct)
    {
        var dichVu = await _donViCongViec.DichVus.LayTheoIdAsync(id, ct);
        if (dichVu is null)
            return NotFound(PhanHoiApi.ThatBai("Khong tim thay dich vu"));
        var coHoSoLienKet = await _donViCongViec.DonUngs.TruyVan().AnyAsync(x => x.DichVuId == id, ct);
        if (coHoSoLienKet)
            return BadRequest(PhanHoiApi.ThatBai("Khong the xoa dich vu dang co ho so lien ket"));
        _donViCongViec.DichVus.Xoa(dichVu);
        await _donViCongViec.LuuThayDoiAsync(ct);
        return Ok(PhanHoiApi.ThanhCongKetQua("Xoa dich vu thanh cong"));
    }
}