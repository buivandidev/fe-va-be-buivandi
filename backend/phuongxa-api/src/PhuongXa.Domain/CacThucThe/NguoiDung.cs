using Microsoft.AspNetCore.Identity;

namespace PhuongXa.Domain.CacThucThe;

public class NguoiDung : IdentityUser<Guid>
{
    public string HoTen { get; set; } = string.Empty;
    public string? AnhDaiDien { get; set; }
    public bool DangHoatDong { get; set; } = true;
    public DateTime NgayTao { get; set; } = DateTime.UtcNow;
    public DateTime? NgayCapNhat { get; set; }

    public virtual ICollection<BaiViet> DanhSachBaiViet { get; set; } = new List<BaiViet>();
    public virtual ICollection<BinhLuan> DanhSachBinhLuan { get; set; } = new List<BinhLuan>();
    public virtual ICollection<PhuongTien> DanhSachTaiLen { get; set; } = new List<PhuongTien>();
    public virtual ICollection<NhatKyKiemTra> DanhSachNhatKy { get; set; } = new List<NhatKyKiemTra>();
    public virtual ICollection<DonUngDichVu> DanhSachDonUng { get; set; } = new List<DonUngDichVu>();
    public virtual ICollection<ThongBao> DanhSachThongBao { get; set; } = new List<ThongBao>();
}
