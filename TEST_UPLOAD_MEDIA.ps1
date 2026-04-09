# Script test upload media với token

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "TEST UPLOAD MEDIA" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Lấy token từ localStorage (cần browser console)
Write-Host "Bước 1: Lấy token từ browser" -ForegroundColor Yellow
Write-Host "  Mở DevTools Console và chạy:" -ForegroundColor Gray
Write-Host "  localStorage.getItem('auth_token')" -ForegroundColor Cyan
Write-Host ""

$token = Read-Host "Nhập token (hoặc Enter để skip)"

if ([string]::IsNullOrWhiteSpace($token)) {
    Write-Host "Skipped token test" -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "Bước 2: Test API với token" -ForegroundColor Yellow

# Test GET /api/admin/media
try {
    $headers = @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    }
    
    Write-Host "  Testing GET /api/admin/media..." -ForegroundColor Gray
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/admin/media?trang=1&kichThuocTrang=1" -Method GET -Headers $headers -ErrorAction Stop
    
    if ($response.StatusCode -eq 200) {
        Write-Host "  ✓ GET request OK" -ForegroundColor Green
        Write-Host "  Response: $($response.Content.Substring(0, [Math]::Min(200, $response.Content.Length)))..." -ForegroundColor Gray
    }
} catch {
    Write-Host "  ✗ GET request failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "  Status: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
}

Write-Host ""
Write-Host "Bước 3: Kiểm tra token validity" -ForegroundColor Yellow

# Decode JWT (base64)
try {
    $parts = $token.Split('.')
    if ($parts.Length -eq 3) {
        $payload = $parts[1]
        # Add padding if needed
        while ($payload.Length % 4 -ne 0) {
            $payload += "="
        }
        $decoded = [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String($payload))
        $json = $decoded | ConvertFrom-Json
        
        Write-Host "  Token payload:" -ForegroundColor Gray
        Write-Host "  User: $($json.sub)" -ForegroundColor Cyan
        Write-Host "  Role: $($json.role)" -ForegroundColor Cyan
        Write-Host "  Exp: $($json.exp)" -ForegroundColor Cyan
        
        # Check expiration
        $exp = [DateTimeOffset]::FromUnixTimeSeconds($json.exp).LocalDateTime
        $now = Get-Date
        
        if ($exp -lt $now) {
            Write-Host "  ✗ Token EXPIRED at $exp" -ForegroundColor Red
        } else {
            Write-Host "  ✓ Token valid until $exp" -ForegroundColor Green
        }
    }
} catch {
    Write-Host "  ⚠ Could not decode token: $_" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "HƯỚNG DẪN FIX" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Nếu token expired:" -ForegroundColor Yellow
Write-Host "  1. Đăng xuất và đăng nhập lại" -ForegroundColor White
Write-Host "  2. Hoặc refresh page" -ForegroundColor White
Write-Host ""

Write-Host "Nếu vẫn lỗi 401:" -ForegroundColor Yellow
Write-Host "  1. Kiểm tra backend đang chạy: http://localhost:5000" -ForegroundColor White
Write-Host "  2. Kiểm tra JWT Key khớp giữa FE và BE" -ForegroundColor White
Write-Host "  3. Xem console log trong browser DevTools" -ForegroundColor White
Write-Host ""

