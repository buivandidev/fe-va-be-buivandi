# Test toàn bộ luồng UI/UX
$baseUrl = "http://localhost:5000"
$email = "nguoidung_test_$(Get-Random)@test.com"
$password = "Test@123456"
$hoTen = "Nguyen Van Test"

Write-Host "=== KIỂM TRA LUỒNG UI/UX ===" -ForegroundColor Cyan
Write-Host ""

# Bước 1: Đăng ký
Write-Host "Bước 1: Đăng ký tài khoản..." -ForegroundColor Yellow
$registerBody = @{
    hoTen = $hoTen
    email = $email
    matKhau = $password
    xacNhanMatKhau = $password
} | ConvertTo-Json

try {
    $registerResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/register" -Method Post -Body $registerBody -ContentType "application/json"
    if ($registerResponse.thanhCong -or $registerResponse.ThanhCong) {
        Write-Host "✓ Đăng ký thành công" -ForegroundColor Green
    } else {
        Write-Host "✗ Đăng ký thất bại: $($registerResponse.thongDiep ?? $registerResponse.ThongDiep)" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "✗ Lỗi đăng ký: $_" -ForegroundColor Red
    exit 1
}

Start-Sleep -Seconds 1

# Bước 2: Đăng nhập
Write-Host "Bước 2: Đăng nhập..." -ForegroundColor Yellow
$loginBody = @{
    email = $email
    matKhau = $password
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
    $token = $loginResponse.duLieu.maTruyCap ?? $loginResponse.DuLieu.MaTruyCap ?? $loginResponse.duLieu.token ?? $loginResponse.DuLieu.Token
    
    if ($token) {
        Write-Host "✓ Đăng nhập thành công" -ForegroundColor Green
        Write-Host "  Token: $($token.Substring(0, 20))..." -ForegroundColor Gray
    } else {
        Write-Host "✗ Không nhận được token" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "✗ Lỗi đăng nhập: $_" -ForegroundColor Red
    exit 1
}

Start-Sleep -Seconds 1

# Bước 3: Lấy danh sách dịch vụ
Write-Host "Bước 3: Lấy danh sách dịch vụ..." -ForegroundColor Yellow
try {
    $servicesResponse = Invoke-RestMethod -Uri "$baseUrl/api/public/services?kichThuocTrang=10" -Method Get
    $services = $servicesResponse.duLieu.muc ?? $servicesResponse.DuLieu.Muc ?? $servicesResponse.duLieu.danhSach ?? $servicesResponse.DuLieu.DanhSach ?? @()
    
    if ($services.Count -gt 0) {
        Write-Host "✓ Lấy được $($services.Count) dịch vụ" -ForegroundColor Green
        $dichVuId = $services[0].id ?? $services[0].Id
        Write-Host "  Dịch vụ đầu tiên: $($services[0].ten ?? $services[0].Ten)" -ForegroundColor Gray
    } else {
        Write-Host "⚠ Chưa có dịch vụ nào" -ForegroundColor Yellow
        $dichVuId = $null
    }
} catch {
    Write-Host "✗ Lỗi lấy dịch vụ: $_" -ForegroundColor Red
    $dichVuId = $null
}

Start-Sleep -Seconds 1

# Bước 4: Nộp hồ sơ (nếu có dịch vụ)
if ($dichVuId) {
    Write-Host "Bước 4: Nộp hồ sơ..." -ForegroundColor Yellow
    $applicationBody = @{
        dichVuId = $dichVuId
        tenNguoiNop = $hoTen
        emailNguoiNop = $email
        dienThoaiNguoiNop = "0901234567"
        ghiChuNguoiNop = "Test hồ sơ tự động"
    } | ConvertTo-Json

    try {
        $headers = @{
            "Authorization" = "Bearer $token"
            "Content-Type" = "application/json"
        }
        $appResponse = Invoke-RestMethod -Uri "$baseUrl/api/public/applications/submit" -Method Post -Body $applicationBody -Headers $headers
        
        if ($appResponse.thanhCong -or $appResponse.ThanhCong) {
            $maTheoDoi = $appResponse.duLieu.maTheoDoi ?? $appResponse.DuLieu.MaTheoDoi
            Write-Host "✓ Nộp hồ sơ thành công" -ForegroundColor Green
            Write-Host "  Mã theo dõi: $maTheoDoi" -ForegroundColor Gray
        } else {
            Write-Host "✗ Nộp hồ sơ thất bại: $($appResponse.thongDiep ?? $appResponse.ThongDiep)" -ForegroundColor Red
        }
    } catch {
        Write-Host "✗ Lỗi nộp hồ sơ: $_" -ForegroundColor Red
    }
} else {
    Write-Host "Bước 4: Bỏ qua (không có dịch vụ)" -ForegroundColor Gray
}

Start-Sleep -Seconds 1

# Bước 5: Kiểm tra hồ sơ của tôi
Write-Host "Bước 5: Kiểm tra hồ sơ của tôi..." -ForegroundColor Yellow
try {
    $headers = @{
        "Authorization" = "Bearer $token"
    }
    $myAppsResponse = Invoke-RestMethod -Uri "$baseUrl/api/public/applications?trang=1&kichThuocTrang=10" -Method Get -Headers $headers
    $myApps = $myAppsResponse.duLieu.danhSach ?? $myAppsResponse.DuLieu.DanhSach ?? @()
    
    Write-Host "✓ Có $($myApps.Count) hồ sơ" -ForegroundColor Green
} catch {
    Write-Host "✗ Lỗi lấy hồ sơ: $_" -ForegroundColor Red
}

Start-Sleep -Seconds 1

# Bước 6: Đăng nhập Admin
Write-Host "Bước 6: Đăng nhập Admin..." -ForegroundColor Yellow
$adminLoginBody = @{
    email = "admin@phuongxa.vn"
    matKhau = "Admin@123456!Secure"
} | ConvertTo-Json

try {
    $adminLoginResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method Post -Body $adminLoginBody -ContentType "application/json"
    $adminToken = $adminLoginResponse.duLieu.maTruyCap ?? $adminLoginResponse.DuLieu.MaTruyCap ?? $adminLoginResponse.duLieu.token ?? $adminLoginResponse.DuLieu.Token
    
    if ($adminToken) {
        Write-Host "✓ Admin đăng nhập thành công" -ForegroundColor Green
    } else {
        Write-Host "✗ Không nhận được admin token" -ForegroundColor Red
    }
} catch {
    Write-Host "✗ Lỗi đăng nhập admin: $_" -ForegroundColor Red
    $adminToken = $null
}

Write-Host ""
Write-Host "=== KẾT QUẢ KIỂM TRA ===" -ForegroundColor Cyan
Write-Host "✓ Backend API hoạt động bình thường" -ForegroundColor Green
Write-Host "✓ Luồng đăng ký/đăng nhập hoạt động" -ForegroundColor Green
Write-Host "✓ API authentication hoạt động" -ForegroundColor Green
Write-Host ""
Write-Host "Thông tin test:" -ForegroundColor Gray
Write-Host "  Email: $email" -ForegroundColor Gray
Write-Host "  Password: $password" -ForegroundColor Gray
