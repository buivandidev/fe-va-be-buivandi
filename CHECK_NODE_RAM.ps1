# Script kiểm tra RAM usage của Node.js processes

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "KIỂM TRA RAM CỦA NODE.JS PROCESSES" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Lấy tất cả Node.js processes
$nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue

if ($nodeProcesses) {
    Write-Host "Tìm thấy $($nodeProcesses.Count) Node.js process(es):" -ForegroundColor Yellow
    Write-Host ""
    
    # Hiển thị thông tin chi tiết
    $nodeProcesses | ForEach-Object {
        $ramMB = [math]::Round($_.WorkingSet / 1MB, 2)
        $virtualMB = [math]::Round($_.VirtualMemorySize / 1MB, 2)
        
        Write-Host "Process ID: $($_.Id)" -ForegroundColor White
        Write-Host "  RAM Usage:     $ramMB MB" -ForegroundColor $(if ($ramMB -gt 1024) { "Red" } elseif ($ramMB -gt 800) { "Yellow" } else { "Green" })
        Write-Host "  Virtual Mem:   $virtualMB MB" -ForegroundColor Gray
        Write-Host "  CPU Time:      $($_.TotalProcessorTime)" -ForegroundColor Gray
        Write-Host ""
    }
    
    # Tính tổng RAM
    $totalRAM = ($nodeProcesses | Measure-Object -Property WorkingSet -Sum).Sum / 1MB
    Write-Host "Tổng RAM sử dụng: $([math]::Round($totalRAM, 2)) MB" -ForegroundColor Cyan
    
    # Cảnh báo nếu RAM cao
    if ($totalRAM -gt 2048) {
        Write-Host ""
        Write-Host "⚠ CẢNH BÁO: RAM usage cao!" -ForegroundColor Red
        Write-Host "Khuyến nghị: Restart các Node.js processes" -ForegroundColor Yellow
    } elseif ($totalRAM -gt 1536) {
        Write-Host ""
        Write-Host "⚠ Lưu ý: RAM usage hơi cao" -ForegroundColor Yellow
    } else {
        Write-Host ""
        Write-Host "✓ RAM usage ở mức bình thường" -ForegroundColor Green
    }
    
} else {
    Write-Host "Không tìm thấy Node.js process nào đang chạy." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "KIỂM TRA CẤU HÌNH" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Kiểm tra biến môi trường
Write-Host "NODE_OPTIONS: " -NoNewline
if ($env:NODE_OPTIONS) {
    Write-Host "$env:NODE_OPTIONS" -ForegroundColor Green
} else {
    Write-Host "Chưa được đặt" -ForegroundColor Yellow
}

Write-Host "NEXT_TELEMETRY_DISABLED: " -NoNewline
if ($env:NEXT_TELEMETRY_DISABLED) {
    Write-Host "$env:NEXT_TELEMETRY_DISABLED" -ForegroundColor Green
} else {
    Write-Host "Chưa được đặt" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Kiểm tra .env.local files:" -ForegroundColor White

# Kiểm tra Frontend Admin
if (Test-Path "frontend/.env.local") {
    Write-Host "  ✓ frontend/.env.local" -ForegroundColor Green
} else {
    Write-Host "  ✗ frontend/.env.local (không tồn tại)" -ForegroundColor Red
}

# Kiểm tra Frontend Người Dân
if (Test-Path "frontend/nguoi-dan/.env.local") {
    Write-Host "  ✓ frontend/nguoi-dan/.env.local" -ForegroundColor Green
} else {
    Write-Host "  ✗ frontend/nguoi-dan/.env.local (không tồn tại)" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "HƯỚNG DẪN" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Để giới hạn RAM cho Node.js:" -ForegroundColor White
Write-Host "  1. Sử dụng script: .\START_ALL_SERVERS.ps1" -ForegroundColor Cyan
Write-Host "  2. Hoặc đặt biến môi trường:" -ForegroundColor Cyan
Write-Host "     `$env:NODE_OPTIONS='--max-old-space-size=1024'" -ForegroundColor Gray
Write-Host ""
Write-Host "Để dừng tất cả Node.js processes:" -ForegroundColor White
Write-Host "  Stop-Process -Name node -Force" -ForegroundColor Gray
Write-Host ""

