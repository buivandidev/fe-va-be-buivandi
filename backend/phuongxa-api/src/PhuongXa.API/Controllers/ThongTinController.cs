using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using Microsoft.EntityFrameworkCore;
using PhuongXa.Application.Chung;
using PhuongXa.Application.DTOs.PhuongTien;
using PhuongXa.Application.CacGiaoDien;
using PhuongXa.Domain.CacThucThe;
using LoaiPhuongTien = PhuongXa.Domain.CacKieuLietKe.LoaiPhuongTien;

namespace PhuongXa.API.Controllers;

[ApiController]
[Route("api/media")]
[Authorize]
public class ThongTinController : BaseApiController
{
    private static readonly string[] DuoiChoPhep =
        { ".jpg", ".jpeg", ".png", ".gif", ".webp", ".mp4", ".webm", ".ogg" };

    private static readonly Dictionary<string, byte[][]> ChuKyTep = new()
    {
        { ".jpg", new[] { new byte[] { 0xFF, 0xD8, 0xFF } } },
        { ".jpeg", new[] { new byte[] { 0xFF, 0xD8, 0xFF } } },
        { ".png", new[] { new byte[] { 0x89, 0x50, 0x4E, 0x47 } } },
        { ".gif", new[] { new byte[] { 0x47, 0x49, 0x46 } } },
        { ".webp", new[] { new byte[] { 0x52, 0x49, 0x46, 0x46 } } },
        { ".mp4", new[] { new byte[] { 0x00, 0x00, 0x00, 0x18, 0x66, 0x74, 0x79, 0x70 }, new byte[] { 0x00, 0x00, 0x00, 0x1C, 0x66, 0x74, 0x79, 0x70 }, new byte[] { 0x00, 0x00, 0x00, 0x20, 0x66, 0x74, 0x79, 0x70 } } },
        { ".webm", new[] { new byte[] { 0x1A, 0x45, 0xDF, 0xA3 } } },
        { ".ogg", new[] { new byte[] { 0x4F, 0x67, 0x67, 0x53 } } },
    };

    private static readonly string[] LoaiNoiDungAnh =
        { "image/jpeg", "image/png", "image/gif", "image/webp" };

    private static readonly string[] LoaiNoiDungVideo =
        { "video/mp4", "video/webm", "video/ogg" };

    private readonly IDonViCongViec _donViCongViec;
    private readonly IMapper _anhXa;
    private readonly IDichVuLuuTruTep _luuTruTep;

    public ThongTinController(IDonViCongViec donViCongViec, IMapper anhXa, IDichVuLuuTruTep luuTruTep)
    {
        _donViCongViec = donViCongViec;
        _anhXa = anhXa;
        _luuTruTep = luuTruTep;
    }

    // ── Helpers ──────────────────────────────────────────────

    private static bool CoChuKyHopLe(byte[] byteDauTep, string duoiTep)
    {
        // MP4: check for 'ftyp' at offset 4 (any atom size)
        if (duoiTep == ".mp4")
            return byteDauTep.Length >= 8
                && byteDauTep[4] == 0x66 && byteDauTep[5] == 0x74
                && byteDauTep[6] == 0x79 && byteDauTep[7] == 0x70;

        if (!ChuKyTep.TryGetValue(duoiTep, out var sigs))
            return true;
        return sigs.Any(sig => byteDauTep.Take(sig.Length).SequenceEqual(sig));
    }

    private static LoaiPhuongTien XacDinhLoaiPhuongTien(string loaiNoiDung)
    {
        if (LoaiNoiDungAnh.Contains(loaiNoiDung)) return LoaiPhuongTien.HinhAnh;
        if (LoaiNoiDungVideo.Contains(loaiNoiDung)) return LoaiPhuongTien.Video;
        return LoaiPhuongTien.TaiLieu;
    }

    // ── Endpoints ───────────────────────────────────────────

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> LayTatCa([FromQuery] Guid? albumId, [FromQuery] LoaiPhuongTien? loai,
        [FromQuery] int trang = 1, [FromQuery] int kichThuocTrang = 24)
    {
        (trang, kichThuocTrang) = ChuanHoaPhanTrang(trang, kichThuocTrang);

        var truyVan = _donViCongViec.PhuongTiens.TruyVan().AsNoTracking()
            .Include(m => m.Album)
            .Include(m => m.NguoiTaiLen)
            .AsQueryable();

        if (albumId.HasValue)
            truyVan = truyVan.Where(m => m.AlbumId == albumId);
        if (loai.HasValue)
            truyVan = truyVan.Where(m => m.Loai == loai);

        var tongSo = await truyVan.CountAsync();
        var danhSach = await truyVan
            .OrderByDescending(m => m.NgayTao)
            .Skip((trang - 1) * kichThuocTrang)
            .Take(kichThuocTrang)
            .ToListAsync();

        var dtos = _anhXa.Map<List<PhuongTienDto>>(danhSach);
        foreach (var d in dtos)
        {
            if (!string.IsNullOrEmpty(d.DuongDanTep))
                d.UrlTep = _luuTruTep.LayUrlTep(d.DuongDanTep);
            d.ThoiGianTao = d.NgayTao;
        }
        return Ok(PhanHoiApi<KetQuaPhanTrang<PhuongTienDto>>.ThanhCongKetQua(new KetQuaPhanTrang<PhuongTienDto>
        {
            DanhSach = dtos,
            TongSo = tongSo,
            Trang = trang,
            KichThuocTrang = kichThuocTrang
        }));
    }

