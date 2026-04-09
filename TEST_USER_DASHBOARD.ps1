# Test User Dashboard Data
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "TEST USER DASHBOARD" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Test user credentials
$userEmail = "buivandi04082023@gmail.com"
$userPassword = "Password123!"

# Step 1: Login as user
Write-Host "[1/4] Đăng nhập user..." -ForegroundColor Yellow
try {
    $loginBody = @{
        email = $userEmail
        matKhau = $userPassword
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

# Step 2: Get user profile
Write-Host "[2/4] Lấy thông tin profile..." -ForegroundColor Yellow
try {
    $headers = @{
        "Authorization" = "Bearer $token"
    }

    $profileResponse = Invoke-WebRequest -Uri "http://localhost:5000/api/public/profile" `
        -Method GET `
        -Headers $headers `
        -UseBasicParsing

    $profileData = ($profileResponse.Content | ConvertFrom-Json).duLieu
    Write-Host "   ✓ Profile: $($profileData.hoTen)" -ForegroundColor Green
} catch {
    Write-Host "   ✗ Lỗi lấy profile: $($_.Exception.Message)" -ForegroundColor Red
}

# Step 3: Get user applications
Write-Host "[3/4] Lấy danh sách hồ sơ..." -ForegroundColor Yellow
try {
    $appsResponse = Invoke-WebRequest -Uri "http://localhost:5000/api/public/applications?trang=1&kichThuocTrang=100" `
        -Method GET `
        -Headers $headers `
        -UseBasicParsing

    $appsData = ($appsResponse.Content | ConvertFrom-Json).duLieu
    $totalApps = $appsData.tongSo
    $apps = $appsData.danhSach

    Write-Host "   ✓ Tổng số hồ sơ: $totalApps" -ForegroundColor Green
    
    if ($totalApps -gt 0) {
        Write-Host "   Danh sách hồ sơ:" -ForegroundColor Gray
        foreach ($app in $apps) {
            $status = switch ($app.trangThai) {
                0 { "Chờ xử lý" }
                1 { "Đang xử lý" }
                2 { "Yêu cầu bổ sung" }
                3 { "Đã hoàn thành" }
                4 { "Từ chối" }
                default { "Không xác định" }
            }
            Write-Host "   - $($app.maTheoDoi): $($app.tenDichVu) - $status" -ForegroundColor Gray
        }
        
        # Count by status
        $dangXuLy = ($apps | Where-Object { $_.trangThai -in @(0, 1, 2) }).Count
        $hoanThanh = ($apps | Where-Object { $_.trangThai -eq 3 }).Count
        $tuChoi = ($apps | Where-Object { $_.trangThai -eq 4 }).Count
        
        Write-Host ""
        Write-Host "   Thống kê:" -ForegroundColor Yellow
        Write-Host "   - Đang xử lý: $dangXuLy" -ForegroundColor Gray
        Write-Host "   - Đã hoàn thành: $hoanThanh" -ForegroundColor Gray
        Write-Host "   - Từ chối: $tuChoi" -ForegroundColor Gray
    } else {
        Write-Host "   ⚠ Không có hồ sơ nào" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ✗ Lỗi lấy danh sách hồ sơ: $($_.Exception.Message)" -ForegroundColor Red
}

# Step 4: Get notifications count
Write-Host "[4/4] Lấy số thông báo chưa đọc..." -ForegroundColor Yellow
try {
    $notifResponse = Invoke-WebRequest -Uri "http://localhost:5000/api/notifications/count" `
        -Method GET `
        -Headers $headers `
        -UseBasicParsing

    $notifData = ($notifResponse.Content | ConvertFrom-Json).duLieu
    $unreadCount = $notifData.soLuongChuaDoc
    Write-Host "   ✓ Thông báo chưa đọc: $unreadCount" -ForegroundColor Green
} catch {
    Write-Host "   ✗ Lỗi lấy thông báo: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "HOÀN TẤT KIỂM TRA" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if ($totalApps -eq 0) {
    Write-Host "⚠ User chưa có hồ sơ nào!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Để test đầy đủ, hãy:" -ForegroundColor Yellow
    Write-Host "1. Truy cập: http://localhost:3001/dich-vu-cong" -ForegroundColor White
    Write-Host "2. Chọn một dịch vụ và nộp hồ sơ" -ForegroundColor White
    Write-Host "3. Sau đó quay lại trang cá nhân để xem thống kê" -ForegroundColor White
} else {
    Write-Host "✓ User đã có $totalApps hồ sơ" -ForegroundColor Green
    Write-Host ""
    Write-Host "Kiểm tra trang cá nhân:" -ForegroundColor Yellow
    Write-Host "1. Truy cập: http://localhost:3001/ca-nhan" -ForegroundColor White
    Write-Host "2. Đăng nhập với:" -ForegroundColor White
    Write-Host "   Email: $userEmail" -ForegroundColor Gray
    Write-Host "   Mật khẩu: $userPassword" -ForegroundColor Gray
    Write-Host "3. Kiểm tra số liệu hiển thị có khớp không" -ForegroundColor White
}
Write-Host ""
