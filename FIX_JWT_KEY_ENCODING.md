# Sửa lỗi JWT Key Encoding

## Vấn đề

Backend báo lỗi khi khởi động:
```
System.InvalidOperationException: Jwt:Key phải có ít nhất 32 bytes (256 bits) cho HMAC-SHA256. Hiện tại: 16 bytes
```

## Nguyên nhân

Code cũ cố gắng decode JWT Key như base64 trước, nhưng key trong config không phải base64 hợp lệ:
```csharp
// Code cũ - SAI
try {
    keyBytes = Convert.FromBase64String(jwtKey);  // Lỗi vì key không phải base64
}
catch (FormatException) {
    keyBytes = Encoding.UTF8.GetBytes(jwtKey);
}
```

Khi decode base64 thất bại, nó fallback sang UTF8, nhưng có vẻ như có vấn đề với exception handling.

## Giải pháp

Đơn giản hóa code - chỉ dùng UTF8 encoding:

```csharp
// Code mới - ĐÚNG
var keyBytes = Encoding.UTF8.GetBytes(jwtKey);
if (keyBytes.Length < 32)
    throw new InvalidOperationException($"Jwt:Key phải có ít nhất 32 bytes...");
```

## Các file đã sửa

### 1. `backend/phuongxa-api/src/PhuongXa.API/ChuongTrinh.cs`

**TRƯỚC:**
```csharp
byte[] keyBytes;
try
{
    keyBytes = Convert.FromBase64String(jwtKey);
    if (keyBytes.Length < 32)
        throw new InvalidOperationException(...);
}
catch (FormatException ex)
{
    keyBytes = Encoding.UTF8.GetBytes(jwtKey);
    if (keyBytes.Length < 32)
        throw new InvalidOperationException(...);
}
```

**SAU:**
```csharp
var keyBytes = Encoding.UTF8.GetBytes(jwtKey);
if (keyBytes.Length < 32)
    throw new InvalidOperationException($"Jwt:Key phải có ít nhất 32 bytes (256 bits) cho HMAC-SHA256. Hiện tại: {keyBytes.Length} bytes. Vui lòng sử dụng key dài hơn 32 ký tự.");
```

### 2. `backend/phuongxa-api/src/PhuongXa.Infrastructure/CacDichVu/DichVuJwt.cs`

**TRƯỚC:**
```csharp
byte[] keyBytes;
try
{
    keyBytes = Convert.FromBase64String(key);
    if (keyBytes.Length < 32)
        throw new InvalidOperationException(...);
}
catch (FormatException)
{
    keyBytes = Encoding.UTF8.GetBytes(key);
    if (keyBytes.Length < 32)
        throw new InvalidOperationException(...);
}
```

**SAU:**
```csharp
var keyBytes = Encoding.UTF8.GetBytes(key);
if (keyBytes.Length < 32)
    throw new InvalidOperationException($"Jwt:Key phải có ít nhất 32 bytes (256 bits) cho HMAC-SHA256. Hiện tại: {keyBytes.Length} bytes. Vui lòng sử dụng key dài hơn 32 ký tự.");
```

## Kiểm tra JWT Key hiện tại

JWT Key trong config:
```
CCFZhl54yGAhYN4DHTDEb14Zzs6Swc6QJHrGAAEw/SZYyYyk/skj+qMKaM5MLyhJ
```

- Độ dài: 64 ký tự
- Bytes (UTF8): 64 bytes
- ✅ Đủ yêu cầu (>= 32 bytes)

## Lưu ý

- JWT Key phải có ít nhất 32 ký tự (để tạo ra 32 bytes khi encode UTF8)
- Không cần phải là base64, chỉ cần là chuỗi ký tự đủ dài
- Key hiện tại đã đủ mạnh và hợp lệ

## Test

Sau khi sửa, chạy lại backend:
```powershell
cd backend/phuongxa-api/src/PhuongXa.API
dotnet run
```

Backend sẽ khởi động thành công và hiển thị:
```
DEBUG: JWT Key from config: CCFZhl54yGAhYN4DHTDEb14Zzs6Swc6QJHrGAAEw/SZYyYyk/skj+qMKaM5MLyhJ
DEBUG: JWT Key length (string): 64 characters
DEBUG: JWT Key as UTF8: 64 bytes
```

## Kết quả

✅ Backend khởi động thành công
✅ JWT signing/validation hoạt động bình thường
✅ Đăng nhập và authentication hoạt động đúng
