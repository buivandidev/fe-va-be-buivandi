namespace PhuongXa.Application.DTOs.NhatKy;

public class NhatKyKiemTraDto
{
    public long Id { get; set; }
    public Guid? NguoiDungId { get; set; }
    public string? TenNguoiDung { get; set; }
    public string HanhDong { get; set; } = string.Empty;
    public string TenThucThe { get; set; } = string.Empty;
    public string? ThucTheId { get; set; }
    public string? GiaTriCu { get; set; }
    public string? GiaTriMoi { get; set; }
    public string? DiaChiIp { get; set; }
    public DateTime ThoiGian { get; set; }
}
