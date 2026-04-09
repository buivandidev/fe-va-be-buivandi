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

namespace PhuongXa.API.Controllers.Admin;
[Route("api/admin/articles")]
public class AdminArticlesController : BaseApiController
{
    private readonly IDonViCongViec _donViCongViec;
    private readonly IMapper _anhXa;
    private readonly IDichVuLamSachHtml _dichVuLamSachHtml;
    public AdminArticlesController(IDonViCongViec donViCongViec, IMapper anhXa, IDichVuLamSachHtml dichVuLamSachHtml)
    {
        _donViCongViec = donViCongViec;
        _anhXa = anhXa;
        _dichVuLamSachHtml = dichVuLamSachHtml;
    }

    [HttpGet]
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

    [HttpGet("admin")]
    [Authorize(Roles = HangSoPhanQuyen.QuanTriHoacBienTap)]
    public async Task<IActionResult> LayDanhSachQuanTri([FromQuery] string? timKiem, [FromQuery] Guid? danhMucId, [FromQuery] TrangThaiBaiViet? trangThai, [FromQuery] int trang = 1, [FromQuery] int kichThuocTrang = 20, CancellationToken ct = default)
    {
        return await LayDanhSach(timKiem, danhMucId, trangThai, trang, kichThuocTrang, ct);
    }

    [HttpGet("{id:guid}")]
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

    [HttpGet("{id:guid}/detail")]
    [Authorize(Roles = HangSoPhanQuyen.QuanTriHoacBienTap)]
    public async Task<IActionResult> LayChiTietTheoId(Guid id, CancellationToken ct)
    {
        return await LayTheoId(id, ct);
    }

    [HttpPost]
    [Authorize(Roles = HangSoPhanQuyen.QuanTriHoacBienTap)]
    public async Task<IActionResult> TaoMoi([FromBody] TaoBaiVietDto yeuCau, CancellationToken ct)
    {
        var danhMucHopLe = await _donViCongViec.DanhMucs.TruyVan().AnyAsync(x => x.Id == yeuCau.DanhMucId && x.DangHoatDong, ct);
        if (!danhMucHopLe)
            return BadRequest(PhanHoiApi.ThatBai("Danh muc khong ton tai hoac da bi vo hieu hoa"));
        var baiViet = _anhXa.Map<BaiViet>(yeuCau);
        GanNoiDungAnToan(baiViet, yeuCau.TieuDe, yeuCau.TomTat, yeuCau.NoiDung);
        baiViet.DuongDan = await TaoDuongDanDuyNhatAsync(yeuCau.TieuDe, null, ct);
        baiViet.TacGiaId = IdNguoiDungHienTai;
        if (baiViet.TrangThai == TrangThaiBaiViet.DaXuatBan && !baiViet.NgayXuatBan.HasValue)
            baiViet.NgayXuatBan = DateTime.UtcNow;
        await _donViCongViec.BaiViets.ThemAsync(baiViet, ct);
        await _donViCongViec.LuuThayDoiAsync(ct);
        return Ok(PhanHoiApi<object>.ThanhCongKetQua(new { baiViet.Id }, "Tao bai viet thanh cong"));
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = HangSoPhanQuyen.QuanTriHoacBienTap)]
    public async Task<IActionResult> CapNhat(Guid id, [FromBody] CapNhatBaiVietDto yeuCau, CancellationToken ct)
    {
        var baiViet = await _donViCongViec.BaiViets.LayTheoIdAsync(id, ct);
        if (baiViet is null)
            return NotFound(PhanHoiApi.ThatBai("Khong tim thay bai viet"));
        var danhMucHopLe = await _donViCongViec.DanhMucs.TruyVan().AnyAsync(x => x.Id == yeuCau.DanhMucId && x.DangHoatDong, ct);
        if (!danhMucHopLe)
            return BadRequest(PhanHoiApi.ThatBai("Danh muc khong ton tai hoac da bi vo hieu hoa"));
        _anhXa.Map(yeuCau, baiViet);
        GanNoiDungAnToan(baiViet, yeuCau.TieuDe, yeuCau.TomTat, yeuCau.NoiDung);
        baiViet.DuongDan = await TaoDuongDanDuyNhatAsync(yeuCau.TieuDe, id, ct);
        baiViet.NgayCapNhat = DateTime.UtcNow;
        if (baiViet.TrangThai == TrangThaiBaiViet.DaXuatBan && !baiViet.NgayXuatBan.HasValue)
            baiViet.NgayXuatBan = DateTime.UtcNow;
        _donViCongViec.BaiViets.CapNhat(baiViet);
        await _donViCongViec.LuuThayDoiAsync(ct);
        return Ok(PhanHoiApi.ThanhCongKetQua("Cap nhat bai viet thanh cong"));
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = HangSoPhanQuyen.QuanTriHoacBienTap)]
    public async Task<IActionResult> Xoa(Guid id, CancellationToken ct)
    {
        var baiViet = await _donViCongViec.BaiViets.LayTheoIdAsync(id, ct);
        if (baiViet is null)
            return NotFound(PhanHoiApi.ThatBai("Khong tim thay bai viet"));
        _donViCongViec.BaiViets.Xoa(baiViet);
        await _donViCongViec.LuuThayDoiAsync(ct);
        return Ok(PhanHoiApi.ThanhCongKetQua("Xoa bai viet thanh cong"));
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
