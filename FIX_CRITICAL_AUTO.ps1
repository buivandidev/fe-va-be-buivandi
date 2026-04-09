# Script tự động fix các vấn đề CRITICAL và HIGH
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " FIX CÁC VẤN ĐỀ CRITICAL & HIGH" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$ErrorActionPreference = "Continue"
$fixCount = 0
$issues = @()

# 1. Kiểm tra test mode đã tắt chưa
Write-Host "`n[1/9] Kiểm tra Test Mode..." -ForegroundColor Yellow
$publicAppController = "backend/phuongxa-api/src/PhuongXa.API/Controllers/Public/PublicApplicationsController.cs"
if (Test-Path $publicAppController) {
    $content = Get-Content $publicAppController -Raw
    if ($content -match 'var isTestMode = true') {
        Write-Host "  ✗ Test mode vẫn còn BẬT!" -ForegroundColor Red
        $issues += "Test mode chưa tắt - SECURITY RISK!"
    } else {
        Write-Host "  ✓ Test mode đã tắt" -ForegroundColor Green
        $fixCount++
    }
} else {
    Write-Host "  ⚠ Không tìm thấy file" -ForegroundColor Yellow
}

# 2. Kiểm tra JWT Key
Write-Host "`n[2/9] Kiểm tra JWT Key..." -ForegroundColor Yellow
$prodSettings = "backend/phuongxa-api/src/PhuongXa.API/appsettings.Production.json"
if (Test-Path $prodSettings) {
    $settings = Get-Content $prodSettings -Raw | ConvertFrom-Json
    $jwtKey = $settings.Jwt.Key
    
    # Check if key is the default one (compromised)
    if ($jwtKey -eq "CCFZhl54yGAhYN4DHTDEb14Zzs6Swc6QJHrGAAEw/SZYyYyk/skj+qMKaM5MLyhJ") {
        Write-Host "  ✗ JWT Key vẫn là key mặc định (đã bị public)!" -ForegroundColor Red
        $issues += "JWT Key cần đổi mới - SECURITY RISK!"
        
        Write-Host "  → Tạo JWT key mới..." -ForegroundColor Cyan
        $newKey = [Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(64))
        Write-Host "  → Key mới: $newKey" -ForegroundColor Green
        Write-Host "  → Lưu key này vào Azure App Service Environment Variables!" -ForegroundColor Yellow
        Write-Host "  → Tên biến: Jwt__Key" -ForegroundColor Yellow
    } else {
        Write-Host "  ✓ JWT Key đã được thay đổi" -ForegroundColor Green
        $fixCount++
    }
} else {
    Write-Host "  ⚠ Không tìm thấy appsettings.Production.json" -ForegroundColor Yellow
}

# 3. Kiểm tra Rate Limiting
Write-Host "`n[3/9] Kiểm tra Rate Limiting..." -ForegroundColor Yellow
$chuongTrinh = "backend/phuongxa-api/src/PhuongXa.API/ChuongTrinh.cs"
if (Test-Path $chuongTrinh) {
    $content = Get-Content $chuongTrinh -Raw
    if ($content -match '// builder\.Services\.AddRateLimiter') {
        Write-Host "  ✗ Rate Limiting bị comment out!" -ForegroundColor Red
        $issues += "Rate Limiting chưa bật - dễ bị brute force/DDoS"
    } else {
        Write-Host "  ✓ Rate Limiting đã bật" -ForegroundColor Green
        $fixCount++
    }
} else {
    Write-Host "  ⚠ Không tìm thấy ChuongTrinh.cs" -ForegroundColor Yellow
}

# 4. Kiểm tra CORS Production
Write-Host "`n[4/9] Kiểm tra CORS Production..." -ForegroundColor Yellow
if (Test-Path $prodSettings) {
    $settings = Get-Content $prodSettings -Raw | ConvertFrom-Json
    $origins = $settings.Cors.AllowedOrigins
    
    if ($origins -match "fqfqfq" -or $origins -match "your-frontend") {
        Write-Host "  ✗ CORS có placeholder URLs!" -ForegroundColor Red
        $issues += "CORS AllowedOrigins cần cập nhật URL Azure thật"
    } else {
        Write-Host "  ✓ CORS đã cấu hình đúng" -ForegroundColor Green
        $fixCount++
    }
}

