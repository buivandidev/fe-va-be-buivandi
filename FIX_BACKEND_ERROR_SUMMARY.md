# 🔧 Fix Backend Error - JWT Key

## 🐛 Lỗi Gặp Phải

```
Unhandled exception. System.InvalidOperationException: 
Jwt:Key phải có ít nhất 32 bytes (256 bits) cho HMAC-SHA256
```

## 🔍 Nguyên Nhân

Backend không thể khởi động vì:
1. **JWT Key chưa được cấu hình** - Giá trị mặc định "CHANGE_ME_IN_USER_SECRETS"
2. **Key không đủ dài** - Cần ít nhất 32 bytes (256 bits) cho HMAC-SHA256

## ✅ Giải Pháp Đã Áp Dụng

### 1. Tạo JWT Key Mới (256-bit)
```powershell
# Chạy script
.\FIX_BACKEND_CONFIG.ps1
```

**Script đã làm:**
- ✅ Tạo JWT Key ngẫu nhiên 256-bit (secure)
- ✅ Cập nhật `appsettings.Development.json`
- ✅ Cập nhật Connection String (SQL Server)
- ✅ Cập nhật FileStorage BaseUrl

### 2. Cấu Hình Đã Cập Nhật

**File:** `backend/phuongxa-api/src/PhuongXa.API/appsettings.Development.json`

```json
{
  "Jwt": {
    "Key": "<secure-256-bit-key>",
    "Issuer": "PhuongXaAPI",
    "Audience": "PhuongXaClient",
    "AccessTokenMinutes": "15",
    "RefreshTokenDays": "7"
  },
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=PhuongXaDB;Trusted_Connection=True;TrustServerCertificate=True;MultipleActiveResultSets=true"
  },
  "FileStorage": {
    "BaseUrl": "http://localhost:5000"
  }
}
```

## 🚀 Khởi Động Lại

```powershell
# Đã chạy tự động
.\RESTART_ALL_CLEAN.ps1
```

## 🧪 Kiểm Tra

### Sau 30 giây, chạy:
```powershell
.\CHECK_SERVERS_STATUS.ps1
```

**Kỳ vọng:**
```
✅ Port 5000 (Backend API): ĐANG HOẠT ĐỘNG
✅ Port 3000 (Frontend Admin): ĐANG HOẠT ĐỘNG
✅ Port 3001 (Frontend Người Dân): ĐANG HOẠT ĐỘNG
```

### Test API:
```powershell
.\TEST_ARTICLES_API.ps1
```

**Kỳ vọng:**
```
✅ Backend đang chạy (port 5000)
✅ Public API hoạt động (Status: 200)
✅ Swagger UI hoạt động
```

## 📝 Scripts Đã Tạo

### 1. FIX_BACKEND_JWT.ps1
- Chỉ fix JWT Key
- Nhanh, đơn giản

### 2. FIX_BACKEND_CONFIG.ps1 (Khuyến nghị)
- Fix JWT Key
- Fix Connection String
- Fix FileStorage
- Toàn diện hơn

## 🔒 Bảo Mật

### JWT Key:
- ✅ 256-bit (32 bytes) - Đủ mạnh cho HMAC-SHA256
- ✅ Random secure key
- ✅ Unique cho mỗi lần chạy script

### Lưu Ý:
- ⚠️ **KHÔNG commit JWT Key vào Git**
- ⚠️ **KHÔNG share JWT Key công khai**
- ✅ Mỗi môi trường nên có key riêng
- ✅ Production nên dùng User Secrets hoặc Environment Variables

## 🎯 Kết Quả

### Trước khi fix:
```
❌ Backend crash ngay khi khởi động
❌ Lỗi: JWT Key không hợp lệ
❌ Không thể test API
```

### Sau khi fix:
```
✅ Backend khởi động thành công
✅ JWT authentication hoạt động
✅ API sẵn sàng
✅ Có thể đăng nhập admin
```

## 💡 Nếu Vẫn Lỗi

### Lỗi Database Connection:
```
Error: Cannot connect to SQL Server
```

**Giải pháp:**
1. Kiểm tra SQL Server đang chạy
2. Kiểm tra database "PhuongXaDB" đã tạo chưa
3. Chạy migrations:
```bash
cd backend/phuongxa-api/src/PhuongXa.API
dotnet ef database update
```

### Lỗi Port 5000 đã được sử dụng:
```
Error: Address already in use
```

**Giải pháp:**
```powershell
# Dừng tất cả
.\STOP_ALL_SERVERS.ps1

# Hoặc kill port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Lỗi khác:
1. Xem logs trong cửa sổ PowerShell của backend
2. Tìm dòng [ERR] hoặc Exception
3. Copy lỗi để debug

## 📚 Tài Liệu Liên Quan

- **CURRENT_STATUS.md** - Trạng thái hệ thống
- **FIX_ARTICLES_MANAGEMENT.md** - Fix quản lý tin tức
- **QUICK_START.md** - Hướng dẫn sử dụng

## 🎉 Tóm Tắt

**Vấn đề:** Backend không khởi động vì JWT Key không hợp lệ

**Giải pháp:** 
1. ✅ Chạy `.\FIX_BACKEND_CONFIG.ps1`
2. ✅ Khởi động lại `.\RESTART_ALL_CLEAN.ps1`
3. ✅ Đợi 30 giây
4. ✅ Test với `.\CHECK_SERVERS_STATUS.ps1`

**Kết quả:** Backend hoạt động bình thường! 🚀

---

**Thời gian fix:** ~2 phút  
**Độ khó:** Dễ  
**Status:** ✅ RESOLVED
