param(
    [string]$OutDir = "deploy_out_final"
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host " TỰ ĐỘNG ĐÓNG GÓI MÃ NGUỒN CHO AZURE" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# 1. Chuẩn bị thư mục chứa kết quả
if (Test-Path $OutDir) { Remove-Item -Path $OutDir -Recurse -Force }
New-Item -ItemType Directory -Force -Path $OutDir | Out-Null
$FullOutDir = [System.IO.Path]::GetFullPath((Join-Path (Get-Location) $OutDir))
if (!(Test-Path $FullOutDir)) { New-Item -ItemType Directory -Force -Path $FullOutDir | Out-Null }

$BackendZip = Join-Path $FullOutDir "backend-api.zip"
$AdminZip = Join-Path $FullOutDir "frontend-admin.zip"
$CitizenZip = Join-Path $FullOutDir "frontend-nguoidan.zip"

# ==========================================
# 2. Build Backend (.NET 8/9 API)
# ==========================================
Write-Host "`n[1/3] Đang biên dịch Backend API..." -ForegroundColor Yellow
$BackendProj = "backend/phuongxa-api/src/PhuongXa.API/PhuongXa.API.csproj"
$BackendBuildDir = "out-backend"
$publishDir = Join-Path (Get-Location) $BackendBuildDir

if (Test-Path $BackendBuildDir) { Remove-Item -Path $BackendBuildDir -Recurse -Force }
dotnet publish $BackendProj -c Release -o $BackendBuildDir --nologo -v q
if ($LASTEXITCODE -ne 0) { Write-Host "Lỗi build Backend!" -ForegroundColor Red; exit }

# Zip contents correctly
Write-Host "  -> Đóng gói $BackendZip..." -ForegroundColor Cyan
Set-Location $publishDir
Compress-Archive -Path * -DestinationPath "$BackendZip" -Force
Set-Location $PSScriptRoot
Remove-Item -Path $BackendBuildDir -Recurse -Force
Write-Host "-> Hoàn tất! File xuất ra ở: $BackendZip" -ForegroundColor Green


# ==========================================
# 3. Build Frontend Admin (Next.js Standalone)
# ==========================================
Write-Host "`n[2/3] Đang biên dịch Frontend Admin..." -ForegroundColor Yellow
Set-Location "$PSScriptRoot/frontend"
npm install
$env:NODE_OPTIONS = "--max-old-space-size=2048"
npm run build
if ($LASTEXITCODE -ne 0) { Write-Host "Lỗi build Frontend Admin!" -ForegroundColor Red; Set-Location $PSScriptRoot; exit }

# Azure Standalone Setup - Copy assets vào đúng vị trí
Write-Host "  -> Đang chuẩn bị standalone output..." -ForegroundColor Cyan

if (Test-Path "public") {
    Copy-Item -Path "public" -Destination ".next/standalone/public" -Recurse -Force
}

if (Test-Path ".next/static") {
    $staticDest = ".next/standalone/.next/static"
    if (!(Test-Path $staticDest)) { New-Item -ItemType Directory -Force -Path $staticDest | Out-Null }
    Copy-Item -Path ".next/static" -Destination ".next/standalone/.next/static" -Recurse -Force
}

if (Test-Path ".env") {
    Copy-Item -Path ".env" -Destination ".next/standalone/.env" -Force
}

Copy-Item -Path "package.json" -Destination ".next/standalone/package.json" -Force

# CRITICAL: Sửa lỗi subfolder nếu có (thường xảy ra với workspace)
if (Test-Path ".next/standalone/frontend") {
    Write-Host "  -> Cấu trúc subfolder phát hiện, đang tối ưu..." -ForegroundColor Cyan
    Copy-Item -Path ".next/standalone/frontend/*" -Destination ".next/standalone" -Recurse -Force
    Remove-Item -Path ".next/standalone/frontend" -Recurse -Force
}

# Xóa sharp binary Windows để tránh crash trên Azure Linux
Write-Host "  -> Đang dọn binary Windows và cache..." -ForegroundColor Cyan
Remove-Item -Recurse -Force ".next/standalone/node_modules/sharp" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force ".next/standalone/node_modules/@img" -ErrorAction SilentlyContinue

Set-Location ".next/standalone"
Compress-Archive -Path "*" -DestinationPath "$AdminZip" -Force
Set-Location $PSScriptRoot
Write-Host "-> Hoàn tất! File xuất ra ở: $AdminZip" -ForegroundColor Green


# ==========================================
# 4. Build Frontend Người Dân (Next.js Standalone)
# ==========================================
Write-Host "`n[3/3] Đang biên dịch Frontend Công Dân..." -ForegroundColor Yellow
Set-Location "$PSScriptRoot/frontend/nguoi-dan"
npm install
$env:NODE_OPTIONS = "--max-old-space-size=2048"
npm run build
if ($LASTEXITCODE -ne 0) { Write-Host "Lỗi build Frontend Người Dân!" -ForegroundColor Red; Set-Location $PSScriptRoot; exit }

Write-Host "  -> Đang chuẩn bị standalone output..." -ForegroundColor Cyan

# Bước quan trọng: Next.js đôi khi để app trong thư mục con
if (Test-Path ".next/standalone/frontend/nguoi-dan") {
    Copy-Item -Path ".next/standalone/frontend/nguoi-dan/*" -Destination ".next/standalone" -Recurse -Force
    Remove-Item -Path ".next/standalone/frontend" -Recurse -Force
}
elseif (Test-Path ".next/standalone/nguoi-dan") {
    Copy-Item -Path ".next/standalone/nguoi-dan/*" -Destination ".next/standalone" -Recurse -Force
    Remove-Item -Path ".next/standalone/nguoi-dan" -Recurse -Force
}

# Bây giờ copy Assets vào root của standalone
if (Test-Path "public") {
    Copy-Item -Path "public" -Destination ".next/standalone/public" -Recurse -Force
}

if (Test-Path ".next/static") {
    $staticDest = ".next/standalone/.next/static"
    if (!(Test-Path $staticDest)) { New-Item -ItemType Directory -Force -Path $staticDest | Out-Null }
    Copy-Item -Path ".next/static/*" -Destination $staticDest -Recurse -Force
}

if (Test-Path ".env") {
    Copy-Item -Path ".env" -Destination ".next/standalone/.env" -Force
}

Copy-Item -Path "package.json" -Destination ".next/standalone/package.json" -Force

# Xóa sharp binary Windows
Write-Host "  -> Đang dọn binary Windows..." -ForegroundColor Cyan
Remove-Item -Recurse -Force ".next/standalone/node_modules/sharp" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force ".next/standalone/node_modules/@img" -ErrorAction SilentlyContinue

# Đóng gói standalone
Write-Host "  -> Đóng gói $CitizenZip..." -ForegroundColor Cyan
Set-Location ".next/standalone"
Compress-Archive -Path "*" -DestinationPath "$CitizenZip" -Force
Set-Location $PSScriptRoot
Write-Host "-> Hoàn tất! File xuất ra ở: $CitizenZip" -ForegroundColor Green


Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "🎉 CHUẨN BỊ XONG! 3 FILE .ZIP DEPLOY ĐÃ SẴN SÀNG TRONG THƯ MỤC '$OutDir'." -ForegroundColor Green
Write-Host "Bây giờ bạn có thể dùng DEPLOY_TO_AZURE_AUTO.ps1 hoặc kéo-thả vào Kudu." -ForegroundColor Yellow
Write-Host "Lưu ý: Trên Azure App Service, hãy set Application Setting:" -ForegroundColor Cyan
Write-Host "  NODE_OPTIONS = --max-old-space-size=512" -ForegroundColor White
Write-Host "  WEBSITE_NODE_DEFAULT_VERSION = 20-lts" -ForegroundColor White
Write-Host "  Startup Command: node server.js" -ForegroundColor White
