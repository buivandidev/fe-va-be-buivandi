# Hướng dẫn Debug lỗi đăng nhập

## Các thay đổi đã thực hiện

### 1. Cải thiện logging trong trang đăng nhập
- ✅ Thêm log để xem response từ API
- ✅ Thêm log để xem token được extract

### 2. Cải thiện Header component
- ✅ Chỉ xóa token khi nhận 401 (Unauthorized)
- ✅ Giữ token khi gặp lỗi server (500, 503)
- ✅ Thêm log chi tiết hơn

## Cách test

### Bước 1: Mở DevTools Console
Mở trình duyệt và bấm F12 để mở Console

### Bước 2: Đăng nhập
1. Vào http://localhost:3001/dang-nhap
2. Nhập:
   - Email: `admin@phuongxa.vn`
   - Password: `Admin@123456!Secure`
3. Bấm Đăng nhập

### Bước 3: Xem logs trong Console
Bạn sẽ thấy các log như:
```
📦 Login response: { status: true, payload: {...} }
🔑 Extracted token: eyJhbGciOiJIUzI1NiIsInR5cCI...
✅ Đăng nhập thành công, token: eyJhbGciOiJIUzI1NiIsInR5cCI...
🔄 Chuyển hướng đến: /ca-nhan
```

### Bước 4: Kiểm tra Header
Sau khi đăng nhập, Header sẽ gọi API profile:
```
🔐 Header: Checking auth, token: EXISTS
📡 Header: Profile API status: 200
📡 Header: Profile API response: { ok: true, success: true, hasData: true }
✅ Header: Authenticated as [Tên người dùng]
```

## Các lỗi có thể gặp

### Lỗi 1: Token không được lưu
**Triệu chứng**: Log hiển thị `🔑 Extracted token: NONE`

**Nguyên nhân**: Backend không trả về token hoặc cấu trúc response sai

**Giải pháp**: Kiểm tra backend response structure

### Lỗi 2: Token invalid (401)
**Triệu chứng**: 
```
📡 Header: Profile API status: 401
⚠️ Header: Token invalid (401), clearing...
```

**Nguyên nhân**: 
- Token hết hạn (mặc định 15 phút)
- JWT Key không khớp giữa tạo token và validate
- Token bị corrupt

**Giải pháp**: 
1. Kiểm tra JWT Key trong appsettings.Development.json
2. Restart backend
3. Đăng nhập lại

### Lỗi 3: Server error (500)
**Triệu chứng**:
```
📡 Header: Profile API status: 500
⚠️ Header: API error but keeping token, status: 500
```

**Nguyên nhân**: Lỗi trong ProfileController

**Giải pháp**: Kiểm tra logs backend

## Kiểm tra token trong localStorage

Mở Console và chạy:
```javascript
localStorage.getItem('token')
```

Nếu có token, bạn sẽ thấy một chuỗi dài bắt đầu bằng `eyJ...`

## Decode JWT token

Vào https://jwt.io và paste token để xem nội dung:
- `nameid`: User ID (GUID)
- `email`: Email người dùng
- `name`: Tên người dùng
- `role`: Vai trò (Admin, User, etc.)
- `exp`: Thời gian hết hạn (Unix timestamp)

## Backend endpoints cần kiểm tra

1. POST `/api/auth/login` - Đăng nhập
   - Input: `{ email, matKhau }`
   - Output: `{ ThanhCong, DuLieu: { MaTruyCap, ... } }`

2. GET `/api/public/profile` - Lấy thông tin user
   - Header: `Authorization: Bearer {token}`
   - Output: `{ ThanhCong, DuLieu: { HoTen, Email, ... } }`

## Test bằng curl

### Test login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@phuongxa.vn","matKhau":"Admin@123456!Secure"}' \
  | jq
```

### Test profile (thay YOUR_TOKEN)
```bash
curl http://localhost:5000/api/public/profile \
  -H "Authorization: Bearer YOUR_TOKEN" \
  | jq
```
