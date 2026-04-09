# Fix Quản Lý Tin Tức - Thêm/Xóa/Sửa Không Hoạt Động

## 🐛 Vấn Đề

### 1. Admin: Không thêm/xóa/sửa được tin tức
- Trang hiển thị "Không có dữ liệu"
- Không load được danh sách tin tức

### 2. Frontend Người Dân: Không hiển thị tin tức
- Trang tin tức trống
- Hoặc chỉ hiển thị dữ liệu fallback (mẫu)

## 🔍 Nguyên Nhân

### Backend API Chưa Sẵn Sàng
Backend có thể:
1. Chưa khởi động (port 5000 không hoạt động)
2. Database chưa có dữ liệu
3. API endpoints trả về lỗi

### API Endpoints Khác Nhau
- **Admin:** `/api/admin/articles/admin`
- **Public:** `/api/articles`

## ✅ Cách Kiểm Tra

### 1. Kiểm Tra Backend Đang Chạy

```powershell
# Chạy script kiểm tra
.\CHECK_SERVERS_STATUS.ps1
```

**Kỳ vọng:**
```
✅ Port 5000 (Backend API): ĐANG HOẠT ĐỘNG
```

**Nếu không hoạt động:**
```powershell
# Khởi động backend
cd backend\phuongxa-api\src\PhuongXa.API
dotnet run
```

### 2. Test API Trực Tiếp

Mở browser và test các endpoints:

#### Test Admin API:
```
http://localhost:5000/api/admin/articles/admin?trang=1&kichThuocTrang=10
```

**Kỳ vọng:** JSON với danh sách bài viết
```json
{
  "thanhCong": true,
  "duLieu": {
    "danhSach": [...],
    "tongSo": 10
  }
}
```

#### Test Public API:
```
http://localhost:5000/api/articles?trang=1&kichThuocTrang=10
```

**Kỳ vọng:** JSON với danh sách bài viết công khai

#### Test Swagger UI:
```
http://localhost:5000/swagger
```

Tìm endpoints:
- `GET /api/admin/articles/admin` - Lấy danh sách (admin)
- `POST /api/admin/articles` - Tạo mới
- `PUT /api/admin/articles/{id}` - Cập nhật
- `DELETE /api/admin/articles/{id}` - Xóa
- `GET /api/articles` - Lấy danh sách (public)

### 3. Kiểm Tra Database

```sql
-- Kiểm tra có bài viết không
SELECT COUNT(*) FROM BaiViet;

-- Xem danh sách bài viết
SELECT TOP 10 
  Id, TieuDe, TrangThai, NgayTao 
FROM BaiViet 
ORDER BY NgayTao DESC;

-- Kiểm tra danh mục
SELECT * FROM DanhMuc WHERE Loai = 0; -- 0 = Tin tức
```

**Nếu không có dữ liệu:**
- Cần tạo danh mục trước
- Sau đó tạo bài viết

## 🔧 Cách Fix

### Fix 1: Khởi Động Backend

```powershell
# Dừng tất cả
.\STOP_ALL_SERVERS.ps1

# Khởi động lại
.\RESTART_ALL_CLEAN.ps1

# Đợi 20-30 giây cho backend build
Start-Sleep -Seconds 30

# Kiểm tra
.\CHECK_SERVERS_STATUS.ps1
```

### Fix 2: Tạo Danh Mục Mẫu (Nếu Chưa Có)

```sql
-- Tạo danh mục tin tức
INSERT INTO DanhMuc (Id, Ten, DuongDan, Loai, DangHoatDong, NgayTao)
VALUES 
  (NEWID(), N'Tin tức', 'tin-tuc', 0, 1, GETDATE()),
  (NEWID(), N'Thông báo', 'thong-bao', 0, 1, GETDATE()),
  (NEWID(), N'Sự kiện', 'su-kien', 0, 1, GETDATE());
```

### Fix 3: Tạo Bài Viết Mẫu (Test)

Vào admin: http://localhost:3000/admin/articles

1. Click "Thêm tin tức"
2. Nhập thông tin:
   - Tiêu đề: "Bài viết test"
   - Tóm tắt: "Đây là bài viết test"
   - Nội dung: "<p>Nội dung test</p>"
   - Danh mục: Chọn danh mục
   - Trạng thái: "Đã xuất bản"
3. Click "Thêm mới"

**Nếu lỗi:**
- Mở DevTools (F12) → Console
- Xem lỗi API
- Mở Network tab → Xem request/response

### Fix 4: Debug Frontend Admin

Mở http://localhost:3000/admin/articles

**Mở DevTools (F12) → Console, tìm:**
```
🔍 Loading articles...
✅ Articles loaded: {...}
```

**Nếu thấy lỗi:**
```
❌ Error loading articles: ...
```

→ Copy lỗi và kiểm tra:
- Backend có chạy không?
- API endpoint đúng không?
- Token hợp lệ không?

### Fix 5: Debug Frontend Người Dân

Mở http://localhost:3001/tin-tuc

