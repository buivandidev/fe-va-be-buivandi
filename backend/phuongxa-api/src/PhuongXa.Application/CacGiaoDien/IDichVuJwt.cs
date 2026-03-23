using PhuongXa.Domain.CacThucThe;

namespace PhuongXa.Application.CacGiaoDien;

public interface IDichVuJwt
{
    string TaoMaTruyCap(NguoiDung nguoiDung, IList<string> danhSachVaiTro);
    string TaoMaLamMoi();
}
