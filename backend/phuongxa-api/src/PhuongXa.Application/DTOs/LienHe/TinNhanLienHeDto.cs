using System.ComponentModel.DataAnnotations;

namespace PhuongXa.Application.DTOs.LienHe;

public class TinNhanLienHeDto
{
    public Guid Id { get; set; }
    public string HoTen { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? DienThoai { get; set; }
    public string ChuDe { get; set; } = string.Empty;
    public string NoiDung { get; set; } = string.Empty;
    public bool DaDoc { get; set; }
    public DateTime? NgayDoc { get; set; }
    public DateTime NgayTao { get; set; }
}

public class TaoTinNhanLienHeDto
{
    [Required] public string HoTen { get; set; } = string.Empty;
    [Required, EmailAddress] public string Email { get; set; } = string.Empty;
    public string? DienThoai { get; set; }
    [Required] public string ChuDe { get; set; } = string.Empty;
    [Required, MinLength(10), MaxLength(2000)] public string NoiDung { get; set; } = string.Empty;
}
