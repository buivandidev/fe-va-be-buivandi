using PhuongXa.Domain.CacThucThe;

namespace PhuongXa.Application.CacGiaoDien;

/// <summary>
/// Hop dong xuat phieu tiep nhan ho so duoi dang PDF.
/// </summary>
public interface IDichVuXuatPhieuHoSoPdf
{
    /// <summary>
    /// Tao noi dung file PDF cho don ung.
    /// </summary>
    Task<byte[]> XuatPhieuAsync(DonUngDichVu donUng, CancellationToken ct = default);
}
