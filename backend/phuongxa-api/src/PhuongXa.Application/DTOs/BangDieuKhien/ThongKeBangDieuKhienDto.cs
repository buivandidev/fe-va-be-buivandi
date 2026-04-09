namespace PhuongXa.Application.DTOs.BangDieuKhien;

public class ThongKeBangDieuKhienDto
{
    public int TongBaiViet { get; set; }
    public int BaiVietDaXuatBan { get; set; }
    public int BaiVietChoDuyet { get; set; }
    public int TongNguoiDung { get; set; }
    public int TongDichVu { get; set; }
    public int TongDonUng { get; set; }
    public int DonUngChoXuLy { get; set; }
    public int DonUngQuaHan { get; set; }
    public int DonUngSapDenHan { get; set; }
    public int LienHeChuaDoc { get; set; }
    public int TongBinhLuan { get; set; }
    public int BinhLuanChoDuyet { get; set; }
}

public class DuLieuBieuDoDto
{
    public List<string> NhanDuLieu { get; set; } = new();
    public List<TapDuLieuBieuDoDto> TapDuLieu { get; set; } = new();
}

public class TapDuLieuBieuDoDto
{
    public string NhanDuLieu { get; set; } = string.Empty;
    public List<int> DuLieu { get; set; } = new();
    public string? MauNen { get; set; }
    public string? MauVien { get; set; }
}


