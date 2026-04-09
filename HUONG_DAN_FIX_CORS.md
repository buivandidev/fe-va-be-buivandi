# 🔧 HƯỚNG DẪN FIX CORS PRODUCTION URLs

## 🎯 MỤC ĐÍCH

Cập nhật CORS AllowedOrigins trong `appsettings.Production.json` từ placeholder URLs sang URLs Azure thật.

---

## 📋 CHUẨN BỊ

### Bước 1: Lấy URLs Azure

Bạn cần 2 URLs từ Azure Portal:

1. **Frontend Admin URL**
   - Vào Azure Portal → App Services
   - Chọn App Service của Admin
   - Copy URL từ Overview (ví dụ: `https://phuongxa-admin.azurewebsites.net`)

2. **Frontend Người Dân URL**
   - Vào Azure Portal → App Services
   - Chọn App Service của Người Dân
   - Copy URL từ Overview (ví dụ: `https://phuongxa-nguoidan.azurewebsites.net`)

**Lưu ý**: 
- URLs phải bắt đầu bằng `https://`
- URLs không có trailing slash `/`
- URLs phải là domain `.azurewebsites.net`

---

## 🚀 CÁCH 1: SỬ DỤNG SCRIPT TỰ ĐỘNG (KHUYẾN NGHỊ)

### Option A: Script tương tác

```powershell
.\FIX_CORS_PRODUCTION.ps1
```

Script sẽ:
1. Hiển thị CORS URLs hiện tại
2. Hướng dẫn lấy URLs Azure
3. Yêu cầu nhập Admin URL
4. Yêu cầu nhập Người Dân URL
5. Xác nhận trước khi cập nhật
6. Backup file cũ
7. Cập nhật file mới
8. Verify kết quả

### Option B: Script với parameters

```powershell
.\FIX_CORS_AUTO.ps1 -AdminUrl "https://phuongxa-admin.azurewebsites.net" -NguoidanUrl "https://phuongxa-nguoidan.azurewebsites.net"
```

### Option C: Script tự động phát hiện

```powershell
.\FIX_CORS_AUTO.ps1
```

Script sẽ tự động:
1. Đọc backend URL từ `frontend/nguoi-dan/.env`
2. Gợi ý Admin và Người Dân URLs
3. Cho phép xác nhận hoặc sửa

---

## 🔧 CÁCH 2: SỬA THỦ CÔNG

### Bước 1: Mở file

```powershell
code backend/phuongxa-api/src/PhuongXa.API/appsettings.Production.json
```

### Bước 2: Tìm section CORS

```json
"Cors": {
  "AllowedOrigins": [
    "https://project-admin-phuongxa-fqfqfqcqfqfqfqfq.southeastasia-01.azurewebsites.net",
    "https://project-nguoidan-phuongxa-fqfqfqcqfqfqfqfq.southeastasia-01.azurewebsites.net"
  ]
},
```

### Bước 3: Thay thế URLs

```json
"Cors": {
  "AllowedOrigins": [
    "https://phuongxa-admin.azurewebsites.net",
    "https://phuongxa-nguoidan.azurewebsites.net"
  ]
},
```

**Lưu ý**: Thay `phuongxa-admin` và `phuongxa-nguoidan` bằng tên thật của bạn!

### Bước 4: Lưu file

Ctrl+S hoặc File → Save

---

## ✅ VERIFY

### Kiểm tra file đã cập nhật

```powershell
Get-Content backend/phuongxa-api/src/PhuongXa.API/appsettings.Production.json | Select-String "AllowedOrigins" -Context 0,3
```

Kết quả mong đợi:
```
  "AllowedOrigins": [
    "https://phuongxa-admin.azurewebsites.net",
    "https://phuongxa-nguoidan.azurewebsites.net"
  ]
```

### Chạy kiểm tra tổng thể

```powershell
.\KIEM_TRA_TOAN_BO_HE_THONG.ps1 -SkipBuild
```

Kết quả mong đợi:
```
[37] CORS Production URLs...
  ✓ OK
```

---

## 🔄 SAU KHI CẬP NHẬT

### Bước 1: Rebuild

```powershell
.\build-for-azure.ps1
```

