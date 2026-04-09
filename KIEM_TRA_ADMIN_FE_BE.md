# 🔐 Kiểm Tra Kết Nối Frontend Admin - Backend

## 📊 TỔNG QUAN CẤU HÌNH

### ✅ **Frontend Admin** 
**Location:** `frontend/src/app/admin`

**Pages:**
- `/admin/login` - Trang đăng nhập
- `/admin/dashboard` - Bảng điều khiển
- `/admin/articles` - Quản lý bài viết
- `/admin/services` - Quản lý dịch vụ
- `/admin/applications` - Quản lý đơn
- `/admin/comments` - Quản lý bình luận
- `/admin/users` - Quản lý người dùng

### ✅ **Backend API Endpoints**
**Base URL:** `http://localhost:5187`

**Auth Routes:**
- `POST /api/auth/login` - Đăng nhập (Public)
- `POST /api/auth/register` - Đăng ký
- `GET /api/auth/me` - Lấy thông tin user hiện tại
- `POST /api/auth/refresh` - Refresh token

**Admin Routes:**
- `GET /api/admin/dashboard` - Dashboard
- `GET /api/admin/users` - Quản lý users
- `GET /api/admin/articles` - Quản lý articles
- `GET /api/admin/services` - Quản lý services
- `GET /api/admin/applications` - Quản lý applications
- `GET /api/admin/comments` - Quản lý comments

---

## 🔄 LUỒNG AUTHENTICATION

### 1. **Login Flow**

```
User nhập email/password
    ↓
Frontend: POST /api/admin/login (Next.js API route)
    ↓
Frontend API route: POST http://localhost:5187/api/auth/login
    ↓
Backend xác thực → trả về JWT token
    ↓
Frontend lưu token vào cookie "auth_token"
    ↓
Redirect → /admin/dashboard
```

**Frontend Login Code:**
```typescript
// frontend/src/app/admin/login/page.tsx
const response = await fetch('/api/admin/login', {
  method: 'POST',
  body: JSON.stringify({ email, matKhau: password })
})
```

**Frontend API Proxy:**
```typescript
// frontend/src/app/api/admin/login/route.ts
const response = await fetch(`${env.apiBaseUrl}/api/auth/login`, {
  method: 'POST',
  body: JSON.stringify(body)
})
// Lưu token vào cookie
res.cookies.set('auth_token', token, cookieOptions)
```

**Backend Endpoint:**
```
POST /api/auth/login
Body: { email: string, matKhau: string }
Response: { thanhCong: true, duLieu: { maTruyCap: "JWT...", nguoiDung: {...} } }
```

### 2. **Protected Pages Flow**

```
User truy cập /admin/dashboard
    ↓
Server Component gọi getSession()
    ↓
getSession() đọc cookie "auth_token"
    ↓
Gọi Backend: GET /api/auth/me (với Bearer token)
    ↓
Backend verify token → trả về user info
    ↓
Nếu hợp lệ: Render page
Nếu không: Redirect → /admin/login
```

---

## ⚙️ CẤU HÌNH QUAN TRỌNG

### 1. **Frontend Environment** (`frontend/.env`)
```env
NEXT_PUBLIC_BASE_URL=http://localhost:5187
API_BASE_URL=http://localhost:5187
NEXT_PUBLIC_API_BASE_URL=http://localhost:5187/api
```

✅ **ĐÃ CẬP NHẬT ĐÚNG**

### 2. **Backend CORS** (`appsettings.json`)
```json
{
  "Cors": {
    "AllowedOrigins": "http://localhost:3000,http://localhost:3001,http://localhost:3002,http://localhost:5173"
  }
}
```

✅ **ĐÃ CHO PHÉP localhost:3000**

### 3. **Cookie Settings**
```typescript
// frontend/src/lib/auth/cookies.ts
export const AUTH_COOKIE_NAME = 'auth_token'
export const AUTH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 60 * 60 * 24 * 7, // 7 days
  path: '/'
}
```

---

## 🧪 KIỂM TRA KẾT NỐI

### **Test 1: Backend Auth API**
```bash
# Test đăng nhập
curl -X POST http://localhost:5187/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "matKhau": "Admin@123456!Secure"
  }'
```

**Kết quả mong đợi:**
```json
{
  "thanhCong": true,
  "duLieu": {
    "maTruyCap": "eyJhbGciOiJIUzI1NiIs...",
    "nguoiDung": {
      "id": "...",
      "email": "admin@example.com",
      "hoTen": "Admin",
      "danhSachVaiTro": ["Admin"]
    }
  }
}
```

