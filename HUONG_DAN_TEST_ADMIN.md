# Hướng dẫn Test và Debug Admin Panel

## Bước 1: Kiểm tra các service đang chạy

```powershell
# Kiểm tra backend
curl http://localhost:5000/api/health

# Kiểm tra frontend admin
curl http://localhost:3000

# Kiểm tra frontend người dân
curl http://localhost:3001
```

## Bước 2: Test API trực tiếp (Backend)

```powershell
# Chạy script test backend
./TEST_ADMIN_FULL.ps1
```

Kết quả mong đợi: Tất cả 5 tests PASS

## Bước 3: Test qua Browser

### 3.1. Truy cập trang test API
1. Mở browser: http://localhost:3000/admin/test-api
2. Mở Developer Tools (F12)
3. Chuyển sang tab Console

### 3.2. Test từng bước
1. Click "1. Test Login"
   - Kiểm tra console log: `[API Client] Request with token`
   - Kiểm tra kết quả: "✓ Login successful! Token saved to localStorage"

2. Click "2. Check Token"
   - Kiểm tra kết quả: "✓ Token found in localStorage"
   - Xem token hiển thị

3. Click "3. Test Users API"
   - Kiểm tra console log: `[API Client] Request with token: GET /api/admin/users`
   - Kiểm tra console log: `[API Client] Response: 200 GET /api/admin/users`
   - Kiểm tra kết quả: "✓ Users API successful! Got X users"

4. Click "4. Test Dashboard API"
   - Kiểm tra console log tương tự
   - Kiểm tra kết quả: "✓ Dashboard API successful!"

### 3.3. Nếu có lỗi
Kiểm tra console logs để xem:
- `[API Client] No token found` → Chưa login hoặc token bị xóa
- `[API Client] Response error: 401` → Token không hợp lệ hoặc hết hạn
- `[API Client] Response error: 404` → API endpoint không tồn tại
- `Network Error` → Backend không chạy hoặc CORS issue

## Bước 4: Test trang Users thực tế

1. Truy cập: http://localhost:3000/admin/login
2. Đăng nhập:
   - Email: `admin@phuongxa.vn`
   - Mật khẩu: `Admin@123456!Secure`
3. Sau khi đăng nhập, mở Developer Tools (F12)
4. Chuyển sang tab Console
5. Click vào menu "Người dùng"
6. Kiểm tra console logs:
   ```
   [API Client] Request with token: GET /api/admin/users?trang=1&kichThuocTrang=10
   [API Client] Response: 200 GET /api/admin/users?trang=1&kichThuocTrang=10
   ```

## Bước 5: Kiểm tra Network Tab

1. Mở Developer Tools (F12)
2. Chuyển sang tab Network
3. Reload trang Users
4. Tìm request đến `/api/admin/users`
5. Click vào request đó
6. Kiểm tra:
   - **Request Headers**: Phải có `Authorization: Bearer <token>`
   - **Response**: Status 200, có dữ liệu users
   - **Response Headers**: Có `Access-Control-Allow-Origin`

## Các vấn đề thường gặp

### Lỗi: "Network Error"
**Nguyên nhân:**
- Backend không chạy
- CORS chưa được cấu hình đúng
- URL không đúng

**Cách fix:**
```powershell
# Kiểm tra backend
curl http://localhost:5000/api/health

# Kiểm tra CORS
curl -X OPTIONS http://localhost:5000/api/admin/users `
  -H "Origin: http://localhost:3000" `
  -H "Access-Control-Request-Method: GET"
```

### Lỗi: "No token found in localStorage"
**Nguyên nhân:**
- Chưa đăng nhập
- Token bị xóa
- Login không lưu token

**Cách fix:**
1. Logout và login lại
2. Kiểm tra localStorage trong Developer Tools:
   - Application tab → Local Storage → http://localhost:3000
   - Phải có key `auth_token`

### Lỗi: 401 Unauthorized
**Nguyên nhân:**
- Token không hợp lệ
- Token hết hạn
- Token không được gửi trong header

**Cách fix:**
1. Logout và login lại
2. Kiểm tra Network tab xem có header Authorization không

### Lỗi: 404 Not Found
**Nguyên nhân:**
- API endpoint không tồn tại
- Route sai

**Cách fix:**
Kiểm tra backend logs xem request đến endpoint nào:
```powershell
# Xem logs backend
# Tìm dòng: HTTP GET /api/admin/... phan hoi 404
```

## Debug Checklist

- [ ] Backend đang chạy (port 5000)
- [ ] Frontend admin đang chạy (port 3000)
- [ ] Đã login thành công
- [ ] Token được lưu trong localStorage
- [ ] API request có header Authorization
- [ ] CORS headers có trong response
- [ ] Backend logs không có lỗi 404 hoặc 401

## Liên hệ

Nếu vẫn gặp vấn đề, gửi screenshot của:
1. Browser console logs
2. Network tab (request/response)
3. Backend logs
