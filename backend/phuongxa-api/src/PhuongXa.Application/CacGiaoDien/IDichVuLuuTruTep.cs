namespace PhuongXa.Application.CacGiaoDien;

public interface IDichVuLuuTruTep
{
    Task<string> LuuTepAsync(Stream luongTep, string tenTep, string loaiNoiDung, string thuMuc = "uploads");
    Task XoaTepAsync(string duongDanTep);
    string LayUrlTep(string duongDanTep);
}
