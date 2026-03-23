namespace PhuongXa.Domain.CacThucThe;

public class MaLamMoi
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid NguoiDungId { get; set; }
    public string MaToken { get; set; } = string.Empty;
    public DateTime HetHanLuc { get; set; }
    public bool DaBiThuHoi { get; set; } = false;
    public DateTime NgayTao { get; set; } = DateTime.UtcNow;
    public string? TaoBoiIp { get; set; }

    public virtual NguoiDung NguoiDung { get; set; } = null!;
}
