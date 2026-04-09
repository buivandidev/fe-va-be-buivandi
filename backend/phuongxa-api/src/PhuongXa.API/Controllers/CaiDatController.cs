using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using Microsoft.EntityFrameworkCore;
using PhuongXa.Application.Chung;
using PhuongXa.Application.DTOs.CaiDat;
using PhuongXa.Application.CacGiaoDien;

namespace PhuongXa.API.Controllers;

[ApiController]
[Route("api/settings")]
public class CaiDatController : BaseApiController
{
    private readonly IDonViCongViec _donViCongViec;

    public CaiDatController(IDonViCongViec donViCongViec)
    {
        _donViCongViec = donViCongViec;
    }

    [HttpGet]
    [AllowAnonymous]
    [OutputCache(PolicyName = "Expire30s")]
    public async Task<IActionResult> LayTatCa()
    {
        var laQuanTri = User.Identity?.IsAuthenticated == true && User.IsInRole("Admin");

        var truyVan = _donViCongViec.CaiDats.TruyVan().AsNoTracking().OrderBy(s => s.Khoa).AsQueryable();
        if (!laQuanTri)
            truyVan = truyVan.Where(s => KhoaCongKhai.Contains(s.Khoa));

        var caiDats = await truyVan.ToListAsync();
        var dtos = caiDats.Select(s => new CaiDatTrangWebDto
        {
            Id = s.Id,
            Khoa = s.Khoa,
            GiaTri = s.GiaTri,
            Loai = s.Loai
        }).ToList();
        return Ok(PhanHoiApi<List<CaiDatTrangWebDto>>.ThanhCongKetQua(dtos));
    }

    private static readonly string[] KhoaCongKhai =
    {
        "SiteName", "SiteDescription", "Logo", "Favicon", "FooterText",
        "Address", "Phone", "Email", "SocialFacebook", "SocialYoutube"
    };

    [HttpGet("{khoa}")]
    [AllowAnonymous]
    [OutputCache(PolicyName = "Expire30s", VaryByRouteValueNames = new[] { "khoa" })]
    public async Task<IActionResult> LayTheoKhoa(string khoa)
    {
        var laQuanTri = User.Identity?.IsAuthenticated == true && User.IsInRole("Admin");
        if (!laQuanTri && !KhoaCongKhai.Contains(khoa))
            return NotFound(PhanHoiApi.ThatBai("Không tìm thấy cài đặt"));

        var caiDat = await _donViCongViec.CaiDats.TruyVan().AsNoTracking().FirstOrDefaultAsync(s => s.Khoa == khoa);
        if (caiDat == null)
            return NotFound(PhanHoiApi.ThatBai("Không tìm thấy cài đặt"));

        return Ok(PhanHoiApi<CaiDatTrangWebDto>.ThanhCongKetQua(new CaiDatTrangWebDto
        {
            Id = caiDat.Id,
            Khoa = caiDat.Khoa,
            GiaTri = caiDat.GiaTri,
            Loai = caiDat.Loai
        }));
    }

    [HttpPut("{khoa}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CapNhat(string khoa, [FromBody] CapNhatCaiDatTrangWebDto dto)
    {
        var caiDat = await _donViCongViec.CaiDats.TimDauTienAsync(s => s.Khoa == khoa);
        if (caiDat == null)
            return NotFound(PhanHoiApi.ThatBai("Không tìm thấy cài đặt"));

        caiDat.GiaTri = dto.GiaTri ?? string.Empty;
        await _donViCongViec.LuuThayDoiAsync();
        
        // Xóa cache khi dữ liệu thay đổi
        await HttpContext.RequestServices.GetRequiredService<IOutputCacheStore>().EvictByTagAsync("settings", default);

        return Ok(PhanHoiApi.ThanhCongKetQua("Cập nhật cài đặt thành công"));
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Tao([FromBody] CaiDatTrangWebDto dto)
    {
        if (await _donViCongViec.CaiDats.TruyVan().AnyAsync(s => s.Khoa == dto.Khoa))
            return BadRequest(PhanHoiApi.ThatBai("Khóa cài đặt đã tồn tại"));
        var caiDat = new Domain.CacThucThe.CaiDatTrangWeb
        {
            Khoa = dto.Khoa,
            GiaTri = dto.GiaTri ?? string.Empty,
            Loai = dto.Loai ?? "string"
        };
        await _donViCongViec.CaiDats.ThemAsync(caiDat);
        await _donViCongViec.LuuThayDoiAsync();
        
        // Xóa cache khi dữ liệu thay đổi
        await HttpContext.RequestServices.GetRequiredService<IOutputCacheStore>().EvictByTagAsync("settings", default);
        
        return Ok(PhanHoiApi<object>.ThanhCongKetQua(new { caiDat.Id, caiDat.Khoa }, "Tạo cài đặt thành công"));
    }
}
