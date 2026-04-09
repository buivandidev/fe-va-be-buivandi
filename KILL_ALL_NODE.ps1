# Script dừng TẤT CẢ Node.js processes

Write-Host "========================================" -ForegroundColor Red
Write-Host "DỪNG TẤT CẢ NODE.JS PROCESSES" -ForegroundColor Red
Write-Host "========================================" -ForegroundColor Red
Write-Host ""

# Đếm số processes
$nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue
$count = ($nodeProcesses | Measure-Object).Count

if ($count -eq 0) {
    Write-Host "Không có Node.js process nào đang chạy." -ForegroundColor Green
    exit 0
}

Write-Host "Tìm thấy $count Node.js process(es)" -ForegroundColor Yellow
Write-Host ""

# Hiển thị tổng RAM
$totalRAM = ($nodeProcesses | Measure-Object -Property WorkingSet -Sum).Sum / 1MB
Write-Host "Tổng RAM đang sử dụng: $([math]::Round($totalRAM, 2)) MB" -ForegroundColor Cyan
Write-Host ""

# Xác nhận
Write-Host "Bạn có chắc muốn dừng TẤT CẢ? (Y/N)" -NoNewline -ForegroundColor Yellow
$response = Read-Host

if ($response -ne "Y" -and $response -ne "y") {
    Write-Host "Đã hủy." -ForegroundColor Gray
    exit 0
}

Write-Host ""
Write-Host "Đang dừng tất cả Node.js processes..." -ForegroundColor Yellow

# Dừng tất cả
try {
    Stop-Process -Name "node" -Force -ErrorAction Stop
    Write-Host "✓ Đã dừng tất cả processes" -ForegroundColor Green
} catch {
    Write-Host "✗ Lỗi: $_" -ForegroundColor Red
    exit 1
}

# Đợi và kiểm tra
Start-Sleep -Seconds 2

$remaining = Get-Process -Name "node" -ErrorAction SilentlyContinue
if ($remaining) {
    $remainingCount = ($remaining | Measure-Object).Count
    Write-Host "⚠ Còn $remainingCount process(es) chưa dừng được" -ForegroundColor Yellow
    Write-Host "Thử lại..." -ForegroundColor Yellow
    
    Stop-Process -Name "node" -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
       
    $stillRemaining = Get-Process -Name "node" -ErrorAction SilentlyContinue
    if ($stillRemaining) {
        Write-Host "✗ Vẫn còn process chưa dừng được. Có thể cần restart máy." -ForegroundColor Red
    } else {
        Write-Host "✓ Đã dừng hết!" -ForegroundColor Green
    }
} else {
    Write-Host "✓ Tất cả Node.js processes đã được dừng" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "HOÀN TẤT" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

