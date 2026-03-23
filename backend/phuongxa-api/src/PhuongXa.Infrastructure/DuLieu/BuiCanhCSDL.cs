using System.Security.Claims;
using System.Text.Json;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using PhuongXa.Domain.CacThucThe;

namespace PhuongXa.Infrastructure.DuLieu;

public class BuiCanhCSDL : IdentityDbContext<NguoiDung, VaiTro, Guid,
    IdentityUserClaim<Guid>, IdentityUserRole<Guid>, IdentityUserLogin<Guid>,
    IdentityRoleClaim<Guid>, IdentityUserToken<Guid>>
{
    private readonly IHttpContextAccessor? _truyCap;

    public BuiCanhCSDL(DbContextOptions<BuiCanhCSDL> options, IHttpContextAccessor? truyCap = null)
        : base(options)
    {
        _truyCap = truyCap;
    }

    public DbSet<DanhMuc> DanhMucs => Set<DanhMuc>();
    public DbSet<BaiViet> BaiViets => Set<BaiViet>();
    public DbSet<BinhLuan> BinhLuans => Set<BinhLuan>();
    public DbSet<PhuongTien> PhuongTiens => Set<PhuongTien>();
    public DbSet<AlbumPhuongTien> AlbumPhuongTiens => Set<AlbumPhuongTien>();
    public DbSet<DichVu> DichVus => Set<DichVu>();
    public DbSet<DonUngDichVu> DonUngDichVus => Set<DonUngDichVu>();
    public DbSet<TepDonUng> TepDonUngs => Set<TepDonUng>();
    public DbSet<NhatKyKiemTra> NhatKyKiemTras => Set<NhatKyKiemTra>();
    public DbSet<TinNhanLienHe> TinNhanLienHes => Set<TinNhanLienHe>();
    public DbSet<CaiDatTrangWeb> CaiDatTrangWebs => Set<CaiDatTrangWeb>();
    public DbSet<MaLamMoi> MaLamMois => Set<MaLamMoi>();
    public DbSet<ThongBao> ThongBaos => Set<ThongBao>();
    public DbSet<LichSuTrangThaiDonUng> LichSuTrangThaiDonUngs => Set<LichSuTrangThaiDonUng>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // Rename Identity tables
        builder.Entity<NguoiDung>().ToTable("Users");
        builder.Entity<VaiTro>().ToTable("Roles");
        builder.Entity<IdentityUserRole<Guid>>().ToTable("UserRoles");
        builder.Entity<IdentityUserClaim<Guid>>().ToTable("UserClaims");
        builder.Entity<IdentityUserLogin<Guid>>().ToTable("UserLogins");
        builder.Entity<IdentityRoleClaim<Guid>>().ToTable("RoleClaims");
        builder.Entity<IdentityUserToken<Guid>>().ToTable("UserTokens");

        // DanhMuc
        builder.Entity<DanhMuc>(e =>
        {
            e.HasIndex(c => c.DuongDan).IsUnique();
            e.HasQueryFilter(c => !c.DaXoa);
            e.HasOne(c => c.Cha).WithMany(c => c.DanhSachCon).HasForeignKey(c => c.ChaId).OnDelete(DeleteBehavior.Restrict);
        });

        // BaiViet
        builder.Entity<BaiViet>(e =>
        {
            e.HasIndex(a => a.DuongDan).IsUnique();
            e.HasIndex(a => a.TrangThai);
            e.HasIndex(a => a.NgayXuatBan);
            e.HasIndex(a => a.TacGiaId);
            e.HasIndex(a => a.DanhMucId);
            e.HasIndex(a => a.DaXoa);
            e.HasIndex(a => new { a.DanhMucId, a.TrangThai, a.NgayXuatBan });
            e.HasQueryFilter(a => !a.DaXoa);
            e.HasOne(a => a.TacGia).WithMany(u => u.DanhSachBaiViet).HasForeignKey(a => a.TacGiaId).OnDelete(DeleteBehavior.Restrict);
            e.HasOne(a => a.DanhMuc).WithMany(c => c.DanhSachBaiViet).HasForeignKey(a => a.DanhMucId).OnDelete(DeleteBehavior.Restrict);
            e.Property(a => a.NoiDung).HasColumnType("text");
        });

        // BinhLuan
        builder.Entity<BinhLuan>(e =>
        {
            e.HasIndex(c => c.BaiVietId);
            e.HasIndex(c => c.NguoiDungId);
            e.HasIndex(c => c.DaDuyet);
            e.HasIndex(c => new { c.BaiVietId, c.DaDuyet });
            e.HasQueryFilter(c => !c.DaXoa);
            e.HasOne(c => c.BaiViet).WithMany(a => a.DanhSachBinhLuan).HasForeignKey(c => c.BaiVietId).OnDelete(DeleteBehavior.Cascade);
            e.HasOne(c => c.NguoiDung).WithMany(u => u.DanhSachBinhLuan).HasForeignKey(c => c.NguoiDungId).OnDelete(DeleteBehavior.SetNull);
            e.HasOne(c => c.Cha).WithMany(c => c.DanhSachTraLoi).HasForeignKey(c => c.ChaId).OnDelete(DeleteBehavior.Restrict);
        });

        // PhuongTien
        builder.Entity<PhuongTien>(e =>
        {
            e.HasIndex(m => m.AlbumId);
            e.HasIndex(m => m.NguoiTaiLenId);
            e.HasQueryFilter(m => !m.DaXoa);
            e.HasOne(m => m.Album).WithMany(a => a.DanhSachPhuongTien).HasForeignKey(m => m.AlbumId).OnDelete(DeleteBehavior.SetNull);
            e.HasOne(m => m.NguoiTaiLen).WithMany(u => u.DanhSachTaiLen).HasForeignKey(m => m.NguoiTaiLenId).OnDelete(DeleteBehavior.Restrict);
        });

        // AlbumPhuongTien
        builder.Entity<AlbumPhuongTien>(e =>
        {
            e.HasQueryFilter(a => !a.DaXoa);
        });

        // DichVu
        builder.Entity<DichVu>(e =>
        {
            e.HasIndex(s => s.MaDichVu).IsUnique();
            e.HasQueryFilter(s => !s.DaXoa);
            e.HasOne(s => s.DanhMuc).WithMany(c => c.DanhSachDichVu).HasForeignKey(s => s.DanhMucId).OnDelete(DeleteBehavior.SetNull);
        });

        // DonUngDichVu
        builder.Entity<DonUngDichVu>(e =>
        {
            e.HasIndex(a => a.MaTheoDoi).IsUnique();
            e.HasIndex(a => a.TrangThai);
            e.HasIndex(a => a.NguoiDungId);
            e.HasIndex(a => a.NguoiXuLyId);
            e.HasQueryFilter(a => !a.DaXoa);
            e.HasOne(a => a.DichVu).WithMany(s => s.DanhSachDonUng).HasForeignKey(a => a.DichVuId).OnDelete(DeleteBehavior.Restrict);
            e.HasOne(a => a.NguoiDung).WithMany(u => u.DanhSachDonUng).HasForeignKey(a => a.NguoiDungId).OnDelete(DeleteBehavior.SetNull);
            e.HasOne(a => a.NguoiXuLy).WithMany().HasForeignKey(a => a.NguoiXuLyId).OnDelete(DeleteBehavior.SetNull);
        });

        // TepDonUng
        builder.Entity<TepDonUng>(e =>
        {
            e.HasQueryFilter(f => !f.DaXoa);
            e.HasOne(f => f.DonUng).WithMany(a => a.DanhSachTep).HasForeignKey(f => f.DonUngId).OnDelete(DeleteBehavior.Cascade);
        });

        // NhatKyKiemTra
        builder.Entity<NhatKyKiemTra>(e =>
        {
            e.HasKey(a => a.Id);
            e.HasIndex(a => a.ThoiGian);
            e.HasIndex(a => a.TenThucThe);
            e.HasOne(a => a.NguoiDung).WithMany(u => u.DanhSachNhatKy).HasForeignKey(a => a.NguoiDungId).OnDelete(DeleteBehavior.SetNull);
            e.Property(a => a.GiaTriCu).HasColumnType("text");
            e.Property(a => a.GiaTriMoi).HasColumnType("text");
        });

        // CaiDatTrangWeb
        builder.Entity<CaiDatTrangWeb>(e =>
        {
            e.HasKey(s => s.Id);
            e.HasIndex(s => s.Khoa).IsUnique();
        });

        // MaLamMoi
        builder.Entity<MaLamMoi>(e =>
        {
            e.HasKey(r => r.Id);
            e.HasIndex(r => r.MaToken).IsUnique();
            e.HasOne(r => r.NguoiDung).WithMany().HasForeignKey(r => r.NguoiDungId).OnDelete(DeleteBehavior.Cascade);
        });

        // TinNhanLienHe
        builder.Entity<TinNhanLienHe>(e =>
        {
            e.HasQueryFilter(t => !t.DaXoa);
        });

        // ThongBao
        builder.Entity<ThongBao>(e =>
        {
            e.HasIndex(n => new { n.NguoiDungId, n.DaDoc });
            e.HasQueryFilter(n => !n.DaXoa);
            e.HasOne(n => n.NguoiDung).WithMany(u => u.DanhSachThongBao).HasForeignKey(n => n.NguoiDungId).OnDelete(DeleteBehavior.Cascade);
        });

        // LichSuTrangThaiDonUng
        builder.Entity<LichSuTrangThaiDonUng>(e =>
        {
            e.HasIndex(h => h.DonUngId);
            e.HasQueryFilter(h => !h.DaXoa);
            e.HasOne(h => h.DonUng).WithMany(a => a.LichSuTrangThai).HasForeignKey(h => h.DonUngId).OnDelete(DeleteBehavior.Cascade);
            e.HasOne(h => h.NguoiThayDoi).WithMany().HasForeignKey(h => h.NguoiThayDoiId).OnDelete(DeleteBehavior.Restrict);
        });
    }

    // ── Automatic Audit Logging ─────────────────────────────

    private static readonly HashSet<string> ThucTheKiemTra = new()
    {
        nameof(BaiViet), nameof(DanhMuc), nameof(DichVu),
        nameof(DonUngDichVu), nameof(BinhLuan), nameof(PhuongTien)
    };

    private static readonly HashSet<string> ThuocTinhLoaiTru = new(StringComparer.Ordinal)
    {
        "NoiDung", "MoTa"
    };

    private static readonly JsonSerializerOptions TuyChonJson = new()
    {
        WriteIndented = false,
        DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull
    };

    public override int SaveChanges()
    {
        var auditEntries = TruocKhiLuuThayDoi();

        if (auditEntries.Count > 0)
        {
            foreach (var entry in auditEntries)
                NhatKyKiemTras.Add(entry);
        }

        return base.SaveChanges();
    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        var auditEntries = TruocKhiLuuThayDoi();

        if (auditEntries.Count > 0)
        {
            foreach (var entry in auditEntries)
                NhatKyKiemTras.Add(entry);
        }

        return await base.SaveChangesAsync(cancellationToken);
    }

    private List<NhatKyKiemTra> TruocKhiLuuThayDoi()
    {
        ChangeTracker.DetectChanges();

        // Auto-set NgayCapNhat for modified entities inheriting ThucTheCoBan
        foreach (var mucThayDoi in ChangeTracker.Entries<ThucTheCoBan>())
        {
            if (mucThayDoi.State == EntityState.Modified)
                mucThayDoi.Entity.NgayCapNhat = DateTime.UtcNow;
        }

        var cacMuc = new List<NhatKyKiemTra>();

        Guid? idNguoiDung = null;
        string? tenNguoiDung = null;
        string? diaChiIp = null;

        var httpBuiCanh = _truyCap?.HttpContext;
        if (httpBuiCanh?.User?.Identity?.IsAuthenticated == true)
        {
            var yeuCauId = httpBuiCanh.User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (Guid.TryParse(yeuCauId, out var uid))
                idNguoiDung = uid;
            tenNguoiDung = httpBuiCanh.User.FindFirstValue(ClaimTypes.Name);
        }
        diaChiIp = httpBuiCanh?.Connection?.RemoteIpAddress?.ToString();

        foreach (var mucThayDoi in ChangeTracker.Entries())
        {
            if (mucThayDoi.Entity is NhatKyKiemTra || mucThayDoi.State == EntityState.Detached || mucThayDoi.State == EntityState.Unchanged)
                continue;

            var tenThucThe = mucThayDoi.Entity.GetType().Name;
            if (!ThucTheKiemTra.Contains(tenThucThe))
                continue;

            var idThucThe = mucThayDoi.Properties.FirstOrDefault(p => p.Metadata.Name == "Id")?.CurrentValue?.ToString();

            var nhatKy = new NhatKyKiemTra
            {
                NguoiDungId = idNguoiDung,
                TenNguoiDung = tenNguoiDung,
                TenThucThe = tenThucThe,
                ThucTheId = idThucThe,
                DiaChiIp = diaChiIp,
                TacNhanNguoiDung = httpBuiCanh?.Request.Headers.UserAgent.ToString()
            };

            switch (mucThayDoi.State)
            {
                case EntityState.Added:
                    nhatKy.HanhDong = "Create";
                    nhatKy.GiaTriMoi = ChuoiHoaThuocTinh(mucThayDoi, EntityState.Added);
                    break;
                case EntityState.Modified:
                    nhatKy.HanhDong = "Update";
                    nhatKy.GiaTriCu = ChuoiHoaGiaTriCu(mucThayDoi);
                    nhatKy.GiaTriMoi = ChuoiHoaGiaTriMoi(mucThayDoi);
                    break;
                case EntityState.Deleted:
                    nhatKy.HanhDong = "Delete";
                    nhatKy.GiaTriCu = ChuoiHoaThuocTinh(mucThayDoi, EntityState.Deleted);
                    break;
            }

            cacMuc.Add(nhatKy);
        }

        return cacMuc;
    }

    private static string ChuoiHoaThuocTinh(EntityEntry mucThayDoi, EntityState trangThai)
    {
        var tuDien = new Dictionary<string, object?>();
        foreach (var thuocTinh in mucThayDoi.Properties.Where(p => !p.Metadata.IsShadowProperty()))
        {
            if (ThuocTinhLoaiTru.Contains(thuocTinh.Metadata.Name))
                continue;
            tuDien[thuocTinh.Metadata.Name] = trangThai == EntityState.Added ? thuocTinh.CurrentValue : thuocTinh.OriginalValue;
        }
        return JsonSerializer.Serialize(tuDien, TuyChonJson);
    }

    private static string ChuoiHoaGiaTriCu(EntityEntry mucThayDoi)
    {
        var tuDien = new Dictionary<string, object?>();
        foreach (var thuocTinh in mucThayDoi.Properties.Where(p => p.IsModified && !p.Metadata.IsShadowProperty()))
        {
            if (ThuocTinhLoaiTru.Contains(thuocTinh.Metadata.Name))
                continue;
            tuDien[thuocTinh.Metadata.Name] = thuocTinh.OriginalValue;
        }
        return JsonSerializer.Serialize(tuDien, TuyChonJson);
    }

    private static string ChuoiHoaGiaTriMoi(EntityEntry mucThayDoi)
    {
        var tuDien = new Dictionary<string, object?>();
        foreach (var thuocTinh in mucThayDoi.Properties.Where(p => p.IsModified && !p.Metadata.IsShadowProperty()))
        {
            if (ThuocTinhLoaiTru.Contains(thuocTinh.Metadata.Name))
                continue;
            tuDien[thuocTinh.Metadata.Name] = thuocTinh.CurrentValue;
        }
        return JsonSerializer.Serialize(tuDien, TuyChonJson);
    }
}
