# Script fix CORS cho trang người dân

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "FIX CORS CHO TRANG NGƯỜI DÂN" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# BƯỚC 1: Kiểm tra config
Write-Host "BƯỚC 1: Kiểm tra cấu hình CORS..." -ForegroundColor Yellow

$configPath = "backend/phuongxa-api/src/PhuongXa.API/appsettings.Development.json"
$config = Get-Content $configPath | ConvertFrom-Json

$allowedOrigins = $config.Cors.AllowedOrigins

Write-Host "  Allowed Origins: $allowedOrigins" -ForegroundColor Cyan

if ($allowedOrigins -match "localhost:3001") {
    Write-Host "  ✓ localhost:3001 đã có trong config" -ForegroundColor Green
} else {
    Write-Host "  ✗ localhost:3001 CHƯA có trong config" -ForegroundColor Red
    Write-Host "  Đang thêm..." -ForegroundColor Yellow
    
    # Thêm localhost:3001
    $origins = $allowedOrigins -split ","
    if ($origins -notcontains "http://localhost:3001") {
        $origins += "http://localhost:3001"
        $config.Cors.AllowedOrigins = ($origins -join ",")
        $config | ConvertTo-Json -Depth 10 | Set-Content $configPath
        Write-Host "  ✓ Đã thêm localhost:3001" -ForegroundColor Green
    }
}

Write-Host ""

# BƯỚC 2: Restart Backend
Write-Host "BƯỚC 2: Restart Backend để áp dụng config..." -ForegroundColor Yellow

$backendProcess = Get-Process -Name "PhuongXa.API" -ErrorAction SilentlyContinue

if ($backendProcess) {
    Write-Host "  Đang dừng Backend (PID: $($backendProcess.Id))..." -ForegroundColor Gray
    Stop-Process -Id $backendProcess.Id -Force
    Start-Sleep -Seconds 3
    Write-Host "  ✓ Đã dừng Backend" -ForegroundColor Green
} else {
    Write-Host "  ℹ Backend không chạy" -ForegroundColor Gray
}

Write-Host ""
Write-Host "  Đang khởi động Backend..." -ForegroundColor Gray
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd backend/phuongxa-api; `$env:ASPNETCORE_ENVIRONMENT='Development'; dotnet run --project src/PhuongXa.API" -WindowStyle Normal

Write-Host "  ✓ Backend đang khởi động..." -ForegroundColor Green
Write-Host "  Đợi 10 giây..." -ForegroundColor Gray
Start-Sleep -Seconds 10

Write-Host ""

# BƯỚC 3: Test CORS
Write-Host "BƯỚC 3: Test CORS từ localhost:3001..." -ForegroundColor Yellow

try {
    $headers = @{
        "Origin" = "http://localhost:3001"
    }
    
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/media/albums" -Method GET -Headers $headers -ErrorAction Stop
    
    $corsHeader = $response.Headers["Access-Control-Allow-Origin"]
    
    if ($corsHeader) {
        Write-Host "  ✓ CORS Header: $corsHeader" -ForegroundColor Green
        
        if ($corsHeader -eq "http://localhost:3001" -or $corsHeader -eq "*") {
            Write-Host "  ✓ CORS đã hoạt động!" -ForegroundColor Green
        } else {
            Write-Host "  ⚠ CORS header không khớp" -ForegroundColor Yellow
        }
    } else {
        Write-Host "  ✗ Không có CORS header" -ForegroundColor Red
        Write-Host "  Backend có thể chưa khởi động xong" -ForegroundColor Yellow
    }
} catch {
    Write-Host "  ⚠ Không thể test: $($_.Exception.Message)" -ForegroundColor Yellow
    Write-Host "  Backend có thể chưa sẵn sàng" -ForegroundColor Gray
}

Write-Host ""

# BƯỚC 4: Restart Frontend Người Dân
Write-Host "BƯỚC 4: Restart Frontend Người Dân..." -ForegroundColor Yellow

# Tìm Node.js process đang chạy trên port 3001
$nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue

if ($nodeProcesses) {
    Write-Host "  Tìm thấy $($nodeProcesses.Count) Node.js process(es)" -ForegroundColor Gray
    Write-Host "  Đang dừng tất cả..." -ForegroundColor Gray
    Stop-Process -Name "node" -Force
    Start-Sleep -Seconds 3
    Write-Host "  ✓ Đã dừng Node.js" -ForegroundColor Green
}

Write-Host ""
Write-Host "  Xóa cache .next..." -ForegroundColor Gray
if (Test-Path "frontend/nguoi-dan/.next") {
    Remove-Item -Recurse -Force "frontend/nguoi-dan/.next"
    Write-Host "  ✓ Đã xóa cache" -ForegroundColor Green
}

Write-Host ""
Write-Host "  Đang khởi động Frontend Người Dân..." -ForegroundColor Gray
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd frontend/nguoi-dan; `$env:NODE_OPTIONS='--max-old-space-size=1024'; `$env:NEXT_TELEMETRY_DISABLED='1'; npm run dev -- --port 3001" -WindowStyle Normal

Write-Host "  ✓ Frontend Người Dân đang khởi động..." -ForegroundColor Green

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "HOÀN TẤT!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Đợi 15 giây để services khởi động..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

Write-Host ""
Write-Host "Kiểm tra lại:" -ForegroundColor White
Write-Host "  1. Mở: http://localhost:3001" -ForegroundColor Cyan
Write-Host "  2. Mở DevTools Console (F12)" -ForegroundColor Cyan
Write-Host "  3. Kiểm tra không còn lỗi CORS" -ForegroundColor Cyan
Write-Host ""

Write-Host "Nếu vẫn lỗi:" -ForegroundColor Yellow
Write-Host "  1. Hard refresh: Ctrl+Shift+R" -ForegroundColor White
Write-Host "  2. Clear cache và reload" -ForegroundColor White
Write-Host "  3. Kiểm tra backend logs" -ForegroundColor White
Write-Host ""