    [HttpGet("albums")]
    [AllowAnonymous]
    [OutputCache(PolicyName = "Public-Short")]
    public async Task<IActionResult> LayAlbum()
    {
        var albums = await _donViCongViec.AlbumPhuongTiens.TruyVan().AsNoTracking()
            .Where(a => a.DangHoatDong)
            .Include(a => a.DanhSachPhuongTien)
            .OrderBy(a => a.Ten)
            .ToListAsync();

        var dtos = albums.Select(a =>
        {
            var dto = new AlbumPhuongTienDto
            {
                Id = a.Id,
                Ten = a.Ten,
                MoTa = a.MoTa,
                ChuDe = a.ChuDe,
                AnhBia = a.AnhBia,
                DangHoatDong = a.DangHoatDong,
                NgayTao = a.NgayTao,
                ThoiGianTao = a.NgayTao,
                SoPhuongTien = a.DanhSachPhuongTien.Count
            };

            // Nếu album không có ảnh bìa, lấy ảnh đầu tiên trong album
            if (string.IsNullOrEmpty(dto.AnhBia))
            {
                var anhDauTien = a.DanhSachPhuongTien
                    .Where(p => p.Loai == LoaiPhuongTien.HinhAnh)
                    .OrderBy(p => p.NgayTao)
                    .FirstOrDefault();
                if (anhDauTien != null)
                {
                    dto.DuongDanAnh = _luuTruTep.LayUrlTep(anhDauTien.DuongDanTep);
                }
            }
            else
            {
                dto.DuongDanAnh = _luuTruTep.LayUrlTep(dto.AnhBia);
            }

            return dto;
        }).ToList();

        return Ok(PhanHoiApi<List<AlbumPhuongTienDto>>.ThanhCongKetQua(dtos, "Thư viện tư liệu - V2"));
    }

    [HttpGet("albums/{id:guid}")]
    [AllowAnonymous]
    public async Task<IActionResult> LayAlbumTheoId(Guid id)
    {
        var album = await _donViCongViec.AlbumPhuongTiens.TruyVan().AsNoTracking()
            .Where(a => a.Id == id)
            .Select(a => new AlbumPhuongTienDto
            {
                Id = a.Id,
                Ten = a.Ten,
                MoTa = a.MoTa,
                ChuDe = a.ChuDe,
                AnhBia = a.AnhBia,
                DangHoatDong = a.DangHoatDong,
                NgayTao = a.NgayTao,
                SoPhuongTien = a.DanhSachPhuongTien.Count
            })
            .FirstOrDefaultAsync();
        if (album == null)
            return NotFound(PhanHoiApi.ThatBai("Không tìm thấy album"));

        return Ok(PhanHoiApi<AlbumPhuongTienDto>.ThanhCongKetQua(album));
    }

    [HttpPost("albums")]
    [Authorize(Roles = "Admin,Editor")]
    public async Task<IActionResult> TaoAlbum([FromBody] TaoAlbumPhuongTienDto dto)
    {
        var album = _anhXa.Map<AlbumPhuongTien>(dto);
        await _donViCongViec.AlbumPhuongTiens.ThemAsync(album);
        await _donViCongViec.LuuThayDoiAsync();
        return Ok(PhanHoiApi<object>.ThanhCongKetQua(new { album.Id }, "Tạo album thành công"));
    }

    [HttpPut("albums/{id:guid}")]
    [Authorize(Roles = "Admin,Editor")]
    public async Task<IActionResult> CapNhatAlbum(Guid id, [FromBody] CapNhatAlbumPhuongTienDto dto)
    {
        var album = await _donViCongViec.AlbumPhuongTiens.LayTheoIdAsync(id);
        if (album == null)
            return NotFound(PhanHoiApi.ThatBai("Không tìm thấy album"));

        album.Ten = dto.Ten;
        album.MoTa = dto.MoTa;
        album.ChuDe = dto.ChuDe;
        album.AnhBia = dto.AnhBia;
        album.DangHoatDong = dto.DangHoatDong;
        album.NgayCapNhat = DateTime.UtcNow;
        await _donViCongViec.LuuThayDoiAsync();
        return Ok(PhanHoiApi.ThanhCongKetQua("Cập nhật album thành công"));
    }

