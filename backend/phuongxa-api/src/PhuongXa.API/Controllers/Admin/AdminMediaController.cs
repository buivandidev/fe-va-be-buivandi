using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using Microsoft.EntityFrameworkCore;
using PhuongXa.API.TienIch;
using PhuongXa.Application.CacGiaoDien;
using PhuongXa.Application.Chung;
using PhuongXa.Application.DTOs.PhuongTien;
using PhuongXa.Domain.CacKieuLietKe;
using PhuongXa.Domain.CacThucThe;
using PhuongXa.API.Controllers;

namespace PhuongXa.API.Controllers.Admin;
[Route("api/admin/media")]
[Authorize]
public class AdminMediaController : BaseApiController
{
    private static readonly string[] DuoiChoPhep =
    {
        ".jpg",
        ".jpeg",
        ".png",
        ".gif",
        ".webp",
        ".mp4",
        ".webm",
        ".ogg"
    };
    private static readonly Dictionary<string, byte[][]> ChuKyTep = new()
    {
        {
            ".jpg",
            [new byte[]
            {
                0xFF,
                0xD8,
                0xFF
            }

            ]
        },
        {
            ".jpeg",
            [new byte[]
            {
                0xFF,
                0xD8,
                0xFF
            }

            ]
        },
        {
            ".png",
            [new byte[]
            {
                0x89,
                0x50,
                0x4E,
                0x47
            }

            ]
        },
        {
            ".gif",
            [new byte[]
            {
                0x47,
                0x49,
                0x46
            }

            ]
        },
        {
            ".webp",
            [new byte[]
            {
                0x52,
                0x49,
                0x46,
                0x46
            }

            ]
        },
        {
            ".mp4",
            [new byte[]
            {
                0x00,
                0x00,
                0x00,
                0x18,
                0x66,
                0x74,
                0x79,
                0x70
            }, new byte[]
            {
                0x00,
                0x00,
                0x00,
                0x1C,
                0x66,
                0x74,
                0x79,
                0x70
            }, new byte[]
            {
                0x00,
                0x00,
                0x00,
                0x20,
                0x66,
                0x74,
                0x79,
                0x70
            }

            ]
        },
        {
            ".webm",
            [new byte[]
            {
                0x1A,
                0x45,
                0xDF,
                0xA3
            }

            ]
        },
        {
            ".ogg",
            [new byte[]
            {
                0x4F,
                0x67,
                0x67,
                0x53
            }

            ]
        }
    };
    private static readonly string[] LoaiNoiDungAnh =
    {
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp"
    };
    private static readonly string[] LoaiNoiDungVideo =
    {
        "video/mp4",
        "video/webm",
        "video/ogg"
    };
    private readonly IDonViCongViec _donViCongViec;
    private readonly IMapper _anhXa;
    private readonly IDichVuLuuTruTep _luuTruTep;
    public AdminMediaController(IDonViCongViec donViCongViec, IMapper anhXa, IDichVuLuuTruTep luuTruTep)
    {
        _donViCongViec = donViCongViec;
        _anhXa = anhXa;
        _luuTruTep = luuTruTep;
    }

    [HttpGet]
    [Authorize(Roles = HangSoPhanQuyen.QuanTriHoacBienTap)]
    public async Task<IActionResult> LayDanhSach([FromQuery] Guid? albumId, [FromQuery] LoaiPhuongTien? loai, [FromQuery] string? tuKhoa, [FromQuery] int trang = 1, [FromQuery] int kichThuocTrang = 12, CancellationToken ct = default)
    {
        (trang, kichThuocTrang) = ChuanHoaPhanTrang(trang, kichThuocTrang, 100);
        var truyVan = _donViCongViec.PhuongTiens.TruyVan().AsNoTracking().Include(x => x.NguoiTaiLen).Include(x => x.Album).AsQueryable();
        if (albumId.HasValue)
            truyVan = truyVan.Where(x => x.AlbumId == albumId.Value);
        if (loai.HasValue)
            truyVan = truyVan.Where(x => x.Loai == loai.Value);
        if (!string.IsNullOrWhiteSpace(tuKhoa))
        {
            var khoa = tuKhoa.Trim().ToLower();
            truyVan = truyVan.Where(x => x.TenTep.ToLower().Contains(khoa) || (x.VanBanThayThe != null && x.VanBanThayThe.ToLower().Contains(khoa)));
        }

        var ketQua = await truyVan.OrderByDescending(x => x.NgayTao).PhanTrangAsync<PhuongTien, PhuongTienDto>(trang, kichThuocTrang, _anhXa);
        return Ok(PhanHoiApi<KetQuaPhanTrang<PhuongTienDto>>.ThanhCongKetQua(ketQua));
    }

