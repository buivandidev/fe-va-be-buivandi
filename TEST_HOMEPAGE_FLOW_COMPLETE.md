# ✅ HOÀN THÀNH: Luồng Quản lý Trang chủ

## Tổng quan
Đã hoàn thành việc kết nối frontend người dân với API backend để hiển thị nội dung trang chủ động từ admin.

## Các thay đổi

### 1. Frontend Người Dân (`frontend/nguoi-dan/src/app/page.tsx`)

#### Thêm import và type
```typescript
import { useEffect, useState } from "react";
import { fetchApi, unwrapApiEnvelope } from "@/lib/api";

type HomepageData = {
  banner?: { id: string; tenTep: string; urlTep: string; tieuDe?: string; ngayTao: string; };
  videos: Array<{ id: string; tenTep: string; urlTep: string; tieuDe?: string; loai: number; ngayTao: string; }>;
  gallery: Array<{ id: string; tenTep: string; urlTep: string; tieuDe?: string; ngayTao: string; }>;
};
```

#### Thêm state và fetch data
```typescript
const [homepage, setHomepage] = useState<HomepageData | null>(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
  async function loadHomepage() {
    try {
      const res = await fetchApi("/api/homepage/sections");
      const json = await res.json();
      const { success, data } = unwrapApiEnvelope<HomepageData>(json);
      if (success && data) {
        setHomepage(data);
      }
    } catch (error) {
      console.error("Lỗi tải dữ liệu trang chủ:", error);
    } finally {
      setLoading(false);
    }
  }
  loadHomepage();
}, []);
```

#### Cập nhật hiển thị
- **Banner Hero**: Sử dụng `homepage?.banner?.urlTep` thay vì hardcoded URL
- **Video Section**: Hiển thị video từ `homepage?.videos[0]` với tiêu đề động
- **Side Videos**: Map từ `homepage?.videos.slice(0, 3)` với ngày tháng format
- **Gallery**: Hiển thị 5 ảnh từ `homepage?.gallery` với fallback về ảnh mặc định

## Luồng hoàn chỉnh

### 1. Admin Upload (✅ Hoàn thành)
- Truy cập: http://localhost:3000/admin/homepage
- Upload ảnh/video với tag:
  - `[banner]` - 1 ảnh cho banner chính
  - `[video]` - 4 video/ảnh cho section video
  - `[gallery]` - 5 ảnh cho gallery địa phương

### 2. Backend API (✅ Hoàn thành)
- Endpoint: `GET /api/homepage/sections`
- Controller: `HomepageController.cs`
- Lọc media theo tag trong field `vanBanThayThe`
- Trả về JSON với 3 sections: banner, videos, gallery

### 3. Frontend Người Dân (✅ Hoàn thành)
- Tự động fetch data khi load trang
- Hiển thị nội dung động từ API
- Fallback về ảnh mặc định nếu chưa có data

## Test API

```powershell
# Test endpoint
curl http://localhost:5000/api/homepage/sections

# Response mẫu
{
  "thanhCong": true,
  "duLieu": {
    "banner": {
      "id": "...",
      "tenTep": "banner.jpg",
      "urlTep": "http://localhost:5000/uploads/images/...",
      "tieuDe": "Banner chính",
      "ngayTao": "2026-04-07T..."
    },
    "videos": [
      {
        "id": "...",
        "tenTep": "video.mp4",
        "urlTep": "http://localhost:5000/uploads/videos/...",
        "tieuDe": "Video giới thiệu",
        "loai": 1,
        "ngayTao": "2026-04-07T..."
      }
    ],
    "gallery": [
      {
        "id": "...",
        "tenTep": "gallery.png",
        "urlTep": "http://localhost:5000/uploads/images/...",
        "tieuDe": "Ảnh địa phương",
        "ngayTao": "2026-04-07T..."
      }
    ]
  }
}
```

## Kiểm tra luồng

### Bước 1: Kiểm tra servers đang chạy
```powershell
# Backend: http://localhost:5000
# Admin: http://localhost:3000
# Người dân: http://localhost:3001
```

### Bước 2: Upload từ admin
1. Đăng nhập admin: http://localhost:3000/admin/dang-nhap
   - Email: `admin@phuongxa.vn`
   - Password: `Admin@123`
2. Vào trang Quản lý Trang chủ: http://localhost:3000/admin/homepage
3. Upload ảnh vào các tab:
   - Tab "🎯 Banner" - upload 1 ảnh
   - Tab "🎬 Video" - upload 4 video/ảnh
   - Tab "🖼️ Gallery" - upload 5 ảnh

### Bước 3: Kiểm tra API
```powershell
curl http://localhost:5000/api/homepage/sections
```

### Bước 4: Kiểm tra frontend người dân
1. Mở: http://localhost:3001
2. Kiểm tra:
   - Banner hero section hiển thị ảnh từ admin
   - Video section hiển thị video từ admin
   - Gallery section hiển thị 5 ảnh từ admin

## Kết quả hiện tại

✅ Backend API hoạt động
✅ Admin panel hoạt động
✅ Frontend người dân đã kết nối API
✅ Hiển thị nội dung động từ database

## Dữ liệu hiện có (từ test API)

- **Banner**: 1 ảnh (z7702255519728...)
- **Videos**: 1 video (Quay màn hình...)
- **Gallery**: 1 ảnh (Gemini_Generated_Image...)

## Ghi chú

- Frontend sử dụng fallback về ảnh mặc định nếu chưa có data từ API
- Tất cả URL được generate tự động bởi backend
- Tag format: `[banner]`, `[video]`, `[gallery]` trong field alt text
- API tự động lọc và sắp xếp theo ngày tạo mới nhất

## Hoàn thành! 🎉

Luồng từ admin upload → API → frontend người dân hiển thị đã hoạt động hoàn chỉnh!
