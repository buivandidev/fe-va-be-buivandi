# Hướng dẫn khởi động lại toàn bộ hệ thống

## Bước 1: Chạy script restart
```powershell
.\RESTART_ALL_CLEAN.ps1
```

Script sẽ:
1. ✅ Dừng tất cả processes (backend, frontend)
2. ✅ Xóa build artifacts (bin, obj, .next)
3. ✅ Rebuild backend với JWT fix
4. ✅ Khởi động backend (port 5000)
5. ✅ Khởi động frontend admin (port 3000)
6. ✅ Khởi động frontend người dân (port 3001)

## Bước 2: Đợi hệ thống khởi động
Đợi khoảng 30-40 giây để tất cả services khởi động hoàn tất.

## Bước 3: Xóa token cũ

### Frontend Admin (http://localhost:3000)
1. Mở trang đăng nhập admin
2. Bấm F12 để mở Console
3. Chạy lệnh:
```javascript
localStorage.removeItem('auth_token')
localStorage.clear()
location.reload()
```

### Frontend Người Dân (http://localhost:3001)
1. Mở trang đăng nhập người dân
2. Bấm F12 để mở Console
3. Chạy lệnh:
```javascript
localStorage.removeItem('token')
localStorage.clear()
location.reload()
```

## Bước 4: Đăng nhập lại

### Admin
- URL: http://localhost:3000/admin/login
- Email: `admin@phuongxa.vn`
- Password: `Admin@123456!Secure`

### Người Dân
- URL: http://localhost:3001/dang-nhap
- Email: `admin@phuongxa.vn`
- Password: `Admin@123456!Secure`

## Bước 5: Kiểm tra Console logs

### Logs thành công sẽ hiển thị:
```
📦 Login response: { status: true, payload: {...} }
🔑 Extracted token: eyJhbGciOiJIUzI1NiIsInR5cCI...
✅ Đăng nhập thành công
🔐 Header: Checking auth, token: EXISTS
📡 Header: Profile API status: 200  ← PHẢI LÀ 200
✅ Header: Authenticated as Admin
```

### Nếu vẫn thấy lỗi 401:
```
📡 Header: Profile API status: 401
⚠️ Header: Token invalid (401), clearing...
```

**Nguyên nhân**: Backend chưa rebuild hoặc token cũ chưa xóa

**Giải pháp**:
1. Đảm bảo backend đã rebuild (xem terminal backend)
2. Xóa token: `localStorage.clear()`
3. Hard refresh: Ctrl+Shift+R
4. Đăng nhập lại

## Kiểm tra backend đã rebuild

Trong terminal backend, bạn phải thấy:
```
Building backend...
Build succeeded.
Starting backend...
DEBUG: JWT Key from config: CCFZhl54yGAhYN4DHTDEb14Zzs6Swc6QJHrGAAEw/SZYyYyk/skj+qMKaM5MLyhJ
DEBUG: JWT Key decoded as base64: 48 bytes
```

Nếu thấy "JWT Key as UTF8: 64 bytes" thì backend chưa rebuild đúng.

## Kiểm tra các endpoints

### 1. Backend Health
```bash
curl http://localhost:5000/swagger
```

### 2. Login API
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@phuongxa.vn","matKhau":"Admin@123456!Secure"}' \
  | jq
```

### 3. Profile API (thay YOUR_TOKEN)
```bash
curl http://localhost:5000/api/public/profile \
  -H "Authorization: Bearer YOUR_TOKEN" \
  | jq
```

### 4. Albums API
```bash
curl http://localhost:5000/api/media/albums | jq
```

## Troubleshooting

### Backend không khởi động
**Triệu chứng**: Không thấy terminal backend hoặc lỗi build

**Giải pháp**:
```powershell
cd backend/phuongxa-api
dotnet clean
dotnet build
$env:ASPNETCORE_ENVIRONMENT='Development'
dotnet run --project src/PhuongXa.API
```

### Frontend không khởi động
**Triệu chứng**: Không thấy terminal frontend

**Giải pháp**:
```powershell
# Admin
cd frontend
npm run dev

# Người dân (terminal khác)
cd frontend/nguoi-dan
npm run dev -- --port 3001
```

### Port đã được sử dụng
**Triệu chứng**: "Port 5000 is already in use"

**Giải pháp**:
```powershell
# Dừng tất cả processes
Stop-Process -Name "dotnet" -Force
Stop-Process -Name "node" -Force

# Hoặc tìm và kill process cụ thể
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### CORS error
**Triệu chứng**: "Access-Control-Allow-Origin" error

**Giải pháp**: Kiểm tra `appsettings.Development.json`:
```json
{
  "Cors": {
    "AllowedOrigins": "http://localhost:3000,http://localhost:3001"
  }
}
```

## Tóm tắt các file đã fix

1. ✅ `backend/phuongxa-api/src/PhuongXa.Infrastructure/CacDichVu/DichVuJwt.cs`
   - Fix JWT Key encoding để khớp với Program.cs

2. ✅ `frontend/nguoi-dan/src/app/dang-nhap/page.tsx`
   - Thêm logging chi tiết

3. ✅ `frontend/nguoi-dan/src/components/portal/Header.tsx`
   - Chỉ xóa token khi 401, không xóa khi lỗi server

4. ✅ `RESTART_ALL_CLEAN.ps1`
   - Script restart toàn bộ với clean build

## Kết quả mong đợi

Sau khi hoàn thành các bước trên:
- ✅ Đăng nhập admin thành công
- ✅ Đăng nhập người dân thành công
- ✅ Profile API trả về 200 OK
- ✅ Thư viện media load được dữ liệu
- ✅ Không còn lỗi 401 Unauthorized
