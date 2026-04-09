# Script khởi động AN TOÀN - Ngăn process leak

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "KHỞI ĐỘNG CHẾ ĐỘ AN TOÀN" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# BƯỚC 1: Kill tất cả Node.js processes
Write-Host "BƯỚC 1: Dừng tất cả Node.js processes..." -ForegroundColor Yellow
$existing = Get-Process -Name "node" -ErrorAction SilentlyContinue
if ($existing) {
    $count = ($existing | Measure-Object).Count
    Write-Host "  Tìm thấy $count process(es) đang chạy" -ForegroundColor Red
    Write-Host "  Đang dừng..." -ForegroundColor Yellow
    
    Stop-Process -Name "node" -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 3
    
    $remaining = Get-Process -Name "node" -ErrorAction SilentlyContinue
    if ($remaining) {
        Write-Host "  ⚠ Còn $($remaining.Count) process(es) chưa dừng" -ForegroundColor Yellow
        Stop-Process -Name "node" -Force -ErrorAction SilentlyContinue
        Start-Sleep -Seconds 2
    }
    
    Write-Host "  ✓ Đã dừng tất cả" -ForegroundColor Green
} else {
    Write-Host "  ✓ Không có process nào đang chạy" -ForegroundColor Green
}

Write-Host ""

# BƯỚC 2: Xóa cache Next.js
Write-Host "BƯỚC 2: Xóa cache Next.js..." -ForegroundColor Yellow

if (Test-Path "frontend/.next") {
    Remove-Item -Recurse -Force "frontend/.next" -ErrorAction SilentlyContinue
    Write-Host "  ✓ Đã xóa frontend/.next" -ForegroundColor Green
}

if (Test-Path "frontend/nguoi-dan/.next") {
    Remove-Item -Recurse -Force "frontend/nguoi-dan/.next" -ErrorAction SilentlyContinue
    Write-Host "  ✓ Đã xóa frontend/nguoi-dan/.next" -ForegroundColor Green
}

Write-Host ""

# BƯỚC 3: Kiểm tra config
Write-Host "BƯỚC 3: Kiểm tra cấu hình..." -ForegroundColor Yellow

$config1 = Get-Content "frontend/next.config.mjs" -Raw
$config2 = Get-Content "frontend/nguoi-dan/next.config.ts" -Raw

if ($config1 -match "workerThreads.*false" -and $config1 -match "parallelism.*1") {
    Write-Host "  ✓ Frontend Admin config OK" -ForegroundColor Green
} else {
    Write-Host "  ✗ Frontend Admin config CHƯA ĐÚNG!" -ForegroundColor Red
    Write-Host "    Cần có: workerThreads: false và parallelism: 1" -ForegroundColor Yellow
}

if ($config2 -match "workerThreads.*false" -and $config2 -match "parallelism.*1") {
    Write-Host "  ✓ Frontend Người Dân config OK" -ForegroundColor Green
} else {
    Write-Host "  ✗ Frontend Người Dân config CHƯA ĐÚNG!" -ForegroundColor Red
    Write-Host "    Cần có: workerThreads: false và parallelism: 1" -ForegroundColor Yellow
}

Write-Host ""

# BƯỚC 4: Đợi hệ thống ổn định
Write-Host "BƯỚC 4: Đợi hệ thống ổn định..." -ForegroundColor Yellow
Start-Sleep -Seconds 3
Write-Host "  ✓ Sẵn sàng" -ForegroundColor Green

Write-Host ""

# BƯỚC 5: Khởi động Backend
Write-Host "BƯỚC 5: Khởi động Backend API..." -ForegroundColor Yellow
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd backend/phuongxa-api; `$env:ASPNETCORE_ENVIRONMENT='Development'; dotnet run --project src/PhuongXa.API" -WindowStyle Normal
Write-Host "  ✓ Backend đang khởi động..." -ForegroundColor Green
Start-Sleep -Seconds 5

Write-Host ""

# BƯỚC 6: Khởi động Frontend Admin
Write-Host "BƯỚC 6: Khởi động Frontend Admin..." -ForegroundColor Yellow
Write-Host "  ⚠ Với giới hạn: 1 CPU, no workers, parallelism=1" -ForegroundColor Yellow
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd frontend; `$env:NODE_OPTIONS='--max-old-space-size=1024'; `$env:NEXT_TELEMETRY_DISABLED='1'; npm run dev" -WindowStyle Normal
Write-Host "  ✓ Frontend Admin đang khởi động..." -ForegroundColor Green
Start-Sleep -Seconds 5

Write-Host ""

# BƯỚC 7: Khởi động Frontend Người Dân
Write-Host "BƯỚC 7: Khởi động Frontend Người Dân..." -ForegroundColor Yellow
Write-Host "  ⚠ Với giới hạn: 1 CPU, no workers, parallelism=1" -ForegroundColor Yellow
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd frontend/nguoi-dan; `$env:NODE_OPTIONS='--max-old-space-size=1024'; `$env:NEXT_TELEMETRY_DISABLED='1'; npm run dev -- --port 3001" -WindowStyle Normal
Write-Host "  ✓ Frontend Người Dân đang khởi động..." -ForegroundColor Green

Write-Host ""

# BƯỚC 8: Đợi khởi động
Write-Host "BƯỚC 8: Đợi các service khởi động..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

Write-Host ""

# BƯỚC 9: Kiểm tra processes
Write-Host "BƯỚC 9: Kiểm tra số Node.js processes..." -ForegroundColor Yellow
$nodeCount = (Get-Process -Name "node" -ErrorAction SilentlyContinue | Measure-Object).Count

if ($nodeCount -eq 0) {
    Write-Host "  ⚠ Chưa có process nào (đang khởi động...)" -ForegroundColor Yellow
} elseif ($nodeCount -le 5) {
    Write-Host "  ✓ $nodeCount process(es) - BÌNH THƯỜNG" -ForegroundColor Green
} elseif ($nodeCount -le 20) {
    Write-Host "  ⚠ $nodeCount process(es) - HƠI CAO" -ForegroundColor Yellow
} else {
    Write-Host "  ✗ $nodeCount process(es) - QUÁ NHIỀU!" -ForegroundColor Red
    Write-Host "    Có thể vẫn bị process leak!" -ForegroundColor Red
}

Write-Host ""

# BƯỚC 10: Hướng dẫn monitoring
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "HOÀN TẤT KHỞI ĐỘNG" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "QUAN TRỌNG: Giám sát processes!" -ForegroundColor Yellow
Write-Host ""
Write-Host "Mở terminal mới và chạy:" -ForegroundColor White
Write-Host "  .\MONITOR_NODE_PROCESSES.ps1" -ForegroundColor Cyan
Write-Host ""
Write-Host "Hoặc auto-kill nếu quá nhiều:" -ForegroundColor White
Write-Host "  .\AUTO_KILL_IF_TOO_MANY.ps1" -ForegroundColor Cyan
Write-Host ""
Write-Host "URLs:" -ForegroundColor White
Write-Host "  Backend:            http://localhost:5000" -ForegroundColor Gray
Write-Host "  Frontend Admin:     http://localhost:3000" -ForegroundColor Gray
Write-Host "  Frontend Người Dân: http://localhost:3001" -ForegroundColor Gray
Write-Host ""
Write-Host "Nếu thấy quá nhiều processes (>20):" -ForegroundColor Yellow
Write-Host "  1. Chạy: .\KILL_ALL_NODE.ps1" -ForegroundColor Cyan
Write-Host "  2. Chạy lại: .\START_SAFE_MODE.ps1" -ForegroundColor Cyan
Write-Host ""

