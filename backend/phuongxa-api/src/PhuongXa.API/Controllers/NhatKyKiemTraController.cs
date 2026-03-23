using AutoMapper;
using PhuongXa.API.TienIch;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PhuongXa.Application.Chung;
using PhuongXa.Application.DTOs.NhatKy;
using PhuongXa.Application.CacGiaoDien;
using PhuongXa.Domain.CacThucThe;

namespace PhuongXa.API.Controllers;

[ApiController]
[Route("api/audit-logs")]
[Authorize(Roles = "Admin")]
public class NhatKyKiemTraController : BaseApiController
{
    private readonly IDonViCongViec _donViCongViec;
    private readonly IMapper _anhXa;

    public NhatKyKiemTraController(IDonViCongViec donViCongViec, IMapper anhXa)
    {
        _donViCongViec = donViCongViec;
        _anhXa = anhXa;
    }

    [HttpGet]
    public async Task<IActionResult> LayTatCa([FromQuery] string? tenThucThe,
        [FromQuery] Guid? idNguoiDung, [FromQuery] DateTime? tuNgay, [FromQuery] DateTime? denNgay,
        [FromQuery] int trang = 1, [FromQuery] int kichThuocTrang = 50)
    {
        (trang, kichThuocTrang) = ChuanHoaPhanTrang(trang, kichThuocTrang, maxPageSize: 200);

        IQueryable<NhatKyKiemTra> truyVan = _donViCongViec.NhatKys.TruyVan().AsNoTracking().Include(a => a.NguoiDung);

        if (!string.IsNullOrEmpty(tenThucThe))
            truyVan = truyVan.Where(a => a.TenThucThe == tenThucThe);
        if (idNguoiDung.HasValue)
            truyVan = truyVan.Where(a => a.NguoiDungId == idNguoiDung);
        if (tuNgay.HasValue)
            truyVan = truyVan.Where(a => a.ThoiGian >= tuNgay.Value.ToUniversalTime());
        if (denNgay.HasValue)
            truyVan = truyVan.Where(a => a.ThoiGian <= denNgay.Value.ToUniversalTime());

        var ketQua = await truyVan
            .OrderByDescending(a => a.ThoiGian)
            .PhanTrangAsync<NhatKyKiemTra, NhatKyKiemTraDto>(trang, kichThuocTrang, _anhXa);

        return Ok(PhanHoiApi<KetQuaPhanTrang<NhatKyKiemTraDto>>.ThanhCongKetQua(ketQua));
    }
}
