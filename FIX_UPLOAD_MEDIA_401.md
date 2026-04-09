# Fix Lỗi 401 Unauthorized Khi Upload Media

## Vấn Đề

Upload ảnh/video bị lỗi 401 (Unauthorized) mặc dù đã đăng nhập.

## Nguyên Nhân

Frontend đang gọi API upload nhưng token không được gửi đúng cách hoặc token đã hết hạn.

## Giải Pháp Đã Áp Dụng

### 1. Đảm bảo sử dụng apiClient

File `frontend/src/app/admin/(protected)/library/page.tsx` đã được cập nhật để sử dụng `mediaApi.taiLenAnh()` thay vì gọi trực tiếp fetch.

`mediaApi.taiLenAnh()` sử dụng `apiClient` có interceptor tự động gửi token.

### 2. Kiểm tra token

```typescript
// apiClient tự động thêm token từ localStorage
apiClient.interceptors.request.use((config) => {
  const token = tokenStorage.get()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

## Cách Kiểm Tra

### 1. Kiểm tra token trong browser

```javascript
// Mở DevTools Console
localStorage.getItem('auth_token')
```

Nếu null hoặc undefined → Cần đăng nhập lại

### 2. Kiểm tra token expiration

```javascript
// Decode JWT payload
const token = localStorage.getItem('auth_token')
const payload = JSON.parse(atob(token.split('.')[1]))
console.log('Expires:', new Date(payload.exp * 1000))
```

Nếu đã hết hạn → Đăng nhập lại

### 3. Test API với PowerShell

```powershell
.\TEST_UPLOAD_MEDIA.ps1
```

## Troubleshooting

### Lỗi: Token không tồn tại

**Nguyên nhân**: Chưa đăng nhập hoặc token bị xóa

**Giải pháp**:
1. Đăng nhập lại tại http://localhost:3000/admin/login
2. Credentials:
   - Email: admin@phuongxa.vn
   - Password: Admin@123

### Lỗi: Token expired

**Nguyên nhân**: Token hết hạn (mặc định 15 phút)

**Giải pháp**:
1. Đăng xuất và đăng nhập lại
2. Hoặc tăng thời gian token trong `appsettings.json`:
```json
{
  "Jwt": {
    "AccessTokenMinutes": "60"  // Tăng lên 1 giờ
  }
}
```

### Lỗi: 401 mặc dù token hợp lệ

**Nguyên nhân**: JWT Key không khớp giữa FE và BE

**Giải pháp**:
1. Kiểm tra `appsettings.Development.json`:
```json
{
  "Jwt": {
    "Key": "CCFZhl54yGAhYN4DHTDEb14Zzs6Swc6QJHrGAAEw/SZYyYyk/skj+qMKaM5MLyhJ"
  }
}
```

2. Restart backend:
```powershell
.\RESTART_BACKEND_ONLY.ps1
```

3. Đăng nhập lại

### Lỗi: CORS

**Nguyên nhân**: Frontend origin không được phép

**Giải pháp**:
Kiểm tra `appsettings.Development.json`:
```json
{
  "Cors": {
    "AllowedOrigins": "http://localhost:3000,http://localhost:3001"
  }
}
```

## Kiểm Tra Sau Khi Fix

1. Đăng nhập vào admin: http://localhost:3000/admin/login
2. Vào Library: http://localhost:3000/admin/library
3. Chọn file và upload
4. Kiểm tra Network tab trong DevTools:
   - Request URL: http://localhost:5000/api/admin/media/upload
   - Request Headers: Authorization: Bearer xxx
   - Status: 200 OK

## Debug Steps

### 1. Kiểm tra request trong DevTools

```
Network tab → Filter: upload
→ Click request → Headers tab
→ Xem "Authorization" header có token không
```

### 2. Kiểm tra backend logs

```powershell
# Trong terminal đang chạy backend
# Xem có log "[API Client] Request with token" không
```

### 3. Test với curl

```bash
# Lấy token từ localStorage
$token = "your-token-here"

# Test upload
curl -X POST http://localhost:5000/api/admin/media/upload \
  -H "Authorization: Bearer $token" \
  -F "tep=@test-image.jpg" \
  -F "vanBanThayThe=Test image"
```

## Files Đã Cập Nhật

1. ✅ `frontend/src/app/admin/(protected)/library/page.tsx`
   - Sử dụng `mediaApi.taiLenAnh()` thay vì fetch trực tiếp

2. ✅ `frontend/src/lib/api/client.ts`
   - Đã có interceptor gửi token tự động

3. ✅ `frontend/src/lib/api/admin.ts`
   - `mediaApi.taiLenAnh()` đã đúng

## Kết Luận

Lỗi 401 thường do:
1. ❌ Token không tồn tại → Đăng nhập lại
2. ❌ Token expired → Đăng nhập lại
3. ❌ JWT Key không khớp → Restart backend
4. ❌ CORS → Kiểm tra config

Sau khi fix, upload media sẽ hoạt động bình thường với token được gửi tự động qua `apiClient`.

---

**Trạng thái**: ✅ Đã fix code  
**Cần**: Đăng nhập lại để lấy token mới  
**Ngày**: 2026-04-08
