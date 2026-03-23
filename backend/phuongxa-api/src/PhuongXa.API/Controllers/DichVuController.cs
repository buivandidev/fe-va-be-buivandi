using AutoMapper;
using PhuongXa.API.TienIch;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PhuongXa.Application.Chung;
using PhuongXa.Application.DTOs.DichVu;
using PhuongXa.Application.CacGiaoDien;
using PhuongXa.Domain.CacThucThe;

namespace PhuongXa.API.Controllers;

[ApiController]
[Route("api/services")]
public class DichVuController : BaseApiController
{
    private readonly IDonViCongViec _donViCongViec;
    private readonly IMapper _anhXa;

    public DichVuController(IDonViCongViec donViCongViec, IMapper anhXa)
    {
        _donViCongViec = donViCongViec;
        _anhXa = anhXa;
    }

    [HttpGet]
    public async Task<IActionResult> LayTatCa([FromQuery] string? timKiem,
        [FromQuery] Guid? danhMucId, [FromQuery] int trang = 1, [FromQuery] int kichThuocTrang = 20)
    {
        (trang, kichThuocTrang) = ChuanHoaPhanTrang(trang, kichThuocTrang);

        var truyVan = _donViCongViec.DichVus.TruyVan().AsNoTracking()
            .Include(s => s.DanhMuc)
            .Where(s => s.DangHoatDong);

        if (!string.IsNullOrEmpty(timKiem))
            truyVan = truyVan.Where(s => s.Ten.Contains(timKiem) || s.MaDichVu.Contains(timKiem));
        if (danhMucId.HasValue)
            truyVan = truyVan.Where(s => s.DanhMucId == danhMucId);

        var ketQua = await truyVan
            .OrderBy(s => s.ThuTuSapXep).ThenBy(s => s.Ten)
            .PhanTrangAsync<DichVu, DichVuDto>(trang, kichThuocTrang, _anhXa);

        return Ok(PhanHoiApi<KetQuaPhanTrang<DichVuDto>>.ThanhCongKetQua(ketQua));
    }

    [HttpGet("admin")]
    [Authorize(Roles = "Admin,Editor")]
    public async Task<IActionResult> LayTatCaQuanTri([FromQuery] string? timKiem, [FromQuery] Guid? danhMucId,
        [FromQuery] bool? dangHoatDong, [FromQuery] int trang = 1, [FromQuery] int kichThuocTrang = 20)
    {
        (trang, kichThuocTrang) = ChuanHoaPhanTrang(trang, kichThuocTrang);

        var truyVan = _donViCongViec.DichVus.TruyVan().AsNoTracking()
            .Include(s => s.DanhMuc)
            .AsQueryable();

        if (!string.IsNullOrEmpty(timKiem))
            truyVan = truyVan.Where(s => s.Ten.Contains(timKiem) || s.MaDichVu.Contains(timKiem));
        if (danhMucId.HasValue)
            truyVan = truyVan.Where(s => s.DanhMucId == danhMucId);
        if (dangHoatDong.HasValue)
            truyVan = truyVan.Where(s => s.DangHoatDong == dangHoatDong);

        var ketQua = await truyVan
            .OrderBy(s => s.ThuTuSapXep).ThenBy(s => s.Ten)
            .PhanTrangAsync<DichVu, DichVuDto>(trang, kichThuocTrang, _anhXa);

        return Ok(PhanHoiApi<KetQuaPhanTrang<DichVuDto>>.ThanhCongKetQua(ketQua));
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> LayTheoId(Guid id)
    {
        var dichVu = await _donViCongViec.DichVus.TruyVan().AsNoTracking()
            .Include(x => x.DanhMuc)
            .FirstOrDefaultAsync(x => x.Id == id);

        if (dichVu == null)
            return NotFound(PhanHoiApi.ThatBai("Không tìm thấy dịch vụ"));

        return Ok(PhanHoiApi<DichVuDto>.ThanhCongKetQua(_anhXa.Map<DichVuDto>(dichVu)));
    }

    [HttpGet("by-code/{maDichVu}")]
    public async Task<IActionResult> LayTheoMa(string maDichVu)
    {
        var dichVu = await _donViCongViec.DichVus.TruyVan().AsNoTracking()
            .Include(x => x.DanhMuc)
            .FirstOrDefaultAsync(x => x.MaDichVu == maDichVu);

        if (dichVu == null)
            return NotFound(PhanHoiApi.ThatBai("Không tìm thấy dịch vụ"));

        return Ok(PhanHoiApi<DichVuDto>.ThanhCongKetQua(_anhXa.Map<DichVuDto>(dichVu)));
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Tao([FromBody] TaoDichVuDto dto)
    {
        if (await _donViCongViec.DichVus.TruyVan().AnyAsync(x => x.MaDichVu == dto.MaDichVu))
            return BadRequest(PhanHoiApi.ThatBai("Mã dịch vụ đã tồn tại"));

        var dichVu = _anhXa.Map<DichVu>(dto);
        await _donViCongViec.DichVus.ThemAsync(dichVu);
        await _donViCongViec.LuuThayDoiAsync();

        return CreatedAtAction(nameof(LayTheoId), new { id = dichVu.Id },
            PhanHoiApi<object>.ThanhCongKetQua(new { dichVu.Id }, "Tạo dịch vụ thành công"));
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CapNhat(Guid id, [FromBody] CapNhatDichVuDto dto)
    {
        var dichVu = await _donViCongViec.DichVus.LayTheoIdAsync(id);
        if (dichVu == null)
            return NotFound(PhanHoiApi.ThatBai("Không tìm thấy dịch vụ"));

        if (dto.MaDichVu != dichVu.MaDichVu && await _donViCongViec.DichVus.TruyVan().AnyAsync(x => x.MaDichVu == dto.MaDichVu && x.Id != id))
            return BadRequest(PhanHoiApi.ThatBai("Mã dịch vụ đã tồn tại"));

        _anhXa.Map(dto, dichVu);
        dichVu.NgayCapNhat = DateTime.UtcNow;
        await _donViCongViec.LuuThayDoiAsync();

        return Ok(PhanHoiApi.ThanhCongKetQua("Cập nhật dịch vụ thành công"));
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Xoa(Guid id)
    {
        var dichVu = await _donViCongViec.DichVus.LayTheoIdAsync(id);
        if (dichVu == null)
            return NotFound(PhanHoiApi.ThatBai("Không tìm thấy dịch vụ"));

        var coDonUng = await _donViCongViec.DonUngs.TruyVan().AnyAsync(a => a.DichVuId == id);
        if (coDonUng)
            return BadRequest(PhanHoiApi.ThatBai("Không thể xóa dịch vụ đã có đơn ứng liên kết"));

        _donViCongViec.DichVus.Xoa(dichVu);
        await _donViCongViec.LuuThayDoiAsync();
        return Ok(PhanHoiApi.ThanhCongKetQua("Xóa dịch vụ thành công"));
    }
}
