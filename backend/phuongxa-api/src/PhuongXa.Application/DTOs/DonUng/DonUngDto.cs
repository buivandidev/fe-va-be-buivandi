using System.ComponentModel.DataAnnotations;
using PhuongXa.Domain.CacKieuLietKe;

namespace PhuongXa.Application.DTOs.DonUng;

public class DonUngDto
{
    public Guid Id { get; set; }
    public string MaTheoDoi { get; set; } = string.Empty;
    public Guid DichVuId { get; set; }
    public string TenDichVu { get; set; } = string.Empty;
    public Guid? NguoiDungId { get; set; }
    public string TenNguoiNop { get; set; } = string.Empty;
    public string EmailNguoiNop { get; set; } = string.Empty;
    public string DienThoaiNguoiNop { get; set; } = string.Empty;
    public string? DiaChiNguoiNop { get; set; }
    public string? GhiChu { get; set; }
    public TrangThaiDonUng TrangThai { get; set; }
    public string NhanTrangThai => TrangThai.ToString();
    public DateTime NgayNop { get; set; }
    public DateTime? NgayXuLy { get; set; }
    public string? GhiChuNguoiXuLy { get; set; }
    public List<TepDonUngDto> DanhSachTep { get; set; } = new();
}

public class TepDonUngDto
{
    public Guid Id { get; set; }
    public string TenTep { get; set; } = string.Empty;
    public string? UrlTep { get; set; }
    public long KichThuocTep { get; set; }
}

public class NopDonUngDto
{
    [Required] public Guid DichVuId { get; set; }
    [Required] public string TenNguoiNop { get; set; } = string.Empty;
    [Required, EmailAddress] public string EmailNguoiNop { get; set; } = string.Empty;
    [Required] public string DienThoaiNguoiNop { get; set; } = string.Empty;
    public string? DiaChiNguoiNop { get; set; }
    public string? GhiChu { get; set; }
}

public class CapNhatTrangThaiDonUngDto
{
    [Required] public TrangThaiDonUng TrangThai { get; set; }
    public string? GhiChuNguoiXuLy { get; set; }
}

public class LichSuTrangThaiDonUngDto
{
    public Guid Id { get; set; }
    public TrangThaiDonUng TrangThaiCu { get; set; }
    public string NhanTrangThaiCu => TrangThaiCu.ToString();
    public TrangThaiDonUng TrangThaiMoi { get; set; }
    public string NhanTrangThaiMoi => TrangThaiMoi.ToString();
    public string? GhiChu { get; set; }
    public string TenNguoiThayDoi { get; set; } = string.Empty;
    public DateTime NgayTao { get; set; }
}
