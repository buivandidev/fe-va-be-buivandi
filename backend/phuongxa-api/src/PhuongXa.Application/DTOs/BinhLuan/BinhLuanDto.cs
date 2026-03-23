using System.ComponentModel.DataAnnotations;

namespace PhuongXa.Application.DTOs.BinhLuan;

public class BinhLuanDto
{
    public Guid Id { get; set; }
    public Guid BaiVietId { get; set; }
    public Guid? NguoiDungId { get; set; }
    public string TenTacGia { get; set; } = string.Empty;
    public string? EmailTacGia { get; set; }
    public string? AnhDaiDienTacGia { get; set; }
    public string NoiDung { get; set; } = string.Empty;
    public bool DaDuyet { get; set; }
    public Guid? ChaId { get; set; }
    public DateTime NgayTao { get; set; }
    public List<BinhLuanDto> DanhSachTraLoi { get; set; } = new();
}

public class TaoBinhLuanDto
{
    [Required]
    public Guid BaiVietId { get; set; }
    public string? TenKhach { get; set; }
    public string? EmailKhach { get; set; }
    [Required, MinLength(2), MaxLength(1000)]
    public string NoiDung { get; set; } = string.Empty;
    public Guid? ChaId { get; set; }
}
