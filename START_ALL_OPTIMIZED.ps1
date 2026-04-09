# Script khởi động tất cả server với tối ưu RAM
# Chạy: .\START_ALL_OPTIMIZED.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "KHỞI ĐỘNG TẤT CẢ SERVER (TỐI ƯU RAM)" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Kiểm tra xem có process nào đang chạy không
Write-Host "Kiểm tra process đang chạy..." -ForegroundColor Yellow

$backendRunning = Get-Process -Name "PhuongXa.API" -ErrorAction SilentlyContinue
$frontendRunning = Get-Process -Name "node" -ErrorAction SilentlyContinue

if ($backendRunning -or $frontendRunning) {
    Write-Host "⚠ Phát hiện process đang chạy!" -ForegroundColor Yellow
    Write-Host "Đang dừng tất cả process..." -ForegroundColor Yellow
    Stop-Process -Name "PhuongXa.API" -Force -ErrorAction SilentlyContinue
    Stop-Process -Name "node" -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 3
}

Write-Host ""

# Thiết lập biến môi trường để giới hạn RAM
$env:NODE_OPTIONS = "--max-old-space-size=1024"
$env:NEXT_TELEMETRY_DISABLED = "1"

# Khởi động Backend
Write-Host "1. Khởi động Backend API..." -ForegroundColor Yellow
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd backend/phuongxa-api; `$env:ASPNETCORE_ENVIRONMENT='Development'; dotnet run --project src/PhuongXa.API" -WindowStyle Normal
Write-Host "   ✓ Backend đang khởi động..." -ForegroundColor Green
Start-Sleep -Seconds 8

# Khởi động Frontend Admin với giới hạn RAM
Write-Host "2. Khởi động Frontend Admin (giới hạn RAM: 1GB)..." -ForegroundColor Yellow
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd frontend; `$env:NODE_OPTIONS='--max-old-space-size=1024'; `$env:NEXT_TELEMETRY_DISABLED='1'; npm run dev" -WindowStyle Normal
Write-Host "   ✓ Frontend Admin đang khởi động..." -ForegroundColor Green
Start-Sleep -Seconds 5

# Khởi động Frontend Người Dân với giới hạn RAM
Write-Host "3. Khởi động Frontend Người Dân (giới hạn RAM: 1GB)..." -ForegroundColor Yellow
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd frontend/nguoi-dan; `$env:NODE_OPTIONS='--max-old-space-size=1024'; `$env:NEXT_TELEMETRY_DISABLED='1'; npm run dev -- --port 3001" -WindowStyle Normal
Write-Host "   ✓ Frontend Người Dân đang khởi động..." -ForegroundColor Green

Write-Host ""
Write-Host "Đợi các service khởi động hoàn tất..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "KIỂM TRA TRẠNG THÁI" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Kiểm tra Backend
Write-Host "Backend API (port 5000)..." -NoNewline
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/categories" -Method Get -TimeoutSec 15 -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        Write-Host " ✓ Running" -ForegroundColor Green
    }
} catch {
    Write-Host " ✗ Not responding (đang khởi động...)" -ForegroundColor Yellow
}

# Kiểm tra Frontend Admin
Write-Host "Frontend Admin (port 3000)..." -NoNewline
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -Method Get -TimeoutSec 15 -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        Write-Host " ✓ Running" -ForegroundColor Green
    }
} catch {
    Write-Host " ✗ Not responding (đang khởi động...)" -ForegroundColor Yellow
}

# Kiểm tra Frontend Người Dân
Write-Host "Frontend Người Dân (port 3001)..." -NoNewline
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3001/" -Method Get -TimeoutSec 15 -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        Write-Host " ✓ Running" -ForegroundColor Green
    }
} catch {
    Write-Host " ✗ Not responding (đang khởi động...)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "HOÀN TẤT!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Các URL:" -ForegroundColor White
Write-Host "  Backend API:        http://localhost:5000" -ForegroundColor Cyan
Write-Host "  Swagger UI:         http://localhost:5000/swagger" -ForegroundColor Cyan
Write-Host "  Frontend Admin:     http://localhost:3000" -ForegroundColor Cyan
Write-Host "  Frontend Người Dân: http://localhost:3001" -ForegroundColor Cyan
Write-Host ""
Write-Host "Thông tin đăng nhập Admin:" -ForegroundColor White
Write-Host "  Email:    admin@phuongxa.vn" -ForegroundColor Gray
Write-Host "  Password: Admin@123456!Secure" -ForegroundColor Gray
Write-Host ""
Write-Host "⚡ TỐI ƯU HÓA RAM:" -ForegroundColor Yellow
Write-Host "  - Mỗi frontend giới hạn: 1GB RAM" -ForegroundColor Gray
Write-Host "  - Tắt Turbopack (dùng Webpack)" -ForegroundColor Gray
Write-Host "  - Tắt telemetry" -ForegroundColor Gray
Write-Host "  - Tối ưu webpack cache" -ForegroundColor Gray
Write-Host ""
Write-Host "💡 MẸO:" -ForegroundColor Yellow
Write-Host "  - Nếu vẫn thiếu RAM, đóng các ứng dụng khác" -ForegroundColor Gray
Write-Host "  - Chỉ chạy server cần thiết" -ForegroundColor Gray
Write-Host "  - Khởi động lần lượt thay vì cùng lúc" -ForegroundColor Gray
Write-Host ""
