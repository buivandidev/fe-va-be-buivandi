using System.ComponentModel.DataAnnotations;

namespace PhuongXa.Application.DTOs.HoSo;

public class HoSoDto
{
    public Guid Id { get; set; }
    public string HoTen { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? SoDienThoai { get; set; }
    public string? AnhDaiDien { get; set; }
    public List<string> DanhSachVaiTro { get; set; } = new();
    public DateTime NgayTao { get; set; }
}

public class CapNhatHoSoDto
{
    [Required(ErrorMessage = "Họ tên là bắt buộc")]
    [StringLength(100, ErrorMessage = "Họ tên không được vượt quá 100 ký tự")]
    public string HoTen { get; set; } = string.Empty;

    [Phone(ErrorMessage = "Số điện thoại không hợp lệ")]
    public string? SoDienThoai { get; set; }
}
