using System.Diagnostics;
using System.Security.Claims;

namespace PhuongXa.API.PhanMemTrungGian;

public class PhanMemGhiNhanYeuCau
{
    private readonly RequestDelegate _tiepTheo;
    private readonly ILogger<PhanMemGhiNhanYeuCau> _nhatKy;

    public PhanMemGhiNhanYeuCau(RequestDelegate tiepTheo, ILogger<PhanMemGhiNhanYeuCau> nhatKy)
    {
        _tiepTheo = tiepTheo;
        _nhatKy = nhatKy;
    }

    public async Task InvokeAsync(HttpContext buiCanh)
    {
        var dongHo = Stopwatch.StartNew();
        var phuongThuc = buiCanh.Request.Method;
        var duongDan = buiCanh.Request.Path;
        var ip = buiCanh.Connection.RemoteIpAddress?.ToString();

        try
        {
            await _tiepTheo(buiCanh);
        }
        finally
        {
            dongHo.Stop();
            var maTrangThai = buiCanh.Response.StatusCode;
            var maNguoiDung = buiCanh.User?.FindFirstValue(ClaimTypes.NameIdentifier);

            if (dongHo.ElapsedMilliseconds > 500)
            {
                _nhatKy.LogWarning(
                    "HTTP {PhuongThuc} {DuongDan} phan hoi {MaTrangThai} trong {ThoiGian}ms [NguoiDung: {MaNguoiDung}, IP: {IP}]",
                    phuongThuc, duongDan, maTrangThai, dongHo.ElapsedMilliseconds, maNguoiDung ?? "an_danh", ip);
            }
            else
            {
                _nhatKy.LogInformation(
                    "HTTP {PhuongThuc} {DuongDan} phan hoi {MaTrangThai} trong {ThoiGian}ms [NguoiDung: {MaNguoiDung}, IP: {IP}]",
                    phuongThuc, duongDan, maTrangThai, dongHo.ElapsedMilliseconds, maNguoiDung ?? "an_danh", ip);
            }
        }
    }
}