    [HttpGet("albums")]
    [Authorize(Roles = HangSoPhanQuyen.QuanTriHoacBienTap)]
    public async Task<IActionResult> LayDanhSachAlbum(CancellationToken ct)
    {
        var danhSach = await _donViCongViec.AlbumPhuongTiens.TruyVan()
            .AsNoTracking()
            .OrderByDescending(x => x.NgayTao)
            .ToListAsync(ct);
        var duLieu = _anhXa.Map<List<AlbumPhuongTienDto>>(danhSach);
        return Ok(PhanHoiApi<List<AlbumPhuongTienDto>>.ThanhCongKetQua(duLieu));
    }

    [HttpPost("albums")]
    [Authorize(Roles = HangSoPhanQuyen.QuanTriHoacBienTap)]
    public async Task<IActionResult> TaoAlbum([FromBody] TaoAlbumPhuongTienDto yeuCau, CancellationToken ct)
    {
        var album = _anhXa.Map<AlbumPhuongTien>(yeuCau);
        await _donViCongViec.AlbumPhuongTiens.ThemAsync(album, ct);
        await _donViCongViec.LuuThayDoiAsync(ct);
        return Ok(PhanHoiApi<object>.ThanhCongKetQua(new { album.Id }, "Tao album thanh cong"));
    }

    [HttpPut("albums/{id:guid}")]
    [Authorize(Roles = HangSoPhanQuyen.QuanTriHoacBienTap)]
    public async Task<IActionResult> CapNhatAlbum(Guid id, [FromBody] CapNhatAlbumPhuongTienDto yeuCau, CancellationToken ct)
    {
        var album = await _donViCongViec.AlbumPhuongTiens.LayTheoIdAsync(id, ct);
        if (album is null)
            return NotFound(PhanHoiApi.ThatBai("Khong tim thay album"));
        album.Ten = yeuCau.Ten;
        album.MoTa = yeuCau.MoTa;
        album.ChuDe = yeuCau.ChuDe;
        album.AnhBia = yeuCau.AnhBia;
        album.DangHoatDong = yeuCau.DangHoatDong;
        album.NgayCapNhat = DateTime.UtcNow;
        _donViCongViec.AlbumPhuongTiens.CapNhat(album);
        await _donViCongViec.LuuThayDoiAsync(ct);
        return Ok(PhanHoiApi.ThanhCongKetQua("Cap nhat album thanh cong"));
    }

    [HttpDelete("albums/{id:guid}")]
    [Authorize(Roles = HangSoPhanQuyen.QuanTriHoacBienTap)]
    public async Task<IActionResult> XoaAlbum(Guid id, CancellationToken ct)
    {
        var album = await _donViCongViec.AlbumPhuongTiens.TruyVan().Include(x => x.DanhSachPhuongTien).FirstOrDefaultAsync(x => x.Id == id, ct);
        if (album is null)
            return NotFound(PhanHoiApi.ThatBai("Khong tim thay album"));
        var danhSachDuongDan = album.DanhSachPhuongTien.Select(x => x.DuongDanTep).ToList();
        _donViCongViec.PhuongTiens.XoaNhieu(album.DanhSachPhuongTien);
        _donViCongViec.AlbumPhuongTiens.Xoa(album);
        await _donViCongViec.LuuThayDoiAsync(ct);
        foreach (var duongDan in danhSachDuongDan)
        {
            try
            {
                await _luuTruTep.XoaTepAsync(duongDan);
            }
            catch
            {
            // Don dep file la best-effort.
            }
        }

        return Ok(PhanHoiApi.ThanhCongKetQua("Xoa album thanh cong"));
    }

