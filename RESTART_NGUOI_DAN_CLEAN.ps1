# Script khởi động lại frontend người dân (clean)
Write-Host "🧹 Dọn dẹp cache Next.js..." -ForegroundColor Yellow

# Xóa cache .next
if (Test-Path "frontend\nguoi-dan\.next") {
    Remove-Item -Recurse -Force "frontend\nguoi-dan\.next"
    Write-Host "✅ Đã xóa .next cache" -ForegroundColor Green
}

# Xóa turbopack cache
if (Test-Path "frontend\nguoi-dan\.turbo") {
    Remove-Item -Recurse -Force "frontend\nguoi-dan\.turbo"
    Write-Host "✅ Đã xóa .turbo cache" -ForegroundColor Green
}

Write-Host ""
Write-Host "🚀 Khởi động frontend người dân..." -ForegroundColor Cyan
Write-Host "📍 URL: http://localhost:3001" -ForegroundColor Yellow
Write-Host ""

Set-Location "frontend\nguoi-dan"
npm run dev
