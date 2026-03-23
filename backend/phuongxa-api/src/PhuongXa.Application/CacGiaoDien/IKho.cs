using System.Linq.Expressions;

namespace PhuongXa.Application.CacGiaoDien;

public interface IKho<T> where T : class
{
    Task<T?> LayTheoIdAsync(Guid id, CancellationToken ct = default);
    Task<T?> LayTheoIdAsync(object id, CancellationToken ct = default);
    Task<IEnumerable<T>> LayTatCaAsync(CancellationToken ct = default);
    Task<IEnumerable<T>> TimAsync(Expression<Func<T, bool>> bieuThuc, CancellationToken ct = default);
    Task<T?> TimDauTienAsync(Expression<Func<T, bool>> bieuThuc, CancellationToken ct = default);
    Task ThemAsync(T thucThe, CancellationToken ct = default);
    void CapNhat(T thucThe);
    void Xoa(T thucThe);
    void XoaNhieu(IEnumerable<T> cacThucThe);
    Task<int> DemAsync(Expression<Func<T, bool>>? bieuThuc = null, CancellationToken ct = default);
    IQueryable<T> TruyVan();
}
