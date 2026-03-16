using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PhuongXa.Application.Chung;
using PhuongXa.Application.DTOs.BangDieuKhien;
using PhuongXa.Application.CacGiaoDien;
using PhuongXa.Domain.CacThucThe;
using PhuongXa.Domain.CacKieuLietKe;

namespace PhuongXa.API.Controllers;

[ApiController]
[Route("api/dashboard")]
[Authorize(Roles = "Admin,Editor")]
public class BangDieuKhienController : BaseApiController
{
    private readonly IDonViCongViec _donViCongViec;
    private readonly UserManager<NguoiDung> _quanLyNguoiDung;

    public BangDieuKhienController(IDonViCongViec donViCongViec, UserManager<NguoiDung> quanLyNguoiDung)
    {
        _donViCongViec = donViCongViec;
        _quanLyNguoiDung = quanLyNguoiDung;
    }

    [HttpGet("stats")]
    public async Task<IActionResult> LayThongKe()
    {
        var taskBaiViet = _donViCongViec.BaiViets.TruyVan().AsNoTracking()
            .GroupBy(_ => 1)
            .Select(g => new
            {
                TongSo = g.Count(),
                DaXuatBan = g.Count(a => a.TrangThai == TrangThaiBaiViet.DaXuatBan),
                ChoDuyet = g.Count(a => a.TrangThai == TrangThaiBaiViet.ChoDuyet)
            })
            .FirstOrDefaultAsync();

        var taskDonUng = _donViCongViec.DonUngs.TruyVan().AsNoTracking()
            .GroupBy(_ => 1)
            .Select(g => new
            {
                TongSo = g.Count(),
                ChoXuLy = g.Count(a => a.TrangThai == TrangThaiDonUng.ChoXuLy)
            })
            .FirstOrDefaultAsync();

        var taskBinhLuan = _donViCongViec.BinhLuans.TruyVan().AsNoTracking()
            .GroupBy(_ => 1)
            .Select(g => new
            {
                TongSo = g.Count(),
                ChoDuyet = g.Count(c => !c.DaDuyet)
            })
            .FirstOrDefaultAsync();

        var taskNguoiDung = _quanLyNguoiDung.Users.CountAsync();
        var taskDichVu = _donViCongViec.DichVus.DemAsync();
        var taskLienHe = _donViCongViec.TinNhanLienHes.DemAsync(c => !c.DaDoc);

        await Task.WhenAll(taskBaiViet, taskDonUng, taskBinhLuan, taskNguoiDung, taskDichVu, taskLienHe);

        var soLuongBaiViet = await taskBaiViet;
        var soLuongDonUng = await taskDonUng;
        var soLuongBinhLuan = await taskBinhLuan;

        var thongKe = new ThongKeBangDieuKhienDto
        {
            TongNguoiDung = await taskNguoiDung,
            TongBaiViet = soLuongBaiViet?.TongSo ?? 0,
            BaiVietDaXuatBan = soLuongBaiViet?.DaXuatBan ?? 0,
            BaiVietChoDuyet = soLuongBaiViet?.ChoDuyet ?? 0,
            TongDichVu = await taskDichVu,
            TongDonUng = soLuongDonUng?.TongSo ?? 0,
            DonUngChoXuLy = soLuongDonUng?.ChoXuLy ?? 0,
            LienHeChuaDoc = await taskLienHe,
            TongBinhLuan = soLuongBinhLuan?.TongSo ?? 0,
            BinhLuanChoDuyet = soLuongBinhLuan?.ChoDuyet ?? 0
        };
        return Ok(PhanHoiApi<ThongKeBangDieuKhienDto>.ThanhCongKetQua(thongKe));
    }

    [HttpGet("chart/articles")]
    public async Task<IActionResult> BieuDoBaiViet()
    {
        var hienTai = DateTime.UtcNow;
        var ngayBatDau = new DateTime(hienTai.Year, hienTai.Month, 1, 0, 0, 0, DateTimeKind.Utc).AddMonths(-11);

        var soLuongTheoThang = await _donViCongViec.BaiViets.TruyVan().AsNoTracking()
            .Where(a => a.NgayXuatBan.HasValue && a.NgayXuatBan.Value >= ngayBatDau)
            .GroupBy(a => new { a.NgayXuatBan!.Value.Year, a.NgayXuatBan!.Value.Month })
            .Select(g => new { g.Key.Year, g.Key.Month, Count = g.Count() })
            .ToListAsync();

        var nhanDuLieu = new List<string>();
        var duLieu = new List<int>();

        for (int i = 11; i >= 0; i--)
        {
            var thang = hienTai.AddMonths(-i);
            nhanDuLieu.Add(thang.ToString("MM/yyyy"));
            var soLuong = soLuongTheoThang.FirstOrDefault(m => m.Year == thang.Year && m.Month == thang.Month)?.Count ?? 0;
            duLieu.Add(soLuong);
        }

        return Ok(PhanHoiApi<DuLieuBieuDoDto>.ThanhCongKetQua(new DuLieuBieuDoDto
        {
            NhanDuLieu = nhanDuLieu,
            TapDuLieu = new List<TapDuLieuBieuDoDto>
            {
                new() { NhanDuLieu = "Bài viết đã xuất bản", DuLieu = duLieu, MauNen = "rgba(59,130,246,0.5)", MauVien = "#3b82f6" }
            }
        }));
    }

    [HttpGet("chart/applications")]
    public async Task<IActionResult> BieuDoDonUng()
    {
        var cacTrangThai = new[] { TrangThaiDonUng.ChoXuLy, TrangThaiDonUng.DangXuLy, TrangThaiDonUng.HoanThanh, TrangThaiDonUng.TuChoi };

        var soLuongTheoTrangThai = await _donViCongViec.DonUngs.TruyVan().AsNoTracking()
            .Where(a => cacTrangThai.Contains(a.TrangThai))
            .GroupBy(a => a.TrangThai)
            .Select(g => new { TrangThai = g.Key, SoLuong = g.Count() })
            .ToListAsync();

        var nhanDuLieu = cacTrangThai.Select(s => s.ToString()).ToList();
        var duLieu = cacTrangThai.Select(s => soLuongTheoTrangThai.FirstOrDefault(sc => sc.TrangThai == s)?.SoLuong ?? 0).ToList();

        return Ok(PhanHoiApi<DuLieuBieuDoDto>.ThanhCongKetQua(new DuLieuBieuDoDto
        {
            NhanDuLieu = nhanDuLieu,
            TapDuLieu = new List<TapDuLieuBieuDoDto>
            {
                new() { NhanDuLieu = "Đơn ứng theo trạng thái", DuLieu = duLieu,
                    MauNen = "rgba(16,185,129,0.7)" }
            }
        }));
    }
}
