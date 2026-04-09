using PhuongXa.Domain.CacThucThe;

namespace PhuongXa.Application.CacGiaoDien;

public interface IDonViCongViec : IDisposable, IAsyncDisposable
{
    IKho<BaiViet> BaiViets { get; }
    IKho<DanhMuc> DanhMucs { get; }
    IKho<BinhLuan> BinhLuans { get; }
    IKho<PhuongTien> PhuongTiens { get; }
    IKho<AlbumPhuongTien> AlbumPhuongTiens { get; }
    IKho<DichVu> DichVus { get; }
    IKho<DonUngDichVu> DonUngs { get; }
    IKho<PhongBan> PhongBans { get; }
    IKho<LichSuPhanCongDonUng> LichSuPhanCongDonUngs { get; }
    IKho<TepDonUng> TepDonUngs { get; }
    IKho<NhatKyKiemTra> NhatKys { get; }
    IKho<TinNhanLienHe> TinNhanLienHes { get; }
    IKho<CaiDatTrangWeb> CaiDats { get; }
    IKho<ThongBao> ThongBaos { get; }
    IKho<LichSuTrangThaiDonUng> LichSuTrangThais { get; }
    IKho<MaLamMoi> MaLamMois { get; }
    Task<int> LuuThayDoiAsync(CancellationToken ct = default);
    Task<Dictionary<Guid, List<string>>> LayVaiTroNguoiDungAsync(List<Guid> userIds, CancellationToken ct = default);
}


