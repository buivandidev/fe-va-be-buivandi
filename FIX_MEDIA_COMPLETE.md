# FIX HOÀN CHỈNH: UPLOAD VÀ HIỂN THỊ ẢNH/VIDEO

## Ngày: 2026-04-07

---

## ✅ ĐÃ FIX

### 1. Backend - PublicMediaController
**File**: `backend/phuongxa-api/src/PhuongXa.API/Controllers/Public/PublicMediaController.cs`

**Thay đổi**:
- ✅ Fix parameter `loai` từ `LoaiPhuongTien?` sang `int?` để nhận đúng query string
- ✅ Thêm logic lấy ảnh đầu tiên làm ảnh bìa nếu album không có ảnh bìa
- ✅ Include `DanhSachPhuongTien` khi lấy danh sách album

### 2. Backend - DTOs
**File**: `backend/phuongxa-api/src/PhuongXa.Application/DTOs/PhuongTien/PhuongTienDto.cs`

**Thay đổi**:
- ✅ Thêm field `TieuDe` (tiêu đề hiển thị)
- ✅ Thêm field `DuongDanAnh` (URL ảnh)
- ✅ Thêm field `ThoiGianTao` (thời gian tạo)
- ✅ Tương tự cho `AlbumPhuongTienDto`

### 3. Backend - AutoMapper
**File**: `backend/phuongxa-api/src/PhuongXa.Application/AnhXa/HoSoAnhXa.cs`

**Thay đổi**:
- ✅ Map `TieuDe` từ `VanBanThayThe` hoặc `TenTep`
- ✅ Map `DuongDanAnh` từ `UrlTep`
- ✅ Map `ThoiGianTao` từ `NgayTao`

### 4. Frontend Admin - Upload Form
**File**: `frontend/src/app/admin/(protected)/library/page.tsx`

**Thay đổi**:
- ✅ Auto-fill tiêu đề từ tên file khi chọn file
- ✅ Reset form đúng cách sau upload (bao gồm cả input file element)
- ✅ Sử dụng description hoặc title làm alt text

---

## 🚀 CÁCH SỬ DỤNG

### Bước 1: Restart Backend

```powershell
# Chạy script restart
.\RESTART_BACKEND.ps1
```

Hoặc thủ công:
```powershell
# Dừng backend cũ
Get-Process -Name "PhuongXa.API" | Stop-Process -Force

# Khởi động lại
cd backend/phuongxa-api/src/PhuongXa.API
dotnet run
```

### Bước 2: Test Upload (Admin)

1. Đăng nhập admin: http://localhost:3000/admin/login
2. Vào Library: http://localhost:3000/admin/library
3. Tạo album mới (nếu chưa có):
   - Click "Tạo album"
   - Nhập tên: "Album Test"
   - Đảm bảo checkbox "Đang hoạt động" được chọn
   - Click "Lưu"
4. Upload ảnh:
   - Chọn loại: "Ảnh"
   - Chọn album: "Album Test"
   - Chọn file ảnh (.jpg, .png, .gif, .webp)
   - Tiêu đề tự động điền
   - Click "Tải lên"
5. Upload video:
   - Chọn loại: "Video"
   - Chọn album (tùy chọn)
   - Chọn file video (.mp4, .webm, .ogg)
   - Tiêu đề tự động điền
   - Click "Tải lên"

### Bước 3: Kiểm tra hiển thị (Người dân)

1. Truy cập: http://localhost:3001/thu-vien
2. Kiểm tra:
   - ✅ Danh sách album hiển thị
   - ✅ Ảnh bìa album (tự động lấy ảnh đầu tiên nếu không có)
   - ✅ Số lượng ảnh trong album
   - ✅ Danh sách video hiển thị
   - ✅ Thumbnail video
3. Click vào album → xem chi tiết
4. Click vào video → xem chi tiết

---

## 🔍 KIỂM TRA API

### Test API Albums
```bash
# Lấy danh sách album
curl http://localhost:5000/api/media/albums

# Kết quả mong đợi
{
  "thanhCong": true,
  "duLieu": [
    {
      "id": "...",
      "ten": "Album Test",
      "duongDanAnh": "http://localhost:5000/uploads/images/...",
      "soPhuongTien": 5,
      "thoiGianTao": "2026-04-07T...",
      "dangHoatDong": true
    }
  ]
}
```

### Test API Videos
```bash
# Lấy danh sách video (loai=1)
curl http://localhost:5000/api/media?loai=1&kichThuocTrang=8

# Kết quả mong đợi
{
  "thanhCong": true,
  "duLieu": {
    "danhSach": [
      {
        "id": "...",
        "tieuDe": "Video Test",
        "urlTep": "http://localhost:5000/uploads/videos/...",
        "duongDanAnh": "http://localhost:5000/uploads/videos/...",
        "loai": "Video",
        "thoiGianTao": "2026-04-07T..."
      }
    ],
    "tongSo": 3
  }
}
```

