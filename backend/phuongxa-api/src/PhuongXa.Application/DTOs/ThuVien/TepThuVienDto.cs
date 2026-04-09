using PhuongXa.Domain.CacKieuLietKe;

namespace PhuongXa.Application.DTOs.ThuVien;

public class TepThuVienDto
{
    public Guid Id { get; set; }
    public string TenGoc { get; set; } = "";
    public string DuongDan { get; set; } = "";
    public long KichThuoc { get; set; }
    public LoaiTepThuVien Loai { get; set; }
    public DateTime NgayTao { get; set; }
    public string? TenNguoiDung { get; set; }
}
