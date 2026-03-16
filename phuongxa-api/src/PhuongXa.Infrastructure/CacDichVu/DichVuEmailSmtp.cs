using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using PhuongXa.Application.CacGiaoDien;

namespace PhuongXa.Infrastructure.CacDichVu;

public class DichVuEmailSmtp : IDichVuEmail
{
    private readonly IConfiguration _cauHinh;
    private readonly ILogger<DichVuEmailSmtp> _nhatKy;

    public DichVuEmailSmtp(IConfiguration cauHinh, ILogger<DichVuEmailSmtp> nhatKy)
    {
        _cauHinh = cauHinh;
        _nhatKy = nhatKy;
    }

    // ── Helpers ──────────────────────────────────────────────

    private static string E(string? value) => WebUtility.HtmlEncode(value ?? string.Empty);

    private static string WrapEmailTemplate(string content) =>
        $"""
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
          {content}
          <hr style="margin-top:32px;border-color:#e5e7eb"/>
          <p style="color:#6b7280;font-size:12px">Email này được gửi tự động, vui lòng không trả lời.</p>
        </div>
        """;

    // ── Core ─────────────────────────────────────────────────

    public async Task GuiAsync(string nguoiNhan, string tieuDe, string noiDungHtml)
    {
        var emailGuiDi = _cauHinh["Email:SenderEmail"];
        var tenDangNhap = _cauHinh["Email:Username"];
        if (string.IsNullOrEmpty(emailGuiDi) || string.IsNullOrEmpty(tenDangNhap))
        {
            _nhatKy.LogWarning("Email not configured, skipping send to {To}", nguoiNhan);
            return;
        }

        try
        {
            var host = _cauHinh["Email:SmtpHost"] ?? "smtp.gmail.com";
            var port = int.TryParse(_cauHinh["Email:SmtpPort"], out var p) ? p : 587;
            var enableSsl = !bool.TryParse(_cauHinh["Email:EnableSsl"], out var ssl) || ssl;
            var tenNguoiGui = _cauHinh["Email:SenderName"] ?? "Cổng Thông Tin Điện Tử Phường/Xã";
            var matKhau = _cauHinh["Email:Password"] ?? "";

            using var client = new SmtpClient(host, port)
            {
                EnableSsl = enableSsl,
                Credentials = new NetworkCredential(tenDangNhap, matKhau)
            };

            using var thuDienTu = new MailMessage
            {
                From = new MailAddress(emailGuiDi, tenNguoiGui),
                Subject = tieuDe,
                Body = noiDungHtml,
                IsBodyHtml = true
            };
            thuDienTu.To.Add(nguoiNhan);
            await client.SendMailAsync(thuDienTu);
        }
        catch (Exception ex)
        {
            _nhatKy.LogError(ex, "Error sending email to {To}: {Subject}", nguoiNhan, tieuDe);
        }
    }

    public async Task GuiDaNopDonAsync(string nguoiNhan, string tenNguoiNop, string maTheoDoi, string tenDichVu)
    {
        var tieuDe = $"[Xác nhận] Đã tiếp nhận hồ sơ - Mã theo dõi: {maTheoDoi}";
        var noiDung = WrapEmailTemplate($"""
              <h2 style="color:#1a56db">Xác Nhận Nộp Hồ Sơ Thành Công</h2>
              <p>Xin chào <strong>{E(tenNguoiNop)}</strong>,</p>
              <p>Hồ sơ của bạn đã được tiếp nhận thành công. Chi tiết như sau:</p>
              <table style="width:100%;border-collapse:collapse">
                <tr><td style="padding:8px;background:#f3f4f6;font-weight:bold">Dịch vụ:</td>
                    <td style="padding:8px">{E(tenDichVu)}</td></tr>
                <tr><td style="padding:8px;background:#f3f4f6;font-weight:bold">Mã theo dõi:</td>
                    <td style="padding:8px"><strong style="color:#1a56db;font-size:18px">{E(maTheoDoi)}</strong></td></tr>
                <tr><td style="padding:8px;background:#f3f4f6;font-weight:bold">Trạng thái:</td>
                    <td style="padding:8px">Đang chờ xử lý</td></tr>
              </table>
              <div style="margin-top:20px;padding:16px;background:#eff6ff;border-left:4px solid #1a56db">
                <p style="margin:0">Vui lòng lưu giữ <strong>mã theo dõi</strong> để tra cứu tiến trình hồ sơ của bạn.</p>
              </div>
            """);
        await GuiAsync(nguoiNhan, tieuDe, noiDung);
    }