### Bước 2: Deploy Backend

1. Vào Azure Portal → Backend App Service
2. Advanced Tools (Kudu) → Go
3. Tools → Zip Push Deploy
4. Upload `deploy_out/backend-api.zip`
5. Đợi deploy xong

### Bước 3: Restart Backend

1. Vào Azure Portal → Backend App Service
2. Click "Restart"
3. Đợi restart xong

### Bước 4: Test CORS

Mở browser console trên frontend và chạy:

```javascript
// Test từ Admin
fetch('https://your-backend.azurewebsites.net/api/admin/dashboard', {
  method: 'OPTIONS',
  headers: {
    'Origin': 'https://phuongxa-admin.azurewebsites.net'
  }
})
.then(r => console.log('CORS OK:', r.headers.get('access-control-allow-origin')))
.catch(e => console.error('CORS Error:', e));

// Test từ Người Dân
fetch('https://your-backend.azurewebsites.net/api/public/homepage', {
  method: 'OPTIONS',
  headers: {
    'Origin': 'https://phuongxa-nguoidan.azurewebsites.net'
  }
})
.then(r => console.log('CORS OK:', r.headers.get('access-control-allow-origin')))
.catch(e => console.error('CORS Error:', e));
```

Kết quả mong đợi:
```
CORS OK: https://phuongxa-admin.azurewebsites.net
CORS OK: https://phuongxa-nguoidan.azurewebsites.net
```

---

## 🚨 TROUBLESHOOTING

### Vấn đề 1: CORS vẫn bị block

**Nguyên nhân**: URL không khớp chính xác

**Giải pháp**:
1. Mở browser console
2. Xem request Origin header
3. Copy chính xác URL đó
4. Paste vào AllowedOrigins (không trailing slash!)

### Vấn đề 2: Backend không nhận config mới

**Nguyên nhân**: Chưa restart hoặc cache

**Giải pháp**:
1. Restart Backend App Service
2. Clear browser cache
3. Hard refresh (Ctrl+Shift+R)

### Vấn đề 3: Lỗi JSON format

**Nguyên nhân**: JSON không hợp lệ

**Giải pháp**:
1. Restore từ backup: `Copy-Item appsettings.Production.json.backup appsettings.Production.json -Force`
2. Dùng JSON validator: https://jsonlint.com
3. Chạy lại script

### Vấn đề 4: Không tìm thấy file backup

**Nguyên nhân**: Chưa chạy script hoặc đã xóa

**Giải pháp**:
1. Restore từ git: `git checkout backend/phuongxa-api/src/PhuongXa.API/appsettings.Production.json`
2. Hoặc copy từ template

---

## 📝 CHECKLIST

- [ ] Đã lấy Admin URL từ Azure Portal
- [ ] Đã lấy Người Dân URL từ Azure Portal
- [ ] Đã chạy script hoặc sửa thủ công
- [ ] Đã verify file cập nhật đúng
- [ ] Đã rebuild: `.\build-for-azure.ps1`
- [ ] Đã deploy backend-api.zip
- [ ] Đã restart Backend App Service
- [ ] Đã test CORS từ browser
- [ ] CORS không có lỗi
- [ ] API calls thành công

---

## 🎯 KẾT QUẢ MONG ĐỢI

Sau khi hoàn thành:

✅ CORS Production URLs đã cập nhật
✅ Backend đã deploy
✅ CORS không có lỗi
✅ Frontend gọi API thành công
✅ Hệ thống hoạt động bình thường

**Hệ thống sẵn sàng 100%!** 🚀

---

## 📞 HỖ TRỢ

**Scripts**:
- `FIX_CORS_PRODUCTION.ps1` - Script tương tác
- `FIX_CORS_AUTO.ps1` - Script tự động
- `KIEM_TRA_TOAN_BO_HE_THONG.ps1` - Kiểm tra tổng thể

**Files**:
- `appsettings.Production.json` - File cần sửa
- `appsettings.Production.json.backup` - Backup tự động

**Tham khảo**:
- `BAO_CAO_TONG_QUAN_CUOI_CUNG.md` - Báo cáo tổng quan
- `AZURE_DEPLOY_CHECKLIST.md` - Checklist deploy
