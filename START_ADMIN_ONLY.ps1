# Script khởi động chỉ Frontend Admin
# Chạy: .\START_ADMIN_ONLY.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "KHỞI ĐỘNG FRONTEND ADMIN" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Dừng node processes
Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object { $_.Path -like "*frontend*" } | Stop-Process -Force
Start-Sleep -Seconds 2

# Thiết lập biến môi trường
$env:NODE_OPTIONS = "--max-old-space-size=1024"
$env:NEXT_TELEMETRY_DISABLED = "1"

# Khởi động Frontend Admin
Write-Host "Khởi động Frontend Admin (giới hạn RAM: 1GB)..." -ForegroundColor Yellow
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd frontend; `$env:NODE_OPTIONS='--max-old-space-size=1024'; `$env:NEXT_TELEMETRY_DISABLED='1'; npm run dev" -WindowStyle Normal
Write-Host "✓ Frontend Admin đang khởi động..." -ForegroundColor Green

Start-Sleep -Seconds 15

Write-Host ""
Write-Host "Kiểm tra trạng thái..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -Method Get -TimeoutSec 15
    if ($response.StatusCode -eq 200) {
        Write-Host "✓ Frontend Admin đang chạy!" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠ Frontend đang khởi động, vui lòng đợi..." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Frontend Admin: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Login:          http://localhost:3000/admin/login" -ForegroundColor Cyan
Write-Host ""
Write-Host "Thông tin đăng nhập:" -ForegroundColor White
Write-Host "  Email:    admin@phuongxa.vn" -ForegroundColor Gray
Write-Host "  Password: Admin@123456!Secure" -ForegroundColor Gray
Write-Host ""
