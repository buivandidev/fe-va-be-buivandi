# ✅ Tối ưu hóa RAM cho Node.js - Hoàn thành

## Tóm tắt

Đã fix lỗi tràn RAM của Node.js bằng cách giới hạn memory usage cho mỗi process.

## Các thay đổi

### 1. Scripts PowerShell (✅ Hoàn thành)
- `START_ALL_SERVERS.ps1` - Thêm giới hạn RAM 1GB
- `CHECK_NODE_RAM.ps1` - Script kiểm tra RAM usage (MỚI)
- `RESTART_WITH_RAM_LIMIT.ps1` - Script restart với RAM limit (MỚI)

### 2. Package.json (✅ Hoàn thành)
- `frontend/package.json` - Thêm cross-env và NODE_OPTIONS
- `frontend/nguoi-dan/package.json` - Thêm cross-env và NODE_OPTIONS
- Đã cài đặt `cross-env` package

### 3. Environment Files (✅ Hoàn thành)
- `frontend/.env.local` - Cấu hình NODE_OPTIONS
- `frontend/nguoi-dan/.env.local` - Cấu hình NODE_OPTIONS

### 4. Gitignore (✅ Hoàn thành)
- Thêm `.env.local` và các file Node.js

## Cấu hình RAM

```
Development: 1GB (1024MB) per process
Build:       2GB (2048MB) per process
Production:  1GB (1024MB) per process
```

## Cách sử dụng

### Khởi động servers với RAM limit

```powershell
# Cách 1: Sử dụng script chính (khuyến nghị)
.\START_ALL_SERVERS.ps1

# Cách 2: Restart với xóa cache
.\RESTART_WITH_RAM_LIMIT.ps1
```

### Kiểm tra RAM usage

```powershell
.\CHECK_NODE_RAM.ps1
```

### Chạy trực tiếp (đã có RAM limit trong package.json)

```bash
# Frontend Admin
cd frontend
npm run dev

# Frontend Người Dân
cd frontend/nguoi-dan
npm run dev
```

## Kết quả mong đợi

- Mỗi Node.js process sử dụng tối đa 1GB RAM
- Không còn lỗi "JavaScript heap out of memory"
- Hệ thống ổn định hơn, ít crash hơn
- Performance tốt hơn do giảm swap memory

## Giám sát

### Xem RAM usage
```powershell
Get-Process node | Select-Object ProcessName, Id, @{Name="RAM(MB)";Expression={[math]::Round($_.WorkingSet/1MB,2)}}
```

### Dừng tất cả Node.js
```powershell
Stop-Process -Name node -Force
```

## Troubleshooting

### Nếu vẫn gặp lỗi out of memory khi build

Tăng giá trị trong package.json:
```json
"build": "cross-env NODE_OPTIONS='--max-old-space-size=2048' next build"
```

### Nếu máy có RAM thấp (<8GB)

Giảm xuống 512MB:
```
NODE_OPTIONS=--max-old-space-size=512
```

### Nếu máy có RAM cao (>16GB)

Có thể tăng lên 2GB cho dev mode:
```
NODE_OPTIONS=--max-old-space-size=2048
```

## Files tham khảo

- `FIX_NODE_RAM.md` - Chi tiết kỹ thuật
- `CHECK_NODE_RAM.ps1` - Script kiểm tra
- `RESTART_WITH_RAM_LIMIT.ps1` - Script restart

## Kiểm tra hoạt động

1. Chạy `.\RESTART_WITH_RAM_LIMIT.ps1`
2. Đợi 30 giây để servers khởi động
3. Chạy `.\CHECK_NODE_RAM.ps1`
4. Xác nhận RAM usage < 1GB per process

---
**Trạng thái**: ✅ Hoàn thành và đã test
**Ngày**: 2026-04-08
**Tác giả**: Kiro AI Assistant
