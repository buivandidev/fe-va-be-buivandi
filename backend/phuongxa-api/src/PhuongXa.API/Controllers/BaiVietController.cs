using PhuongXa.API.TienIch;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using Microsoft.EntityFrameworkCore;
using PhuongXa.Application.Chung;
using PhuongXa.Application.DTOs.BaiViet;
using PhuongXa.Application.CacGiaoDien;
using PhuongXa.Domain.CacThucThe;
using PhuongXa.Domain.CacKieuLietKe;

namespace PhuongXa.API.Controllers;

[ApiController]
[Route("api/articles")]
public class BaiVietController : BaseApiController
{
    private readonly IDonViCongViec _donViCongViec;
    private readonly IMapper _anhXa;
    private readonly IDichVuLamSachHtml _boLamSach;

    public BaiVietController(IDonViCongViec donViCongViec, IMapper anhXa, IDichVuLamSachHtml boLamSach)
    {
        _donViCongViec = donViCongViec;
        _anhXa = anhXa;
        _boLamSach = boLamSach;
    }

    [HttpGet]
    public async Task<IActionResult> LayTatCa([FromQuery] string? timKiem, [FromQuery] Guid? danhMucId,
        [FromQuery] bool? noiBat, [FromQuery] int trang = 1, [FromQuery] int kichThuocTrang = 12)
    {
        (trang, kichThuocTrang) = ChuanHoaPhanTrang(trang, kichThuocTrang);

        var truyVan = _donViCongViec.BaiViets.TruyVan().AsNoTracking()
            .Include(a => a.TacGia)
            .Include(a => a.DanhMuc)
            .Where(a => a.TrangThai == TrangThaiBaiViet.DaXuatBan && !a.DaXoa);

        if (!string.IsNullOrEmpty(timKiem))
            truyVan = truyVan.Where(a => a.TieuDe.Contains(timKiem)
                || (a.TomTat != null && a.TomTat.Contains(timKiem))
                || (a.TheTag != null && a.TheTag.Contains(timKiem)));
        if (danhMucId.HasValue)
            truyVan = truyVan.Where(a => a.DanhMucId == danhMucId);
        if (noiBat.HasValue)
            truyVan = truyVan.Where(a => a.NoiBat == noiBat);

        var ketQua = await truyVan
            .OrderByDescending(a => a.NgayXuatBan)
            .PhanTrangAsync<BaiViet, DanhSachBaiVietDto>(trang, kichThuocTrang, _anhXa);

        return Ok(PhanHoiApi<KetQuaPhanTrang<DanhSachBaiVietDto>>.ThanhCongKetQua(ketQua));
    }

    [HttpGet("admin")]
    [Authorize(Roles = "Admin,Editor")]
    public async Task<IActionResult> LayTatCaQuanTri([FromQuery] string? timKiem, [FromQuery] Guid? danhMucId,
        [FromQuery] TrangThaiBaiViet? trangThai, [FromQuery] int trang = 1, [FromQuery] int kichThuocTrang = 20)
    {
        (trang, kichThuocTrang) = ChuanHoaPhanTrang(trang, kichThuocTrang);

        var truyVan = _donViCongViec.BaiViets.TruyVan().AsNoTracking()
            .Include(a => a.TacGia)
            .Include(a => a.DanhMuc)
            .Where(a => !a.DaXoa);

        if (!string.IsNullOrEmpty(timKiem))
            truyVan = truyVan.Where(a => a.TieuDe.Contains(timKiem));
        if (danhMucId.HasValue)
            truyVan = truyVan.Where(a => a.DanhMucId == danhMucId);
        if (trangThai.HasValue)
            truyVan = truyVan.Where(a => a.TrangThai == trangThai);

        var ketQua = await truyVan
            .OrderByDescending(a => a.NgayTao)
            .PhanTrangAsync<BaiViet, DanhSachBaiVietDto>(trang, kichThuocTrang, _anhXa);

        return Ok(PhanHoiApi<KetQuaPhanTrang<DanhSachBaiVietDto>>.ThanhCongKetQua(ketQua));
    }

