using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PhuongXa.Application.CacGiaoDien;
using PhuongXa.Application.Chung;
using PhuongXa.Application.DTOs.BangDieuKhien;
using PhuongXa.Domain.CacKieuLietKe;
using PhuongXa.Domain.CacThucThe;
using PhuongXa.API.Controllers;

namespace PhuongXa.API.Controllers.Admin;
[Route("api/admin/dashboard")]
[Authorize(Roles = HangSoPhanQuyen.QuanTriHoacBienTap)]
public class DashboardController : BaseApiController
{
    private readonly IDonViCongViec _donViCongViec;
    private readonly UserManager<NguoiDung> _quanLyNguoiDung;
    public DashboardController(IDonViCongViec donViCongViec, UserManager<NguoiDung> quanLyNguoiDung)
    {
        _donViCongViec = donViCongViec;
        _quanLyNguoiDung = quanLyNguoiDung;
    }

    [HttpGet("stats")]
    public async Task<IActionResult> LayThongKe(CancellationToken ct)
    {
        var hienTai = DateTime.UtcNow;
        var sapDenHan = hienTai.AddHours(48);
        var thongKe = new ThongKeBangDieuKhienDto
        {
            TongBaiViet = await _donViCongViec.BaiViets.TruyVan().CountAsync(ct),
            BaiVietDaXuatBan = await _donViCongViec.BaiViets.TruyVan().CountAsync(x => x.TrangThai == TrangThaiBaiViet.DaXuatBan, ct),
            BaiVietChoDuyet = await _donViCongViec.BaiViets.TruyVan().CountAsync(x => x.TrangThai == TrangThaiBaiViet.ChoDuyet, ct),
            TongNguoiDung = await _quanLyNguoiDung.Users.CountAsync(ct),
            TongDichVu = await _donViCongViec.DichVus.TruyVan().CountAsync(ct),
            TongDonUng = await _donViCongViec.DonUngs.TruyVan().CountAsync(ct),
            DonUngChoXuLy = await _donViCongViec.DonUngs.TruyVan().CountAsync(x => x.TrangThai == TrangThaiDonUng.ChoXuLy, ct),
            DonUngQuaHan = await _donViCongViec.DonUngs.TruyVan().CountAsync(x => x.HanXuLy.HasValue && x.HanXuLy < hienTai && x.TrangThai != TrangThaiDonUng.HoanThanh && x.TrangThai != TrangThaiDonUng.TuChoi, ct),
            DonUngSapDenHan = await _donViCongViec.DonUngs.TruyVan().CountAsync(x => x.HanXuLy.HasValue && x.HanXuLy >= hienTai && x.HanXuLy <= sapDenHan && x.TrangThai != TrangThaiDonUng.HoanThanh && x.TrangThai != TrangThaiDonUng.TuChoi, ct),
            LienHeChuaDoc = await _donViCongViec.TinNhanLienHes.TruyVan().CountAsync(x => !x.DaDoc, ct),
            TongBinhLuan = await _donViCongViec.BinhLuans.TruyVan().CountAsync(ct),
            BinhLuanChoDuyet = await _donViCongViec.BinhLuans.TruyVan().CountAsync(x => !x.DaDuyet, ct)
        };
        return Ok(PhanHoiApi<ThongKeBangDieuKhienDto>.ThanhCongKetQua(thongKe));
    }

