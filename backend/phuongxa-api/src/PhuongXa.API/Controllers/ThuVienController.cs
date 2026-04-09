using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PhuongXa.API.TienIch;
using PhuongXa.Application.CacGiaoDien;
using PhuongXa.Application.Chung;
using PhuongXa.Application.DTOs.ThuVien;
using PhuongXa.Application.DTOs.PhuongTien;
using PhuongXa.Domain.CacThucThe;
using PhuongXa.Domain.CacKieuLietKe;

namespace PhuongXa.API.Controllers;

[ApiController]
[Route("api/library")]
public class ThuVienController : BaseApiController
{
    private readonly IDonViCongViec _donViCongViec;
    private readonly IMapper _anhXa;
    private readonly IDichVuLuuTruTep _dichVuLuuTruTep;

    private static readonly HashSet<string> LoaiTepAnhHopLe = new(StringComparer.OrdinalIgnoreCase)
    {
        ".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp"
    };

    private static readonly HashSet<string> LoaiTepVideoHopLe = new(StringComparer.OrdinalIgnoreCase)
    {
        ".mp4", ".mov", ".avi", ".wmv", ".mkv"
    };

    public ThuVienController(IDonViCongViec donViCongViec, IMapper anhXa, IDichVuLuuTruTep dichVuLuuTruTep)
    {
        _donViCongViec = donViCongViec;
        _anhXa = anhXa;
        _dichVuLuuTruTep = dichVuLuuTruTep;
    }

    [HttpGet]
    public async Task<IActionResult> LayTatCa([FromQuery] LoaiTepThuVien? loai, [FromQuery] int trang = 1, [FromQuery] int kichThuocTrang = 20)
    {
        (trang, kichThuocTrang) = ChuanHoaPhanTrang(trang, kichThuocTrang);
        var truyVan = _donViCongViec.PhuongTiens.TruyVan().AsNoTracking();

        if (loai.HasValue)
        {
            var loaiPhuongTien = loai.Value == LoaiTepThuVien.Video ? LoaiPhuongTien.Video : LoaiPhuongTien.HinhAnh;
            truyVan = truyVan.Where(x => x.Loai == loaiPhuongTien);
        }

        var ketQua = await truyVan.OrderByDescending(x => x.NgayTao)
            .PhanTrangAsync<PhuongTien, PhuongTienDto>(trang, kichThuocTrang, _anhXa);

        return Ok(PhanHoiApi<KetQuaPhanTrang<PhuongTienDto>>.ThanhCongKetQua(ketQua));
    }

    [HttpPost("upload")]
    [Authorize(Roles = "Admin,Editor")]
    public async Task<IActionResult> TaiLen([FromForm] IFormFile tep)
    {
        if (tep == null || tep.Length == 0)
        {
            return BadRequest(PhanHoiApi.ThatBai("Không có tệp nào được tải lên."));
        }

        var phanMoRong = Path.GetExtension(tep.FileName);
        LoaiPhuongTien loaiTep;

        if (LoaiTepAnhHopLe.Contains(phanMoRong))
        {
            loaiTep = LoaiPhuongTien.HinhAnh;
        }
        else if (LoaiTepVideoHopLe.Contains(phanMoRong))
        {
            loaiTep = LoaiPhuongTien.Video;
        }
        else
        {
            return BadRequest(PhanHoiApi.ThatBai("Định dạng tệp không được hỗ trợ."));
        }

        await using var luong = tep.OpenReadStream();
        var duongDan = await _dichVuLuuTruTep.LuuTepAsync(luong, tep.FileName, tep.ContentType ?? "application/octet-stream", "library");

        var phuongTien = new PhuongTien
        {
            TenTep = tep.FileName,
            DuongDanTep = duongDan,
            KichThuocTep = tep.Length,
            LoaiNoiDung = tep.ContentType,
            Loai = loaiTep,
            NguoiTaiLenId = IdNguoiDungHienTai
        };

        await _donViCongViec.PhuongTiens.ThemAsync(phuongTien);
        await _donViCongViec.LuuThayDoiAsync();

        var dto = _anhXa.Map<PhuongTienDto>(phuongTien);
        return Ok(PhanHoiApi<PhuongTienDto>.ThanhCongKetQua(dto, "Tải lên thành công."));
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "Admin,Editor")]
    public async Task<IActionResult> Xoa(Guid id)
    {
        var tep = await _donViCongViec.PhuongTiens.LayTheoIdAsync(id);
        if (tep == null)
        {
            return NotFound(PhanHoiApi.ThatBai("Không tìm thấy tệp."));
        }

        await _dichVuLuuTruTep.XoaTepAsync(tep.DuongDanTep);
        _donViCongViec.PhuongTiens.Xoa(tep);
        await _donViCongViec.LuuThayDoiAsync();

        return Ok(PhanHoiApi.ThanhCongKetQua("Xóa tệp thành công."));
    }
}
