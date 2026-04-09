# Script restart toàn bộ hệ thống với clean build
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "RESTART TOÀN BỘ HỆ THỐNG - CLEAN BUILD" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Bước 1: Dừng tất cả processes
Write-Host "Bước 1: Dừng tất cả processes..." -ForegroundColor Yellow
Stop-Process -Name "PhuongXa.API" -Force -ErrorAction SilentlyContinue
Stop-Process -Name "dotnet" -Force -ErrorAction SilentlyContinue  
Stop-Process -Name "node" -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 3
Write-Host "✓ Đã dừng tất cả processes" -ForegroundColor Green

# Bước 2: Clean backend build artifacts
Write-Host ""
Write-Host "Bước 2: Xóa backend build artifacts..." -ForegroundColor Yellow
Remove-Item -Path "backend/phuongxa-api/src/PhuongXa.API/bin" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "backend/phuongxa-api/src/PhuongXa.API/obj" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "backend/phuongxa-api/src/PhuongXa.Application/bin" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "backend/phuongxa-api/src/PhuongXa.Application/obj" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "backend/phuongxa-api/src/PhuongXa.Domain/bin" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "backend/phuongxa-api/src/PhuongXa.Domain/obj" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "backend/phuongxa-api/src/PhuongXa.Infrastructure/bin" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "backend/phuongxa-api/src/PhuongXa.Infrastructure/obj" -Recurse -Force -ErrorAction SilentlyContinue
Write-Host "✓ Đã xóa backend artifacts" -ForegroundColor Green

# Bước 3: Clean frontend build artifacts
Write-Host ""
Write-Host "Bước 3: Xóa frontend build artifacts..." -ForegroundColor Yellow
Remove-Item -Path "frontend/.next" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "frontend/nguoi-dan/.next" -Recurse -Force -ErrorAction SilentlyContinue
Write-Host "✓ Đã xóa frontend artifacts" -ForegroundColor Green

# Bước 4: Khởi động Backend
Write-Host ""
Write-Host "Bước 4: Khởi động Backend API..." -ForegroundColor Yellow
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd backend/phuongxa-api; Write-Host 'Building backend...' -ForegroundColor Cyan; `$env:ASPNETCORE_ENVIRONMENT='Development'; dotnet build; Write-Host 'Starting backend...' -ForegroundColor Green; dotnet run --project src/PhuongXa.API --no-build" -WindowStyle Normal
Write-Host "✓ Backend đang khởi động..." -ForegroundColor Green
Start-Sleep -Seconds 15

# Bước 5: Khởi động Frontend Admin
Write-Host ""
Write-Host "Bước 5: Khởi động Frontend Admin..." -ForegroundColor Yellow
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd frontend; Write-Host 'Starting admin frontend...' -ForegroundColor Cyan; npm run dev -- -p 3001" -WindowStyle Normal
Write-Host "✓ Frontend Admin đang khởi động..." -ForegroundColor Green
Start-Sleep -Seconds 8

# Bước 6: Khởi động Frontend Người Dân
Write-Host ""
Write-Host "Bước 6: Khởi động Frontend Người Dân..." -ForegroundColor Yellow
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd frontend/nguoi-dan; Write-Host 'Starting nguoi-dan frontend...' -ForegroundColor Cyan; npm run dev" -WindowStyle Normal
Write-Host "✓ Frontend Người Dân đang khởi động..." -ForegroundColor Green
Start-Sleep -Seconds 8

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "HỆ THỐNG ĐÃ KHỞI ĐỘNG!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 CÁC URL:" -ForegroundColor White
Write-Host "   Backend API:        http://localhost:5000" -ForegroundColor Cyan
Write-Host "   Swagger UI:         http://localhost:5000/swagger" -ForegroundColor Cyan
Write-Host "   Frontend Admin:     http://localhost:3001" -ForegroundColor Cyan
Write-Host "   Frontend Người Dân: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "🔐 ĐĂNG NHẬP ADMIN:" -ForegroundColor White
Write-Host "   Email:    admin@phuongxa.vn" -ForegroundColor Gray
Write-Host "   Password: Admin@123456!Secure" -ForegroundColor Gray
Write-Host ""
Write-Host "⚠️  QUAN TRỌNG:" -ForegroundColor Yellow
Write-Host "   1. Mở Console (F12) trong trình duyệt" -ForegroundColor Gray
Write-Host "   2. Xóa token cũ: localStorage.removeItem('auth_token')" -ForegroundColor Gray
Write-Host "   3. Xóa token cũ: localStorage.removeItem('token')" -ForegroundColor Gray
Write-Host "   4. Refresh trang: location.reload()" -ForegroundColor Gray
Write-Host "   5. Đăng nhập lại" -ForegroundColor Gray
Write-Host ""
Write-Host "Nhấn Enter để đóng..." -ForegroundColor Gray
Read-Host
