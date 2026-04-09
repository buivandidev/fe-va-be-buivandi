namespace PhuongXa.Domain.CacThucThe;

/// <summary>
/// Luu vet moi lan chuyen phan cong xu ly don ung.
/// </summary>
public class LichSuPhanCongDonUng : ThucTheCoBan
{
    /// <summary>
    /// Don ung duoc phan cong.
    /// </summary>
    public Guid DonUngId { get; set; }

    /// <summary>
    /// Phong ban truoc khi chuyen.
    /// </summary>
    public Guid? PhongBanTuId { get; set; }

    /// <summary>
    /// Phong ban dich den, bat buoc.
    /// </summary>
    public Guid PhongBanDenId { get; set; }

    /// <summary>
    /// Nhan su duoc gan xu ly.
    /// </summary>
    public Guid? NguoiXuLyId { get; set; }

    /// <summary>
    /// Han xu ly moi sau khi phan cong.
    /// </summary>
    public DateTime? HanXuLy { get; set; }

    /// <summary>
    /// Ghi chu theo doi phan cong.
    /// </summary>
    public string? GhiChu { get; set; }

    /// <summary>
    /// Nguoi tao thao tac phan cong.
    /// </summary>
    public Guid? NguoiThayDoiId { get; set; }

    /// <summary>
    /// Navigation don ung.
    /// </summary>
    public virtual DonUngDichVu DonUng { get; set; } = null!;

    /// <summary>
    /// Navigation phong ban nguon.
    /// </summary>
    public virtual PhongBan? PhongBanTu { get; set; }

    /// <summary>
    /// Navigation phong ban dich.
    /// </summary>
    public virtual PhongBan PhongBanDen { get; set; } = null!;

    /// <summary>
    /// Navigation nguoi xu ly.
    /// </summary>
    public virtual NguoiDung? NguoiXuLy { get; set; }

    /// <summary>
    /// Navigation nguoi thay doi.
    /// </summary>
    public virtual NguoiDung? NguoiThayDoi { get; set; }
}
