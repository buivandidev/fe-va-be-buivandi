# Hướng dẫn sửa lỗi Upload Media - Hoàn chỉnh

## 🔍 Vấn đề phát hiện

Từ screenshot bạn gửi, có 2 lỗi chính:

1. **Lỗi 401 Unauthorized** khi gọi `/api/admin/media`
   - Token không được gửi hoặc không hợp lệ
   - User không có quyền truy cập

2. **Lỗi Rust thread pool** 
   - Hệ thống thiếu tài nguyên
   - Có thể do quá nhiều process Node.js đang chạy

## ✅ Các thay đổi đã thực hiện

### 1. File: `frontend/src/app/admin/(protected)/library/page.tsx`
- Bỏ yêu cầu bắt buộc nhập title (có thể dùng tên file)
- Cải thiện error handling để hiển thị lỗi chi tiết hơn
- Log error ra console để debug dễ dàng hơn

### 2. File: `frontend/src/components/DebugAuth.tsx` (MỚI)
- Component debug để kiểm tra token trong development
- Hiển thị thông tin token, user, role, expiry
- Giúp debug vấn đề authentication nhanh chóng

### 3. File: `frontend/src/app/admin/(protected)/layout.tsx`
- Thêm DebugAuth component vào layout
- Chỉ hiển thị trong development mode

## 🚀 Các bước khắc phục

### Bước 1: Kill tất cả Node processes (fix lỗi Rust thread pool)

```powershell
.\KILL_ALL_NODE.ps1
```

### Bước 2: Restart Backend

```powershell
cd backend\phuongxa-api\src\PhuongXa.API
dotnet run
```

Đợi backend khởi động xong (thấy "Now listening on: http://localhost:5000")

### Bước 3: Restart Frontend

```powershell
cd frontend
npm run dev
```

Đợi frontend khởi động xong (thấy "Ready in X.Xs")

### Bước 4: Test Upload

1. Mở trình duyệt: `http://localhost:3000/admin/login`

2. Đăng nhập với tài khoản admin:
   - Email: admin@phuongxa.vn
   - Password: Admin@123

3. Sau khi đăng nhập, bạn sẽ thấy một box debug ở góc dưới bên phải màn hình (chỉ trong dev mode)

4. Kiểm tra box debug:
   - ✓ Token exists: Yes (màu xanh)
   - ✓ Expired: No (màu xanh)
   - Role phải là: Admin hoặc BienTap

5. Vào trang Library: `http://localhost:3000/admin/library`

6. Mở Developer Tools (F12) > Tab Console

7. Thử upload một file (ảnh hoặc video):
   - Chọn file
   - Click "Upload" hoặc "Tải lên"

8. Kiểm tra kết quả:
   - Nếu thành công: Thấy toast "Tải lên thành công!"
   - Nếu thất bại: Xem lỗi trong console

## 🔧 Debug nếu vẫn lỗi 401

### Kiểm tra 1: Token có tồn tại không?

Mở Console (F12) và chạy:
```javascript
localStorage.getItem('auth_token')
```

- Nếu null: Đăng nhập lại
- Nếu có token: Tiếp tục kiểm tra

### Kiểm tra 2: Token có hết hạn không?

Xem box debug ở góc dưới bên phải:
- Nếu "Expired: Yes" (màu đỏ): Đăng xuất và đăng nhập lại
- Nếu "Expired: No" (màu xanh): Token còn hợp lệ

### Kiểm tra 3: Request có gửi token không?

1. Mở Developer Tools (F12) > Tab Network
2. Thử upload file
3. Click vào request `/api/admin/media/upload`
4. Xem Headers > Request Headers
5. Phải có dòng: `Authorization: Bearer <token>`

Nếu không có:
- Kiểm tra file `frontend/src/lib/api/client.ts`
- Interceptor có chạy không?

### Kiểm tra 4: User có đúng role không?

Endpoint `/api/admin/media/upload` yêu cầu role:
- Admin HOẶC
- BienTap

Kiểm tra trong box debug hoặc console:
```javascript
const token = localStorage.getItem('auth_token')
const payload = JSON.parse(atob(token.split('.')[1]))
console.log('Role:', payload.role)
```

Nếu role không đúng:
- Đăng nhập với tài khoản admin khác
- Hoặc cập nhật role trong database

### Kiểm tra 5: JWT Secret Key có khớp không?

Backend và Frontend phải dùng cùng JWT secret key.

Kiểm tra backend:
```powershell
cd backend\phuongxa-api\src\PhuongXa.API
cat appsettings.json | Select-String "Jwt:Key"
```

Nếu key khác nhau:
- Restart backend sau khi sửa
- Đăng xuất và đăng nhập lại để lấy token mới

## 📝 Script hỗ trợ

### Test upload debug:
```powershell
.\TEST_UPLOAD_DEBUG.ps1
```

### Restart tất cả servers:
```powershell
.\RESTART_ALL_SERVERS.ps1
```

## 🎯 Kết quả mong đợi

Sau khi làm theo các bước trên:

1. ✅ Backend chạy ổn định trên port 5000
2. ✅ Frontend chạy ổn định trên port 3000
3. ✅ Đăng nhập thành công
4. ✅ Box debug hiển thị token hợp lệ
5. ✅ Upload ảnh/video thành công
6. ✅ File hiển thị trong thư viện

## 🆘 Nếu vẫn không được

Chạy lệnh sau và gửi output cho tôi:

```powershell
# Kiểm tra processes
Get-Process | Where-Object {$_.ProcessName -like "*node*" -or $_.ProcessName -like "*dotnet*"} | Format-Table ProcessName, Id, CPU, WorkingSet

# Kiểm tra ports
netstat -ano | Select-String ":3000|:5000"

# Test API
curl http://localhost:5000/api/admin/media/albums -v
```

Hoặc chụp màn hình:
1. Box debug (góc dưới bên phải)
2. Console log khi upload
3. Network tab > Request headers của `/api/admin/media/upload`

## 📚 Tài liệu tham khảo

- Backend endpoint: `backend/phuongxa-api/src/PhuongXa.API/Controllers/Admin/AdminMediaController.cs`
- Frontend API client: `frontend/src/lib/api/admin.ts`
- Authentication config: `backend/phuongxa-api/src/PhuongXa.API/ChuongTrinh.cs`
- Token storage: `frontend/src/lib/auth/token.ts`
