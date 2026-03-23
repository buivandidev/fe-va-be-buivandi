namespace PhuongXa.Application.CacGiaoDien;

public interface IDichVuEmail
{
    Task GuiAsync(string nguoiNhan, string tieuDe, string noiDungHtml);
    Task GuiDaNopDonAsync(string nguoiNhan, string tenNguoiNop, string maTheoDoi, string tenDichVu);
    Task GuiTrangThaiDonThayDoiAsync(string nguoiNhan, string tenNguoiNop, string maTheoDoi, string tenDichVu, string trangThaiMoi, string? ghiChuNguoiXuLy);
    Task GuiChaoMungAsync(string nguoiNhan, string hoTen);
}
