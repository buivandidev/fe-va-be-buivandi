# Hướng Dẫn Restart Frontend Admin

## ⚠️ Vấn Đề
Code đã có đầy đủ các tính năng nhưng không hiển thị trên trình duyệt vì:
1. Frontend chưa được restart sau khi sửa code
2. Browser đang cache code cũ

## 🔧 Giải Pháp

### Bước 1: Dừng Frontend Admin
```powershell
# Tìm terminal đang chạy frontend admin
# Nhấn Ctrl+C để dừng
```

### Bước 2: Xóa Cache Build
```powershell
cd frontend
Remove-Item -Recurse -Force .next
```

### Bước 3: Restart Frontend Admin
```powershell
npm run dev
```

### Bước 4: Clear Browser Cache
1. Mở trang admin: `http://localhost:3000/admin/articles`
2. Nhấn F12 để mở DevTools
3. Tab Network → Tick "Disable cache"
4. Hard refresh: **Ctrl+Shift+R** hoặc **Ctrl+F5**

### Bước 5: Đăng Nhập Lại (nếu cần)
- Nếu bị logout, đăng nhập lại với:
  - Email: `admin@phuongxa.vn`
  - Password: `Admin@123456!Secure`

## ✅ Kiểm Tra Sau Khi Restart

Sau khi restart, bạn sẽ thấy:

### 1. Nút "Thêm tin tức"
- Vị trí: Góc phải trên cùng
- Màu: Xanh brand
- Text: "+ Thêm tin tức"

### 2. Bảng Danh Sách Tin Tức
Với các cột:
- Tiêu đề
- Danh mục
- Trạng thái (badge màu)
- Lượt xem
- Ngày tạo
- **Thao tác** (nút Sửa và Xóa)

### 3. Filters
- Ô tìm kiếm
- Dropdown lọc trạng thái
- Dropdown lọc danh mục

### 4. Modal Thêm/Sửa
Khi click "Thêm tin tức" hoặc "Sửa", sẽ hiện modal với:
- Input Tiêu đề
- Textarea Tóm tắt
- Textarea Nội dung (lớn, hỗ trợ HTML)
- **Upload ảnh** (input file + preview)
- Dropdown Danh mục
- Dropdown Trạng thái
- Nút Hủy và Thêm mới/Cập nhật

## 🐛 Nếu Vẫn Không Thấy

### Kiểm tra 1: Console Log
Mở DevTools (F12) → Tab Console, phải thấy:
```
🔍 Loading articles... { search: '', filterStatus: '', filterCategory: '', page: 1 }
```

Nếu không thấy log này → Frontend chưa load code mới

### Kiểm tra 2: Network Tab
Mở DevTools (F12) → Tab Network:
- Phải thấy request đến `/api/admin/articles/admin`
- Status phải là 200 OK
- Response phải có dữ liệu

### Kiểm tra 3: Elements Tab
Mở DevTools (F12) → Tab Elements:
- Tìm nút "Thêm tin tức" trong DOM
- Nếu không có → Frontend chưa build code mới

### Kiểm tra 4: Backend
```powershell
# Test backend API
curl -X GET "http://localhost:5000/api/admin/articles/admin" `
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🔄 Script Restart Nhanh

Tạo file `restart-frontend-admin.ps1`:

```powershell
# Dừng tất cả process node
Stop-Process -Name "node" -Force -ErrorAction SilentlyContinue

# Xóa cache
cd frontend
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue

# Restart
Write-Host "Starting frontend admin..." -ForegroundColor Green
npm run dev
```

Chạy:
```powershell
.\restart-frontend-admin.ps1
```

## 📋 Checklist

- [ ] Đã dừng frontend (Ctrl+C)
- [ ] Đã xóa folder `.next`
- [ ] Đã chạy `npm run dev`
- [ ] Đã clear browser cache (Ctrl+Shift+R)
- [ ] Đã đăng nhập lại (nếu cần)
- [ ] Đã mở DevTools để xem console log
- [ ] Đã thấy log "🔍 Loading articles..."
- [ ] Đã thấy nút "Thêm tin tức"
- [ ] Đã thấy nút "Sửa" và "Xóa" trong bảng

## ✅ Kết Quả Mong Đợi

Sau khi hoàn thành các bước trên, trang admin sẽ hiển thị:

1. ✅ Tiêu đề "Quản lý tin tức"
2. ✅ Nút "Thêm tin tức" (góc phải)
3. ✅ Ô tìm kiếm
4. ✅ 2 dropdown lọc
5. ✅ Bảng danh sách tin tức
6. ✅ Cột "Thao tác" với nút "Sửa" và "Xóa"
7. ✅ Phân trang (nếu có nhiều tin tức)

## 🎯 Test Các Chức Năng

### Test 1: Thêm Tin Tức
1. Click "Thêm tin tức"
2. Modal hiện ra
3. Nhập thông tin
4. Upload ảnh (chọn file)
5. Preview ảnh hiển thị
6. Click "Thêm mới"
7. Modal đóng, tin tức xuất hiện trong bảng

### Test 2: Sửa Tin Tức
1. Click "Sửa" trên tin tức
2. Modal hiện ra với dữ liệu đã điền
3. Thay đổi thông tin
4. Click "Cập nhật"
5. Modal đóng, tin tức được cập nhật

### Test 3: Xóa Tin Tức
1. Click "Xóa" trên tin tức
2. Popup confirm hiện ra
3. Click OK
4. Tin tức biến mất khỏi bảng

### Test 4: Upload Ảnh
1. Click "Thêm tin tức"
2. Click "Choose File"
3. Chọn ảnh (jpg, png, gif, webp)
4. Thấy text "Đang tải lên..."
5. Preview ảnh hiển thị
6. Nút "Xóa" xuất hiện trên preview

## 📞 Nếu Vẫn Có Vấn Đề

Gửi cho tôi:
1. Screenshot trang admin
2. Screenshot console log (F12 → Console)
3. Screenshot network tab (F12 → Network)
4. Output của `npm run dev`
5. Có thấy nút "Thêm tin tức" không?
6. Có thấy nút "Sửa" và "Xóa" không?
