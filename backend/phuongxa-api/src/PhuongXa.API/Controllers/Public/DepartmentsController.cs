using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PhuongXa.Application.CacGiaoDien;
using PhuongXa.Application.Chung;
using PhuongXa.Application.DTOs.PhongBan;
using PhuongXa.Domain.CacThucThe;
using PhuongXa.API.Controllers;

namespace PhuongXa.API.Controllers.Public;
[Route("api/public/departments")]
public class DepartmentsController : BaseApiController
{
    private readonly IDonViCongViec _donViCongViec;
    private readonly IMapper _anhXa;
    public DepartmentsController(IDonViCongViec donViCongViec, IMapper anhXa)
    {
        _donViCongViec = donViCongViec;
        _anhXa = anhXa;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> LayDanhSach([FromQuery] bool? dangHoatDong, CancellationToken ct)
    {
        var truyVan = _donViCongViec.PhongBans.TruyVan().AsNoTracking().AsQueryable();
        if (dangHoatDong.HasValue)
            truyVan = truyVan.Where(x => x.DangHoatDong == dangHoatDong.Value);
        var danhSach = await truyVan.OrderBy(x => x.Ten).ToListAsync(ct);
        return Ok(PhanHoiApi<List<PhongBanDto>>.ThanhCongKetQua(_anhXa.Map<List<PhongBanDto>>(danhSach)));
    }

    [HttpGet("{id:guid}")]
    [AllowAnonymous]
    public async Task<IActionResult> LayTheoId(Guid id, CancellationToken ct)
    {
        var phongBan = await _donViCongViec.PhongBans.LayTheoIdAsync(id, ct);
        if (phongBan is null)
            return NotFound(PhanHoiApi.ThatBai("Khong tim thay phong ban"));
        return Ok(PhanHoiApi<PhongBanDto>.ThanhCongKetQua(_anhXa.Map<PhongBanDto>(phongBan)));
    }
}