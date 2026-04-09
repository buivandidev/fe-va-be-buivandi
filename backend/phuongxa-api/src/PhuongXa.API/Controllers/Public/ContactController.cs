using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PhuongXa.Application.CacGiaoDien;
using PhuongXa.Application.Chung;
using PhuongXa.Application.DTOs.LienHe;
using PhuongXa.Domain.CacThucThe;
using PhuongXa.API.Controllers;

namespace PhuongXa.API.Controllers.Public;
[Route("api/public/contact")]
public class ContactController : BaseApiController
{
    private readonly IDonViCongViec _donViCongViec;
    private readonly IMapper _anhXa;
    private readonly IDichVuLamSachHtml _dichVuLamSachHtml;
    public ContactController(IDonViCongViec donViCongViec, IMapper anhXa, IDichVuLamSachHtml dichVuLamSachHtml)
    {
        _donViCongViec = donViCongViec;
        _anhXa = anhXa;
        _dichVuLamSachHtml = dichVuLamSachHtml;
    }

    [HttpPost]
    [AllowAnonymous]
    public async Task<IActionResult> GuiLienHe([FromBody] TaoTinNhanLienHeDto yeuCau, CancellationToken ct)
    {
        var tinNhan = _anhXa.Map<TinNhanLienHe>(yeuCau);
        tinNhan.HoTen = _dichVuLamSachHtml.LamSachVanBan(yeuCau.HoTen);
        tinNhan.ChuDe = _dichVuLamSachHtml.LamSachVanBan(yeuCau.ChuDe);
        tinNhan.NoiDung = _dichVuLamSachHtml.LamSachVanBan(yeuCau.NoiDung);
        tinNhan.Email = yeuCau.Email.Trim();
        await _donViCongViec.TinNhanLienHes.ThemAsync(tinNhan, ct);
        await _donViCongViec.LuuThayDoiAsync(ct);
        return Ok(PhanHoiApi.ThanhCongKetQua("Phan anh cua ban da duoc gui thanh cong. Chung toi se phan hoi som nhat co the."));
    }
}