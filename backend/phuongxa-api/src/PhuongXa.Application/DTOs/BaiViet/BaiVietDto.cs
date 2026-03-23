using PhuongXa.Domain.CacKieuLietKe;

namespace PhuongXa.Application.DTOs.BaiViet;

public class BaiVietDto
{
    public Guid Id { get; set; }
    public string TieuDe { get; set; } = string.Empty;
    public string DuongDan { get; set; } = string.Empty;
    public string? TomTat { get; set; }
    public string NoiDung { get; set; } = string.Empty;
    public string? AnhDaiDien { get; set; }
    public Guid TacGiaId { get; set; }
    public string TenTacGia { get; set; } = string.Empty;
    public Guid DanhMucId { get; set; }
    public string TenDanhMuc { get; set; } = string.Empty;
    public TrangThaiBaiViet TrangThai { get; set; }
    public string NhanTrangThai => TrangThai.ToString();
    public DateTime? NgayXuatBan { get; set; }
    public int SoLuotXem { get; set; }
    public bool NoiBat { get; set; }
    public string? TieuDeMeta { get; set; }
    public string? MoTaMeta { get; set; }
    public string? TheTag { get; set; }
    public DateTime NgayTao { get; set; }
    public DateTime? NgayCapNhat { get; set; }
    public int SoBinhLuan { get; set; }
}

public class DanhSachBaiVietDto
{
    public Guid Id { get; set; }
    public string TieuDe { get; set; } = string.Empty;
    public string DuongDan { get; set; } = string.Empty;
    public string? TomTat { get; set; }
    public string? AnhDaiDien { get; set; }
    public string TenTacGia { get; set; } = string.Empty;
    public string TenDanhMuc { get; set; } = string.Empty;
    public Guid DanhMucId { get; set; }
    public TrangThaiBaiViet TrangThai { get; set; }
    public DateTime? NgayXuatBan { get; set; }
    public int SoLuotXem { get; set; }
    public bool NoiBat { get; set; }
    public DateTime NgayTao { get; set; }
}
