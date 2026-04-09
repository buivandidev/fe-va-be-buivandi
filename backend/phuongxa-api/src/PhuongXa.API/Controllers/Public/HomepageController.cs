using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PhuongXa.Application.CacGiaoDien;
using PhuongXa.Application.Chung;
using PhuongXa.Application.DTOs.PhuongTien;
using PhuongXa.Domain.CacKieuLietKe;

namespace PhuongXa.API.Controllers.Public;

[Route("api/homepage")]
public class HomepageController : BaseApiController
{
    private readonly IDonViCongViec _donViCongViec;
    private readonly IMapper _anhXa;
    private readonly IDichVuLuuTruTep _luuTruTep;

    public HomepageController(IDonViCongViec donViCongViec, IMapper anhXa, IDichVuLuuTruTep luuTruTep)
    {
        _donViCongViec = donViCongViec;
        _anhXa = anhXa;
        _luuTruTep = luuTruTep;
    }

    [HttpGet("sections")]
    public async Task<IActionResult> GetHomepageSections(CancellationToken ct)
    {
        var media = await _donViCongViec.PhuongTiens.TruyVan()
            .AsNoTracking()
            .OrderByDescending(x => x.NgayTao)
            .ToListAsync(ct);

        var banner = media
            .Where(m => m.VanBanThayThe != null && m.VanBanThayThe.ToLower().Contains("[banner]"))
            .Take(1)
            .ToList();

        var videos = media
            .Where(m => m.VanBanThayThe != null && m.VanBanThayThe.ToLower().Contains("[video]"))
            .Take(4)
            .ToList();

        var gallery = media
            .Where(m => m.VanBanThayThe != null && m.VanBanThayThe.ToLower().Contains("[gallery]"))
            .Take(5)
            .ToList();

        var result = new
        {
            Banner = banner.Select(m => new
            {
                Id = m.Id,
                TenTep = m.TenTep,
                UrlTep = _luuTruTep.LayUrlTep(m.DuongDanTep),
                TieuDe = m.VanBanThayThe?.Replace("[banner]", "").Replace("[BANNER]", "").Trim(),
                NgayTao = m.NgayTao
            }).FirstOrDefault(),
            Videos = videos.Select(m => new
            {
                Id = m.Id,
                TenTep = m.TenTep,
                UrlTep = _luuTruTep.LayUrlTep(m.DuongDanTep),
                TieuDe = m.VanBanThayThe?.Replace("[video]", "").Replace("[VIDEO]", "").Trim(),
                Loai = m.Loai,
                NgayTao = m.NgayTao
            }).ToList(),
            Gallery = gallery.Select(m => new
            {
                Id = m.Id,
                TenTep = m.TenTep,
                UrlTep = _luuTruTep.LayUrlTep(m.DuongDanTep),
                TieuDe = m.VanBanThayThe?.Replace("[gallery]", "").Replace("[GALLERY]", "").Trim(),
                NgayTao = m.NgayTao
            }).ToList()
        };

        return Ok(PhanHoiApi<object>.ThanhCongKetQua(result));
    }
}
