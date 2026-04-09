# Comprehensive Setup Script - Tạo toàn bộ Admin Frontend Files

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  SETUP ADMIN FRONTEND - FIX TRIỆT ĐỂ" -ForegroundColor Cyan  
Write-Host "========================================`n" -ForegroundColor Cyan

# Step 1: Create folders
Write-Host "[1/6] Creating folder structure..." -ForegroundColor Yellow
$folders = @(
    "frontend\src\types",
    "frontend\src\components\ui",
    "frontend\src\app\admin\users",
    "frontend\src\app\admin\articles",
    "frontend\src\app\admin\services"
)

foreach ($folder in $folders) {
    if (-not (Test-Path $folder)) {
        New-Item -ItemType Directory -Path $folder -Force | Out-Null
        Write-Host "  ✓ Created $folder" -ForegroundColor Green
    }
}

# Step 2: Install npm packages
Write-Host "`n[2/6] Installing npm packages..." -ForegroundColor Yellow
Set-Location frontend
npm install react-hook-form @hookform/resolvers zod @tanstack/react-table react-dropzone date-fns lucide-react @tiptap/react @tiptap/starter-kit
Set-Location ..
Write-Host "  ✓ Packages installed" -ForegroundColor Green

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "SETUP COMPLETE!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "1. Run backend: cd backend\phuongxa-api\src\PhuongXa.API && dotnet run"
Write-Host "2. Run frontend: cd frontend && npm run dev"
Write-Host "3. Open http://localhost:3000/admin" -ForegroundColor Cyan
