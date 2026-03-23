using System.Net;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;

namespace PhuongXa.API.PhanMemTrungGian;

public class PhanMemNgoaiLeKichThuoc
{
    private readonly RequestDelegate _tiepTheo;
    private readonly ILogger<PhanMemNgoaiLeKichThuoc> _nhatKy;

    private static readonly JsonSerializerOptions TuyChonJson = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase
    };

    public PhanMemNgoaiLeKichThuoc(RequestDelegate tiepTheo, ILogger<PhanMemNgoaiLeKichThuoc> nhatKy)
    {
        _tiepTheo = tiepTheo;
        _nhatKy = nhatKy;
    }

    public async Task InvokeAsync(HttpContext buiCanh)
    {
        try
        {
            await _tiepTheo(buiCanh);
        }
        catch (OperationCanceledException) when (buiCanh.RequestAborted.IsCancellationRequested)
        {
            _nhatKy.LogDebug("Yêu cầu đã bị hủy bởi client: {Path}", buiCanh.Request.Path);
        }
        catch (Exception ex)
        {
            var maTheoDoi = buiCanh.TraceIdentifier;
            _nhatKy.LogError(ex, "Ngoại lệ chưa xử lý [MaTheoDoi: {MaTheoDoi}]: {ThongBao}", maTheoDoi, ex.Message);

            if (!buiCanh.Response.HasStarted)
                await XuLyNgoaiLeAsync(buiCanh, ex, maTheoDoi);
        }
    }

    private static async Task XuLyNgoaiLeAsync(HttpContext buiCanh, Exception ngoaiLe, string maTheoDoi)
    {
        buiCanh.Response.ContentType = "application/json";

        var (maTrangThai, thongBao) = ngoaiLe switch
        {
            UnauthorizedAccessException => (HttpStatusCode.Unauthorized, "Truy cập không được phép"),
            KeyNotFoundException => (HttpStatusCode.NotFound, "Không tìm thấy tài nguyên"),
            ArgumentException => (HttpStatusCode.BadRequest, "Dữ liệu yêu cầu không hợp lệ"),
            FluentValidation.ValidationException => (HttpStatusCode.BadRequest, "Dữ liệu không hợp lệ"),
            DbUpdateException => (HttpStatusCode.Conflict, "Xung đột dữ liệu, vui lòng thử lại"),
            _ => (HttpStatusCode.InternalServerError, "Đã xảy ra lỗi hệ thống, vui lòng thử lại sau")
        };

        buiCanh.Response.StatusCode = (int)maTrangThai;
        buiCanh.Response.Headers["X-Trace-Id"] = maTheoDoi;

        var phanHoi = new { thanhCong = false, thongBao, maTheoDoi };
        await buiCanh.Response.WriteAsync(JsonSerializer.Serialize(phanHoi, TuyChonJson));
    }
}
