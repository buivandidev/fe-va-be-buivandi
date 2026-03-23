namespace PhuongXa.Application.CacGiaoDien;

public interface IDichVuLamSachHtml
{
    /// <summary>
    /// Lam sach noi dung HTML phong phu (bai viet). Cho phep cac the an toan nhu p, h1-h6, ul, ol, li, img, a, table, v.v.
    /// </summary>
    string LamSachHtml(string html);

    /// <summary>
    /// Lam sach van ban thuan cua nguoi dung (binh luan, ten). Loai bo TAT CA the HTML.
    /// </summary>
    string LamSachVanBan(string text);
}
