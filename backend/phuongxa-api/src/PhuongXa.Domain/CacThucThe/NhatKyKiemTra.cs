namespace PhuongXa.Domain.CacThucThe;

public class NhatKyKiemTra
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
    public string? TacNhanNguoiDung { get; set; }
    public DateTime ThoiGian { get; set; } = DateTime.UtcNow;

    public virtual NguoiDung? NguoiDung { get; set; }
}
