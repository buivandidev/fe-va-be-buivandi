# Hướng dẫn sửa lỗi Upload Media

## Vấn đề phát hiện:
1. **Lỗi 401 Unauthorized** - Token không được gửi hoặc không hợp lệ
2. **Lỗi Rust thread pool** - Hệ thống thiếu tài nguyên

## Các bước sửa lỗi:

### 1. Kiểm tra Token
- Mở Developer Tools (F12) trong trình duyệt
- Vào tab Application > Local Storage
- Kiểm tra xem có key `auth_token` không
- Nếu không có, đăng nhập lại

### 2. Kiểm tra Request Headers
- Mở Developer Tools (F12)
- Vào tab Network
- Thử upload một file
- Click vào request `/api/admin/media/upload`
- Kiểm tra Headers > Request Headers
- Phải có: `Authorization: Bearer <token>`

### 3. Restart Backend nếu cần
```powershell
# Kill tất cả Node processes
.\KILL_ALL_NODE.ps1

# Restart backend
cd backend\phuongxa-api\src\PhuongXa.API
dotnet run
```

### 4. Test Upload
1. Đăng nhập vào admin panel
2. Vào trang Library (/admin/library)
3. Chọn file (ảnh hoặc video)
4. Click Upload
5. Kiểm tra console log để xem lỗi chi tiết

## Thay đổi đã thực hiện:

### File: `frontend/src/app/admin/(protected)/library/page.tsx`
- Bỏ yêu cầu bắt buộc nhập title (có thể dùng tên file)
- Cải thiện error handling để hiển thị lỗi chi tiết hơn
- Log error ra console để debug

## Kiểm tra Backend Authorization:

Endpoint `/api/admin/media/upload` yêu cầu:
- `[Authorize(Roles = HangSoPhanQuyen.QuanTriHoacBienTap)]`
- User phải có role: Admin hoặc BienTap

## Nếu vẫn lỗi 401:
1. Kiểm tra JWT secret key giữa frontend và backend có khớp không
2. Kiểm tra token có hết hạn không
3. Kiểm tra user có đúng role không
4. Đăng xuất và đăng nhập lại
