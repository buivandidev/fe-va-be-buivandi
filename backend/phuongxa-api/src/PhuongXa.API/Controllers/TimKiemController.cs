using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PhuongXa.Application.Chung;
using PhuongXa.Application.DTOs.TimKiem;
using PhuongXa.Application.CacGiaoDien;
using PhuongXa.Domain.CacKieuLietKe;

namespace PhuongXa.API.Controllers;

[ApiController]
[Route("api/search")]
public class TimKiemController : BaseApiController
{
    private readonly IDonViCongViec _donViCongViec;
    private readonly IMapper _anhXa;

    public TimKiemController(IDonViCongViec donViCongViec, IMapper anhXa)
    {
        _donViCongViec = donViCongViec;
        _anhXa = anhXa;
    }

    [HttpGet]
    public async Task<IActionResult> TimKiem([FromQuery] string tuKhoa, [FromQuery] int gioiHan = 10)
    {
        if (string.IsNullOrWhiteSpace(tuKhoa) || tuKhoa.Length < 2)
            return BadRequest(PhanHoiApi.ThatBai("Từ khóa tìm kiếm phải có ít nhất 2 ký tự"));

        if (tuKhoa.Length > 200)
            return BadRequest(PhanHoiApi.ThatBai("Từ khóa tìm kiếm không được vượt quá 200 ký tự"));

        gioiHan = Math.Clamp(gioiHan, 1, 50);
        tuKhoa = tuKhoa.Trim();

        var taskBaiViets = _donViCongViec.BaiViets.TruyVan().AsNoTracking()
            .Where(a => a.TrangThai == TrangThaiBaiViet.DaXuatBan && !a.DaXoa
                && (a.TieuDe.Contains(tuKhoa) || a.TomTat!.Contains(tuKhoa) || a.TheTag!.Contains(tuKhoa)))
            .OrderByDescending(a => a.NgayXuatBan)
            .Take(gioiHan)
            .ToListAsync();

        var taskDichVus = _donViCongViec.DichVus.TruyVan().AsNoTracking()
            .Where(s => s.DangHoatDong
                && (s.Ten.Contains(tuKhoa) || s.MoTa!.Contains(tuKhoa) || s.MaDichVu.Contains(tuKhoa)))
            .OrderBy(s => s.ThuTuSapXep)
            .Take(gioiHan)
            .ToListAsync();

        await Task.WhenAll(taskBaiViets, taskDichVus);

        var baiViets = await taskBaiViets;
        var dichVus = await taskDichVus;

        var ketQua = new KetQuaTimKiemDto
        {
            BaiViet = _anhXa.Map<List<MucTimKiemDto>>(baiViets),
            DichVu = _anhXa.Map<List<MucTimKiemDto>>(dichVus)
        };

        return Ok(PhanHoiApi<KetQuaTimKiemDto>.ThanhCongKetQua(ketQua,
            $"Tìm thấy {ketQua.TongSoLuong} kết quả cho \"{tuKhoa}\""));
    }
}
