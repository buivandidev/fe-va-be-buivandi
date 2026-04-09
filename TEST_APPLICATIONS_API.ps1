# Test API applications để debug hồ sơ gần đây

Write-Host "=== KIỂM TRA API APPLICATIONS ===" -ForegroundColor Cyan
Write-Host ""

# Lấy token từ user (cần copy từ browser)
Write-Host "Hướng dẫn lấy token:" -ForegroundColor Yellow
Write-Host "1. Mở http://localhost:3001/ca-nhan" -ForegroundColor Gray
Write-Host "2. F12 → Console tab" -ForegroundColor Gray
Write-Host "3. Gõ: localStorage.getItem('token')" -ForegroundColor Gray
Write-Host "4. Copy token và paste vào đây" -ForegroundColor Gray
Write-Host ""

$token = Read-Host "Nhập token"

if ([string]::IsNullOrWhiteSpace($token)) {
    Write-Host "❌ Token không được để trống!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Testing API..." -ForegroundColor Yellow

try {
    $headers = @{
        "Authorization" = "Bearer $token"
    }
    
    # Test 1: Lấy danh sách applications
    Write-Host "1. GET /api/public/applications" -ForegroundColor Cyan
    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/public/applications?trang=1&kichThuocTrang=100" -Headers $headers -Method Get
    
    if ($response.thanhCong) {
        Write-Host "   ✅ API thành công" -ForegroundColor Green
        
        $danhSach = $response.duLieu.danhSach
        if ($null -eq $danhSach) {
            $danhSach = $response.duLieu.DanhSach
        }
        
        if ($null -eq $danhSach) {
            Write-Host "   ❌ Không tìm thấy field 'danhSach' hoặc 'DanhSach'" -ForegroundColor Red
            Write-Host "   Response structure:" -ForegroundColor Gray
            $response.duLieu | ConvertTo-Json -Depth 2
        } elseif ($danhSach.Count -eq 0) {
            Write-Host "   ⚠️  Danh sách rỗng (0 hồ sơ)" -ForegroundColor Yellow
            Write-Host ""
            Write-Host "   Nguyên nhân có thể:" -ForegroundColor Yellow
            Write-Host "   - User này chưa nộp hồ sơ nào" -ForegroundColor Gray
            Write-Host "   - Hồ sơ thuộc về user khác" -ForegroundColor Gray
            Write-Host "   - Database chưa có dữ liệu test" -ForegroundColor Gray
            Write-Host ""
            Write-Host "   Giải pháp:" -ForegroundColor Cyan
            Write-Host "   1. Nộp hồ sơ mới: http://localhost:3001/dich-vu-cong" -ForegroundColor Gray
            Write-Host "   2. Hoặc dùng tài khoản admin để tạo hồ sơ test" -ForegroundColor Gray
        } else {
            Write-Host "   ✅ Tìm thấy $($danhSach.Count) hồ sơ" -ForegroundColor Green
            Write-Host ""
            Write-Host "   Danh sách hồ sơ:" -ForegroundColor Cyan
            foreach ($hoSo in $danhSach) {
                Write-Host "   - Mã: $($hoSo.maTheoDoi ?? $hoSo.MaTheoDoi)" -ForegroundColor Gray
                Write-Host "     Dịch vụ: $($hoSo.tenDichVu ?? $hoSo.TenDichVu)" -ForegroundColor Gray
                Write-Host "     Ngày nộp: $($hoSo.ngayNop ?? $hoSo.NgayNop)" -ForegroundColor Gray
                Write-Host "     Trạng thái: $($hoSo.trangThai ?? $hoSo.TrangThai)" -ForegroundColor Gray
                Write-Host ""
            }
        }
        
        # Hiển thị thống kê
        Write-Host "   📊 Thống kê:" -ForegroundColor Cyan
        Write-Host "   - Tổng số: $($response.duLieu.tongSo ?? $response.duLieu.TongSo ?? 0)" -ForegroundColor Gray
        Write-Host "   - Trang: $($response.duLieu.trang ?? $response.duLieu.Trang ?? 1)" -ForegroundColor Gray
        Write-Host "   - Kích thước trang: $($response.duLieu.kichThuocTrang ?? $response.duLieu.KichThuocTrang ?? 0)" -ForegroundColor Gray
        
    } else {
        Write-Host "   ❌ API thất bại" -ForegroundColor Red
        Write-Host "   Message: $($response.thongDiep ?? $response.ThongDiep)" -ForegroundColor Red
    }
    
} catch {
    Write-Host "   ❌ Lỗi khi gọi API" -ForegroundColor Red
    Write-Host "   Error: $_" -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $statusCode = $_.Exception.Response.StatusCode.value__
        Write-Host "   Status Code: $statusCode" -ForegroundColor Red
        
        if ($statusCode -eq 401) {
            Write-Host ""
            Write-Host "   🔐 Token không hợp lệ hoặc hết hạn!" -ForegroundColor Yellow
            Write-Host "   Giải pháp:" -ForegroundColor Cyan
            Write-Host "   1. Đăng xuất và đăng nhập lại" -ForegroundColor Gray
            Write-Host "   2. Lấy token mới từ localStorage" -ForegroundColor Gray
        } elseif ($statusCode -eq 403) {
            Write-Host ""
            Write-Host "   🚫 Không có quyền truy cập!" -ForegroundColor Yellow
        }
    }
}

Write-Host ""
Write-Host "=== KẾT THÚC ===" -ForegroundColor Green
Write-Host ""
