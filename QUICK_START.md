# 🚀 Quick Start Guide - Hệ Thống Phường Xã

## Khởi động nhanh trong 3 bước

### Bước 1: Kiểm tra hệ thống
```powershell
.\COMPREHENSIVE_SYSTEM_CHECK.ps1
```

### Bước 2: Khởi động tất cả servers
```powershell
.\START_ALL_SERVERS.ps1
```

### Bước 3: Truy cập ứng dụng
- **Admin**: http://localhost:3000/admin
- **Người dân**: http://localhost:3001
- **API**: http://localhost:5000/swagger

---

## 🔑 Thông tin đăng nhập

### Admin
- Email: `admin@phuongxa.vn`
- Password: `Admin@123`

---

## 📋 Scripts hữu ích

| Script | Mục đích |
|--------|----------|
| `COMPREHENSIVE_SYSTEM_CHECK.ps1` | Kiểm tra tổng quát hệ thống |
| `START_ALL_SERVERS.ps1` | Khởi động tất cả servers |
| `RESTART_WITH_RAM_LIMIT.ps1` | Restart với giới hạn RAM |
| `CHECK_NODE_RAM.ps1` | Kiểm tra RAM usage |
| `RESTART_BACKEND_ONLY.ps1` | Chỉ restart Backend |
| `RESTART_FRONTEND_ADMIN.ps1` | Chỉ restart Frontend Admin |

---

## 🛠️ Troubleshooting nhanh

### Backend không chạy
```powershell
cd backend/phuongxa-api
dotnet run --project src/PhuongXa.API
```

### Frontend không chạy
```powershell
cd frontend
npm run dev
```

### RAM quá cao
```powershell
.\RESTART_WITH_RAM_LIMIT.ps1
```

### Xóa cache
```powershell
Remove-Item -Recurse -Force frontend/.next
Remove-Item -Recurse -Force frontend/nguoi-dan/.next
```

---

## 📊 Kiểm tra trạng thái

### Xem processes đang chạy
```powershell
Get-Process -Name "PhuongXa.API","node"
```

### Kiểm tra ports
```powershell
netstat -ano | findstr "5000 3000 3001"
```

### Test API
```powershell
curl http://localhost:5000/api/categories
```

---

## 🎯 URLs quan trọng

- Backend API: http://localhost:5000
- Swagger UI: http://localhost:5000/swagger
- Admin Portal: http://localhost:3000/admin
- Citizen Portal: http://localhost:3001
- Admin Login: http://localhost:3000/admin/login

---

## 💡 Tips

1. Luôn chạy `COMPREHENSIVE_SYSTEM_CHECK.ps1` trước khi start
2. Sử dụng `RESTART_WITH_RAM_LIMIT.ps1` nếu gặp vấn đề về RAM
3. Kiểm tra `CHECK_NODE_RAM.ps1` định kỳ để theo dõi memory
4. Đọc `SYSTEM_HEALTH_REPORT.md` để hiểu chi tiết hệ thống

---

**Chúc bạn code vui vẻ! 🎉**