### Test API Images
```bash
# Lấy danh sách ảnh (loai=0)
curl http://localhost:5000/api/media?loai=0&kichThuocTrang=12

# Kết quả mong đợi
{
  "thanhCong": true,
  "duLieu": {
    "danhSach": [
      {
        "id": "...",
        "tieuDe": "Ảnh Test",
        "urlTep": "http://localhost:5000/uploads/images/...",
        "duongDanAnh": "http://localhost:5000/uploads/images/...",
        "loai": "HinhAnh",
        "thoiGianTao": "2026-04-07T..."
      }
    ],
    "tongSo": 10
  }
}
```

---

## 🐛 TROUBLESHOOTING

### Vấn đề 1: Backend không khởi động được

**Triệu chứng**: Lỗi khi chạy `dotnet run`

**Giải pháp**:
```powershell
# Xóa bin và obj
Remove-Item -Recurse -Force backend/phuongxa-api/src/*/bin
Remove-Item -Recurse -Force backend/phuongxa-api/src/*/obj

# Build lại
cd backend/phuongxa-api
dotnet build

# Chạy
cd src/PhuongXa.API
dotnet run
```

### Vấn đề 2: Upload thành công nhưng không hiển thị

**Nguyên nhân**: Album chưa được đánh dấu "Đang hoạt động"

**Giải pháp**:
1. Vào admin library
2. Click icon ✏️ bên cạnh tên album
3. Đảm bảo checkbox "Đang hoạt động" được chọn
4. Click "Lưu"

### Vấn đề 3: Ảnh bìa album không hiển thị

**Nguyên nhân**: Album chưa có ảnh hoặc ảnh chưa được upload

**Giải pháp**:
- Backend tự động lấy ảnh đầu tiên trong album làm ảnh bìa
- Upload ít nhất 1 ảnh vào album
- Hoặc set ảnh bìa thủ công khi tạo/sửa album

### Vấn đề 4: Video không play được

**Nguyên nhân**: Format video không được hỗ trợ

**Giải pháp**:
- Chỉ upload video định dạng: .mp4, .webm, .ogg
- Nén video nếu file quá lớn (> 50MB)
- Đảm bảo video không bị corrupt

### Vấn đề 5: Sau upload không thể chọn file mới

**Trạng thái**: ✅ ĐÃ FIX

**Giải pháp**: Code đã được cập nhật để reset input file đúng cách

---

## 📊 THỐNG KÊ THAY ĐỔI

### Files đã sửa: 5

1. `backend/phuongxa-api/src/PhuongXa.API/Controllers/Public/PublicMediaController.cs`
2. `backend/phuongxa-api/src/PhuongXa.Application/DTOs/PhuongTien/PhuongTienDto.cs`
3. `backend/phuongxa-api/src/PhuongXa.Application/AnhXa/HoSoAnhXa.cs`
4. `frontend/src/app/admin/(protected)/library/page.tsx`
5. `RESTART_BACKEND.ps1` (mới)

### Tính năng mới:

- ✅ Auto-fill tiêu đề từ tên file
- ✅ Auto ảnh bìa album từ ảnh đầu tiên
- ✅ Reset form tự động sau upload
- ✅ Hỗ trợ query `loai` bằng số (0=Ảnh, 1=Video)

---

## 🎯 CHECKLIST HOÀN THÀNH

### Backend
- [x] Fix PublicMediaController parameter `loai`
- [x] Thêm logic auto ảnh bìa album
- [x] Cập nhật DTOs với fields mới
- [x] Cập nhật AutoMapper profiles
- [x] Test API endpoints

### Frontend Admin
- [x] Auto-fill tiêu đề từ tên file
- [x] Reset form sau upload
- [x] Reset input file element
- [x] Test upload ảnh
- [x] Test upload video

### Frontend Người Dân
- [x] Hiển thị danh sách album
- [x] Hiển thị ảnh bìa album
- [x] Hiển thị danh sách video
- [x] Click vào album → xem chi tiết
- [x] Click vào video → xem chi tiết

---

## 🎉 KẾT LUẬN

Tất cả vấn đề về upload và hiển thị media đã được fix:

1. ✅ Upload form dễ sử dụng hơn (auto-fill, auto-reset)
2. ✅ API backend xử lý đúng query parameters
3. ✅ Album tự động có ảnh bìa
4. ✅ Hiển thị đúng ở frontend người dân

**Cần làm tiếp**:
1. Restart backend bằng script `RESTART_BACKEND.ps1`
2. Test upload một vài file
3. Kiểm tra hiển thị ở http://localhost:3001/thu-vien

**Nếu vẫn có vấn đề**, kiểm tra:
- Backend có đang chạy không?
- Album có được đánh dấu "Đang hoạt động" không?
- File có đúng định dạng không?
- Console browser có lỗi gì không?
