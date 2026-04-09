using PhuongXa.Application.DTOs.DonUng;
using PhuongXa.Domain.CacThucThe;

namespace PhuongXa.Application.CacGiaoDien;

/// <summary>
/// Hop dong tao lien ket thanh toan va xac thuc callback VnPay.
/// </summary>
public interface IDichVuThanhToanVnPay
{
    /// <summary>
    /// Tao URL thanh toan cho mot don ung.
    /// </summary>
    Task<KetQuaTaoLienKetThanhToanLePhiDto> TaoLienKetThanhToanAsync(
        DonUngDichVu donUng,
        string? diaChiIp,
        CancellationToken ct = default);

    /// <summary>
    /// Kiem tra callback co du lieu hop le toi thieu hay khong.
    /// </summary>
    bool KiemTraPhanHoiHopLe(IReadOnlyDictionary<string, string?> thamSo);
}
