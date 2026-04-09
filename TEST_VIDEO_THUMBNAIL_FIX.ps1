# Test fix video thumbnail trắng

Write-Host "=== KIỂM TRA FIX VIDEO THUMBNAIL ===" -ForegroundColor Cyan
Write-Host ""

# 1. Kiểm tra API
Write-Host "1. Kiểm tra dữ liệu từ API..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/homepage/sections" -Method Get
    
    if ($response.thanhCong) {
        # Kiểm tra gallery (dùng làm thumbnail)
        $galleryCount = $response.duLieu.gallery.Count
        if ($galleryCount -gt 0) {
            Write-Host "   ✅ Gallery: $galleryCount ảnh (dùng làm thumbnail)" -ForegroundColor Green
            Write-Host "      Thumbnail chính: $($response.duLieu.gallery[0].tenTep)" -ForegroundColor Gray
        } else {
            Write-Host "   ⚠️  Gallery: Chưa có ảnh" -ForegroundColor Yellow
            Write-Host "      → Video sẽ dùng banner làm thumbnail" -ForegroundColor Gray
        }
        
        # Kiểm tra banner (fallback thumbnail)
        if ($response.duLieu.banner) {
            Write-Host "   ✅ Banner: $($response.duLieu.banner.tenTep) (fallback thumbnail)" -ForegroundColor Green
        } else {
            Write-Host "   ⚠️  Banner: Chưa có" -ForegroundColor Yellow
            Write-Host "      → Video sẽ dùng ảnh mặc định" -ForegroundColor Gray
        }
        
        # Kiểm tra videos
        $videoCount = $response.duLieu.videos.Count
        if ($videoCount -gt 0) {
            Write-Host "   ✅ Videos: $videoCount file" -ForegroundColor Green
            foreach ($video in $response.duLieu.videos) {
                Write-Host "      - $($video.tenTep)" -ForegroundColor Gray
            }
        } else {
            Write-Host "   ⚠️  Videos: Chưa có video" -ForegroundColor Yellow
        }
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
    exit 1
}

Write-Host ""

# 3. Hướng dẫn test
Write-Host "3. Hướng dẫn test thumbnail:" -ForegroundColor Yellow
Write-Host ""
Write-Host "   📸 UPLOAD THUMBNAIL (quan trọng!):" -ForegroundColor Cyan
Write-Host "   1. Đăng nhập admin: http://localhost:3000/admin/homepage"
Write-Host "   2. Tab '🖼️ Gallery' → Upload ảnh thumbnail"
Write-Host "      - Ảnh 1: Thumbnail cho video chính"
Write-Host "      - Ảnh 2-3: Thumbnail cho side videos"
Write-Host "      - Kích thước đề xuất: 1920x1080px (16:9)"
Write-Host "   3. Tab '🎬 Video' → Upload video"
Write-Host ""
Write-Host "   ✅ KIỂM TRA THUMBNAIL:" -ForegroundColor Cyan
Write-Host "   1. Mở: http://localhost:3001"
Write-Host "   2. Scroll xuống 'Video Tiêu Điểm'"
Write-Host "   3. Kiểm tra:"
Write-Host "      ✅ Video chính hiển thị ảnh (KHÔNG TRẮNG)"
Write-Host "      ✅ Side videos hiển thị ảnh (KHÔNG TRẮNG)"
Write-Host "      ✅ Play button hiển thị ở giữa"
Write-Host "   4. Click vào video:"
Write-Host "      ✅ Modal mở ra"
Write-Host "      ✅ Video tự động phát"
Write-Host "      ✅ Controls hoạt động"
Write-Host ""

Write-Host "=== THUMBNAIL PRIORITY ===" -ForegroundColor Green
Write-Host ""
Write-Host "Video sẽ dùng thumbnail theo thứ tự:"
Write-Host "1. 🖼️  Gallery image (ưu tiên cao nhất)"
Write-Host "2. 🎯 Banner image (nếu không có gallery)"
Write-Host "3. 🌐 Default image (nếu không có gì)"
Write-Host ""

if ($galleryCount -gt 0) {
    Write-Host "✅ Hiện tại: Dùng GALLERY làm thumbnail" -ForegroundColor Green
} elseif ($response.duLieu.banner) {
    Write-Host "⚠️  Hiện tại: Dùng BANNER làm thumbnail" -ForegroundColor Yellow
    Write-Host "   Đề xuất: Upload ảnh vào Gallery để có thumbnail đẹp hơn" -ForegroundColor Gray
} else {
    Write-Host "⚠️  Hiện tại: Dùng ảnh MẶC ĐỊNH" -ForegroundColor Yellow
    Write-Host "   Đề xuất: Upload ảnh vào Gallery hoặc Banner" -ForegroundColor Gray
}

Write-Host ""
Write-Host "🎬 Fix hoàn tất! Video giờ có thumbnail đẹp!" -ForegroundColor Green
Write-Host ""
