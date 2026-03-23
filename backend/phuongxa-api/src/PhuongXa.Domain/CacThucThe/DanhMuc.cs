using PhuongXa.Domain.CacKieuLietKe;

namespace PhuongXa.Domain.CacThucThe;

public class DanhMuc : ThucTheCoBan
{
    public string Ten { get; set; } = string.Empty;
    public string DuongDan { get; set; } = string.Empty;
    public string? MoTa { get; set; }
    public Guid? ChaId { get; set; }
    public LoaiDanhMuc Loai { get; set; } = LoaiDanhMuc.TinTuc;
    public int ThuTuSapXep { get; set; } = 0;
    public bool DangHoatDong { get; set; } = true;

    public virtual DanhMuc? Cha { get; set; }
    public virtual ICollection<DanhMuc> DanhSachCon { get; set; } = new List<DanhMuc>();
    public virtual ICollection<BaiViet> DanhSachBaiViet { get; set; } = new List<BaiViet>();
    public virtual ICollection<DichVu> DanhSachDichVu { get; set; } = new List<DichVu>();
}
