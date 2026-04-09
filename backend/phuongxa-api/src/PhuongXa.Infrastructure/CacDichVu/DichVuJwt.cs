using System.Globalization;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using PhuongXa.Application.CacGiaoDien;
using PhuongXa.Domain.CacThucThe;

namespace PhuongXa.Infrastructure.CacDichVu;

public class DichVuJwt : IDichVuJwt
{
    private readonly IConfiguration _cauHinh;
    private readonly SymmetricSecurityKey _khoaKy;
    private readonly double _soPhutMaTruyCap;

    public DichVuJwt(IConfiguration cauHinh)
    {
        _cauHinh = cauHinh;

        var key = _cauHinh["Jwt:Key"]
            ?? throw new InvalidOperationException("Thiếu cấu hình bắt buộc: Jwt:Key");

        // Use UTF8 encoding for the key (same as Program.cs)
        var keyBytes = Encoding.UTF8.GetBytes(key);
        if (keyBytes.Length < 32)
            throw new InvalidOperationException($"Jwt:Key phải có ít nhất 32 bytes (256 bits) cho HMAC-SHA256. Hiện tại: {keyBytes.Length} bytes. Vui lòng sử dụng key dài hơn 32 ký tự.");

        if (string.IsNullOrEmpty(_cauHinh["Jwt:Issuer"]))
            throw new InvalidOperationException("Thiếu cấu hình bắt buộc: Jwt:Issuer");
        if (string.IsNullOrEmpty(_cauHinh["Jwt:Audience"]))
            throw new InvalidOperationException("Thiếu cấu hình bắt buộc: Jwt:Audience");

        _khoaKy = new SymmetricSecurityKey(keyBytes);

        _soPhutMaTruyCap = double.TryParse(_cauHinh["Jwt:AccessTokenMinutes"], NumberStyles.Any, CultureInfo.InvariantCulture, out var phut)
            ? phut
            : 15;
    }

    public string TaoMaTruyCap(NguoiDung nguoiDung, IList<string> danhSachVaiTro)
    {
        var thongTinKy = new SigningCredentials(_khoaKy, SecurityAlgorithms.HmacSha256);

        var cacYeuCau = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, nguoiDung.Id.ToString()),
            new(ClaimTypes.Email, nguoiDung.Email ?? string.Empty),
            new(ClaimTypes.Name, nguoiDung.HoTen),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };
        cacYeuCau.AddRange(danhSachVaiTro.Select(r => new Claim(ClaimTypes.Role, r)));

        var maJwt = new JwtSecurityToken(
            issuer: _cauHinh["Jwt:Issuer"],
            audience: _cauHinh["Jwt:Audience"],
            claims: cacYeuCau,
            expires: DateTime.UtcNow.AddMinutes(_soPhutMaTruyCap),
            signingCredentials: thongTinKy
        );

        return new JwtSecurityTokenHandler().WriteToken(maJwt);
    }

    public string TaoMaLamMoi()
    {
        var mangByte = new byte[64];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(mangByte);
        return Convert.ToBase64String(mangByte);
    }
}
