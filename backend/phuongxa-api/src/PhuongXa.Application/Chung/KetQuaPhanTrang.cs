namespace PhuongXa.Application.Chung;

public class KetQuaPhanTrang<T>
{
    public List<T> DanhSach { get; set; } = new();
    public int TongSo { get; set; }
    public int Trang { get; set; }
    public int KichThuocTrang { get; set; }
    public int TongTrang => KichThuocTrang > 0 ? (int)Math.Ceiling((double)TongSo / KichThuocTrang) : 0;
    public bool CoTrangTruoc => Trang > 1;
    public bool CoTrangSau => Trang < TongTrang;
}
