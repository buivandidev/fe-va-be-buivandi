# 🚨 EMERGENCY FIX - Node.js Process Leak

## Vấn Đề Nghiêm Trọng

Sau khi cập nhật config lần 1, vẫn có **982 processes** và **14GB RAM**!

### Nguyên nhân sâu xa:
Next.js 15/16 có bug với worker threads. Chỉ tắt `workerThreads` KHÔNG ĐỦ!
Cần phải:
1. Tắt worker threads
2. Tắt webpack parallelism
3. Tắt thread-loader

## Giải Pháp Khẩn Cấp

### 1. Cập nhật next.config với webpack config

Thêm webpack customization để:
- `config.parallelism = 1` - Chỉ 1 process
- Remove thread-loader - Không dùng multi-threading

### 2. Luôn dừng Node.js trước khi start

```powershell
# LUÔN chạy trước khi start
.\KILL_ALL_NODE.ps1

# Xóa cache
Remove-Item -Recurse -Force frontend/.next
Remove-Item -Recurse -Force frontend/nguoi-dan/.next

# Mới start
.\START_ALL_SERVERS.ps1
```

### 3. Monitor liên tục

```powershell
# Chạy trong terminal riêng
.\MONITOR_NODE_PROCESSES.ps1
```

## Cách Sử Dụng Đúng

### ❌ SAI - Không làm thế này:
```powershell
# Chỉ start mà không kill trước
.\START_ALL_SERVERS.ps1
```

### ✅ ĐÚNG - Làm thế này:
```powershell
# 1. Kill tất cả
.\KILL_ALL_NODE.ps1

# 2. Xóa cache
Remove-Item -Recurse -Force frontend/.next
Remove-Item -Recurse -Force frontend/nguoi-dan/.next

# 3. Đợi 3 giây
Start-Sleep -Seconds 3

# 4. Mới start
.\START_ALL_SERVERS.ps1

# 5. Monitor trong terminal khác
.\MONITOR_NODE_PROCESSES.ps1
```

## Auto-Kill Script

Tạo script tự động kill nếu quá nhiều:

```powershell
# AUTO_KILL_IF_TOO_MANY.ps1
while ($true) {
    $count = (Get-Process node -ErrorAction SilentlyContinue | Measure-Object).Count
    
    if ($count -gt 20) {
        Write-Host "⚠ EMERGENCY: $count processes! Auto-killing..." -ForegroundColor Red
        Stop-Process -Name node -Force
        Write-Host "✓ Killed all processes" -ForegroundColor Green
        
        # Gửi notification (optional)
        # Send-MailMessage hoặc notification khác
    }
    
    Start-Sleep -Seconds 30
}
```

## Kiểm Tra Sau Khi Fix

```powershell
# Đợi 1 phút sau khi start
Start-Sleep -Seconds 60

# Kiểm tra
$count = (Get-Process node -ErrorAction SilentlyContinue | Measure-Object).Count
Write-Host "Processes: $count"

# Nếu > 10 thì có vấn đề
if ($count -gt 10) {
    Write-Host "❌ VẪN CÒN VẤN ĐỀ!" -ForegroundColor Red
} else {
    Write-Host "✓ OK" -ForegroundColor Green
}
```

## Nếu Vẫn Không Fix Được

### Option 1: Downgrade Next.js

```bash
# Frontend Admin
cd frontend
npm install next@14.2.0

# Frontend Người Dân
cd frontend/nguoi-dan
npm install next@14.2.0
```

Next.js 14 ổn định hơn về worker threads.

### Option 2: Dùng Turbopack (experimental)

```bash
# Thay vì npm run dev
npm run dev -- --turbo
```

Turbopack có thể xử lý workers tốt hơn.

### Option 3: Không dùng dev mode

```bash
# Build production
npm run build

# Run production
npm run start
```

Production mode không có HMR nên ít processes hơn.

## Monitoring 24/7

Tạo Windows Task Scheduler:

1. Mở Task Scheduler
2. Create Task
3. Trigger: Every 5 minutes
4. Action: Run PowerShell script
5. Script:
```powershell
$count = (Get-Process node -ErrorAction SilentlyContinue | Measure-Object).Count
if ($count -gt 50) {
    Stop-Process -Name node -Force
    # Log to file
    Add-Content "C:\logs\node-kill.log" "$(Get-Date): Killed $count processes"
}
```

## Kết Luận

Đây là bug nghiêm trọng của Next.js 15/16. Cần:

1. ✅ Cập nhật config với webpack customization
2. ✅ Luôn kill trước khi start
3. ✅ Monitor liên tục
4. ✅ Auto-kill nếu quá nhiều
5. ⚠️ Cân nhắc downgrade Next.js nếu vẫn không fix được

---

**Trạng thái**: 🚨 CRITICAL - Cần giám sát chặt chẽ
**Ngày**: 2026-04-08
