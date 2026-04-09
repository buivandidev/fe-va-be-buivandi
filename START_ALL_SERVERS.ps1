# Script khởi động tất cả server
# Chạy: .\START_ALL_SERVERS.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "KHỞI ĐỘNG TẤT CẢ SERVER" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Kiểm tra xem có process nào đang chạy không
Write-Host "Kiểm tra process đang chạy..." -ForegroundColor Yellow

$backendRunning = Get-Process -Name "PhuongXa.API" -ErrorAction SilentlyContinue
$frontendRunning = Get-Process -Name "node" -ErrorAction SilentlyContinue

if ($backendRunning -or $frontendRunning) {
    Write-Host "⚠ Phát hiện process đang chạy!" -ForegroundColor Yellow
    Write-Host "Bạn có muốn dừng tất cả và khởi động lại? (Y/N)" -NoNewline
    $response = Read-Host
    
    if ($response -eq "Y" -or $response -eq "y") {
        Write-Host "Đang dừng các process..." -ForegroundColor Yellow
        Stop-Process -Name "PhuongXa.API" -Force -ErrorAction SilentlyContinue
        Stop-Process -Name "node" -Force -ErrorAction SilentlyContinue
        Start-Sleep -Seconds 2
    } else {
        Write-Host "Hủy khởi động." -ForegroundColor Red
        exit
    }
}

Write-Host ""

# Thiết lập biến môi trường để giới hạn RAM cho Node.js
$env:NODE_OPTIONS = "--max-old-space-size=1024"
$env:NEXT_TELEMETRY_DISABLED = "1"

# Khởi động Backend
Write-Host "1. Khởi động Backend API..." -ForegroundColor Yellow
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd backend/phuongxa-api; `$env:ASPNETCORE_ENVIRONMENT='Development'; dotnet run --project src/PhuongXa.API" -WindowStyle Normal
Write-Host "   ✓ Backend đang khởi động..." -ForegroundColor Green
Start-Sleep -Seconds 5

# Khởi động Frontend Admin với giới hạn RAM
Write-Host "2. Khởi động Frontend Admin (giới hạn RAM: 1GB)..." -ForegroundColor Yellow
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd frontend; `$env:NODE_OPTIONS='--max-old-space-size=1024'; `$env:NEXT_TELEMETRY_DISABLED='1'; npm run dev" -WindowStyle Normal
Write-Host "   ✓ Frontend Admin đang khởi động..." -ForegroundColor Green
Start-Sleep -Seconds 3

# Khởi động Frontend Người Dân với giới hạn RAM
Write-Host "3. Khởi động Frontend Người Dân (giới hạn RAM: 1GB)..." -ForegroundColor Yellow
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd frontend/nguoi-dan; `$env:NODE_OPTIONS='--max-old-space-size=1024'; `$env:NEXT_TELEMETRY_DISABLED='1'; npm run dev -- --port 3001" -WindowStyle Normal
Write-Host "   ✓ Frontend Người Dân đang khởi động..." -ForegroundColor Green

Write-Host ""
Write-Host "Đợi các service khởi động hoàn tất..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "KIỂM TRA TRẠNG THÁI" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Kiểm tra Backend
Write-Host "Backend API (port 5000)..." -NoNewline
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/categories" -Method Get -TimeoutSec 10
    if ($response.StatusCode -eq 200) {
        Write-Host " ✓ Running" -ForegroundColor Green
    }
} catch {
    Write-Host " ✗ Not responding (đang khởi động...)" -ForegroundColor Yellow
}

# Kiểm tra Frontend Admin
Write-Host "Frontend Admin (port 3000)..." -NoNewline
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/admin/login" -Method Get -TimeoutSec 10
    if ($response.StatusCode -eq 200) {
        Write-Host " ✓ Running" -ForegroundColor Green
    }
} catch {
    Write-Host " ✗ Not responding (đang khởi động...)" -ForegroundColor Yellow
}

# Kiểm tra Frontend Người Dân
Write-Host "Frontend Người Dân (port 3001)..." -NoNewline
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3001/" -Method Get -TimeoutSec 10
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
Write-Host "Nhấn Enter để đóng cửa sổ này..." -ForegroundColor Gray
Read-Host
