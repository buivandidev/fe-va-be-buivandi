using AutoMapper;
using FluentValidation;
using Microsoft.Extensions.DependencyInjection;
using PhuongXa.Application.AnhXa;

namespace PhuongXa.Application;

public static class TiemPhuThuoc
{
    public static IServiceCollection ThemUngDung(this IServiceCollection dichVu)
    {
        dichVu.AddAutoMapper(cfg => cfg.AddMaps(typeof(HoSoAnhXa).Assembly));
        dichVu.AddValidatorsFromAssemblyContaining<HoSoAnhXa>();
        return dichVu;
    }
}
