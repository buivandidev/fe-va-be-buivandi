namespace PhuongXa.Domain.CacThucThe;

public class TinNhanLienHe : ThucTheCoBan
{
    public string HoTen { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? DienThoai { get; set; }
    public string ChuDe { get; set; } = string.Empty;
    public string NoiDung { get; set; } = string.Empty;
    public bool DaDoc { get; set; } = false;
    public DateTime? NgayDoc { get; set; }
}
