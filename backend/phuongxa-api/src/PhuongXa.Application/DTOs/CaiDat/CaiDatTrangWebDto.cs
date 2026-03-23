namespace PhuongXa.Application.DTOs.CaiDat;

public class CaiDatTrangWebDto
{
    public int Id { get; set; }
    public string Khoa { get; set; } = string.Empty;
    public string? GiaTri { get; set; }
    public string? Loai { get; set; }
}

public class CapNhatCaiDatTrangWebDto
{
    public string? GiaTri { get; set; }
}