### **Test 2: Verify Token**
```bash
# Lấy token từ response trên, test /me endpoint
curl http://localhost:5187/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Kết quả mong đợi:**
```json
{
  "thanhCong": true,
  "duLieu": {
    "id": "...",
    "email": "admin@example.com",
    "hoTen": "Admin",
    "danhSachVaiTro": ["Admin"]
  }
}
```

### **Test 3: Frontend Login UI**
1. Chạy Frontend: `cd frontend && npm run dev`
2. Mở: `http://localhost:3000/admin/login`
3. Nhập:
   - Email: `admin@example.com`
   - Password: `Admin@123456!Secure`
4. Click "Đăng nhập"
5. Kiểm tra:
   - Có redirect về `/admin/dashboard` không?
   - Dashboard hiển thị tên user không?

### **Test 4: Check Cookie**
Sau khi đăng nhập thành công:
1. Mở DevTools (F12)
2. Tab **Application** > **Cookies** > `http://localhost:3000`
3. Tìm cookie `auth_token`
4. Value phải là JWT token (dạng `eyJhbGciOiJ...`)

---

## 🐛 TROUBLESHOOTING

### **Lỗi 1: "Không thể kết nối máy chủ xác thực"**
**Nguyên nhân:** Backend chưa chạy hoặc sai URL

**Fix:**
```bash
# Kiểm tra backend đang chạy
cd backend\phuongxa-api\src\PhuongXa.API
dotnet run

# Kiểm tra port 5187
curl http://localhost:5187/api/auth/login
```

### **Lỗi 2: CORS Error**
```
Access to fetch at 'http://localhost:5187/api/auth/login' from origin 
'http://localhost:3000' has been blocked by CORS policy
```

**Fix:** Kiểm tra `appsettings.json`:
```json
{
  "Cors": {
    "AllowedOrigins": "http://localhost:3000,..."
  }
}
```

### **Lỗi 3: "Đăng nhập thất bại" dù nhập đúng**
**Nguyên nhân:** Chưa seed admin user

**Fix:**
```bash
# Kiểm tra database có admin user chưa
# Hoặc chạy seeder nếu có
```

### **Lỗi 4: Cookie không được set**
**Nguyên nhân:** 
- `httpOnly` cookie không hiển thị trong JS
- Cookie `secure` flag trong development

**Check:** Xem trong DevTools > Application > Cookies

---

## 📋 CHECKLIST

- [x] ✅ Frontend `.env` đã cấu hình đúng URL backend
- [x] ✅ Backend CORS cho phép `localhost:3000`
- [x] ✅ Auth flow: Login → Cookie → Protected pages
- [x] ✅ API proxy routes tại `/api/admin/login`
- [x] ✅ Session management với `getSession()`
- [ ] ⚠️ **BẠN CẦN:** Chạy Backend tại port 5187
- [ ] ⚠️ **BẠN CẦN:** Seed admin user vào database
- [ ] ⚠️ **BẠN CẦN:** Test login flow hoàn chỉnh

---

## 🚀 CÁCH CHẠY ĐẦY ĐỦ

```bash
# Terminal 1: Backend
cd backend\phuongxa-api\src\PhuongXa.API
dotnet run
# ✅ Đợi: "Now listening on: http://localhost:5187"

# Terminal 2: Frontend
cd frontend
npm run dev
# ✅ Đợi: "Local: http://localhost:3000"

# Terminal 3: Test
curl http://localhost:5187/api/auth/login -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","matKhau":"Admin@123456!Secure"}'
```

**Sau đó:**
1. Mở browser: `http://localhost:3000/admin/login`
2. Login với credentials
3. Kiểm tra redirect về dashboard

---

## 🎯 KẾT LUẬN

### ✅ **Đã Cấu Hình Tốt:**
- Frontend-Backend URL mapping
- CORS settings
- Cookie-based authentication
- Protected routes với middleware
- Session management

### ⚠️ **Cần Kiểm Tra:**
1. Backend có đang chạy không?
2. Database có admin user chưa?
3. Login flow có hoạt động không?

### 📝 **Credentials Mặc Định:**
```
Email: admin@example.com
Password: Admin@123456!Secure
```
(Theo `appsettings.Development.json`)

---

**Nếu cần debug thêm, hãy gửi cho tôi:**
- Screenshot DevTools > Network tab khi login
- Backend console logs
- Browser console errors
