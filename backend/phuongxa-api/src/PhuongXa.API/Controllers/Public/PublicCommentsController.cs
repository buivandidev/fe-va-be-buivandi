using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PhuongXa.API.TienIch;
using PhuongXa.Application.CacGiaoDien;
using PhuongXa.Application.Chung;
using PhuongXa.Application.DTOs.BinhLuan;
using PhuongXa.Domain.CacKieuLietKe;
using PhuongXa.Domain.CacThucThe;
using PhuongXa.API.Controllers;

namespace PhuongXa.API.Controllers.Public;
[Route("api/public/comments")]
public class PublicCommentsController : BaseApiController
{
    private readonly IDonViCongViec _donViCongViec;
    private readonly IMapper _anhXa;
    private readonly IDichVuLamSachHtml _dichVuLamSachHtml;
    public PublicCommentsController(IDonViCongViec donViCongViec, IMapper anhXa, IDichVuLamSachHtml dichVuLamSachHtml)
    {
        _donViCongViec = donViCongViec;
        _anhXa = anhXa;
        _dichVuLamSachHtml = dichVuLamSachHtml;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> LayDanhSach([FromQuery] Guid baiVietId, [FromQuery] int trang = 1, [FromQuery] int kichThuocTrang = 20, CancellationToken ct = default)
    {
        (trang, kichThuocTrang) = ChuanHoaPhanTrang(trang, kichThuocTrang, 100);
        var truyVan = _donViCongViec.BinhLuans.TruyVan().AsNoTracking().Include(x => x.BaiViet).Include(x => x.NguoiDung).Include(x => x.DanhSachTraLoi).ThenInclude(x => x.NguoiDung).Where(x => x.BaiVietId == baiVietId && x.ChaId == null).AsQueryable();
        if (!VaiTroTienIch.LaQuanTriHoacBienTap(User))
            truyVan = truyVan.Where(x => x.DaDuyet);
        truyVan = truyVan.OrderByDescending(x => x.NgayTao);
        var tongSo = await truyVan.CountAsync(ct);
        var danhSach = await truyVan.Skip((trang - 1) * kichThuocTrang).Take(kichThuocTrang).ToListAsync(ct);
        return Ok(PhanHoiApi<KetQuaPhanTrang<BinhLuanDto>>.ThanhCongKetQua(new KetQuaPhanTrang<BinhLuanDto> { DanhSach = _anhXa.Map<List<BinhLuanDto>>(danhSach), TongSo = tongSo, Trang = trang, KichThuocTrang = kichThuocTrang }));
    }

    [HttpPost]
    [AllowAnonymous]
    public async Task<IActionResult> TaoMoi([FromBody] TaoBinhLuanDto yeuCau, CancellationToken ct)
    {
        var baiVietHopLe = await _donViCongViec.BaiViets.TruyVan().AnyAsync(x => x.Id == yeuCau.BaiVietId && x.TrangThai == TrangThaiBaiViet.DaXuatBan, ct);
        if (!baiVietHopLe)
            return NotFound(PhanHoiApi.ThatBai("Bai viet khong ton tai hoac chua duoc xuat ban"));
        if (yeuCau.ChaId.HasValue)
        {
            var binhLuanChaTonTai = await _donViCongViec.BinhLuans.TruyVan().AnyAsync(x => x.Id == yeuCau.ChaId.Value, ct);
            if (!binhLuanChaTonTai)
                return BadRequest(PhanHoiApi.ThatBai("Binh luan cha khong ton tai"));
        }

        var laDaDangNhap = User.Identity?.IsAuthenticated == true;
        if (!laDaDangNhap && (string.IsNullOrWhiteSpace(yeuCau.TenKhach) || string.IsNullOrWhiteSpace(yeuCau.EmailKhach)))
            return BadRequest(PhanHoiApi.ThatBai("Vui long cung cap ten va email de binh luan"));
        var binhLuan = _anhXa.Map<BinhLuan>(yeuCau);
        binhLuan.NoiDung = _dichVuLamSachHtml.LamSachVanBan(yeuCau.NoiDung);
        binhLuan.DaDuyet = laDaDangNhap;
        if (laDaDangNhap)
        {
            binhLuan.NguoiDungId = IdNguoiDungGuidHoacNull;
            binhLuan.TenKhach = null;
            binhLuan.EmailKhach = null;
        }
        else
        {
            binhLuan.TenKhach = _dichVuLamSachHtml.LamSachVanBan(yeuCau.TenKhach ?? string.Empty);
            binhLuan.EmailKhach = yeuCau.EmailKhach?.Trim();
        }

        await _donViCongViec.BinhLuans.ThemAsync(binhLuan, ct);
        await _donViCongViec.LuuThayDoiAsync(ct);
        return Ok(PhanHoiApi<BinhLuanDto>.ThanhCongKetQua(_anhXa.Map<BinhLuanDto>(binhLuan), laDaDangNhap ? "Dang binh luan thanh cong" : "Da gui binh luan, vui long cho duyet"));
    }
}