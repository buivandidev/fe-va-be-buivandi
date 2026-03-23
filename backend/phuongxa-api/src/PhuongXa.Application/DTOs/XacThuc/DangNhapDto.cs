using System.ComponentModel.DataAnnotations;

namespace PhuongXa.Application.DTOs.XacThuc;

public class DangNhapDto
{
    [Required, EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string MatKhau { get; set; } = string.Empty;

    public bool NhoDangNhap { get; set; } = false;
}
