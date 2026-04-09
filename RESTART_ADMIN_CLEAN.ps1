# Script khởi động lại frontend admin (clean)
Write-Host "🧹 Dọn dẹp cache Next.js..." -ForegroundColor Yellow

# Xóa cache .next
if (Test-Path "frontend\.next") {
    Remove-Item -Recurse -Force "frontend\.next"
    Write-Host "✅ Đã xóa .next cache" -ForegroundColor Green
}

# Xóa turbopack cache
if (Test-Path "frontend\.turbo") {
    Remove-Item -Recurse -Force "frontend\.turbo"
    Write-Host "✅ Đã xóa .turbo cache" -ForegroundColor Green
}

Write-Host ""
Write-Host "🚀 Khởi động frontend admin..." -ForegroundColor Cyan
Write-Host "📍 URL: http://localhost:3000" -ForegroundColor Yellow
Write-Host ""

Set-Location "frontend"
npm run dev
