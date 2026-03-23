namespace PhuongXa.Domain.CacThucThe;

public class BinhLuan : ThucTheCoBan
{
    public Guid BaiVietId { get; set; }
    public Guid? NguoiDungId { get; set; }
    public string? TenKhach { get; set; }
    public string? EmailKhach { get; set; }
    public string NoiDung { get; set; } = string.Empty;
    public bool DaDuyet { get; set; } = false;
    public Guid? ChaId { get; set; }

    public virtual BaiViet BaiViet { get; set; } = null!;
    public virtual NguoiDung? NguoiDung { get; set; }
    public virtual BinhLuan? Cha { get; set; }
    public virtual ICollection<BinhLuan> DanhSachTraLoi { get; set; } = new List<BinhLuan>();
}
