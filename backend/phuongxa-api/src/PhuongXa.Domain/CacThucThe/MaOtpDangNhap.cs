namespace PhuongXa.Domain.CacThucThe;

/// <summary>
/// OTP dang nhap theo co che challenge-response.
/// </summary>
public class MaOtpDangNhap
{
    /// <summary>
    /// Khoa chinh.
    /// </summary>
    public Guid Id { get; set; } = Guid.NewGuid();

    /// <summary>
    /// Nguoi dung so huu OTP.
    /// </summary>
    public Guid NguoiDungId { get; set; }

    /// <summary>
    /// Ma OTP da bam, khong luu plain text.
    /// </summary>
    public string MaBamOtp { get; set; } = string.Empty;

    /// <summary>
    /// Thoi diem het han OTP.
    /// </summary>
    public DateTime HetHanLuc { get; set; }

    /// <summary>
    /// Danh dau OTP da duoc xac thuc.
    /// </summary>
    public bool DaSuDung { get; set; }

    /// <summary>
    /// Danh dau OTP bi huy bo.
    /// </summary>
    public bool DaBiHuy { get; set; }

    /// <summary>
    /// Thoi diem tao challenge.
    /// </summary>
    public DateTime NgayTao { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// So lan nhap sai OTP.
    /// </summary>
    public int SoLanThuSai { get; set; }

    /// <summary>
    /// Dia chi ip tao challenge.
    /// </summary>
    public string? TaoBoiIp { get; set; }

    /// <summary>
    /// User-agent tao challenge.
    /// </summary>
    public string? TaoBoiTacNhan { get; set; }

    /// <summary>
    /// Navigation nguoi dung.
    /// </summary>
    public virtual NguoiDung NguoiDung { get; set; } = null!;
}
