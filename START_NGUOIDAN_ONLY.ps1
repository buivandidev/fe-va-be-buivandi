# Script khởi động chỉ Frontend Người Dân
# Chạy: .\START_NGUOIDAN_ONLY.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "KHỞI ĐỘNG FRONTEND NGƯỜI DÂN" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Dừng node processes
Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object { $_.Path -like "*nguoi-dan*" } | Stop-Process -Force
Start-Sleep -Seconds 2

# Thiết lập biến môi trường
$env:NODE_OPTIONS = "--max-old-space-size=1024"
$env:NEXT_TELEMETRY_DISABLED = "1"

# Khởi động Frontend Người Dân
Write-Host "Khởi động Frontend Người Dân (giới hạn RAM: 1GB)..." -ForegroundColor Yellow
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd frontend/nguoi-dan; `$env:NODE_OPTIONS='--max-old-space-size=1024'; `$env:NEXT_TELEMETRY_DISABLED='1'; npm run dev -- --port 3001" -WindowStyle Normal
Write-Host "✓ Frontend Người Dân đang khởi động..." -ForegroundColor Green

Start-Sleep -Seconds 15

Write-Host ""
Write-Host "Kiểm tra trạng thái..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3001" -Method Get -TimeoutSec 15
    if ($response.StatusCode -eq 200) {
        Write-Host "✓ Frontend Người Dân đang chạy!" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠ Frontend đang khởi động, vui lòng đợi..." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Frontend Người Dân: http://localhost:3001" -ForegroundColor Cyan
Write-Host "Đăng nhập:          http://localhost:3001/dang-nhap" -ForegroundColor Cyan
Write-Host "Đăng ký:            http://localhost:3001/dang-ky" -ForegroundColor Cyan
Write-Host ""
