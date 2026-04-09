# Test toàn bộ luồng tích hợp FE-BE
$ErrorActionPreference = "Continue"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "KIỂM TRA TÍCH HỢP TOÀN BỘ HỆ THỐNG" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Config
$backendUrl = "http://localhost:5000"
$adminFrontendUrl = "http://localhost:3000"
$userFrontendUrl = "http://localhost:3001"

$testEmail = "test_user_$(Get-Random)@test.com"
$testPassword = "Test@123456"
$adminEmail = "admin@phuongxa.vn"
$adminPassword = "Admin@123456!Secure"

# ============================================
# PHẦN 1: KIỂM TRA BACKEND API
# ============================================
Write-Host "PHẦN 1: KIỂM TRA BACKEND API" -ForegroundColor Yellow
Write-Host "-------------------------------------------" -ForegroundColor Gray

# 1.1: Health check
Write-Host "1.1. Health check backend..." -NoNewline
try {
    $response = Invoke-WebRequest -Uri "$backendUrl/api/categories" -Method Get -TimeoutSec 5
    if ($response.StatusCode -eq 200) {
        Write-Host " ✓" -ForegroundColor Green
    } else {
        Write-Host " ✗ Status: $($response.StatusCode)" -ForegroundColor Red
    }
} catch {
    Write-Host " ✗ Backend không phản hồi" -ForegroundColor Red
    Write-Host "   Lỗi: $_" -ForegroundColor Red
}

