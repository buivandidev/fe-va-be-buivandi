using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using PhuongXa.Application.CacGiaoDien;

namespace PhuongXa.Infrastructure.CacDichVu;

public class DichVuLuuTruTepCucBo : IDichVuLuuTruTep
{
    private readonly string _duongDanGocWeb;
    private readonly string _urlGoc;
    private readonly ILogger<DichVuLuuTruTepCucBo> _nhatKy;

    public DichVuLuuTruTepCucBo(IWebHostEnvironment moiTruong, IConfiguration cauHinh, ILogger<DichVuLuuTruTepCucBo> nhatKy)
    {
        _duongDanGocWeb = moiTruong.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
        _urlGoc = cauHinh["FileStorage:BaseUrl"]
            ?? throw new InvalidOperationException("Thiếu cấu hình bắt buộc: FileStorage:BaseUrl");
        _nhatKy = nhatKy;
    }

    public async Task<string> LuuTepAsync(Stream luongTep, string tenTep, string loaiNoiDung, string thuMuc = "uploads")
    {
        // Whitelist allowed extensions
        var duoiChoPhep = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp", ".mp4", ".webm", ".ogg", ".pdf", ".doc", ".docx", ".xlsx", ".xls" };
        var duoiTep = Path.GetExtension(tenTep).ToLowerInvariant();
        if (!duoiChoPhep.Contains(duoiTep))
            throw new InvalidOperationException("Loại tệp không được phép");

        // Generate safe file name (never trust user input)
        var tenTepAnToan = $"{Guid.NewGuid()}{duoiTep}";

        var duongDanThuMuc = Path.Combine(_duongDanGocWeb, thuMuc);
        var namThang = DateTime.UtcNow.ToString("yyyy/MM");
        var duongDanThuMucDayDu = Path.Combine(duongDanThuMuc, namThang);

        // Verify directory path stays within wwwroot BEFORE creating it
        if (!Path.GetFullPath(duongDanThuMucDayDu).StartsWith(Path.GetFullPath(_duongDanGocWeb), StringComparison.OrdinalIgnoreCase))
            throw new InvalidOperationException("Đường dẫn thư mục không hợp lệ");

        Directory.CreateDirectory(duongDanThuMucDayDu);

        // Verify final path stays within wwwroot
        var duongDanDay = Path.GetFullPath(Path.Combine(duongDanThuMucDayDu, tenTepAnToan));
        if (!duongDanDay.StartsWith(Path.GetFullPath(_duongDanGocWeb), StringComparison.OrdinalIgnoreCase))
            throw new InvalidOperationException("Đường dẫn tệp không hợp lệ");

        using var luongXuatTep = new FileStream(duongDanDay, FileMode.Create);
        await luongTep.CopyToAsync(luongXuatTep);

        return Path.Combine(thuMuc, namThang, tenTepAnToan).Replace("\\", "/");
    }

    public async Task XoaTepAsync(string duongDanTep)
    {
        var duongDanDayDu = Path.GetFullPath(Path.Combine(_duongDanGocWeb, duongDanTep));
        var duongDanGocChoPhep = Path.GetFullPath(_duongDanGocWeb);

        if (!duongDanDayDu.StartsWith(duongDanGocChoPhep, StringComparison.OrdinalIgnoreCase))
        {
            _nhatKy.LogWarning("Attempted path traversal delete blocked: {FilePath}", duongDanTep);
            throw new InvalidOperationException("Đường dẫn tệp không hợp lệ");
        }

        await Task.Run(() =>
        {
            if (File.Exists(duongDanDayDu))
                File.Delete(duongDanDayDu);
        });
    }

    public string LayUrlTep(string duongDanTep) =>
        string.IsNullOrEmpty(duongDanTep) ? string.Empty : $"{_urlGoc}/{duongDanTep}";
}
