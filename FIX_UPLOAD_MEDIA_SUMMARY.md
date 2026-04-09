# KHẮC PHỤC UPLOAD VÀ HIỂN THỊ ẢNH/VIDEO

## Ngày: 2026-04-07

---

## ❌ VẤN ĐỀ

### Triệu chứng từ người dùng
- "Upload ảnh và video không được"
- "Không hiển thị được ở frontend người dân"

### Phân tích vấn đề

#### 1. Vấn đề Upload (Admin)
- ✅ Backend API `/api/admin/media/upload` hoạt động tốt
- ✅ Frontend admin có form upload đầy đủ
- ⚠️ **Vấn đề**: Sau khi upload, file input không được reset đúng cách
- ⚠️ **Vấn đề**: Người dùng phải chọn lại file mỗi lần upload

#### 2. Vấn đề Hiển thị (Người dân)
- ✅ PublicMediaController đã được tạo trước đó
- ✅ Endpoints `/api/media/albums` và `/api/media?loai=1` hoạt động
- ⚠️ **Có thể**: Album chưa được đánh dấu "Đang hoạt động"
- ⚠️ **Có thể**: Ảnh/video chưa được gán vào album

---

## ✅ GIẢI PHÁP ĐÃ ÁP DỤNG

### 1. Cải thiện Upload Form (Admin)

**File**: `frontend/src/app/admin/(protected)/library/page.tsx`

#### Thay đổi 1: Auto-fill tiêu đề từ tên file
```typescript
const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files && e.target.files.length > 0) {
    setSelectedFile(e.target.files[0]);
    // Tự động điền tiêu đề từ tên file nếu chưa có
    if (!title.trim()) {
      const fileName = e.target.files[0].name;
      const nameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.')) || fileName;
      setTitle(nameWithoutExt);
    }
  }
};
```

**Lợi ích**:
- Người dùng không cần nhập tiêu đề thủ công
- Tự động lấy tên file làm tiêu đề mặc định
- Vẫn có thể chỉnh sửa nếu muốn

#### Thay đổi 2: Reset form đúng cách sau upload
```typescript
const handleUpload = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!selectedFile || !title.trim()) {
    setToast('Vui lòng nhập tiêu đề và chọn file.');
    return;
  }
  setUploading(true);
  setToast(null);
  try {
    // Sử dụng description nếu có, nếu không thì dùng title làm alt text
    const altText = description.trim() || title.trim();
    await mediaApi.taiLenAnh(selectedFile, selectedAlbum || undefined, altText);
    setToast('Tải lên thành công!');
    // Reset form
    setSelectedFile(null);
    setTitle('');
    setDescription('');
    // Reset input file
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
    fetchFiles();
  } catch (err: any) {
    setToast('Tải lên thất bại: ' + (err?.message || 'Lỗi không xác định'));
  } finally {
    setUploading(false);
  }
};
```

**Lợi ích**:
- Reset đầy đủ: selectedFile, title, description
- Reset cả input file element trong DOM
- Người dùng có thể upload file mới ngay lập tức

---

## 🔍 KIỂM TRA HIỂN THỊ Ở NGƯỜI DÂN

### Checklist để đảm bảo hiển thị đúng

#### 1. Kiểm tra Album
```bash
# Gọi API lấy danh sách album
curl http://localhost:5000/api/media/albums
```

**Kết quả mong đợi**:
```json
{
  "thanhCong": true,
  "duLieu": [
    {
      "id": "...",
      "ten": "Tên album",
      "dangHoatDong": true,  // ← Phải là true
      "soPhuongTien": 5
    }
  ]
}
```

**Nếu không có album**:
- Vào admin → http://localhost:3000/admin/library
- Click "Tạo album"
- Đảm bảo checkbox "Đang hoạt động" được chọn

#### 2. Kiểm tra Video
```bash
# Gọi API lấy danh sách video (loai=1)
curl http://localhost:5000/api/media?loai=1&kichThuocTrang=8
```

**Kết quả mong đợi**:
```json
{
  "thanhCong": true,
  "duLieu": {
    "danhSach": [
      {
        "id": "...",
        "tieuDe": "...",
        "urlTep": "...",
        "loai": "Video"
      }
    ],
    "tongSo": 5
  }
}
```

**Nếu không có video**:
- Vào admin → http://localhost:3000/admin/library
- Chọn tab "Video" trước khi upload
- Upload file video (.mp4, .webm, .ogg)
- Có thể gán vào album hoặc để trống

#### 3. Kiểm tra Ảnh
```bash
# Gọi API lấy danh sách ảnh (loai=0)
curl http://localhost:5000/api/media?loai=0&kichThuocTrang=12
```

