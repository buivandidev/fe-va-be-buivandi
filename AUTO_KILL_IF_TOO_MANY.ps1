# Script tự động kill Node.js nếu quá nhiều processes

param(
    [int]$Threshold = 20,
    [int]$CheckIntervalSeconds = 30
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "AUTO-KILL NODE.JS MONITOR" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Threshold: $Threshold processes" -ForegroundColor Yellow
Write-Host "Check interval: $CheckIntervalSeconds seconds" -ForegroundColor Gray
Write-Host ""
Write-Host "Script sẽ tự động kill nếu vượt ngưỡng" -ForegroundColor Red
Write-Host "Nhấn Ctrl+C để dừng" -ForegroundColor Gray
Write-Host ""

$killCount = 0

while ($true) {
    $time = Get-Date -Format "HH:mm:ss"
    $nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue
    $count = ($nodeProcesses | Measure-Object).Count
    
    if ($count -eq 0) {
        Write-Host "[$time] No processes running" -ForegroundColor Green
    } elseif ($count -gt $Threshold) {
        # EMERGENCY KILL
        $ram = [math]::Round(($nodeProcesses | Measure-Object -Property WorkingSet -Sum).Sum / 1MB, 2)
        
        Write-Host "[$time] ⚠ EMERGENCY: $count processes, ${ram}MB RAM!" -ForegroundColor Red
        Write-Host "         Auto-killing all Node.js processes..." -ForegroundColor Yellow
        
        try {
            Stop-Process -Name "node" -Force -ErrorAction Stop
            $killCount++
            
            Write-Host "         ✓ Killed $count processes (Total kills: $killCount)" -ForegroundColor Green
            
            # Log to file
            $logPath = "node-autokill.log"
            $logEntry = "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss'): Killed $count processes, ${ram}MB RAM"
            Add-Content $logPath $logEntry
            
            # Đợi processes dừng hẳn
            Start-Sleep -Seconds 3
            
            # Kiểm tra lại
            $remaining = (Get-Process -Name "node" -ErrorAction SilentlyContinue | Measure-Object).Count
            if ($remaining -gt 0) {
                Write-Host "         ⚠ Still $remaining processes remaining" -ForegroundColor Yellow
            } else {
                Write-Host "         ✓ All processes stopped" -ForegroundColor Green
            }
            
        } catch {
            Write-Host "         ✗ Error: $_" -ForegroundColor Red
        }
        
    } else {
        $ram = [math]::Round(($nodeProcesses | Measure-Object -Property WorkingSet -Sum).Sum / 1MB, 2)
        Write-Host "[$time] $count processes, ${ram}MB RAM - OK" -ForegroundColor Green
    }
    
    Start-Sleep -Seconds $CheckIntervalSeconds
}

