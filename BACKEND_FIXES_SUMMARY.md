# Tổng hợp các sửa đổi Backend

## 1. ✅ Sửa JWT Key Encoding

**File:** 
- `backend/phuongxa-api/src/PhuongXa.API/ChuongTrinh.cs`
- `backend/phuongxa-api/src/PhuongXa.Infrastructure/CacDichVu/DichVuJwt.cs`

**Vấn đề:** 
- Code cũ cố decode JWT Key như base64, nhưng key không phải base64 hợp lệ
- Gây lỗi: "Jwt:Key phải có ít nhất 32 bytes (256 bits) cho HMAC-SHA256. Hiện tại: 16 bytes"

**Giải pháp:**
- Đơn giản hóa: chỉ dùng UTF8 encoding
- Loại bỏ logic try-catch base64 phức tạp

**Code thay đổi:**
```csharp
// TRƯỚC (SAI):
byte[] keyBytes;
try {
    keyBytes = Convert.FromBase64String(jwtKey);
    if (keyBytes.Length < 32)
        throw new InvalidOperationException(...);
}
catch (FormatException) {
    keyBytes = Encoding.UTF8.GetBytes(jwtKey);
    if (keyBytes.Length < 32)
        throw new InvalidOperationException(...);
}

// SAU (ĐÚNG):
var keyBytes = Encoding.UTF8.GetBytes(jwtKey);
if (keyBytes.Length < 32)
    throw new InvalidOperationException($"Jwt:Key phải có ít nhất 32 bytes...");
```

## 2. ✅ Sửa CORS Policy

**File:** `backend/phuongxa-api/src/PhuongXa.API/ChuongTrinh.cs`

**Vấn đề:**
- CORS chỉ cho phép headers: `Content-Type`, `Authorization`
- Upload file multipart/form-data cần thêm nhiều headers khác (Content-Length, boundary, etc.)
- Gây lỗi CORS khi upload media

**Giải pháp:**
- Thay đổi từ `.WithHeaders("Content-Type", "Authorization")` thành `.AllowAnyHeader()`

**Code thay đổi:**
```csharp
// TRƯỚC (SAI):
builder.Services.AddCors(opt =>
    opt.AddPolicy("FrontendPolicy", policy =>
        policy.WithOrigins(...)
        .WithHeaders("Content-Type", "Authorization")  // ❌ Quá strict
        .WithMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
        .AllowCredentials()
        .WithExposedHeaders("Content-Disposition")));

// SAU (ĐÚNG):
builder.Services.AddCors(opt =>
    opt.AddPolicy("FrontendPolicy", policy =>
        policy.WithOrigins(...)
        .AllowAnyHeader()  // ✅ Cho phép tất cả headers
        .WithMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
        .AllowCredentials()
        .WithExposedHeaders("Content-Disposition")));
```

## 3. ✅ Kiểm tra Controllers

**Các controllers đã kiểm tra:**
- ✅ `AuthController.cs` - Đăng nhập/đăng ký
- ✅ `AdminMediaController.cs` - Upload/quản lý media
- ✅ `PublicMediaController.cs` - Xem media công khai
- ✅ `DashboardController.cs` - Thống kê dashboard
- ✅ `AdminArticlesController.cs` - Quản lý bài viết
- ✅ `UsersController.cs` - Quản lý người dùng

**Kết quả:** Không có lỗi

## 4. ✅ Kiểm tra Configuration

**Files:**
- `appsettings.json`
- `appsettings.Development.json`

**JWT Configuration:**
```json
{
  "Jwt": {
    "Key": "CCFZhl54yGAhYN4DHTDEb14Zzs6Swc6QJHrGAAEw/SZYyYyk/skj+qMKaM5MLyhJ",
    "Issuer": "PhuongXaAPI",
    "Audience": "PhuongXaClient",
    "AccessTokenMinutes": "15",
    "RefreshTokenDays": "7"
  }
}
```

**Kiểm tra:**
- ✅ Key length: 64 characters
- ✅ UTF8 bytes: 64 bytes (>= 32 bytes required)
- ✅ Issuer: PhuongXaAPI
- ✅ Audience: PhuongXaClient

**CORS Configuration:**
```json
{
  "Cors": {
    "AllowedOrigins": "http://localhost:3000,http://localhost:3001,http://localhost:3002,http://localhost:5173"
  }
}
```

## Cách test

### 1. Build và chạy backend:
```powershell
.\BUILD_AND_RUN_BACKEND.ps1
```

Hoặc thủ công:
```powershell
cd backend/phuongxa-api/src/PhuongXa.API
dotnet clean
dotnet build
dotnet run
```

### 2. Kiểm tra backend đã khởi động:
- Mở browser: http://localhost:5000/swagger
- Kiểm tra console output:
  ```
  DEBUG: JWT Key from config: CCFZhl54yGAhYN4DHTDEb14Zzs6Swc6QJHrGAAEw/SZYyYyk/skj+qMKaM5MLyhJ
  DEBUG: JWT Key length (string): 64 characters
  DEBUG: JWT Key as UTF8: 64 bytes
  ```

### 3. Test đăng nhập:
```powershell
# Sử dụng Postman hoặc curl
curl -X POST http://localhost:5000/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{"email":"admin@example.com","matKhau":"Admin@123"}'
```

### 4. Test upload media (sau khi có token):
```powershell
# Sử dụng Postman với multipart/form-data
# Endpoint: POST http://localhost:5000/api/admin/media/upload
# Headers: Authorization: Bearer {token}
# Body: form-data với key "tep" và file ảnh
```

## Kết quả mong đợi

✅ Backend khởi động thành công
✅ Không có lỗi JWT Key
✅ Không có lỗi CORS
✅ API đăng nhập hoạt động
✅ API upload media hoạt động
✅ Tất cả endpoints trả về response đúng format

## Các file đã thay đổi

1. `backend/phuongxa-api/src/PhuongXa.API/ChuongTrinh.cs`
   - Sửa JWT Key encoding
   - Sửa CORS policy

2. `backend/phuongxa-api/src/PhuongXa.Infrastructure/CacDichVu/DichVuJwt.cs`
   - Sửa JWT Key encoding

## Scripts hỗ trợ

- `BUILD_AND_RUN_BACKEND.ps1` - Build và chạy backend
- `TEST_ALL_ENDPOINTS.ps1` - Test tất cả API endpoints
- `KHOI_DONG_LAI_HE_THONG.ps1` - Khởi động toàn bộ hệ thống

## Lưu ý

- JWT Key phải có ít nhất 32 ký tự
- CORS AllowedOrigins phải bao gồm tất cả frontend URLs
- Backend chạy trên port 5000
- Swagger UI: http://localhost:5000/swagger
