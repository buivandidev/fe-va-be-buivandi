# Script test luồng Quản lý Trang chủ

Write-Host "=== TEST QUẢN LÝ TRANG CHỦ ===" -ForegroundColor Cyan
Write-Host ""

# Check services
Write-Host "[1] Kiểm tra services đang chạy..." -ForegroundColor Yellow
$backend = Get-NetTCPConnection -LocalPort 5000 -State Listen -ErrorAction SilentlyContinue
$frontendAdmin = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue
$frontendNguoiDan = Get-NetTCPConnection -LocalPort 3001 -State Listen -ErrorAction SilentlyContinue

if ($backend) {
    Write-Host "   ✓ Backend (port 5000)" -ForegroundColor Green
} else {
    Write-Host "   ✗ Backend KHÔNG chạy" -ForegroundColor Red
    exit 1
}

if ($frontendAdmin) {
    Write-Host "   ✓ Frontend Admin (port 3000)" -ForegroundColor Green
} else {
    Write-Host "   ✗ Frontend Admin KHÔNG chạy" -ForegroundColor Red
    exit 1
}

if ($frontendNguoiDan) {
    Write-Host "   ✓ Frontend Người dân (port 3001)" -ForegroundColor Green
} else {
    Write-Host "   ✗ Frontend Người dân KHÔNG chạy" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Test API
Write-Host "[2] Test API endpoints..." -ForegroundColor Yellow

# Test albums
try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/media/albums" -Method GET -ErrorAction Stop
    if ($response.thanhCong) {
        Write-Host "   ✓ GET /api/media/albums - OK (Số album: $($response.duLieu.Count))" -ForegroundColor Green
    } else {
        Write-Host "   ✗ GET /api/media/albums - FAILED" -ForegroundColor Red
    }
} catch {
    Write-Host "   ✗ GET /api/media/albums - ERROR: $($_.Exception.Message)" -ForegroundColor Red
}

# Test media
try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/media?trang=1&kichThuocTrang=10" -Method GET -ErrorAction Stop
    if ($response.thanhCong) {
        Write-Host "   ✓ GET /api/media - OK (Số ảnh/video: $($response.duLieu.tongSo))" -ForegroundColor Green
    } else {
        Write-Host "   ✗ GET /api/media - FAILED" -ForegroundColor Red
    }
} catch {
    Write-Host "   ✗ GET /api/media - ERROR: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Instructions
Write-Host "[3] Hướng dẫn test thủ công:" -ForegroundColor Yellow
Write-Host ""
Write-Host "   A. Test Upload ảnh từ Admin:" -ForegroundColor Cyan
Write-Host "      1. Mở: http://localhost:3000/admin/login" -ForegroundColor White
Write-Host "      2. Đăng nhập: admin@phuongxa.vn / Admin@123" -ForegroundColor White
Write-Host "      3. Vào: http://localhost:3000/admin/homepage" -ForegroundColor White
Write-Host "      4. Upload một ảnh mới" -ForegroundColor White
Write-Host "      5. Kiểm tra ảnh xuất hiện trong danh sách" -ForegroundColor White
Write-Host ""

Write-Host "   B. Test Xem ảnh trên Trang chủ Người dân:" -ForegroundColor Cyan
Write-Host "      1. Mở: http://localhost:3001" -ForegroundColor White
Write-Host "      2. Scroll xuống section 'Tin tức & Sự kiện'" -ForegroundColor White
Write-Host "      3. Scroll xuống section 'Hình ảnh Địa phương'" -ForegroundColor White
Write-Host "      4. Kiểm tra ảnh mới có hiển thị không" -ForegroundColor White
Write-Host ""

Write-Host "   C. Test Sửa ảnh:" -ForegroundColor Cyan
Write-Host "      1. Quay lại: http://localhost:3000/admin/homepage" -ForegroundColor White
Write-Host "      2. Click 'Xem' để xem ảnh chi tiết" -ForegroundColor White
Write-Host "      3. Kiểm tra URL ảnh có đúng không" -ForegroundColor White
Write-Host ""

Write-Host "   D. Test Xóa ảnh:" -ForegroundColor Cyan
Write-Host "      1. Quay lại: http://localhost:3000/admin/homepage" -ForegroundColor White
Write-Host "      2. Click 'Xóa' trên một ảnh" -ForegroundColor White
Write-Host "      3. Xác nhận xóa" -ForegroundColor White
Write-Host "      4. Kiểm tra ảnh đã biến mất" -ForegroundColor White
Write-Host "      5. Refresh trang chủ người dân" -ForegroundColor White
Write-Host "      6. Kiểm tra ảnh không còn hiển thị" -ForegroundColor White
Write-Host ""

Write-Host "[4] Checklist:" -ForegroundColor Yellow
Write-Host "   [ ] Backend chạy ổn định" -ForegroundColor White
Write-Host "   [ ] Frontend Admin chạy ổn định" -ForegroundColor White
Write-Host "   [ ] Frontend Người dân chạy ổn định" -ForegroundColor White
Write-Host "   [ ] Đăng nhập admin thành công" -ForegroundColor White
Write-Host "   [ ] Vào trang Quản lý Trang chủ thành công" -ForegroundColor White
Write-Host "   [ ] Upload ảnh thành công" -ForegroundColor White
Write-Host "   [ ] Ảnh hiển thị trong danh sách" -ForegroundColor White
Write-Host "   [ ] Ảnh hiển thị trên trang chủ người dân" -ForegroundColor White
Write-Host "   [ ] Xem ảnh chi tiết thành công" -ForegroundColor White
Write-Host "   [ ] Xóa ảnh thành công" -ForegroundColor White
Write-Host "   [ ] Ảnh không còn hiển thị sau khi xóa" -ForegroundColor White
Write-Host ""

Write-Host "=== KẾT THÚC ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Nếu tất cả OK, hệ thống đã sẵn sàng!" -ForegroundColor Green
Write-Host ""
