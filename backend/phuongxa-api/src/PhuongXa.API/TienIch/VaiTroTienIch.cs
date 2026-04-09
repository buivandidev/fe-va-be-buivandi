using System.Security.Claims;

namespace PhuongXa.API.TienIch;

/// <summary>
/// Tien ich xu ly va chuan hoa vai tro cho API.
/// </summary>
public static class VaiTroTienIch
{
    public static string ChuanHoaVaiTro(string? vaiTro)
    {
        if (string.IsNullOrWhiteSpace(vaiTro))
            return HangSoPhanQuyen.NguoiXem;

        return vaiTro.Trim().ToLowerInvariant() switch
        {
            "admin" or "quantrihethong" or "quantri" => HangSoPhanQuyen.QuanTriHeThong,
            "editor" or "bientapvien" or "bientap" => HangSoPhanQuyen.BienTapVien,
            "viewer" or "nguoixem" => HangSoPhanQuyen.NguoiXem,
            _ => vaiTro
        };
    }

    public static bool LaQuanTriHoacBienTap(ClaimsPrincipal nguoiDung)
    {
        return nguoiDung.IsInRole(HangSoPhanQuyen.QuanTriHeThong)
            || nguoiDung.IsInRole(HangSoPhanQuyen.BienTapVien);
    }
}
