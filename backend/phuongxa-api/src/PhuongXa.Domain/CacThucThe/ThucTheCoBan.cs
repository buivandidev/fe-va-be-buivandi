namespace PhuongXa.Domain.CacThucThe;

public abstract class ThucTheCoBan
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public DateTime NgayTao { get; set; } = DateTime.UtcNow;
    public DateTime? NgayCapNhat { get; set; }
    public bool DaXoa { get; set; } = false;
    public DateTime? NgayXoa { get; set; }
}
