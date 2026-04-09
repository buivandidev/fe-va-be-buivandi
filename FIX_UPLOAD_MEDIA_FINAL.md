# Sửa lỗi Upload Ảnh & Video - Hoàn tất

## Các lỗi đã phát hiện:

### 1. ❌ Lỗi CORS - Thiếu headers
**Vấn đề:** Backend chỉ cho phép headers `Content-Type` và `Authorization`, nhưng khi upload file multipart/form-data, browser gửi thêm nhiều headers khác (như `Content-Length`, boundary headers, etc.)

**Giải pháp:** Thay đổi từ `.WithHeaders("Content-Type", "Authorization")` thành `.AllowAnyHeader()`

**File:** `backend/phuongxa-api/src/PhuongXa.API/ChuongTrinh.cs`

### 2. ❌ Lỗi Frontend - Gọi API không có token
**Vấn đề:** Frontend gọi fetch trực tiếp mà không gửi token authentication

**Giải pháp:** 
- Tạo API routes trong Next.js để proxy requests đến backend
- API routes tự động lấy token từ cookies và gửi kèm request

**Files mới:**
- `frontend/src/app/api/admin/media/route.ts` - GET danh sách media
- `frontend/src/app/api/admin/media/[id]/route.ts` - DELETE media

### 3. ❌ Lỗi Frontend - Sai format tham số loại
**Vấn đề:** Frontend gửi `loai=HinhAnh` hoặc `loai=Video` nhưng backend expect enum number (0 hoặc 1)

**Giải pháp:** Đổi thành `loai=0` cho ảnh và `loai=1` cho video

**File:** `frontend/src/app/admin/(protected)/library/page.tsx`

## Các thay đổi đã thực hiện:

### Backend: `ChuongTrinh.cs`
```csharp
// TRƯỚC:
.WithHeaders("Content-Type", "Authorization")

// SAU:
.AllowAnyHeader()
```

### Frontend: `library/page.tsx`
```typescript
// TRƯỚC:
if (mediaType !== 'all') params.set('loai', mediaType === 'image' ? 'HinhAnh' : 'Video');

// SAU:
if (mediaType !== 'all') {
  params.set('loai', mediaType === 'image' ? '0' : '1');
}
```

### Frontend: Thêm token vào DELETE request
```typescript
// TRƯỚC:
await fetch(`/api/admin/media/${id}`, { method: 'DELETE' });

// SAU:
const token = localStorage.getItem('auth_token');
const res = await fetch(`/api/admin/media/${id}`, { 
  method: 'DELETE',
  headers: token ? { 'Authorization': `Bearer ${token}` } : {}
});
```

## Cách test:

1. **Khởi động lại backend:**
   ```powershell
   cd backend/phuongxa-api/src/PhuongXa.API
   dotnet run
   ```

2. **Khởi động lại frontend admin:**
   ```powershell
   cd frontend
   npm run dev
   ```

3. **Test upload:**
   - Đăng nhập vào admin: http://localhost:3001/admin/login
   - Vào Library: http://localhost:3001/admin/library
   - Chọn file ảnh hoặc video
   - Nhập tiêu đề
   - Click "Tải lên"

4. **Test xem danh sách:**
   - Kiểm tra danh sách ảnh/video hiển thị
   - Lọc theo loại (Tất cả / Ảnh / Video)
   - Tìm kiếm theo từ khóa

5. **Test xóa:**
   - Click nút "Xóa" trên một file
   - Xác nhận xóa
   - Kiểm tra file đã bị xóa

## Lưu ý:

- Upload file có giới hạn 50MB (đã cấu hình trong backend)
- Chỉ chấp nhận các định dạng:
  - Ảnh: .jpg, .jpeg, .png, .gif, .webp
  - Video: .mp4, .webm, .ogg
- Backend có validate file signature để đảm bảo an toàn
- Token được lưu trong localStorage với key `auth_token`

## Kiểm tra lỗi:

Nếu vẫn còn lỗi, kiểm tra:
1. Console browser (F12) - xem lỗi CORS hoặc 401/404
2. Backend logs - xem request có đến backend không
3. Network tab - xem request/response chi tiết
