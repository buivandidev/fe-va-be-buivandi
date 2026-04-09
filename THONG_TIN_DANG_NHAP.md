# 🔐 Thông tin đăng nhập hệ thống

## Tài khoản Admin

### Môi trường Development (Local)

**URL đăng nhập Admin:**
```
http://localhost:3000/admin/login
```

**Thông tin đăng nhập:**
- **Email:** `admin@phuongxa.vn`
- **Mật khẩu:** `Admin@123`
- **Vai trò:** Admin (full quyền)

---

### Môi trường Production

**URL đăng nhập Admin:**
```
https://admin.your-domain.com/admin/login
```

**Thông tin đăng nhập:**
- **Email:** `admin@phuongxa.vn`
- **Mật khẩu:** Được cấu hình trong biến môi trường `DefaultAdmin:Password`

⚠️ **LƯU Ý:** Trong production, mật khẩu phải được đặt qua user-secrets hoặc biến môi trường, KHÔNG để trong file config!

---

## Tài khoản Người dùng (Người dân)

**URL đăng nhập Người dân:**
```
http://localhost:3001/dang-nhap
```

**Tạo tài khoản mới:**
- Người dân có thể tự đăng ký tài khoản
- Hoặc admin tạo tài khoản cho họ trong trang quản lý người dùng

---

## Reset mật khẩu Admin

Nếu quên mật khẩu admin, có 2 cách:

### Cách 1: Restart Backend (Development)
Backend sẽ tự động reset mật khẩu admin về `Admin@123` khi khởi động trong môi trường Development.

```powershell
cd backend\phuongxa-api\src\PhuongXa.API
dotnet run
```

### Cách 2: Thay đổi mật khẩu trong Database
```sql
-- Kết nối PostgreSQL
psql -U postgres -d PhuongXaDB

-- Xem user admin
SELECT "Id", "Email", "HoTen" FROM "AspNetUsers" WHERE "Email" = 'admin@phuongxa.vn';

-- Reset password (cần dùng tool hash password)
```

### Cách 3: Sử dụng User Secrets (Khuyến nghị cho Production)
```powershell
cd backend\phuongxa-api\src\PhuongXa.API
dotnet user-secrets set "DefaultAdmin:Password" "MatKhauMoi@123"
dotnet run
```

---

## Các vai trò trong hệ thống

1. **Admin** - Quản trị viên
   - Full quyền truy cập
   - Quản lý người dùng, nội dung, dịch vụ
   - Xem nhật ký hệ thống

2. **Editor** (BienTap) - Biên tập viên
   - Quản lý tin tức, bài viết
   - Quản lý thư viện media
   - Duyệt bình luận

3. **Viewer** - Người xem
   - Chỉ xem, không chỉnh sửa

4. **User** (NguoiDan) - Người dân
   - Xem thông tin công khai
   - Nộp hồ sơ trực tuyến
   - Theo dõi trạng thái hồ sơ

---

## Kiểm tra đăng nhập

### Test Admin Login:
```powershell
# Mở trình duyệt
start http://localhost:3000/admin/login

# Hoặc dùng curl
curl -X POST http://localhost:5000/api/admin/login `
  -H "Content-Type: application/json" `
  -d '{"email":"admin@phuongxa.vn","password":"Admin@123"}'
```

### Test Người dân Login:
```powershell
# Mở trình duyệt
start http://localhost:3001/dang-nhap
```

---

## Troubleshooting

### Lỗi: "Email hoặc mật khẩu không đúng"
1. Kiểm tra backend có đang chạy không
2. Kiểm tra database có dữ liệu không
3. Restart backend để seed lại dữ liệu
4. Kiểm tra JWT key có khớp giữa frontend và backend không

### Lỗi: "Token không hợp lệ"
1. Xóa localStorage: `localStorage.clear()`
2. Đăng nhập lại
3. Kiểm tra JWT key trong appsettings.json

### Lỗi: "Không có quyền truy cập"
1. Kiểm tra role của user
2. Đảm bảo user có role "Admin" hoặc "BienTap"
3. Kiểm tra trong database:
```sql
SELECT u."Email", r."Name" 
FROM "AspNetUsers" u
JOIN "AspNetUserRoles" ur ON u."Id" = ur."UserId"
JOIN "AspNetRoles" r ON ur."RoleId" = r."Id"
WHERE u."Email" = 'admin@phuongxa.vn';
```

---

## Bảo mật

⚠️ **QUAN TRỌNG:**

1. **KHÔNG** commit mật khẩu vào Git
2. **LUÔN** thay đổi mật khẩu mặc định trong production
3. **SỬ DỤNG** user-secrets hoặc biến môi trường cho production
4. **BẬT** HTTPS trong production
5. **GIỚI HẠN** số lần đăng nhập sai
6. **SỬ DỤNG** mật khẩu mạnh (ít nhất 8 ký tự, có chữ hoa, chữ thường, số, ký tự đặc biệt)

---

## Liên hệ

Nếu có vấn đề về đăng nhập, liên hệ:
- Email: admin@phuongxa.vn
- Hoặc tạo issue trong repository
