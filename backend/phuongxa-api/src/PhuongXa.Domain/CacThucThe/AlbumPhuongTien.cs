namespace PhuongXa.Domain.CacThucThe;

public class AlbumPhuongTien : ThucTheCoBan
{
    public string Ten { get; set; } = string.Empty;
    public string? MoTa { get; set; }
    public string? ChuDe { get; set; }
    public string? AnhBia { get; set; }
    public bool DangHoatDong { get; set; } = true;

    public virtual ICollection<PhuongTien> DanhSachPhuongTien { get; set; } = new List<PhuongTien>();
}
