# Script để restart tất cả các server sau khi fix media

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   RESTART TẤT CẢ CÁC SERVER" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# ============================================
# 1. DỪNG TẤT CẢ PROCESS ĐANG CHẠY
# ============================================
Write-Host "BƯỚC 1: Dừng tất cả process đang chạy..." -ForegroundColor Yellow
Write-Host ""

# Dừng Backend
$backendProcess = Get-Process -Name "PhuongXa.API" -ErrorAction SilentlyContinue
if ($backendProcess) {
    Write-Host "  [Backend] Tìm thấy process (PID: $($backendProcess.Id))" -ForegroundColor Green
    Stop-Process -Id $backendProcess.Id -Force
    Write-Host "  [Backend] ✓ Đã dừng" -ForegroundColor Green
} else {
    Write-Host "  [Backend] Không có process đang chạy" -ForegroundColor Gray
}

# Dừng Frontend Admin (node process trên port 3000)
$adminProcess = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
if ($adminProcess) {
    Write-Host "  [Frontend Admin] Tìm thấy process trên port 3000 (PID: $adminProcess)" -ForegroundColor Green
    Stop-Process -Id $adminProcess -Force -ErrorAction SilentlyContinue
    Write-Host "  [Frontend Admin] ✓ Đã dừng" -ForegroundColor Green
} else {
    Write-Host "  [Frontend Admin] Không có process đang chạy" -ForegroundColor Gray
}

# Dừng Frontend Người Dân (node process trên port 3001)
$nguoidanProcess = Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
if ($nguoidanProcess) {
    Write-Host "  [Frontend Người Dân] Tìm thấy process trên port 3001 (PID: $nguoidanProcess)" -ForegroundColor Green
    Stop-Process -Id $nguoidanProcess -Force -ErrorAction SilentlyContinue
    Write-Host "  [Frontend Người Dân] ✓ Đã dừng" -ForegroundColor Green
} else {
    Write-Host "  [Frontend Người Dân] Không có process đang chạy" -ForegroundColor Gray
}

Write-Host ""
Write-Host "Chờ 3 giây để các process dừng hoàn toàn..." -ForegroundColor Gray
Start-Sleep -Seconds 3

# ============================================
# 2. KHỞI ĐỘNG LẠI BACKEND
# ============================================
Write-Host ""
Write-Host "BƯỚC 2: Khởi động Backend..." -ForegroundColor Yellow
Write-Host ""

$backendPath = "backend/phuongxa-api/src/PhuongXa.API"
if (Test-Path $backendPath) {
    Write-Host "  Đang khởi động Backend tại $backendPath..." -ForegroundColor Cyan
    
    # Khởi động backend trong terminal mới
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; Write-Host 'Backend đang chạy tại http://localhost:5000' -ForegroundColor Green; Write-Host 'Swagger UI: http://localhost:5000/swagger' -ForegroundColor Green; Write-Host ''; dotnet run"
    
    Write-Host "  ✓ Backend đã được khởi động trong terminal mới" -ForegroundColor Green
    Write-Host "    URL: http://localhost:5000" -ForegroundColor Cyan
    Write-Host "    Swagger: http://localhost:5000/swagger" -ForegroundColor Cyan
} else {
    Write-Host "  ✗ Không tìm thấy thư mục Backend: $backendPath" -ForegroundColor Red
}

Write-Host ""
Write-Host "Chờ 5 giây để Backend khởi động..." -ForegroundColor Gray
Start-Sleep -Seconds 5

# ============================================
# 3. KHỞI ĐỘNG LẠI FRONTEND ADMIN
# ============================================
Write-Host ""
Write-Host "BƯỚC 3: Khởi động Frontend Admin..." -ForegroundColor Yellow
Write-Host ""

$adminPath = "frontend"
if (Test-Path $adminPath) {
    Write-Host "  Đang khởi động Frontend Admin tại $adminPath..." -ForegroundColor Cyan
    
    # Khởi động frontend admin trong terminal mới
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$adminPath'; Write-Host 'Frontend Admin đang chạy tại http://localhost:3000' -ForegroundColor Green; Write-Host ''; npm run dev"
    
    Write-Host "  ✓ Frontend Admin đã được khởi động trong terminal mới" -ForegroundColor Green
    Write-Host "    URL: http://localhost:3000" -ForegroundColor Cyan
    Write-Host "    Login: http://localhost:3000/admin/login" -ForegroundColor Cyan
} else {
    Write-Host "  ✗ Không tìm thấy thư mục Frontend Admin: $adminPath" -ForegroundColor Red
}

Write-Host ""
Write-Host "Chờ 3 giây..." -ForegroundColor Gray
Start-Sleep -Seconds 3

# ============================================
# 4. KHỞI ĐỘNG LẠI FRONTEND NGƯỜI DÂN
# ============================================
Write-Host ""
Write-Host "BƯỚC 4: Khởi động Frontend Người Dân..." -ForegroundColor Yellow
Write-Host ""

$nguoidanPath = "frontend/nguoi-dan"
if (Test-Path $nguoidanPath) {
    Write-Host "  Đang khởi động Frontend Người Dân tại $nguoidanPath..." -ForegroundColor Cyan
    
    # Khởi động frontend người dân trong terminal mới
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$nguoidanPath'; Write-Host 'Frontend Người Dân đang chạy tại http://localhost:3001' -ForegroundColor Green; Write-Host ''; npm run dev"
    
    Write-Host "  ✓ Frontend Người Dân đã được khởi động trong terminal mới" -ForegroundColor Green
    Write-Host "    URL: http://localhost:3001" -ForegroundColor Cyan
    Write-Host "    Thư viện: http://localhost:3001/thu-vien" -ForegroundColor Cyan
} else {
    Write-Host "  ✗ Không tìm thấy thư mục Frontend Người Dân: $nguoidanPath" -ForegroundColor Red
}

# ============================================
# 5. HOÀN THÀNH
# ============================================
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "   ✓ HOÀN THÀNH!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Tất cả các server đã được khởi động trong các terminal riêng biệt:" -ForegroundColor White
Write-Host ""
Write-Host "  1. Backend API:" -ForegroundColor Cyan
Write-Host "     → http://localhost:5000" -ForegroundColor White
Write-Host "     → http://localhost:5000/swagger" -ForegroundColor White
Write-Host ""
Write-Host "  2. Frontend Admin:" -ForegroundColor Cyan
Write-Host "     → http://localhost:3000" -ForegroundColor White
Write-Host "     → http://localhost:3000/admin/login" -ForegroundColor White
Write-Host ""
Write-Host "  3. Frontend Người Dân:" -ForegroundColor Cyan
Write-Host "     → http://localhost:3001" -ForegroundColor White
Write-Host "     → http://localhost:3001/thu-vien" -ForegroundColor White
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Chờ khoảng 10-15 giây để tất cả server khởi động hoàn toàn..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Để test fix media:" -ForegroundColor Cyan
Write-Host "  1. Vào http://localhost:3000/admin/library" -ForegroundColor White
Write-Host "  2. Upload ảnh/video" -ForegroundColor White
Write-Host "  3. Kiểm tra hiển thị tại http://localhost:3001/thu-vien" -ForegroundColor White
Write-Host ""
Write-Host "Nhấn phím bất kỳ để đóng cửa sổ này..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
