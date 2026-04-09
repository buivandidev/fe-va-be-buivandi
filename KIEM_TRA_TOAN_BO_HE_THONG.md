# Checklist Kiểm Tra Toàn Bộ Hệ Thống

## ✅ Đã kiểm tra và sửa

### 1. Đăng nhập & Đăng ký
- ✅ **Frontend Người Dân - Đăng nhập** (`/dang-nhap`)
  - Endpoint: `/api/auth/login`
  - Token lưu vào localStorage
  - Không có lỗi nghiêm trọng
  
- ✅ **Frontend Người Dân - Đăng ký** (`/dang-ky`)
  - Endpoint: `/api/auth/register`
  - Validate mật khẩu và điều khoản
  - Không có lỗi

- ✅ **Frontend Admin - Đăng nhập** (`/admin/login`)
  - Endpoint: `/api/admin/login` (Next.js API route)
  - Proxy đến backend `/api/auth/login`
  - Token lưu vào localStorage và cookie
  - Không có lỗi

### 2. Upload Media (Ảnh & Video)
- ✅ **Backend CORS Policy**
  - Đã sửa từ `.WithHeaders()` thành `.AllowAnyHeader()`
  - Cho phép tất cả headers cần thiết cho multipart upload

- ✅ **Frontend Admin - Upload**
  - Tạo API routes: `/api/admin/media` và `/api/admin/media/[id]`
  - Tự động gửi token từ cookies
  - Sửa format tham số `loai` từ string thành number (0=ảnh, 1=video)

- ✅ **Frontend Admin - Delete Media**
  - Thêm token vào DELETE request
  - Xử lý response đúng

## 🔄 Cần kiểm tra tiếp

### 3. Dashboard Admin
**Trang:** `/admin/dashboard`
**API Endpoints:**
- `GET /api/admin/dashboard/stats` - Thống kê tổng quan
- `GET /api/admin/dashboard/articles-chart` - Biểu đồ bài viết
- `GET /api/admin/dashboard/applications-status-chart` - Biểu đồ trạng thái hồ sơ

**Cần test:**
- [ ] Hiển thị thống kê
- [ ] Biểu đồ Bar (tin tức)
- [ ] Biểu đồ Doughnut (trạng thái hồ sơ)

### 4. Quản lý Tin tức (Articles)
**Trang:** `/admin/articles`
**API Endpoints:**
- `GET /api/admin/articles/admin` - Danh sách bài viết
- `GET /api/admin/articles/{id}/detail` - Chi tiết bài viết
- `POST /api/admin/articles` - Tạo bài viết mới
- `PUT /api/admin/articles/{id}` - Cập nhật bài viết
- `DELETE /api/admin/articles/{id}` - Xóa bài viết

**Cần test:**
- [ ] Danh sách bài viết
- [ ] Tìm kiếm bài viết
- [ ] Lọc theo trạng thái
- [ ] Lọc theo danh mục
- [ ] Tạo bài viết mới
- [ ] Upload ảnh đại diện
- [ ] Cập nhật bài viết
- [ ] Xóa bài viết
- [ ] Phân trang

### 5. Quản lý Người dùng (Users)
**Trang:** `/admin/users`
**API Endpoints:**
- `GET /api/admin/users` - Danh sách người dùng
- `GET /api/admin/users/{id}` - Chi tiết người dùng
- `POST /api/admin/users` - Tạo người dùng mới
- `PUT /api/admin/users/{id}` - Cập nhật người dùng
- `DELETE /api/admin/users/{id}` - Vô hiệu hóa người dùng

**Cần test:**
- [ ] Danh sách người dùng
- [ ] Tìm kiếm người dùng
- [ ] Tạo người dùng mới
- [ ] Cập nhật thông tin
- [ ] Vô hiệu hóa tài khoản
- [ ] Phân trang