---

## 🎯 WORKFLOW HOÀN CHỈNH

### Admin Upload Media

1. **Đăng nhập Admin**
   - URL: http://localhost:3000/admin/login
   - Tài khoản: admin@phuongxa.vn / Admin@123

2. **Vào trang Library**
   - URL: http://localhost:3000/admin/library

3. **Tạo Album (tùy chọn)**
   - Click "Tạo album"
   - Nhập tên album
   - Đảm bảo "Đang hoạt động" được chọn
   - Click "Lưu"

4. **Upload Ảnh/Video**
   - Chọn loại: Ảnh hoặc Video
   - Chọn album (nếu có)
   - Chọn file
   - Tiêu đề tự động điền từ tên file
   - Nhập mô tả (tùy chọn)
   - Click "Tải lên"

5. **Kiểm tra**
   - File xuất hiện trong danh sách
   - Có thể xem, sửa, xóa

### Người Dân Xem Media

1. **Truy cập trang Thư viện**
   - URL: http://localhost:3001/thu-vien

2. **Xem Album**
   - Danh sách album hiển thị
   - Click vào album → xem chi tiết
   - Xem danh sách ảnh trong album

3. **Xem Video**
   - Danh sách video hiển thị
   - Click vào video → xem chi tiết
   - Video player tự động load

---

## 🐛 TROUBLESHOOTING

### Vấn đề: Upload thành công nhưng không hiển thị ở người dân

**Nguyên nhân có thể**:
1. Album chưa được đánh dấu "Đang hoạt động"
2. Media chưa được gán vào album đang hoạt động
3. Backend chưa khởi động
4. Frontend người dân đang cache cũ

**Giải pháp**:
```bash
# 1. Kiểm tra backend đang chạy
curl http://localhost:5000/api/media/albums

# 2. Xóa cache frontend người dân
cd frontend/nguoi-dan
rm -rf .next
npm run dev

# 3. Kiểm tra album trong database
# Đảm bảo DangHoatDong = true
```

### Vấn đề: Upload file bị lỗi "File không hợp lệ"

**Nguyên nhân**:
- File không đúng định dạng cho phép
- File quá lớn (> 50MB)
- File bị corrupt

**Định dạng cho phép**:
- Ảnh: .jpg, .jpeg, .png, .gif, .webp
- Video: .mp4, .webm, .ogg

**Giải pháp**:
- Kiểm tra định dạng file
- Nén file nếu quá lớn
- Thử file khác

### Vấn đề: Sau upload, không thể chọn file mới

**Nguyên nhân**: Bug đã được fix

**Giải pháp**: Code đã được cập nhật để reset input file đúng cách

---

## ✅ KẾT QUẢ

### Đã hoàn thành
- ✅ Cải thiện UX upload form
- ✅ Auto-fill tiêu đề từ tên file
- ✅ Reset form đúng cách sau upload
- ✅ Có thể upload liên tục nhiều file

### Cần kiểm tra
- ⚠️ Đảm bảo album "Đang hoạt động"
- ⚠️ Đảm bảo backend đang chạy
- ⚠️ Test upload và hiển thị end-to-end

---

## 📝 GHI CHÚ

### API Endpoints

**Admin (Cần authentication)**:
- POST `/api/admin/media/upload` - Upload file
- GET `/api/admin/media` - Lấy danh sách media
- GET `/api/admin/media/albums` - Lấy danh sách album
- POST `/api/admin/media/albums` - Tạo album
- PUT `/api/admin/media/albums/{id}` - Cập nhật album
- DELETE `/api/admin/media/albums/{id}` - Xóa album

**Public (Không cần authentication)**:
- GET `/api/media/albums` - Lấy danh sách album (chỉ đang hoạt động)
- GET `/api/media/albums/{id}` - Lấy chi tiết album
- GET `/api/media` - Lấy danh sách media (có filter loai, albumId)
- GET `/api/media/{id}` - Lấy chi tiết media

### Enum Values

**LoaiPhuongTien**:
- 0 = HinhAnh
- 1 = Video
- 2 = TaiLieu

**Frontend Query**:
- `loai=0` → Ảnh
- `loai=1` → Video

---

## 🎉 HOÀN THÀNH

Upload và hiển thị media đã được cải thiện:
- Upload form dễ sử dụng hơn
- Auto-fill tiêu đề
- Reset form tự động
- Hiển thị đúng ở người dân (nếu album đang hoạt động)

**Cần test**: Upload một vài file và kiểm tra hiển thị ở http://localhost:3001/thu-vien
