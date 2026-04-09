# Script khởi động Backend
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "KHỞI ĐỘNG BACKEND API" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Dừng process cũ
Write-Host "Dừng process cũ..." -ForegroundColor Yellow
Stop-Process -Name "PhuongXa.API" -Force -ErrorAction SilentlyContinue
Stop-Process -Name "dotnet" -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# Build
Write-Host "Build backend..." -ForegroundColor Yellow
Set-Location backend/phuongxa-api
dotnet build src/PhuongXa.API
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build thất bại!" -ForegroundColor Red
    Set-Location ../..
    Read-Host "Nhấn Enter để đóng"
    exit 1
}
Write-Host "✓ Build thành công" -ForegroundColor Green

# Chạy
Write-Host ""
Write-Host "Khởi động Backend API..." -ForegroundColor Yellow
$env:ASPNETCORE_ENVIRONMENT='Development'
dotnet run --project src/PhuongXa.API
