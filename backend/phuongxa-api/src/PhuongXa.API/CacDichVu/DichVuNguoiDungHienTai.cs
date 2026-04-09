using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using PhuongXa.Application.CacGiaoDien;

namespace PhuongXa.API.CacDichVu;

/// <summary>
/// Trich xuat thong tin nguoi dung hien tai tu HttpContext.
/// </summary>
public class DichVuNguoiDungHienTai : ICurrentUserService
{
    /// <summary>
    /// Bien thanh vien phuc vu truy cap HttpContext hien tai.
    /// </summary>
    private readonly IHttpContextAccessor _httpContextAccessor;

    public DichVuNguoiDungHienTai(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public Guid? NguoiDungId
    {
        get
        {
            var claimValue = _httpContextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier);
            return Guid.TryParse(claimValue, out var id) ? id : null;
        }
    }

    public string? TenNguoiDung
        => _httpContextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.Name)
           ?? _httpContextAccessor.HttpContext?.User.Identity?.Name;

    public string? DiaChiIp
        => _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString();

    public string? TacNhanNguoiDung
        => _httpContextAccessor.HttpContext?.Request.Headers.UserAgent.ToString();
}
