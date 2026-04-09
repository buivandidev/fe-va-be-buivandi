# Script Restart Frontend Admin

Write-Host "🔄 Đang restart Frontend Admin..." -ForegroundColor Cyan

# Kiểm tra thư mục
if (-not (Test-Path "frontend")) {
    Write-Host "❌ Không tìm thấy thư mục frontend!" -ForegroundColor Red
    exit 1
}

# Chuyển vào thư mục frontend
Set-Location frontend

# Xóa cache Next.js
Write-Host "🗑️  Đang xóa cache Next.js..." -ForegroundColor Yellow
if (Test-Path ".next") {
    Remove-Item -Recurse -Force .next
    Write-Host "✅ Đã xóa cache .next" -ForegroundColor Green
}

# Xóa cache node_modules/.cache (nếu có)
if (Test-Path "node_modules/.cache") {
    Remove-Item -Recurse -Force node_modules/.cache
    Write-Host "✅ Đã xóa cache node_modules" -ForegroundColor Green
}

Write-Host ""
Write-Host "✅ Đã xóa cache xong!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Bây giờ hãy chạy lệnh sau để start frontend:" -ForegroundColor Cyan
Write-Host "   npm run dev" -ForegroundColor Yellow
Write-Host ""
Write-Host "🌐 Sau khi start, mở browser và:" -ForegroundColor Cyan
Write-Host "   1. Vào trang admin: http://localhost:3000/admin" -ForegroundColor Yellow
Write-Host "   2. Nhấn Ctrl+Shift+R để clear browser cache" -ForegroundColor Yellow
Write-Host ""
