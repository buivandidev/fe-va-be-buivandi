namespace PhuongXa.Application.CacGiaoDien;

/// <summary>
/// Cung cap thong tin nguoi dung hien tai cho cac thanh phan ha tang.
/// </summary>
public interface ICurrentUserService
{
    /// <summary>
    /// Id nguoi dung hien tai, null neu an danh.
    /// </summary>
    Guid? NguoiDungId { get; }

    /// <summary>
    /// Ten dang nhap/ten hien thi cua nguoi dung hien tai.
    /// </summary>
    string? TenNguoiDung { get; }

    /// <summary>
    /// Dia chi ip nguon cua request hien tai.
    /// </summary>
    string? DiaChiIp { get; }

    /// <summary>
    /// User-agent cua request hien tai.
    /// </summary>
    string? TacNhanNguoiDung { get; }
}
