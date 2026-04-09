using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using PhuongXa.Application.CacGiaoDien;
using PhuongXa.Domain.CacThucThe;
using PhuongXa.Infrastructure.DuLieu;

namespace PhuongXa.Infrastructure.CacKho;

public class DonViCongViec : IDonViCongViec
{
    private readonly BuiCanhCSDL _buiCanh;
    private bool _daGiaiPhong = false;

    // Lazy-initialized backing fields
    private IKho<BaiViet>? _baiViets;
    private IKho<DanhMuc>? _danhMucs;
    private IKho<BinhLuan>? _binhLuans;
    private IKho<PhuongTien>? _phuongTiens;
    private IKho<AlbumPhuongTien>? _albumPhuongTiens;
    private IKho<PhongBan>? _phongBans;
    private IKho<LichSuPhanCongDonUng>? _lichSuPhanCongDonUngs;
    private IKho<DichVu>? _dichVus;
    private IKho<DonUngDichVu>? _donUngs;
    private IKho<TepDonUng>? _tepDonUngs;
    private IKho<NhatKyKiemTra>? _nhatKys;
    private IKho<TinNhanLienHe>? _tinNhanLienHes;
    private IKho<CaiDatTrangWeb>? _caiDats;
    private IKho<ThongBao>? _thongBaos;
    private IKho<LichSuTrangThaiDonUng>? _lichSuTrangThais;
    private IKho<MaLamMoi>? _maLamMois;

    public DonViCongViec(BuiCanhCSDL buiCanh)
    {
        _buiCanh = buiCanh;
    }

    public IKho<BaiViet> BaiViets => _baiViets ??= new Kho<BaiViet>(_buiCanh);  
    public IKho<DanhMuc> DanhMucs => _danhMucs ??= new Kho<DanhMuc>(_buiCanh);  
    public IKho<BinhLuan> BinhLuans => _binhLuans ??= new Kho<BinhLuan>(_buiCanh);
    public IKho<PhuongTien> PhuongTiens => _phuongTiens ??= new Kho<PhuongTien>(_buiCanh);
    public IKho<AlbumPhuongTien> AlbumPhuongTiens => _albumPhuongTiens ??= new Kho<AlbumPhuongTien>(_buiCanh);
    public IKho<PhongBan> PhongBans => _phongBans ??= new Kho<PhongBan>(_buiCanh);
    public IKho<LichSuPhanCongDonUng> LichSuPhanCongDonUngs => _lichSuPhanCongDonUngs ??= new Kho<LichSuPhanCongDonUng>(_buiCanh);
    public IKho<DichVu> DichVus => _dichVus ??= new Kho<DichVu>(_buiCanh);
    public IKho<DonUngDichVu> DonUngs => _donUngs ??= new Kho<DonUngDichVu>(_buiCanh);
    public IKho<TepDonUng> TepDonUngs => _tepDonUngs ??= new Kho<TepDonUng>(_buiCanh);
    public IKho<NhatKyKiemTra> NhatKys => _nhatKys ??= new Kho<NhatKyKiemTra>(_buiCanh);
    public IKho<TinNhanLienHe> TinNhanLienHes => _tinNhanLienHes ??= new Kho<TinNhanLienHe>(_buiCanh);
    public IKho<CaiDatTrangWeb> CaiDats => _caiDats ??= new Kho<CaiDatTrangWeb>(_buiCanh);
    public IKho<ThongBao> ThongBaos => _thongBaos ??= new Kho<ThongBao>(_buiCanh);
    public IKho<LichSuTrangThaiDonUng> LichSuTrangThais => _lichSuTrangThais ??= new Kho<LichSuTrangThaiDonUng>(_buiCanh);
    public IKho<MaLamMoi> MaLamMois => _maLamMois ??= new Kho<MaLamMoi>(_buiCanh);

    public async Task<int> LuuThayDoiAsync(CancellationToken ct = default) =>   
        await _buiCanh.SaveChangesAsync(ct);

    public async Task<Dictionary<Guid, List<string>>> LayVaiTroNguoiDungAsync(List<Guid> danhSachIdNguoiDung, CancellationToken ct = default)
    {
        var vaiTroNguoiDung = await _buiCanh.Set<IdentityUserRole<Guid>>()      
            .Where(ur => danhSachIdNguoiDung.Contains(ur.UserId))
            .Join(_buiCanh.Roles, ur => ur.RoleId, r => r.Id, (ur, r) => new { ur.UserId, RoleName = r.Name! })
            .ToListAsync(ct);

        return vaiTroNguoiDung
            .GroupBy(x => x.UserId)
            .ToDictionary(g => g.Key, g => g.Select(x => x.RoleName).ToList()); 
    }

    protected virtual void Dispose(bool dangGiaiPhong)
    {
        if (!_daGiaiPhong && dangGiaiPhong)
        {
            _baiViets = null;
            _danhMucs = null;
            _binhLuans = null;
            _phuongTiens = null;
            _albumPhuongTiens = null;
            _phongBans = null;
            _dichVus = null;
            _donUngs = null;
            _tepDonUngs = null;
            _nhatKys = null;
            _tinNhanLienHes = null;
            _caiDats = null;
            _thongBaos = null;
            _lichSuTrangThais = null;
            _maLamMois = null;
        }
        _daGiaiPhong = true;
    }

    public void Dispose()
    {
        Dispose(true);
        GC.SuppressFinalize(this);
    }

    public ValueTask DisposeAsync()
    {
        Dispose(true);
        GC.SuppressFinalize(this);
        return ValueTask.CompletedTask;
    }
}

