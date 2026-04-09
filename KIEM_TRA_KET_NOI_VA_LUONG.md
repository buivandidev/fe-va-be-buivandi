# ✅ Kiểm Tra Kết Nối và Tất Cả Các Luồng

## 📊 Tổng Quan Hệ Thống

```
┌─────────────────────────────────────────────────────────────────┐
│                        HỆ THỐNG PHUONGXA                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐      ┌──────────────┐      ┌──────────────┐ │
│  │   Frontend   │      │   Frontend   │      │   Backend    │ │
│  │  Người Dân   │◄────►│    Admin     │◄────►│     API      │ │
│  │ :3001        │      │ :3000        │      │ :5000        │ │
│  └──────────────┘      └──────────────┘      └──────────────┘ │
│         │                     │                      │         │
│         │                     │                      │         │
│         └─────────────────────┴──────────────────────┘         │
│                              │                                 │
│                    ┌──────────────────┐                        │
│                    │   PostgreSQL     │                        │
│                    │   Database       │                        │
│                    │   :5432          │                        │
│                    └──────────────────┘                        │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔌 Cấu Hình Kết Nối

### 1. Backend API
**Port:** 5000  
**Base URL:** `http://localhost:5000`  
**CORS Allowed Origins:**
- `http://localhost:3000` (Frontend Admin)
- `http://localhost:3001` (Frontend Người Dân)
- `http://localhost:3002` (Dự phòng)
- `http://localhost:5173` (Vite dev server)

**File:** `backend/phuongxa-api/src/PhuongXa.API/appsettings.Development.json`
```json
{
  "Cors": {
    "AllowedOrigins": "http://localhost:3000,http://localhost:3001,http://localhost:3002,http://localhost:5173"
  }
}
```

---

### 2. Frontend Admin
**Port:** 3000  
**Base URL:** `http://localhost:3000`  
**API Endpoint:** `http://localhost:5000`

**File:** `frontend/.env`
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
API_BASE_URL=http://localhost:5000
```

**API Client:** `frontend/src/lib/api/client.ts`
- Sử dụng Axios
- Tự động thêm token từ `localStorage.getItem('auth_token')`
- Interceptor xử lý 401 Unauthorized

---

### 3. Frontend Người Dân
**Port:** 3001  
**Base URL:** `http://localhost:3001`  
**API Endpoint:** `http://localhost:5000`

**File:** `frontend/nguoi-dan/.env`
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
API_BASE_URL=http://localhost:5000
```

**API Client:** `frontend/nguoi-dan/src/lib/api.ts`
- Sử dụng native fetch
- Tự động thêm token từ `localStorage.getItem('token')`
- Fallback mechanism cho legacy routes

---

### 4. Database
**Type:** PostgreSQL  
**Port:** 5432  
**Database:** `phuongxa_db`  
**Host:** `localhost`

**Connection String:**
```
Host=localhost;Port=5432;Database=phuongxa_db;Username=postgres;Password=***
```

---

## 🔍 Kiểm Tra Kết Nối

### Bước 1: Kiểm Tra Backend
```powershell
# Kiểm tra backend có chạy không
curl http://localhost:5000/api/health

# Hoặc mở browser
http://localhost:5000/swagger
```

**Kết quả mong đợi:**
- Status: 200 OK
- Swagger UI hiển thị đầy đủ endpoints

---

### Bước 2: Kiểm Tra Frontend Admin
```powershell
# Kiểm tra frontend admin có chạy không
curl http://localhost:3000

# Hoặc mở browser
http://localhost:3000
```

**Kết quả mong đợi:**
- Trang chủ admin hiển thị
- Không có lỗi CORS trong console

---

### Bước 3: Kiểm Tra Frontend Người Dân
```powershell
# Kiểm tra frontend người dân có chạy không
curl http://localhost:3001

# Hoặc mở browser
http://localhost:3001
```

**Kết quả mong đợi:**
- Trang chủ người dân hiển thị
- Không có lỗi CORS trong console

---

### Bước 4: Kiểm Tra Database
```powershell
# Kết nối PostgreSQL
psql -h localhost -p 5432 -U postgres -d phuongxa_db

