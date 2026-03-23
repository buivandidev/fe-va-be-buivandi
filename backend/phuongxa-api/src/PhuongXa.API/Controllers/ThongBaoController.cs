using PhuongXa.API.TienIch;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PhuongXa.Application.Chung;
using PhuongXa.Application.DTOs.ThongBao;
using PhuongXa.Application.CacGiaoDien;
using PhuongXa.Domain.CacThucThe;

namespace PhuongXa.API.Controllers;

[ApiController]
[Route("api/notifications")]
[Authorize]
public class ThongBaoController : BaseApiController
{
    private readonly IDonViCongViec _donViCongViec;
    private readonly IMapper _anhXa;

    public ThongBaoController(IDonViCongViec donViCongViec, IMapper anhXa)
    {
        _donViCongViec = donViCongViec;
        _anhXa = anhXa;
    }

    [HttpGet]
    public async Task<IActionResult> LayTatCa([FromQuery] bool? chiChuaDoc,
        [FromQuery] int trang = 1, [FromQuery] int kichThuocTrang = 20)
    {
        (trang, kichThuocTrang) = ChuanHoaPhanTrang(trang, kichThuocTrang);
        var idNguoiDung = IdNguoiDungHienTai;
        IQueryable<ThongBao> truyVan = _donViCongViec.ThongBaos.TruyVan().AsNoTracking()
            .Where(n => n.NguoiDungId == idNguoiDung);

        if (chiChuaDoc == true)
            truyVan = truyVan.Where(n => !n.DaDoc);

        var ketQua = await truyVan
            .OrderByDescending(n => n.NgayTao)
            .PhanTrangAsync<ThongBao, ThongBaoDto>(trang, kichThuocTrang, _anhXa);

        return Ok(PhanHoiApi<KetQuaPhanTrang<ThongBaoDto>>.ThanhCongKetQua(ketQua));
    }

    [HttpGet("count")]
    public async Task<IActionResult> LaySoLuongChuaDoc()
    {
        var idNguoiDung = IdNguoiDungHienTai;
        var soLuong = await _donViCongViec.ThongBaos.DemAsync(n => n.NguoiDungId == idNguoiDung && !n.DaDoc);
        return Ok(PhanHoiApi<object>.ThanhCongKetQua(new { soLuongChuaDoc = soLuong }));
    }

    [HttpPatch("{id:guid}/read")]
    public async Task<IActionResult> DanhDauDaDoc(Guid id)
    {
        var idNguoiDung = IdNguoiDungHienTai;
        var thongBao = await _donViCongViec.ThongBaos.TruyVan()
            .FirstOrDefaultAsync(n => n.Id == id && n.NguoiDungId == idNguoiDung);

        if (thongBao == null)
            return NotFound(PhanHoiApi.ThatBai("Không tìm thấy thông báo"));

        thongBao.DaDoc = true;
        thongBao.NgayDoc = DateTime.UtcNow;
        thongBao.NgayCapNhat = DateTime.UtcNow;
        _donViCongViec.ThongBaos.CapNhat(thongBao);
        await _donViCongViec.LuuThayDoiAsync();

        return Ok(PhanHoiApi.ThanhCongKetQua("Đã đánh dấu đã đọc"));
    }

    [HttpPatch("read-all")]
    public async Task<IActionResult> DanhDauTatCaDaDoc()
    {
        var idNguoiDung = IdNguoiDungHienTai;
        var soLuong = await _donViCongViec.ThongBaos.TruyVan()
            .Where(n => n.NguoiDungId == idNguoiDung && !n.DaDoc)
            .ExecuteUpdateAsync(s => s
                .SetProperty(n => n.DaDoc, true)
                .SetProperty(n => n.NgayDoc, DateTime.UtcNow)
                .SetProperty(n => n.NgayCapNhat, DateTime.UtcNow));

        return Ok(PhanHoiApi.ThanhCongKetQua($"Đã đánh dấu {soLuong} thông báo đã đọc"));
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Xoa(Guid id)
    {
        var idNguoiDung = IdNguoiDungHienTai;
        var thongBao = await _donViCongViec.ThongBaos.TruyVan()
            .FirstOrDefaultAsync(n => n.Id == id && n.NguoiDungId == idNguoiDung);

        if (thongBao == null)
            return NotFound(PhanHoiApi.ThatBai("Không tìm thấy thông báo"));

        _donViCongViec.ThongBaos.Xoa(thongBao);
        await _donViCongViec.LuuThayDoiAsync();

        return Ok(PhanHoiApi.ThanhCongKetQua("Xóa thông báo thành công"));
    }
}
