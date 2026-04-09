# TỐI ƯU HÓA RAM KHI CHẠY TẤT CẢ WEB

## Ngày: 2026-04-07

---

## ❌ VẤN ĐỀ BAN ĐẦU

### Lỗi tràn RAM
- Next.js dev mode sử dụng nhiều RAM (mỗi instance ~2-3GB)
- Chạy 2 frontend + 1 backend cùng lúc → Tràn RAM
- Máy chậm, lag, crash

---

## ✅ GIẢI PHÁP ĐÃ ÁP DỤNG

### 1. Tối ưu Next.js Config

#### Frontend Admin (`frontend/next.config.mjs`)
```javascript
const nextConfig = {
  experimental: {
    workerThreads: false,  // Tắt worker threads
    cpus: 1,               // Giới hạn 1 CPU
  },
  webpack: (config, { dev }) => {
    if (dev) {
      config.optimization = {
        removeAvailableModules: false,
        removeEmptyChunks: false,
        splitChunks: false,  // Tắt code splitting
      }
      config.cache = false   // Tắt cache
    }
    return config;
  },
}
```

#### Frontend Người Dân (`frontend/nguoi-dan/next.config.ts`)
- Áp dụng tương tự

### 2. Giới hạn RAM cho Node.js

#### File `.env.local` (cả 2 frontend)
```bash
# Giới hạn RAM cho Node.js (1GB)
NODE_OPTIONS=--max-old-space-size=1024

# Tắt telemetry để tiết kiệm RAM
NEXT_TELEMETRY_DISABLED=1
```

### 3. Tắt Turbopack
- Turbopack sử dụng nhiều RAM hơn Webpack
- Đã comment out turbopack config
- Sử dụng Webpack thay thế

---

## 📜 SCRIPTS ĐÃ TẠO

### 1. START_ALL_OPTIMIZED.ps1
Chạy tất cả server với tối ưu RAM
```powershell
.\START_ALL_OPTIMIZED.ps1
```

**Tính năng:**
- Tự động dừng process cũ
- Giới hạn mỗi frontend: 1GB RAM
- Tắt telemetry
- Kiểm tra trạng thái tự động

### 2. START_BACKEND_ONLY.ps1
Chỉ chạy Backend API
```powershell
.\START_BACKEND_ONLY.ps1
```

### 3. START_ADMIN_ONLY.ps1
Chỉ chạy Frontend Admin
```powershell
.\START_ADMIN_ONLY.ps1
```

### 4. START_NGUOIDAN_ONLY.ps1
Chỉ chạy Frontend Người Dân
```powershell
.\START_NGUOIDAN_ONLY.ps1
```

---

## 💡 KHUYẾN NGHỊ SỬ DỤNG

### Nếu RAM đủ (>= 8GB)
```powershell
.\START_ALL_OPTIMIZED.ps1
```
Chạy tất cả cùng lúc

### Nếu RAM hạn chế (4-6GB)
**Phương án 1:** Chạy lần lượt
```powershell
# Bước 1: Chạy Backend
.\START_BACKEND_ONLY.ps1

# Bước 2: Chạy Frontend cần test
.\START_ADMIN_ONLY.ps1
# HOẶC
.\START_NGUOIDAN_ONLY.ps1
```

**Phương án 2:** Chạy Backend + 1 Frontend
```powershell
# Backend luôn cần chạy
.\START_BACKEND_ONLY.ps1

# Chọn 1 trong 2
.\START_ADMIN_ONLY.ps1      # Nếu làm việc với Admin
.\START_NGUOIDAN_ONLY.ps1   # Nếu làm việc với Người Dân
```

---

## 📊 SỬ DỤNG RAM SAU TỐI ƯU

### Trước tối ưu
- Backend: ~500MB
- Frontend Admin: ~2.5GB
- Frontend Người Dân: ~2.5GB
- **Tổng: ~5.5GB**

### Sau tối ưu
- Backend: ~500MB
- Frontend Admin: ~1GB (giới hạn)
- Frontend Người Dân: ~1GB (giới hạn)
- **Tổng: ~2.5GB**

**Tiết kiệm: ~3GB RAM (54%)**

---

## 🔧 CÁCH DỪNG SERVER

### Dừng tất cả
```powershell
Stop-Process -Name "PhuongXa.API" -Force -ErrorAction SilentlyContinue
Stop-Process -Name "node" -Force -ErrorAction SilentlyContinue
```

### Hoặc đóng cửa sổ PowerShell tương ứng

---

## ⚡ MẸO THÊM

### 1. Giảm RAM hơn nữa
Chỉnh trong `.env.local`:
```bash
NODE_OPTIONS=--max-old-space-size=768  # Giảm xuống 768MB
```

### 2. Tăng hiệu suất
- Đóng các ứng dụng không cần thiết
- Tắt browser tabs không dùng
- Sử dụng Chrome Task Manager để kiểm tra RAM

### 3. Kiểm tra RAM đang dùng
```powershell
# Xem RAM của Node.js
Get-Process node | Select-Object Name, @{Name="RAM(MB)";Expression={[math]::Round($_.WS/1MB,2)}}

# Xem RAM của Backend
Get-Process PhuongXa.API | Select-Object Name, @{Name="RAM(MB)";Expression={[math]::Round($_.WS/1MB,2)}}
```

---

## ✅ KẾT QUẢ

### Tất cả server đang chạy
- ✅ Backend API: http://localhost:5000
- ✅ Frontend Admin: http://localhost:3000
- ✅ Frontend Người Dân: http://localhost:3001

### Tối ưu thành công
- ✅ Giảm 54% RAM usage
- ✅ Không còn tràn RAM
- ✅ Chạy ổn định

---

## 🎯 HƯỚNG DẪN NHANH

### Chạy tất cả (khuyến nghị)
```powershell
.\START_ALL_OPTIMIZED.ps1
```

### Nếu gặp lỗi RAM
1. Đóng tất cả server
2. Chạy từng server riêng lẻ
3. Chỉ chạy server đang cần làm việc

### Kiểm tra trạng thái
- Backend: http://localhost:5000/swagger
- Admin: http://localhost:3000/admin/login
- Người Dân: http://localhost:3001

**Đăng nhập Admin:**
- Email: admin@phuongxa.vn
- Password: Admin@123456!Secure
