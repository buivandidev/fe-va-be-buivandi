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

namespace PhuongXa.API.Controllers.Public;
[Route("api/public/services")]
public class PublicServicesController : BaseApiController
{
    private readonly IDonViCongViec _donViCongViec;
    private readonly IMapper _anhXa;
    public PublicServicesController(IDonViCongViec donViCongViec, IMapper anhXa)
    {
        _donViCongViec = donViCongViec;
        _anhXa = anhXa;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> LayDanhSach([FromQuery] string? tuKhoa, [FromQuery] Guid? danhMucId, [FromQuery] bool chiLayDangHoatDong = true, [FromQuery] int trang = 1, [FromQuery] int kichThuocTrang = 20, CancellationToken ct = default)
    {
        (trang, kichThuocTrang) = ChuanHoaPhanTrang(trang, kichThuocTrang, 100);
        var truyVan = _donViCongViec.DichVus.TruyVan().AsNoTracking().Include(x => x.DanhMuc).AsQueryable();
        if (!string.IsNullOrWhiteSpace(tuKhoa))
        {
            var khoa = tuKhoa.Trim().ToLower();
            truyVan = truyVan.Where(x => x.Ten.ToLower().Contains(khoa) || x.MaDichVu.ToLower().Contains(khoa) || (x.MoTa != null && x.MoTa.ToLower().Contains(khoa)));
        }

        if (danhMucId.HasValue)
            truyVan = truyVan.Where(x => x.DanhMucId == danhMucId.Value);
        if (!VaiTroTienIch.LaQuanTriHoacBienTap(User) || chiLayDangHoatDong)
            truyVan = truyVan.Where(x => x.DangHoatDong);
        truyVan = truyVan.OrderBy(x => x.ThuTuSapXep).ThenBy(x => x.Ten);
        var tongSo = await truyVan.CountAsync(ct);
        var danhSach = await truyVan.Skip((trang - 1) * kichThuocTrang).Take(kichThuocTrang).ToListAsync(ct);
        var duLieu = _anhXa.Map<List<DichVuDto>>(danhSach);
        return Ok(PhanHoiApi<KetQuaPhanTrang<DichVuDto>>.ThanhCongKetQua(new KetQuaPhanTrang<DichVuDto> { DanhSach = duLieu, TongSo = tongSo, Trang = trang, KichThuocTrang = kichThuocTrang }));
    }

    [HttpGet("{id:guid}")]
    [AllowAnonymous]
    public async Task<IActionResult> LayTheoId(Guid id, CancellationToken ct)
    {
        var dichVu = await _donViCongViec.DichVus.TruyVan().AsNoTracking().Include(x => x.DanhMuc).FirstOrDefaultAsync(x => x.Id == id, ct);
        if (dichVu is null)
            return NotFound(PhanHoiApi.ThatBai("Khong tim thay dich vu"));
        if (!VaiTroTienIch.LaQuanTriHoacBienTap(User) && !dichVu.DangHoatDong)
            return NotFound(PhanHoiApi.ThatBai("Khong tim thay dich vu"));
        return Ok(PhanHoiApi<DichVuDto>.ThanhCongKetQua(_anhXa.Map<DichVuDto>(dichVu)));
    }

    [HttpGet("code/{maDichVu}")]
    [AllowAnonymous]
    public async Task<IActionResult> LayTheoMa(string maDichVu, CancellationToken ct)
    {
        var dichVu = await _donViCongViec.DichVus.TruyVan().AsNoTracking().Include(x => x.DanhMuc).FirstOrDefaultAsync(x => x.MaDichVu == maDichVu, ct);
        if (dichVu is null)
            return NotFound(PhanHoiApi.ThatBai("Khong tim thay dich vu"));
        if (!VaiTroTienIch.LaQuanTriHoacBienTap(User) && !dichVu.DangHoatDong)
            return NotFound(PhanHoiApi.ThatBai("Khong tim thay dich vu"));
        return Ok(PhanHoiApi<DichVuDto>.ThanhCongKetQua(_anhXa.Map<DichVuDto>(dichVu)));
    }

    [HttpGet("by-code/{maDichVu}")]
    [AllowAnonymous]
    public async Task<IActionResult> LayTheoMaTuongThich(string maDichVu, CancellationToken ct)
    {
        return await LayTheoMa(maDichVu, ct);
    }
}