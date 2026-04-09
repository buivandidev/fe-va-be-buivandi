# Script restart backend sau khi fix JWT
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "RESTART BACKEND API" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Dừng backend cũ
Write-Host "Dừng backend cũ..." -ForegroundColor Yellow
Stop-Process -Name "PhuongXa.API" -Force -ErrorAction SilentlyContinue
Stop-Process -Name "dotnet" -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2
Write-Host "✓ Đã dừng" -ForegroundColor Green

# Clean build artifacts
Write-Host ""
Write-Host "Xóa build artifacts cũ..." -ForegroundColor Yellow
Remove-Item -Path "backend/phuongxa-api/src/PhuongXa.API/bin" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "backend/phuongxa-api/src/PhuongXa.API/obj" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "backend/phuongxa-api/src/PhuongXa.Infrastructure/bin" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "backend/phuongxa-api/src/PhuongXa.Infrastructure/obj" -Recurse -Force -ErrorAction SilentlyContinue
Write-Host "✓ Đã xóa" -ForegroundColor Green

Write-Host ""
Write-Host "Rebuild và khởi động Backend API..." -ForegroundColor Yellow
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd backend/phuongxa-api; `$env:ASPNETCORE_ENVIRONMENT='Development'; dotnet build; dotnet run --project src/PhuongXa.API --no-build" -WindowStyle Normal

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "BACKEND ĐANG KHỞI ĐỘNG!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Đợi 15 giây để backend khởi động hoàn tất..." -ForegroundColor Yellow
Write-Host "Backend API: http://localhost:5000" -ForegroundColor Cyan
Write-Host "Swagger UI:  http://localhost:5000/swagger" -ForegroundColor Cyan
Write-Host ""
Write-Host "Sau khi backend khởi động, hãy:" -ForegroundColor White
Write-Host "1. Xóa token cũ trong localStorage" -ForegroundColor Gray
Write-Host "2. Đăng nhập lại" -ForegroundColor Gray
Write-Host ""
Write-Host "Nhấn Enter để đóng..." -ForegroundColor Gray
Read-Host
