using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PhuongXa.Application.CacGiaoDien;
using PhuongXa.Application.Chung;
using PhuongXa.Application.DTOs.NhatKy;
using PhuongXa.API.Controllers;

namespace PhuongXa.API.Controllers.Admin;
[Route("api/admin/audit-logs")]
[Authorize(Roles = HangSoPhanQuyen.QuanTriHoacBienTap)]
public class AuditLogsController : BaseApiController
{
    private readonly IDonViCongViec _donViCongViec;
    private readonly IMapper _anhXa;
    public AuditLogsController(IDonViCongViec donViCongViec, IMapper anhXa)
    {
        _donViCongViec = donViCongViec;
        _anhXa = anhXa;
    }

    [HttpGet]
    public async Task<IActionResult> LayDanhSach([FromQuery] string? tenThucThe, [FromQuery] Guid? nguoiDungId, [FromQuery] int trang = 1, [FromQuery] int kichThuocTrang = 50, CancellationToken ct = default)
    {
        (trang, kichThuocTrang) = ChuanHoaPhanTrang(trang, kichThuocTrang, 200);
        var truyVan = _donViCongViec.NhatKys.TruyVan().AsNoTracking().AsQueryable();
        if (!string.IsNullOrWhiteSpace(tenThucThe))
            truyVan = truyVan.Where(x => x.TenThucThe == tenThucThe);
        if (nguoiDungId.HasValue)
            truyVan = truyVan.Where(x => x.NguoiDungId == nguoiDungId);
        var tongSo = await truyVan.CountAsync(ct);
        var danhSach = await truyVan.OrderByDescending(x => x.ThoiGian).Skip((trang - 1) * kichThuocTrang).Take(kichThuocTrang).ToListAsync(ct);
        return Ok(PhanHoiApi<KetQuaPhanTrang<NhatKyKiemTraDto>>.ThanhCongKetQua(new KetQuaPhanTrang<NhatKyKiemTraDto> { DanhSach = _anhXa.Map<List<NhatKyKiemTraDto>>(danhSach), TongSo = tongSo, Trang = trang, KichThuocTrang = kichThuocTrang }));
    }
}