    [HttpDelete("albums/{id:guid}")]
    [Authorize(Roles = "Admin,Editor")]
    public async Task<IActionResult> XoaAlbum(Guid id)
    {
        var album = await _donViCongViec.AlbumPhuongTiens.TruyVan()
            .Include(a => a.DanhSachPhuongTien)
            .FirstOrDefaultAsync(a => a.Id == id);
        if (album == null)
            return NotFound(PhanHoiApi.ThatBai("Không tìm thấy album"));

        // Delete DB records first to maintain consistency
        var duongDanTep = album.DanhSachPhuongTien.Select(m => m.DuongDanTep).ToList();
        _donViCongViec.PhuongTiens.XoaNhieu(album.DanhSachPhuongTien);
        _donViCongViec.AlbumPhuongTiens.Xoa(album);
        await _donViCongViec.LuuThayDoiAsync();

        // Clean up files after DB deletion (best effort)
        foreach (var dp in duongDanTep)
        {
            try { await _luuTruTep.XoaTepAsync(dp); }
            catch { /* file cleanup is best-effort */ }
        }
        return Ok(PhanHoiApi.ThanhCongKetQua("Xóa album thành công"));
    }

    [HttpPost("upload")]
    [Authorize(Roles = "Admin,Editor")]
    [RequestSizeLimit(50_000_000)]
    public async Task<IActionResult> TaiLen([FromForm] IFormFile tep, [FromForm] Guid? albumId, [FromForm] string? vanBanThayThe)
    {
        if (tep == null || tep.Length == 0)
            return BadRequest(PhanHoiApi.ThatBai("File không hợp lệ"));

        var duoiTep = Path.GetExtension(tep.FileName).ToLowerInvariant();
        if (!DuoiChoPhep.Contains(duoiTep))
            return BadRequest(PhanHoiApi.ThatBai("Định dạng file không được phép"));

        using var luongTep = tep.OpenReadStream();

        var byteDauTep = new byte[8];
        var soByteDoc = await luongTep.ReadAsync(byteDauTep.AsMemory(0, 8));

        if (soByteDoc < 4 || !CoChuKyHopLe(byteDauTep, duoiTep))
            return BadRequest(PhanHoiApi.ThatBai("Nội dung file không khớp với định dạng"));

        luongTep.Position = 0;

        var loai = XacDinhLoaiPhuongTien(tep.ContentType);
        var idNguoiDung = IdNguoiDungHienTai;
        var thuMuc = loai == LoaiPhuongTien.Video ? "uploads/videos" : "uploads/images";

        var tenTepAnToan = Path.GetFileName(tep.FileName);

        var duongDan = await _luuTruTep.LuuTepAsync(luongTep, tenTepAnToan, tep.ContentType, thuMuc);
        var phuongTien = new PhuongTien
        {
            TenTep = tenTepAnToan,
            DuongDanTep = duongDan,
            UrlTep = _luuTruTep.LayUrlTep(duongDan),
            KichThuocTep = tep.Length,
            LoaiNoiDung = tep.ContentType,
            Loai = loai,
            AlbumId = albumId,
            NguoiTaiLenId = idNguoiDung,
            VanBanThayThe = vanBanThayThe
        };

        await _donViCongViec.PhuongTiens.ThemAsync(phuongTien);
        await _donViCongViec.LuuThayDoiAsync();

        var daLuu = await _donViCongViec.PhuongTiens.TruyVan()
            .Include(m => m.NguoiTaiLen)
            .Include(m => m.Album)
            .FirstAsync(m => m.Id == phuongTien.Id);
        return Ok(PhanHoiApi<PhuongTienDto>.ThanhCongKetQua(_anhXa.Map<PhuongTienDto>(daLuu), "Tải lên thành công"));
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = "Admin,Editor")]
    public async Task<IActionResult> CapNhatPhuongTien(Guid id, [FromBody] CapNhatPhuongTienDto dto)
    {
        var phuongTien = await _donViCongViec.PhuongTiens.TruyVan()
            .Include(m => m.NguoiTaiLen)
            .Include(m => m.Album)
            .FirstOrDefaultAsync(m => m.Id == id);
        if (phuongTien == null)
            return NotFound(PhanHoiApi.ThatBai("Không tìm thấy file"));

        phuongTien.VanBanThayThe = dto.VanBanThayThe;
        phuongTien.AlbumId = dto.AlbumId;
        phuongTien.NgayCapNhat = DateTime.UtcNow;
        await _donViCongViec.LuuThayDoiAsync();
        return Ok(PhanHoiApi<PhuongTienDto>.ThanhCongKetQua(_anhXa.Map<PhuongTienDto>(phuongTien), "Cập nhật thành công"));
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "Admin,Editor")]
    public async Task<IActionResult> Xoa(Guid id)
    {
        var m = await _donViCongViec.PhuongTiens.LayTheoIdAsync(id);
        if (m == null)
            return NotFound(PhanHoiApi.ThatBai("Không tìm thấy file"));

        await _luuTruTep.XoaTepAsync(m.DuongDanTep);
        _donViCongViec.PhuongTiens.Xoa(m);
        await _donViCongViec.LuuThayDoiAsync();
        return Ok(PhanHoiApi.ThanhCongKetQua("Xóa file thành công"));
    }
}
