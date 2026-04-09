using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using Microsoft.EntityFrameworkCore;
using PhuongXa.API.TienIch;
using PhuongXa.Application.AnhXa;
using PhuongXa.Application.CacGiaoDien;
using PhuongXa.Application.Chung;
using PhuongXa.Application.DTOs.BaiViet;
using PhuongXa.Domain.CacKieuLietKe;
using PhuongXa.Domain.CacThucThe;
using PhuongXa.API.Controllers;

namespace PhuongXa.API.Controllers.Public;
[Route("api/public/articles")]
public class PublicArticlesController : BaseApiController
{
    private readonly IDonViCongViec _donViCongViec;
    private readonly IMapper _anhXa;
    private readonly IDichVuLamSachHtml _dichVuLamSachHtml;
    public PublicArticlesController(IDonViCongViec donViCongViec, IMapper anhXa, IDichVuLamSachHtml dichVuLamSachHtml)
    {
        _donViCongViec = donViCongViec;
        _anhXa = anhXa;
        _dichVuLamSachHtml = dichVuLamSachHtml;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> LayDanhSach([FromQuery] string? tuKhoa, [FromQuery] Guid? danhMucId, [FromQuery] TrangThaiBaiViet? trangThai, [FromQuery] int trang = 1, [FromQuery] int kichThuocTrang = 10, CancellationToken ct = default)
    {
        (trang, kichThuocTrang) = ChuanHoaPhanTrang(trang, kichThuocTrang, 100);
        var truyVan = _donViCongViec.BaiViets.TruyVan().AsNoTracking().Include(x => x.TacGia).Include(x => x.DanhMuc).Include(x => x.DanhSachBinhLuan).AsQueryable();
        if (!string.IsNullOrWhiteSpace(tuKhoa))
        {
            var khoa = tuKhoa.Trim().ToLower();
            truyVan = truyVan.Where(x => x.TieuDe.ToLower().Contains(khoa) || (x.TomTat != null && x.TomTat.ToLower().Contains(khoa)));
        }

        if (danhMucId.HasValue)
            truyVan = truyVan.Where(x => x.DanhMucId == danhMucId.Value);
        var laQuanTriHoacBienTap = VaiTroTienIch.LaQuanTriHoacBienTap(User);
        if (laQuanTriHoacBienTap)
        {
            if (trangThai.HasValue)
                truyVan = truyVan.Where(x => x.TrangThai == trangThai.Value);
        }
        else
        {
            truyVan = truyVan.Where(x => x.TrangThai == TrangThaiBaiViet.DaXuatBan && (!x.NgayXuatBan.HasValue || x.NgayXuatBan <= DateTime.UtcNow));
        }

        truyVan = truyVan.OrderByDescending(x => x.NgayXuatBan ?? x.NgayTao);
        var ketQua = await truyVan.PhanTrangAsync<BaiViet, DanhSachBaiVietDto>(trang, kichThuocTrang, _anhXa);
        return Ok(PhanHoiApi<KetQuaPhanTrang<DanhSachBaiVietDto>>.ThanhCongKetQua(ketQua));
    }

    [HttpGet("{id:guid}")]
    [AllowAnonymous]
    public async Task<IActionResult> LayTheoId(Guid id, CancellationToken ct)
    {
        var baiViet = await _donViCongViec.BaiViets.TruyVan().Include(x => x.TacGia).Include(x => x.DanhMuc).Include(x => x.DanhSachBinhLuan).FirstOrDefaultAsync(x => x.Id == id, ct);
        if (baiViet is null)
            return NotFound(PhanHoiApi.ThatBai("Khong tim thay bai viet"));
        if (!VaiTroTienIch.LaQuanTriHoacBienTap(User) && (baiViet.TrangThai != TrangThaiBaiViet.DaXuatBan || (baiViet.NgayXuatBan.HasValue && baiViet.NgayXuatBan > DateTime.UtcNow)))
        {
            return NotFound(PhanHoiApi.ThatBai("Khong tim thay bai viet"));
        }

        baiViet.SoLuotXem += 1;
        _donViCongViec.BaiViets.CapNhat(baiViet);
        await _donViCongViec.LuuThayDoiAsync(ct);
        return Ok(PhanHoiApi<BaiVietDto>.ThanhCongKetQua(_anhXa.Map<BaiVietDto>(baiViet)));
    }

    [HttpGet("slug/{duongDan}")]
    [AllowAnonymous]
    public async Task<IActionResult> LayTheoDuongDan(string duongDan, CancellationToken ct)
    {
        var baiViet = await _donViCongViec.BaiViets.TruyVan().Include(x => x.TacGia).Include(x => x.DanhMuc).Include(x => x.DanhSachBinhLuan).FirstOrDefaultAsync(x => x.DuongDan == duongDan, ct);
        if (baiViet is null)
            return NotFound(PhanHoiApi.ThatBai("Khong tim thay bai viet"));
        if (!VaiTroTienIch.LaQuanTriHoacBienTap(User) && (baiViet.TrangThai != TrangThaiBaiViet.DaXuatBan || (baiViet.NgayXuatBan.HasValue && baiViet.NgayXuatBan > DateTime.UtcNow)))
        {
            return NotFound(PhanHoiApi.ThatBai("Khong tim thay bai viet"));
        }

        baiViet.SoLuotXem += 1;
        _donViCongViec.BaiViets.CapNhat(baiViet);
        await _donViCongViec.LuuThayDoiAsync(ct);
        return Ok(PhanHoiApi<BaiVietDto>.ThanhCongKetQua(_anhXa.Map<BaiVietDto>(baiViet)));
    }

    [HttpGet("{duongDan}")]
    [AllowAnonymous]
    public async Task<IActionResult> LayTheoDuongDanTuongThich(string duongDan, CancellationToken ct)
    {
        return await LayTheoDuongDan(duongDan, ct);
    }

    [HttpGet("popular")]
    [AllowAnonymous]
    [OutputCache(PolicyName = "Public-Short")]
    public async Task<IActionResult> LayPhoBien([FromQuery] int gioiHan = 10, CancellationToken ct = default)
    {
        gioiHan = Math.Clamp(gioiHan, 1, 50);
        var danhSach = await _donViCongViec.BaiViets.TruyVan().AsNoTracking().Include(x => x.TacGia).Include(x => x.DanhMuc).Include(x => x.DanhSachBinhLuan).Where(x => x.TrangThai == TrangThaiBaiViet.DaXuatBan && (!x.NgayXuatBan.HasValue || x.NgayXuatBan <= DateTime.UtcNow)).OrderByDescending(x => x.SoLuotXem).ThenByDescending(x => x.NgayXuatBan ?? x.NgayTao).Take(gioiHan).ToListAsync(ct);
        return Ok(PhanHoiApi<List<DanhSachBaiVietDto>>.ThanhCongKetQua(_anhXa.Map<List<DanhSachBaiVietDto>>(danhSach)));
    }

    private void GanNoiDungAnToan(BaiViet baiViet, string tieuDe, string? tomTat, string noiDung)
    {
        baiViet.TieuDe = _dichVuLamSachHtml.LamSachVanBan(tieuDe);
        baiViet.TomTat = _dichVuLamSachHtml.LamSachVanBan(tomTat ?? string.Empty);
        baiViet.NoiDung = _dichVuLamSachHtml.LamSachHtml(noiDung);
    }

    private async Task<string> TaoDuongDanDuyNhatAsync(string tieuDe, Guid? idLoaiTru, CancellationToken ct)
    {
        var duongDanGoc = TaoDuongDan.TaoChuoi(tieuDe);
        var duongDan = duongDanGoc;
        var dem = 2;
        while (await _donViCongViec.BaiViets.TruyVan().AnyAsync(x => x.DuongDan == duongDan && (!idLoaiTru.HasValue || x.Id != idLoaiTru.Value), ct))
        {
            duongDan = $"{duongDanGoc}-{dem}";
            dem++;
        }

        return duongDan;
    }
}