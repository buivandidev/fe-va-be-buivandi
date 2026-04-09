using System.Text;
using PhuongXa.Application.CacGiaoDien;
using PhuongXa.Domain.CacThucThe;

namespace PhuongXa.Infrastructure.CacDichVu;

/// <summary>
/// Dich vu xuat phieu ho so ban don gian (co the nang cap sang QuestPDF sau).
/// </summary>
public class DichVuXuatPhieuHoSoPdf : IDichVuXuatPhieuHoSoPdf
{
    public Task<byte[]> XuatPhieuAsync(DonUngDichVu donUng, CancellationToken ct = default)
    {
        // Tam thoi xuat payload text de FE tai ve, co the thay bang renderer PDF day du khi can.
        var noiDung = $"PHIEU TIEP NHAN\nMa theo doi: {donUng.MaTheoDoi}\nNguoi nop: {donUng.TenNguoiNop}\nNgay nop: {donUng.NgayNop:O}";
        return Task.FromResult(Encoding.UTF8.GetBytes(noiDung));
    }
}
