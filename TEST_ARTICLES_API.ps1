# Script test API tin tức
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "🧪 TEST API TIN TỨC" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Test backend port
Write-Host "1️⃣ Kiểm tra Backend..." -ForegroundColor Yellow
try {
    $connection = Test-NetConnection -ComputerName localhost -Port 5000 -WarningAction SilentlyContinue -ErrorAction Stop
    if ($connection.TcpTestSucceeded) {
        Write-Host "  ✅ Backend đang chạy (port 5000)" -ForegroundColor Green
    } else {
        Write-Host "  ❌ Backend KHÔNG chạy (port 5000)" -ForegroundColor Red
        Write-Host "  💡 Chạy: cd backend\phuongxa-api\src\PhuongXa.API; dotnet run" -ForegroundColor Yellow
        exit 1
    }
} catch {
    Write-Host "  ❌ Không thể kiểm tra port 5000" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Test Public API
Write-Host "2️⃣ Test Public API (GET /api/articles)..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/articles?trang=1&kichThuocTrang=10" -Method GET -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "  ✅ Public API hoạt động (Status: 200)" -ForegroundColor Green
        
        $json = $response.Content | ConvertFrom-Json
        $success = $json.thanhCong -or $json.ThanhCong
        
        if ($success) {
            $data = $json.duLieu -or $json.DuLieu
            $list = $data.danhSach -or $data.DanhSach
            $count = if ($list) { $list.Count } else { 0 }
            
            Write-Host "  📊 Số bài viết: $count" -ForegroundColor Cyan
            
            if ($count -eq 0) {
                Write-Host "  ⚠️  Database chưa có bài viết nào" -ForegroundColor Yellow
                Write-Host "  💡 Tạo bài viết mẫu trong admin: http://localhost:3000/admin/articles" -ForegroundColor Yellow
            } else {
                Write-Host "  ✅ Có dữ liệu bài viết" -ForegroundColor Green
            }
        } else {
            Write-Host "  ⚠️  API trả về success=false" -ForegroundColor Yellow
        }
    }
} catch {
    Write-Host "  ❌ Lỗi khi gọi Public API" -ForegroundColor Red
    Write-Host "  📝 Chi tiết: $($_.Exception.Message)" -ForegroundColor Gray
}

Write-Host ""

# Test Admin API (cần token)
Write-Host "3️⃣ Test Admin API (GET /api/admin/articles/admin)..." -ForegroundColor Yellow
Write-Host "  ℹ️  Cần token để test, vui lòng test thủ công:" -ForegroundColor Gray
Write-Host "  🌐 Mở: http://localhost:3000/admin/articles" -ForegroundColor Cyan

Write-Host ""

# Test Swagger
Write-Host "4️⃣ Test Swagger UI..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/swagger" -Method GET -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "  ✅ Swagger UI hoạt động" -ForegroundColor Green
        Write-Host "  🌐 Mở: http://localhost:5000/swagger" -ForegroundColor Cyan
    }
} catch {
    Write-Host "  ⚠️  Swagger UI không khả dụng" -ForegroundColor Yellow
}

Write-Host ""

# Test Categories API
Write-Host "5️⃣ Test Categories API..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/categories?loai=0&chiLayDangHoatDong=true" -Method GET -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "  ✅ Categories API hoạt động" -ForegroundColor Green
        
        $json = $response.Content | ConvertFrom-Json
        $success = $json.thanhCong -or $json.ThanhCong
        
        if ($success) {
            $data = $json.duLieu -or $json.DuLieu
            $list = $data.danhSach -or $data.DanhSach
            $count = if ($list) { $list.Count } else { 0 }
            
            Write-Host "  📊 Số danh mục: $count" -ForegroundColor Cyan
            
            if ($count -eq 0) {
                Write-Host "  ⚠️  Chưa có danh mục tin tức" -ForegroundColor Yellow
                Write-Host "  💡 Tạo danh mục trong admin: http://localhost:3000/admin/categories" -ForegroundColor Yellow
            } else {
                Write-Host "  ✅ Có danh mục tin tức" -ForegroundColor Green
            }
        }
    }
} catch {
    Write-Host "  ❌ Lỗi khi gọi Categories API" -ForegroundColor Red
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "📋 TÓM TẮT" -ForegroundColor White
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "🌐 URLs để test thủ công:" -ForegroundColor Yellow
Write-Host "  - Admin Articles:  http://localhost:3000/admin/articles" -ForegroundColor Cyan
Write-Host "  - Public Articles: http://localhost:3001/tin-tuc" -ForegroundColor Green
Write-Host "  - Swagger UI:      http://localhost:5000/swagger" -ForegroundColor Magenta
Write-Host ""
Write-Host "📚 Xem hướng dẫn chi tiết: FIX_ARTICLES_MANAGEMENT.md" -ForegroundColor Yellow
Write-Host ""
