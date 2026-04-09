using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using PhuongXa.Application.CacGiaoDien;
using PhuongXa.Domain.CacThucThe;
using PhuongXa.Infrastructure.DuLieu;
using PhuongXa.Infrastructure.CacKho;
using PhuongXa.Infrastructure.CacDichVu;

namespace PhuongXa.Infrastructure;

public static class TiemPhuThuocHaTang
{
    public static IServiceCollection ThemHaTang(this IServiceCollection dichVu, IConfiguration cauHinh)
    {
        var isTesting = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Testing";
        var isDevelopment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Development";

        if (!isTesting)
        {
            // EF Core + PostgreSQL
            dichVu.AddDbContext<BuiCanhCSDL>(options =>
                options.UseNpgsql(cauHinh.GetConnectionString("DefaultConnection"), 
                    npgsql => npgsql.MigrationsAssembly("PhuongXa.Infrastructure")));
        }
        else
        {
            // Dành cho Integration Tests
            dichVu.AddDbContext<BuiCanhCSDL>(options =>
                options.UseInMemoryDatabase("InMemoryDbForTesting"));
        }

        // ASP.NET Identity
        dichVu.AddIdentity<NguoiDung, VaiTro>(options =>
        {
            if (isDevelopment)
            {
                options.Password.RequireDigit = false;
                options.Password.RequiredLength = 3;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireUppercase = false;
                options.Password.RequireLowercase = false;
            }
            else
            {
                options.Password.RequireDigit = true;
                options.Password.RequiredLength = 8;
                options.Password.RequireNonAlphanumeric = true;
                options.Password.RequireUppercase = true;
                options.Password.RequireLowercase = true;
            }
            options.User.RequireUniqueEmail = true;
            options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(15);
            options.Lockout.MaxFailedAccessAttempts = 5;
        })
        .AddEntityFrameworkStores<BuiCanhCSDL>()
        .AddDefaultTokenProviders();

        // Repositories & UoW
        dichVu.AddScoped(typeof(IKho<>), typeof(Kho<>));
        dichVu.AddScoped<IDonViCongViec, DonViCongViec>();

        // Services
        dichVu.AddScoped<IDichVuJwt, DichVuJwt>();
        dichVu.AddScoped<IDichVuLuuTruTep, DichVuLuuTruTepCucBo>();
        dichVu.AddScoped<IDichVuEmail, DichVuEmailSmtp>();
        dichVu.AddScoped<IDichVuThanhToanVnPay, DichVuThanhToanVnPay>();
        dichVu.AddScoped<IDichVuXuatPhieuHoSoPdf, DichVuXuatPhieuHoSoPdf>();
        dichVu.AddSingleton<IDichVuLamSachHtml, DichVuLamSachHtml>();

        // Background services
        dichVu.AddHostedService<DichVuDocDepMaLamMoi>();

        return dichVu;
    }
}
