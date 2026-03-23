namespace PhuongXa.Application.Chung;

public class PhanHoiApi<T>
{
    public bool ThanhCong { get; set; }
    public string? ThongDiep { get; set; }
    public T? DuLieu { get; set; }
    public List<string>? LoiDanhSach { get; set; }

    public static PhanHoiApi<T> ThanhCongKetQua(T duLieu, string? thongDiep = null) =>
        new() { ThanhCong = true, DuLieu = duLieu, ThongDiep = thongDiep };

    public static PhanHoiApi<T> ThatBai(string thongDiep, List<string>? danhSachLoi = null) =>
        new() { ThanhCong = false, ThongDiep = thongDiep, LoiDanhSach = danhSachLoi };
}

public class PhanHoiApi
{
    public bool ThanhCong { get; set; }
    public string? ThongDiep { get; set; }
    public List<string>? LoiDanhSach { get; set; }

    public static PhanHoiApi ThanhCongKetQua(string? thongDiep = null) =>
        new() { ThanhCong = true, ThongDiep = thongDiep };

    public static PhanHoiApi ThatBai(string thongDiep, List<string>? danhSachLoi = null) =>
        new() { ThanhCong = false, ThongDiep = thongDiep, LoiDanhSach = danhSachLoi };
}
