# Script kiểm tra đầy đủ chức năng Admin
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "KIỂM TRA CHỨC NĂNG ADMIN" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:5000"
$adminEmail = "admin@phuongxa.vn"
$adminPassword = "Admin@123456!Secure"

# Test 1: Admin Login
Write-Host "[1/5] Đăng nhập Admin..." -ForegroundColor Yellow
try {
    $loginBody = @{
        email = $adminEmail
        matKhau = $adminPassword
    } | ConvertTo-Json

    $loginResponse = Invoke-WebRequest -Uri "$baseUrl/api/auth/login" `
        -Method POST `
        -Body $loginBody `
        -ContentType "application/json" `
        -UseBasicParsing

    $loginData = $loginResponse.Content | ConvertFrom-Json
    $token = $loginData.duLieu.maTruyCap

    if ($token) {
        Write-Host "   ✓ Đăng nhập thành công" -ForegroundColor Green
        Write-Host "   Token: $($token.Substring(0, 20))..." -ForegroundColor Gray
    } else {
        Write-Host "   ✗ Không nhận được token" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "   ✗ Lỗi đăng nhập: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Test 2: Get Dashboard Stats
Write-Host "[2/5] Lấy thống kê dashboard..." -ForegroundColor Yellow
try {
    $headers = @{
        "Authorization" = "Bearer $token"
    }

    $statsResponse = Invoke-WebRequest -Uri "$baseUrl/api/admin/dashboard/stats" `
        -Method GET `
        -Headers $headers `
        -UseBasicParsing

    $stats = ($statsResponse.Content | ConvertFrom-Json).duLieu
    Write-Host "   ✓ Lấy thống kê thành công" -ForegroundColor Green
    Write-Host "   - Tổng người dùng: $($stats.tongNguoiDung)" -ForegroundColor Gray
    Write-Host "   - Tổng bài viết: $($stats.tongBaiViet)" -ForegroundColor Gray
    Write-Host "   - Tổng đơn ứng: $($stats.tongDonUng)" -ForegroundColor Gray
} catch {
    Write-Host "   ✗ Lỗi lấy thống kê: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Get Users List
Write-Host "[3/5] Lấy danh sách người dùng..." -ForegroundColor Yellow
try {
    $usersResponse = Invoke-WebRequest -Uri "$baseUrl/api/admin/users?trang=1&kichThuocTrang=5" `
        -Method GET `
        -Headers $headers `
        -UseBasicParsing

    $usersData = ($usersResponse.Content | ConvertFrom-Json).duLieu
    Write-Host "   ✓ Lấy danh sách thành công" -ForegroundColor Green
    Write-Host "   - Tổng số: $($usersData.tongSo)" -ForegroundColor Gray
    Write-Host "   - Số người dùng hiển thị: $($usersData.danhSach.Count)" -ForegroundColor Gray
} catch {
    Write-Host "   ✗ Lỗi lấy danh sách người dùng: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: Get Applications List
Write-Host "[4/5] Lấy danh sách đơn ứng..." -ForegroundColor Yellow
try {
    $appsResponse = Invoke-WebRequest -Uri "$baseUrl/api/admin/applications?trang=1&kichThuocTrang=5" `
        -Method GET `
        -Headers $headers `
        -UseBasicParsing

    $appsData = ($appsResponse.Content | ConvertFrom-Json).duLieu
    Write-Host "   ✓ Lấy danh sách thành công" -ForegroundColor Green
    Write-Host "   - Tổng số: $($appsData.tongSo)" -ForegroundColor Gray
    Write-Host "   - Số đơn hiển thị: $($appsData.danhSach.Count)" -ForegroundColor Gray
} catch {
    Write-Host "   ✗ Lỗi lấy danh sách đơn ứng: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 5: Get Articles List
Write-Host "[5/5] Lấy danh sách bài viết..." -ForegroundColor Yellow
try {
    $articlesResponse = Invoke-WebRequest -Uri "$baseUrl/api/admin/articles?trang=1&kichThuocTrang=5" `
        -Method GET `
        -Headers $headers `
        -UseBasicParsing

    $articlesData = ($articlesResponse.Content | ConvertFrom-Json).duLieu
    Write-Host "   ✓ Lấy danh sách thành công" -ForegroundColor Green
    Write-Host "   - Tổng số: $($articlesData.tongSo)" -ForegroundColor Gray
    Write-Host "   - Số bài viết hiển thị: $($articlesData.danhSach.Count)" -ForegroundColor Gray
} catch {
    Write-Host "   ✗ Lỗi lấy danh sách bài viết: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "HOÀN TẤT KIỂM TRA" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Hướng dẫn sử dụng Admin Panel:" -ForegroundColor Yellow
Write-Host "1. Truy cập: http://localhost:3000/admin/login" -ForegroundColor White
Write-Host "2. Đăng nhập với:" -ForegroundColor White
Write-Host "   Email: $adminEmail" -ForegroundColor Gray
Write-Host "   Mật khẩu: $adminPassword" -ForegroundColor Gray
Write-Host "3. Sau khi đăng nhập, token sẽ được lưu tự động" -ForegroundColor White
Write-Host "4. Tất cả API calls sẽ tự động gửi token trong header" -ForegroundColor White
Write-Host ""