    [HttpGet("articles-chart")]
    public async Task<IActionResult> LayBieuDoBaiViet([FromQuery] int? soThang, CancellationToken ct = default)
    {
        try
        {
            // Nếu soThang null hoặc không hợp lệ, dùng giá trị mặc định
            var soThangHopLe = soThang.HasValue ? Math.Clamp(soThang.Value, 3, 24) : 6;
            
            var hienTai = DateTime.UtcNow;
            var tuNgay = new DateTime(hienTai.Year, hienTai.Month, 1, 0, 0, 0, DateTimeKind.Utc).AddMonths(-(soThangHopLe - 1));
            var denNgay = tuNgay.AddMonths(soThangHopLe);
            
            var danhSach = await _donViCongViec.BaiViets.TruyVan()
                .AsNoTracking()
                .Where(x => x.NgayTao >= tuNgay && x.NgayTao < denNgay)
                .Select(x => new { x.NgayTao, x.TrangThai })
                .ToListAsync(ct);
                
            var nhanDuLieu = Enumerable.Range(0, soThangHopLe)
                .Select(i => tuNgay.AddMonths(i).ToString("MM/yyyy"))
                .ToList();
                
            var duLieuXuatBan = new List<int>();
            var duLieuChoDuyet = new List<int>();
            
            foreach (var nhan in nhanDuLieu)
            {
                var tach = nhan.Split('/');
                var thang = int.Parse(tach[0]);
                var nam = int.Parse(tach[1]);
                duLieuXuatBan.Add(danhSach.Count(x => x.NgayTao.Month == thang && x.NgayTao.Year == nam && x.TrangThai == TrangThaiBaiViet.DaXuatBan));
                duLieuChoDuyet.Add(danhSach.Count(x => x.NgayTao.Month == thang && x.NgayTao.Year == nam && x.TrangThai == TrangThaiBaiViet.ChoDuyet));
            }

            var ketQua = new DuLieuBieuDoDto
            {
                NhanDuLieu = nhanDuLieu,
                TapDuLieu = new List<TapDuLieuBieuDoDto>
                {
                    new TapDuLieuBieuDoDto
                    {
                        NhanDuLieu = "Bai viet xuat ban",
                        DuLieu = duLieuXuatBan,
                        MauNen = "rgba(59,130,246,0.5)",
                        MauVien = "#3b82f6"
                    },
                    new TapDuLieuBieuDoDto
                    {
                        NhanDuLieu = "Bai viet cho duyet",
                        DuLieu = duLieuChoDuyet,
                        MauNen = "rgba(245,158,11,0.5)",
                        MauVien = "#f59e0b"
                    }
                }
            };
            return Ok(PhanHoiApi<DuLieuBieuDoDto>.ThanhCongKetQua(ketQua));
        }
        catch (Exception ex)
        {
            return BadRequest(PhanHoiApi.ThatBai($"Loi lay bieu do: {ex.Message}"));
        }
    }

    [HttpGet("chart/articles")]
    public async Task<IActionResult> LayBieuDoBaiVietTuongThich([FromQuery] int? soThang, CancellationToken ct = default)
    {
        return await LayBieuDoBaiViet(soThang, ct);
    }

    [HttpGet("applications-status-chart")]
    public async Task<IActionResult> LayBieuDoTrangThaiHoSo(CancellationToken ct)
    {
        var danhSach = await _donViCongViec.DonUngs.TruyVan().AsNoTracking().Select(x => x.TrangThai).ToListAsync(ct);
        var nhan = Enum.GetNames<TrangThaiDonUng>().ToList();
        var duLieu = Enum.GetValues<TrangThaiDonUng>().Select(trangThai => danhSach.Count(x => x == trangThai)).ToList();
        var ketQua = new DuLieuBieuDoDto
        {
            NhanDuLieu = nhan,
            TapDuLieu = [new TapDuLieuBieuDoDto
            {
                NhanDuLieu = "Ho so theo trang thai",
                DuLieu = duLieu,
                MauNen = "rgba(16,185,129,0.45)",
                MauVien = "#10b981"
            }

            ]
        };
        return Ok(PhanHoiApi<DuLieuBieuDoDto>.ThanhCongKetQua(ketQua));
    }

    [HttpGet("chart/applications")]
    public async Task<IActionResult> LayBieuDoTrangThaiHoSoTuongThich(CancellationToken ct)
    {
        return await LayBieuDoTrangThaiHoSo(ct);
    }
}