    [HttpGet("{duongDan}")]
    public async Task<IActionResult> LayTheoDuongDan(string duongDan)
    {
        var baiViet = await _donViCongViec.BaiViets.TruyVan().AsNoTracking()
            .Include(a => a.TacGia)
            .Include(a => a.DanhMuc)
            .Include(a => a.DanhSachBinhLuan.Where(c => c.DaDuyet && c.ChaId == null))
                .ThenInclude(c => c.NguoiDung)
            .Include(a => a.DanhSachBinhLuan.Where(c => c.DaDuyet && c.ChaId == null))
                .ThenInclude(c => c.DanhSachTraLoi.Where(r => r.DaDuyet))
                    .ThenInclude(r => r.NguoiDung)
            .FirstOrDefaultAsync(a => a.DuongDan == duongDan && a.TrangThai == TrangThaiBaiViet.DaXuatBan && !a.DaXoa);
        if (baiViet == null)
            return NotFound(PhanHoiApi.ThatBai("Không tìm thấy bài viết"));

        await _donViCongViec.BaiViets.TruyVan()
            .Where(a => a.Id == baiViet.Id)
            .ExecuteUpdateAsync(s => s.SetProperty(a => a.SoLuotXem, a => a.SoLuotXem + 1));
        baiViet.SoLuotXem++;
        return Ok(PhanHoiApi<BaiVietDto>.ThanhCongKetQua(_anhXa.Map<BaiVietDto>(baiViet)));
    }

    [HttpGet("{id:guid}/detail")]
    [Authorize(Roles = "Admin,Editor")]
    public async Task<IActionResult> LayTheoId(Guid id)
    {
        var baiViet = await _donViCongViec.BaiViets.TruyVan().AsNoTracking()
            .Include(a => a.TacGia)
            .Include(a => a.DanhMuc)
            .Include(a => a.DanhSachBinhLuan)
            .FirstOrDefaultAsync(a => a.Id == id && !a.DaXoa);

        if (baiViet == null)
            return NotFound(PhanHoiApi.ThatBai("Không tìm thấy bài viết"));

        return Ok(PhanHoiApi<BaiVietDto>.ThanhCongKetQua(_anhXa.Map<BaiVietDto>(baiViet)));
    }

