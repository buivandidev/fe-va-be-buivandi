using PhuongXa.Domain.CacKieuLietKe;

namespace PhuongXa.Domain.CacThucThe;

public class LichSuTrangThaiDonUng : ThucTheCoBan
{
    public Guid DonUngId { get; set; }
    public TrangThaiDonUng TrangThaiCu { get; set; }
    public TrangThaiDonUng TrangThaiMoi { get; set; }
    public string? GhiChu { get; set; }
    public Guid NguoiThayDoiId { get; set; }

    public virtual DonUngDichVu DonUng { get; set; } = null!;
    public virtual NguoiDung NguoiThayDoi { get; set; } = null!;
}
