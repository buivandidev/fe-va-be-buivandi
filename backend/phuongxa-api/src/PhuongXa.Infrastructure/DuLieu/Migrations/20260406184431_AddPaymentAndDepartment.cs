using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace PhuongXa.Infrastructure.DuLieu.Migrations
{
    /// <inheritdoc />
    public partial class AddPaymentAndDepartment : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ApplicationFiles");

            migrationBuilder.DropTable(
                name: "ApplicationStatusHistories");

            migrationBuilder.DropTable(
                name: "AuditLogs");

            migrationBuilder.DropTable(
                name: "Comments");

            migrationBuilder.DropTable(
                name: "ContactMessages");

            migrationBuilder.DropTable(
                name: "Medias");

            migrationBuilder.DropTable(
                name: "Notifications");

            migrationBuilder.DropTable(
                name: "RefreshTokens");

            migrationBuilder.DropTable(
                name: "SiteSettings");

            migrationBuilder.DropTable(
                name: "ServiceApplications");

            migrationBuilder.DropTable(
                name: "Articles");

            migrationBuilder.DropTable(
                name: "MediaAlbums");

            migrationBuilder.DropTable(
                name: "Services");

            migrationBuilder.DropTable(
                name: "Categories");

            migrationBuilder.RenameColumn(
                name: "UpdatedAt",
                table: "Users",
                newName: "NgayCapNhat");

            migrationBuilder.RenameColumn(
                name: "IsActive",
                table: "Users",
                newName: "DangHoatDong");

            migrationBuilder.RenameColumn(
                name: "FullName",
                table: "Users",
                newName: "HoTen");

            migrationBuilder.RenameColumn(
                name: "CreatedAt",
                table: "Users",
                newName: "NgayTao");

            migrationBuilder.RenameColumn(
                name: "Avatar",
                table: "Users",
                newName: "AnhDaiDien");

            migrationBuilder.RenameColumn(
                name: "Description",
                table: "Roles",
                newName: "MoTa");

            migrationBuilder.RenameColumn(
                name: "CreatedAt",
                table: "Roles",
                newName: "NgayTao");

            migrationBuilder.CreateTable(
                name: "AlbumPhuongTiens",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Ten = table.Column<string>(type: "text", nullable: false),
                    MoTa = table.Column<string>(type: "text", nullable: true),
                    ChuDe = table.Column<string>(type: "text", nullable: true),
                    AnhBia = table.Column<string>(type: "text", nullable: true),
                    DangHoatDong = table.Column<bool>(type: "boolean", nullable: false),
                    NgayTao = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    NgayCapNhat = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    DaXoa = table.Column<bool>(type: "boolean", nullable: false),
                    NgayXoa = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AlbumPhuongTiens", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "CaiDatTrangWebs",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Khoa = table.Column<string>(type: "text", nullable: false),
                    GiaTri = table.Column<string>(type: "text", nullable: false),
                    Loai = table.Column<string>(type: "text", nullable: true),
                    MoTa = table.Column<string>(type: "text", nullable: true),
                    NgayCapNhat = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CaiDatTrangWebs", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "DanhMucs",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Ten = table.Column<string>(type: "text", nullable: false),
                    DuongDan = table.Column<string>(type: "text", nullable: false),
                    MoTa = table.Column<string>(type: "text", nullable: true),
                    ChaId = table.Column<Guid>(type: "uuid", nullable: true),
                    Loai = table.Column<int>(type: "integer", nullable: false),
                    ThuTuSapXep = table.Column<int>(type: "integer", nullable: false),
                    DangHoatDong = table.Column<bool>(type: "boolean", nullable: false),
                    NgayTao = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    NgayCapNhat = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    DaXoa = table.Column<bool>(type: "boolean", nullable: false),
                    NgayXoa = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DanhMucs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DanhMucs_DanhMucs_ChaId",
                        column: x => x.ChaId,
                        principalTable: "DanhMucs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "MaLamMois",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    NguoiDungId = table.Column<Guid>(type: "uuid", nullable: false),
                    MaToken = table.Column<string>(type: "text", nullable: false),
                    HetHanLuc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DaBiThuHoi = table.Column<bool>(type: "boolean", nullable: false),
                    NgayTao = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    TaoBoiIp = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MaLamMois", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MaLamMois_Users_NguoiDungId",
                        column: x => x.NguoiDungId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "NhatKyKiemTras",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    NguoiDungId = table.Column<Guid>(type: "uuid", nullable: true),
                    TenNguoiDung = table.Column<string>(type: "text", nullable: true),
                    HanhDong = table.Column<string>(type: "text", nullable: false),
                    TenThucThe = table.Column<string>(type: "text", nullable: false),
                    ThucTheId = table.Column<string>(type: "text", nullable: true),
                    GiaTriCu = table.Column<string>(type: "text", nullable: true),
                    GiaTriMoi = table.Column<string>(type: "text", nullable: true),
                    DiaChiIp = table.Column<string>(type: "text", nullable: true),
                    TacNhanNguoiDung = table.Column<string>(type: "text", nullable: true),
                    ThoiGian = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NhatKyKiemTras", x => x.Id);
                    table.ForeignKey(
                        name: "FK_NhatKyKiemTras_Users_NguoiDungId",
                        column: x => x.NguoiDungId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "PhongBan",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Ten = table.Column<string>(type: "text", nullable: false),
                    DangHoatDong = table.Column<bool>(type: "boolean", nullable: false),
                    TenPhongBan = table.Column<string>(type: "text", nullable: false),
                    GhiChu = table.Column<string>(type: "text", nullable: true),
                    NgayTao = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    NgayCapNhat = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    DaXoa = table.Column<bool>(type: "boolean", nullable: false),
                    NgayXoa = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PhongBan", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ThongBaos",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    NguoiDungId = table.Column<Guid>(type: "uuid", nullable: false),
                    TieuDe = table.Column<string>(type: "text", nullable: false),
                    NoiDung = table.Column<string>(type: "text", nullable: false),
                    LienKet = table.Column<string>(type: "text", nullable: true),
                    Loai = table.Column<int>(type: "integer", nullable: false),
                    DaDoc = table.Column<bool>(type: "boolean", nullable: false),
                    NgayDoc = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    NgayTao = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    NgayCapNhat = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    DaXoa = table.Column<bool>(type: "boolean", nullable: false),
                    NgayXoa = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ThongBaos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ThongBaos_Users_NguoiDungId",
                        column: x => x.NguoiDungId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TinNhanLienHes",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    HoTen = table.Column<string>(type: "text", nullable: false),
                    Email = table.Column<string>(type: "text", nullable: false),
                    DienThoai = table.Column<string>(type: "text", nullable: true),
                    ChuDe = table.Column<string>(type: "text", nullable: false),
                    NoiDung = table.Column<string>(type: "text", nullable: false),
                    DaDoc = table.Column<bool>(type: "boolean", nullable: false),
                    NgayDoc = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    NgayTao = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    NgayCapNhat = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    DaXoa = table.Column<bool>(type: "boolean", nullable: false),
                    NgayXoa = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TinNhanLienHes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PhuongTiens",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TenTep = table.Column<string>(type: "text", nullable: false),
                    DuongDanTep = table.Column<string>(type: "text", nullable: false),
                    UrlTep = table.Column<string>(type: "text", nullable: true),
                    KichThuocTep = table.Column<long>(type: "bigint", nullable: false),
                    LoaiNoiDung = table.Column<string>(type: "text", nullable: true),
                    Loai = table.Column<int>(type: "integer", nullable: false),
                    AlbumId = table.Column<Guid>(type: "uuid", nullable: true),
                    NguoiTaiLenId = table.Column<Guid>(type: "uuid", nullable: false),
                    VanBanThayThe = table.Column<string>(type: "text", nullable: true),
                    NgayTao = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    NgayCapNhat = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    DaXoa = table.Column<bool>(type: "boolean", nullable: false),
                    NgayXoa = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PhuongTiens", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PhuongTiens_AlbumPhuongTiens_AlbumId",
                        column: x => x.AlbumId,
                        principalTable: "AlbumPhuongTiens",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_PhuongTiens_Users_NguoiTaiLenId",
                        column: x => x.NguoiTaiLenId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "BaiViets",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TieuDe = table.Column<string>(type: "text", nullable: false),
                    DuongDan = table.Column<string>(type: "text", nullable: false),
                    TomTat = table.Column<string>(type: "text", nullable: true),
                    NoiDung = table.Column<string>(type: "text", nullable: false),
                    AnhDaiDien = table.Column<string>(type: "text", nullable: true),
                    TacGiaId = table.Column<Guid>(type: "uuid", nullable: false),
                    DanhMucId = table.Column<Guid>(type: "uuid", nullable: false),
                    TrangThai = table.Column<int>(type: "integer", nullable: false),
                    NgayXuatBan = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    SoLuotXem = table.Column<int>(type: "integer", nullable: false),
                    NoiBat = table.Column<bool>(type: "boolean", nullable: false),
                    TieuDeMeta = table.Column<string>(type: "text", nullable: true),
                    MoTaMeta = table.Column<string>(type: "text", nullable: true),
                    TheTag = table.Column<string>(type: "text", nullable: true),
                    NgayTao = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    NgayCapNhat = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    DaXoa = table.Column<bool>(type: "boolean", nullable: false),
                    NgayXoa = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BaiViets", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BaiViets_DanhMucs_DanhMucId",
                        column: x => x.DanhMucId,
                        principalTable: "DanhMucs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_BaiViets_Users_TacGiaId",
                        column: x => x.TacGiaId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "DichVus",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Ten = table.Column<string>(type: "text", nullable: false),
                    MaDichVu = table.Column<string>(type: "text", nullable: false),
                    MoTa = table.Column<string>(type: "text", nullable: true),
                    GiayToCanThiet = table.Column<string>(type: "text", nullable: true),
                    SoNgayXuLy = table.Column<int>(type: "integer", nullable: false),
                    LePhi = table.Column<decimal>(type: "numeric", nullable: true),
                    UrlBieuMau = table.Column<string>(type: "text", nullable: true),
                    DanhMucId = table.Column<Guid>(type: "uuid", nullable: true),
                    DangHoatDong = table.Column<bool>(type: "boolean", nullable: false),
                    ThuTuSapXep = table.Column<int>(type: "integer", nullable: false),
                    CanCuPhapLy = table.Column<string>(type: "text", nullable: true),
                    QuyTrinh = table.Column<string>(type: "text", nullable: true),
                    NgayTao = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    NgayCapNhat = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    DaXoa = table.Column<bool>(type: "boolean", nullable: false),
                    NgayXoa = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DichVus", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DichVus_DanhMucs_DanhMucId",
                        column: x => x.DanhMucId,
                        principalTable: "DanhMucs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "BinhLuans",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    BaiVietId = table.Column<Guid>(type: "uuid", nullable: false),
                    NguoiDungId = table.Column<Guid>(type: "uuid", nullable: true),
                    TenKhach = table.Column<string>(type: "text", nullable: true),
                    EmailKhach = table.Column<string>(type: "text", nullable: true),
                    NoiDung = table.Column<string>(type: "text", nullable: false),
                    DaDuyet = table.Column<bool>(type: "boolean", nullable: false),
                    ChaId = table.Column<Guid>(type: "uuid", nullable: true),
                    NgayTao = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    NgayCapNhat = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    DaXoa = table.Column<bool>(type: "boolean", nullable: false),
                    NgayXoa = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BinhLuans", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BinhLuans_BaiViets_BaiVietId",
                        column: x => x.BaiVietId,
                        principalTable: "BaiViets",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_BinhLuans_BinhLuans_ChaId",
                        column: x => x.ChaId,
                        principalTable: "BinhLuans",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_BinhLuans_Users_NguoiDungId",
                        column: x => x.NguoiDungId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "DonUngDichVus",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    MaTheoDoi = table.Column<string>(type: "text", nullable: false),
                    DichVuId = table.Column<Guid>(type: "uuid", nullable: false),
                    NguoiDungId = table.Column<Guid>(type: "uuid", nullable: true),
                    TenNguoiNop = table.Column<string>(type: "text", nullable: false),
                    EmailNguoiNop = table.Column<string>(type: "text", nullable: false),
                    DienThoaiNguoiNop = table.Column<string>(type: "text", nullable: false),
                    DiaChiNguoiNop = table.Column<string>(type: "text", nullable: true),
                    GhiChu = table.Column<string>(type: "text", nullable: true),
                    TrangThai = table.Column<int>(type: "integer", nullable: false),
                    TrangThaiThanhToanLePhi = table.Column<int>(type: "integer", nullable: false),
                    LePhiTaiThoiDiemNop = table.Column<decimal>(type: "numeric", nullable: false),
                    MaThamChieuThanhToan = table.Column<string>(type: "text", nullable: true),
                    LePhiDaNop = table.Column<decimal>(type: "numeric", nullable: true),
                    NgayThanhToan = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    HeThongThanhToan = table.Column<string>(type: "text", nullable: true),
                    ThamChieuGiaoDich = table.Column<string>(type: "text", nullable: true),
                    DuongDanBienLai = table.Column<string>(type: "text", nullable: true),
                    NgayNop = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    NgayXuLy = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    HanXuLy = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    NgayHenTra = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    GhiChuNguoiXuLy = table.Column<string>(type: "text", nullable: true),
                    NguoiXuLyId = table.Column<Guid>(type: "uuid", nullable: true),
                    PhongBanHienTaiId = table.Column<Guid>(type: "uuid", nullable: true),
                    NgayTao = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    NgayCapNhat = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    DaXoa = table.Column<bool>(type: "boolean", nullable: false),
                    NgayXoa = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DonUngDichVus", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DonUngDichVus_DichVus_DichVuId",
                        column: x => x.DichVuId,
                        principalTable: "DichVus",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_DonUngDichVus_PhongBan_PhongBanHienTaiId",
                        column: x => x.PhongBanHienTaiId,
                        principalTable: "PhongBan",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_DonUngDichVus_Users_NguoiDungId",
                        column: x => x.NguoiDungId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_DonUngDichVus_Users_NguoiXuLyId",
                        column: x => x.NguoiXuLyId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "LichSuTrangThaiDonUngs",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    DonUngId = table.Column<Guid>(type: "uuid", nullable: false),
                    TrangThaiCu = table.Column<int>(type: "integer", nullable: false),
                    TrangThaiMoi = table.Column<int>(type: "integer", nullable: false),
                    GhiChu = table.Column<string>(type: "text", nullable: true),
                    NguoiThayDoiId = table.Column<Guid>(type: "uuid", nullable: false),
                    NgayTao = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    NgayCapNhat = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    DaXoa = table.Column<bool>(type: "boolean", nullable: false),
                    NgayXoa = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LichSuTrangThaiDonUngs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_LichSuTrangThaiDonUngs_DonUngDichVus_DonUngId",
                        column: x => x.DonUngId,
                        principalTable: "DonUngDichVus",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_LichSuTrangThaiDonUngs_Users_NguoiThayDoiId",
                        column: x => x.NguoiThayDoiId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "TepDonUngs",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    DonUngId = table.Column<Guid>(type: "uuid", nullable: false),
                    TenTep = table.Column<string>(type: "text", nullable: false),
                    DuongDanTep = table.Column<string>(type: "text", nullable: false),
                    UrlTep = table.Column<string>(type: "text", nullable: true),
                    KichThuocTep = table.Column<long>(type: "bigint", nullable: false),
                    LoaiNoiDung = table.Column<string>(type: "text", nullable: true),
                    NgayTao = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    NgayCapNhat = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    DaXoa = table.Column<bool>(type: "boolean", nullable: false),
                    NgayXoa = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TepDonUngs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TepDonUngs_DonUngDichVus_DonUngId",
                        column: x => x.DonUngId,
                        principalTable: "DonUngDichVus",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_BaiViets_DanhMucId",
                table: "BaiViets",
                column: "DanhMucId");

            migrationBuilder.CreateIndex(
                name: "IX_BaiViets_DanhMucId_TrangThai_NgayXuatBan",
                table: "BaiViets",
                columns: new[] { "DanhMucId", "TrangThai", "NgayXuatBan" });

            migrationBuilder.CreateIndex(
                name: "IX_BaiViets_DaXoa",
                table: "BaiViets",
                column: "DaXoa");

            migrationBuilder.CreateIndex(
                name: "IX_BaiViets_DuongDan",
                table: "BaiViets",
                column: "DuongDan",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_BaiViets_NgayXuatBan",
                table: "BaiViets",
                column: "NgayXuatBan");

            migrationBuilder.CreateIndex(
                name: "IX_BaiViets_TacGiaId",
                table: "BaiViets",
                column: "TacGiaId");

            migrationBuilder.CreateIndex(
                name: "IX_BaiViets_TrangThai",
                table: "BaiViets",
                column: "TrangThai");

            migrationBuilder.CreateIndex(
                name: "IX_BinhLuans_BaiVietId",
                table: "BinhLuans",
                column: "BaiVietId");

            migrationBuilder.CreateIndex(
                name: "IX_BinhLuans_BaiVietId_DaDuyet",
                table: "BinhLuans",
                columns: new[] { "BaiVietId", "DaDuyet" });

            migrationBuilder.CreateIndex(
                name: "IX_BinhLuans_ChaId",
                table: "BinhLuans",
                column: "ChaId");

            migrationBuilder.CreateIndex(
                name: "IX_BinhLuans_DaDuyet",
                table: "BinhLuans",
                column: "DaDuyet");

            migrationBuilder.CreateIndex(
                name: "IX_BinhLuans_NguoiDungId",
                table: "BinhLuans",
                column: "NguoiDungId");

            migrationBuilder.CreateIndex(
                name: "IX_CaiDatTrangWebs_Khoa",
                table: "CaiDatTrangWebs",
                column: "Khoa",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_DanhMucs_ChaId",
                table: "DanhMucs",
                column: "ChaId");

            migrationBuilder.CreateIndex(
                name: "IX_DanhMucs_DuongDan",
                table: "DanhMucs",
                column: "DuongDan",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_DichVus_DanhMucId",
                table: "DichVus",
                column: "DanhMucId");

            migrationBuilder.CreateIndex(
                name: "IX_DichVus_MaDichVu",
                table: "DichVus",
                column: "MaDichVu",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_DonUngDichVus_DichVuId",
                table: "DonUngDichVus",
                column: "DichVuId");

            migrationBuilder.CreateIndex(
                name: "IX_DonUngDichVus_MaTheoDoi",
                table: "DonUngDichVus",
                column: "MaTheoDoi",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_DonUngDichVus_NguoiDungId",
                table: "DonUngDichVus",
                column: "NguoiDungId");

            migrationBuilder.CreateIndex(
                name: "IX_DonUngDichVus_NguoiXuLyId",
                table: "DonUngDichVus",
                column: "NguoiXuLyId");

            migrationBuilder.CreateIndex(
                name: "IX_DonUngDichVus_PhongBanHienTaiId",
                table: "DonUngDichVus",
                column: "PhongBanHienTaiId");

            migrationBuilder.CreateIndex(
                name: "IX_DonUngDichVus_TrangThai",
                table: "DonUngDichVus",
                column: "TrangThai");

            migrationBuilder.CreateIndex(
                name: "IX_LichSuTrangThaiDonUngs_DonUngId",
                table: "LichSuTrangThaiDonUngs",
                column: "DonUngId");

            migrationBuilder.CreateIndex(
                name: "IX_LichSuTrangThaiDonUngs_NguoiThayDoiId",
                table: "LichSuTrangThaiDonUngs",
                column: "NguoiThayDoiId");

            migrationBuilder.CreateIndex(
                name: "IX_MaLamMois_MaToken",
                table: "MaLamMois",
                column: "MaToken",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_MaLamMois_NguoiDungId",
                table: "MaLamMois",
                column: "NguoiDungId");

            migrationBuilder.CreateIndex(
                name: "IX_NhatKyKiemTras_NguoiDungId",
                table: "NhatKyKiemTras",
                column: "NguoiDungId");

            migrationBuilder.CreateIndex(
                name: "IX_NhatKyKiemTras_TenThucThe",
                table: "NhatKyKiemTras",
                column: "TenThucThe");

            migrationBuilder.CreateIndex(
                name: "IX_NhatKyKiemTras_ThoiGian",
                table: "NhatKyKiemTras",
                column: "ThoiGian");

            migrationBuilder.CreateIndex(
                name: "IX_PhuongTiens_AlbumId",
                table: "PhuongTiens",
                column: "AlbumId");

            migrationBuilder.CreateIndex(
                name: "IX_PhuongTiens_NguoiTaiLenId",
                table: "PhuongTiens",
                column: "NguoiTaiLenId");

            migrationBuilder.CreateIndex(
                name: "IX_TepDonUngs_DonUngId",
                table: "TepDonUngs",
                column: "DonUngId");

            migrationBuilder.CreateIndex(
                name: "IX_ThongBaos_NguoiDungId_DaDoc",
                table: "ThongBaos",
                columns: new[] { "NguoiDungId", "DaDoc" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BinhLuans");

            migrationBuilder.DropTable(
                name: "CaiDatTrangWebs");

            migrationBuilder.DropTable(
                name: "LichSuTrangThaiDonUngs");

            migrationBuilder.DropTable(
                name: "MaLamMois");

            migrationBuilder.DropTable(
                name: "NhatKyKiemTras");

            migrationBuilder.DropTable(
                name: "PhuongTiens");

            migrationBuilder.DropTable(
                name: "TepDonUngs");

            migrationBuilder.DropTable(
                name: "ThongBaos");

            migrationBuilder.DropTable(
                name: "TinNhanLienHes");

            migrationBuilder.DropTable(
                name: "BaiViets");

            migrationBuilder.DropTable(
                name: "AlbumPhuongTiens");

            migrationBuilder.DropTable(
                name: "DonUngDichVus");

            migrationBuilder.DropTable(
                name: "DichVus");

            migrationBuilder.DropTable(
                name: "PhongBan");

            migrationBuilder.DropTable(
                name: "DanhMucs");

            migrationBuilder.RenameColumn(
                name: "NgayTao",
                table: "Users",
                newName: "CreatedAt");

            migrationBuilder.RenameColumn(
                name: "NgayCapNhat",
                table: "Users",
                newName: "UpdatedAt");

            migrationBuilder.RenameColumn(
                name: "HoTen",
                table: "Users",
                newName: "FullName");

            migrationBuilder.RenameColumn(
                name: "DangHoatDong",
                table: "Users",
                newName: "IsActive");

            migrationBuilder.RenameColumn(
                name: "AnhDaiDien",
                table: "Users",
                newName: "Avatar");

            migrationBuilder.RenameColumn(
                name: "NgayTao",
                table: "Roles",
                newName: "CreatedAt");

            migrationBuilder.RenameColumn(
                name: "MoTa",
                table: "Roles",
                newName: "Description");

            migrationBuilder.CreateTable(
                name: "AuditLogs",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserId = table.Column<Guid>(type: "uuid", nullable: true),
                    Action = table.Column<string>(type: "text", nullable: false),
                    EntityId = table.Column<string>(type: "text", nullable: true),
                    EntityName = table.Column<string>(type: "text", nullable: false),
                    IpAddress = table.Column<string>(type: "text", nullable: true),
                    NewValue = table.Column<string>(type: "text", nullable: true),
                    OldValue = table.Column<string>(type: "text", nullable: true),
                    Timestamp = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UserAgent = table.Column<string>(type: "text", nullable: true),
                    UserName = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AuditLogs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AuditLogs_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "Categories",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ParentId = table.Column<Guid>(type: "uuid", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Slug = table.Column<string>(type: "text", nullable: false),
                    SortOrder = table.Column<int>(type: "integer", nullable: false),
                    Type = table.Column<int>(type: "integer", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Categories", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Categories_Categories_ParentId",
                        column: x => x.ParentId,
                        principalTable: "Categories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ContactMessages",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Content = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Email = table.Column<string>(type: "text", nullable: false),
                    FullName = table.Column<string>(type: "text", nullable: false),
                    IsRead = table.Column<bool>(type: "boolean", nullable: false),
                    Phone = table.Column<string>(type: "text", nullable: true),
                    ReadAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    Subject = table.Column<string>(type: "text", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ContactMessages", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "MediaAlbums",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    CoverImage = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Theme = table.Column<string>(type: "text", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MediaAlbums", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Notifications",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    Content = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    IsRead = table.Column<bool>(type: "boolean", nullable: false),
                    Link = table.Column<string>(type: "text", nullable: true),
                    ReadAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    Title = table.Column<string>(type: "text", nullable: false),
                    Type = table.Column<int>(type: "integer", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Notifications", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Notifications_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "RefreshTokens",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatedByIp = table.Column<string>(type: "text", nullable: true),
                    ExpiresAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    IsRevoked = table.Column<bool>(type: "boolean", nullable: false),
                    Token = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RefreshTokens", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RefreshTokens_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SiteSettings",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Description = table.Column<string>(type: "text", nullable: true),
                    Key = table.Column<string>(type: "text", nullable: false),
                    Type = table.Column<string>(type: "text", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Value = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SiteSettings", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Articles",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    AuthorId = table.Column<Guid>(type: "uuid", nullable: false),
                    CategoryId = table.Column<Guid>(type: "uuid", nullable: false),
                    Content = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    IsFeatured = table.Column<bool>(type: "boolean", nullable: false),
                    MetaDescription = table.Column<string>(type: "text", nullable: true),
                    MetaTitle = table.Column<string>(type: "text", nullable: true),
                    PublishedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    Slug = table.Column<string>(type: "text", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    Summary = table.Column<string>(type: "text", nullable: true),
                    Tags = table.Column<string>(type: "text", nullable: true),
                    Thumbnail = table.Column<string>(type: "text", nullable: true),
                    Title = table.Column<string>(type: "text", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ViewCount = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Articles", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Articles_Categories_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "Categories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Articles_Users_AuthorId",
                        column: x => x.AuthorId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Services",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    CategoryId = table.Column<Guid>(type: "uuid", nullable: true),
                    Code = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true),
                    Fee = table.Column<decimal>(type: "numeric", nullable: true),
                    FormUrl = table.Column<string>(type: "text", nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    LegalBasis = table.Column<string>(type: "text", nullable: true),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Procedure = table.Column<string>(type: "text", nullable: true),
                    ProcessingDays = table.Column<int>(type: "integer", nullable: false),
                    RequiredDocuments = table.Column<string>(type: "text", nullable: true),
                    SortOrder = table.Column<int>(type: "integer", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Services", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Services_Categories_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "Categories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "Medias",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    AlbumId = table.Column<Guid>(type: "uuid", nullable: true),
                    UploadedById = table.Column<Guid>(type: "uuid", nullable: false),
                    AltText = table.Column<string>(type: "text", nullable: true),
                    ContentType = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    FileName = table.Column<string>(type: "text", nullable: false),
                    FilePath = table.Column<string>(type: "text", nullable: false),
                    FileSize = table.Column<long>(type: "bigint", nullable: false),
                    FileUrl = table.Column<string>(type: "text", nullable: true),
                    Type = table.Column<int>(type: "integer", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Medias", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Medias_MediaAlbums_AlbumId",
                        column: x => x.AlbumId,
                        principalTable: "MediaAlbums",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_Medias_Users_UploadedById",
                        column: x => x.UploadedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Comments",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ArticleId = table.Column<Guid>(type: "uuid", nullable: false),
                    ParentId = table.Column<Guid>(type: "uuid", nullable: true),
                    UserId = table.Column<Guid>(type: "uuid", nullable: true),
                    Content = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    GuestEmail = table.Column<string>(type: "text", nullable: true),
                    GuestName = table.Column<string>(type: "text", nullable: true),
                    IsApproved = table.Column<bool>(type: "boolean", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Comments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Comments_Articles_ArticleId",
                        column: x => x.ArticleId,
                        principalTable: "Articles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Comments_Comments_ParentId",
                        column: x => x.ParentId,
                        principalTable: "Comments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Comments_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "ServiceApplications",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ProcessedById = table.Column<Guid>(type: "uuid", nullable: true),
                    ServiceId = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: true),
                    ApplicantAddress = table.Column<string>(type: "text", nullable: true),
                    ApplicantEmail = table.Column<string>(type: "text", nullable: false),
                    ApplicantName = table.Column<string>(type: "text", nullable: false),
                    ApplicantPhone = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Notes = table.Column<string>(type: "text", nullable: true),
                    ProcessedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ProcessorNote = table.Column<string>(type: "text", nullable: true),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    SubmittedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    TrackingCode = table.Column<string>(type: "text", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ServiceApplications", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ServiceApplications_Services_ServiceId",
                        column: x => x.ServiceId,
                        principalTable: "Services",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ServiceApplications_Users_ProcessedById",
                        column: x => x.ProcessedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_ServiceApplications_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "ApplicationFiles",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ApplicationId = table.Column<Guid>(type: "uuid", nullable: false),
                    ContentType = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    FileName = table.Column<string>(type: "text", nullable: false),
                    FilePath = table.Column<string>(type: "text", nullable: false),
                    FileSize = table.Column<long>(type: "bigint", nullable: false),
                    FileUrl = table.Column<string>(type: "text", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ApplicationFiles", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ApplicationFiles_ServiceApplications_ApplicationId",
                        column: x => x.ApplicationId,
                        principalTable: "ServiceApplications",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ApplicationStatusHistories",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ApplicationId = table.Column<Guid>(type: "uuid", nullable: false),
                    ChangedById = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    NewStatus = table.Column<int>(type: "integer", nullable: false),
                    Note = table.Column<string>(type: "text", nullable: true),
                    OldStatus = table.Column<int>(type: "integer", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ApplicationStatusHistories", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ApplicationStatusHistories_ServiceApplications_ApplicationId",
                        column: x => x.ApplicationId,
                        principalTable: "ServiceApplications",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ApplicationStatusHistories_Users_ChangedById",
                        column: x => x.ChangedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ApplicationFiles_ApplicationId",
                table: "ApplicationFiles",
                column: "ApplicationId");

            migrationBuilder.CreateIndex(
                name: "IX_ApplicationStatusHistories_ApplicationId",
                table: "ApplicationStatusHistories",
                column: "ApplicationId");

            migrationBuilder.CreateIndex(
                name: "IX_ApplicationStatusHistories_ChangedById",
                table: "ApplicationStatusHistories",
                column: "ChangedById");

            migrationBuilder.CreateIndex(
                name: "IX_Articles_AuthorId",
                table: "Articles",
                column: "AuthorId");

            migrationBuilder.CreateIndex(
                name: "IX_Articles_CategoryId",
                table: "Articles",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_Articles_PublishedAt",
                table: "Articles",
                column: "PublishedAt");

            migrationBuilder.CreateIndex(
                name: "IX_Articles_Slug",
                table: "Articles",
                column: "Slug",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Articles_Status",
                table: "Articles",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_AuditLogs_EntityName",
                table: "AuditLogs",
                column: "EntityName");

            migrationBuilder.CreateIndex(
                name: "IX_AuditLogs_Timestamp",
                table: "AuditLogs",
                column: "Timestamp");

            migrationBuilder.CreateIndex(
                name: "IX_AuditLogs_UserId",
                table: "AuditLogs",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Categories_ParentId",
                table: "Categories",
                column: "ParentId");

            migrationBuilder.CreateIndex(
                name: "IX_Categories_Slug",
                table: "Categories",
                column: "Slug",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Comments_ArticleId",
                table: "Comments",
                column: "ArticleId");

            migrationBuilder.CreateIndex(
                name: "IX_Comments_ParentId",
                table: "Comments",
                column: "ParentId");

            migrationBuilder.CreateIndex(
                name: "IX_Comments_UserId",
                table: "Comments",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Medias_AlbumId",
                table: "Medias",
                column: "AlbumId");

            migrationBuilder.CreateIndex(
                name: "IX_Medias_UploadedById",
                table: "Medias",
                column: "UploadedById");

            migrationBuilder.CreateIndex(
                name: "IX_Notifications_IsRead",
                table: "Notifications",
                column: "IsRead");

            migrationBuilder.CreateIndex(
                name: "IX_Notifications_UserId",
                table: "Notifications",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_RefreshTokens_Token",
                table: "RefreshTokens",
                column: "Token",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_RefreshTokens_UserId",
                table: "RefreshTokens",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_ServiceApplications_ProcessedById",
                table: "ServiceApplications",
                column: "ProcessedById");

            migrationBuilder.CreateIndex(
                name: "IX_ServiceApplications_ServiceId",
                table: "ServiceApplications",
                column: "ServiceId");

            migrationBuilder.CreateIndex(
                name: "IX_ServiceApplications_Status",
                table: "ServiceApplications",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_ServiceApplications_TrackingCode",
                table: "ServiceApplications",
                column: "TrackingCode",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ServiceApplications_UserId",
                table: "ServiceApplications",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Services_CategoryId",
                table: "Services",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_Services_Code",
                table: "Services",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_SiteSettings_Key",
                table: "SiteSettings",
                column: "Key",
                unique: true);
        }
    }
}