# 1.2: Đăng ký người dùng
Write-Host "1.2. Đăng ký người dùng mới..." -NoNewline
try {
    $registerBody = @{
        hoTen = "Test User"
        email = $testEmail
        matKhau = $testPassword
        xacNhanMatKhau = $testPassword
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "$backendUrl/api/auth/register" -Method Post -Body $registerBody -ContentType "application/json"
    if ($response.thanhCong -or $response.ThanhCong) {
        Write-Host " ✓" -ForegroundColor Green
    } else {
        Write-Host " ✗ $($response.thongDiep ?? $response.ThongDiep)" -ForegroundColor Red
    }
} catch {
    Write-Host " ✗ Lỗi: $_" -ForegroundColor Red
}

# 1.3: Đăng nhập người dùng
Write-Host "1.3. Đăng nhập người dùng..." -NoNewline
try {
    $loginBody = @{
        email = $testEmail
        matKhau = $testPassword
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "$backendUrl/api/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
    $userToken = $response.duLieu.maTruyCap ?? $response.DuLieu.MaTruyCap ?? $response.token
    
    if ($userToken) {
        Write-Host " ✓" -ForegroundColor Green
        Write-Host "   Token: $($userToken.Substring(0, 30))..." -ForegroundColor Gray
    } else {
        Write-Host " ✗ Không nhận được token" -ForegroundColor Red
    }
} catch {
    Write-Host " ✗ Lỗi: $_" -ForegroundColor Red
}

# 1.4: Lấy danh sách dịch vụ
Write-Host "1.4. Lấy danh sách dịch vụ..." -NoNewline
try {
    $response = Invoke-RestMethod -Uri "$backendUrl/api/public/services?kichThuocTrang=10" -Method Get
    $services = $response.duLieu.muc ?? $response.DuLieu.Muc ?? $response.duLieu.danhSach ?? $response.DuLieu.DanhSach ?? @()
    
    if ($services.Count -gt 0) {
        Write-Host " ✓ ($($services.Count) dịch vụ)" -ForegroundColor Green
        $serviceId = $services[0].id ?? $services[0].Id
    } else {
        Write-Host " ⚠ Không có dịch vụ" -ForegroundColor Yellow
        $serviceId = $null
    }
} catch {
    Write-Host " ✗ Lỗi: $_" -ForegroundColor Red
    $serviceId = $null
}

# 1.5: Nộp hồ sơ
if ($serviceId -and $userToken) {
    Write-Host "1.5. Nộp hồ sơ..." -NoNewline
    try {
        $appBody = @{
            dichVuId = $serviceId
            tenNguoiNop = "Test User"
            emailNguoiNop = $testEmail
            dienThoaiNguoiNop = "0901234567"
        } | ConvertTo-Json

        $headers = @{
            "Authorization" = "Bearer $userToken"
            "Content-Type" = "application/json"
        }
        
        $response = Invoke-RestMethod -Uri "$backendUrl/api/public/applications/submit" -Method Post -Body $appBody -Headers $headers
        $applicationId = $response.duLieu.id ?? $response.DuLieu.Id
        $trackingCode = $response.duLieu.maTheoDoi ?? $response.DuLieu.MaTheoDoi
        
        if ($applicationId) {
            Write-Host " ✓ Mã: $trackingCode" -ForegroundColor Green
        } else {
            Write-Host " ✗" -ForegroundColor Red
        }
    } catch {
        Write-Host " ✗ Lỗi: $_" -ForegroundColor Red
    }
} else {
    Write-Host "1.5. Nộp hồ sơ... ⊘ Bỏ qua (thiếu dữ liệu)" -ForegroundColor Gray
}

# 1.6: Đăng nhập admin
Write-Host "1.6. Đăng nhập admin..." -NoNewline
try {
    $adminLoginBody = @{
        email = $adminEmail
        matKhau = $adminPassword
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "$backendUrl/api/auth/login" -Method Post -Body $adminLoginBody -ContentType "application/json"
    $adminToken = $response.duLieu.maTruyCap ?? $response.DuLieu.MaTruyCap ?? $response.token
    
    if ($adminToken) {
        Write-Host " ✓" -ForegroundColor Green
    } else {
        Write-Host " ✗ Không nhận được token" -ForegroundColor Red
    }
} catch {
    Write-Host " ✗ Lỗi: $_" -ForegroundColor Red
}

Write-Host ""

# ============================================
# PHẦN 2: KIỂM TRA FRONTEND NGƯỜI DÂN
# ============================================
Write-Host "PHẦN 2: KIỂM TRA FRONTEND NGƯỜI DÂN" -ForegroundColor Yellow
Write-Host "-------------------------------------------" -ForegroundColor Gray

# 2.1: Trang chủ
Write-Host "2.1. Trang chủ..." -NoNewline
try {
    $response = Invoke-WebRequest -Uri "$userFrontendUrl/" -Method Get -TimeoutSec 5
    if ($response.StatusCode -eq 200) {
        Write-Host " ✓" -ForegroundColor Green
    } else {
        Write-Host " ✗ Status: $($response.StatusCode)" -ForegroundColor Red
    }
} catch {
    Write-Host " ✗ Không kết nối được" -ForegroundColor Red
}

# 2.2: Trang đăng ký
Write-Host "2.2. Trang đăng ký..." -NoNewline
try {
    $response = Invoke-WebRequest -Uri "$userFrontendUrl/dang-ky" -Method Get -TimeoutSec 5
    if ($response.StatusCode -eq 200) {
        Write-Host " ✓" -ForegroundColor Green
    } else {
        Write-Host " ✗ Status: $($response.StatusCode)" -ForegroundColor Red
    }
} catch {
    Write-Host " ✗ Không kết nối được" -ForegroundColor Red
}

# 2.3: Trang đăng nhập
Write-Host "2.3. Trang đăng nhập..." -NoNewline
try {
    $response = Invoke-WebRequest -Uri "$userFrontendUrl/dang-nhap" -Method Get -TimeoutSec 5
    if ($response.StatusCode -eq 200) {
        Write-Host " ✓" -ForegroundColor Green
    } else {
        Write-Host " ✗ Status: $($response.StatusCode)" -ForegroundColor Red
    }
} catch {
    Write-Host " ✗ Không kết nối được" -ForegroundColor Red
}

# 2.4: Trang dịch vụ công
Write-Host "2.4. Trang dịch vụ công..." -NoNewline
try {
    $response = Invoke-WebRequest -Uri "$userFrontendUrl/dich-vu-cong" -Method Get -TimeoutSec 5
    if ($response.StatusCode -eq 200) {
        Write-Host " ✓" -ForegroundColor Green
    } else {
        Write-Host " ✗ Status: $($response.StatusCode)" -ForegroundColor Red
    }
} catch {
    Write-Host " ✗ Không kết nối được" -ForegroundColor Red
}

# 2.5: Trang tin tức
Write-Host "2.5. Trang tin tức..." -NoNewline
try {
    $response = Invoke-WebRequest -Uri "$userFrontendUrl/tin-tuc" -Method Get -TimeoutSec 5
    if ($response.StatusCode -eq 200) {
        Write-Host " ✓" -ForegroundColor Green
    } else {
        Write-Host " ✗ Status: $($response.StatusCode)" -ForegroundColor Red
    }
} catch {
    Write-Host " ✗ Không kết nối được" -ForegroundColor Red
}

Write-Host ""

# ============================================
# PHẦN 3: KIỂM TRA FRONTEND ADMIN
# ============================================
Write-Host "PHẦN 3: KIỂM TRA FRONTEND ADMIN" -ForegroundColor Yellow
Write-Host "-------------------------------------------" -ForegroundColor Gray

# 3.1: Trang chủ (redirect to login)
Write-Host "3.1. Trang chủ..." -NoNewline
try {
    $response = Invoke-WebRequest -Uri "$adminFrontendUrl/" -Method Get -TimeoutSec 5 -MaximumRedirection 0 -ErrorAction SilentlyContinue
    if ($response.StatusCode -eq 200 -or $response.StatusCode -eq 307) {
        Write-Host " ✓" -ForegroundColor Green
    } else {
        Write-Host " ✗ Status: $($response.StatusCode)" -ForegroundColor Red
    }
} catch {
    if ($_.Exception.Response.StatusCode -eq 307) {
        Write-Host " ✓ (redirect)" -ForegroundColor Green
    } else {
        Write-Host " ✗ Không kết nối được" -ForegroundColor Red
    }
}

# 3.2: Trang login
Write-Host "3.2. Trang login..." -NoNewline
try {
    $response = Invoke-WebRequest -Uri "$adminFrontendUrl/admin/login" -Method Get -TimeoutSec 5
    if ($response.StatusCode -eq 200) {
        Write-Host " ✓" -ForegroundColor Green
    } else {
        Write-Host " ✗ Status: $($response.StatusCode)" -ForegroundColor Red
    }
} catch {
    Write-Host " ✗ Không kết nối được" -ForegroundColor Red
}

# 3.3: API login endpoint
Write-Host "3.3. API login endpoint..." -NoNewline
try {
    $loginBody = @{
        email = $adminEmail
        matKhau = $adminPassword
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "$adminFrontendUrl/api/admin/login" -Method Post -Body $loginBody -ContentType "application/json"
    
    if ($response.success) {
        Write-Host " ✓" -ForegroundColor Green
    } else {
        Write-Host " ✗ $($response.message)" -ForegroundColor Red
    }
} catch {
    Write-Host " ✗ Lỗi: $_" -ForegroundColor Red
}

Write-Host ""

# ============================================
# PHẦN 4: KIỂM TRA KẾT NỐI FE-BE
# ============================================
Write-Host "PHẦN 4: KIỂM TRA KẾT NỐI FE-BE" -ForegroundColor Yellow
Write-Host "-------------------------------------------" -ForegroundColor Gray

# 4.1: Kiểm tra CORS
Write-Host "4.1. CORS configuration..." -NoNewline
try {
    $headers = @{
        "Origin" = $userFrontendUrl
    }
    $response = Invoke-WebRequest -Uri "$backendUrl/api/categories" -Method Get -Headers $headers -TimeoutSec 5
    $corsHeader = $response.Headers["Access-Control-Allow-Origin"]
    
    if ($corsHeader) {
        Write-Host " ✓ ($corsHeader)" -ForegroundColor Green
    } else {
        Write-Host " ⚠ Không có CORS header" -ForegroundColor Yellow
    }
} catch {
    Write-Host " ✗ Lỗi: $_" -ForegroundColor Red
}

# 4.2: Kiểm tra API base URL trong frontend
Write-Host "4.2. Frontend API config..." -NoNewline
$userEnvFile = "frontend/nguoi-dan/.env"
$adminEnvFile = "frontend/.env"

$userApiUrl = (Get-Content $userEnvFile | Select-String "NEXT_PUBLIC_API_BASE_URL").ToString().Split("=")[1].Trim()
$adminApiUrl = (Get-Content $adminEnvFile | Select-String "NEXT_PUBLIC_API_BASE_URL").ToString().Split("=")[1].Trim()

if ($userApiUrl -eq $backendUrl -and $adminApiUrl -eq $backendUrl) {
    Write-Host " ✓" -ForegroundColor Green
    Write-Host "   User FE: $userApiUrl" -ForegroundColor Gray
    Write-Host "   Admin FE: $adminApiUrl" -ForegroundColor Gray
} else {
    Write-Host " ✗ Cấu hình không khớp" -ForegroundColor Red
    Write-Host "   User FE: $userApiUrl (expected: $backendUrl)" -ForegroundColor Red
    Write-Host "   Admin FE: $adminApiUrl (expected: $backendUrl)" -ForegroundColor Red
}

Write-Host ""

# ============================================
# KẾT QUẢ TỔNG HỢP
# ============================================
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "KẾT QUẢ TỔNG HỢP" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Backend API:        http://localhost:5000" -ForegroundColor White
Write-Host "Frontend Admin:     http://localhost:3000" -ForegroundColor White
Write-Host "Frontend Người Dân: http://localhost:3001" -ForegroundColor White
Write-Host ""
Write-Host "Thông tin test:" -ForegroundColor Gray
Write-Host "  Email: $testEmail" -ForegroundColor Gray
Write-Host "  Password: $testPassword" -ForegroundColor Gray
Write-Host ""
