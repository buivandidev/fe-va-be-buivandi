# Script để test và debug upload media

Write-Host "=== TEST UPLOAD MEDIA DEBUG ===" -ForegroundColor Cyan

# 1. Kiểm tra backend có đang chạy không
Write-Host "`n1. Kiểm tra Backend..." -ForegroundColor Yellow
$backendRunning = Get-Process -Name "PhuongXa.API" -ErrorAction SilentlyContinue
if ($backendRunning) {
    Write-Host "   ✓ Backend đang chạy" -ForegroundColor Green
} else {
    Write-Host "   ✗ Backend KHÔNG chạy - Cần start backend trước!" -ForegroundColor Red
    Write-Host "   Chạy: cd backend\phuongxa-api\src\PhuongXa.API; dotnet run" -ForegroundColor Yellow
    exit 1
}

# 2. Kiểm tra frontend có đang chạy không
Write-Host "`n2. Kiểm tra Frontend..." -ForegroundColor Yellow
$frontendPort = netstat -ano | Select-String ":3000" | Select-String "LISTENING"
if ($frontendPort) {
    Write-Host "   ✓ Frontend đang chạy trên port 3000" -ForegroundColor Green
} else {
    Write-Host "   ✗ Frontend KHÔNG chạy trên port 3000" -ForegroundColor Red
    Write-Host "   Chạy: cd frontend; npm run dev" -ForegroundColor Yellow
}

# 3. Test API endpoint
Write-Host "`n3. Test API Endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/admin/media/albums" -Method GET -ErrorAction Stop
    Write-Host "   ✗ Endpoint trả về mà không cần auth (không đúng!)" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "   ✓ Endpoint yêu cầu authentication (đúng!)" -ForegroundColor Green
    } else {
        Write-Host "   ? Lỗi không xác định: $($_.Exception.Message)" -ForegroundColor Yellow
    }
}

# 4. Hướng dẫn test upload
Write-Host "`n4. Hướng dẫn test upload:" -ForegroundColor Yellow
Write-Host "   a. Mở trình duyệt và vào: http://localhost:3000/admin/login" -ForegroundColor White
Write-Host "   b. Đăng nhập với tài khoản admin" -ForegroundColor White
Write-Host "   c. Mở Developer Tools (F12)" -ForegroundColor White
Write-Host "   d. Vào tab Console và chạy lệnh:" -ForegroundColor White
Write-Host "      localStorage.getItem('auth_token')" -ForegroundColor Cyan
Write-Host "   e. Nếu có token, copy token đó" -ForegroundColor White
Write-Host "   f. Vào tab Network" -ForegroundColor White
Write-Host "   g. Vào trang Library: http://localhost:3000/admin/library" -ForegroundColor White
Write-Host "   h. Thử upload một file" -ForegroundColor White
Write-Host "   i. Kiểm tra request /api/admin/media/upload" -ForegroundColor White
Write-Host "   j. Xem Headers > Request Headers có 'Authorization: Bearer <token>' không" -ForegroundColor White

Write-Host "`n5. Nếu vẫn lỗi 401:" -ForegroundColor Yellow
Write-Host "   - Kiểm tra JWT secret key trong appsettings.json" -ForegroundColor White
Write-Host "   - Kiểm tra user có role Admin hoặc BienTap không" -ForegroundColor White
Write-Host "   - Thử đăng xuất và đăng nhập lại" -ForegroundColor White
Write-Host "   - Restart backend: cd backend\phuongxa-api\src\PhuongXa.API; dotnet run" -ForegroundColor White

Write-Host "`n=== KẾT THÚC ===" -ForegroundColor Cyan
