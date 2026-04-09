# Test luồng hoàn chỉnh: Admin Upload → API → Frontend Người Dân

Write-Host "=== KIỂM TRA LUỒNG TRANG CHỦ ===" -ForegroundColor Cyan
Write-Host ""

# 1. Kiểm tra servers
Write-Host "1. Kiểm tra servers đang chạy..." -ForegroundColor Yellow
Write-Host "   Backend (5000):" -NoNewline
try {
    $backend = Invoke-WebRequest -Uri "http://localhost:5000/api/homepage/sections" -UseBasicParsing -TimeoutSec 5
    Write-Host " ✅ OK" -ForegroundColor Green
} catch {
    Write-Host " ❌ KHÔNG CHẠY" -ForegroundColor Red
    Write-Host "   Chạy: cd backend/phuongxa-api/src/PhuongXa.API; `$env:ASPNETCORE_ENVIRONMENT='Development'; dotnet run"
    exit 1
}

Write-Host "   Admin (3000):" -NoNewline
try {
    $admin = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing -TimeoutSec 5
    Write-Host " ✅ OK" -ForegroundColor Green
} catch {
    Write-Host " ❌ KHÔNG CHẠY" -ForegroundColor Red
    Write-Host "   Chạy: cd frontend; npm run dev"
    exit 1
}

Write-Host "   Người dân (3001):" -NoNewline
try {
    $nguoidan = Invoke-WebRequest -Uri "http://localhost:3001" -UseBasicParsing -TimeoutSec 5
    Write-Host " ✅ OK" -ForegroundColor Green
} catch {
    Write-Host " ❌ KHÔNG CHẠY" -ForegroundColor Red
    Write-Host "   Chạy: cd frontend/nguoi-dan; npm run dev -- --webpack"
    exit 1
}

Write-Host ""

# 2. Test API
Write-Host "2. Kiểm tra API /api/homepage/sections..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/homepage/sections" -Method Get
    
    if ($response.thanhCong) {
        Write-Host "   ✅ API hoạt động" -ForegroundColor Green
        
        # Kiểm tra banner
        if ($response.duLieu.banner) {
            Write-Host "   ✅ Banner: $($response.duLieu.banner.tenTep)" -ForegroundColor Green
            Write-Host "      URL: $($response.duLieu.banner.urlTep)" -ForegroundColor Gray
        } else {
            Write-Host "   ⚠️  Banner: Chưa có dữ liệu" -ForegroundColor Yellow
        }
        
        # Kiểm tra videos
        $videoCount = $response.duLieu.videos.Count
        Write-Host "   ✅ Videos: $videoCount file" -ForegroundColor Green
        foreach ($video in $response.duLieu.videos) {
            Write-Host "      - $($video.tenTep)" -ForegroundColor Gray
        }
        
        # Kiểm tra gallery
        $galleryCount = $response.duLieu.gallery.Count
        Write-Host "   ✅ Gallery: $galleryCount ảnh" -ForegroundColor Green
        foreach ($img in $response.duLieu.gallery) {
            Write-Host "      - $($img.tenTep)" -ForegroundColor Gray
        }
        
    } else {
        Write-Host "   ❌ API trả về lỗi" -ForegroundColor Red
    }
} catch {
    Write-Host "   ❌ Không thể gọi API: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""

# 3. Hướng dẫn test thủ công
Write-Host "3. Kiểm tra thủ công:" -ForegroundColor Yellow
Write-Host ""
Write-Host "   📝 ADMIN PANEL:" -ForegroundColor Cyan
Write-Host "   1. Mở: http://localhost:3000/admin/dang-nhap"
Write-Host "      Email: admin@phuongxa.vn"
Write-Host "      Password: Admin@123"
Write-Host "   2. Vào: http://localhost:3000/admin/homepage"
Write-Host "   3. Upload ảnh vào các tab:"
Write-Host "      - 🎯 Banner: 1 ảnh (1920x1080px)"
Write-Host "      - 🎬 Video: 4 video/ảnh"
Write-Host "      - 🖼️ Gallery: 5 ảnh"
Write-Host ""
Write-Host "   👥 FRONTEND NGƯỜI DÂN:" -ForegroundColor Cyan
Write-Host "   1. Mở: http://localhost:3001"
Write-Host "   2. Kiểm tra các section:"
Write-Host "      - Banner hero (ảnh lớn đầu trang)"
Write-Host "      - Video tiêu điểm (section video)"
Write-Host "      - Hình ảnh địa phương (gallery cuối trang)"
Write-Host "   3. Ảnh phải hiển thị từ admin, không phải ảnh mặc định"
Write-Host ""

Write-Host "=== HOÀN THÀNH ===" -ForegroundColor Green
Write-Host ""
Write-Host "✅ Backend API: http://localhost:5000/api/homepage/sections"
Write-Host "✅ Admin Panel: http://localhost:3000/admin/homepage"
Write-Host "✅ Frontend: http://localhost:3001"
Write-Host ""
