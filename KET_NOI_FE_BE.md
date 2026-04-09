# 🔗 Hướng Dẫn Kết Nối Frontend - Backend

## 📋 Tổng Quan Cấu Hình

### Backend (ASP.NET Core)
- **Port:** `5187` (HTTP), `7067` (HTTPS)
- **Base URL:** `http://localhost:5187`
- **API Prefix:** `/api`
- **CORS Allowed Origins:** `localhost:3000`, `3001`, `3002`, `5173`

### Frontend (Next.js)
- **Port:** `3000` (mặc định)
- **API Base URL:** `http://localhost:5187/api`
- **Config File:** `frontend/.env`

---

## ✅ Đã Sửa

### 1. **File `frontend/.env`** (ĐÃ CẬP NHẬT)
```env
NEXT_PUBLIC_BASE_URL=http://localhost:5187
API_BASE_URL=http://localhost:5187
NEXT_PUBLIC_API_BASE_URL=http://localhost:5187/api
```

### 2. **CORS Backend** (ĐÃ CẤU HÌNH)
- Cho phép: `localhost:3000,3001,3002,5173`
- Methods: `GET, POST, PUT, DELETE, PATCH, OPTIONS`
- Headers: `Content-Type, Authorization`
- Credentials: `Enabled`

### 3. **API Routes Backend**
Tất cả API endpoints đều có prefix `/api`:

#### Public APIs (không cần auth):
- `/api/auth` - Đăng nhập, đăng ký
- `/api/public/articles` - Bài viết công khai
- `/api/public/services` - Dịch vụ công khai
- `/api/public/media` - Media công khai
- `/api/public/search` - Tìm kiếm
- `/api/public/contact` - Liên hệ
- `/api/public/comments` - Bình luận

#### Admin APIs (cần auth):
- `/api/admin/users` - Quản lý người dùng
- `/api/admin/articles` - Quản lý bài viết
- `/api/admin/services` - Quản lý dịch vụ
- `/api/admin/dashboard` - Dashboard
- `/api/admin/settings` - Cài đặt

---

## 🚀 Cách Chạy

### 1. Chạy Backend
```bash
cd backend\phuongxa-api\src\PhuongXa.API
dotnet run
```
✅ Backend sẽ chạy tại: `http://localhost:5187`

### 2. Chạy Frontend
```bash
cd frontend
npm install    # Nếu chưa cài đặt dependencies
npm run dev
```
✅ Frontend sẽ chạy tại: `http://localhost:3000`

### 3. Kiểm Tra Kết Nối
```bash
# Từ thư mục gốc
node test-connection.js
```

---

## 🧪 Test API Endpoints

### Test Backend trực tiếp:
```bash
# Lấy danh sách bài viết công khai
curl http://localhost:5187/api/public/articles

# Kiểm tra health
curl http://localhost:5187/api/public/services
```

### Test từ Frontend:
1. Mở trình duyệt: `http://localhost:3000`
2. Mở DevTools > Network tab
3. Kiểm tra các request có gọi đúng `http://localhost:5187/api/...`

---

## 🔧 Cấu Hình Chi Tiết

### Frontend API Client (`src/lib/api/client.ts`)
```typescript
// Tự động sử dụng URL từ .env
baseURL: env.publicApiBaseUrl  // http://localhost:5187/api
withCredentials: true           // Gửi cookies
timeout: 15000                  // 15 giây
```

### Backend CORS (`ChuongTrinh.cs`)
```csharp
builder.Services.AddCors(opt =>
    opt.AddPolicy("FrontendPolicy", policy =>
        policy.WithOrigins("http://localhost:3000", ...)
              .WithHeaders("Content-Type", "Authorization")
              .WithMethods("GET", "POST", "PUT", "DELETE", ...)
              .AllowCredentials()));
```

---

## ⚠️ Lưu Ý Quan Trọng

1. **Database**: Đảm bảo PostgreSQL đang chạy tại `localhost:5432`
   - Database: `phuongxa_db`
   - User: `postgres`

2. **CORS**: Frontend phải chạy trên port `3000` (hoặc các port được cho phép)

3. **Cookie Auth**: 
   - `withCredentials: true` ở Frontend
   - `.AllowCredentials()` ở Backend

4. **HTTPS (Production)**:
   - Backend có thể chạy HTTPS: `https://localhost:7067`
   - Cập nhật `.env` nếu dùng HTTPS

---

## 🐛 Troubleshooting

### Lỗi CORS
```
Access to fetch at 'http://localhost:5187/api/...' from origin 
'http://localhost:3000' has been blocked by CORS policy
```
**Giải pháp**: Kiểm tra Backend đã chạy và CORS đã được cấu hình

### Lỗi Network/Connection Refused
```
Failed to fetch / net::ERR_CONNECTION_REFUSED
```
**Giải pháp**: Backend chưa chạy hoặc sai port

### Lỗi 401 Unauthorized
```
Response status 401
```
**Giải pháp**: Cần đăng nhập hoặc token hết hạn

---

## 📞 Hỗ Trợ

- Kiểm tra logs Backend: Console khi chạy `dotnet run`
- Kiểm tra logs Frontend: Browser DevTools > Console
- Test API: Sử dụng Postman hoặc cURL

✅ **HOÀN TẤT!** Frontend và Backend đã được cấu hình kết nối đúng.