**Kiểm tra:**
- Có hiển thị "Không kết nối được API" không?
- Có hiển thị dữ liệu fallback (mẫu) không?

**Nếu có warning:**
```
⚠️ Không kết nối được API, đang hiển thị dữ liệu mẫu.
```

→ Backend chưa sẵn sàng hoặc API lỗi

## 📊 Flow Hoạt Động

### Admin - Thêm Tin Tức:
```
1. User click "Thêm tin tức"
2. Mở modal form
3. User nhập thông tin
4. Click "Thêm mới"
5. Frontend gọi: POST /api/admin/articles
6. Backend lưu vào database
7. Frontend reload danh sách
8. Hiển thị tin tức mới
```

### Public - Xem Tin Tức:
```
1. User vào /tin-tuc
2. Frontend gọi: GET /api/articles
3. Backend trả về danh sách (chỉ bài đã xuất bản)
4. Frontend hiển thị
```

## 🧪 Test Checklist

### Backend:
- [ ] Port 5000 đang hoạt động
- [ ] Swagger UI mở được: http://localhost:5000/swagger
- [ ] API `/api/admin/articles/admin` trả về 200
- [ ] API `/api/articles` trả về 200
- [ ] Database có danh mục tin tức
- [ ] Database có bài viết (hoặc có thể tạo mới)

### Admin Frontend:
- [ ] Trang mở được: http://localhost:3000/admin/articles
- [ ] Hiển thị danh sách tin tức (hoặc "Không có dữ liệu")
- [ ] Click "Thêm tin tức" → Modal mở
- [ ] Nhập thông tin → Click "Thêm mới" → Thành công
- [ ] Bài viết mới xuất hiện trong danh sách
- [ ] Click "Sửa" → Modal mở với dữ liệu
- [ ] Sửa thông tin → Click "Cập nhật" → Thành công
- [ ] Click "Xóa" → Confirm → Bài viết biến mất

### Public Frontend:
- [ ] Trang mở được: http://localhost:3001/tin-tuc
- [ ] Hiển thị danh sách tin tức (không phải fallback)
- [ ] Click vào bài viết → Xem chi tiết
- [ ] Breadcrumb hoạt động
- [ ] Filter theo danh mục hoạt động
- [ ] Search hoạt động
- [ ] Pagination hoạt động

## 🚨 Lỗi Thường Gặp

### 1. "Không có dữ liệu" trong Admin

**Nguyên nhân:**
- Backend chưa chạy
- API trả về lỗi 401 (Unauthorized)
- Database trống

**Fix:**
```powershell
# Kiểm tra backend
.\CHECK_SERVERS_STATUS.ps1

# Nếu backend chưa chạy
cd backend\phuongxa-api\src\PhuongXa.API
dotnet run
```

### 2. "Không kết nối được API" trong Public

**Nguyên nhân:**
- Backend chưa chạy
- API endpoint sai
- CORS issue

**Fix:**
- Đảm bảo backend đang chạy
- Check `.env` file có `NEXT_PUBLIC_API_BASE_URL=http://localhost:5000`

### 3. Thêm mới thành công nhưng không hiển thị

**Nguyên nhân:**
- Trạng thái = "Nháp" (chỉ admin thấy)
- Cache frontend

**Fix:**
- Đảm bảo trạng thái = "Đã xuất bản"
- Refresh trang (F5)

### 4. Upload ảnh lỗi

**Nguyên nhân:**
- File quá lớn (>5MB)
- API media lỗi

**Fix:**
- Resize ảnh < 5MB
- Hoặc dùng URL ảnh thay vì upload

## 💡 Tips

### Xem Logs Backend:
```powershell
# Backend logs hiển thị trong cửa sổ PowerShell
# Tìm các dòng:
# - [INF] Request starting...
# - [ERR] Error...
```

### Xem Logs Frontend:
```
# Mở DevTools (F12) → Console
# Tìm các dòng:
# - 🔍 Loading articles...
# - ✅ Articles loaded
# - ❌ Error loading articles
```

### Test API với Postman/Thunder Client:
```
GET http://localhost:5000/api/articles
Headers:
  Accept: application/json

POST http://localhost:5000/api/admin/articles
Headers:
  Authorization: Bearer <token>
  Content-Type: application/json
Body:
{
  "tieuDe": "Test",
  "noiDung": "<p>Test</p>",
  "danhMucId": "<guid>",
  "trangThai": "DaXuatBan"
}
```

## 📝 Tóm Tắt

**Vấn đề chính:** Backend chưa sẵn sàng hoặc database trống

**Giải pháp:**
1. ✅ Khởi động backend
2. ✅ Tạo danh mục tin tức
3. ✅ Test API với Swagger
4. ✅ Tạo bài viết mẫu trong admin
5. ✅ Kiểm tra hiển thị ở public

**Nếu vẫn lỗi:**
- Share console logs (F12)
- Share backend logs
- Share screenshot lỗi

---

**Lưu ý:** Luôn kiểm tra backend trước khi test frontend!
