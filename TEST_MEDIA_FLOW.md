# Test luồng Upload ảnh từ Admin → Hiển thị trên Frontend Người dân

## ✅ Đã sửa lỗi

**Vấn đề:** Routing conflict giữa 2 controllers cùng route `/api/media`
- `ThongTinController` (controller chính)
- `PublicMediaController` (controller trùng lặp)

**Giải pháp:** Đã xóa `PublicMediaController` để tránh conflict

## 🧪 Test Manual

### Bước 1: Upload ảnh từ Admin

1. Mở: http://localhost:3000/admin/login
2. Đăng nhập: `admin@phuongxa.vn` / `Admin@123`
3. Vào: http://localhost:3000/admin/library
4. Upload một ảnh mới:
   - Chọn file ảnh
   - (Tùy chọn) Chọn album
   - Click "Upload"
5. Kiểm tra ảnh đã xuất hiện trong danh sách

### Bước 2: Kiểm tra API trả về ảnh

Mở terminal và chạy:
```powershell
curl "http://localhost:5000/api/media?trang=1&kichThuocTrang=10"
```

Kết quả mong đợi:
```json
{
  "thanhCong": true,
  "duLieu": {
    "danhSach": [
      {
        "id": "...",
        "tenTep": "...",
        "urlTep": "http://localhost:5000/uploads/images/...",
        "loai": 0,
        ...
      }
    ],
    "tongSo": 9
  }
}
```

### Bước 3: Xem ảnh trên Frontend Người dân

1. Mở: http://localhost:3001/thu-vien
2. Kiểm tra:
   - Section "Album hình ảnh" hiển thị danh sách album
   - Section "Video mới nhất" hiển thị danh sách video
3. Click vào một album để xem chi tiết
4. Kiểm tra ảnh hiển thị đúng

## 🔍 Kiểm tra chi tiết

### API Endpoints đang hoạt động:

1. **GET /api/media/albums** - Lấy danh sách album
   ```powershell
   curl http://localhost:5000/api/media/albums
   ```

2. **GET /api/media/albums/{id}** - Lấy chi tiết album
   ```powershell
   curl http://localhost:5000/api/media/albums/{album-id}
   ```

3. **GET /api/media** - Lấy danh sách ảnh/video
   ```powershell
   curl "http://localhost:5000/api/media?trang=1&kichThuocTrang=10"
   ```

4. **GET /api/media?albumId={id}** - Lấy ảnh trong album
   ```powershell
   curl "http://localhost:5000/api/media?albumId={album-id}"
   ```

5. **GET /api/media?loai=0** - Lấy chỉ ảnh (loai=0)
   ```powershell
   curl "http://localhost:5000/api/media?loai=0&trang=1"
   ```

6. **GET /api/media?loai=1** - Lấy chỉ video (loai=1)
   ```powershell
   curl "http://localhost:5000/api/media?loai=1&trang=1"
   ```

### Frontend Components:

1. **AlbumList** (`frontend/nguoi-dan/src/components/media/album-list.tsx`)
   - Gọi: `GET /api/media/albums`
   - Hiển thị danh sách album

2. **VideoList** (`frontend/nguoi-dan/src/components/media/video-list.tsx`)
   - Gọi: `GET /api/media?loai=1`
   - Hiển thị danh sách video

3. **Album Detail Page** (`frontend/nguoi-dan/src/app/thu-vien/album/[id]/page.tsx`)
   - Gọi: `GET /api/media/albums/{id}`
   - Gọi: `GET /api/media?albumId={id}`
   - Hiển thị chi tiết album và ảnh trong album

4. **Video Detail Page** (`frontend/nguoi-dan/src/app/thu-vien/video/[id]/page.tsx`)
   - Gọi: `GET /api/media?loai=1`
   - Hiển thị chi tiết video

## 📊 Kết quả hiện tại

Đã test API và có:
- ✅ 9 ảnh/video trong hệ thống
- ✅ API `/api/media` hoạt động
- ✅ API `/api/media/albums` hoạt động
- ✅ Không còn routing conflict

## 🐛 Nếu vẫn lỗi

### Lỗi: "Chưa có album hình ảnh nào"

**Nguyên nhân:** Chưa tạo album hoặc album chưa có ảnh

**Giải pháp:**
1. Vào admin: http://localhost:3000/admin/library
2. Click "+ Album" để tạo album mới
3. Upload ảnh vào album đó
4. Refresh trang người dân

### Lỗi: Ảnh không hiển thị (broken image)

**Nguyên nhân:** URL ảnh không đúng hoặc file không tồn tại

**Kiểm tra:**
1. Xem URL ảnh trong response API
2. Thử mở URL đó trực tiếp trong trình duyệt
3. Kiểm tra file có tồn tại trong thư mục `uploads/` không

**Ví dụ URL đúng:**
```
http://localhost:5000/uploads/images/2026/04/filename.png
```

### Lỗi: CORS

**Nguyên nhân:** Frontend không được phép gọi API

**Kiểm tra:**
1. Mở Developer Tools (F12) > Console
2. Xem có lỗi CORS không
3. Kiểm tra `appsettings.Development.json`:
   ```json
   "Cors": {
     "AllowedOrigins": "http://localhost:3000,http://localhost:3001,..."
   }
   ```

### Lỗi: 404 Not Found

**Nguyên nhân:** Endpoint không tồn tại hoặc routing sai

**Kiểm tra:**
1. Backend có đang chạy không?
2. URL có đúng không?
3. Có routing conflict không?

## 📝 Checklist hoàn chỉnh

- [x] Backend đang chạy (port 5000)
- [x] Frontend Admin đang chạy (port 3000)
- [x] Frontend Người dân đang chạy (port 3001)
- [x] Đã xóa PublicMediaController (fix routing conflict)
- [x] API `/api/media` hoạt động
- [x] API `/api/media/albums` hoạt động
- [ ] Upload ảnh từ admin thành công
- [ ] Ảnh hiển thị trên frontend người dân
- [ ] Album hiển thị trên frontend người dân
- [ ] Video hiển thị trên frontend người dân

## 🎯 Kết luận

Hệ thống đã sẵn sàng. Bạn có thể:
1. Upload ảnh/video từ admin
2. Tạo album để tổ chức ảnh
3. Xem ảnh/video trên frontend người dân

Nếu vẫn có lỗi, vui lòng chụp màn hình:
- Console log (F12 > Console)
- Network tab (F12 > Network)
- Màn hình lỗi
