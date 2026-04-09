using PhuongXa.Application.Chung;

namespace PhuongXa.API.PhanMemTrungGian;

/// <summary>
/// Middleware xu ly ngoai le tap trung va tra ve JSON thong nhat.
/// </summary>
public class PhanMemXuLyNgoaiLe
{
    /// <summary>
    /// Bien thanh vien phuc vu xu ly tiep theo trong vong doi cua lop.
    /// </summary>
    private readonly RequestDelegate _tiepTheo;
    /// <summary>
    /// Bien thanh vien phuc vu xu ly nhat ky trong vong doi cua lop.
    /// </summary>
    private readonly ILogger<PhanMemXuLyNgoaiLe> _nhatKy;

    public PhanMemXuLyNgoaiLe(RequestDelegate tiepTheo, ILogger<PhanMemXuLyNgoaiLe> nhatKy)
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
            // Client da dong ket noi, bo qua.
        }
        catch (Exception ex)
        {
            _nhatKy.LogError(ex, "Unhandled exception for {Method} {Path}", buiCanh.Request.Method, buiCanh.Request.Path);
            await TraVePhanHoiLoiAsync(buiCanh, ex);
        }
    }

    private static async Task TraVePhanHoiLoiAsync(HttpContext buiCanh, Exception ex)
    {
        if (buiCanh.Response.HasStarted)
            return;

        buiCanh.Response.Clear();
        buiCanh.Response.ContentType = "application/json";

        var maTrangThai = StatusCodes.Status500InternalServerError;
        var thongBao = "Da xay ra loi he thong";

        if (ex is UnauthorizedAccessException)
        {
            maTrangThai = StatusCodes.Status401Unauthorized;
            thongBao = "Ban chua dang nhap hoac phien dang nhap da het han";
        }
        else if (ex is ArgumentException || ex is InvalidOperationException)
        {
            maTrangThai = StatusCodes.Status400BadRequest;
            thongBao = ex.Message;
        }

        buiCanh.Response.StatusCode = maTrangThai;
        await buiCanh.Response.WriteAsJsonAsync(PhanHoiApi.ThatBai(thongBao));
    }
}
