namespace PhuongXa.Domain.CacThucThe;

public class PhongBan : ThucTheCoBan
{
    public string Ten { get; set; } = string.Empty;
    public bool DangHoatDong { get; set; } = true;
    public string TenPhongBan { get; set; } = string.Empty;
    public string? GhiChu { get; set; }
}
