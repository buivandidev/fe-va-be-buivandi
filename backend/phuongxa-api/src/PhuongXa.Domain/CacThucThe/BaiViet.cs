using PhuongXa.Domain.CacKieuLietKe;

namespace PhuongXa.Domain.CacThucThe;

public class BaiViet : ThucTheCoBan
{
    public string TieuDe { get; set; } = string.Empty;
    public string DuongDan { get; set; } = string.Empty;
    public string? TomTat { get; set; }
    public string NoiDung { get; set; } = string.Empty;
    public string? AnhDaiDien { get; set; }
    public Guid TacGiaId { get; set; }
    public Guid DanhMucId { get; set; }
    public TrangThaiBaiViet TrangThai { get; set; } = TrangThaiBaiViet.BanNhap;
    public DateTime? NgayXuatBan { get; set; }
    public int SoLuotXem { get; set; } = 0;
    public bool NoiBat { get; set; } = false;
    public string? TieuDeMeta { get; set; }
    public string? MoTaMeta { get; set; }
    public string? TheTag { get; set; }

    public virtual NguoiDung TacGia { get; set; } = null!;
    public virtual DanhMuc DanhMuc { get; set; } = null!;
    public virtual ICollection<BinhLuan> DanhSachBinhLuan { get; set; } = new List<BinhLuan>();
}
