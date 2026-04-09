# 🔍 Phân Tích Lỗi "Hệ Thống Chưa Có Dịch Vụ Công"

## ❌ VẤN ĐỀ

Từ hình ảnh bạn gửi, trang `localhost:3000/nop-ho-so` hiển thị:
> **"Hệ thống chưa có dịch vụ công kha dụng. Vui lòng liên hệ quan trị để cấu hình danh mục thủ tục."**

(Lưu ý: có lỗi chính tả "**kha dụng**" → nên là "**khả dụng**")

---

## 🔎 NGUYÊN NHÂN

### 1. **Sai Cấu Hình API URL** ✅ ĐÃ FIX
File `frontend/nguoi-dan/.env` đang trỏ:
```env
❌ NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:5187  # Sai - nên dùng localhost
```

**Đã sửa thành:**
```env
✅ NEXT_PUBLIC_API_BASE_URL=http://localhost:5187
```

### 2. **API Không Trả Về Dữ Liệu**
Trang `nop-ho-so` gọi API:
```typescript
GET /api/public/services?kichThuocTrang=100
```

**Khả năng:**
- Backend chưa chạy
- Database chưa có dữ liệu dịch vụ (seed data)
- CORS chặn request
- API endpoint không tồn tại

---

## ✅ CÁC BƯỚC FIX

### Bước 1: Kiểm Tra Backend Đang Chạy
```bash
# Terminal 1
cd backend\phuongxa-api\src\PhuongXa.API
dotnet run
```

Kiểm tra xem có thấy:
```
✅ Now listening on: http://localhost:5187
```

### Bước 2: Test API Trực Tiếp
Mở trình duyệt hoặc dùng curl:
```bash
# Kiểm tra API services
curl http://localhost:5187/api/public/services

# Hoặc với PowerShell
Invoke-WebRequest -Uri "http://localhost:5187/api/public/services" -Method GET
```

**Kết quả mong đợi:**
```json
{
  "thanhCong": true,
  "duLieu": {
    "muc": [
      {
        "id": "...",
        "ten": "Đăng ký tạm trú",
        "maDichVu": "...",
        "dangHoatDong": true
      }
    ]
  }
}
```

### Bước 3: Kiểm Tra Database Có Dữ Liệu
```bash
# Kết nối PostgreSQL
psql -h localhost -p 5432 -U postgres -d phuongxa_db

# Kiểm tra bảng dịch vụ
SELECT id, ten, "MaDichVu", "DangHoatDong" FROM "DichVu" LIMIT 5;
```

**Nếu không có dữ liệu**, cần seed data:
- Chạy migration nếu có
- Hoặc insert thủ công dữ liệu mẫu

### Bước 4: Khởi Động Frontend
```bash
cd frontend\nguoi-dan
npm run dev
```

Truy cập: `http://localhost:3000/nop-ho-so`

---

## 🧪 KIỂM TRA KẾT NỐI

Tôi đã tạo script test tự động:

```bash
# Từ thư mục gốc
node test-connection.js
```

Script này sẽ kiểm tra:
- ✅ Backend có chạy không
- ✅ Frontend có chạy không
- ✅ Kết nối giữa FE-BE

---

## 🔧 FIX ĐÃ THỰC HIỆN

### 1. ✅ Sửa `frontend/nguoi-dan/.env`
```diff
- NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:5187
+ NEXT_PUBLIC_API_BASE_URL=http://localhost:5187
```

### 2. ✅ Thêm Thông Báo Lỗi Rõ Ràng
Đã tạo script `fix_nop_ho_so_warning.js` để thêm thông báo khi không có dịch vụ:

```javascript
// Chạy script này để cập nhật
node fix_nop_ho_so_warning.js
```

Sau khi chạy, code sẽ hiển thị:
```
⚠️ Hệ thống chưa có dịch vụ công khả dụng. 
   Vui lòng liên hệ quản trị để cấu hình danh mục thủ tục.
```

---

## 🐛 DEBUG TIPS

### 1. Xem Console Logs (Browser)
- Mở DevTools (F12)
- Tab **Console** → xem lỗi JavaScript
- Tab **Network** → xem request đến `/api/public/services`
  - Status: 200 OK? 404? 500?
  - Response: có dữ liệu không?

### 2. Xem Backend Logs
Khi backend chạy, terminal sẽ hiển thị mọi request:
```
info: Microsoft.AspNetCore.Hosting.Diagnostics[1]
      Request starting HTTP/1.1 GET http://localhost:5187/api/public/services
```

### 3. Kiểm Tra CORS
Nếu thấy lỗi CORS trong Console:
```
Access to fetch at 'http://localhost:5187/...' from origin 
'http://localhost:3000' has been blocked by CORS policy
```

→ Kiểm tra `appsettings.json`:
```json
{
  "Cors": {
    "AllowedOrigins": "http://localhost:3000,..."
  }
}
```

---

## 📝 CHECKLIST

- [x] Sửa `.env` file (cả 2 frontend folders)
- [x] Tạo script test connection
- [x] Tạo script fix thông báo lỗi
- [ ] **BẠN CẦN LÀM:** Chạy Backend
- [ ] **BẠN CẦN LÀM:** Seed dữ liệu dịch vụ vào database
- [ ] **BẠN CẦN LÀM:** Chạy `node fix_nop_ho_so_warning.js`
- [ ] **BẠN CẦN LÀM:** Test lại trang nop-ho-so

---

## 🎯 KẾT LUẬN

**Lỗi chính:** API không trả về dịch vụ vì:
1. ✅ URL sai (đã fix)
2. ⚠️ Backend có thể chưa chạy
3. ⚠️ Database chưa có dữ liệu

**Cách fix nhanh nhất:**
1. Chạy Backend
2. Seed dữ liệu vào database
3. Refresh trang

Nếu vẫn lỗi, hãy gửi cho tôi:
- Screenshot DevTools > Network tab
- Backend console logs
- Kết quả của `node test-connection.js`
