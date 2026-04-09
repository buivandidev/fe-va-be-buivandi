# Start Frontend Admin (Next.js) on port 3001
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force
$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   START FRONTEND ADMIN" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Stop old process on port 3001 (best-effort)
try {
  $processOnPort = Get-NetTCPConnection -LocalPort 3001 -State Listen -ErrorAction SilentlyContinue
  if ($processOnPort) {
    $processId = $processOnPort.OwningProcess
    Write-Host "Stopping old process on 3001 (PID: $processId)..." -ForegroundColor Yellow
    Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
  }
} catch {}

Set-Location "D:\febecuoiki\frontend"

# Detect backend base (prefer 5187)
$candidateBackends = @("http://localhost:5187", "http://localhost:5000")
$backendBase = $candidateBackends[0]
foreach ($candidate in $candidateBackends) {
  try {
    $res = Invoke-WebRequest -Uri "$candidate/swagger" -TimeoutSec 3 -ErrorAction Stop
    if ($res.StatusCode -ge 200 -and $res.StatusCode -lt 500) { $backendBase = $candidate; break }
  } catch {}
}

$env:NEXT_PUBLIC_API_BASE_URL = $backendBase
$env:API_BASE_URL = $backendBase

Write-Host ""
Write-Host "➜ Frontend Admin sẽ chạy tại:" -ForegroundColor Cyan
Write-Host "   http://localhost:3001" -ForegroundColor White
Write-Host "Frontend Admin se chay tai:" -ForegroundColor Cyan
Write-Host "http://localhost:3001" -ForegroundColor White
Write-Host ""
Write-Host "Nhấn Ctrl+C để dừng server" -ForegroundColor Gray
Write-Host "Nhan Ctrl+C de dung server" -ForegroundColor Gray
Write-Host ""

if (!(Test-Path "node_modules")) {
  Write-Host "Installing dependencies..." -ForegroundColor Yellow
  npm install
}

npm run dev -- -p 3001
