namespace PhuongXa.Application.DTOs.TimKiem;

public class KetQuaTimKiemDto
{
    public List<MucTimKiemDto> BaiViet { get; set; } = new();
    public List<MucTimKiemDto> DichVu { get; set; } = new();
    public int TongSoLuong => BaiViet.Count + DichVu.Count;
}

public class MucTimKiemDto
{
    public Guid Id { get; set; }
    public string TieuDe { get; set; } = string.Empty;
    public string? MoTa { get; set; }
    public string DuongDan { get; set; } = string.Empty;
    public string Loai { get; set; } = string.Empty; // "article" | "service"
    public string? AnhDaiDien { get; set; }
    public DateTime NgayTao { get; set; }
}
