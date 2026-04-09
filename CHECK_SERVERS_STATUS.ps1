# Script kiểm tra trạng thái servers
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "📊 KIỂM TRA TRẠNG THÁI SERVERS" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Kiểm tra Node.js (Frontend)
Write-Host "🔍 Node.js Processes (Frontend):" -ForegroundColor Yellow
$nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    Write-Host "  ✅ Đang chạy: $($nodeProcesses.Count) process(es)" -ForegroundColor Green
    $nodeProcesses | ForEach-Object {
        Write-Host "     - PID: $($_.Id) | CPU: $([math]::Round($_.CPU, 2))s | Memory: $([math]::Round($_.WorkingSet64 / 1MB, 2)) MB" -ForegroundColor Gray
    }
} else {
    Write-Host "  ❌ Không có Node.js process nào" -ForegroundColor Red
}

Write-Host ""

# Kiểm tra .NET (Backend)
Write-Host "🔍 .NET Processes (Backend):" -ForegroundColor Yellow
$dotnetProcesses = Get-Process -Name "dotnet" -ErrorAction SilentlyContinue
if ($dotnetProcesses) {
    Write-Host "  ✅ Đang chạy: $($dotnetProcesses.Count) process(es)" -ForegroundColor Green
    $dotnetProcesses | ForEach-Object {
        Write-Host "     - PID: $($_.Id) | CPU: $([math]::Round($_.CPU, 2))s | Memory: $([math]::Round($_.WorkingSet64 / 1MB, 2)) MB" -ForegroundColor Gray
    }
} else {
    Write-Host "  ❌ Không có .NET process nào" -ForegroundColor Red
}

Write-Host ""

# Kiểm tra ports
Write-Host "🔍 Kiểm tra Ports:" -ForegroundColor Yellow

function Test-Port {
    param($Port, $Name)
    try {
        $connection = Test-NetConnection -ComputerName localhost -Port $Port -WarningAction SilentlyContinue -ErrorAction SilentlyContinue
        if ($connection.TcpTestSucceeded) {
            Write-Host "  ✅ Port $Port ($Name): ĐANG HOẠT ĐỘNG" -ForegroundColor Green
            return $true
        } else {
            Write-Host "  ❌ Port $Port ($Name): KHÔNG HOẠT ĐỘNG" -ForegroundColor Red
            return $false
        }
    } catch {
        Write-Host "  ❌ Port $Port ($Name): KHÔNG HOẠT ĐỘNG" -ForegroundColor Red
        return $false
    }
}

$port5000 = Test-Port -Port 5000 -Name "Backend API"
$port3000 = Test-Port -Port 3000 -Name "Frontend Admin"
$port3001 = Test-Port -Port 3001 -Name "Frontend Người Dân"

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "📋 TÓM TẮT:" -ForegroundColor White
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

if ($port5000) {
    Write-Host "  🔴 Backend API:          http://localhost:5000 ✅" -ForegroundColor Green
} else {
    Write-Host "  🔴 Backend API:          http://localhost:5000 ❌" -ForegroundColor Red
}

if ($port3000) {
    Write-Host "  🔵 Frontend Admin:       http://localhost:3000 ✅" -ForegroundColor Green
} else {
    Write-Host "  🔵 Frontend Admin:       http://localhost:3000 ❌" -ForegroundColor Red
}

if ($port3001) {
    Write-Host "  🟢 Frontend Người Dân:   http://localhost:3001 ✅" -ForegroundColor Green
} else {
    Write-Host "  🟢 Frontend Người Dân:   http://localhost:3001 ❌" -ForegroundColor Red
}

Write-Host ""

$allRunning = $port5000 -and $port3000 -and $port3001
if ($allRunning) {
    Write-Host "🎉 TẤT CẢ SERVICES ĐANG HOẠT ĐỘNG!" -ForegroundColor Green
} else {
    Write-Host "⚠️  MỘT SỐ SERVICES CHƯA HOẠT ĐỘNG" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "💡 Để khởi động lại: .\RESTART_ALL_CLEAN.ps1" -ForegroundColor Yellow
}

Write-Host ""
