# Fix Node.js RAM Overflow - Hoàn Thành ✅

## Vấn đề
Node.js process tiêu tốn quá nhiều RAM, có thể gây tràn bộ nhớ khi chạy Next.js dev server.

## Giải pháp đã áp dụng

### 1. Giới hạn RAM cho Node.js
- Đặt `NODE_OPTIONS=--max-old-space-size=1024` (giới hạn 1GB RAM)
- Áp dụng cho cả Frontend Admin và Frontend Người Dân
- Build time tăng lên 2GB để tránh lỗi khi build

### 2. Tắt Telemetry
- Đặt `NEXT_TELEMETRY_DISABLED=1` để giảm overhead

### 3. Các file đã cập nhật

#### Scripts PowerShell
- ✅ `START_ALL_SERVERS.ps1` - Thêm giới hạn RAM
- ✅ `START_ALL_OPTIMIZED.ps1` - Đã có sẵn
- ✅ `START_ADMIN_ONLY.ps1` - Đã có sẵn
- ✅ `START_NGUOIDAN_ONLY.ps1` - Đã có sẵn

#### Package.json
- ✅ `frontend/package.json` - Cập nhật scripts với cross-env
- ✅ `frontend/nguoi-dan/package.json` - Cập nhật scripts với cross-env

#### Environment Files
- ✅ `frontend/.env.local` - Tạo mới
- ✅ `frontend/nguoi-dan/.env.local` - Tạo mới

## Cài đặt cross-env

Để scripts hoạt động trên cả Windows và Linux, cần cài đặt `cross-env`:

```bash
# Frontend Admin
cd frontend
npm install --save-dev cross-env

# Frontend Người Dân
cd frontend/nguoi-dan
npm install --save-dev cross-env
```

## Cách sử dụng

### Khởi động với giới hạn RAM
```powershell
# Tất cả servers
.\START_ALL_SERVERS.ps1

# Hoặc riêng lẻ
.\START_ADMIN_ONLY.ps1
.\START_NGUOIDAN_ONLY.ps1
```

### Chạy trực tiếp
```bash
# Frontend Admin
cd frontend
npm run dev

# Frontend Người Dân
cd frontend/nguoi-dan
npm run dev
```

## Giám sát RAM

### Kiểm tra memory usage
```powershell
Get-Process node | Select-Object ProcessName, Id, @{Name="RAM(MB)";Expression={[math]::Round($_.WorkingSet/1MB,2)}}
```

### Dừng tất cả Node processes
```powershell
Stop-Process -Name node -Force
```

## Lợi ích

1. **Ngăn tràn RAM**: Giới hạn mỗi process Node.js ở 1GB
2. **Ổn định hơn**: Tránh crash do out of memory
3. **Hiệu suất tốt hơn**: Giảm swap memory, tăng tốc độ
4. **Cross-platform**: Hoạt động trên Windows, Linux, macOS

## Lưu ý

- Nếu gặp lỗi "JavaScript heap out of memory" khi build, tăng giá trị lên 2048 (2GB)
- Với máy có RAM thấp (<8GB), giữ nguyên 1024MB
- Với máy có RAM cao (>16GB), có thể tăng lên 2048MB cho dev mode

## Kiểm tra hoạt động

```powershell
# Khởi động server
.\START_ALL_SERVERS.ps1

# Mở PowerShell khác và kiểm tra
Get-Process node | Format-Table ProcessName, Id, @{Name="RAM(MB)";Expression={[math]::Round($_.WorkingSet/1MB,2)}}
```

RAM usage nên ổn định dưới 1GB cho mỗi process.

---
**Trạng thái**: ✅ Hoàn thành
**Ngày**: 2026-04-08
