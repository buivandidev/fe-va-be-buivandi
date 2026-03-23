using AutoMapper;
using PhuongXa.API.TienIch;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using PhuongXa.Application.Chung;
using PhuongXa.Application.DTOs.LienHe;
using PhuongXa.Application.CacGiaoDien;
using PhuongXa.Domain.CacThucThe;

namespace PhuongXa.API.Controllers;

[ApiController]
[Route("api/contact")]
public class LienHeController : BaseApiController
{
    private readonly IDonViCongViec _donViCongViec;
    private readonly IMapper _anhXa;
    private readonly IDichVuLamSachHtml _boLamSach;

    public LienHeController(IDonViCongViec donViCongViec, IMapper anhXa, IDichVuLamSachHtml boLamSach)
    {
        _donViCongViec = donViCongViec;
        _anhXa = anhXa;
        _boLamSach = boLamSach;
    }

    [HttpPost]
    [EnableRateLimiting("contact")]
    public async Task<IActionResult> Gui([FromBody] TaoTinNhanLienHeDto dto)
    {
        dto.NoiDung = _boLamSach.LamSachVanBan(dto.NoiDung);
        dto.HoTen = _boLamSach.LamSachVanBan(dto.HoTen);
        var tinNhan = _anhXa.Map<TinNhanLienHe>(dto);
        await _donViCongViec.TinNhanLienHes.ThemAsync(tinNhan);
        await _donViCongViec.LuuThayDoiAsync();
        return Ok(PhanHoiApi.ThanhCongKetQua("Góp ý của bạn đã được gửi thành công. Chúng tôi sẽ phản hồi sớm nhất có thể."));
    }

    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> LayTatCa([FromQuery] bool? daDoc,
        [FromQuery] int trang = 1, [FromQuery] int kichThuocTrang = 20)
    {
        (trang, kichThuocTrang) = ChuanHoaPhanTrang(trang, kichThuocTrang);

        var truyVan = _donViCongViec.TinNhanLienHes.TruyVan().AsNoTracking();
        if (daDoc.HasValue)
            truyVan = truyVan.Where(m => m.DaDoc == daDoc.Value);

        var ketQua = await truyVan
            .OrderByDescending(m => m.NgayTao)
            .PhanTrangAsync<TinNhanLienHe, TinNhanLienHeDto>(trang, kichThuocTrang, _anhXa);

        return Ok(PhanHoiApi<KetQuaPhanTrang<TinNhanLienHeDto>>.ThanhCongKetQua(ketQua));
    }

    [HttpPatch("{id:guid}/read")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DanhDauDaDoc(Guid id)
    {
        var tinNhan = await _donViCongViec.TinNhanLienHes.LayTheoIdAsync(id);
        if (tinNhan == null)
            return NotFound(PhanHoiApi.ThatBai("Không tìm thấy tin nhắn"));

        tinNhan.DaDoc = true;
        tinNhan.NgayDoc = DateTime.UtcNow;
        _donViCongViec.TinNhanLienHes.CapNhat(tinNhan);
        await _donViCongViec.LuuThayDoiAsync();
        return Ok(PhanHoiApi.ThanhCongKetQua("Đã đánh dấu đã đọc"));
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Xoa(Guid id)
    {
        var tinNhan = await _donViCongViec.TinNhanLienHes.LayTheoIdAsync(id);
        if (tinNhan == null)
            return NotFound(PhanHoiApi.ThatBai("Không tìm thấy tin nhắn"));

        _donViCongViec.TinNhanLienHes.Xoa(tinNhan);
        await _donViCongViec.LuuThayDoiAsync();
        return Ok(PhanHoiApi.ThanhCongKetQua("Xóa tin nhắn thành công"));
    }
}
