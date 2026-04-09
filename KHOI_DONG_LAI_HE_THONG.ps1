# Script khởi động lại toàn bộ hệ thống sau khi sửa lỗi
# Chạy script này để restart backend và frontend

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  KHỞI ĐỘNG LẠI HỆ THỐNG" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Kiểm tra các process đang chạy
Write-Host "🔍 Kiểm tra các process đang chạy..." -ForegroundColor Yellow

$backendProcess = Get-Process -Name "PhuongXa.API" -ErrorAction SilentlyContinue
$frontendAdminProcess = Get-Process | Where-Object { $_.ProcessName -eq "node" -and $_.Path -like "*frontend*" } -ErrorAction SilentlyContinue
$frontendNguoiDanProcess = Get-Process | Where-Object { $_.ProcessName -eq "node" -and $_.Path -like "*nguoi-dan*" } -ErrorAction SilentlyContinue

# Dừng các process cũ
if ($backendProcess) {
    Write-Host "⏹️  Dừng Backend..." -ForegroundColor Yellow
    Stop-Process -Name "PhuongXa.API" -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
}

if ($frontendAdminProcess -or $frontendNguoiDanProcess) {
    Write-Host "⏹️  Dừng Frontend processes..." -ForegroundColor Yellow
    Get-Process | Where-Object { $_.ProcessName -eq "node" } | Stop-Process -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  KHỞI ĐỘNG CÁC SERVICES" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# 1. Khởi động Backend
Write-Host "🚀 [1/3] Khởi động Backend API..." -ForegroundColor Cyan
Write-Host "   Port: 5000" -ForegroundColor Gray
Write-Host "   Path: backend/phuongxa-api/src/PhuongXa.API" -ForegroundColor Gray

$backendPath = Join-Path $PSScriptRoot "backend\phuongxa-api\src\PhuongXa.API"
if (Test-Path $backendPath) {
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; Write-Host '🔧 Backend API Starting...' -ForegroundColor Green; dotnet run" -WindowStyle Normal
    Write-Host "   ✅ Backend process started" -ForegroundColor Green
} else {
    Write-Host "   ❌ Backend path not found: $backendPath" -ForegroundColor Red
}

Start-Sleep -Seconds 3

# 2. Khởi động Frontend Admin
Write-Host ""
Write-Host "🚀 [2/3] Khởi động Frontend Admin..." -ForegroundColor Cyan
Write-Host "   Port: 3001" -ForegroundColor Gray
Write-Host "   Path: frontend" -ForegroundColor Gray

$frontendPath = Join-Path $PSScriptRoot "frontend"
if (Test-Path $frontendPath) {
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; Write-Host '🎨 Frontend Admin Starting...' -ForegroundColor Green; npm run dev" -WindowStyle Normal
    Write-Host "   ✅ Frontend Admin process started" -ForegroundColor Green
} else {
    Write-Host "   ❌ Frontend path not found: $frontendPath" -ForegroundColor Red
}

Start-Sleep -Seconds 2

# 3. Khởi động Frontend Người Dân
Write-Host ""
Write-Host "🚀 [3/3] Khởi động Frontend Người Dân..." -ForegroundColor Cyan
Write-Host "   Port: 3000" -ForegroundColor Gray
Write-Host "   Path: frontend/nguoi-dan" -ForegroundColor Gray

$nguoiDanPath = Join-Path $PSScriptRoot "frontend\nguoi-dan"
if (Test-Path $nguoiDanPath) {
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$nguoiDanPath'; Write-Host '👥 Frontend Người Dân Starting...' -ForegroundColor Green; npm run dev" -WindowStyle Normal
    Write-Host "   ✅ Frontend Người Dân process started" -ForegroundColor Green
} else {
    Write-Host "   ❌ Frontend Người Dân path not found: $nguoiDanPath" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  ĐANG KHỞI ĐỘNG..." -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "⏳ Đợi các services khởi động (30 giây)..." -ForegroundColor Yellow

# Đợi 30 giây để các services khởi động
for ($i = 30; $i -gt 0; $i--) {
    Write-Host "`r   $i giây còn lại..." -NoNewline -ForegroundColor Gray
    Start-Sleep -Seconds 1
}

Write-Host ""
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  HỆ THỐNG ĐÃ SẴN SÀNG!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📍 Các địa chỉ truy cập:" -ForegroundColor Yellow
Write-Host ""
Write-Host "   🔧 Backend API:" -ForegroundColor White
Write-Host "      http://localhost:5000" -ForegroundColor Green
Write-Host "      http://localhost:5000/swagger (API Documentation)" -ForegroundColor Green
Write-Host ""
Write-Host "   👨‍💼 Admin Portal:" -ForegroundColor White
Write-Host "      http://localhost:3001" -ForegroundColor Green
Write-Host "      http://localhost:3001/admin/login (Đăng nhập Admin)" -ForegroundColor Green
Write-Host ""
Write-Host "   👥 Người Dân Portal:" -ForegroundColor White
Write-Host "      http://localhost:3000" -ForegroundColor Green
Write-Host "      http://localhost:3000/dang-nhap (Đăng nhập)" -ForegroundColor Green
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  CÁC THAY ĐỔI MỚI" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ Đã sửa lỗi CORS cho upload media" -ForegroundColor Green
Write-Host "✅ Đã tạo API routes cho media trong frontend" -ForegroundColor Green
Write-Host "✅ Đã sửa format tham số loại media" -ForegroundColor Green
Write-Host "✅ Đã thêm token authentication cho DELETE media" -ForegroundColor Green
Write-Host ""
Write-Host "========================================" -ForegroundColor Yellow
Write-Host "  HƯỚNG DẪN TEST" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Test đăng nhập Admin:" -ForegroundColor White
Write-Host "   - Mở: http://localhost:3001/admin/login" -ForegroundColor Gray
Write-Host "   - Đăng nhập với tài khoản admin" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Test upload media:" -ForegroundColor White
Write-Host "   - Vào: http://localhost:3001/admin/library" -ForegroundColor Gray
Write-Host "   - Chọn file ảnh hoặc video" -ForegroundColor Gray
Write-Host "   - Nhập tiêu đề và click 'Tải lên'" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Test đăng nhập Người Dân:" -ForegroundColor White
Write-Host "   - Mở: http://localhost:3000/dang-nhap" -ForegroundColor Gray
Write-Host "   - Đăng nhập hoặc đăng ký tài khoản mới" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Test API endpoints (sau khi có token):" -ForegroundColor White
Write-Host "   .\TEST_ALL_ENDPOINTS.ps1 -Token 'your_token_here'" -ForegroundColor Gray
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "💡 Tip: Mở F12 (Developer Tools) để xem console logs" -ForegroundColor Yellow
Write-Host "💡 Tip: Kiểm tra Network tab để debug API calls" -ForegroundColor Yellow
Write-Host ""
Write-Host "Nhấn Enter để đóng cửa sổ này..." -ForegroundColor Gray
Read-Host
