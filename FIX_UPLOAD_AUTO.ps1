# Script tự động fix lỗi upload media

Write-Host "=== TỰ ĐỘNG FIX LỖI UPLOAD MEDIA ===" -ForegroundColor Cyan

# 1. Kill tất cả Node processes
Write-Host "`n[1/5] Dừng tất cả Node processes..." -ForegroundColor Yellow
$nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    Write-Host "   Tìm thấy $($nodeProcesses.Count) Node process(es)" -ForegroundColor White
    $nodeProcesses | ForEach-Object {
        Write-Host "   Đang dừng PID: $($_.Id)..." -ForegroundColor Gray
        Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
    }
    Start-Sleep -Seconds 2
    Write-Host "   ✓ Đã dừng tất cả Node processes" -ForegroundColor Green
} else {
    Write-Host "   ℹ Không có Node process nào đang chạy" -ForegroundColor Gray
}

# 2. Kill dotnet processes (nếu có)
Write-Host "`n[2/5] Dừng backend cũ..." -ForegroundColor Yellow
$dotnetProcesses = Get-Process -Name "PhuongXa.API" -ErrorAction SilentlyContinue
if ($dotnetProcesses) {
    $dotnetProcesses | ForEach-Object {
        Write-Host "   Đang dừng PID: $($_.Id)..." -ForegroundColor Gray
        Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
    }
    Start-Sleep -Seconds 2
    Write-Host "   ✓ Đã dừng backend cũ" -ForegroundColor Green
} else {
    Write-Host "   ℹ Backend không chạy" -ForegroundColor Gray
}

# 3. Kiểm tra ports
Write-Host "`n[3/5] Kiểm tra ports..." -ForegroundColor Yellow
$port5000 = Get-NetTCPConnection -LocalPort 5000 -State Listen -ErrorAction SilentlyContinue
$port3000 = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue

if ($port5000) {
    Write-Host "   ⚠ Port 5000 vẫn đang được sử dụng" -ForegroundColor Yellow
    $pid = $port5000.OwningProcess
    Write-Host "   Đang kill process PID: $pid..." -ForegroundColor Gray
    Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 1
}

if ($port3000) {
    Write-Host "   ⚠ Port 3000 vẫn đang được sử dụng" -ForegroundColor Yellow
    $pid = $port3000.OwningProcess
    Write-Host "   Đang kill process PID: $pid..." -ForegroundColor Gray
    Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 1
}

Write-Host "   ✓ Ports đã sẵn sàng" -ForegroundColor Green

# 4. Start Backend
Write-Host "`n[4/5] Khởi động Backend..." -ForegroundColor Yellow
$backendPath = "backend\phuongxa-api\src\PhuongXa.API"

if (Test-Path $backendPath) {
    Write-Host "   Đang khởi động backend tại: $backendPath" -ForegroundColor White
    
    # Start backend in new window
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; Write-Host 'Starting Backend...' -ForegroundColor Cyan; dotnet run"
    
    Write-Host "   ⏳ Đợi backend khởi động (15 giây)..." -ForegroundColor Gray
    Start-Sleep -Seconds 15
    
    # Check if backend is running
    $backendRunning = Get-NetTCPConnection -LocalPort 5000 -State Listen -ErrorAction SilentlyContinue
    if ($backendRunning) {
        Write-Host "   ✓ Backend đã khởi động thành công trên port 5000" -ForegroundColor Green
    } else {
        Write-Host "   ✗ Backend chưa khởi động. Vui lòng kiểm tra cửa sổ backend." -ForegroundColor Red
    }
} else {
    Write-Host "   ✗ Không tìm thấy thư mục backend: $backendPath" -ForegroundColor Red
}

# 5. Start Frontend
Write-Host "`n[5/5] Khởi động Frontend..." -ForegroundColor Yellow
$frontendPath = "frontend"

if (Test-Path $frontendPath) {
    Write-Host "   Đang khởi động frontend tại: $frontendPath" -ForegroundColor White
    
    # Start frontend in new window
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; Write-Host 'Starting Frontend...' -ForegroundColor Cyan; npm run dev"
    
    Write-Host "   ⏳ Đợi frontend khởi động (20 giây)..." -ForegroundColor Gray
    Start-Sleep -Seconds 20
    
    # Check if frontend is running
    $frontendRunning = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue
    if ($frontendRunning) {
        Write-Host "   ✓ Frontend đã khởi động thành công trên port 3000" -ForegroundColor Green
    } else {
        Write-Host "   ✗ Frontend chưa khởi động. Vui lòng kiểm tra cửa sổ frontend." -ForegroundColor Red
    }
} else {
    Write-Host "   ✗ Không tìm thấy thư mục frontend: $frontendPath" -ForegroundColor Red
}

# Summary
Write-Host "`n=== HOÀN TẤT ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Các bước tiếp theo:" -ForegroundColor Yellow
Write-Host "1. Mở trình duyệt: http://localhost:3000/admin/login" -ForegroundColor White
Write-Host "2. Đăng nhập với tài khoản admin" -ForegroundColor White
Write-Host "3. Kiểm tra box debug ở góc dưới bên phải" -ForegroundColor White
Write-Host "4. Vào trang Library: http://localhost:3000/admin/library" -ForegroundColor White
Write-Host "5. Thử upload một file ảnh hoặc video" -ForegroundColor White
Write-Host ""
Write-Host "Nếu vẫn lỗi, xem hướng dẫn chi tiết trong: FIX_UPLOAD_MEDIA_COMPLETE.md" -ForegroundColor Cyan
Write-Host ""
