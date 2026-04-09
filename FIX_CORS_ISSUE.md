# Fix Lỗi CORS Trang Người Dân

## Vấn Đề

Trang người dân (http://localhost:3001) bị lỗi CORS khi gọi API:

```
Access to fetch at 'http://localhost:5000/api/media/albums' from origin 'http://localhost:3001' 
has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

## Nguyên Nhân

1. Backend config đã có `localhost:3001` trong `AllowedOrigins`
2. NHƯNG backend chưa được restart để áp dụng config mới
3. Hoặc frontend cache cũ vẫn đang dùng

## Giải Pháp Nhanh

### Cách 1: Dùng script tự động (Khuyến nghị)

```powershell
.\FIX_CORS_NGUOIDAN.ps1
```

Script này sẽ:
1. ✅ Kiểm tra config CORS
2. ✅ Restart Backend
3. ✅ Test CORS
4. ✅ Restart Frontend Người Dân

### Cách 2: Manual

**Bước 1: Kiểm tra config**

File: `backend/phuongxa-api/src/PhuongXa.API/appsettings.Development.json`

```json
{
  "Cors": {
    "AllowedOrigins": "http://localhost:3000,http://localhost:3001,http://localhost:3002,http://localhost:5173"
  }
}
```

Đảm bảo có `http://localhost:3001`

**Bước 2: Restart Backend**

```powershell
# Dừng backend
Get-Process -Name "PhuongXa.API" | Stop-Process -Force

# Khởi động lại
cd backend/phuongxa-api
$env:ASPNETCORE_ENVIRONMENT='Development'
dotnet run --project src/PhuongXa.API
```

**Bước 3: Restart Frontend Người Dân**

```powershell
# Dừng Node.js
Stop-Process -Name node -Force

# Xóa cache
Remove-Item -Recurse -Force frontend/nguoi-dan/.next

# Khởi động lại
cd frontend/nguoi-dan
npm run dev -- --port 3001
```

**Bước 4: Test**

1. Mở http://localhost:3001
2. Mở DevTools (F12) → Console
3. Kiểm tra không còn lỗi CORS

## Kiểm Tra CORS Hoạt Động

### Test với curl

```powershell
curl -X GET http://localhost:5000/api/media/albums `
  -H "Origin: http://localhost:3001" `
  -v 2>&1 | Select-String "Access-Control"
```

Kết quả mong đợi:
```
Access-Control-Allow-Origin: http://localhost:3001
Access-Control-Allow-Credentials: true
```

### Test trong browser

```javascript
// Mở DevTools Console trên http://localhost:3001
fetch('http://localhost:5000/api/media/albums')
  .then(r => r.json())
  .then(d => console.log('Success:', d))
  .catch(e => console.error('Error:', e))
```

Nếu OK → Không có lỗi CORS

## Troubleshooting

### Vẫn lỗi sau khi restart

**Nguyên nhân**: Browser cache

**Giải pháp**:
1. Hard refresh: `Ctrl + Shift + R`
2. Hoặc clear cache:
   - DevTools → Application → Clear storage
   - Click "Clear site data"

### Backend không áp dụng config

**Nguyên nhân**: Đang dùng config khác (Production)

**Giải pháp**:
```powershell
# Đảm bảo set environment
$env:ASPNETCORE_ENVIRONMENT='Development'
dotnet run --project src/PhuongXa.API
```

### CORS header vẫn không có

**Nguyên nhân**: Backend chưa khởi động xong

**Giải pháp**:
1. Đợi 10-15 giây
2. Kiểm tra backend logs
3. Test lại với curl

### Lỗi "net::ERR_FAILED"

**Nguyên nhân**: Backend không chạy

**Giải pháp**:
```powershell
# Kiểm tra backend
Get-Process -Name "PhuongXa.API"

# Nếu không có, start lại
cd backend/phuongxa-api
dotnet run --project src/PhuongXa.API
```

## Chi Tiết Kỹ Thuật

### CORS Policy trong ChuongTrinh.cs

```csharp
builder.Services.AddCors(opt =>
    opt.AddPolicy("FrontendPolicy", policy =>
        policy.WithOrigins(allowedOrigins.Split(','))
        .AllowAnyHeader()
        .WithMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
        .AllowCredentials()
        .WithExposedHeaders("Content-Disposition")));

// ...

app.UseCors("FrontendPolicy");
```

### Allowed Origins

Development:
- `http://localhost:3000` - Admin
- `http://localhost:3001` - Người dân
- `http://localhost:3002` - Backup
- `http://localhost:5173` - Vite dev

Production:
- Cần cấu hình domain thật trong `appsettings.Production.json`

## Kiểm Tra Sau Khi Fix

1. ✅ Backend đang chạy
2. ✅ Frontend Người Dân đang chạy (port 3001)
3. ✅ Không có lỗi CORS trong Console
4. ✅ API calls thành công
5. ✅ Media/Albums load được

## Files Liên Quan

- `backend/phuongxa-api/src/PhuongXa.API/appsettings.Development.json` - CORS config
- `backend/phuongxa-api/src/PhuongXa.API/ChuongTrinh.cs` - CORS setup
- `frontend/nguoi-dan/.env` - API base URL
- `frontend/nguoi-dan/src/lib/api.ts` - API client

## Kết Luận

Lỗi CORS xảy ra khi:
1. ❌ Backend chưa có origin trong config
2. ❌ Backend chưa restart sau khi update config
3. ❌ Browser cache cũ

Giải pháp:
1. ✅ Đảm bảo config có `localhost:3001`
2. ✅ Restart Backend
3. ✅ Restart Frontend
4. ✅ Hard refresh browser

---

**Trạng thái**: ✅ Đã tạo script fix tự động  
**Script**: `FIX_CORS_NGUOIDAN.ps1`  
**Ngày**: 2026-04-08
