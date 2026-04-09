using AutoMapper;
using PhuongXa.Application.DTOs.DonUng;
using PhuongXa.Application.DTOs.BaiViet;
using PhuongXa.Application.DTOs.NhatKy;
using PhuongXa.Application.DTOs.DanhMuc;
using PhuongXa.Application.DTOs.BinhLuan;
using PhuongXa.Application.DTOs.LienHe;
using PhuongXa.Application.DTOs.PhuongTien;
using PhuongXa.Application.DTOs.ThongBao;
using PhuongXa.Application.DTOs.HoSo;
using PhuongXa.Application.DTOs.TimKiem;
using PhuongXa.Application.DTOs.DichVu;
using PhuongXa.Application.DTOs.NguoiDung;
using PhuongXa.Application.DTOs.CaiDat;
using PhuongXa.Domain.CacThucThe;

namespace PhuongXa.Application.AnhXa;

public class HoSoAnhXa : Profile
{
    public HoSoAnhXa()
    {
        // DanhMuc
        CreateMap<DanhMuc, DanhMucDto>()
            .PreserveReferences()
            .ForMember(d => d.TenCha, o => o.MapFrom(s => s.Cha != null ? s.Cha.Ten : null));
        CreateMap<TaoDanhMucDto, DanhMuc>()
            .ForMember(d => d.DuongDan, o => o.MapFrom(s => TaoDuongDan.TaoChuoi(s.Ten)));
        CreateMap<CapNhatDanhMucDto, DanhMuc>()
            .ForMember(d => d.DuongDan, o => o.MapFrom(s => TaoDuongDan.TaoChuoi(s.Ten)));

        // BaiViet
        CreateMap<BaiViet, BaiVietDto>()
            .ForMember(d => d.TenTacGia, o => o.MapFrom(s => s.TacGia != null ? s.TacGia.HoTen : ""))
            .ForMember(d => d.TenDanhMuc, o => o.MapFrom(s => s.DanhMuc != null ? s.DanhMuc.Ten : ""))
            .ForMember(d => d.SoBinhLuan, o => o.MapFrom(s => s.DanhSachBinhLuan.Count(c => c.DaDuyet)));
        CreateMap<BaiViet, DanhSachBaiVietDto>()
            .ForMember(d => d.TenTacGia, o => o.MapFrom(s => s.TacGia != null ? s.TacGia.HoTen : ""))
            .ForMember(d => d.TenDanhMuc, o => o.MapFrom(s => s.DanhMuc != null ? s.DanhMuc.Ten : ""));
        CreateMap<TaoBaiVietDto, BaiViet>()
            .ForMember(d => d.DuongDan, o => o.MapFrom(s => TaoDuongDan.TaoChuoi(s.TieuDe)));
        CreateMap<CapNhatBaiVietDto, BaiViet>()
            .ForMember(d => d.DuongDan, o => o.MapFrom(s => TaoDuongDan.TaoChuoi(s.TieuDe)));

        // BinhLuan
        CreateMap<BinhLuan, BinhLuanDto>()
            .PreserveReferences()
            .ForMember(d => d.TenTacGia, o => o.MapFrom(s =>
                s.NguoiDung != null ? s.NguoiDung.HoTen : s.TenKhach ?? "Khong ten"))
            .ForMember(d => d.EmailTacGia, o => o.MapFrom(s =>
                s.NguoiDung != null ? s.NguoiDung.Email : s.EmailKhach))
            .ForMember(d => d.AnhDaiDienTacGia, o => o.MapFrom(s =>
                s.NguoiDung != null ? s.NguoiDung.AnhDaiDien : null));
        CreateMap<TaoBinhLuanDto, BinhLuan>();

        // PhuongTien
        CreateMap<PhuongTien, PhuongTienDto>()
            .ForMember(d => d.TenAlbum, o => o.MapFrom(s => s.Album != null ? s.Album.Ten : null))
            .ForMember(d => d.TenNguoiTaiLen, o => o.MapFrom(s => s.NguoiTaiLen != null ? s.NguoiTaiLen.HoTen : string.Empty))
            .ForMember(d => d.TieuDe, o => o.MapFrom(s => s.VanBanThayThe ?? s.TenTep))
            .ForMember(d => d.DuongDanAnh, o => o.MapFrom(s => s.UrlTep))
            .ForMember(d => d.ThoiGianTao, o => o.MapFrom(s => s.NgayTao));
        CreateMap<AlbumPhuongTien, AlbumPhuongTienDto>()
            .ForMember(d => d.SoPhuongTien, o => o.MapFrom(s => s.DanhSachPhuongTien.Count))
            .ForMember(d => d.DuongDanAnh, o => o.MapFrom(s => s.AnhBia))
            .ForMember(d => d.ThoiGianTao, o => o.MapFrom(s => s.NgayTao));
        CreateMap<TaoAlbumPhuongTienDto, AlbumPhuongTien>();
        CreateMap<CapNhatAlbumPhuongTienDto, AlbumPhuongTien>();
        CreateMap<CapNhatPhuongTienDto, PhuongTien>();

        // DichVu
        CreateMap<DichVu, DichVuDto>()
            .ForMember(d => d.TenDanhMuc, o => o.MapFrom(s => s.DanhMuc != null ? s.DanhMuc.Ten : null));
        CreateMap<TaoDichVuDto, DichVu>();
        CreateMap<CapNhatDichVuDto, DichVu>();

        // DonUng
        CreateMap<DonUngDichVu, DonUngDto>()
            .ForMember(d => d.TenDichVu, o => o.MapFrom(s => s.DichVu != null ? s.DichVu.Ten : ""))
            .ForMember(d => d.NgayHenTra, o => o.MapFrom(s => s.HanXuLy));
        CreateMap<TepDonUng, TepDonUngDto>();
        CreateMap<NopDonUngDto, DonUngDichVu>()
            .ForMember(d => d.MaTheoDoi, o => o.Ignore())
            .ForMember(d => d.TrangThai, o => o.MapFrom(s => Domain.CacKieuLietKe.TrangThaiDonUng.ChoXuLy));

        // NguoiDung
        CreateMap<NguoiDung, NguoiDungDto>()
            .ForMember(d => d.SoDienThoai, o => o.MapFrom(s => s.PhoneNumber))
            .ForMember(d => d.DanhSachVaiTro, o => o.Ignore());

        // NhatKyKiemTra
        CreateMap<NhatKyKiemTra, NhatKyKiemTraDto>();

        // LienHe
        CreateMap<TinNhanLienHe, TinNhanLienHeDto>();
        CreateMap<TaoTinNhanLienHeDto, TinNhanLienHe>();

        // ThongBao
        CreateMap<ThongBao, ThongBaoDto>();

        // LichSuTrangThaiDonUng
        CreateMap<LichSuTrangThaiDonUng, LichSuTrangThaiDonUngDto>()
            .ForMember(d => d.TenNguoiThayDoi, o => o.MapFrom(s => s.NguoiThayDoi != null ? s.NguoiThayDoi.HoTen : string.Empty));

        // HoSo
        CreateMap<NguoiDung, HoSoDto>()
            .ForMember(d => d.SoDienThoai, o => o.MapFrom(s => s.PhoneNumber))
            .ForMember(d => d.DanhSachVaiTro, o => o.Ignore());
        CreateMap<CapNhatHoSoDto, NguoiDung>()
            .ForMember(d => d.HoTen, o => o.MapFrom(s => s.HoTen))
            .ForMember(d => d.PhoneNumber, o => o.MapFrom(s => s.SoDienThoai));

        // TimKiem
        CreateMap<BaiViet, MucTimKiemDto>()
            .ForMember(d => d.TieuDe, o => o.MapFrom(s => s.TieuDe))
            .ForMember(d => d.MoTa, o => o.MapFrom(s => s.TomTat))
            .ForMember(d => d.AnhDaiDien, o => o.MapFrom(s => s.AnhDaiDien))
            .ForMember(d => d.Loai, o => o.MapFrom(_ => "baiviet"));
        CreateMap<DichVu, MucTimKiemDto>()
            .ForMember(d => d.TieuDe, o => o.MapFrom(s => s.Ten))
            .ForMember(d => d.MoTa, o => o.MapFrom(s => s.MoTa))
            .ForMember(d => d.DuongDan, o => o.MapFrom(s => s.MaDichVu))
            .ForMember(d => d.AnhDaiDien, o => o.Ignore())
            .ForMember(d => d.Loai, o => o.MapFrom(_ => "dichvu"));

        // CaiDatTrangWeb
        CreateMap<CaiDatTrangWeb, CaiDatTrangWebDto>();
    }
}

