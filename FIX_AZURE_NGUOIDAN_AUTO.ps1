# Script tự động fix các vấn đề Azure cho Frontend Người Dân
param(
    [switch]$SkipRebuild,
    [switch]$CheckOnly
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host " FIX AZURE FRONTEND NGƯỜI DÂN" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$ErrorActionPreference = "Continue"

# 1. Kiểm tra .env
Write-Host "`n[1/6] Kiểm tra file .env..." -ForegroundColor Yellow
$envPath = "frontend/nguoi-dan/.env"

if (!(Test-Path $envPath)) {
    Write-Host "  ✗ Không tìm thấy .env file!" -ForegroundColor Red
    Write-Host "  → Copy từ .env.example và cấu hình" -ForegroundColor Yellow
    exit 1
}

$envContent = Get-Content $envPath -Raw
Write-Host "  Nội dung .env:" -ForegroundColor Cyan
Write-Host $envContent -ForegroundColor Gray

if ($envContent -match "localhost") {
    Write-Host "  ⚠ WARNING: .env có localhost - cần đổi sang Azure URL!" -ForegroundColor Red
    Write-Host "  → Sửa NEXT_PUBLIC_API_BASE_URL thành Azure backend URL" -ForegroundColor Yellow
} else {
    Write-Host "  ✓ .env không có localhost" -ForegroundColor Green
}

# Extract API URL
if ($envContent -match 'NEXT_PUBLIC_API_BASE_URL=(.+)') {
    $apiUrl = $matches[1].Trim()
    Write-Host "  API URL: $apiUrl" -ForegroundColor Cyan
} else {
    Write-Host "  ✗ Không tìm thấy NEXT_PUBLIC_API_BASE_URL!" -ForegroundColor Red
    exit 1
}

# 2. Kiểm tra Backend CORS
Write-Host "`n[2/6] Kiểm tra Backend CORS..." -ForegroundColor Yellow
$appsettingsPath = "backend/phuongxa-api/src/PhuongXa.API/appsettings.Production.json"

if (Test-Path $appsettingsPath) {
    $appsettings = Get-Content $appsettingsPath -Raw | ConvertFrom-Json
    
    if ($appsettings.AllowedOrigins) {
        Write-Host "  AllowedOrigins hiện tại:" -ForegroundColor Cyan
        $appsettings.AllowedOrigins | ForEach-Object { Write-Host "    - $_" -ForegroundColor Gray }
        
        # Kiểm tra có frontend URL không
        $hasNguoidanUrl = $false
        foreach ($origin in $appsettings.AllowedOrigins) {
            if ($origin -match "nguoi.*dan" -or $origin -match "citizen" -or $origin -match "public") {
                $hasNguoidanUrl = $true
                break
            }
        }
        
        if (!$hasNguoidanUrl) {
            Write-Host "  ⚠ WARNING: Chưa có URL frontend người dân trong AllowedOrigins!" -ForegroundColor Red
            Write-Host "  → Cần thêm URL Azure frontend vào AllowedOrigins" -ForegroundColor Yellow
        } else {
            Write-Host "  ✓ Có URL frontend trong AllowedOrigins" -ForegroundColor Green
        }
    } else {
        Write-Host "  ⚠ WARNING: Không tìm thấy AllowedOrigins!" -ForegroundColor Red
    }
} else {
    Write-Host "  ⚠ Không tìm thấy appsettings.Production.json" -ForegroundColor Yellow
}

# 3. Kiểm tra next.config.ts
Write-Host "`n[3/6] Kiểm tra next.config.ts..." -ForegroundColor Yellow
$nextConfigPath = "frontend/nguoi-dan/next.config.ts"

if (Test-Path $nextConfigPath) {
    $nextConfig = Get-Content $nextConfigPath -Raw
    
    # Kiểm tra output: standalone
    if ($nextConfig -match 'output:\s*"standalone"' -or $nextConfig -match "output:\s*'standalone'") {
        Write-Host "  ✓ output: 'standalone' OK" -ForegroundColor Green
    } else {
        Write-Host "  ✗ Thiếu output: 'standalone'!" -ForegroundColor Red
    }
    
    # Kiểm tra remotePatterns có Azure backend không
    if ($nextConfig -match "project-api-phuongxa.*azurewebsites\.net") {
        Write-Host "  ✓ remotePatterns có Azure backend" -ForegroundColor Green
    } else {
        Write-Host "  ⚠ WARNING: remotePatterns chưa có Azure backend hostname!" -ForegroundColor Red
        Write-Host "  → Ảnh từ backend sẽ không load được" -ForegroundColor Yellow
    }
} else {
    Write-Host "  ✗ Không tìm thấy next.config.ts!" -ForegroundColor Red
}

# 4. Test API connectivity
Write-Host "`n[4/6] Test kết nối API..." -ForegroundColor Yellow
try {
    $testUrl = "$apiUrl/api/public/homepage"
    Write-Host "  Testing: $testUrl" -ForegroundColor Cyan
    
    $response = Invoke-WebRequest -Uri $testUrl -Method GET -TimeoutSec 10 -UseBasicParsing
    
    if ($response.StatusCode -eq 200) {
        Write-Host "  ✓ API backend hoạt động OK (200)" -ForegroundColor Green
    } else {
        Write-Host "  ⚠ API trả về status: $($response.StatusCode)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "  ✗ Không thể kết nối API: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "  → Kiểm tra backend có đang chạy không" -ForegroundColor Yellow
}

# 5. Kiểm tra build output
Write-Host "`n[5/6] Kiểm tra build output..." -ForegroundColor Yellow
$standalonePath = "frontend/nguoi-dan/.next/standalone"

if (Test-Path $standalonePath) {
    Write-Host "  ✓ Standalone folder tồn tại" -ForegroundColor Green
    
    # Kiểm tra các file cần thiết
    $requiredFiles = @("server.js", "package.json", ".next", "public")
    foreach ($file in $requiredFiles) {
        $filePath = Join-Path $standalonePath $file
        if (Test-Path $filePath) {
            Write-Host "  ✓ $file OK" -ForegroundColor Green
        } else {
            Write-Host "  ✗ Thiếu $file!" -ForegroundColor Red
        }
    }
    
    # Kiểm tra sharp binary Windows
    $sharpPath = Join-Path $standalonePath "node_modules/sharp"
    if (Test-Path $sharpPath) {
        $winBinary = Get-ChildItem -Path $sharpPath -Recurse -Filter "*win32*.node" -ErrorAction SilentlyContinue
        if ($winBinary) {
            Write-Host "  ⚠ WARNING: Tìm thấy sharp binary Windows!" -ForegroundColor Red
            Write-Host "  → Sẽ crash trên Azure Linux" -ForegroundColor Yellow
        } else {
            Write-Host "  ✓ Không có sharp binary Windows" -ForegroundColor Green
        }
    } else {
        Write-Host "  ✓ Sharp không có trong standalone (OK)" -ForegroundColor Green
    }
} else {
    Write-Host "  ⚠ Chưa build - chạy build-for-azure.ps1 trước" -ForegroundColor Yellow
}

# 6. Rebuild nếu cần
if (!$CheckOnly -and !$SkipRebuild) {
    Write-Host "`n[6/6] Rebuild với .env đúng..." -ForegroundColor Yellow
    
    $confirm = Read-Host "Bạn có muốn rebuild không? (y/n)"
    if ($confirm -eq 'y') {
        Write-Host "  → Xóa build cũ..." -ForegroundColor Cyan
        Remove-Item -Path "frontend/nguoi-dan/.next" -Recurse -Force -ErrorAction SilentlyContinue
        
        Write-Host "  → Chạy build-for-azure.ps1..." -ForegroundColor Cyan
        & .\build-for-azure.ps1
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "  ✓ Rebuild thành công!" -ForegroundColor Green
        } else {
            Write-Host "  ✗ Rebuild thất bại!" -ForegroundColor Red
        }
    } else {
        Write-Host "  → Bỏ qua rebuild" -ForegroundColor Yellow
    }
} else {
    Write-Host "`n[6/6] Bỏ qua rebuild (dùng -SkipRebuild hoặc -CheckOnly)" -ForegroundColor Yellow
}

# Tổng kết
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host " TỔNG KẾT" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

Write-Host "`nCác bước tiếp theo:" -ForegroundColor Yellow
Write-Host "1. Nếu .env có localhost → Sửa thành Azure URL và rebuild" -ForegroundColor White
Write-Host "2. Nếu CORS warning → Thêm frontend URL vào appsettings.Production.json" -ForegroundColor White
Write-Host "3. Nếu remotePatterns warning → Thêm Azure backend vào next.config.ts" -ForegroundColor White
Write-Host "4. Deploy file ZIP mới lên Azure" -ForegroundColor White
Write-Host "5. Cấu hình Azure App Service:" -ForegroundColor White
Write-Host "   - Application Settings: NEXT_PUBLIC_API_BASE_URL" -ForegroundColor Gray
Write-Host "   - Startup Command: node server.js" -ForegroundColor Gray
Write-Host "   - Stack: Node 20 LTS" -ForegroundColor Gray
Write-Host "6. Restart App Service" -ForegroundColor White
Write-Host "7. Kiểm tra Kudu logs nếu có lỗi" -ForegroundColor White

Write-Host "`nTham khảo: FIX_AZURE_NGUOIDAN_PLAN.md" -ForegroundColor Cyan
