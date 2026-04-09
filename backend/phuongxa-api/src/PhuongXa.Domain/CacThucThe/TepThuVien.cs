using System;
using PhuongXa.Domain.CacKieuLietKe;

namespace PhuongXa.Domain.CacThucThe;

public class TepThuVien
{
    public Guid Id { get; set; }
    public string TenGoc { get; set; } = string.Empty;
    public string DuongDan { get; set; } = string.Empty;
    public long KichThuoc { get; set; }
    public LoaiTepThuVien Loai { get; set; }
    public DateTime NgayTao { get; set; } = DateTime.UtcNow;
    public Guid? NguoiDungId { get; set; }
    public NguoiDung? NguoiDung { get; set; }
}