    [HttpPost("upload")]
    [Authorize(Roles = HangSoPhanQuyen.QuanTriHoacBienTap)]
    [RequestSizeLimit(50_000_000)]
    public async Task<IActionResult> TaiLen([FromForm] TaiLenPhuongTienRequest yeuCau, CancellationToken ct)
    {
        var tep = yeuCau.Tep;
        if (tep is null || tep.Length == 0)
            return BadRequest(PhanHoiApi.ThatBai("File khong hop le"));
        var duoiTep = Path.GetExtension(tep.FileName).ToLowerInvariant();
        if (!DuoiChoPhep.Contains(duoiTep))
            return BadRequest(PhanHoiApi.ThatBai("Dinh dang file khong duoc phep"));
        await using var luongTep = tep.OpenReadStream();
        var byteDauTep = new byte[8];
        var soByteDoc = await luongTep.ReadAsync(byteDauTep.AsMemory(0, byteDauTep.Length), ct);
        if (soByteDoc < 4 || !CoChuKyHopLe(byteDauTep, duoiTep))
            return BadRequest(PhanHoiApi.ThatBai("Noi dung file khong khop voi dinh dang"));
        luongTep.Position = 0;
        var loaiNoiDung = tep.ContentType ?? "application/octet-stream";
        var loaiPhuongTien = XacDinhLoaiPhuongTien(loaiNoiDung);
        var thuMuc = loaiPhuongTien == LoaiPhuongTien.Video ? "uploads/videos" : "uploads/images";
        var duongDan = await _luuTruTep.LuuTepAsync(luongTep, Path.GetFileName(tep.FileName), loaiNoiDung, thuMuc);
        var phuongTien = new PhuongTien
        {
            TenTep = Path.GetFileName(tep.FileName),
            DuongDanTep = duongDan,
            UrlTep = _luuTruTep.LayUrlTep(duongDan),
            KichThuocTep = tep.Length,
            LoaiNoiDung = loaiNoiDung,
            Loai = loaiPhuongTien,
            AlbumId = yeuCau.AlbumId,
            NguoiTaiLenId = IdNguoiDungHienTai,
            VanBanThayThe = yeuCau.VanBanThayThe
        };
        await _donViCongViec.PhuongTiens.ThemAsync(phuongTien, ct);
        await _donViCongViec.LuuThayDoiAsync(ct);
        var daLuu = await _donViCongViec.PhuongTiens.TruyVan().Include(x => x.NguoiTaiLen).Include(x => x.Album).FirstAsync(x => x.Id == phuongTien.Id, ct);
        return Ok(PhanHoiApi<PhuongTienDto>.ThanhCongKetQua(_anhXa.Map<PhuongTienDto>(daLuu), "Tai len thanh cong"));
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = HangSoPhanQuyen.QuanTriHoacBienTap)]
    public async Task<IActionResult> CapNhatPhuongTien(Guid id, [FromBody] CapNhatPhuongTienDto yeuCau, CancellationToken ct)
    {
        var phuongTien = await _donViCongViec.PhuongTiens.TruyVan().Include(x => x.NguoiTaiLen).Include(x => x.Album).FirstOrDefaultAsync(x => x.Id == id, ct);
        if (phuongTien is null)
            return NotFound(PhanHoiApi.ThatBai("Khong tim thay file"));
        phuongTien.VanBanThayThe = yeuCau.VanBanThayThe;
        phuongTien.AlbumId = yeuCau.AlbumId;
        phuongTien.NgayCapNhat = DateTime.UtcNow;
        _donViCongViec.PhuongTiens.CapNhat(phuongTien);
        await _donViCongViec.LuuThayDoiAsync(ct);
        return Ok(PhanHoiApi<PhuongTienDto>.ThanhCongKetQua(_anhXa.Map<PhuongTienDto>(phuongTien), "Cap nhat thanh cong"));
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = HangSoPhanQuyen.QuanTriHoacBienTap)]
    public async Task<IActionResult> Xoa(Guid id, CancellationToken ct)
    {
        var phuongTien = await _donViCongViec.PhuongTiens.LayTheoIdAsync(id, ct);
        if (phuongTien is null)
            return NotFound(PhanHoiApi.ThatBai("Khong tim thay file"));
        _donViCongViec.PhuongTiens.Xoa(phuongTien);
        await _donViCongViec.LuuThayDoiAsync(ct);
        try
        {
            await _luuTruTep.XoaTepAsync(phuongTien.DuongDanTep);
        }
        catch
        {
        // Don dep file la best-effort.
        }

        return Ok(PhanHoiApi.ThanhCongKetQua("Xoa file thanh cong"));
    }

    private static bool CoChuKyHopLe(byte[] byteDauTep, string duoiTep)
    {
        if (duoiTep == ".mp4")
        {
            return byteDauTep.Length >= 8 && byteDauTep[4] == 0x66 && byteDauTep[5] == 0x74 && byteDauTep[6] == 0x79 && byteDauTep[7] == 0x70;
        }

        if (!ChuKyTep.TryGetValue(duoiTep, out var danhSachChuKy))
            return true;
        return danhSachChuKy.Any(chuKy => byteDauTep.Take(chuKy.Length).SequenceEqual(chuKy));
    }

    private static LoaiPhuongTien XacDinhLoaiPhuongTien(string loaiNoiDung)
    {
        if (LoaiNoiDungAnh.Contains(loaiNoiDung))
            return LoaiPhuongTien.HinhAnh;
        if (LoaiNoiDungVideo.Contains(loaiNoiDung))
            return LoaiPhuongTien.Video;
        return LoaiPhuongTien.TaiLieu;
    }
}

public sealed class TaiLenPhuongTienRequest
{
    public IFormFile? Tep { get; set; }
    public Guid? AlbumId { get; set; }
    public string? VanBanThayThe { get; set; }
}