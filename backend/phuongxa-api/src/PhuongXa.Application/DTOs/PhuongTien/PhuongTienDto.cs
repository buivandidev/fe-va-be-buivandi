using PhuongXa.Domain.CacKieuLietKe;

namespace PhuongXa.Application.DTOs.PhuongTien;

public class PhuongTienDto
{
    public Guid Id { get; set; }
    public string TenTep { get; set; } = string.Empty;
    public string TieuDe { get; set; } = string.Empty;
    public string DuongDanTep { get; set; } = string.Empty;
    public string? UrlTep { get; set; }
    public string? DuongDanAnh { get; set; }
    public long KichThuocTep { get; set; }
    public string? LoaiNoiDung { get; set; }
    public LoaiPhuongTien Loai { get; set; }
    public Guid? AlbumId { get; set; }
    public string? TenAlbum { get; set; }
    public string? VanBanThayThe { get; set; }
    public DateTime NgayTao { get; set; }
    public DateTime ThoiGianTao { get; set; }
    public string TenNguoiTaiLen { get; set; } = string.Empty;
}

public class AlbumPhuongTienDto
{
    public Guid Id { get; set; }
    public string Ten { get; set; } = string.Empty;
    public string? MoTa { get; set; }
    public string? ChuDe { get; set; }
    public string? AnhBia { get; set; }
    public string? DuongDanAnh { get; set; }
    public bool DangHoatDong { get; set; }
    public DateTime NgayTao { get; set; }
    public DateTime ThoiGianTao { get; set; }
    public int SoPhuongTien { get; set; }
}

public class TaoAlbumPhuongTienDto
{
    public string Ten { get; set; } = string.Empty;
    public string? MoTa { get; set; }
    public string? ChuDe { get; set; }
    public bool DangHoatDong { get; set; } = true;
}

public class CapNhatAlbumPhuongTienDto
{
    public string Ten { get; set; } = string.Empty;
    public string? MoTa { get; set; }
    public string? ChuDe { get; set; }
    public string? AnhBia { get; set; }
    public bool DangHoatDong { get; set; }
}

public class CapNhatPhuongTienDto
{
    public string? VanBanThayThe { get; set; }
    public Guid? AlbumId { get; set; }
}
