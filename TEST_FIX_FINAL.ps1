# Test fix cuối cùng
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "TEST FIX CUỐI CÙNG" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Kiểm tra backend
Write-Host "[1/4] Kiểm tra Backend (port 5000)..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/health" -UseBasicParsing -TimeoutSec 5
    Write-Host "   ✓ Backend đang chạy (Status: $($response.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "   ✗ Backend KHÔNG chạy!" -ForegroundColor Red
    Write-Host "   Chạy lệnh: cd backend/phuongxa-api; dotnet run --project src/PhuongXa.API" -ForegroundColor Yellow
    exit 1
}

# Test 2: Kiểm tra frontend admin
Write-Host "[2/4] Kiểm tra Frontend Admin (port 3000)..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing -TimeoutSec 5
    Write-Host "   ✓ Frontend Admin đang chạy (Status: $($response.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "   ✗ Frontend Admin KHÔNG chạy!" -ForegroundColor Red
    Write-Host "   Chạy lệnh: cd frontend; npm run dev" -ForegroundColor Yellow
    exit 1
}

# Test 3: Login và lấy token
Write-Host "[3/4] Test Login API..." -ForegroundColor Yellow
try {
    $loginBody = @{
        email = "admin@phuongxa.vn"
        matKhau = "Admin@123456!Secure"
    } | ConvertTo-Json

    $loginResponse = Invoke-WebRequest -Uri "http://localhost:5000/api/auth/login" `
        -Method POST `
        -Body $loginBody `
        -ContentType "application/json" `
        -UseBasicParsing

    $loginData = $loginResponse.Content | ConvertFrom-Json
    $token = $loginData.duLieu.maTruyCap

    if ($token) {
        Write-Host "   ✓ Login thành công" -ForegroundColor Green
    } else {
        Write-Host "   ✗ Không nhận được token" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "   ✗ Lỗi login: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Test 4: Test Users API với token
Write-Host "[4/4] Test Users API với token..." -ForegroundColor Yellow
try {
    $headers = @{
        "Authorization" = "Bearer $token"
    }

    $usersResponse = Invoke-WebRequest -Uri "http://localhost:5000/api/admin/users?trang=1&kichThuocTrang=5" `
        -Method GET `
        -Headers $headers `
        -UseBasicParsing

    $usersData = ($usersResponse.Content | ConvertFrom-Json).duLieu
    Write-Host "   ✓ Users API hoạt động!" -ForegroundColor Green
    Write-Host "   - Tổng số người dùng: $($usersData.tongSo)" -ForegroundColor Gray
    Write-Host "   - Số người dùng hiển thị: $($usersData.danhSach.Count)" -ForegroundColor Gray
} catch {
    Write-Host "   ✗ Lỗi Users API: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✓ TẤT CẢ TESTS ĐỀU PASS!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Bây giờ bạn có thể:" -ForegroundColor Yellow
Write-Host "1. Mở browser: http://localhost:3000/admin/login" -ForegroundColor White
Write-Host "2. Đăng nhập với:" -ForegroundColor White
Write-Host "   Email: admin@phuongxa.vn" -ForegroundColor Gray
Write-Host "   Mật khẩu: Admin@123456!Secure" -ForegroundColor Gray
Write-Host "3. Vào trang 'Người dùng' - Sẽ KHÔNG còn lỗi Network Error!" -ForegroundColor White
Write-Host ""
Write-Host "Nếu vẫn gặp lỗi trong browser:" -ForegroundColor Yellow
Write-Host "- Xóa cache browser (Ctrl+Shift+Delete)" -ForegroundColor White
Write-Host "- Hard refresh (Ctrl+F5)" -ForegroundColor White
Write-Host "- Xóa localStorage: F12 → Application → Local Storage → Clear" -ForegroundColor White
Write-Host ""
