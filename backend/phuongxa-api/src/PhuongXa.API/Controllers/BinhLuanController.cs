using PhuongXa.API.TienIch;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PhuongXa.Application.Chung;
using PhuongXa.Application.DTOs.BinhLuan;
using PhuongXa.Application.CacGiaoDien;
using PhuongXa.Domain.CacThucThe;
using PhuongXa.Domain.CacKieuLietKe;

namespace PhuongXa.API.Controllers;

[ApiController]
[Route("api/comments")]
public class BinhLuanController : BaseApiController
{
    private readonly IDonViCongViec _donViCongViec;
    private readonly IMapper _anhXa;
    private readonly IDichVuLamSachHtml _boLamSach;

    public BinhLuanController(IDonViCongViec donViCongViec, IMapper anhXa, IDichVuLamSachHtml boLamSach)
    {
        _donViCongViec = donViCongViec;
        _anhXa = anhXa;
        _boLamSach = boLamSach;
    }

    [HttpGet]
    public async Task<IActionResult> LayTheoBaiViet([FromQuery] Guid baiVietId,
        [FromQuery] int trang = 1, [FromQuery] int kichThuocTrang = 20)
    {
        (trang, kichThuocTrang) = ChuanHoaPhanTrang(trang, kichThuocTrang);

        var truyVan = _donViCongViec.BinhLuans.TruyVan().AsNoTracking()
            .Include(c => c.NguoiDung)
            .Include(c => c.DanhSachTraLoi.Where(r => r.DaDuyet)).ThenInclude(r => r.NguoiDung)
            .Where(c => c.BaiVietId == baiVietId && c.DaDuyet && c.ChaId == null);

        var ketQua = await truyVan
            .OrderByDescending(c => c.NgayTao)
            .PhanTrangAsync<BinhLuan, BinhLuanDto>(trang, kichThuocTrang, _anhXa);

        return Ok(PhanHoiApi<KetQuaPhanTrang<BinhLuanDto>>.ThanhCongKetQua(ketQua));
    }

    [HttpGet("admin")]
    [Authorize(Roles = "Admin,Editor")]
    public async Task<IActionResult> LayTatCaQuanTri([FromQuery] bool? daDuyet,
        [FromQuery] int trang = 1, [FromQuery] int kichThuocTrang = 20)
    {
        (trang, kichThuocTrang) = ChuanHoaPhanTrang(trang, kichThuocTrang);

        var truyVan = _donViCongViec.BinhLuans.TruyVan().AsNoTracking()
            .Include(c => c.NguoiDung)
            .Include(c => c.BaiViet)
            .AsQueryable();

        if (daDuyet.HasValue)
            truyVan = truyVan.Where(c => c.DaDuyet == daDuyet.Value);

        var ketQua = await truyVan
            .OrderByDescending(c => c.NgayTao)
            .PhanTrangAsync<BinhLuan, BinhLuanDto>(trang, kichThuocTrang, _anhXa);

        return Ok(PhanHoiApi<KetQuaPhanTrang<BinhLuanDto>>.ThanhCongKetQua(ketQua));
    }

    [HttpPost]
    [AllowAnonymous]
    public async Task<IActionResult> Tao([FromBody] TaoBinhLuanDto dto)
    {
        var baiViet = await _donViCongViec.BaiViets.TruyVan()
            .FirstOrDefaultAsync(a => a.Id == dto.BaiVietId && a.TrangThai == TrangThaiBaiViet.DaXuatBan);
        if (baiViet == null)
            return NotFound(PhanHoiApi.ThatBai("Bài viết không tồn tại hoặc chưa được xuất bản"));

        if (dto.ChaId.HasValue)
        {
            var chaTonTai = await _donViCongViec.BinhLuans.TruyVan()
                .AnyAsync(c => c.Id == dto.ChaId && c.BaiVietId == dto.BaiVietId);
            if (!chaTonTai)
                return BadRequest(PhanHoiApi.ThatBai("Bình luận cha không tồn tại"));
        }

        dto.NoiDung = _boLamSach.LamSachVanBan(dto.NoiDung);

        var binhLuan = _anhXa.Map<BinhLuan>(dto);
        var idNguoiDung = IdNguoiDungGuidHoacNull;
        if (idNguoiDung.HasValue)
            binhLuan.NguoiDungId = idNguoiDung.Value;

        binhLuan.DaDuyet = idNguoiDung.HasValue;
        await _donViCongViec.BinhLuans.ThemAsync(binhLuan);
        await _donViCongViec.LuuThayDoiAsync();
        return Ok(PhanHoiApi.ThanhCongKetQua("Bình luận đã được gửi"));
    }

    [HttpPatch("{id:guid}/approve")]
    [Authorize(Roles = "Admin,Editor")]
    public async Task<IActionResult> DuyetBinhLuan(Guid id)
    {
        var binhLuan = await _donViCongViec.BinhLuans.LayTheoIdAsync(id);
        if (binhLuan == null)
            return NotFound(PhanHoiApi.ThatBai("Không tìm thấy bình luận"));

        binhLuan.DaDuyet = true;
        binhLuan.NgayCapNhat = DateTime.UtcNow;
        await _donViCongViec.LuuThayDoiAsync();
        return Ok(PhanHoiApi.ThanhCongKetQua("Duyệt bình luận thành công"));
    }

    [HttpDelete("{id:guid}")]
    [Authorize]
    public async Task<IActionResult> Xoa(Guid id)
    {
        var binhLuan = await _donViCongViec.BinhLuans.TruyVan()
            .Include(c => c.DanhSachTraLoi)
            .FirstOrDefaultAsync(c => c.Id == id);
        if (binhLuan == null)
            return NotFound(PhanHoiApi.ThatBai("Không tìm thấy bình luận"));

        var idNguoiDung = IdNguoiDungGuidHoacNull;
        var laQuanTri = User.IsInRole("Admin") || User.IsInRole("Editor");
        if (!laQuanTri && binhLuan.NguoiDungId != idNguoiDung)
            return StatusCode(403, PhanHoiApi.ThatBai("Bạn không có quyền xóa bình luận này"));

        if (binhLuan.DanhSachTraLoi.Any())
            _donViCongViec.BinhLuans.XoaNhieu(binhLuan.DanhSachTraLoi);

        _donViCongViec.BinhLuans.Xoa(binhLuan);
        await _donViCongViec.LuuThayDoiAsync();
        return Ok(PhanHoiApi.ThanhCongKetQua("Xóa bình luận thành công"));
    }
}
