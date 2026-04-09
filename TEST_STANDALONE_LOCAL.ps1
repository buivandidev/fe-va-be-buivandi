# Script test standalone build local trước khi deploy Azure
param(
    [ValidateSet('admin', 'nguoidan', 'all')]
    [string]$Target = 'all'
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host " TEST STANDALONE BUILD LOCAL" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

function Test-AdminStandalone {
    Write-Host "`n[TEST] Frontend Admin Standalone..." -ForegroundColor Yellow
    
    Set-Location "frontend"
    
    # Build
    Write-Host "  -> Building..." -ForegroundColor Cyan
    npm run build
    if ($LASTEXITCODE -ne 0) { 
        Write-Host "  ✗ Build failed!" -ForegroundColor Red
        Set-Location ".."
        return $false
    }
    
    # Kiểm tra cấu trúc
    Write-Host "  -> Checking structure..." -ForegroundColor Cyan
    $requiredFiles = @(
        ".next/standalone/server.js",
        ".next/standalone/node_modules",
        ".next/standalone/.next",
        ".next/standalone/public"
    )
    
    $allExist = $true
    foreach ($file in $requiredFiles) {
        if (!(Test-Path $file)) {
            Write-Host "  ✗ Missing: $file" -ForegroundColor Red
            $allExist = $false
        } else {
            Write-Host "  ✓ Found: $file" -ForegroundColor Green
        }
    }
    
    if (!$allExist) {
        Set-Location ".."
        return $false
    }
    
    # Test chạy standalone
    Write-Host "  -> Starting standalone server on port 3000..." -ForegroundColor Cyan
    Write-Host "  -> Press Ctrl+C to stop" -ForegroundColor Yellow
    
    Set-Location ".next/standalone"
    $env:PORT = "3000"
    node server.js
    
    Set-Location "../../.."
    return $true
}

function Test-NguoidanStandalone {
    Write-Host "`n[TEST] Frontend Người Dân Standalone..." -ForegroundColor Yellow
    
    Set-Location "frontend/nguoi-dan"
    
    # Build
    Write-Host "  -> Building..." -ForegroundColor Cyan
    npm run build
    if ($LASTEXITCODE -ne 0) { 
        Write-Host "  ✗ Build failed!" -ForegroundColor Red
        Set-Location "../.."
        return $false
    }
    
    # Kiểm tra cấu trúc
    Write-Host "  -> Checking structure..." -ForegroundColor Cyan
    $requiredFiles = @(
        ".next/standalone/server.js",
        ".next/standalone/node_modules",
        ".next/standalone/.next",
        ".next/standalone/public"
    )
    
    $allExist = $true
    foreach ($file in $requiredFiles) {
        if (!(Test-Path $file)) {
            Write-Host "  ✗ Missing: $file" -ForegroundColor Red
            $allExist = $false
        } else {
            Write-Host "  ✓ Found: $file" -ForegroundColor Green
        }
    }
    
    if (!$allExist) {
        Set-Location "../.."
        return $false
    }
    
    # Kiểm tra sharp binary (không được có Windows binary)
    Write-Host "  -> Checking for Windows binaries..." -ForegroundColor Cyan
    $sharpPath = ".next/standalone/node_modules/sharp"
    if (Test-Path $sharpPath) {
        $winBinary = Get-ChildItem -Path $sharpPath -Recurse -Filter "*win32*.node" -ErrorAction SilentlyContinue
        if ($winBinary) {
            Write-Host "  ⚠ WARNING: Found Windows sharp binary - will crash on Azure Linux!" -ForegroundColor Red
            Write-Host "    Run build-for-azure.ps1 to clean it" -ForegroundColor Yellow
        } else {
            Write-Host "  ✓ No Windows binaries found" -ForegroundColor Green
        }
    } else {
        Write-Host "  ✓ Sharp not in standalone (good for Azure)" -ForegroundColor Green
    }
    
    # Test chạy standalone
    Write-Host "  -> Starting standalone server on port 3001..." -ForegroundColor Cyan
    Write-Host "  -> Press Ctrl+C to stop" -ForegroundColor Yellow
    
    Set-Location ".next/standalone"
    $env:PORT = "3001"
    node server.js
    
    Set-Location "../../.."
    return $true
}

# Main execution
switch ($Target) {
    'admin' {
        Test-AdminStandalone
    }
    'nguoidan' {
        Test-NguoidanStandalone
    }
    'all' {
        Write-Host "`nTest cả 2 frontend. Chạy từng cái một:" -ForegroundColor Cyan
        Write-Host "  .\TEST_STANDALONE_LOCAL.ps1 -Target admin" -ForegroundColor Yellow
        Write-Host "  .\TEST_STANDALONE_LOCAL.ps1 -Target nguoidan" -ForegroundColor Yellow
    }
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Nếu server chạy OK, mở browser:" -ForegroundColor Green
Write-Host "  Admin: http://localhost:3000" -ForegroundColor Cyan
Write-Host "  Người Dân: http://localhost:3001" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
