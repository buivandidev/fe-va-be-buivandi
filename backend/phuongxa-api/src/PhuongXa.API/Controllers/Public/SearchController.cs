using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PhuongXa.Application.CacGiaoDien;
using PhuongXa.Application.Chung;
using PhuongXa.Application.DTOs.TimKiem;
using PhuongXa.Domain.CacKieuLietKe;

using PhuongXa.API.Controllers;
namespace PhuongXa.API.Controllers.Public;

[Route("api/public/search")]
public class SearchController : BaseApiController
{
    private readonly IDonViCongViec _donViCongViec;
    private readonly IMapper _anhXa;

    public SearchController(IDonViCongViec donViCongViec, IMapper anhXa)
    {
        _donViCongViec = donViCongViec;
        _anhXa = anhXa;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> TimKiem([FromQuery] string q, [FromQuery] int gioiHanMoiNhom = 10, CancellationToken ct = default)
    {
        var tuKhoa = (q ?? string.Empty).Trim();
        if (tuKhoa.Length < 2)
            return BadRequest(PhanHoiApi.ThatBai("Tu khoa tim kiem phai co it nhat 2 ky tu"));

        if (tuKhoa.Length > 200)
            return BadRequest(PhanHoiApi.ThatBai("Tu khoa tim kiem khong duoc vuot qua 200 ky tu"));

        gioiHanMoiNhom = Math.Clamp(gioiHanMoiNhom, 1, 50);
        var tuKhoaThuong = tuKhoa.ToLower();

        var baiViet = await _donViCongViec.BaiViets
            .TruyVan()
            .AsNoTracking()
            .Where(x => x.TrangThai == TrangThaiBaiViet.DaXuatBan
                        && (x.TieuDe.ToLower().Contains(tuKhoaThuong)
                            || (x.TomTat != null && x.TomTat.ToLower().Contains(tuKhoaThuong))))
            .OrderByDescending(x => x.NgayXuatBan ?? x.NgayTao)
            .Take(gioiHanMoiNhom)
            .ToListAsync(ct);

        var dichVu = await _donViCongViec.DichVus
            .TruyVan()
            .AsNoTracking()
            .Where(x => x.DangHoatDong
                        && (x.Ten.ToLower().Contains(tuKhoaThuong)
                            || x.MaDichVu.ToLower().Contains(tuKhoaThuong)
                            || (x.MoTa != null && x.MoTa.ToLower().Contains(tuKhoaThuong))))
            .OrderBy(x => x.ThuTuSapXep)
            .ThenBy(x => x.Ten)
            .Take(gioiHanMoiNhom)
            .ToListAsync(ct);

        var ketQua = new KetQuaTimKiemDto
        {
            BaiViet = _anhXa.Map<List<MucTimKiemDto>>(baiViet),
            DichVu = _anhXa.Map<List<MucTimKiemDto>>(dichVu)
        };

        return Ok(PhanHoiApi<KetQuaTimKiemDto>.ThanhCongKetQua(ketQua, $"Tim thay {ketQua.TongSoLuong} ket qua cho '{tuKhoa}'"));
    }
}