public static class TaoDuongDan
{
    private static readonly Dictionary<string, string> BangChuyen = new()
    {
        {"\u00e0","a"},{"\u00e1","a"},{"\u1ea3","a"},{"\u00e3","a"},{"\u1ea1","a"},
        {"\u0103","a"},{"\u1eb1","a"},{"\u1eaf","a"},{"\u1eb3","a"},{"\u1eb5","a"},{"\u1eb7","a"},
        {"\u00e2","a"},{"\u1ea7","a"},{"\u1ea5","a"},{"\u1ea9","a"},{"\u1eab","a"},{"\u1ead","a"},
        {"\u0111","d"},
        {"\u00e8","e"},{"\u00e9","e"},{"\u1ebb","e"},{"\u1ebd","e"},{"\u1eb9","e"},
        {"\u00ea","e"},{"\u1ec1","e"},{"\u1ebf","e"},{"\u1ec3","e"},{"\u1ec5","e"},{"\u1ec7","e"},
        {"\u00ec","i"},{"\u00ed","i"},{"\u1ec9","i"},{"\u0129","i"},{"\u1ecb","i"},
        {"\u00f2","o"},{"\u00f3","o"},{"\u1ecf","o"},{"\u00f5","o"},{"\u1ecd","o"},
        {"\u00f4","o"},{"\u1ed3","o"},{"\u1ed1","o"},{"\u1ed5","o"},{"\u1ed7","o"},{"\u1ed9","o"},
        {"\u01a1","o"},{"\u1edd","o"},{"\u1edb","o"},{"\u1edf","o"},{"\u1ee1","o"},{"\u1ee3","o"},
        {"\u00f9","u"},{"\u00fa","u"},{"\u1ee7","u"},{"\u0169","u"},{"\u1ee5","u"},
        {"\u01b0","u"},{"\u1eeb","u"},{"\u1ee9","u"},{"\u1eed","u"},{"\u1eef","u"},{"\u1ef1","u"},
        {"\u1ef3","y"},{"\u00fd","y"},{"\u1ef7","y"},{"\u1ef9","y"},{"\u1ef5","y"}
    };

    public static string TaoChuoi(string text)
    {
        if (string.IsNullOrWhiteSpace(text)) return string.Empty;
        text = text.ToLowerInvariant().Trim();
        foreach (var kv in BangChuyen) text = text.Replace(kv.Key, kv.Value);
        text = System.Text.RegularExpressions.Regex.Replace(text, @"[^a-z0-9\s-]", "");
        text = System.Text.RegularExpressions.Regex.Replace(text, @"\s+", "-");
        text = System.Text.RegularExpressions.Regex.Replace(text, @"-+", "-");
        return text.Trim('-');
    }
}
