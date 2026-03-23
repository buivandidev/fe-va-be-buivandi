using PhuongXa.Domain.CacKieuLietKe;

namespace PhuongXa.Domain.CacThucThe;

public class ThongBao : ThucTheCoBan
{
    public Guid NguoiDungId { get; set; }
    public string TieuDe { get; set; } = string.Empty;
    public string NoiDung { get; set; } = string.Empty;
    public string? LienKet { get; set; }
    public LoaiThongBao Loai { get; set; } = LoaiThongBao.HeThong;
    public bool DaDoc { get; set; } = false;
    public DateTime? NgayDoc { get; set; }

    public virtual NguoiDung NguoiDung { get; set; } = null!;
}
