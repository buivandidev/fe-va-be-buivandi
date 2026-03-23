namespace PhuongXa.Domain.CacThucThe;

public class CaiDatTrangWeb
{
    public int Id { get; set; }
    public string Khoa { get; set; } = string.Empty;
    public string GiaTri { get; set; } = string.Empty;
    public string? Loai { get; set; }
    public string? MoTa { get; set; }
    public DateTime NgayCapNhat { get; set; } = DateTime.UtcNow;
}
