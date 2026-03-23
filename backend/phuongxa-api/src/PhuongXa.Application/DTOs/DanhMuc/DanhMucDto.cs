using System.ComponentModel.DataAnnotations;
using PhuongXa.Domain.CacKieuLietKe;

namespace PhuongXa.Application.DTOs.DanhMuc;

public class DanhMucDto
{
    public Guid Id { get; set; }
    public string Ten { get; set; } = string.Empty;
    public string DuongDan { get; set; } = string.Empty;
    public string? MoTa { get; set; }
    public Guid? ChaId { get; set; }
    public string? TenCha { get; set; }
    public LoaiDanhMuc Loai { get; set; }
    public int ThuTuSapXep { get; set; }
    public bool DangHoatDong { get; set; }
    public DateTime NgayTao { get; set; }
    public List<DanhMucDto> DanhSachCon { get; set; } = new();
}

public class TaoDanhMucDto
{
    [Required] public string Ten { get; set; } = string.Empty;
    public string? MoTa { get; set; }
    public Guid? ChaId { get; set; }
    public LoaiDanhMuc Loai { get; set; } = LoaiDanhMuc.TinTuc;
    public int ThuTuSapXep { get; set; } = 0;
    public bool DangHoatDong { get; set; } = true;
}

public class CapNhatDanhMucDto
{
    [Required] public string Ten { get; set; } = string.Empty;
    public string? MoTa { get; set; }
    public Guid? ChaId { get; set; }
    public LoaiDanhMuc Loai { get; set; }
    public int ThuTuSapXep { get; set; }
    public bool DangHoatDong { get; set; }
}
