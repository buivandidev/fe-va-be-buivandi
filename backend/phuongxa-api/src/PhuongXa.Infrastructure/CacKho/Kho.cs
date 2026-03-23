using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using PhuongXa.Application.CacGiaoDien;
using PhuongXa.Infrastructure.DuLieu;

namespace PhuongXa.Infrastructure.CacKho;

public class Kho<T> : IKho<T> where T : class
{
    private readonly DbSet<T> _tapDuLieu;

    public Kho(BuiCanhCSDL buiCanh)
    {
        _tapDuLieu = buiCanh.Set<T>();
    }

    public async Task<T?> LayTheoIdAsync(Guid id, CancellationToken ct = default) =>
        await _tapDuLieu.FindAsync(new object[] { id }, ct);

    public async Task<T?> LayTheoIdAsync(object id, CancellationToken ct = default) =>
        await _tapDuLieu.FindAsync(new object[] { id }, ct);

    public async Task<IEnumerable<T>> LayTatCaAsync(CancellationToken ct = default) =>
        await _tapDuLieu.ToListAsync(ct);

    public async Task<IEnumerable<T>> TimAsync(Expression<Func<T, bool>> bieuThuc, CancellationToken ct = default) =>
        await _tapDuLieu.Where(bieuThuc).ToListAsync(ct);

    public async Task<T?> TimDauTienAsync(Expression<Func<T, bool>> bieuThuc, CancellationToken ct = default) =>
        await _tapDuLieu.FirstOrDefaultAsync(bieuThuc, ct);

    public async Task ThemAsync(T thucThe, CancellationToken ct = default) =>
        await _tapDuLieu.AddAsync(thucThe, ct);

    public void CapNhat(T thucThe) => _tapDuLieu.Update(thucThe);

    public void Xoa(T thucThe) => _tapDuLieu.Remove(thucThe);

    public void XoaNhieu(IEnumerable<T> cacThucThe) => _tapDuLieu.RemoveRange(cacThucThe);

    public async Task<int> DemAsync(Expression<Func<T, bool>>? bieuThuc = null, CancellationToken ct = default) =>
        bieuThuc == null
            ? await _tapDuLieu.CountAsync(ct)
            : await _tapDuLieu.CountAsync(bieuThuc, ct);

    public IQueryable<T> TruyVan() => _tapDuLieu.AsQueryable();
}
