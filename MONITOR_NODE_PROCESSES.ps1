# Script giám sát Node.js processes liên tục

param(
    [int]$IntervalSeconds = 10,
    [int]$WarningThreshold = 5,
    [int]$CriticalThreshold = 20
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "GIÁM SÁT NODE.JS PROCESSES" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Interval: $IntervalSeconds giây" -ForegroundColor Gray
Write-Host "Warning: >$WarningThreshold processes" -ForegroundColor Yellow
Write-Host "Critical: >$CriticalThreshold processes" -ForegroundColor Red
Write-Host ""
Write-Host "Nhấn Ctrl+C để dừng" -ForegroundColor Gray
Write-Host ""

$iteration = 0

while ($true) {
    $iteration++
    $time = Get-Date -Format "HH:mm:ss"
    
    # Đếm processes
    $nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue
    $count = ($nodeProcesses | Measure-Object).Count
    
    if ($count -eq 0) {
        Write-Host "[$time] #$iteration : " -NoNewline -ForegroundColor Gray
        Write-Host "0 processes" -ForegroundColor Green
    } else {
        # Tính RAM
        $totalRAM = ($nodeProcesses | Measure-Object -Property WorkingSet -Sum).Sum / 1MB
        $avgRAM = $totalRAM / $count
        
        # Màu sắc theo threshold
        $color = "Green"
        $status = "OK"
        
        if ($count -gt $CriticalThreshold) {
            $color = "Red"
            $status = "CRITICAL"
        } elseif ($count -gt $WarningThreshold) {
            $color = "Yellow"
            $status = "WARNING"
        }
        
        Write-Host "[$time] #$iteration : " -NoNewline -ForegroundColor Gray
        Write-Host "$count processes" -NoNewline -ForegroundColor $color
        Write-Host " | RAM: $([math]::Round($totalRAM, 1))MB" -NoNewline -ForegroundColor Cyan
        Write-Host " | Avg: $([math]::Round($avgRAM, 1))MB" -NoNewline -ForegroundColor Gray
        Write-Host " | $status" -ForegroundColor $color
        
        # Cảnh báo
        if ($count -gt $CriticalThreshold) {
            Write-Host "  ⚠ CRITICAL: Quá nhiều processes! Chạy: .\KILL_ALL_NODE.ps1" -ForegroundColor Red
        } elseif ($count -gt $WarningThreshold) {
            Write-Host "  ⚠ WARNING: Số processes cao hơn bình thường" -ForegroundColor Yellow
        }
    }
    
    Start-Sleep -Seconds $IntervalSeconds
}

