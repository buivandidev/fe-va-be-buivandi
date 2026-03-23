using System.ComponentModel.DataAnnotations;

namespace PhuongXa.Application.DTOs.NguoiDung;

public class NguoiDungDto
{
    public Guid Id { get; set; }
    public string HoTen { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? SoDienThoai { get; set; }
    public string? AnhDaiDien { get; set; }
    public bool DangHoatDong { get; set; }
    public DateTime NgayTao { get; set; }
    public List<string> DanhSachVaiTro { get; set; } = new();
}

public class TaoNguoiDungDto
{
    [Required] public string HoTen { get; set; } = string.Empty;
    [Required, EmailAddress] public string Email { get; set; } = string.Empty;
    [Required, MinLength(8)] public string MatKhau { get; set; } = string.Empty;
    public string? SoDienThoai { get; set; }
    public string VaiTro { get; set; } = string.Empty;
    public bool DangHoatDong { get; set; } = true;
}

public class CapNhatNguoiDungDto
{
    [Required] public string HoTen { get; set; } = string.Empty;
    public string? SoDienThoai { get; set; }
    public string? AnhDaiDien { get; set; }
    public bool DangHoatDong { get; set; }
    public string VaiTro { get; set; } = string.Empty;
}