    public async Task GuiTrangThaiDonThayDoiAsync(string nguoiNhan, string tenNguoiNop, string maTheoDoi,
        string tenDichVu, string trangThaiMoi, string? ghiChuNguoiXuLy)
    {
        var hienThiTrangThai = trangThaiMoi switch
        {
            "DangXuLy" => "Đang xử lý",
            "HoanThanh" => "Hoàn thành",
            "TuChoi" => "Từ chối",
            _ => E(trangThaiMoi)
        };
        var mauTrangThai = trangThaiMoi switch
        {
            "HoanThanh" => "#059669",
            "TuChoi" => "#dc2626",
            _ => "#d97706"
        };

        var tieuDe = $"[Cập nhật hồ sơ {maTheoDoi}] Trạng thái: {hienThiTrangThai}";
        var ghiChuHtml = string.IsNullOrEmpty(ghiChuNguoiXuLy) ? "" :
            $"<div style=\"margin-top:12px;padding:12px;background:#f9fafb;border-left:4px solid #6b7280\">" +
            $"<strong>Ghi chú từ cán bộ xử lý:</strong><br/>{E(ghiChuNguoiXuLy)}</div>";

        var noiDung = WrapEmailTemplate($"""
              <h2 style="color:#1a56db">Cập Nhật Trạng Thái Hồ Sơ</h2>
              <p>Xin chào <strong>{E(tenNguoiNop)}</strong>,</p>
              <p>Trạng thái hồ sơ của bạn đã được cập nhật:</p>
              <table style="width:100%;border-collapse:collapse">
                <tr><td style="padding:8px;background:#f3f4f6;font-weight:bold">Dịch vụ:</td>
                    <td style="padding:8px">{E(tenDichVu)}</td></tr>
                <tr><td style="padding:8px;background:#f3f4f6;font-weight:bold">Mã theo dõi:</td>
                    <td style="padding:8px"><strong>{E(maTheoDoi)}</strong></td></tr>
                <tr><td style="padding:8px;background:#f3f4f6;font-weight:bold">Trạng thái mới:</td>
                    <td style="padding:8px"><span style="color:{mauTrangThai};font-weight:bold">{hienThiTrangThai}</span></td></tr>
              </table>
              {ghiChuHtml}
            """);
        await GuiAsync(nguoiNhan, tieuDe, noiDung);
    }

    public async Task GuiChaoMungAsync(string nguoiNhan, string hoTen)
    {
        var tieuDe = "Chào mừng bạn đến với Cổng Thông Tin Điện Tử Phường/Xã";
        var noiDung = WrapEmailTemplate($"""
              <h2 style="color:#1a56db">Chào mừng {E(hoTen)}!</h2>
              <p>Tài khoản của bạn đã được tạo thành công trên Cổng Thông Tin Điện Tử Phường/Xã.</p>
              <p>Bạn có thể sử dụng tài khoản để:</p>
              <ul>
                <li>Nộp và theo dõi hồ sơ dịch vụ công trực tuyến</li>
                <li>Bình luận và tương tác với các bài viết</li>
                <li>Nhận thông báo cập nhật trạng thái hồ sơ</li>
              </ul>
            """);
        await GuiAsync(nguoiNhan, tieuDe, noiDung);
    }
}