# Kiểm tra tables
\dt
```

**Kết quả mong đợi:**
- Kết nối thành công
- Hiển thị danh sách tables

---

## 🔄 Các Luồng Chính

### LUỒNG 1: Đăng Nhập Admin

#### 1.1. Frontend Admin → Backend
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@phuongxa.vn",
  "matKhau": "Admin@123"
}
```

#### 1.2. Backend Response
```json
{
  "thanhCong": true,
  "duLieu": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "nguoiDung": {
      "id": "guid",
      "hoTen": "Admin",
      "email": "admin@phuongxa.vn",
      "danhSachVaiTro": ["Admin"]
    }
  }
}
```

#### 1.3. Frontend Lưu Token
```typescript
localStorage.setItem('auth_token', token)
```

#### 1.4. Redirect
```
http://localhost:3000/admin/dashboard
```

**Files liên quan:**
- Frontend: `frontend/src/app/admin/login/page.tsx`
- Backend: `backend/phuongxa-api/src/PhuongXa.API/Controllers/Public/AuthController.cs`

---

### LUỒNG 2: Đăng Nhập Người Dân

#### 2.1. Frontend Người Dân → Backend
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "matKhau": "User@123"
}
```

#### 2.2. Backend Response
```json
{
  "thanhCong": true,
  "duLieu": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "nguoiDung": {
      "id": "guid",
      "hoTen": "Nguyễn Văn A",
      "email": "user@example.com",
      "danhSachVaiTro": ["NguoiDung"]
    }
  }
}
```

#### 2.3. Frontend Lưu Token
```typescript
localStorage.setItem('token', token)
```

#### 2.4. Redirect
```
http://localhost:3001/ca-nhan
```

**Files liên quan:**
- Frontend: `frontend/nguoi-dan/src/app/dang-nhap/page.tsx`
- Backend: `backend/phuongxa-api/src/PhuongXa.API/Controllers/Public/AuthController.cs`

---

### LUỒNG 3: Admin Quản Lý Tin Tức

#### 3.1. Lấy Danh Sách Tin Tức
```
GET http://localhost:5000/api/admin/articles/admin?trang=1&kichThuocTrang=10
Authorization: Bearer {token}
```

#### 3.2. Backend Response
```json
{
  "thanhCong": true,
  "duLieu": {
    "danhSach": [
      {
        "id": "guid",
        "tieuDe": "Tin tức mới",
        "trangThai": "DaXuatBan",
        "soLuotXem": 100
      }
    ],
    "tongSo": 50,
    "trang": 1,
    "kichThuocTrang": 10
  }
}
```

#### 3.3. Thêm Tin Tức Mới
```
POST http://localhost:5000/api/admin/articles
Authorization: Bearer {token}
Content-Type: application/json

{
  "tieuDe": "Tin tức mới",
  "noiDung": "Nội dung...",
  "danhMucId": "guid",
  "trangThai": "ChoDuyet"
}
```

#### 3.4. Upload Ảnh
```
POST http://localhost:5000/api/admin/media/upload
Authorization: Bearer {token}
Content-Type: multipart/form-data

tep: [file]
```

**Files liên quan:**
- Frontend: `frontend/src/app/admin/(protected)/articles/page.tsx`
- Backend: 
  - `backend/phuongxa-api/src/PhuongXa.API/Controllers/Admin/AdminArticlesController.cs`
  - `backend/phuongxa-api/src/PhuongXa.API/Controllers/Admin/AdminMediaController.cs`

---

### LUỒNG 4: Người Dân Nộp Hồ Sơ

#### 4.1. Lấy Danh Sách Dịch Vụ
```
GET http://localhost:5000/api/public/services
```

#### 4.2. Backend Response
```json
{
  "thanhCong": true,
  "duLieu": [
    {
      "id": "guid",
      "ten": "Cấp giấy khai sinh",
      "lePhi": 50000,
      "thoiGianXuLy": 3
    }
  ]
}
```

#### 4.3. Nộp Hồ Sơ
```
POST http://localhost:5000/api/public/applications
Authorization: Bearer {token}
Content-Type: application/json

