# Script dừng tất cả servers
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Red
Write-Host "🛑 DỪNG TẤT CẢ SERVERS" -ForegroundColor Red
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Red
Write-Host ""

# Dừng Node.js processes (Frontend)
Write-Host "🔴 Đang dừng Node.js processes..." -ForegroundColor Yellow
$nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    $nodeProcesses | Stop-Process -Force
    Write-Host "  ✅ Đã dừng $($nodeProcesses.Count) Node.js process(es)" -ForegroundColor Green
} else {
    Write-Host "  ℹ️  Không có Node.js process nào đang chạy" -ForegroundColor Gray
}

# Dừng dotnet processes (Backend)
Write-Host ""
Write-Host "🔴 Đang dừng .NET processes..." -ForegroundColor Yellow
$dotnetProcesses = Get-Process -Name "dotnet" -ErrorAction SilentlyContinue
if ($dotnetProcesses) {
    $dotnetProcesses | Stop-Process -Force
    Write-Host "  ✅ Đã dừng $($dotnetProcesses.Count) .NET process(es)" -ForegroundColor Green
} else {
    Write-Host "  ℹ️  Không có .NET process nào đang chạy" -ForegroundColor Gray
}

# Dừng PhuongXa.API processes
Write-Host ""
Write-Host "🔴 Đang dừng PhuongXa.API processes..." -ForegroundColor Yellow
$apiProcesses = Get-Process -Name "PhuongXa.API" -ErrorAction SilentlyContinue
if ($apiProcesses) {
    $apiProcesses | Stop-Process -Force
    Write-Host "  ✅ Đã dừng $($apiProcesses.Count) API process(es)" -ForegroundColor Green
} else {
    Write-Host "  ℹ️  Không có API process nào đang chạy" -ForegroundColor Gray
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host "✅ ĐÃ DỪNG TẤT CẢ SERVERS!" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host ""
Write-Host "💡 Để khởi động lại, chạy: .\RESTART_ALL_CLEAN.ps1" -ForegroundColor Yellow
Write-Host ""
