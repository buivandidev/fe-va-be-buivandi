# Script build và chạy backend sau khi sửa lỗi JWT

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  BUILD & RUN BACKEND" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$backendPath = Join-Path $PSScriptRoot "backend\phuongxa-api\src\PhuongXa.API"

if (-not (Test-Path $backendPath)) {
    Write-Host "❌ Không tìm thấy thư mục backend: $backendPath" -ForegroundColor Red
    exit 1
}

Write-Host "📂 Backend path: $backendPath" -ForegroundColor Gray
Write-Host ""

# Dừng process backend cũ nếu đang chạy
Write-Host "🔍 Kiểm tra process backend đang chạy..." -ForegroundColor Yellow
$oldProcess = Get-Process -Name "PhuongXa.API" -ErrorAction SilentlyContinue
if ($oldProcess) {
    Write-Host "⏹️  Dừng backend process cũ..." -ForegroundColor Yellow
    Stop-Process -Name "PhuongXa.API" -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
    Write-Host "   ✅ Đã dừng" -ForegroundColor Green
} else {
    Write-Host "   ℹ️  Không có process nào đang chạy" -ForegroundColor Gray
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Yellow
Write-Host "  CLEAN & BUILD" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Yellow
Write-Host ""

# Clean
Write-Host "🧹 Cleaning..." -ForegroundColor Cyan
Push-Location $backendPath
dotnet clean --verbosity quiet
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Clean failed" -ForegroundColor Red
    Pop-Location
    exit 1
}
Write-Host "   ✅ Clean completed" -ForegroundColor Green

Write-Host ""

# Build
Write-Host "🔨 Building..." -ForegroundColor Cyan
dotnet build --configuration Debug --no-restore
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed" -ForegroundColor Red
    Pop-Location
    exit 1
}
Write-Host "   ✅ Build completed" -ForegroundColor Green

Pop-Location

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  STARTING BACKEND" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

Write-Host "🚀 Starting backend on port 5000..." -ForegroundColor Cyan
Write-Host ""
Write-Host "📝 Các thay đổi đã áp dụng:" -ForegroundColor Yellow
Write-Host "   ✅ Sửa JWT Key encoding (UTF8 thay vì base64)" -ForegroundColor Green
Write-Host "   ✅ Sửa CORS policy (AllowAnyHeader)" -ForegroundColor Green
Write-Host ""
Write-Host "⏳ Backend đang khởi động..." -ForegroundColor Yellow
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""

# Run
Push-Location $backendPath
dotnet run
Pop-Location
