# Script fix JWT Key cho backend
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "🔧 FIX BACKEND JWT KEY" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

$appsettingsPath = "backend\phuongxa-api\src\PhuongXa.API\appsettings.Development.json"

# Generate secure JWT key (32 bytes = 256 bits)
$bytes = New-Object byte[] 32
$rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
$rng.GetBytes($bytes)
$jwtKey = [Convert]::ToBase64String($bytes)

Write-Host "✅ Đã tạo JWT Key mới (256 bits)" -ForegroundColor Green
Write-Host "📝 Key: $($jwtKey.Substring(0, 20))..." -ForegroundColor Gray
Write-Host ""

# Read current appsettings
Write-Host "📖 Đọc appsettings.Development.json..." -ForegroundColor Yellow
$json = Get-Content $appsettingsPath -Raw | ConvertFrom-Json

# Update JWT Key
$json.Jwt.Key = $jwtKey

# Save back
Write-Host "💾 Lưu cấu hình mới..." -ForegroundColor Yellow
$json | ConvertTo-Json -Depth 10 | Set-Content $appsettingsPath -Encoding UTF8

Write-Host "✅ Đã cập nhật JWT Key!" -ForegroundColor Green
Write-Host ""

Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "✅ HOÀN TẤT!" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "🚀 Khởi động lại backend:" -ForegroundColor Yellow
Write-Host "  cd backend\phuongxa-api\src\PhuongXa.API" -ForegroundColor Gray
Write-Host "  dotnet run" -ForegroundColor Gray
Write-Host ""
