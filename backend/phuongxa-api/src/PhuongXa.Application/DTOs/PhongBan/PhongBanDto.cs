using System.ComponentModel.DataAnnotations;

namespace PhuongXa.Application.DTOs.PhongBan;

/// <summary>
/// DTO phong ban hien thi cho API.
/// </summary>
public class PhongBanDto
{
    public Guid Id { get; set; }

    public string MaPhongBan { get; set; } = string.Empty;

    public string Ten { get; set; } = string.Empty;

    public string? MoTa { get; set; }

    public bool DangHoatDong { get; set; }

    public DateTime NgayTao { get; set; }
}

/// <summary>
/// DTO tao phong ban.
/// </summary>
public class TaoPhongBanDto
{
    [Required]
    [StringLength(30)]
    public string MaPhongBan { get; set; } = string.Empty;

    [Required]
    [StringLength(200)]
    public string Ten { get; set; } = string.Empty;

    [StringLength(2000)]
    public string? MoTa { get; set; }

    public bool DangHoatDong { get; set; } = true;
}

/// <summary>
/// DTO cap nhat phong ban.
/// </summary>
public class CapNhatPhongBanDto
{
    [Required]
    [StringLength(200)]
    public string Ten { get; set; } = string.Empty;

    [StringLength(2000)]
    public string? MoTa { get; set; }

    public bool DangHoatDong { get; set; }
}