### 6. Quản lý Dịch vụ (Services)
**Trang:** `/admin/services`
**API Endpoints:**
- `GET /api/admin/services/admin` - Danh sách dịch vụ
- `POST /api/admin/services` - Tạo dịch vụ mới
- `PUT /api/admin/services/{id}` - Cập nhật dịch vụ
- `DELETE /api/admin/services/{id}` - Xóa dịch vụ

**Cần test:**
- [ ] Danh sách dịch vụ
- [ ] Tìm kiếm dịch vụ
- [ ] Lọc theo danh mục
- [ ] Tạo dịch vụ mới
- [ ] Cập nhật dịch vụ
- [ ] Xóa dịch vụ

### 7. Quản lý Hồ sơ (Applications)
**Trang:** `/admin/applications`
**API Endpoints:**
- `GET /api/admin/applications` - Danh sách hồ sơ
- `GET /api/admin/applications/{id}` - Chi tiết hồ sơ
- `GET /api/admin/applications/{id}/history` - Lịch sử trạng thái
- `PATCH /api/admin/applications/{id}/status` - Cập nhật trạng thái
- `POST /api/admin/applications/{id}/assign` - Phân công xử lý
- `POST /api/admin/applications/{id}/upload` - Upload file đính kèm
- `POST /api/admin/applications/{id}/upload-files` - Upload nhiều file

**Cần test:**
- [ ] Danh sách hồ sơ
- [ ] Lọc theo trạng thái
- [ ] Tìm kiếm hồ sơ
- [ ] Xem chi tiết hồ sơ
- [ ] Xem lịch sử trạng thái
- [ ] Cập nhật trạng thái
- [ ] Phân công xử lý
- [ ] Upload file đính kèm

### 8. Quản lý Bình luận (Comments)
**Trang:** `/admin/comments`
**API Endpoints:**
- `GET /api/admin/comments` - Danh sách bình luận
- `PATCH /api/admin/comments/{id}/approve` - Duyệt bình luận
- `DELETE /api/admin/comments/{id}` - Xóa bình luận

**Cần test:**
- [ ] Danh sách bình luận
- [ ] Lọc theo trạng thái duyệt
- [ ] Lọc theo bài viết
- [ ] Duyệt bình luận
- [ ] Xóa bình luận

### 9. Quản lý Danh mục (Categories)
**Trang:** `/admin/categories`
**API Endpoints:**
- `GET /api/categories` - Danh sách danh mục
- `POST /api/admin/categories` - Tạo danh mục mới
- `PUT /api/admin/categories/{id}` - Cập nhật danh mục
- `DELETE /api/admin/categories/{id}` - Xóa danh mục

**Cần test:**
- [ ] Danh sách danh mục
- [ ] Tạo danh mục mới
- [ ] Cập nhật danh mục
- [ ] Xóa danh mục

### 10. Quản lý Liên hệ (Contacts)
**Trang:** `/admin/contacts`
**API Endpoints:**
- `GET /api/admin/contacts` - Danh sách liên hệ
- `PATCH /api/admin/contacts/{id}/mark-read` - Đánh dấu đã đọc
- `DELETE /api/admin/contacts/{id}` - Xóa liên hệ

**Cần test:**
- [ ] Danh sách liên hệ
- [ ] Lọc theo trạng thái đọc
- [ ] Đánh dấu đã đọc
- [ ] Xóa liên hệ

### 11. Nhật ký Kiểm tra (Audit Logs)
**Trang:** `/admin/audit-logs`
**API Endpoints:**
- `GET /api/admin/audit-logs` - Danh sách nhật ký

**Cần test:**
- [ ] Danh sách nhật ký
- [ ] Lọc theo loại hành động
- [ ] Lọc theo người dùng
- [ ] Phân trang

### 12. Cài đặt (Settings)
**Trang:** `/admin/settings`
**API Endpoints:**
- `GET /api/admin/settings` - Lấy cài đặt
- `PUT /api/admin/settings` - Cập nhật cài đặt

**Cần test:**
- [ ] Hiển thị cài đặt
- [ ] Cập nhật cài đặt

## 🌐 Frontend Người Dân