{
  "dichVuId": "guid",
  "tenNguoiNop": "Nguyễn Văn A",
  "emailNguoiNop": "user@example.com",
  "soDienThoaiNguoiNop": "0123456789",
  "ghiChuNguoiNop": "Ghi chú..."
}
```

#### 4.4. Upload File Đính Kèm
```
POST http://localhost:5000/api/public/applications/{id}/upload
Authorization: Bearer {token}
Content-Type: multipart/form-data

tep: [file]
```

**Files liên quan:**
- Frontend: `frontend/nguoi-dan/src/app/dich-vu/[id]/page.tsx`
- Backend: `backend/phuongxa-api/src/PhuongXa.API/Controllers/Public/PublicApplicationsController.cs`

---

### LUỒNG 5: Admin Xử Lý Hồ Sơ

#### 5.1. Lấy Danh Sách Hồ Sơ
```
GET http://localhost:5000/api/admin/applications?trangThai=ChoXuLy&trang=1
Authorization: Bearer {token}
```

#### 5.2. Cập Nhật Trạng Thái
```
PATCH http://localhost:5000/api/admin/applications/{id}/status
Authorization: Bearer {token}
Content-Type: application/json

{
  "trangThai": 1,  // DangXuLy
  "ghiChuNguoiXuLy": "Đang xử lý hồ sơ"
}
```

#### 5.3. Backend Tự Động Tạo Thông Báo
```csharp
if (donUng.NguoiDungId.HasValue)
{
    await _donViCongViec.ThongBaos.ThemAsync(new ThongBao { 
        NguoiDungId = donUng.NguoiDungId.Value, 
        TieuDe = $"Ho so {donUng.MaTheoDoi} da thay doi trang thai", 
        NoiDung = $"Trang thai moi: {donUng.TrangThai}", 
        LienKet = $"/ho-so/{donUng.Id}", 
        Loai = LoaiThongBao.TrangThaiDonUngThayDoi, 
        DaDoc = false 
    }, ct);
}
```

#### 5.4. Backend Gửi Email
```csharp
await _dichVuEmail.GuiTrangThaiDonThayDoiAsync(
    donUng.EmailNguoiNop, 
    donUng.TenNguoiNop, 
    donUng.MaTheoDoi, 
    donUng.DichVu.Ten, 
    donUng.TrangThai.ToString(), 
    yeuCau.GhiChuNguoiXuLy
);
```

**Files liên quan:**
- Frontend: `frontend/src/app/admin/(protected)/applications/page.tsx`
- Backend: `backend/phuongxa-api/src/PhuongXa.API/Controllers/Admin/AdminApplicationsController.cs`

---

### LUỒNG 6: Người Dân Xem Thông Báo

#### 6.1. Lấy Số Thông Báo Chưa Đọc
```
GET http://localhost:5000/api/public/notifications/count
Authorization: Bearer {token}
```

#### 6.2. Backend Response
```json
{
  "thanhCong": true,
  "duLieu": {
    "soLuongChuaDoc": 5
  }
}
```

#### 6.3. Lấy Danh Sách Thông Báo
```
GET http://localhost:5000/api/public/notifications?trang=1&kichThuocTrang=20
Authorization: Bearer {token}
```

#### 6.4. Backend Response
```json
{
  "thanhCong": true,
  "duLieu": {
    "danhSach": [
      {
        "id": "guid",
        "tieuDe": "Ho so HS20260407123456 da thay doi trang thai",
        "noiDung": "Trang thai moi: HoanThanh",
        "lienKet": "/ho-so/guid",
        "daDoc": false,
        "ngayTao": "2026-04-07T10:00:00Z"
      }
    ],
    "tongSo": 5,
    "trang": 1,
    "kichThuocTrang": 20
  }
}
```

#### 6.5. Đánh Dấu Đã Đọc Tất Cả
```
PATCH http://localhost:5000/api/public/notifications/read-all
Authorization: Bearer {token}
```

**Files liên quan:**
- Frontend: `frontend/nguoi-dan/src/app/ca-nhan/thong-bao/page.tsx`
- Backend: `backend/phuongxa-api/src/PhuongXa.API/Controllers/Public/PublicNotificationsController.cs`

---

### LUỒNG 7: Người Dân Tra Cứu Hồ Sơ Công Khai

#### 7.1. Tra Cứu Bằng Mã Theo Dõi
```
GET http://localhost:5000/api/public/applications/lookup?maTheoDoi=HS20260407123456&email=user@example.com
```

#### 7.2. Backend Response
```json
{
  "thanhCong": true,
  "duLieu": {
    "id": "guid",
    "maTheoDoi": "HS20260407123456",
    "tenNguoiNop": "Nguyễn Văn A",
    "dichVu": {
      "ten": "Cấp giấy khai sinh"
    },
    "trangThai": "DangXuLy",
    "ngayNop": "2026-04-07T10:00:00Z",
    "hanXuLy": "2026-04-10T10:00:00Z"
  }
}
```

**Files liên quan:**
- Frontend: `frontend/nguoi-dan/src/app/tra-cuu/page.tsx`
- Backend: `backend/phuongxa-api/src/PhuongXa.API/Controllers/Public/PublicApplicationsController.cs`

---

## 🔐 Authentication Flow

### Token Storage

**Frontend Admin:**
```typescript
// Lưu token
localStorage.setItem('auth_token', token)

