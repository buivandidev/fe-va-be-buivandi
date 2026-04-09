# Fix Trang Quản Lý Tin Tức Admin

## ✅ Đã Sửa

### 1. Đổi tên từ "Bài viết" → "Tin tức"
- ✅ Tiêu đề trang: "Quản lý tin tức"
- ✅ Nút thêm: "Thêm tin tức"
- ✅ Modal: "Thêm tin tức mới" / "Cập nhật tin tức"
- ✅ Menu sidebar: "Tin tức"
- ✅ Dashboard: "Tổng tin tức", "Tin tức đã xuất bản", "Tin tức chờ duyệt"
- ✅ Biểu đồ: "Xu hướng tin tức"

### 2. Thêm Console Log để Debug
- ✅ Log khi load tin tức
- ✅ Log khi thành công
- ✅ Log khi có lỗi

## 📋 Các Chức Năng Có Sẵn

Trang quản lý tin tức đã có ĐẦY ĐỦ các chức năng:

### ✅ Nút Thêm Tin Tức
- Vị trí: Góc phải trên cùng
- Text: "+ Thêm tin tức"
- Màu: Xanh brand
- Click → Mở modal thêm tin tức

### ✅ Nút Sửa
- Vị trí: Cột "Thao tác" trong bảng
- Text: "Sửa"
- Màu: Xanh brand
- Click → Mở modal sửa tin tức

### ✅ Nút Xóa
- Vị trí: Cột "Thao tác" trong bảng
- Text: "Xóa"
- Màu: Đỏ
- Click → Confirm → Xóa tin tức

### ✅ Duyệt Tin Tức
- Cách: Sửa tin tức → Chọn trạng thái "Đã xuất bản"
- Hoặc: Chọn trạng thái khác (Nháp, Chờ duyệt, Từ chối)

## 🔍 Debug - Kiểm Tra Console

Mở DevTools (F12) → Tab Console, bạn sẽ thấy:

```
🔍 Loading articles... { search: '', filterStatus: '', filterCategory: '', page: 1 }
✅ Articles loaded: { danhSach: [...], tongSo: X, trang: 1, kichThuocTrang: 10 }
```

Nếu có lỗi:
```
❌ Error loading articles: [error message]
```

## 🐛 Nếu Vẫn Hiển Thị "Không có dữ liệu"

### Kiểm tra 1: Backend có chạy không?
```powershell
# Kiểm tra backend
curl http://localhost:5000/api/admin/articles/admin
```

### Kiểm tra 2: Token có hợp lệ không?
- Mở DevTools → Application → Local Storage
- Kiểm tra có key "token" không
- Nếu không có → Đăng nhập lại

### Kiểm tra 3: Database có dữ liệu không?
```sql
SELECT * FROM BaiViets;
```

### Kiểm tra 4: API endpoint đúng không?
File `frontend/src/lib/api/admin.ts`:
```typescript
async layDanhSach(params: {...}): Promise<KetQuaPhanTrang<BaiViet>> {
  const res = await apiClient.get('/api/admin/articles/admin', { params })
  return unwrapApi<KetQuaPhanTrang<BaiViet>>(res)
}
```

## 📝 Các File Đã Thay Đổi

1. ✅ `frontend/src/app/admin/(protected)/articles/page.tsx`
   - Đổi tiêu đề "Quản lý tin tức"
   - Đổi nút "Thêm tin tức"
   - Đổi modal "Thêm tin tức mới" / "Cập nhật tin tức"
   - Thêm console.log

2. ✅ `frontend/src/app/admin/(protected)/layout.tsx`
   - Đổi menu "Tin tức"

3. ✅ `frontend/src/app/admin/(protected)/dashboard/page.tsx`
   - Đổi "Tổng tin tức"
   - Đổi "Tin tức đã xuất bản"
   - Đổi "Tin tức chờ duyệt"
   - Đổi "Xu hướng tin tức"
   - Đổi "Quản lý tin tức"

## 🎯 Hướng Dẫn Sử Dụng

### Thêm Tin Tức Mới
1. Click nút "Thêm tin tức" (góc phải trên)
2. Nhập thông tin:
   - Tiêu đề (bắt buộc)
   - Tóm tắt
   - Nội dung (bắt buộc)
   - Upload ảnh hoặc nhập URL
   - Chọn danh mục
   - Chọn trạng thái
3. Click "Thêm mới"

### Sửa Tin Tức
1. Click nút "Sửa" trên tin tức cần sửa
2. Thay đổi thông tin
3. Click "Cập nhật"

### Xóa Tin Tức
1. Click nút "Xóa" trên tin tức cần xóa
2. Confirm trong popup
3. Tin tức sẽ bị xóa

### Duyệt Tin Tức
1. Click nút "Sửa" trên tin tức
2. Chọn trạng thái:
   - **Nháp**: Tin tức đang soạn thảo
   - **Chờ duyệt**: Gửi để admin duyệt
   - **Đã xuất bản**: Hiển thị công khai
   - **Từ chối**: Không duyệt
3. Click "Cập nhật"

## ✅ Kết Luận

Trang quản lý tin tức admin đã có ĐẦY ĐỦ các chức năng:
- ✅ Nút "Thêm tin tức" (góc phải trên)
- ✅ Nút "Sửa" (trong bảng)
- ✅ Nút "Xóa" (trong bảng)
- ✅ Duyệt tin tức (thông qua trạng thái)
- ✅ Upload ảnh
- ✅ Tìm kiếm
- ✅ Lọc theo trạng thái
- ✅ Lọc theo danh mục
- ✅ Phân trang

Nếu vẫn hiển thị "Không có dữ liệu", hãy:
1. Kiểm tra console log (F12)
2. Kiểm tra backend có chạy không
3. Kiểm tra token có hợp lệ không
4. Kiểm tra database có dữ liệu không
