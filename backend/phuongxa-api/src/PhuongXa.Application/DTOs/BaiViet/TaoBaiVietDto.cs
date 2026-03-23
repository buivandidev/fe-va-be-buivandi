using System.ComponentModel.DataAnnotations;
using PhuongXa.Domain.CacKieuLietKe;

namespace PhuongXa.Application.DTOs.BaiViet;

public class TaoBaiVietDto
{
    [Required, MinLength(5)]
    public string TieuDe { get; set; } = string.Empty;
    public string? TomTat { get; set; }
    [Required]
    public string NoiDung { get; set; } = string.Empty;
    public string? AnhDaiDien { get; set; }
    [Required]
    public Guid DanhMucId { get; set; }
    public bool NoiBat { get; set; } = false;
    public string? TieuDeMeta { get; set; }
    public string? MoTaMeta { get; set; }
    public string? TheTag { get; set; }
    public TrangThaiBaiViet TrangThai { get; set; } = TrangThaiBaiViet.BanNhap;
}

public class CapNhatBaiVietDto
{
    [Required, MinLength(5)]
    public string TieuDe { get; set; } = string.Empty;
    public string? TomTat { get; set; }
    [Required]
    public string NoiDung { get; set; } = string.Empty;
    public string? AnhDaiDien { get; set; }
    [Required]
    public Guid DanhMucId { get; set; }
    public bool NoiBat { get; set; } = false;
    public string? TieuDeMeta { get; set; }
    public string? MoTaMeta { get; set; }
    public string? TheTag { get; set; }
    public TrangThaiBaiViet TrangThai { get; set; }
}
