# Script Restart tất cả servers với giới hạn RAM

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "RESTART VỚI GIỚI HẠN RAM" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Dừng tất cả processes
Write-Host "1. Đang dừng tất cả processes..." -ForegroundColor Yellow

$stopped = $false

# Dừng Backend
$backendProcess = Get-Process -Name "PhuongXa.API" -ErrorAction SilentlyContinue
if ($backendProcess) {
    Stop-Process -Name "PhuongXa.API" -Force
    Write-Host "   ✓ Đã dừng Backend" -ForegroundColor Green
    $stopped = $true
}

# Dừng Node.js
$nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    Stop-Process -Name "node" -Force
    Write-Host "   ✓ Đã dừng Node.js ($($nodeProcesses.Count) process)" -ForegroundColor Green
    $stopped = $true
}

if (-not $stopped) {
    Write-Host "   ℹ Không có process nào đang chạy" -ForegroundColor Gray
}

Write-Host ""
Write-Host "2. Đợi processes dừng hoàn toàn..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

# Xóa cache
Write-Host ""
Write-Host "3. Xóa cache Next.js..." -ForegroundColor Yellow

if (Test-Path "frontend/.next") {
    Remove-Item -Recurse -Force "frontend/.next" -ErrorAction SilentlyContinue
    Write-Host "   ✓ Đã xóa frontend/.next" -ForegroundColor Green
}

if (Test-Path "frontend/nguoi-dan/.next") {
    Remove-Item -Recurse -Force "frontend/nguoi-dan/.next" -ErrorAction SilentlyContinue
    Write-Host "   ✓ Đã xóa frontend/nguoi-dan/.next" -ForegroundColor Green
}

Write-Host ""
Write-Host "4. Khởi động lại với giới hạn RAM..." -ForegroundColor Yellow
Write-Host ""

# Thiết lập biến môi trường
$env:NODE_OPTIONS = "--max-old-space-size=1024"
$env:NEXT_TELEMETRY_DISABLED = "1"

# Khởi động Backend
Write-Host "   a. Backend API..." -ForegroundColor Cyan
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd backend/phuongxa-api; `$env:ASPNETCORE_ENVIRONMENT='Development'; dotnet run --project src/PhuongXa.API" -WindowStyle Normal
Start-Sleep -Seconds 5

# Khởi động Frontend Admin
Write-Host "   b. Frontend Admin (RAM limit: 1GB)..." -ForegroundColor Cyan
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd frontend; `$env:NODE_OPTIONS='--max-old-space-size=1024'; `$env:NEXT_TELEMETRY_DISABLED='1'; npm run dev" -WindowStyle Normal
Start-Sleep -Seconds 3

# Khởi động Frontend Người Dân
Write-Host "   c. Frontend Người Dân (RAM limit: 1GB)..." -ForegroundColor Cyan
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd frontend/nguoi-dan; `$env:NODE_OPTIONS='--max-old-space-size=1024'; `$env:NEXT_TELEMETRY_DISABLED='1'; npm run dev -- --port 3001" -WindowStyle Normal

Write-Host ""
Write-Host "5. Đợi servers khởi động..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "HOÀN TẤT!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Các servers đã được khởi động với giới hạn RAM 1GB/process" -ForegroundColor White
Write-Host ""
Write-Host "Để kiểm tra RAM usage, chạy:" -ForegroundColor White
Write-Host "  .\CHECK_NODE_RAM.ps1" -ForegroundColor Cyan
Write-Host ""
Write-Host "URLs:" -ForegroundColor White
Write-Host "  Backend:            http://localhost:5000" -ForegroundColor Gray
Write-Host "  Frontend Admin:     http://localhost:3000" -ForegroundColor Gray
Write-Host "  Frontend Người Dân: http://localhost:3001" -ForegroundColor Gray
Write-Host ""

