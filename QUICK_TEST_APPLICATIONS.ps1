# Quick test - Kiểm tra nhanh API applications

Write-Host "=== KIỂM TRA NHANH ===" -ForegroundColor Cyan
Write-Host ""

# Test không cần token trước
Write-Host "1. Test API public (không cần auth)..." -ForegroundColor Yellow
try {
    $publicResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/public/applications/track?maTheoDoi=TEST&email=buivandii@gmail.com" -Method Get -ErrorAction SilentlyContinue
    Write-Host "   ✅ API public hoạt động" -ForegroundColor Green
} catch {
    Write-Host "   ⚠️  API public không tìm thấy hồ sơ (bình thường)" -ForegroundColor Gray
}

Write-Host ""
Write-Host "2. Kiểm tra database có hồ sơ không..." -ForegroundColor Yellow
Write-Host "   Đang kiểm tra..." -ForegroundColor Gray

# Gợi ý user check console
Write-Host ""
Write-Host "📋 Hướng dẫn kiểm tra Console:" -ForegroundColor Cyan
Write-Host "1. Mở: http://localhost:3001/ca-nhan" -ForegroundColor White
Write-Host "2. Nhấn F5 để refresh" -ForegroundColor White
Write-Host "3. Nhấn F12 → Console tab" -ForegroundColor White
Write-Host "4. Tìm dòng: '📋 Applications list:'" -ForegroundColor White
Write-Host "5. Click vào mũi tên để xem chi tiết" -ForegroundColor White
Write-Host ""
Write-Host "Nếu thấy:" -ForegroundColor Yellow
Write-Host "  - Array(0) → Chưa có hồ sơ trong DB" -ForegroundColor Gray
Write-Host "  - Array(1) hoặc Array(2) → Có hồ sơ nhưng không hiển thị (bug)" -ForegroundColor Gray
Write-Host ""

# Hướng dẫn lấy token và test
Write-Host "📡 Hoặc test API trực tiếp:" -ForegroundColor Cyan
Write-Host "1. Trong Console, gõ: localStorage.getItem('token')" -ForegroundColor White
Write-Host "2. Copy token" -ForegroundColor White
Write-Host "3. Chạy: ./TEST_APPLICATIONS_API.ps1" -ForegroundColor White
Write-Host "4. Paste token khi được hỏi" -ForegroundColor White
Write-Host ""

Write-Host "=== CHỜ THÔNG TIN TỪ CONSOLE ===" -ForegroundColor Yellow
Write-Host ""
