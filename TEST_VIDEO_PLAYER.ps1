# Test Video Player trên trang chủ

Write-Host "=== KIỂM TRA VIDEO PLAYER ===" -ForegroundColor Cyan
Write-Host ""

# 1. Kiểm tra API có video
Write-Host "1. Kiểm tra API có video..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/homepage/sections" -Method Get
    
    if ($response.thanhCong -and $response.duLieu.videos) {
        $videoCount = $response.duLieu.videos.Count
        Write-Host "   ✅ Tìm thấy $videoCount video" -ForegroundColor Green
        
        foreach ($video in $response.duLieu.videos) {
            $loaiText = if ($video.loai -eq 1) { "VIDEO" } else { "ẢNH" }
            Write-Host "   - [$loaiText] $($video.tenTep)" -ForegroundColor Gray
            Write-Host "     URL: $($video.urlTep)" -ForegroundColor DarkGray
        }
    } else {
        Write-Host "   ⚠️  Chưa có video nào" -ForegroundColor Yellow
        Write-Host "   Hướng dẫn: Upload video từ admin panel" -ForegroundColor Gray
    }
} catch {
    Write-Host "   ❌ Không thể gọi API: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""

# 2. Kiểm tra frontend
Write-Host "2. Kiểm tra frontend..." -ForegroundColor Yellow
try {
    $frontend = Invoke-WebRequest -Uri "http://localhost:3001" -UseBasicParsing -TimeoutSec 5
    Write-Host "   ✅ Frontend đang chạy" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Frontend không chạy" -ForegroundColor Red
    Write-Host "   Chạy: cd frontend/nguoi-dan; npm run dev -- --webpack" -ForegroundColor Gray
    exit 1
}

Write-Host ""

# 3. Hướng dẫn test thủ công
Write-Host "3. Hướng dẫn test video player:" -ForegroundColor Yellow
Write-Host ""
Write-Host "   📹 UPLOAD VIDEO (nếu chưa có):" -ForegroundColor Cyan
Write-Host "   1. Đăng nhập admin: http://localhost:3000/admin/dang-nhap"
Write-Host "      Email: admin@phuongxa.vn"
Write-Host "      Password: Admin@123"
Write-Host "   2. Vào: http://localhost:3000/admin/homepage"
Write-Host "   3. Tab '🎬 Video' → Upload file video (.mp4, .webm)"
Write-Host ""
Write-Host "   🎬 TEST VIDEO PLAYER:" -ForegroundColor Cyan
Write-Host "   1. Mở: http://localhost:3001"
Write-Host "   2. Scroll xuống section 'Video Tiêu Điểm'"
Write-Host "   3. Click vào video chính (ảnh lớn)"
Write-Host "   4. Modal mở ra → Video tự động phát"
Write-Host "   5. Kiểm tra controls:"
Write-Host "      - Play/Pause"
Write-Host "      - Volume"
Write-Host "      - Seek (tua)"
Write-Host "      - Fullscreen"
Write-Host "   6. Đóng modal:"
Write-Host "      - Click nút 'Đóng'"
Write-Host "      - Nhấn ESC"
Write-Host "      - Click ngoài modal"
Write-Host "   7. Thử click video nhỏ bên phải"
Write-Host ""
Write-Host "   ⌨️  KEYBOARD SHORTCUTS:" -ForegroundColor Cyan
Write-Host "   - ESC: Đóng modal"
Write-Host "   - Space: Play/Pause (khi focus video)"
Write-Host "   - F: Fullscreen (khi focus video)"
Write-Host ""

Write-Host "=== TÍNH NĂNG ===" -ForegroundColor Green
Write-Host ""
Write-Host "✅ Video modal popup"
Write-Host "✅ Auto-play khi mở"
Write-Host "✅ Full video controls"
Write-Host "✅ Keyboard support (ESC)"
Write-Host "✅ Click outside to close"
Write-Host "✅ Body scroll lock khi modal mở"
Write-Host "✅ Responsive design"
Write-Host "✅ Play icon overlay"
Write-Host ""

Write-Host "🎬 Video player đã sẵn sàng!" -ForegroundColor Green
Write-Host ""
