# Fix Admin Authentication - Hoàn tất

## Vấn đề đã phát hiện

Trang Admin bị lỗi "Network Error" khi tải dữ liệu vì:

1. **Frontend gọi API với cookie httpOnly** - JavaScript không thể đọc cookie để gửi trong Authorization header
2. **Backend yêu cầu JWT token trong Authorization header** - Không chấp nhận cookie
3. **Mismatch giữa cách lưu trữ và gửi token**

## Các thay đổi đã thực hiện

### 1. API Client - Thêm Authorization Header
**File: `frontend/src/lib/api/client.ts`**
- Thêm request interceptor để tự động gửi token từ localStorage
- Token được gửi trong header `Authorization: Bearer <token>`

### 2. Login Route - Trả về token cho client
**File: `frontend/src/app/api/admin/login/route.ts`**
- Thêm token vào response JSON để client có thể lưu vào localStorage
- Vẫn giữ cookie để tương thích với server-side rendering

### 3. Login Page - Lưu token vào localStorage
**File: `frontend/src/app/admin/login/page.tsx`**
- Sau khi đăng nhập thành công, lưu token vào localStorage
- Token sẽ được API client tự động sử dụng cho các request tiếp theo

### 4. Logout Button Component
**File: `frontend/src/components/admin/LogoutButton.tsx`** (MỚI)
- Component client-side để xử lý logout
- Xóa token từ localStorage
- Gọi API logout server-side
- Redirect về trang login

### 5. Admin Layout - Sử dụng LogoutButton
**File: `frontend/src/app/admin/(protected)/layout.tsx`**
- Thay form logout bằng LogoutButton component
- Đảm bảo token được xóa khi logout

## Kết quả kiểm tra

✅ Tất cả 5 tests đều PASS:
1. ✓ Đăng nhập Admin thành công
2. ✓ Lấy thống kê dashboard (5 người dùng, 4 đơn ứng)
3. ✓ Lấy danh sách người dùng (5 users)
4. ✓ Lấy danh sách đơn ứng (4 applications)
5. ✓ Lấy danh sách bài viết (0 articles)

## Hướng dẫn sử dụng

### Đăng nhập Admin
1. Truy cập: http://localhost:3000/admin/login
2. Đăng nhập với:
   - Email: `admin@phuongxa.vn`
   - Mật khẩu: `Admin@123456!Secure`
3. Token sẽ được lưu tự động vào localStorage
4. Tất cả API calls sẽ tự động gửi token trong Authorization header

### Luồng hoạt động
```
1. User nhập email/password
   ↓
2. Frontend gọi /api/admin/login (Next.js API route)
   ↓
3. Next.js route gọi backend /api/auth/login
   ↓
4. Backend trả về token
   ↓
5. Next.js route:
   - Lưu token vào cookie (httpOnly) cho SSR
   - Trả token về client trong JSON
   ↓
6. Client lưu token vào localStorage
   ↓
7. Mọi API call sau đó:
   - API client tự động đọc token từ localStorage
   - Gửi trong header: Authorization: Bearer <token>
   ↓
8. Backend xác thực token và trả về dữ liệu
```

## Chạy lại test

```powershell
# Test backend APIs
./TEST_ADMIN_FULL.ps1

# Hoặc test thủ công trên browser
# 1. Mở http://localhost:3000/admin/login
# 2. Đăng nhập
# 3. Kiểm tra các trang:
#    - Dashboard: http://localhost:3000/admin/dashboard
#    - Người dùng: http://localhost:3000/admin/users
#    - Đơn ứng: http://localhost:3000/admin/applications
#    - Bài viết: http://localhost:3000/admin/articles
```

## Lưu ý quan trọng

1. **Token được lưu ở 2 nơi:**
   - localStorage: Cho client-side API calls
   - Cookie (httpOnly): Cho server-side rendering

2. **Khi logout:**
   - Phải xóa cả localStorage và cookie
   - LogoutButton component đã xử lý điều này

3. **Bảo mật:**
   - Token trong localStorage có thể bị XSS attack
   - Cần đảm bảo không có lỗ hổng XSS trong ứng dụng
   - Cookie httpOnly an toàn hơn nhưng không dùng được cho client-side calls

## Các file đã thay đổi

1. ✏️ `frontend/src/lib/api/client.ts` - Thêm Authorization header interceptor
2. ✏️ `frontend/src/app/api/admin/login/route.ts` - Trả token trong response
3. ✏️ `frontend/src/app/admin/login/page.tsx` - Lưu token vào localStorage
4. ✏️ `frontend/src/app/admin/(protected)/layout.tsx` - Dùng LogoutButton
5. ✨ `frontend/src/components/admin/LogoutButton.tsx` - Component logout mới
6. ✨ `TEST_ADMIN_FULL.ps1` - Script test đầy đủ

## Ngày hoàn thành
2026-04-07
