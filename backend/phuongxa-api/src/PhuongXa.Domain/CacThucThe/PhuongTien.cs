using PhuongXa.Domain.CacKieuLietKe;

namespace PhuongXa.Domain.CacThucThe;

public class PhuongTien : ThucTheCoBan
{
    public string TenTep { get; set; } = string.Empty;
    public string DuongDanTep { get; set; } = string.Empty;
    public string? UrlTep { get; set; }
    public long KichThuocTep { get; set; }
    public string? LoaiNoiDung { get; set; }
    public LoaiPhuongTien Loai { get; set; } = LoaiPhuongTien.HinhAnh;
    public Guid? AlbumId { get; set; }
    public Guid NguoiTaiLenId { get; set; }
    public string? VanBanThayThe { get; set; }

    public virtual AlbumPhuongTien? Album { get; set; }
    public virtual NguoiDung NguoiTaiLen { get; set; } = null!;
}
