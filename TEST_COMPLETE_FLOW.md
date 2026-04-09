# Kiểm tra Luồng Hoàn chỉnh - Quản lý Trang chủ

## ❌ Vấn đề hiện tại

Trang chủ người dân (http://localhost:3001) vẫn đang dùng ảnh hardcoded, chưa lấy từ API.

## ✅ Đã hoàn thành

1. ✅ Trang admin với 3 tab (Banner, Video, Gallery)
2. ✅ Upload ảnh với tag tự động
3. ✅ API backend trả về ảnh
4. ✅ Phân loại ảnh theo tag

## ⚠️ Cần làm thêm

Để trang chủ người dân hiển thị ảnh từ admin, cần:

### Cách 1: Tạo API endpoint mới (Khuyến nghị)
```csharp
// Backend: Controllers/Public/HomepageController.cs
[HttpGet("homepage/sections")]
public async Task<IActionResult> GetHomepageSections()
{
    var media = await _donViCongViec.PhuongTiens.TruyVan()
        .AsNoTracking()
        .ToListAsync();
    
    var banner = media.Where(m => m.VanBanThayThe.Contains("[banner]")).Take(1);
    var videos = media.Where(m => m.VanBanThayThe.Contains("[video]")).Take(4);
    var gallery = media.Where(m => m.VanBanThayThe.Contains("[gallery]")).Take(5);
    
    return Ok(new {
        banner = _anhXa.Map<List<PhuongTienDto>>(banner),
        videos = _anhXa.Map<List<PhuongTienDto>>(videos),
        gallery = _anhXa.Map<List<PhuongTienDto>>(gallery)
    });
}
```

### Cách 2: Cập nhật trang chủ người dân
```typescript
// frontend/nguoi-dan/src/app/page.tsx
const [bannerImage, setBannerImage] = useState(defaultImage);
const [newsImages, setNewsImages] = useState(defaultNews);
const [galleryImages, setGalleryImages] = useState(defaultGallery);

useEffect(() => {
    async function fetchHomepageImages() {
        const res = await fetch('/api/media?trang=1&kichThuocTrang=50');
        const data = await res.json();
        if (data.thanhCong) {
            const files = data.duLieu.danhSach;
            
            // Filter by tags
            const banner = files.find(f => f.vanBanThayThe?.includes('[banner]'));
            const videos = files.filter(f => f.vanBanThayThe?.includes('[video]')).slice(0, 4);
            const gallery = files.filter(f => f.vanBanThayThe?.includes('[gallery]')).slice(0, 5);
            
            if (banner) setBannerImage(banner.urlTep);
            // ... update other sections
        }
    }
    fetchHomepageImages();
}, []);
```

## 🧪 Test Luồng Hiện tại

### Bước 1: Upload ảnh từ Admin
1. Vào: http://localhost:3000/admin/homepage
2. Tab "Banner Trang chủ"
3. Upload 1 ảnh đẹp (1920x1080px)
4. Tiêu đề: "Banner chính"
5. Click "Tải lên"
6. ✅ Kiểm tra ảnh xuất hiện với tag #1

### Bước 2: Upload Video
1. Click tab "Video Giới thiệu"
2. Upload 1 video hoặc ảnh
3. Tiêu đề: "Video giới thiệu"
4. Click "Tải lên"
5. ✅ Kiểm tra video xuất hiện

### Bước 3: Upload Gallery
1. Click tab "Hình ảnh Tiêu biểu"
2. Upload 5 ảnh đẹp
3. Tiêu đề: "Ảnh 1", "Ảnh 2", ...
4. Click "Tải lên" cho từng ảnh
5. ✅ Kiểm tra 5 ảnh xuất hiện

### Bước 4: Kiểm tra API
```powershell
# Test API trả về ảnh
curl "http://localhost:5000/api/media?trang=1&kichThuocTrang=50"

# Kiểm tra có ảnh với tag [banner], [video], [gallery]
```

### Bước 5: Test Xóa
1. Quay lại admin
2. Xóa 1 ảnh ở tab Banner
3. ✅ Kiểm tra ảnh biến mất
4. Xóa 1 video
5. ✅ Kiểm tra video biến mất

## 📊 Kết quả mong đợi

### Admin Panel
- ✅ 3 tab riêng biệt
- ✅ Upload thành công
- ✅ Hiển thị đúng số lượng
- ✅ Xóa thành công
- ✅ Tag tự động thêm vào

### API
- ✅ Trả về danh sách ảnh
- ✅ Có tag [banner], [video], [gallery]
- ✅ URL ảnh đúng

### Trang chủ Người dân (Cần cập nhật)
- ❌ Vẫn dùng ảnh hardcoded
- ⚠️ Cần fetch từ API
- ⚠️ Cần filter theo tag

## 🔧 Giải pháp tạm thời

Vì trang chủ người dân chưa được cập nhật để lấy ảnh từ API, bạn có thể:

1. **Test trong Admin:**
   - Upload ảnh ở 3 tab
   - Xem ảnh hiển thị đúng trong admin
   - Test xóa ảnh

2. **Test API:**
   - Gọi API `/api/media`
   - Kiểm tra ảnh có tag đúng
   - Kiểm tra URL ảnh hoạt động

3. **Cập nhật Trang chủ (Tùy chọn):**
   - Sửa file `frontend/nguoi-dan/src/app/page.tsx`
   - Thêm code fetch ảnh từ API
   - Filter theo tag
   - Replace ảnh hardcoded

## 📝 Checklist

### Admin Panel
- [x] Tạo trang Quản lý Trang chủ
- [x] 3 tab: Banner, Video, Gallery
- [x] Upload ảnh/video
- [x] Xóa ảnh/video
- [x] Tag tự động
- [x] Giới hạn số lượng
- [x] Hiển thị số thứ tự

### Backend
- [x] API upload ảnh
- [x] API xóa ảnh
- [x] API lấy danh sách ảnh
- [x] Lưu tag trong vanBanThayThe
- [ ] API riêng cho homepage sections (Tùy chọn)

### Frontend Người dân
- [ ] Fetch ảnh từ API
- [ ] Filter theo tag
- [ ] Hiển thị banner
- [ ] Hiển thị video
- [ ] Hiển thị gallery

## 🎯 Kết luận

**Đã hoàn thành:**
- ✅ Admin panel với đầy đủ chức năng CRUD
- ✅ Phân loại ảnh theo 3 section
- ✅ Upload, xem, xóa hoạt động tốt

**Cần làm thêm (nếu muốn):**
- ⚠️ Cập nhật trang chủ người dân để lấy ảnh từ API
- ⚠️ Tạo API endpoint riêng cho homepage

**Test ngay:**
1. Vào http://localhost:3000/admin/homepage
2. Upload ảnh ở 3 tab
3. Kiểm tra ảnh hiển thị đúng
4. Test xóa ảnh
5. Gọi API để xem dữ liệu

Hệ thống admin đã hoàn chỉnh và sẵn sàng sử dụng! 🚀
