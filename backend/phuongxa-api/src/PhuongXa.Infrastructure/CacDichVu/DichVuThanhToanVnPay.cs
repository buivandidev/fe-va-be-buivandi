using System.Globalization;
using Microsoft.Extensions.Configuration;
using PhuongXa.Application.CacGiaoDien;
using PhuongXa.Application.DTOs.DonUng;
using PhuongXa.Domain.CacThucThe;

namespace PhuongXa.Infrastructure.CacDichVu;

/// <summary>
/// Dich vu tao lien ket thanh toan VnPay (muc toi thieu de tich hop API).
/// </summary>
public class DichVuThanhToanVnPay : IDichVuThanhToanVnPay
{
    /// <summary>
    /// Bien thanh vien phuc vu xu ly cau hinh trong vong doi cua lop.
    /// </summary>
    private readonly IConfiguration _cauHinh;

    public DichVuThanhToanVnPay(IConfiguration cauHinh)
    {
        _cauHinh = cauHinh;
    }

    public Task<KetQuaTaoLienKetThanhToanLePhiDto> TaoLienKetThanhToanAsync(
        DonUngDichVu donUng,
        string? diaChiIp,
        CancellationToken ct = default)
    {
        var baseUrl = _cauHinh["VnPay:BaseUrl"] ?? "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
        var returnUrl = _cauHinh["VnPay:ReturnUrl"] ?? string.Empty;

        var soTien = Math.Max(donUng.LePhiTaiThoiDiemNop, 0m);
        var maThamChieu = string.IsNullOrWhiteSpace(donUng.MaThamChieuThanhToan)
            ? donUng.MaTheoDoi
            : donUng.MaThamChieuThanhToan;

        var thongSo = new Dictionary<string, string?>
        {
            ["vnp_Amount"] = ((long)(soTien * 100m)).ToString(CultureInfo.InvariantCulture),
            ["vnp_OrderInfo"] = $"Le phi ho so {donUng.MaTheoDoi}",
            ["vnp_TxnRef"] = maThamChieu,
            ["vnp_ReturnUrl"] = returnUrl,
            ["vnp_IpAddr"] = diaChiIp ?? "127.0.0.1"
        };

        var query = string.Join("&", thongSo
            .Where(kv => !string.IsNullOrWhiteSpace(kv.Value))
            .Select(kv => $"{Uri.EscapeDataString(kv.Key)}={Uri.EscapeDataString(kv.Value!)}"));

        return Task.FromResult(new KetQuaTaoLienKetThanhToanLePhiDto
        {
            UrlThanhToan = string.IsNullOrWhiteSpace(query) ? baseUrl : $"{baseUrl}?{query}",
            MaThamChieuThanhToan = maThamChieu,
            SoTien = soTien
        });
    }

    public bool KiemTraPhanHoiHopLe(IReadOnlyDictionary<string, string?> thamSo)
    {
        if (!thamSo.TryGetValue("vnp_TxnRef", out var maThamChieu) || string.IsNullOrWhiteSpace(maThamChieu))
            return false;

        if (!thamSo.TryGetValue("vnp_ResponseCode", out var maPhanHoi) || string.IsNullOrWhiteSpace(maPhanHoi))
            return false;

        return true;
    }
}