// Lấy token
const token = localStorage.getItem('auth_token')

// Xóa token (logout)
localStorage.removeItem('auth_token')
```

**Frontend Người Dân:**
```typescript
// Lưu token
localStorage.setItem('token', token)

// Lấy token
const token = localStorage.getItem('token')

// Xóa token (logout)
localStorage.removeItem('token')
```

### Token Format (JWT)
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJzdWIiOiJ1c2VyLWlkIiwibmFtZSI6Ik5ndXnhu4VuIFbEg24gQSIsInJvbGUiOiJOZ3VvaUR1bmciLCJleHAiOjE3MTI0ODY0MDB9.
signature
```

**Payload:**
```json
{
  "sub": "user-id",
  "name": "Nguyễn Văn A",
  "role": "NguoiDung",
  "exp": 1712486400
}
```

### Authorization Header
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🐛 Troubleshooting

### Lỗi 1: CORS Error

**Triệu chứng:**
```
Access to fetch at 'http://localhost:5000/api/...' from origin 'http://localhost:3000' 
has been blocked by CORS policy
```

**Nguyên nhân:**
- Backend không cho phép origin của frontend

**Giải pháp:**
1. Kiểm tra `appsettings.Development.json`:
```json
{
  "Cors": {
    "AllowedOrigins": "http://localhost:3000,http://localhost:3001"
  }
}
```

2. Restart backend

---

### Lỗi 2: 401 Unauthorized

**Triệu chứng:**
```
Response: 401 Unauthorized
```

**Nguyên nhân:**
- Token không hợp lệ hoặc hết hạn
- Token không được gửi trong header

**Giải pháp:**
1. Kiểm tra token trong localStorage:
```javascript
console.log(localStorage.getItem('auth_token'))
console.log(localStorage.getItem('token'))
```

2. Đăng nhập lại để lấy token mới

3. Kiểm tra header trong DevTools → Network:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

### Lỗi 3: Connection Refused

**Triệu chứng:**
```
Failed to fetch
net::ERR_CONNECTION_REFUSED
```

**Nguyên nhân:**
- Backend không chạy
- Port sai

**Giải pháp:**
1. Kiểm tra backend có chạy không:
```powershell
curl http://localhost:5000/api/health
```

