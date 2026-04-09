# 🧪 Test Auth Fix - Hướng Dẫn Kiểm Tra

## 📋 Checklist Test

### ✅ Test 1: Đăng Nhập
1. Mở http://localhost:3001
2. Mở DevTools (F12) → Console tab
3. Click nút "Đăng nhập" ở góc phải
4. Nhập thông tin:
   - Email: `buivandli@gmail.com`
   - Password: `123456`
5. Click "Đăng nhập"

**Kỳ vọng trong Console:**
```
✅ Đăng nhập thành công, token: eyJhbGciOiJIUzI1Ni...
🔄 Chuyển hướng đến: /ca-nhan
🔐 Header: Checking auth, token: EXISTS
📡 Header: Profile API response: { ok: true, success: true, hasData: true }
✅ Header: Authenticated as Bùi Văn Đi
```

**Kỳ vọng trên UI:**
- ✅ Nút "Đăng nhập" biến mất
- ✅ Hiện tên user "Bùi Văn Đi" (hoặc tên ngắn)
- ✅ Hiện nút "Đăng xuất"
- ✅ Redirect đến trang cá nhân

---

### ✅ Test 2: Refresh Trang
1. Đã đăng nhập (từ Test 1)
2. Nhấn F5 để refresh
3. Xem Console

**Kỳ vọng trong Console:**
```
🔐 Header: Checking auth, token: EXISTS
📡 Header: Profile API response: { ok: true, success: true, hasData: true }
✅ Header: Authenticated as Bùi Văn Đi
```

**Kỳ vọng trên UI:**
- ✅ Vẫn hiện tên user
- ✅ Vẫn hiện nút "Đăng xuất"
- ✅ KHÔNG hiện nút "Đăng nhập"

---

### ✅ Test 3: Trang Cá Nhân - Thông Báo
1. Đã đăng nhập
2. Vào http://localhost:3001/ca-nhan
3. Xem Console
4. Tìm các dòng log:

**Kỳ vọng trong Console:**
```
🔐 Token: Có token
📡 API Responses: {
  profile: { status: 200, ok: true },
  apps: { status: 200, ok: true },
  notifications: { status: 200, ok: true }
}
🔔 Notifications Response: { 
  status: 200, 
  ok: true, 
  unread: { success: true, data: { soLuongChuaDoc: 0 } }
}
✅ Unread count: 0
```

**Kỳ vọng trên UI:**
- ✅ Hiện "Chào mừng, Bùi Văn Đi"
- ✅ Hiện "Hồ sơ đang xử lý: 00"
- ✅ Hiện "Hồ sơ đã hoàn thành: 00"
- ✅ Hiện "Thông báo mới: 00"

**Nếu thông báo = 00:**
- ✅ Bình thường nếu không có thông báo chưa đọc
- 🔍 Check console xem `soLuongChuaDoc` = 0 hay null
- 🔍 Nếu null → API lỗi, cần check backend

---

### ✅ Test 4: Đăng Xuất
1. Đã đăng nhập
2. Click nút "Đăng xuất"

**Kỳ vọng:**
- ✅ Redirect về trang đăng nhập
- ✅ Header hiện nút "Đăng nhập"
- ✅ Không còn tên user

---

### ✅ Test 5: Cross-Tab Sync
1. Mở tab 1: http://localhost:3001
2. Mở tab 2: http://localhost:3001
3. Ở tab 1: Đăng nhập
4. Chuyển sang tab 2
5. Refresh tab 2

**Kỳ vọng:**
- ✅ Tab 2 tự động nhận biết đã đăng nhập
- ✅ Tab 2 hiện tên user

---

## 🐛 Troubleshooting

### ❌ Vẫn hiện nút "Đăng nhập" sau khi login

**Kiểm tra Console:**
```
🔐 Header: Checking auth, token: ???
```

**Nếu token: NONE:**
- Token không được lưu vào localStorage
- Check dòng "✅ Đăng nhập thành công" có xuất hiện không
- Nếu không → API đăng nhập lỗi

**Nếu token: EXISTS nhưng vẫn hiện nút đăng nhập:**
- Check dòng "📡 Header: Profile API response"
- Nếu ok: false → Token invalid hoặc backend lỗi
- Nếu hasData: false → API không trả về user data

**Fix:**
```javascript
// Mở Console, chạy:
localStorage.getItem('token')
// Nếu null → Token không được lưu
// Nếu có giá trị → Token OK, vấn đề ở API
```

---

### ❌ Thông báo = 00 nhưng thực tế có thông báo

**Kiểm tra Console:**
```
🔔 Notifications Response: { status: ???, ok: ???, unread: ??? }
```

**Nếu status: 200, ok: true:**
- API thành công
- Check `unread.data.soLuongChuaDoc`
- Nếu = 0 → Thực sự không có thông báo chưa đọc
- Nếu = null → Backend trả về sai format

**Nếu status: 401:**
- Token không hợp lệ
- Cần đăng nhập lại

**Nếu status: 500:**
- Backend lỗi
- Check logs backend

**Fix tạm thời (test):**
```sql
-- Tạo thông báo test trong database
INSERT INTO ThongBao (Id, TieuDe, NoiDung, NguoiNhanId, DaDoc, NgayTao)
VALUES (
  NEWID(), 
  'Thông báo test', 
  'Đây là thông báo test', 
  'user-id-của-bạn', 
  0, 
  GETDATE()
);
```

---

### ❌ Console không hiện logs

**Nguyên nhân:**
- DevTools chưa mở
- Console bị clear
- Logs bị filter

**Fix:**
1. Nhấn F12 mở DevTools
2. Chọn tab "Console"
3. Đảm bảo không có filter nào được bật
4. Refresh trang (F5)

---

## 📊 Expected Console Output (Full)

### Khi đăng nhập thành công:
```
✅ Đăng nhập thành công, token: eyJhbGciOiJIUzI1Ni...
🔄 Chuyển hướng đến: /ca-nhan
🔐 Header: Checking auth, token: EXISTS
📡 Header: Profile API response: { ok: true, success: true, hasData: true }
✅ Header: Authenticated as Bùi Văn Đi
🔐 Token: Có token
📡 API Responses: {
  profile: { status: 200, ok: true },
  apps: { status: 200, ok: true },
  notifications: { status: 200, ok: true }
}
📊 Apps Response: { status: 200, ok: true, apps: {...} }
📋 Applications list: []
✅ Normalized applications: []
📈 Stats: { total: 0, dangXuLy: 0, hoanThanh: 0 }
🔔 Notifications Response: { status: 200, ok: true, unread: {...} }
✅ Unread count: 0
```

---

## ✅ Success Criteria

Tất cả tests pass nếu:
- ✅ Đăng nhập → Nút biến thành tên user ngay lập tức
- ✅ Refresh → Vẫn hiện tên user
- ✅ Trang cá nhân → Load được thông tin (dù = 0)
- ✅ Console logs rõ ràng, không có lỗi
- ✅ Đăng xuất → Về trang login

---

## 🚀 Nếu Tất Cả OK

Chúc mừng! Auth đã hoạt động đúng. 

**Nếu thông báo = 00:**
- Đây là bình thường nếu chưa có thông báo nào
- Để test, tạo thông báo trong database
- Hoặc đợi có thông báo thực tế từ hệ thống

**Next steps:**
- Test các tính năng khác
- Tạo thông báo test
- Deploy lên production

---

**Lưu ý:** Luôn mở DevTools Console khi test để thấy logs!
