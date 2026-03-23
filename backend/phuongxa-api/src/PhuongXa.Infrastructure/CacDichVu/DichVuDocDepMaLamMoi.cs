using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using PhuongXa.Infrastructure.DuLieu;

namespace PhuongXa.Infrastructure.CacDichVu;

public class DichVuDocDepMaLamMoi : BackgroundService
{
    private readonly IServiceScopeFactory _nhaPhapVi;
    private readonly ILogger<DichVuDocDepMaLamMoi> _nhatKy;
    private static readonly TimeSpan KhoangCach = TimeSpan.FromHours(24);

    public DichVuDocDepMaLamMoi(IServiceScopeFactory nhaPhapVi, ILogger<DichVuDocDepMaLamMoi> nhatKy)
    {
        _nhaPhapVi = nhaPhapVi;
        _nhatKy = nhatKy;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        // Wait a bit before first run to let the app fully start
        await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken);

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await DocDepMaHetHanAsync(stoppingToken);
            }
            catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
            {
                break;
            }
            catch (Exception ex)
            {
                _nhatKy.LogError(ex, "Error cleaning up expired refresh tokens");
            }

            await Task.Delay(KhoangCach, stoppingToken);
        }
    }

    private async Task DocDepMaHetHanAsync(CancellationToken ct)
    {
        using var phamVi = _nhaPhapVi.CreateScope();
        var csdl = phamVi.ServiceProvider.GetRequiredService<BuiCanhCSDL>();

        var thoiDiemCat = DateTime.UtcNow;
        var daXoa = await csdl.MaLamMois
            .Where(r => r.HetHanLuc < thoiDiemCat || r.DaBiThuHoi)
            .ExecuteDeleteAsync(ct);

        if (daXoa > 0)
            _nhatKy.LogInformation("Cleaned up {Count} expired/revoked refresh tokens", daXoa);
    }
}