    [HttpPost]
    [Authorize(Roles = "Admin,Editor")]
    public async Task<IActionResult> Tao([FromBody] TaoBaiVietDto dto)
    {
        var idNguoiDung = IdNguoiDungHienTai;

        var danhMucTonTai = await _donViCongViec.DanhMucs.TruyVan().AnyAsync(c => c.Id == dto.DanhMucId && c.DangHoatDong);
        if (!danhMucTonTai)
            return BadRequest(PhanHoiApi.ThatBai("Danh mục không tồn tại hoặc đã bị vô hiệu hóa"));

        dto.NoiDung = _boLamSach.LamSachHtml(dto.NoiDung);

        var baiViet = _anhXa.Map<BaiViet>(dto);
        baiViet.TacGiaId = idNguoiDung;

        var duongDanTonTai = await _donViCongViec.BaiViets.TruyVan().AnyAsync(a => a.DuongDan == baiViet.DuongDan);
        if (duongDanTonTai)
            baiViet.DuongDan = $"{baiViet.DuongDan}-{DateTime.UtcNow.Ticks}";

        if (dto.TrangThai == TrangThaiBaiViet.DaXuatBan)
            baiViet.NgayXuatBan = DateTime.UtcNow;

        await _donViCongViec.BaiViets.ThemAsync(baiViet);
        await _donViCongViec.LuuThayDoiAsync();

        return CreatedAtAction(nameof(LayTheoId), new { id = baiViet.Id },
            PhanHoiApi<object>.ThanhCongKetQua(new { baiViet.Id }, "Tạo bài viết thành công"));
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = "Admin,Editor")]
    public async Task<IActionResult> CapNhat(Guid id, [FromBody] CapNhatBaiVietDto dto)
    {
        var baiViet = await _donViCongViec.BaiViets.LayTheoIdAsync(id);
        if (baiViet == null || baiViet.DaXoa)
            return NotFound(PhanHoiApi.ThatBai("Không tìm thấy bài viết"));

        var danhMucTonTai = await _donViCongViec.DanhMucs.TruyVan().AnyAsync(c => c.Id == dto.DanhMucId && c.DangHoatDong);
        if (!danhMucTonTai)
            return BadRequest(PhanHoiApi.ThatBai("Danh mục không tồn tại hoặc đã bị vô hiệu hóa"));

        dto.NoiDung = _boLamSach.LamSachHtml(dto.NoiDung);

        _anhXa.Map(dto, baiViet);
        baiViet.NgayCapNhat = DateTime.UtcNow;

        if (await _donViCongViec.BaiViets.TruyVan().AnyAsync(a => a.DuongDan == baiViet.DuongDan && a.Id != id))
            baiViet.DuongDan = $"{baiViet.DuongDan}-{DateTime.UtcNow.Ticks}";

        if (dto.TrangThai == TrangThaiBaiViet.DaXuatBan && baiViet.NgayXuatBan == null)
            baiViet.NgayXuatBan = DateTime.UtcNow;

        _donViCongViec.BaiViets.CapNhat(baiViet);
        await _donViCongViec.LuuThayDoiAsync();
        return Ok(PhanHoiApi.ThanhCongKetQua("Cập nhật bài viết thành công"));
    }

    [HttpPatch("{id:guid}/publish")]
    [Authorize(Roles = "Admin,Editor")]
    public async Task<IActionResult> XuatBan(Guid id)
    {
        var baiViet = await _donViCongViec.BaiViets.LayTheoIdAsync(id);
        if (baiViet == null || baiViet.DaXoa)
            return NotFound(PhanHoiApi.ThatBai("Không tìm thấy bài viết"));

        baiViet.TrangThai = TrangThaiBaiViet.DaXuatBan;
        baiViet.NgayXuatBan ??= DateTime.UtcNow;
        baiViet.NgayCapNhat = DateTime.UtcNow;
        await _donViCongViec.LuuThayDoiAsync();
        return Ok(PhanHoiApi.ThanhCongKetQua("Xuất bản bài viết thành công"));
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Xoa(Guid id)
    {
        var baiViet = await _donViCongViec.BaiViets.LayTheoIdAsync(id);
        if (baiViet == null || baiViet.DaXoa)
            return NotFound(PhanHoiApi.ThatBai("Không tìm thấy bài viết"));

        baiViet.DaXoa = true;
        baiViet.NgayXoa = DateTime.UtcNow;
        baiViet.NgayCapNhat = DateTime.UtcNow;
        _donViCongViec.BaiViets.CapNhat(baiViet);
        await _donViCongViec.LuuThayDoiAsync();
        return Ok(PhanHoiApi.ThanhCongKetQua("Xóa bài viết thành công"));
    }

    [HttpGet("{duongDan}/related")]
    public async Task<IActionResult> LayBaiVietLienQuan(string duongDan, [FromQuery] int gioiHan = 5)
    {
        gioiHan = Math.Clamp(gioiHan, 1, 20);
        var baiViet = await _donViCongViec.BaiViets.TruyVan().AsNoTracking()
            .FirstOrDefaultAsync(a => a.DuongDan == duongDan && a.TrangThai == TrangThaiBaiViet.DaXuatBan && !a.DaXoa);
        if (baiViet == null)
            return NotFound(PhanHoiApi.ThatBai("Không tìm thấy bài viết"));

        var lienQuan = await _donViCongViec.BaiViets.TruyVan().AsNoTracking()
            .Include(a => a.TacGia)
            .Include(a => a.DanhMuc)
            .Where(a => a.DanhMucId == baiViet.DanhMucId
                && a.TrangThai == TrangThaiBaiViet.DaXuatBan
                && !a.DaXoa
                && a.Id != baiViet.Id)
            .OrderByDescending(a => a.NgayXuatBan)
            .Take(gioiHan)
            .ToListAsync();

        return Ok(PhanHoiApi<List<DanhSachBaiVietDto>>.ThanhCongKetQua(_anhXa.Map<List<DanhSachBaiVietDto>>(lienQuan)));
    }

    [HttpGet("popular")]
    [OutputCache(PolicyName = "Public-Short")]
    public async Task<IActionResult> LayBaiVietPhoBien([FromQuery] int gioiHan = 10)
    {
        gioiHan = Math.Clamp(gioiHan, 1, 50);
        var baiViets = await _donViCongViec.BaiViets.TruyVan().AsNoTracking()
            .Include(a => a.TacGia)
            .Include(a => a.DanhMuc)
            .Where(a => a.TrangThai == TrangThaiBaiViet.DaXuatBan && !a.DaXoa)
            .OrderByDescending(a => a.SoLuotXem)
            .Take(gioiHan)
            .ToListAsync();

        return Ok(PhanHoiApi<List<DanhSachBaiVietDto>>.ThanhCongKetQua(_anhXa.Map<List<DanhSachBaiVietDto>>(baiViets)));
    }
}
