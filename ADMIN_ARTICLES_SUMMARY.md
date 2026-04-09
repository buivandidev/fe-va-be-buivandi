# Tóm Tắt - Trang Quản Lý Bài Viết Admin

## ✅ Các Chức Năng Đã Có

### 1. Quản Lý Bài Viết
- ✅ **Xem danh sách bài viết** - Hiển thị bảng với đầy đủ thông tin
- ✅ **Thêm bài viết mới** - Modal với form đầy đủ
- ✅ **Sửa bài viết** - Load dữ liệu và cập nhật
- ✅ **Xóa bài viết** - Có confirm trước khi xóa
- ✅ **Tìm kiếm bài viết** - Theo tiêu đề
- ✅ **Lọc theo trạng thái** - Nháp, Chờ duyệt, Đã xuất bản, Từ chối
- ✅ **Lọc theo danh mục** - Dropdown danh mục
- ✅ **Phân trang** - Nút Trước/Sau với hiển thị trang hiện tại

### 2. Form Thêm/Sửa Bài Viết
- ✅ **Tiêu đề** (bắt buộc)
- ✅ **Tóm tắt** (tùy chọn)
- ✅ **Nội dung** (bắt buộc) - Textarea lớn, hỗ trợ HTML
- ✅ **Danh mục** (bắt buộc) - Dropdown
- ✅ **Trạng thái** - Dropdown với 4 trạng thái
- ✅ **Ảnh đại diện** - Có 2 cách:
  - 🆕 Upload file ảnh (mới thêm)
  - Nhập URL ảnh

### 3. Upload Ảnh (MỚI THÊM)
- ✅ **Chọn file ảnh** - Input type="file"
- ✅ **Preview ảnh** - Hiển thị ảnh sau khi upload
- ✅ **Xóa ảnh** - Nút xóa trên preview
- ✅ **Validate file type** - Chỉ chấp nhận ảnh
- ✅ **Validate file size** - Tối đa 5MB
- ✅ **Loading state** - Hiển thị "Đang tải lên..."
- ✅ **Error handling** - Hiển thị lỗi nếu upload thất bại

## 📁 Các File Đã Thay Đổi

### 1. Frontend API
**File:** `frontend/src/lib/api/admin.ts`

✅ Thêm `mediaApi` với function:
```typescript
export const mediaApi = {
  async taiLenAnh(file: File, albumId?: string, vanBanThayThe?: string): Promise<PhuongTien> {
    const formData = new FormData()
    formData.append('tep', file)
    if (albumId) formData.append('albumId', albumId)
    if (vanBanThayThe) formData.append('vanBanThayThe', vanBanThayThe)
    
    const res = await apiClient.post('/api/admin/media/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return unwrapApi<PhuongTien>(res)
  }
}
```

✅ Thêm interface `PhuongTien`:
```typescript
export interface PhuongTien {
  id: string
  tenTep: string
  duongDanTep: string
  urlTep: string
  kichThuocTep: number
  loaiNoiDung?: string
  loai: 'HinhAnh' | 'Video' | 'TaiLieu'
  vanBanThayThe?: string
  albumId?: string
  nguoiTaiLenId: string
  ngayTao: string
}
```

### 2. Trang Quản Lý Bài Viết
**File:** `frontend/src/app/admin/(protected)/articles/page.tsx`

✅ Import `mediaApi`:
```typescript
import { articlesApi, categoriesApi, mediaApi, ... } from '@/lib/api/admin'
```

✅ Thêm state `uploadingImage`:
```typescript
const [uploadingImage, setUploadingImage] = useState(false)
```

✅ Thêm function `handleImageUpload`:
```typescript
const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0]
  if (!file) return

  // Validate file type
  if (!file.type.startsWith('image/')) {
    setFormError('Vui lòng chọn file ảnh (jpg, png, gif, webp)')
    return
  }

  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    setFormError('Kích thước ảnh không được vượt quá 5MB')
    return
  }

  setUploadingImage(true)
  setFormError(null)

  try {
    const media = await mediaApi.taiLenAnh(file)
    setFormData({ ...formData, anhDaiDien: media.urlTep })
  } catch (err) {
    setFormError(getApiErrorMessage(err))
  } finally {
    setUploadingImage(false)
  }
}
```

✅ Cập nhật UI form ảnh đại diện:
- Preview ảnh nếu có URL
- Nút xóa ảnh
- Input file để upload
- Loading state khi đang upload
- Input URL để nhập thủ công

## 🎯 Cách Sử Dụng

### Thêm Bài Viết Mới
1. Click nút "Thêm bài viết"
2. Nhập tiêu đề, tóm tắt, nội dung
3. Chọn danh mục và trạng thái
4. **Upload ảnh đại diện:**
   - Cách 1: Click "Choose File" → Chọn ảnh → Tự động upload
   - Cách 2: Nhập URL ảnh vào ô input
5. Click "Thêm mới"

### Sửa Bài Viết
1. Click nút "Sửa" trên bài viết
2. Form sẽ load dữ liệu hiện tại
3. Thay đổi thông tin cần sửa
4. **Thay đổi ảnh:**
   - Click nút "Xóa" trên preview để xóa ảnh cũ
   - Upload ảnh mới hoặc nhập URL mới
5. Click "Cập nhật"

### Xóa Bài Viết
1. Click nút "Xóa" trên bài viết
2. Confirm trong popup
3. Bài viết sẽ bị xóa

## 🔧 Backend API

Backend đã có sẵn API upload:
- **Endpoint:** `POST /api/admin/media/upload`
- **Authorization:** Yêu cầu role Admin hoặc Editor
- **Request:** FormData với field `tep` (file)
- **Response:** Object `PhuongTien` với `urlTep`
- **Giới hạn:** 50MB, rate limit
- **Định dạng hỗ trợ:** jpg, jpeg, png, gif, webp, mp4, webm, ogg

## ✅ Checklist Hoàn Thành

- [x] Thêm `mediaApi` vào `admin.ts`
- [x] Thêm interface `PhuongTien`
- [x] Import `mediaApi` vào trang articles
- [x] Thêm state `uploadingImage`
- [x] Thêm function `handleImageUpload`
- [x] Cập nhật UI form ảnh đại diện
- [x] Thêm preview ảnh
- [x] Thêm nút xóa ảnh
- [x] Thêm validate file type
- [x] Thêm validate file size
- [x] Thêm loading state
- [x] Thêm error handling
- [x] Không có lỗi TypeScript

## 🚀 Kết Luận

Trang quản lý bài viết admin đã có **ĐẦY ĐỦ** các chức năng:
- ✅ Thêm bài viết
- ✅ Sửa bài viết
- ✅ Xóa bài viết
- ✅ Tìm kiếm
- ✅ Lọc theo trạng thái
- ✅ Lọc theo danh mục
- ✅ Phân trang
- ✅ **Upload ảnh** (mới thêm)

Không còn thiếu chức năng nào! 🎉
