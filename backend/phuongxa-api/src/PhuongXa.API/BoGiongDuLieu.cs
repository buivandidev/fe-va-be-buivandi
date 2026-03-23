using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
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

        if (await quanLyNguoiDung.FindByEmailAsync(emailQuanTri) == null)
        {
            var quanTri = new NguoiDung
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
                var ketQuaVaiTro = await quanLyNguoiDung.AddToRoleAsync(quanTri, "Admin");
                if (!ketQuaVaiTro.Succeeded)
                    nhatKy.LogWarning("Gán vai trò Admin thất bại: {Loi}",
                        string.Join(", ", ketQuaVaiTro.Errors.Select(e => e.Description)));
            }
            else
            {
                nhatKy.LogWarning("Tạo người dùng quản trị thất bại: {Loi}",
                    string.Join(", ", ketQua.Errors.Select(e => e.Description)));
            }
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
