namespace PhuongXa.Application.DTOs.XacThuc;

public class PhanHoiXacThucDto
{
    public string MaTruyCap { get; set; } = string.Empty;
    public DateTime HetHanLuc { get; set; }
    public ThongTinNguoiDungDto NguoiDung { get; set; } = null!;
}

public class ThongTinNguoiDungDto
{
    public Guid Id { get; set; }
    public string HoTen { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? AnhDaiDien { get; set; }
    public List<string> DanhSachVaiTro { get; set; } = new();
}

public class MaLamMoiDto
{
    public string MaLamMoi { get; set; } = string.Empty;
}

public class DoiMatKhauDto
{
    [System.ComponentModel.DataAnnotations.Required]
    public string MatKhauHienTai { get; set; } = string.Empty;

    [System.ComponentModel.DataAnnotations.Required]
    [System.ComponentModel.DataAnnotations.MinLength(8)]
    public string MatKhauMoi { get; set; } = string.Empty;

    [System.ComponentModel.DataAnnotations.Required]
    [System.ComponentModel.DataAnnotations.Compare("MatKhauMoi")]
    public string XacNhanMatKhauMoi { get; set; } = string.Empty;
}
