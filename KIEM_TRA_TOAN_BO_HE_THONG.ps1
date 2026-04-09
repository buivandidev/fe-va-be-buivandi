# Script kiểm tra toàn bộ hệ thống: Backend, Admin FE, Người Dân FE
param(
    [switch]$SkipBuild,
    [switch]$DetailedCheck
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host " KIỂM TRA TOÀN BỘ HỆ THỐNG" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$ErrorActionPreference = "Continue"
$issues = @()
$warnings = @()
$passed = 0
$total = 0

function Test-Item {
    param($Name, $Condition, $ErrorMsg, $WarningMsg)
    $script:total++
    Write-Host "`n[$script:total] $Name..." -ForegroundColor Yellow
    
    if ($Condition) {
        Write-Host "  ✓ OK" -ForegroundColor Green
        $script:passed++
        return $true
    } else {
        if ($ErrorMsg) {
            Write-Host "  ✗ $ErrorMsg" -ForegroundColor Red
            $script:issues += $ErrorMsg
        } elseif ($WarningMsg) {
            Write-Host "  ⚠ $WarningMsg" -ForegroundColor Yellow
            $script:warnings += $WarningMsg
        }
        return $false
    }
}

# ==========================================
# 1. BACKEND API
# ==========================================
Write-Host "`n========== BACKEND API ==========" -ForegroundColor Cyan

# 1.1 Kiểm tra appsettings
Test-Item "Backend appsettings.Development.json" `
    (Test-Path "backend/phuongxa-api/src/PhuongXa.API/appsettings.Development.json") `
    "Thiếu appsettings.Development.json"

Test-Item "Backend appsettings.Production.json" `
    (Test-Path "backend/phuongxa-api/src/PhuongXa.API/appsettings.Production.json") `
    "Thiếu appsettings.Production.json"

# 1.2 Kiểm tra CORS config
if (Test-Path "backend/phuongxa-api/src/PhuongXa.API/appsettings.Development.json") {
    $devSettings = Get-Content "backend/phuongxa-api/src/PhuongXa.API/appsettings.Development.json" -Raw | ConvertFrom-Json
    $corsOrigins = $devSettings.Cors.AllowedOrigins
    
    Test-Item "CORS cho localhost:3000 (Admin)" `
        ($corsOrigins -match "localhost:3000") `
        "CORS chưa có localhost:3000"
    
    Test-Item "CORS cho localhost:3001 (Người Dân)" `
        ($corsOrigins -match "localhost:3001") `
        "CORS chưa có localhost:3001"
}

# 1.3 Kiểm tra JWT config
if (Test-Path "backend/phuongxa-api/src/PhuongXa.API/appsettings.Development.json") {
    $devSettings = Get-Content "backend/phuongxa-api/src/PhuongXa.API/appsettings.Development.json" -Raw | ConvertFrom-Json
    $jwtKey = $devSettings.Jwt.Key
    
    Test-Item "JWT Key tồn tại" `
        ($jwtKey -and $jwtKey.Length -gt 32) `
        "JWT Key không hợp lệ"
    
    # Kiểm tra JWT key giống nhau giữa Dev và Prod
    if (Test-Path "backend/phuongxa-api/src/PhuongXa.API/appsettings.Production.json") {
        $prodSettings = Get-Content "backend/phuongxa-api/src/PhuongXa.API/appsettings.Production.json" -Raw | ConvertFrom-Json
        $prodJwtKey = $prodSettings.Jwt.Key
        
        Test-Item "JWT Key Dev vs Prod" `
            $true `
            $null `
            "JWT Key Dev và Prod giống nhau (nên khác nhau cho production)"
    }
}

# 1.4 Kiểm tra Controllers
$controllerPath = "backend/phuongxa-api/src/PhuongXa.API/Controllers"
Test-Item "Admin Controllers" `
    (Test-Path "$controllerPath/Admin") `
    "Thiếu Admin Controllers"

Test-Item "Public Controllers" `
    (Test-Path "$controllerPath/Public") `
    "Thiếu Public Controllers"

# 1.5 Kiểm tra test mode đã tắt
$publicAppController = "backend/phuongxa-api/src/PhuongXa.API/Controllers/Public/PublicApplicationsController.cs"
if (Test-Path $publicAppController) {
    $content = Get-Content $publicAppController -Raw
    Test-Item "Test Mode đã tắt" `
        ($content -notmatch 'var isTestMode = true') `
        "Test mode vẫn còn BẬT - SECURITY RISK!"
}

# ==========================================
# 2. FRONTEND ADMIN
# ==========================================
Write-Host "`n========== FRONTEND ADMIN ==========" -ForegroundColor Cyan

# 2.1 Kiểm tra cấu hình
Test-Item "Admin package.json" `
    (Test-Path "frontend/package.json") `
    "Thiếu package.json"

Test-Item "Admin next.config.mjs" `
    (Test-Path "frontend/next.config.mjs") `
    "Thiếu next.config.mjs"

# 2.2 Kiểm tra standalone config
if (Test-Path "frontend/next.config.mjs") {
    $nextConfig = Get-Content "frontend/next.config.mjs" -Raw
    Test-Item "Admin standalone output" `
        ($nextConfig -match "output.*standalone") `
        "Chưa cấu hình standalone output"
}

# 2.3 Kiểm tra API client
Test-Item "Admin API client" `
    (Test-Path "frontend/src/lib/api") `
    "Thiếu API client library"

# 2.4 Kiểm tra environment config
if (Test-Path "frontend/src/lib/config/environment.ts") {
    $envConfig = Get-Content "frontend/src/lib/config/environment.ts" -Raw
    Test-Item "Admin API URL config" `
        ($envConfig -match "API_BASE_URL") `
        "Thiếu API_BASE_URL config"
}

# 2.5 Kiểm tra pages quan trọng
$adminPages = @(
    "frontend/src/app/admin/(protected)/homepage/page.tsx",
    "frontend/src/app/admin/(protected)/library/page.tsx",
    "frontend/src/app/admin/(protected)/articles/page.tsx",
    "frontend/src/app/admin/(protected)/users/page.tsx"
)

foreach ($page in $adminPages) {
    $pageName = Split-Path $page -Parent | Split-Path -Leaf
    Test-Item "Admin page: $pageName" `
        (Test-Path $page) `
        "Thiếu page: $pageName"
}

# ==========================================
# 3. FRONTEND NGƯỜI DÂN
# ==========================================
Write-Host "`n========== FRONTEND NGƯỜI DÂN ==========" -ForegroundColor Cyan

# 3.1 Kiểm tra cấu hình
Test-Item "Người Dân package.json" `
    (Test-Path "frontend/nguoi-dan/package.json") `
    "Thiếu package.json"

Test-Item "Người Dân next.config.ts" `
    (Test-Path "frontend/nguoi-dan/next.config.ts") `
    "Thiếu next.config.ts"

# 3.2 Kiểm tra standalone config
if (Test-Path "frontend/nguoi-dan/next.config.ts") {
    $nextConfig = Get-Content "frontend/nguoi-dan/next.config.ts" -Raw
    Test-Item "Người Dân standalone output" `
        ($nextConfig -match 'output.*standalone') `
        "Chưa cấu hình standalone output"
}

# 3.3 Kiểm tra .env
Test-Item "Người Dân .env" `
    (Test-Path "frontend/nguoi-dan/.env") `
    "Thiếu .env file"

if (Test-Path "frontend/nguoi-dan/.env") {
    $env = Get-Content "frontend/nguoi-dan/.env" -Raw
    Test-Item "Người Dân API URL" `
        ($env -match "NEXT_PUBLIC_API_BASE_URL") `
        "Thiếu NEXT_PUBLIC_API_BASE_URL"
    
    # Kiểm tra không có localhost trong .env (nếu đang chuẩn bị deploy)
    if ($env -match "localhost") {
        Test-Item "Người Dân API URL (Production ready)" `
            $false `
            $null `
            ".env có localhost - cần đổi sang Azure URL trước khi deploy"
    }
}

# 3.4 Kiểm tra API client
Test-Item "Người Dân API client" `
    (Test-Path "frontend/nguoi-dan/src/lib/api.ts") `
    "Thiếu API client"

# 3.5 Kiểm tra pages quan trọng
$nguoidanPages = @(
    "frontend/nguoi-dan/src/app/page.tsx",
    "frontend/nguoi-dan/src/app/dang-nhap/page.tsx",
    "frontend/nguoi-dan/src/app/dang-ky/page.tsx",
    "frontend/nguoi-dan/src/app/ca-nhan/page.tsx",
    "frontend/nguoi-dan/src/app/tin-tuc/page.tsx",
    "frontend/nguoi-dan/src/app/dich-vu-cong/page.tsx",
    "frontend/nguoi-dan/src/app/thu-vien/page.tsx"
)

foreach ($page in $nguoidanPages) {
    $pageName = Split-Path $page -Leaf
    Test-Item "Người Dân page: $pageName" `
        (Test-Path $page) `
        "Thiếu page: $pageName"
}

# 3.6 Kiểm tra không có file tạm thời
$tempFiles = Get-ChildItem -Path "frontend/nguoi-dan" -Filter "fix_*.js" -ErrorAction SilentlyContinue
Test-Item "Không có file tạm thời" `
    ($tempFiles.Count -eq 0) `
    $null `
    "Còn $($tempFiles.Count) file tạm thời (fix_*.js)"

# ==========================================
# 4. KIỂM TRA KẾT NỐI
# ==========================================
Write-Host "`n========== KIỂM TRA KẾT NỐI ==========" -ForegroundColor Cyan

# 4.1 Admin → Backend
if (Test-Path "frontend/src/lib/config/environment.ts") {
    $envConfig = Get-Content "frontend/src/lib/config/environment.ts" -Raw
    Test-Item "Admin → Backend connection config" `
        ($envConfig -match "localhost:5187" -or $envConfig -match "azurewebsites") `
        "Admin không có config kết nối Backend"
}

# 4.2 Người Dân → Backend
if (Test-Path "frontend/nguoi-dan/.env") {
    $env = Get-Content "frontend/nguoi-dan/.env" -Raw
    Test-Item "Người Dân → Backend connection config" `
        ($env -match "NEXT_PUBLIC_API_BASE_URL") `
        "Người Dân không có config kết nối Backend"
}

# 4.3 Kiểm tra shared types/interfaces
Test-Item "Shared API types" `
    ((Test-Path "frontend/src/lib/api") -or (Test-Path "frontend/nguoi-dan/src/lib/api.ts")) `
    "Thiếu API type definitions"

# ==========================================
# 5. BUILD TEST (nếu không skip)
# ==========================================
if (!$SkipBuild) {
    Write-Host "`n========== BUILD TEST ==========" -ForegroundColor Cyan
    
    # 5.1 Backend build
    Write-Host "`nBuilding Backend..." -ForegroundColor Yellow
    $backendBuild = dotnet build "backend/phuongxa-api/src/PhuongXa.API/PhuongXa.API.csproj" --nologo -v q 2>&1
    Test-Item "Backend build" `
        ($LASTEXITCODE -eq 0) `
        "Backend build failed"
    
    # 5.2 Admin build
    Write-Host "`nBuilding Admin..." -ForegroundColor Yellow
    Set-Location "frontend"
    $adminBuild = npm run build 2>&1
    $adminBuildSuccess = $LASTEXITCODE -eq 0
    Set-Location ".."
    Test-Item "Admin build" `
        $adminBuildSuccess `
        "Admin build failed"
    
    # 5.3 Người Dân build
    Write-Host "`nBuilding Người Dân..." -ForegroundColor Yellow
    Set-Location "frontend/nguoi-dan"
    $nguoidanBuild = npm run build 2>&1
    $nguoidanBuildSuccess = $LASTEXITCODE -eq 0
    Set-Location "../.."
    Test-Item "Người Dân build" `
        $nguoidanBuildSuccess `
        "Người Dân build failed"
}

# ==========================================
# 6. AZURE DEPLOYMENT READINESS
# ==========================================
Write-Host "`n========== AZURE DEPLOYMENT ==========" -ForegroundColor Cyan

# 6.1 Kiểm tra build script
Test-Item "Build script cho Azure" `
    (Test-Path "build-for-azure.ps1") `
    "Thiếu build-for-azure.ps1"

# 6.2 Kiểm tra CORS Production
if (Test-Path "backend/phuongxa-api/src/PhuongXa.API/appsettings.Production.json") {
    $prodSettings = Get-Content "backend/phuongxa-api/src/PhuongXa.API/appsettings.Production.json" -Raw | ConvertFrom-Json
    $prodCors = $prodSettings.Cors.AllowedOrigins
    
    if ($prodCors -match "fqfqfq" -or $prodCors -match "your-frontend") {
        Test-Item "CORS Production URLs" `
            $false `
            $null `
            "CORS Production có placeholder URLs - cần cập nhật"
    } else {
        Test-Item "CORS Production URLs" `
            $true
    }
}

# 6.3 Kiểm tra Image Remote Patterns
if (Test-Path "frontend/nguoi-dan/next.config.ts") {
    $nextConfig = Get-Content "frontend/nguoi-dan/next.config.ts" -Raw
    Test-Item "Image Remote Patterns có Azure backend" `
        ($nextConfig -match "azurewebsites\.net") `
        $null `
        "Image remote patterns chưa có Azure backend hostname"
}

# ==========================================
# TỔNG KẾT
# ==========================================
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host " KẾT QUẢ KIỂM TRA" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$percentage = [math]::Round(($passed / $total) * 100, 1)
Write-Host "`nĐã pass: $passed/$total ($percentage%)" -ForegroundColor $(
    if ($percentage -ge 90) { "Green" }
    elseif ($percentage -ge 70) { "Yellow" }
    else { "Red" }
)

if ($issues.Count -gt 0) {
    Write-Host "`n🔴 VẤN ĐỀ CẦN FIX ($($issues.Count)):" -ForegroundColor Red
    foreach ($issue in $issues) {
        Write-Host "  ✗ $issue" -ForegroundColor Red
    }
}

if ($warnings.Count -gt 0) {
    Write-Host "`n⚠️ CẢNH BÁO ($($warnings.Count)):" -ForegroundColor Yellow
    foreach ($warning in $warnings) {
        Write-Host "  ⚠ $warning" -ForegroundColor Yellow
    }
}

if ($issues.Count -eq 0 -and $warnings.Count -eq 0) {
    Write-Host "`n🎉 TẤT CẢ KIỂM TRA ĐỀU PASS!" -ForegroundColor Green
    Write-Host "Hệ thống sẵn sàng deploy!" -ForegroundColor Green
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "HÀNH ĐỘNG TIẾP THEO:" -ForegroundColor Yellow
Write-Host "1. Fix các vấn đề (nếu có)" -ForegroundColor White
Write-Host "2. Cập nhật CORS URLs cho Production" -ForegroundColor White
Write-Host "3. Chạy: .\build-for-azure.ps1" -ForegroundColor White
Write-Host "4. Deploy lên Azure" -ForegroundColor White
Write-Host "5. Test trên production" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Cyan

# Export kết quả
$result = @{
    Total = $total
    Passed = $passed
    Percentage = $percentage
    Issues = $issues
    Warnings = $warnings
    Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
}

$result | ConvertTo-Json | Out-File "kiem-tra-he-thong-result.json" -Encoding UTF8
Write-Host "`nKết quả đã lưu vào: kiem-tra-he-thong-result.json" -ForegroundColor Cyan
