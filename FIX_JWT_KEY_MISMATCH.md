# Fix lỗi JWT Key Mismatch - 401 Unauthorized

## Vấn đề phát hiện

### Triệu chứng
```
GET http://localhost:5000/api/public/profile
net::ERR_ABORTED 401 (Unauthorized)
⚠️ Header: Token invalid (401), clearing...
```

### Nguyên nhân
**JWT Key encoding không khớp giữa tạo token và validate token!**

- **Program.cs** (validate token): Decode JWT Key từ base64 → UTF8 fallback
- **DichVuJwt.cs** (tạo token): Chỉ dùng UTF8

→ Token được tạo với key UTF8 nhưng validate với key base64 → 401 Unauthorized

## Giải pháp

### ✅ Đã fix
**File**: `backend/phuongxa-api/src/PhuongXa.Infrastructure/CacDichVu/DichVuJwt.cs`

Thay đổi constructor để dùng cùng logic với Program.cs:
```csharp
// Cũ - chỉ dùng UTF8
var keyBytes = Encoding.UTF8.GetBytes(key);

// Mới - thử base64 trước, fallback UTF8
byte[] keyBytes;
try
{
    keyBytes = Convert.FromBase64String(key);
}
catch (FormatException)
{
    keyBytes = Encoding.UTF8.GetBytes(key);
}
```

## Cách áp dụng fix

### Bước 1: Restart backend
```powershell
.\RESTART_BACKEND_ONLY.ps1
```

Hoặc thủ công:
```powershell
# Dừng backend
Stop-Process -Name "dotnet" -Force

# Xóa build artifacts
Remove-Item backend/phuongxa-api/src/PhuongXa.API/bin -Recurse -Force
Remove-Item backend/phuongxa-api/src/PhuongXa.API/obj -Recurse -Force

# Rebuild và chạy
cd backend/phuongxa-api
$env:ASPNETCORE_ENVIRONMENT='Development'
dotnet build
dotnet run --project src/PhuongXa.API --no-build
```

### Bước 2: Xóa token cũ
Mở Console trong trình duyệt (F12) và chạy:
```javascript
localStorage.removeItem('token')
```

### Bước 3: Đăng nhập lại
1. Vào http://localhost:3001/dang-nhap
2. Nhập credentials
3. Đăng nhập

### Bước 4: Kiểm tra
Trong Console bạn sẽ thấy:
```
✅ Đăng nhập thành công
🔐 Header: Checking auth, token: EXISTS
📡 Header: Profile API status: 200  ← Phải là 200, không phải 401
✅ Header: Authenticated as [Tên]
```

## Giải thích kỹ thuật

### JWT Key trong appsettings.Development.json
```json
{
  "Jwt": {
    "Key": "CCFZhl54yGAhYN4DHTDEb14Zzs6Swc6QJHrGAAEw/SZYyYyk/skj+qMKaM5MLyhJ"
  }
}
```

Key này là base64 string (64 characters).

### Khi decode base64
```
CCFZhl54yGAhYN4DHTDEb14Zzs6Swc6QJHrGAAEw/SZYyYyk/skj+qMKaM5MLyhJ
→ 48 bytes (384 bits)
```

### Khi dùng UTF8
```
CCFZhl54yGAhYN4DHTDEb14Zzs6Swc6QJHrGAAEw/SZYyYyk/skj+qMKaM5MLyhJ
→ 64 bytes (512 bits)
```

→ Hai key khác nhau hoàn toàn!

### Kết quả
- Token được tạo với key 64 bytes (UTF8)
- Token được validate với key 48 bytes (base64)
- Signature không khớp → 401 Unauthorized

## Kiểm tra backend logs

Khi backend khởi động, bạn sẽ thấy:
```
DEBUG: JWT Key from config: CCFZhl54yGAhYN4DHTDEb14Zzs6Swc6QJHrGAAEw/SZYyYyk/skj+qMKaM5MLyhJ
DEBUG: JWT Key length (string): 64 characters
DEBUG: JWT Key decoded as base64: 48 bytes
```

Nếu thấy "Not base64, using UTF8" thì có vấn đề với key format.

## Test bằng curl

### 1. Đăng nhập và lấy token
```bash
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@phuongxa.vn","matKhau":"Admin@123456!Secure"}' \
  | jq -r '.DuLieu.MaTruyCap')

echo "Token: $TOKEN"
```

### 2. Test profile API
```bash
curl -v http://localhost:5000/api/public/profile \
  -H "Authorization: Bearer $TOKEN"
```

Nếu fix thành công, bạn sẽ thấy:
```
< HTTP/1.1 200 OK
{
  "ThanhCong": true,
  "DuLieu": {
    "HoTen": "Admin",
    "Email": "admin@phuongxa.vn",
    ...
  }
}
```

Nếu vẫn lỗi:
```
< HTTP/1.1 401 Unauthorized
```

## Troubleshooting

### Vẫn bị 401 sau khi fix
1. Đảm bảo đã rebuild backend (không chỉ restart)
2. Xóa token cũ trong localStorage
3. Kiểm tra backend logs có thông báo lỗi không
4. Verify JWT Key trong appsettings.Development.json

### Token hết hạn nhanh
Mặc định token hết hạn sau 15 phút. Để tăng:
```json
{
  "Jwt": {
    "AccessTokenMinutes": "60"
  }
}
```

### CORS error
Đảm bảo CORS đã được cấu hình:
```json
{
  "Cors": {
    "AllowedOrigins": "http://localhost:3000,http://localhost:3001"
  }
}
```
