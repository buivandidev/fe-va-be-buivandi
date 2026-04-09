# ✅ FIX: Token hết hạn - 401 Unauthorized

## Vấn đề tìm ra!

Console log cho thấy:
```
GET http://localhost:5000/api/public/profile
ERR_ABORTED 401 (Unauthorized)

Header: Token invalid (401), clearing...

GET http://localhost:5000/api/public/applications
401 (Unauthorized)
```

## Nguyên nhân

Token JWT đã **HẾT HẠN** hoặc **KHÔNG HỢP LỆ**.

JWT tokens có thời gian sống (expiration time). Sau khi hết hạn, backend sẽ trả về 401 Unauthorized.

## Giải pháp

### Đăng xuất và đăng nhập lại

```
1. Click "Đăng xuất" ở sidebar trang cá nhân
   Hoặc vào: http://localhost:3001/dang-nhap

2. Đăng nhập lại:
   Email: buivandii@gmail.com
   Password: (mật khẩu của bạn)

3. Vào lại trang cá nhân: http://localhost:3001/ca-nhan

4. Hồ sơ sẽ hiển thị!
```

## Tại sao token hết hạn?

JWT token có `exp` (expiration) claim. Ví dụ:
```json
{
  "exp": 1744252500,  // Unix timestamp
  "email": "buivandii@gmail.com",
  ...
}
```

Khi `Date.now() > exp * 1000`, token hết hạn.

## Kiểm tra token expiration

Trong browser console:
```javascript
const token = localStorage.getItem('token');
const payload = JSON.parse(atob(token.split('.')[1]));
const exp = new Date(payload.exp * 1000);
console.log('Token expires at:', exp);
console.log('Is expired?', Date.now() > payload.exp * 1000);
```

## Auto-logout khi token hết hạn

Code đã có logic tự động clear token:
```typescript
// Header.tsx:40
⚠️ Header: Token invalid (401), clearing...
```

Nhưng không redirect về trang đăng nhập. Có thể cải thiện:

```typescript
if (response.status === 401) {
  localStorage.removeItem('token');
  router.push('/dang-nhap?returnUrl=' + window.location.pathname);
}
```

## Tăng thời gian sống của token

Nếu muốn token sống lâu hơn, sửa backend:

File: `DichVuJwt.cs`
```csharp
var token = new JwtSecurityToken(
    // ...
    expires: DateTime.UtcNow.AddHours(24), // Thay vì AddHours(1)
    // ...
);
```

## Kết luận

✅ Vấn đề: Token hết hạn
✅ Giải pháp: Đăng nhập lại
✅ Sau khi đăng nhập: Hồ sơ sẽ hiển thị

**Hãy đăng nhập lại và thử!** 🔐
