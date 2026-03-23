namespace PhuongXa.Domain.CacThucThe;

public class TepDonUng : ThucTheCoBan
{
    public Guid DonUngId { get; set; }
    public string TenTep { get; set; } = string.Empty;
    public string DuongDanTep { get; set; } = string.Empty;
    public string? UrlTep { get; set; }
    public long KichThuocTep { get; set; }
    public string? LoaiNoiDung { get; set; }

    public virtual DonUngDichVu DonUng { get; set; } = null!;
}
