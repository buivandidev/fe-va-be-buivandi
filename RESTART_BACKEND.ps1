# Script để restart backend sau khi fix media upload

Write-Host "=== RESTART BACKEND ===" -ForegroundColor Cyan
Write-Host ""

# Tìm và kill process backend đang chạy
Write-Host "Đang tìm process backend..." -ForegroundColor Yellow
$backendProcess = Get-Process -Name "PhuongXa.API" -ErrorAction SilentlyContinue

if ($backendProcess) {
    Write-Host "Tìm thấy process PhuongXa.API (PID: $($backendProcess.Id))" -ForegroundColor Green
    Write-Host "Đang dừng process..." -ForegroundColor Yellow
    Stop-Process -Id $backendProcess.Id -Force
    Start-Sleep -Seconds 2
    Write-Host "✓ Đã dừng backend" -ForegroundColor Green
} else {
    Write-Host "Không tìm thấy process backend đang chạy" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Đang khởi động lại backend..." -ForegroundColor Yellow
Write-Host ""

# Chuyển đến thư mục backend
Set-Location "backend/phuongxa-api/src/PhuongXa.API"

# Chạy backend
Write-Host "Backend đang khởi động tại http://localhost:5000" -ForegroundColor Green
Write-Host "Swagger UI: http://localhost:5000/swagger" -ForegroundColor Green
Write-Host ""
Write-Host "Nhấn Ctrl+C để dừng backend" -ForegroundColor Yellow
Write-Host ""

dotnet run