# 5. Kiểm tra File Upload Validation
Write-Host "`n[5/9] Kiểm tra File Upload Validation..." -ForegroundColor Yellow
$mediaController = "backend/phuongxa-api/src/PhuongXa.API/Controllers/Admin/AdminMediaController.cs"
if (Test-Path $mediaController) {
    $content = Get-Content $mediaController -Raw
    if ($content -match 'RequestSizeLimit\(50_000_000\)') {
        Write-Host "  ✓ File size limit: 50MB" -ForegroundColor Green
        $fixCount++
    } else {
        Write-Host "  ⚠ Không tìm thấy file size limit" -ForegroundColor Yellow
        $issues += "File upload cần thêm size validation"
    }
    
    if ($content -match 'CoChuKyHopLe') {
        Write-Host "  ✓ File signature validation OK" -ForegroundColor Green
    } else {
        Write-Host "  ⚠ Thiếu file signature validation" -ForegroundColor Yellow
    }
}

# 6. Kiểm tra Application Submission Auth
Write-Host "`n[6/9] Kiểm tra Application Submission Auth..." -ForegroundColor Yellow
if (Test-Path $publicAppController) {
    $content = Get-Content $publicAppController -Raw
    if ($content -match '\[AllowAnonymous\].*submit') {
        Write-Host "  ⚠ Submit application cho phép anonymous" -ForegroundColor Yellow
        $issues += "Nên yêu cầu đăng nhập để nộp hồ sơ (hoặc thêm CAPTCHA)"
    } else {
        Write-Host "  ✓ Submit application yêu cầu auth" -ForegroundColor Green
        $fixCount++
    }
}

# 7. Kiểm tra HTTPS Redirect
Write-Host "`n[7/9] Kiểm tra HTTPS Redirect..." -ForegroundColor Yellow
if (Test-Path $chuongTrinh) {
    $content = Get-Content $chuongTrinh -Raw
    if ($content -match 'app\.UseHttpsRedirection\(\)' -and $content -notmatch '// app\.UseHttpsRedirection') {
        Write-Host "  ✓ HTTPS Redirect đã bật" -ForegroundColor Green
        $fixCount++
    } else {
        Write-Host "  ✗ HTTPS Redirect bị tắt!" -ForegroundColor Red
        $issues += "HTTPS Redirect cần bật"
    }
}

# 8. Kiểm tra HSTS Header
Write-Host "`n[8/9] Kiểm tra HSTS Header..." -ForegroundColor Yellow
if (Test-Path $chuongTrinh) {
    $content = Get-Content $chuongTrinh -Raw
    if ($content -match 'Strict-Transport-Security.*includeSubDomains.*preload') {
        Write-Host "  ✓ HSTS Header đầy đủ" -ForegroundColor Green
        $fixCount++
    } else {
        Write-Host "  ⚠ HSTS Header chưa đủ mạnh" -ForegroundColor Yellow
        $issues += "HSTS cần thêm includeSubDomains; preload"
    }
}

# 9. Kiểm tra CSP Header
Write-Host "`n[9/9] Kiểm tra CSP Header..." -ForegroundColor Yellow
if (Test-Path $chuongTrinh) {
    $content = Get-Content $chuongTrinh -Raw
    if ($content -match "style-src 'self' 'unsafe-inline'") {
        Write-Host "  ⚠ CSP có 'unsafe-inline' cho style" -ForegroundColor Yellow
        $issues += "CSP nên loại bỏ unsafe-inline (dùng nonce)"
    } else {
        Write-Host "  ✓ CSP không có unsafe-inline" -ForegroundColor Green
        $fixCount++
    }
}

# Tổng kết
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host " KẾT QUẢ KIỂM TRA" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

Write-Host "`nĐã fix: $fixCount/9" -ForegroundColor $(if ($fixCount -ge 7) { "Green" } elseif ($fixCount -ge 5) { "Yellow" } else { "Red" })

if ($issues.Count -gt 0) {
    Write-Host "`nVấn đề cần fix:" -ForegroundColor Red
    foreach ($issue in $issues) {
        Write-Host "  ✗ $issue" -ForegroundColor Red
    }
} else {
    Write-Host "`n🎉 Tất cả vấn đề CRITICAL & HIGH đã được fix!" -ForegroundColor Green
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "HÀNH ĐỘNG TIẾP THEO:" -ForegroundColor Yellow
Write-Host "1. Nếu JWT Key chưa đổi → Tạo key mới và lưu vào Azure Environment Variables" -ForegroundColor White
Write-Host "2. Nếu CORS có placeholder → Cập nhật URL Azure thật" -ForegroundColor White
Write-Host "3. Rebuild: .\build-for-azure.ps1" -ForegroundColor White
Write-Host "4. Deploy lên Azure" -ForegroundColor White
Write-Host "5. Test toàn bộ hệ thống" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Cyan
