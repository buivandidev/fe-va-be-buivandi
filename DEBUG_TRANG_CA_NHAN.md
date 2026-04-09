# Hướng dẫn Debug Trang Cá Nhân

## Vấn đề
Trang cá nhân hiển thị "00" cho tất cả số liệu (hồ sơ đang xử lý, đã hoàn thành, thông báo mới)

## Các bước kiểm tra

### 1. Kiểm tra Backend đã rebuild chưa

```powershell
# Dừng backend hiện tại (Ctrl+C trong terminal backend)
# Sau đó chạy lại:
cd backend/phuongxa-api
dotnet build
dotnet run --project src/PhuongXa.API
```

### 2. Kiểm tra Frontend đã restart chưa

```powershell
# Dừng frontend người dân (Ctrl+C trong terminal)
# Sau đó chạy lại:
cd frontend/nguoi-dan
npm run dev -- --port 3001
```

### 3. Xóa cache browser

1. Mở DevTools (F12)
2. Vào tab Network
3. Tick "Disable cache"
4. Hard refresh (Ctrl+Shift+R hoặc Ctrl+F5)

### 4. Kiểm tra Console Log

Mở DevTools (F12) → Tab Console, bạn sẽ thấy các log:

```
🔐 Token: Có token / Không có token
📡 API Responses: { profile: {...}, apps: {...}, notifications: {...} }
📊 Apps Response: {...}
📋 Applications list: [...]
✅ Normalized applications: [...]
📈 Stats: { total: X, dangXuLy: Y, hoanThanh: Z }
🔔 Notifications Response: {...}
✅ Unread count: N
```

### 5. Kiểm tra API trực tiếp

#### Test endpoint applications:
```bash
# Lấy token từ localStorage trong browser console
localStorage.getItem('token')

# Test API bằng curl hoặc Postman
curl -X GET "http://localhost:5000/api/public/applications?trang=1&kichThuocTrang=100" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### Test endpoint notifications count:
```bash
curl -X GET "http://localhost:5000/api/public/notifications/count" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 6. Kiểm tra Database

Đảm bảo có dữ liệu trong database:

```sql
-- Kiểm tra số lượng đơn ứng
SELECT COUNT(*) FROM DonUngs;

-- Kiểm tra đơn ứng theo user
SELECT * FROM DonUngs WHERE NguoiDungId = 'YOUR_USER_ID';

-- Kiểm tra thông báo
SELECT COUNT(*) FROM ThongBaos WHERE NguoiDungId = 'YOUR_USER_ID' AND DaDoc = 0;
```

## Các lỗi thường gặp

### Lỗi 1: API trả về 401 Unauthorized
**Nguyên nhân**: Token hết hạn hoặc không hợp lệ
**Giải pháp**: Đăng xuất và đăng nhập lại

### Lỗi 2: API trả về 404 Not Found
**Nguyên nhân**: Backend chưa có endpoint `/api/public/notifications/count`
**Giải pháp**: Đảm bảo file `PublicNotificationsController.cs` đã được tạo và backend đã rebuild

### Lỗi 3: API trả về dữ liệu rỗng
**Nguyên nhân**: User chưa có đơn ứng hoặc thông báo nào
**Giải pháp**: Tạo đơn ứng mới từ trang dịch vụ công

### Lỗi 4: Console log không hiển thị
**Nguyên nhân**: Frontend chưa được rebuild với code mới
**Giải pháp**: 
1. Dừng frontend (Ctrl+C)
2. Xóa cache: `rm -rf .next` (Linux/Mac) hoặc `Remove-Item -Recurse -Force .next` (Windows)
3. Chạy lại: `npm run dev -- --port 3001`

## Checklist

- [ ] Backend đã rebuild và đang chạy
- [ ] Frontend đã restart và đang chạy
- [ ] Browser cache đã được xóa
- [ ] Token còn hợp lệ (đăng nhập lại nếu cần)
- [ ] Console log hiển thị đầy đủ
- [ ] API trả về status 200
- [ ] Database có dữ liệu

## Kết quả mong đợi

Sau khi hoàn thành các bước trên, trang cá nhân sẽ hiển thị:
- Số hồ sơ đang xử lý (không phải "00")
- Số hồ sơ đã hoàn thành (không phải "00")
- Số thông báo mới (không phải "00")

## Nếu vẫn không được

Hãy gửi cho tôi:
1. Screenshot console log
2. Screenshot Network tab (các API request)
3. Response của API `/api/public/applications`
4. Response của API `/api/public/notifications/count`
