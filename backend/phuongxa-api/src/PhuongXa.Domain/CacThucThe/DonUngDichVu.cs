using PhuongXa.Domain.CacKieuLietKe;
using System;
using System.Collections.Generic;

namespace PhuongXa.Domain.CacThucThe;



public class DonUngDichVu : ThucTheCoBan
{
    public string MaTheoDoi { get; set; } = string.Empty;
    public Guid DichVuId { get; set; }
    public Guid? NguoiDungId { get; set; }
    public string TenNguoiNop { get; set; } = string.Empty;
    public string EmailNguoiNop { get; set; } = string.Empty;
    public string DienThoaiNguoiNop { get; set; } = string.Empty;
    public string? DiaChiNguoiNop { get; set; }
    public string? GhiChu { get; set; }
    public TrangThaiDonUng TrangThai { get; set; } = TrangThaiDonUng.ChoXuLy;   
    public TrangThaiThanhToanLePhi TrangThaiThanhToanLePhi { get; set; } = TrangThaiThanhToanLePhi.KhongYeuCau;
    public decimal LePhiTaiThoiDiemNop { get; set; }
    public string? MaThamChieuThanhToan { get; set; }
    public decimal? LePhiDaNop { get; set; }
    public DateTimeOffset? NgayThanhToan { get; set; }
    public string? HeThongThanhToan { get; set; }
    public string? ThamChieuGiaoDich { get; set; }
    public string? DuongDanBienLai { get; set; }
    public DateTime NgayNop { get; set; } = DateTime.UtcNow;
    public DateTime? NgayXuLy { get; set; }
    public DateTime? HanXuLy { get; set; }
    public DateTime? NgayHenTra { get; set; }
    public string? GhiChuNguoiXuLy { get; set; }
    public Guid? NguoiXuLyId { get; set; }
    public Guid? PhongBanHienTaiId { get; set; }
    public virtual PhongBan? PhongBanHienTai { get; set; }

    public virtual DichVu DichVu { get; set; } = null!;
    public virtual NguoiDung? NguoiDung { get; set; }
    public virtual NguoiDung? NguoiXuLy { get; set; }
    public virtual ICollection<TepDonUng> DanhSachTep { get; set; } = new List<TepDonUng>();
    public virtual ICollection<LichSuTrangThaiDonUng> LichSuTrangThai { get; set; } = new List<LichSuTrangThaiDonUng>();
}





