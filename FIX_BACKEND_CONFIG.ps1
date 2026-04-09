# Script fix toàn bộ backend config
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "🔧 FIX BACKEND CONFIGURATION" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

$appsettingsPath = "backend\phuongxa-api\src\PhuongXa.API\appsettings.Development.json"

# Generate secure JWT key (32 bytes = 256 bits)
Write-Host "1️⃣ Tạo JWT Key..." -ForegroundColor Yellow
$bytes = New-Object byte[] 32
$rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
$rng.GetBytes($bytes)
$jwtKey = [Convert]::ToBase64String($bytes)
Write-Host "  ✅ JWT Key: $($jwtKey.Substring(0, 20))..." -ForegroundColor Green

# Read current appsettings
Write-Host ""
Write-Host "2️⃣ Đọc cấu hình hiện tại..." -ForegroundColor Yellow
$json = Get-Content $appsettingsPath -Raw | ConvertFrom-Json

# Update JWT Key
$json.Jwt.Key = $jwtKey

# Update Connection String (SQL Server)
Write-Host ""
Write-Host "3️⃣ Cập nhật Connection String..." -ForegroundColor Yellow
$json.ConnectionStrings.DefaultConnection = "Server=localhost;Database=PhuongXaDB;Trusted_Connection=True;TrustServerCertificate=True;MultipleActiveResultSets=true"
Write-Host "  ✅ SQL Server: localhost\PhuongXaDB" -ForegroundColor Green

# Update FileStorage BaseUrl
$json.FileStorage.BaseUrl = "http://localhost:5000"

# Save back
Write-Host ""
Write-Host "4️⃣ Lưu cấu hình..." -ForegroundColor Yellow
$json | ConvertTo-Json -Depth 10 | Set-Content $appsettingsPath -Encoding UTF8
Write-Host "  ✅ Đã lưu: $appsettingsPath" -ForegroundColor Green

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "✅ HOÀN TẤT CẤU HÌNH!" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 Cấu hình đã được cập nhật:" -ForegroundColor White
Write-Host "  ✅ JWT Key: Secure 256-bit key" -ForegroundColor Green
Write-Host "  ✅ Database: SQL Server (localhost)" -ForegroundColor Green
Write-Host "  ✅ FileStorage: http://localhost:5000" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 Khởi động lại backend:" -ForegroundColor Yellow
Write-Host "  cd backend\phuongxa-api\src\PhuongXa.API" -ForegroundColor Gray
Write-Host "  dotnet run" -ForegroundColor Gray
Write-Host ""
Write-Host "💡 Hoặc dùng script:" -ForegroundColor Yellow
Write-Host "  .\RESTART_ALL_CLEAN.ps1" -ForegroundColor Gray
Write-Host ""