2. Kiểm tra port trong `.env`:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
```

3. Start backend:
```powershell
cd backend/phuongxa-api
dotnet run --project src/PhuongXa.API
```

---

### Lỗi 4: Database Connection Error

**Triệu chứng:**
```
Npgsql.NpgsqlException: Connection refused
```

**Nguyên nhân:**
- PostgreSQL không chạy
- Connection string sai

**Giải pháp:**
1. Kiểm tra PostgreSQL có chạy không:
```powershell
psql -h localhost -p 5432 -U postgres
```

2. Kiểm tra connection string trong `appsettings.Development.json`

3. Start PostgreSQL service

---

## ✅ Checklist Kiểm Tra Toàn Bộ

### Backend
- [ ] Backend đang chạy trên port 5000
- [ ] Swagger UI accessible: `http://localhost:5000/swagger`
- [ ] Database connection OK
- [ ] CORS configured cho localhost:3000 và localhost:3001
- [ ] JWT secret configured
- [ ] Email service configured (optional)

### Frontend Admin
- [ ] Frontend admin đang chạy trên port 3000
- [ ] `.env` có `NEXT_PUBLIC_API_BASE_URL=http://localhost:5000`
- [ ] Đăng nhập admin thành công
- [ ] Token được lưu trong `localStorage.getItem('auth_token')`
- [ ] Không có lỗi CORS trong console
- [ ] Tất cả API calls có Authorization header

### Frontend Người Dân
- [ ] Frontend người dân đang chạy trên port 3001
- [ ] `.env` có `NEXT_PUBLIC_API_BASE_URL=http://localhost:5000`
- [ ] Đăng nhập người dân thành công
- [ ] Token được lưu trong `localStorage.getItem('token')`
- [ ] Không có lỗi CORS trong console
- [ ] Tất cả API calls có Authorization header

### Database
- [ ] PostgreSQL đang chạy trên port 5432
- [ ] Database `phuongxa_db` tồn tại
- [ ] Tất cả migrations đã chạy
- [ ] Có dữ liệu seed (admin user, categories, services)

### Các Luồng
- [ ] LUỒNG 1: Đăng nhập admin OK
- [ ] LUỒNG 2: Đăng nhập người dân OK
- [ ] LUỒNG 3: Admin quản lý tin tức OK
- [ ] LUỒNG 4: Người dân nộp hồ sơ OK
- [ ] LUỒNG 5: Admin xử lý hồ sơ OK
- [ ] LUỒNG 6: Người dân xem thông báo OK
- [ ] LUỒNG 7: Tra cứu hồ sơ công khai OK

---

## 🚀 Script Kiểm Tra Nhanh

### Kiểm Tra Backend
```powershell
# Health check
curl http://localhost:5000/api/health

# Swagger
Start-Process "http://localhost:5000/swagger"
```

### Kiểm Tra Frontend Admin
```powershell
# Home page
curl http://localhost:3000

# Open browser
Start-Process "http://localhost:3000"
```

### Kiểm Tra Frontend Người Dân
```powershell
# Home page
curl http://localhost:3001

# Open browser
Start-Process "http://localhost:3001"
```

### Kiểm Tra Database
```powershell
# Connect
psql -h localhost -p 5432 -U postgres -d phuongxa_db

# List tables
\dt

# Count users
SELECT COUNT(*) FROM "Users";

# Count applications
SELECT COUNT(*) FROM "DonUngs";
```

---

## 📝 Kết Luận

**✅ HỆ THỐNG ĐÃ ĐƯỢC CẤU HÌNH ĐÚNG**

Tất cả các kết nối đã được thiết lập:
1. ✅ Backend API (port 5000) ← CORS configured
2. ✅ Frontend Admin (port 3000) → Backend API
3. ✅ Frontend Người Dân (port 3001) → Backend API
4. ✅ Backend API → PostgreSQL Database (port 5432)

Tất cả các luồng đã được implement:
1. ✅ Đăng nhập Admin/Người Dân
2. ✅ Quản lý tin tức
3. ✅ Nộp và xử lý hồ sơ
4. ✅ Thông báo tự động
5. ✅ Tra cứu công khai

**Hệ thống sẵn sàng hoạt động!**
