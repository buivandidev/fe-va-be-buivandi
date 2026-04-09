# Script cập nhật CORS Production URLs
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " CẬP NHẬT CORS PRODUCTION URLs" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$appsettingsPath = "backend/phuongxa-api/src/PhuongXa.API/appsettings.Production.json"

# Đọc file hiện tại
if (!(Test-Path $appsettingsPath)) {
    Write-Host "Lỗi: Không tìm thấy $appsettingsPath" -ForegroundColor Red
    exit 1
}

$settings = Get-Content $appsettingsPath -Raw | ConvertFrom-Json

Write-Host "`nCORS URLs hiện tại:" -ForegroundColor Yellow
$currentOrigins = $settings.Cors.AllowedOrigins
foreach ($origin in $currentOrigins) {
    Write-Host "  - $origin" -ForegroundColor Gray
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "HƯỚNG DẪN LẤY URL AZURE" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

Write-Host @"

Để lấy URL Azure App Service:

1. Mở Azure Portal: https://portal.azure.com
2. Vào "App Services"
3. Chọn từng App Service (Backend, Admin, Người Dân)
4. Copy "URL" từ Overview page

Ví dụ URL:
  - Backend:    https://phuongxa-api.azurewebsites.net
  - Admin:      https://phuongxa-admin.azurewebsites.net
  - Người Dân:  https://phuongxa-nguoidan.azurewebsites.net

"@ -ForegroundColor White

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "NHẬP URL AZURE" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Nhập URL Admin
Write-Host "`n[1/2] Nhập URL Frontend Admin:" -ForegroundColor Yellow
Write-Host "Ví dụ: https://phuongxa-admin.azurewebsites.net" -ForegroundColor Gray
$adminUrl = Read-Host "Admin URL"

if ([string]::IsNullOrWhiteSpace($adminUrl)) {
    Write-Host "Lỗi: URL không được để trống!" -ForegroundColor Red
    exit 1
}

# Validate URL
if ($adminUrl -notmatch '^https://.*\.azurewebsites\.net$') {
    Write-Host "Cảnh báo: URL không đúng định dạng Azure (https://xxx.azurewebsites.net)" -ForegroundColor Yellow
    $confirm = Read-Host "Bạn có chắc muốn tiếp tục? (y/n)"
    if ($confirm -ne 'y') {
        Write-Host "Đã hủy" -ForegroundColor Yellow
        exit 0
    }
}

# Nhập URL Người Dân
Write-Host "`n[2/2] Nhập URL Frontend Người Dân:" -ForegroundColor Yellow
Write-Host "Ví dụ: https://phuongxa-nguoidan.azurewebsites.net" -ForegroundColor Gray
$nguoidanUrl = Read-Host "Người Dân URL"

if ([string]::IsNullOrWhiteSpace($nguoidanUrl)) {
    Write-Host "Lỗi: URL không được để trống!" -ForegroundColor Red
    exit 1
}

# Validate URL
if ($nguoidanUrl -notmatch '^https://.*\.azurewebsites\.net$') {
    Write-Host "Cảnh báo: URL không đúng định dạng Azure (https://xxx.azurewebsites.net)" -ForegroundColor Yellow
    $confirm = Read-Host "Bạn có chắc muốn tiếp tục? (y/n)"
    if ($confirm -ne 'y') {
        Write-Host "Đã hủy" -ForegroundColor Yellow
        exit 0
    }
}

# Remove trailing slash
$adminUrl = $adminUrl.TrimEnd('/')
$nguoidanUrl = $nguoidanUrl.TrimEnd('/')

# Xác nhận
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "XÁC NHẬN THÔNG TIN" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

Write-Host "`nCORS URLs mới:" -ForegroundColor Yellow
Write-Host "  - Admin:      $adminUrl" -ForegroundColor Green
Write-Host "  - Người Dân:  $nguoidanUrl" -ForegroundColor Green

$confirm = Read-Host "`nBạn có chắc muốn cập nhật? (y/n)"
if ($confirm -ne 'y') {
    Write-Host "Đã hủy" -ForegroundColor Yellow
    exit 0
}

# Cập nhật
Write-Host "`nĐang cập nhật..." -ForegroundColor Yellow

$settings.Cors.AllowedOrigins = @($adminUrl, $nguoidanUrl)

# Backup file cũ
$backupPath = "$appsettingsPath.backup"
Copy-Item $appsettingsPath $backupPath -Force
Write-Host "  ✓ Đã backup file cũ: $backupPath" -ForegroundColor Green

# Lưu file mới
$settings | ConvertTo-Json -Depth 10 | Set-Content $appsettingsPath -Encoding UTF8
Write-Host "  ✓ Đã cập nhật $appsettingsPath" -ForegroundColor Green

# Verify
$newSettings = Get-Content $appsettingsPath -Raw | ConvertFrom-Json
Write-Host "`nCORS URLs sau khi cập nhật:" -ForegroundColor Yellow
foreach ($origin in $newSettings.Cors.AllowedOrigins) {
    Write-Host "  - $origin" -ForegroundColor Green
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "✅ CẬP NHẬT THÀNH CÔNG!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan

Write-Host "`nBƯỚC TIẾP THEO:" -ForegroundColor Yellow
Write-Host "1. Kiểm tra file: $appsettingsPath" -ForegroundColor White
Write-Host "2. Chạy: .\build-for-azure.ps1" -ForegroundColor White
Write-Host "3. Deploy backend-api.zip lên Azure" -ForegroundColor White
Write-Host "4. Restart Backend App Service" -ForegroundColor White
Write-Host "5. Test CORS từ frontend" -ForegroundColor White

Write-Host "`nNếu có lỗi, restore từ backup:" -ForegroundColor Cyan
Write-Host "  Copy-Item $backupPath $appsettingsPath -Force" -ForegroundColor Gray
