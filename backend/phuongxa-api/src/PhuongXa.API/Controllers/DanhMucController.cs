using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using Microsoft.EntityFrameworkCore;
using PhuongXa.Application.Chung;
using PhuongXa.Application.DTOs.DanhMuc;
using PhuongXa.Application.CacGiaoDien;
using PhuongXa.Domain.CacThucThe;
using PhuongXa.Domain.CacKieuLietKe;

namespace PhuongXa.API.Controllers;

[ApiController]
[Route("api/categories")]
public class DanhMucController : BaseApiController
{
    private readonly IDonViCongViec _donViCongViec;
    private readonly IMapper _anhXa;

    public DanhMucController(IDonViCongViec donViCongViec, IMapper anhXa)
    {
        _donViCongViec = donViCongViec;
        _anhXa = anhXa;
    }

    [HttpGet]
    [OutputCache(PolicyName = "Public-Medium")]
    public async Task<IActionResult> LayTatCa([FromQuery] LoaiDanhMuc? loai)
    {
        var truyVan = _donViCongViec.DanhMucs.TruyVan().AsNoTracking()
            .Include(c => c.Cha)
            .Include(c => c.DanhSachCon)
            .Where(c => c.DangHoatDong)
            .AsQueryable();

        if (loai.HasValue)
            truyVan = truyVan.Where(c => c.Loai == loai.Value);

        var danhMucs = await truyVan.OrderBy(c => c.ThuTuSapXep).ToListAsync();
        return Ok(PhanHoiApi<List<DanhMucDto>>.ThanhCongKetQua(_anhXa.Map<List<DanhMucDto>>(danhMucs)));
    }

    [HttpGet("tree")]
    [OutputCache(PolicyName = "Public-Medium")]
    public async Task<IActionResult> LayCayDanhMuc([FromQuery] LoaiDanhMuc? loai)
    {
        var truyVan = _donViCongViec.DanhMucs.TruyVan().AsNoTracking()
            .Include(c => c.DanhSachCon)
            .Where(c => c.DangHoatDong && c.ChaId == null)
            .AsQueryable();

        if (loai.HasValue)
            truyVan = truyVan.Where(c => c.Loai == loai.Value);

        var danhMucs = await truyVan.OrderBy(c => c.ThuTuSapXep).ToListAsync();
        return Ok(PhanHoiApi<List<DanhMucDto>>.ThanhCongKetQua(_anhXa.Map<List<DanhMucDto>>(danhMucs)));
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> LayTheoId(Guid id)
    {
        var danhMuc = await _donViCongViec.DanhMucs.TruyVan().AsNoTracking()
            .Include(c => c.Cha)
            .Include(c => c.DanhSachCon)
            .FirstOrDefaultAsync(c => c.Id == id);

        if (danhMuc == null)
            return NotFound(PhanHoiApi.ThatBai("Không tìm thấy danh mục"));
        return Ok(PhanHoiApi<DanhMucDto>.ThanhCongKetQua(_anhXa.Map<DanhMucDto>(danhMuc)));
    }

    [HttpPost]
    [Authorize(Roles = "Admin,Editor")]
    public async Task<IActionResult> Tao([FromBody] TaoDanhMucDto dto)
    {
        var danhMuc = _anhXa.Map<DanhMuc>(dto);
        if (await _donViCongViec.DanhMucs.TruyVan().AnyAsync(c => c.DuongDan == danhMuc.DuongDan))
            danhMuc.DuongDan = $"{danhMuc.DuongDan}-{DateTime.UtcNow.Ticks}";

        await _donViCongViec.DanhMucs.ThemAsync(danhMuc);
        await _donViCongViec.LuuThayDoiAsync();
        return CreatedAtAction(nameof(LayTheoId), new { id = danhMuc.Id },
            PhanHoiApi<object>.ThanhCongKetQua(new { danhMuc.Id }, "Tạo danh mục thành công"));
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = "Admin,Editor")]
    public async Task<IActionResult> CapNhat(Guid id, [FromBody] CapNhatDanhMucDto dto)
    {
        var danhMuc = await _donViCongViec.DanhMucs.LayTheoIdAsync(id);
        if (danhMuc == null)
            return NotFound(PhanHoiApi.ThatBai("Không tìm thấy danh mục"));

        _anhXa.Map(dto, danhMuc);

        if (await _donViCongViec.DanhMucs.TruyVan().AnyAsync(c => c.DuongDan == danhMuc.DuongDan && c.Id != id))
            danhMuc.DuongDan = $"{danhMuc.DuongDan}-{DateTime.UtcNow.Ticks}";

        danhMuc.NgayCapNhat = DateTime.UtcNow;
        await _donViCongViec.LuuThayDoiAsync();
        return Ok(PhanHoiApi.ThanhCongKetQua("Cập nhật danh mục thành công"));
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Xoa(Guid id)
    {
        var danhMuc = await _donViCongViec.DanhMucs.LayTheoIdAsync(id);
        if (danhMuc == null)
            return NotFound(PhanHoiApi.ThatBai("Không tìm thấy danh mục"));

        var coBaiViet = await _donViCongViec.BaiViets.TruyVan().AnyAsync(a => a.DanhMucId == id);
        if (coBaiViet)
            return BadRequest(PhanHoiApi.ThatBai("Không thể xóa danh mục đã có bài viết"));

        var coDanhMucCon = await _donViCongViec.DanhMucs.TruyVan().AnyAsync(c => c.ChaId == id);
        if (coDanhMucCon)
            return BadRequest(PhanHoiApi.ThatBai("Không thể xóa danh mục đã có danh mục con"));

        _donViCongViec.DanhMucs.Xoa(danhMuc);
        await _donViCongViec.LuuThayDoiAsync();
        return Ok(PhanHoiApi.ThanhCongKetQua("Xóa danh mục thành công"));
    }
}
