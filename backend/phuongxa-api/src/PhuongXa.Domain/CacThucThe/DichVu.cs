namespace PhuongXa.Domain.CacThucThe;

public class DichVu : ThucTheCoBan
{
    public string Ten { get; set; } = string.Empty;
    public string MaDichVu { get; set; } = string.Empty;
    public string? MoTa { get; set; }
    public string? GiayToCanThiet { get; set; }
    public int SoNgayXuLy { get; set; } = 1;
    public decimal? LePhi { get; set; }
    public string? UrlBieuMau { get; set; }
    public Guid? DanhMucId { get; set; }
    public bool DangHoatDong { get; set; } = true;
    public int ThuTuSapXep { get; set; } = 0;
    public string? CanCuPhapLy { get; set; }
    public string? QuyTrinh { get; set; }

    public virtual DanhMuc? DanhMuc { get; set; }
    public virtual ICollection<DonUngDichVu> DanhSachDonUng { get; set; } = new List<DonUngDichVu>();
}
