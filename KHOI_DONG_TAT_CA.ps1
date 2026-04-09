# Script khởi động tất cả server - Phiên bản ổn định
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "KHỞI ĐỘNG HỆ THỐNG PHƯỜNG XÃ" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 1. Dừng tất cả process cũ
Write-Host "1. Dừng các process cũ..." -ForegroundColor Yellow
Stop-Process -Name "PhuongXa.API" -Force -ErrorAction SilentlyContinue
Stop-Process -Name "dotnet" -Force -ErrorAction SilentlyContinue  
Stop-Process -Name "node" -Force -ErrorAction SilentlyContinue
Write-Host "   ✓ Đã dừng" -ForegroundColor Green
Start-Sleep -Seconds 3

# 2. Build Backend
Write-Host ""
Write-Host "2. Build Backend..." -ForegroundColor Yellow
Set-Location backend/phuongxa-api
dotnet build src/PhuongXa.API --verbosity quiet
if ($LASTEXITCODE -ne 0) {
    Write-Host "   ❌ Build backend thất bại!" -ForegroundColor Red
    Set-Location ../..
    Read-Host "Nhấn Enter để đóng"
    exit 1
}
Write-Host "   ✓ Build thành công" -ForegroundColor Green
Set-Location ../..

# 3. Khởi động Backend
Write-Host ""
Write-Host "3. Khởi động Backend API..." -ForegroundColor Yellow
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd backend/phuongxa-api; `$env:ASPNETCORE_ENVIRONMENT='Development'; dotnet run --project src/PhuongXa.API --no-build" -WindowStyle Normal
Write-Host "   ✓ Backend đang khởi động..." -ForegroundColor Green
Start-Sleep -Seconds 10

# 4. Kiểm tra Backend
Write-Host ""
Write-Host "4. Kiểm tra Backend..." -ForegroundColor Yellow
$backendOk = $false
for ($i = 1; $i -le 5; $i++) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:5000/swagger" -Method Get -TimeoutSec 5 -ErrorAction Stop
        if ($response.StatusCode -eq 200) {
            Write-Host "   ✓ Backend đã sẵn sàng!" -ForegroundColor Green
            $backendOk = $true
            break
        }
    } catch {
        Write-Host "   Đợi Backend khởi động... (lần $i/5)" -ForegroundColor Yellow
        Start-Sleep -Seconds 3
    }
}

if (-not $backendOk) {
    Write-Host "   ⚠ Backend chưa sẵn sàng, nhưng tiếp tục khởi động frontend..." -ForegroundColor Yellow
}

# 5. Khởi động Frontend Admin
Write-Host ""
Write-Host "5. Khởi động Frontend Admin..." -ForegroundColor Yellow
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev" -WindowStyle Normal
Write-Host "   ✓ Frontend Admin đang khởi động..." -ForegroundColor Green
Start-Sleep -Seconds 5

# 6. Khởi động Frontend Người Dân
Write-Host ""
Write-Host "6. Khởi động Frontend Người Dân..." -ForegroundColor Yellow
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd frontend/nguoi-dan; npm run dev -- --port 3001" -WindowStyle Normal
Write-Host "   ✓ Frontend Người Dân đang khởi động..." -ForegroundColor Green

Write-Host ""
Write-Host "Đợi frontend khởi động..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# 7. Tổng kết
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "HOÀN TẤT KHỞI ĐỘNG!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "CÁC URL:" -ForegroundColor White
Write-Host "  🔹 Backend API:        http://localhost:5000" -ForegroundColor Cyan
Write-Host "  🔹 Swagger UI:         http://localhost:5000/swagger" -ForegroundColor Cyan
Write-Host "  🔹 Frontend Admin:     http://localhost:3000" -ForegroundColor Cyan
Write-Host "  🔹 Frontend Người Dân: http://localhost:3001" -ForegroundColor Cyan
Write-Host ""
Write-Host "ĐĂNG NHẬP ADMIN:" -ForegroundColor White
Write-Host "  Email:    admin@phuongxa.vn" -ForegroundColor Gray
Write-Host "  Password: Admin@123456!Secure" -ForegroundColor Gray
Write-Host ""
Write-Host "LƯU Ý:" -ForegroundColor Yellow
Write-Host "  - Nếu trang web chưa hiển thị, đợi thêm 10-20 giây" -ForegroundColor Gray
Write-Host "  - Refresh trình duyệt (Ctrl+F5) nếu gặp lỗi cache" -ForegroundColor Gray
Write-Host "  - Kiểm tra các cửa sổ PowerShell khác để xem log" -ForegroundColor Gray
Write-Host ""
Write-Host "Nhấn Enter để đóng cửa sổ này..." -ForegroundColor Gray
Read-Host
