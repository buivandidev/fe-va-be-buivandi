# Script restart Frontend Người Dân
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "RESTART FRONTEND NGƯỜI DÂN" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Dừng tất cả process node
Write-Host "Đang dừng các process node..." -ForegroundColor Yellow
Stop-Process -Name "node" -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# Xóa cache Next.js
Write-Host "Đang xóa cache Next.js..." -ForegroundColor Yellow
if (Test-Path "frontend/nguoi-dan/.next") {
    Remove-Item -Path "frontend/nguoi-dan/.next" -Recurse -Force
    Write-Host "✓ Đã xóa cache" -ForegroundColor Green
}

Write-Host ""
Write-Host "Khởi động lại Frontend Người Dân..." -ForegroundColor Yellow
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd frontend/nguoi-dan; npm run dev -- --port 3001" -WindowStyle Normal

Write-Host ""
Write-Host "✓ Frontend Người Dân đang khởi động tại http://localhost:3001" -ForegroundColor Green
Write-Host ""
Write-Host "Nhấn Enter để đóng..." -ForegroundColor Gray
Read-Host
