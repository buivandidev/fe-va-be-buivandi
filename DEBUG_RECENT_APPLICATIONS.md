# Debug: Hồ sơ gần đây không hiển thị

## Vấn đề
- Trang "Tra cứu hồ sơ" hiển thị được hồ sơ
- Trang "Cá nhân" (dashboard) không hiển thị "Hồ sơ gần đây"
- Hiển thị "Chưa có hồ sơ nào gần đây"

## Nguyên nhân có thể

### 1. Token không hợp lệ
- Token hết hạn
- Token không được gửi trong request
- Token format sai

### 2. API endpoint khác nhau
- Tra cứu: `/api/public/applications/track`
- Dashboard: `/api/public/applications?trang=1&kichThuocTrang=100`

### 3. Authorization issue
- Endpoint yêu cầu `[Authorize]`
- User không có quyền truy cập

## Kiểm tra

### Bước 1: Mở Browser Console
```
1. Mở http://localhost:3001/ca-nhan
2. F12 → Console tab
3. Tìm các log:
   - 🔐 Token: ...
   - 📡 API Responses: ...
   - 📋 Applications list: ...
   - ✅ Normalized applications: ...
```

### Bước 2: Kiểm tra Network tab
```
1. F12 → Network tab
2. Filter: XHR
3. Tìm request: /api/public/applications
4. Kiểm tra:
   - Status code (200, 401, 403?)
   - Request Headers (có Authorization?)
   - Response body (có data?)
```

### Bước 3: Test API trực tiếp
```powershell
# Lấy token từ localStorage (F12 → Console)
# localStorage.getItem('token')

# Test API
$token = "YOUR_TOKEN_HERE"
$headers = @{ "Authorization" = "Bearer $token" }
Invoke-RestMethod -Uri "http://localhost:5000/api/public/applications?trang=1&kichThuocTrang=10" -Headers $headers
```

## Console logs hiện có

Code đã có sẵn console.log:

```typescript
console.log('🔐 Token:', localStorage.getItem('token') ? 'Có token' : 'Không có token');
console.log('📡 API Responses:', { profile, apps, notifications });
console.log('📋 Applications list:', list);
console.log('✅ Normalized applications:', normalized);
console.log('📈 Stats:', { total, dangXuLy, hoanThanh });
```

## Các trường hợp

### Case 1: Token hết hạn
**Triệu chứng:**
- API trả về 401 Unauthorized
- Console: "📡 API Responses: { apps: { status: 401, ok: false } }"

**Giải pháp:**
- Đăng xuất và đăng nhập lại
- Kiểm tra JWT expiration time

### Case 2: API không trả về data
**Triệu chứng:**
- API trả về 200 OK
- Nhưng `danhSach` hoặc `DanhSach` là null/undefined
- Console: "📋 Applications list: []"

**Giải pháp:**
- Kiểm tra response format
- Kiểm tra mapping `danhSach` vs `DanhSach`

### Case 3: User chưa có hồ sơ nào
**Triệu chứng:**
- API trả về 200 OK
- `danhSach` = []
- Console: "✅ Normalized applications: []"

**Giải pháp:**
- Nộp hồ sơ mới từ trang dịch vụ công
- Hoặc dùng tài khoản khác có hồ sơ

### Case 4: Filter logic sai
**Triệu chứng:**
- API trả về data
- Nhưng sau khi filter thì không còn gì
- Console: "📋 Applications list: [...]" nhưng "✅ Normalized applications: []"

**Giải pháp:**
- Kiểm tra logic filter trong code
- Kiểm tra `maTheoDoi` có giá trị không

## Hướng dẫn debug chi tiết

### 1. Kiểm tra token
```javascript
// Trong browser console (F12)
const token = localStorage.getItem('token');
console.log('Token:', token);

// Decode JWT (không cần secret)
const payload = JSON.parse(atob(token.split('.')[1]));
console.log('Token payload:', payload);
console.log('Expiration:', new Date(payload.exp * 1000));
console.log('Is expired?', Date.now() > payload.exp * 1000);
```

### 2. Kiểm tra API response
```javascript
// Trong browser console
const token = localStorage.getItem('token');
const response = await fetch('http://localhost:5000/api/public/applications?trang=1&kichThuocTrang=10', {
  headers: { 'Authorization': `Bearer ${token}` }
});
const data = await response.json();
console.log('API Response:', data);
```

### 3. Kiểm tra data mapping
```javascript
// Kiểm tra structure
console.log('Has danhSach?', data.duLieu?.danhSach);
console.log('Has DanhSach?', data.duLieu?.DanhSach);
console.log('Is array?', Array.isArray(data.duLieu?.danhSach || data.duLieu?.DanhSach));
```

## Fix tạm thời

Nếu vấn đề là token hết hạn:
```
1. Đăng xuất: Click "Đăng xuất" ở sidebar
2. Đăng nhập lại với:
   - Email: buivandii@gmail.com
   - Password: (mật khẩu của bạn)
3. Vào lại trang cá nhân
```

Nếu vấn đề là chưa có hồ sơ:
```
1. Vào: http://localhost:3001/dich-vu-cong
2. Chọn một dịch vụ
3. Nộp hồ sơ mới
4. Quay lại trang cá nhân
```

## Cần làm gì tiếp

1. Mở browser console và chụp màn hình các log
2. Mở Network tab và chụp màn hình request/response
3. Gửi thông tin để tôi phân tích chi tiết hơn

## Expected behavior

Khi hoạt động đúng, console sẽ hiển thị:
```
🔐 Token: Có token
📡 API Responses: { 
  profile: { status: 200, ok: true },
  apps: { status: 200, ok: true },
  notifications: { status: 200, ok: true }
}
📋 Applications list: [{ maTheoDoi: "...", tenDichVu: "...", ... }]
✅ Normalized applications: [{ maHoSo: "...", tenThuTuc: "...", ... }]
📈 Stats: { total: 3, dangXuLy: 1, hoanThanh: 2 }
```

Và trang sẽ hiển thị 3 hồ sơ gần đây trong bảng.