### 13. Trang chủ
**Trang:** `/`
**API Endpoints:**
- `GET /api/public/articles` - Danh sách tin tức công khai
- `GET /api/public/services` - Danh sách dịch vụ công khai

**Cần test:**
- [ ] Hiển thị tin tức mới nhất
- [ ] Hiển thị dịch vụ nổi bật
- [ ] Navigation menu

### 14. Danh sách Tin tức
**Trang:** `/tin-tuc`
**API Endpoints:**
- `GET /api/public/articles` - Danh sách tin tức
- `GET /api/public/articles/{slug}` - Chi tiết tin tức

**Cần test:**
- [ ] Danh sách tin tức
- [ ] Lọc theo danh mục
- [ ] Tìm kiếm tin tức
- [ ] Xem chi tiết tin tức
- [ ] Bình luận tin tức

### 15. Danh sách Dịch vụ
**Trang:** `/dich-vu`
**API Endpoints:**
- `GET /api/public/services` - Danh sách dịch vụ
- `GET /api/public/services/{id}` - Chi tiết dịch vụ

**Cần test:**
- [ ] Danh sách dịch vụ
- [ ] Lọc theo danh mục
- [ ] Tìm kiếm dịch vụ
- [ ] Xem chi tiết dịch vụ

### 16. Nộp Hồ sơ
**Trang:** `/nop-ho-so`
**API Endpoints:**
- `POST /api/public/applications` - Nộp hồ sơ mới
- `POST /api/public/applications/upload` - Upload file đính kèm

**Cần test:**
- [ ] Form nộp hồ sơ
- [ ] Upload file đính kèm
- [ ] Validate form
- [ ] Gửi hồ sơ thành công

### 17. Tra cứu Hồ sơ
**Trang:** `/tra-cuu`
**API Endpoints:**
- `GET /api/public/applications/track/{code}` - Tra cứu theo mã

**Cần test:**
- [ ] Tra cứu theo mã theo dõi
- [ ] Hiển thị trạng thái hồ sơ
- [ ] Hiển thị lịch sử xử lý

### 18. Trang cá nhân
**Trang:** `/ca-nhan`
**API Endpoints:**
- `GET /api/public/profile` - Thông tin cá nhân
- `PUT /api/public/profile` - Cập nhật thông tin
- `POST /api/public/profile/avatar` - Upload ảnh đại diện
- `GET /api/public/profile/applications` - Danh sách hồ sơ của tôi

**Cần test:**
- [ ] Hiển thị thông tin cá nhân
- [ ] Cập nhật thông tin
- [ ] Upload ảnh đại diện
- [ ] Danh sách hồ sơ của tôi

### 19. Liên hệ
**Trang:** `/lien-he`
**API Endpoints:**
- `POST /api/public/contact` - Gửi liên hệ

**Cần test:**
- [ ] Form liên hệ
- [ ] Validate form
- [ ] Gửi liên hệ thành công

## 🔧 Các vấn đề đã sửa

1. **CORS Policy** - Đã sửa từ `.WithHeaders()` thành `.AllowAnyHeader()`
2. **Upload Media** - Đã tạo API routes và sửa format tham số
3. **Authentication** - Token được gửi đúng cách qua localStorage và cookies

## 📝 Ghi chú

- Tất cả API endpoints đều cần authentication token (trừ public endpoints)
- Token được lưu trong localStorage với key `auth_token`
- Backend chạy trên port 5000
- Frontend Admin chạy trên port 3001
- Frontend Người Dân chạy trên port 3000

## 🚀 Cách test

1. Khởi động backend:
   ```powershell
   cd backend/phuongxa-api/src/PhuongXa.API
   dotnet run
   ```

2. Khởi động frontend admin:
   ```powershell
   cd frontend
   npm run dev
   ```

3. Khởi động frontend người dân:
   ```powershell
   cd frontend/nguoi-dan
   npm run dev
   ```

4. Mở browser và test từng chức năng theo checklist
