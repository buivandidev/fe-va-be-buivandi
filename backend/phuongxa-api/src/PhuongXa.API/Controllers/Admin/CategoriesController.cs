using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using Microsoft.EntityFrameworkCore;
using PhuongXa.API.TienIch;
using PhuongXa.Application.AnhXa;
using PhuongXa.Application.CacGiaoDien;
using PhuongXa.Application.Chung;
using PhuongXa.Application.DTOs.DanhMuc;
using PhuongXa.Domain.CacKieuLietKe;
using PhuongXa.Domain.CacThucThe;
using PhuongXa.API.Controllers;

namespace PhuongXa.API.Controllers.Admin;
[Route("api/admin/categories")]
public class CategoriesController : BaseApiController
{
    private readonly IDonViCongViec _donViCongViec;
    private readonly IMapper _anhXa;
    public CategoriesController(IDonViCongViec donViCongViec, IMapper anhXa)
    {
        _donViCongViec = donViCongViec;
        _anhXa = anhXa;
    }

    [HttpPost]
    [Authorize(Roles = HangSoPhanQuyen.QuanTriHoacBienTap)]
    public async Task<IActionResult> TaoMoi([FromBody] TaoDanhMucDto yeuCau, CancellationToken ct)
    {
        var duongDan = await TaoDuongDanDuyNhatAsync(yeuCau.Ten, null, ct);
        var danhMuc = _anhXa.Map<DanhMuc>(yeuCau);
        danhMuc.DuongDan = duongDan;
        await _donViCongViec.DanhMucs.ThemAsync(danhMuc, ct);
        await _donViCongViec.LuuThayDoiAsync(ct);
        var dto = _anhXa.Map<DanhMucDto>(danhMuc);
        return Ok(PhanHoiApi<DanhMucDto>.ThanhCongKetQua(dto, "Tao danh muc thanh cong"));
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = HangSoPhanQuyen.QuanTriHoacBienTap)]
    public async Task<IActionResult> CapNhat(Guid id, [FromBody] CapNhatDanhMucDto yeuCau, CancellationToken ct)
    {
        var danhMuc = await _donViCongViec.DanhMucs.LayTheoIdAsync(id, ct);
        if (danhMuc is null)
            return NotFound(PhanHoiApi.ThatBai("Khong tim thay danh muc"));
        _anhXa.Map(yeuCau, danhMuc);
        danhMuc.DuongDan = await TaoDuongDanDuyNhatAsync(yeuCau.Ten, danhMuc.Id, ct);
        danhMuc.NgayCapNhat = DateTime.UtcNow;
        _donViCongViec.DanhMucs.CapNhat(danhMuc);
        await _donViCongViec.LuuThayDoiAsync(ct);
        return Ok(PhanHoiApi<DanhMucDto>.ThanhCongKetQua(_anhXa.Map<DanhMucDto>(danhMuc), "Cap nhat danh muc thanh cong"));
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = HangSoPhanQuyen.QuanTriHoacBienTap)]
    public async Task<IActionResult> Xoa(Guid id, CancellationToken ct)
    {
        var danhMuc = await _donViCongViec.DanhMucs.LayTheoIdAsync(id, ct);
        if (danhMuc is null)
            return NotFound(PhanHoiApi.ThatBai("Khong tim thay danh muc"));
        var coDanhMucCon = await _donViCongViec.DanhMucs.TruyVan().AnyAsync(x => x.ChaId == id, ct);
        if (coDanhMucCon)
            return BadRequest(PhanHoiApi.ThatBai("Khong the xoa danh muc dang co danh muc con"));
        var coBaiViet = await _donViCongViec.BaiViets.TruyVan().AnyAsync(x => x.DanhMucId == id, ct);
        if (coBaiViet)
            return BadRequest(PhanHoiApi.ThatBai("Khong the xoa danh muc dang co bai viet"));
        var coDichVu = await _donViCongViec.DichVus.TruyVan().AnyAsync(x => x.DanhMucId == id, ct);
        if (coDichVu)
            return BadRequest(PhanHoiApi.ThatBai("Khong the xoa danh muc dang co dich vu"));
        _donViCongViec.DanhMucs.Xoa(danhMuc);
        await _donViCongViec.LuuThayDoiAsync(ct);
        return Ok(PhanHoiApi.ThanhCongKetQua("Xoa danh muc thanh cong"));
    }

    private async Task<string> TaoDuongDanDuyNhatAsync(string ten, Guid? idLoaiTru, CancellationToken ct)
    {
        var duongDanGoc = TaoDuongDan.TaoChuoi(ten);
        var duongDan = duongDanGoc;
        var dem = 2;
        while (await _donViCongViec.DanhMucs.TruyVan().AnyAsync(x => x.DuongDan == duongDan && (!idLoaiTru.HasValue || x.Id != idLoaiTru.Value), ct))
        {
            duongDan = $"{duongDanGoc}-{dem}";
            dem++;
        }

        return duongDan;
    }
}