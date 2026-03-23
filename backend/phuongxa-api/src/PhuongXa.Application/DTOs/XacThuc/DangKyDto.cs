using System.ComponentModel.DataAnnotations;

namespace PhuongXa.Application.DTOs.XacThuc;

public class DangKyDto
{
    [Required]
    public string HoTen { get; set; } = string.Empty;

    [Required, EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required, MinLength(8)]
    public string MatKhau { get; set; } = string.Empty;

    [Required, Compare("MatKhau")]
    public string XacNhanMatKhau { get; set; } = string.Empty;

    public string? SoDienThoai { get; set; }
}
