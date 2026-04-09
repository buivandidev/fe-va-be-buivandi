# Script to run the backend API
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "        KHOI DONG BACKEND API" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$projectPath = "D:\febecuoiki\backend\phuongxa-api\src\PhuongXa.API\PhuongXa.API.csproj"

# Dung cac process backend cu de tranh lock file khi build
$backendProcIds = @()
try {
    $backendProcIds += (Get-Process -Name "PhuongXa.API" -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Id)
} catch {}

try {
    $backendProcIds += (Get-CimInstance Win32_Process -Filter "Name = 'dotnet.exe'" -ErrorAction SilentlyContinue |
        Where-Object { $_.CommandLine -like "*PhuongXa.API.csproj*" -or $_.CommandLine -like "*PhuongXa.API.dll*" } |
        Select-Object -ExpandProperty ProcessId)
} catch {}

$backendProcIds = $backendProcIds | Where-Object { $_ } | Select-Object -Unique
foreach ($pidToStop in $backendProcIds) {
    try {
        Write-Host "Dang dung backend cu (PID: $pidToStop)..." -ForegroundColor Yellow
        Stop-Process -Id $pidToStop -Force -ErrorAction Stop
    } catch {}
}
if ($backendProcIds.Count -gt 0) { Start-Sleep -Seconds 1 }

$env:ASPNETCORE_ENVIRONMENT = "Development"
$env:DOTNET_ENVIRONMENT = "Development"
$env:ASPNETCORE_URLS = "http://localhost:5187;https://localhost:7067"
$env:DefaultAdmin__Email = "admin@phuongxa.vn"
$env:DefaultAdmin__Password = "123"

Write-Host "Backend URL:  http://localhost:5187" -ForegroundColor Green
Write-Host "Swagger URL:  http://localhost:5187/swagger" -ForegroundColor Green
Write-Host ""

dotnet run --project $projectPath
