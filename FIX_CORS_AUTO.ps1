# Script tự động cập nhật CORS với URLs mẫu
# Sử dụng khi bạn đã biết URLs Azure

param(
    [string]$AdminUrl = "",
    [string]$NguoidanUrl = ""
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host " TỰ ĐỘNG CẬP NHẬT CORS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$appsettingsPath = "backend/phuongxa-api/src/PhuongXa.API/appsettings.Production.json"

if (!(Test-Path $appsettingsPath)) {
    Write-Host "Lỗi: Không tìm thấy $appsettingsPath" -ForegroundColor Red
    exit 1
}

# Nếu không có parameters, dùng URLs từ .env
if ([string]::IsNullOrWhiteSpace($AdminUrl) -or [string]::IsNullOrWhiteSpace($NguoidanUrl)) {
    Write-Host "`nKhông có URLs được cung cấp. Đang tìm trong .env..." -ForegroundColor Yellow
    
    # Thử đọc từ .env của người dân
    if (Test-Path "frontend/nguoi-dan/.env") {
        $envContent = Get-Content "frontend/nguoi-dan/.env" -Raw
        if ($envContent -match 'NEXT_PUBLIC_API_BASE_URL=(.+)') {
            $backendUrl = $matches[1].Trim()
            Write-Host "  Backend URL từ .env: $backendUrl" -ForegroundColor Cyan
            
            # Extract domain pattern
            if ($backendUrl -match 'https://([^.]+)\.') {
                $prefix = $matches[1]
                Write-Host "  Prefix phát hiện: $prefix" -ForegroundColor Cyan
                
                # Suggest URLs
                if ([string]::IsNullOrWhiteSpace($AdminUrl)) {
                    $AdminUrl = $backendUrl -replace 'api', 'admin'
                    Write-Host "  → Gợi ý Admin URL: $AdminUrl" -ForegroundColor Yellow
                }
                
                if ([string]::IsNullOrWhiteSpace($NguoidanUrl)) {
                    $NguoidanUrl = $backendUrl -replace 'api', 'nguoidan'
                    Write-Host "  → Gợi ý Người Dân URL: $NguoidanUrl" -ForegroundColor Yellow
                }
            }
        }
    }
}

# Nếu vẫn không có, yêu cầu nhập
if ([string]::IsNullOrWhiteSpace($AdminUrl)) {
    Write-Host "`nVí dụ: https://phuongxa-admin.azurewebsites.net" -ForegroundColor Gray
    $AdminUrl = Read-Host "Nhập Admin URL"
}

if ([string]::IsNullOrWhiteSpace($NguoidanUrl)) {
    Write-Host "`nVí dụ: https://phuongxa-nguoidan.azurewebsites.net" -ForegroundColor Gray
    $NguoidanUrl = Read-Host "Nhập Người Dân URL"
}

# Validate
if ([string]::IsNullOrWhiteSpace($AdminUrl) -or [string]::IsNullOrWhiteSpace($NguoidanUrl)) {
    Write-Host "Lỗi: URLs không được để trống!" -ForegroundColor Red
    exit 1
}

# Remove trailing slash
$AdminUrl = $AdminUrl.TrimEnd('/')
$NguoidanUrl = $NguoidanUrl.TrimEnd('/')

Write-Host "`nCORS URLs sẽ cập nhật:" -ForegroundColor Yellow
Write-Host "  - Admin:      $AdminUrl" -ForegroundColor Green
Write-Host "  - Người Dân:  $NguoidanUrl" -ForegroundColor Green

# Đọc và cập nhật
$settings = Get-Content $appsettingsPath -Raw | ConvertFrom-Json

# Backup
$backupPath = "$appsettingsPath.backup.$(Get-Date -Format 'yyyyMMdd_HHmmss')"
Copy-Item $appsettingsPath $backupPath -Force
Write-Host "`n✓ Backup: $backupPath" -ForegroundColor Green

# Update
$settings.Cors.AllowedOrigins = @($AdminUrl, $NguoidanUrl)
$settings | ConvertTo-Json -Depth 10 | Set-Content $appsettingsPath -Encoding UTF8

Write-Host "✓ Đã cập nhật CORS" -ForegroundColor Green

# Verify
$newSettings = Get-Content $appsettingsPath -Raw | ConvertFrom-Json
Write-Host "`nCORS URLs mới:" -ForegroundColor Yellow
foreach ($origin in $newSettings.Cors.AllowedOrigins) {
    Write-Host "  ✓ $origin" -ForegroundColor Green
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "✅ HOÀN TẤT!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan

Write-Host "`nBước tiếp theo:" -ForegroundColor Yellow
Write-Host "  .\build-for-azure.ps1" -ForegroundColor Cyan
