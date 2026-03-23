using AutoMapper;
using Microsoft.EntityFrameworkCore;
using PhuongXa.Application.Chung;

namespace PhuongXa.API.TienIch;

public static class TienIchTruVan
{
    public static async Task<KetQuaPhanTrang<TDto>> PhanTrangAsync<TEntity, TDto>(
        this IQueryable<TEntity> truyVan,
        int trang,
        int kichThuocTrang,
        IMapper anhXa) where TEntity : class
    {
        var tongSo = await truyVan.CountAsync();
        var danhSach = await truyVan
            .Skip((trang - 1) * kichThuocTrang)
            .Take(kichThuocTrang)
            .ToListAsync();

        return new KetQuaPhanTrang<TDto>
        {
            DanhSach = anhXa.Map<List<TDto>>(danhSach),
            TongSo = tongSo,
            Trang = trang,
            KichThuocTrang = kichThuocTrang
        };
    }
}
