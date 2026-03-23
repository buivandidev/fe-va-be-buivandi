using System.ComponentModel.DataAnnotations;

namespace PhuongXa.Application.DTOs.DichVu;

public class DichVuDto
{
    public Guid Id { get; set; }
    public string Ten { get; set; } = string.Empty;
    public string MaDichVu { get; set; } = string.Empty;
    public string? MoTa { get; set; }
    public string? GiayToCanThiet { get; set; }
    public int SoNgayXuLy { get; set; }
    public decimal? LePhi { get; set; }
    public string? UrlBieuMau { get; set; }
    public Guid? DanhMucId { get; set; }
    public string? TenDanhMuc { get; set; }
    public bool DangHoatDong { get; set; }
    public int ThuTuSapXep { get; set; }
    public string? CanCuPhapLy { get; set; }
    public string? QuyTrinh { get; set; }
    public DateTime NgayTao { get; set; }
}

public class TaoDichVuDto
{
    [Required] public string Ten { get; set; } = string.Empty;
    [Required] public string MaDichVu { get; set; } = string.Empty;
    public string? MoTa { get; set; }
    public string? GiayToCanThiet { get; set; }
    public int SoNgayXuLy { get; set; } = 1;
    public decimal? LePhi { get; set; }
    public string? UrlBieuMau { get; set; }
    public Guid? DanhMucId { get; set; }
    public bool DangHoatDong { get; set; } = true;
    public int ThuTuSapXep { get; set; } = 0;
    public string? CanCuPhapLy { get; set; }
    public string? QuyTrinh { get; set; }
}

public class CapNhatDichVuDto
{
    [Required] public string Ten { get; set; } = string.Empty;
    [Required] public string MaDichVu { get; set; } = string.Empty;
    public string? MoTa { get; set; }
    public string? GiayToCanThiet { get; set; }
    public int SoNgayXuLy { get; set; }
    public decimal? LePhi { get; set; }
    public string? UrlBieuMau { get; set; }
    public Guid? DanhMucId { get; set; }
    public bool DangHoatDong { get; set; }
    public int ThuTuSapXep { get; set; }
    public string? CanCuPhapLy { get; set; }
    public string? QuyTrinh { get; set; }
}
