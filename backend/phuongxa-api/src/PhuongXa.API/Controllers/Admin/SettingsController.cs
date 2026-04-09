using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PhuongXa.Application.CacGiaoDien;
using PhuongXa.Application.Chung;
using PhuongXa.Application.DTOs.CaiDat;
using PhuongXa.Domain.CacThucThe;
using PhuongXa.API.Controllers;

namespace PhuongXa.API.Controllers.Admin;
[Route("api/admin/settings")]
public class SettingsController : BaseApiController
{
    private readonly IDonViCongViec _donViCongViec;
    private readonly IMapper _anhXa;
    public SettingsController(IDonViCongViec donViCongViec, IMapper anhXa)
    {
        _donViCongViec = donViCongViec;
        _anhXa = anhXa;
    }

    [HttpGet]
    [Authorize(Roles = HangSoPhanQuyen.QuanTriHeThong)]
    public async Task<IActionResult> LayDanhSach(CancellationToken ct)
    {
        var danhSach = await _donViCongViec.CaiDats.TruyVan()
            .AsNoTracking()
            .OrderBy(x => x.Khoa)
            .ToListAsync(ct);
        var duLieu = _anhXa.Map<List<CaiDatTrangWebDto>>(danhSach);
        return Ok(PhanHoiApi<List<CaiDatTrangWebDto>>.ThanhCongKetQua(duLieu));
    }

    [HttpPut("{khoa}")]
    [Authorize(Roles = HangSoPhanQuyen.QuanTriHeThong)]
    public async Task<IActionResult> CapNhatTheoKhoa(string khoa, [FromBody] CapNhatCaiDatTrangWebDto yeuCau, CancellationToken ct)
    {
        var caiDat = await _donViCongViec.CaiDats.TruyVan().FirstOrDefaultAsync(x => x.Khoa == khoa, ct);
        if (caiDat is null)
            return NotFound(PhanHoiApi.ThatBai("Khong tim thay cai dat"));
        caiDat.GiaTri = yeuCau.GiaTri ?? string.Empty;
        caiDat.NgayCapNhat = DateTime.UtcNow;
        _donViCongViec.CaiDats.CapNhat(caiDat);
        await _donViCongViec.LuuThayDoiAsync(ct);
        return Ok(PhanHoiApi.ThanhCongKetQua("Cap nhat cai dat thanh cong"));
    }

    [HttpPost]
    [Authorize(Roles = HangSoPhanQuyen.QuanTriHeThong)]
    public async Task<IActionResult> TaoMoi([FromBody] CaiDatTrangWebDto yeuCau, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(yeuCau.Khoa))
            return BadRequest(PhanHoiApi.ThatBai("Khoa cai dat la bat buoc"));
        var daTonTai = await _donViCongViec.CaiDats.TruyVan().AnyAsync(x => x.Khoa == yeuCau.Khoa, ct);
        if (daTonTai)
            return BadRequest(PhanHoiApi.ThatBai("Khoa cai dat da ton tai"));
        var caiDat = new CaiDatTrangWeb
        {
            Khoa = yeuCau.Khoa.Trim(),
            GiaTri = yeuCau.GiaTri ?? string.Empty,
            Loai = yeuCau.Loai,
            NgayCapNhat = DateTime.UtcNow
        };
        await _donViCongViec.CaiDats.ThemAsync(caiDat, ct);
        await _donViCongViec.LuuThayDoiAsync(ct);
        return Ok(PhanHoiApi<object>.ThanhCongKetQua(new { caiDat.Id, caiDat.Khoa }, "Tao cai dat thanh cong"));
    }

    [HttpDelete("{khoa}")]
    [Authorize(Roles = HangSoPhanQuyen.QuanTriHeThong)]
    public async Task<IActionResult> Xoa(string khoa, CancellationToken ct)
    {
        var caiDat = await _donViCongViec.CaiDats.TruyVan().FirstOrDefaultAsync(x => x.Khoa == khoa, ct);
        if (caiDat is null)
            return NotFound(PhanHoiApi.ThatBai("Khong tim thay cai dat"));
        _donViCongViec.CaiDats.Xoa(caiDat);
        await _donViCongViec.LuuThayDoiAsync(ct);
        return Ok(PhanHoiApi.ThanhCongKetQua("Xoa cai dat thanh cong"));
    }
}