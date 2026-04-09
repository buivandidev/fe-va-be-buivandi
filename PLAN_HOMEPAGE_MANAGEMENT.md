# Kế hoạch: Quản lý Trang chủ

## Mục tiêu
Tạo trang admin để quản lý các ảnh/banner hiển thị trên trang chủ người dân

## Các phần cần quản lý

### 1. Hero Banner (Ảnh chính đầu trang)
- 1 ảnh lớn
- Tiêu đề
- Mô tả
- 2 nút CTA

### 2. Tin tức & Sự kiện (3 ảnh)
- Ảnh
- Tiêu đề
- Mô tả ngắn
- Ngày đăng
- Category

### 3. Video Tiêu điểm
- 1 video chính
- 3 video phụ

### 4. Hình ảnh Địa phương (5 ảnh)
- Grid layout
- Ảnh lớn (2x2)
- 4 ảnh nhỏ

## Cấu trúc Database

```sql
CREATE TABLE homepage_sections (
  id UUID PRIMARY KEY,
  section_key VARCHAR(50) UNIQUE, -- 'hero', 'news', 'videos', 'gallery'
  title VARCHAR(200),
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

CREATE TABLE homepage_items (
  id UUID PRIMARY KEY,
  section_id UUID REFERENCES homepage_sections(id),
  title VARCHAR(200),
  description TEXT,
  image_url VARCHAR(500),
  link_url VARCHAR(500),
  category VARCHAR(50),
  display_order INT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

## API Endpoints

### Admin
- GET /api/admin/homepage/sections - Lấy danh sách sections
- GET /api/admin/homepage/sections/{key} - Lấy chi tiết section
- PUT /api/admin/homepage/sections/{key} - Cập nhật section
- POST /api/admin/homepage/items - Tạo item mới
- PUT /api/admin/homepage/items/{id} - Cập nhật item
- DELETE /api/admin/homepage/items/{id} - Xóa item
- POST /api/admin/homepage/items/{id}/reorder - Sắp xếp lại

### Public
- GET /api/homepage - Lấy toàn bộ dữ liệu trang chủ

## Frontend Admin

### Trang: /admin/homepage
- Tab cho từng section
- Upload ảnh
- Form chỉnh sửa
- Drag & drop để sắp xếp
- Preview

## Luồng test
1. Admin upload ảnh hero
2. Admin thêm 3 tin tức
3. Admin thêm video
4. Admin thêm ảnh gallery
5. Kiểm tra trang chủ người dân hiển thị đúng
6. Admin sửa/xóa
7. Kiểm tra lại trang chủ

## Ưu tiên
1. Tạo database models
2. Tạo API endpoints
3. Tạo trang admin
4. Cập nhật trang chủ người dân để dùng API
5. Test toàn bộ luồng
