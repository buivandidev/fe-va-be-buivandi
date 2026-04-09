# Script khởi động hệ thống Phường Xã - Phiên bản cuối cùng
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "HỆ THỐNG QUẢN LÝ PHƯỜNG XÃ" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Dừng tất cả process cũ
Write-Host "Dừng các process cũ..." -ForegroundColor Yellow
Stop-Process -Name "PhuongXa.API" -Force -ErrorAction SilentlyContinue
Stop-Process -Name "dotnet" -Force -ErrorAction SilentlyContinue  
Stop-Process -Name "node" -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2
Write-Host "✓ Đã dừng" -ForegroundColor Green

Write-Host ""
Write-Host "Khởi động Backend API..." -ForegroundColor Yellow
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd backend/phuongxa-api; `$env:ASPNETCORE_ENVIRONMENT='Development'; dotnet run --project src/PhuongXa.API" -WindowStyle Normal
Start-Sleep -Seconds 12

Write-Host ""
Write-Host "Khởi động Frontend Admin..." -ForegroundColor Yellow
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev" -WindowStyle Normal
Start-Sleep -Seconds 5

Write-Host ""
Write-Host "Khởi động Frontend Người Dân..." -ForegroundColor Yellow
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd frontend/nguoi-dan; npm run dev -- --port 3001" -WindowStyle Normal
Start-Sleep -Seconds 8

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "HỆ THỐNG ĐÃ KHỞI ĐỘNG!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 CÁC URL:" -ForegroundColor White
Write-Host "   Backend API:        http://localhost:5000" -ForegroundColor Cyan
Write-Host "   Swagger UI:         http://localhost:5000/swagger" -ForegroundColor Cyan
Write-Host "   Frontend Admin:     http://localhost:3000" -ForegroundColor Cyan
Write-Host "   Frontend Người Dân: http://localhost:3001" -ForegroundColor Cyan
Write-Host ""
Write-Host "🔐 ĐĂNG NHẬP ADMIN:" -ForegroundColor White
Write-Host "   Email:    admin@phuongxa.vn" -ForegroundColor Gray
Write-Host "   Password: Admin@123456!Secure" -ForegroundColor Gray
Write-Host ""
Write-Host "Nhấn Enter để đóng..." -ForegroundColor Gray
Read-Host
