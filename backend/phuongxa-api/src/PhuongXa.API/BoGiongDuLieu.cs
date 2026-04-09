using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using PhuongXa.Domain.CacThucThe;
using PhuongXa.Domain.CacKieuLietKe;
using PhuongXa.Infrastructure.DuLieu;

namespace PhuongXa.API;

public static class BoGiongDuLieu
{
    public static async Task KhoiTaoDuLieuAsync(IServiceProvider dichVu)
    {
        var nhatKy = dichVu.GetRequiredService<ILogger<BuiCanhCSDL>>();
        var quanLyVaiTro = dichVu.GetRequiredService<RoleManager<VaiTro>>();
        var quanLyNguoiDung = dichVu.GetRequiredService<UserManager<NguoiDung>>();
        var csdl = dichVu.GetRequiredService<BuiCanhCSDL>();

        await csdl.Database.MigrateAsync();

        // Khởi tạo vai trò
        string[] cacVaiTro = ["Admin", "Editor", "Viewer"];
        foreach (var vaiTro in cacVaiTro)
        {
            if (!await quanLyVaiTro.RoleExistsAsync(vaiTro))
            {
                var ketQua = await quanLyVaiTro.CreateAsync(new VaiTro { Name = vaiTro });
                if (!ketQua.Succeeded)
                    nhatKy.LogWarning("Tạo vai trò {VaiTro} thất bại: {Loi}", vaiTro,
                        string.Join(", ", ketQua.Errors.Select(e => e.Description)));
            }
        }

        // Khởi tạo tài khoản Admin
        var cauHinh = dichVu.GetRequiredService<IConfiguration>();
        var emailQuanTri = cauHinh["DefaultAdmin:Email"] ?? "admin@phuongxa.vn";
        var matKhauQuanTri = cauHinh["DefaultAdmin:Password"]
            ?? throw new InvalidOperationException(
                "DefaultAdmin:Password phải được cấu hình. " +
                "Đặt bằng user-secrets: dotnet user-secrets set \"DefaultAdmin:Password\" \"MatKhauManh@123\"");

        var moiTruong = dichVu.GetRequiredService<IHostEnvironment>();
        var quanTri = await quanLyNguoiDung.FindByEmailAsync(emailQuanTri);

        if (quanTri is null)
        {
            quanTri = new NguoiDung
            {
                HoTen = "Quản Trị Viên",
                Email = emailQuanTri,
                UserName = emailQuanTri,
                EmailConfirmed = true,
                DangHoatDong = true
            };
            var ketQua = await quanLyNguoiDung.CreateAsync(quanTri, matKhauQuanTri);
            if (ketQua.Succeeded)
            {
                nhatKy.LogInformation("Đã tạo tài khoản quản trị mặc định: {Email}", emailQuanTri);
            }
            else
            {
                nhatKy.LogWarning("Tạo người dùng quản trị thất bại: {Loi}",
                    string.Join(", ", ketQua.Errors.Select(e => e.Description)));
                return;
            }
        }

        // Trong môi trường Development, luôn đồng bộ mật khẩu admin theo cấu hình
        // để tránh sai lệch khi tài khoản admin đã tồn tại từ lần chạy trước.
        if (moiTruong.IsDevelopment())
        {
            var maDatLaiMatKhau = await quanLyNguoiDung.GeneratePasswordResetTokenAsync(quanTri);
            var ketQuaDatLaiMatKhau = await quanLyNguoiDung.ResetPasswordAsync(quanTri, maDatLaiMatKhau, matKhauQuanTri);
            if (!ketQuaDatLaiMatKhau.Succeeded)
            {
                nhatKy.LogWarning("Đồng bộ mật khẩu tài khoản quản trị thất bại: {Loi}",
                    string.Join(", ", ketQuaDatLaiMatKhau.Errors.Select(e => e.Description)));
            }
        }

        if (!await quanLyNguoiDung.IsInRoleAsync(quanTri, "Admin"))
        {
            var ketQuaVaiTro = await quanLyNguoiDung.AddToRoleAsync(quanTri, "Admin");
            if (!ketQuaVaiTro.Succeeded)
                nhatKy.LogWarning("Gán vai trò Admin thất bại: {Loi}",
                    string.Join(", ", ketQuaVaiTro.Errors.Select(e => e.Description)));
        }

        // Khởi tạo danh mục mặc định
        if (!await csdl.DanhMucs.AnyAsync())
        {
            var danhMucTinTuc = new[]
            {
                new DanhMuc { Ten = "Tin tức tổng hợp", DuongDan = "tin-tuc-tong-hop", Loai = LoaiDanhMuc.TinTuc, ThuTuSapXep = 1 },
                new DanhMuc { Ten = "Thông báo - Quyết định", DuongDan = "thong-bao-quyet-dinh", Loai = LoaiDanhMuc.TinTuc, ThuTuSapXep = 2 },
                new DanhMuc { Ten = "Văn hóa - Xã hội", DuongDan = "van-hoa-xa-hoi", Loai = LoaiDanhMuc.TinTuc, ThuTuSapXep = 3 },
                new DanhMuc { Ten = "Kinh tế - Đầu tư", DuongDan = "kinh-te-dau-tu", Loai = LoaiDanhMuc.TinTuc, ThuTuSapXep = 4 }
            };
            var danhMucDichVu = new[]
            {
                new DanhMuc { Ten = "Hộ tịch - Hộ khẩu", DuongDan = "ho-tich-ho-khau", Loai = LoaiDanhMuc.DichVu, ThuTuSapXep = 1 },
                new DanhMuc { Ten = "Xây dựng - Đất đai", DuongDan = "xay-dung-dat-dai", Loai = LoaiDanhMuc.DichVu, ThuTuSapXep = 2 },
                new DanhMuc { Ten = "Kinh doanh - Thuế", DuongDan = "kinh-doanh-thue", Loai = LoaiDanhMuc.DichVu, ThuTuSapXep = 3 }
            };
            csdl.DanhMucs.AddRange(danhMucTinTuc);
            csdl.DanhMucs.AddRange(danhMucDichVu);
            await csdl.SaveChangesAsync();
        }

        // Khởi tạo dịch vụ công mặc định để luồng nộp hồ sơ luôn có dữ liệu
        if (!await csdl.DichVus.AnyAsync())
        {
            var danhMucDichVuMap = await csdl.DanhMucs
                .Where(x => x.Loai == LoaiDanhMuc.DichVu)
                .ToDictionaryAsync(x => x.DuongDan, x => x.Id);

            Guid? LayDanhMucId(string duongDan) =>
                danhMucDichVuMap.TryGetValue(duongDan, out var id) ? id : null;

            csdl.DichVus.AddRange(
                new DichVu
                {
                    Ten = "Đăng ký khai sinh",
                    MaDichVu = "HTHK-001",
                    MoTa = "Đăng ký khai sinh cho trẻ em theo quy định hiện hành.",
                    GiayToCanThiet = "Tờ khai đăng ký khai sinh; giấy chứng sinh; CCCD của cha/mẹ.",
                    SoNgayXuLy = 3,
                    LePhi = 0,
                    DanhMucId = LayDanhMucId("ho-tich-ho-khau"),
                    DangHoatDong = true,
                    ThuTuSapXep = 1
                },
                new DichVu
                {
                    Ten = "Xác nhận thông tin cư trú",
                    MaDichVu = "HTHK-002",
                    MoTa = "Cấp giấy xác nhận thông tin cư trú phục vụ thủ tục hành chính.",
                    GiayToCanThiet = "Đơn đề nghị; CCCD/CMND; giấy tờ chứng minh nơi cư trú (nếu có).",
                    SoNgayXuLy = 2,
                    LePhi = 0,
                    DanhMucId = LayDanhMucId("ho-tich-ho-khau"),
                    DangHoatDong = true,
                    ThuTuSapXep = 2
                },
                new DichVu
                {
                    Ten = "Cấp giấy phép sửa chữa nhà ở riêng lẻ",
                    MaDichVu = "XDDD-001",
                    MoTa = "Thủ tục cấp phép sửa chữa, cải tạo nhà ở riêng lẻ.",
                    GiayToCanThiet = "Đơn đề nghị; bản vẽ hiện trạng; giấy tờ quyền sử dụng đất.",
                    SoNgayXuLy = 7,
                    LePhi = 75000,
                    DanhMucId = LayDanhMucId("xay-dung-dat-dai"),
                    DangHoatDong = true,
                    ThuTuSapXep = 1
                }
            );

            await csdl.SaveChangesAsync();
        }

        // Khởi tạo cài đặt trang web mặc định
        if (!await csdl.CaiDatTrangWebs.AnyAsync())
        {
            csdl.CaiDatTrangWebs.AddRange(
                new CaiDatTrangWeb { Khoa = "SiteName", GiaTri = "Ủy ban nhân dân phường", Loai = "string" },
                new CaiDatTrangWeb { Khoa = "SiteDescription", GiaTri = "Cổng thông tin điện tử phường/xã", Loai = "string" },
                new CaiDatTrangWeb { Khoa = "Address", GiaTri = "Số 1, Đường ABC, Phường XYZ, Quận QRS, TP. Hồ Chí Minh", Loai = "string" },
                new CaiDatTrangWeb { Khoa = "Phone", GiaTri = "028.1234.5678", Loai = "string" },
                new CaiDatTrangWeb { Khoa = "Email", GiaTri = "ubnd.phuong@gmail.com", Loai = "string" },
                new CaiDatTrangWeb { Khoa = "FooterText", GiaTri = "\u00a9 Ủy ban nhân dân phường - Cổng thông tin điện tử", Loai = "string" }
            );
            await csdl.SaveChangesAsync();
        }
    }
}
