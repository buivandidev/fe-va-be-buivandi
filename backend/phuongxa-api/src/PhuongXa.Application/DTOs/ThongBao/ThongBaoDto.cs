using PhuongXa.Domain.CacKieuLietKe;

namespace PhuongXa.Application.DTOs.ThongBao;

public class ThongBaoDto
{
    public Guid Id { get; set; }
    public string TieuDe { get; set; } = string.Empty;
    public string NoiDung { get; set; } = string.Empty;
    public string? LienKet { get; set; }
    public LoaiThongBao Loai { get; set; }
    public string NhanLoai => Loai.ToString();
    public bool DaDoc { get; set; }
    public DateTime? NgayDoc { get; set; }
    public DateTime NgayTao { get; set; }
}
