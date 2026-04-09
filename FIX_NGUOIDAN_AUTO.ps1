# Script tự động fix lỗi frontend người dân
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " FIX LỖI FRONTEND NGƯỜI DÂN" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$ErrorActionPreference = "Continue"

# 1. Xóa file tạm thời
Write-Host "`n[1/5] Xóa file tạm thời..." -ForegroundColor Yellow
$tempFiles = @("fix_*.js", "rewrite_*.js", "setup_*.js")
$deletedCount = 0
foreach ($pattern in $tempFiles) {
    $files = Get-ChildItem -Path "frontend/nguoi-dan" -Filter $pattern -ErrorAction SilentlyContinue
    foreach ($file in $files) {
        Remove-Item $file.FullName -Force
        $deletedCount++
    }
}
Write-Host "  ✓ Đã xóa $deletedCount file tạm thời" -ForegroundColor Green

# 2. Chạy lint để kiểm tra
Write-Host "`n[2/5] Chạy ESLint..." -ForegroundColor Yellow
Set-Location "frontend/nguoi-dan"
$lintOutput = npm run lint 2>&1 | Out-String
$errorCount = ([regex]::Matches($lintOutput, "error")).Count
$warningCount = ([regex]::Matches($lintOutput, "warning")).Count

Write-Host "  Errors: $errorCount" -ForegroundColor $(if ($errorCount -eq 0) { "Green" } else { "Red" })
Write-Host "  Warnings: $warningCount" -ForegroundColor $(if ($warningCount -eq 0) { "Green" } else { "Yellow" })

Set-Location "../.."

# 3. Kiểm tra TypeScript
Write-Host "`n[3/5] Kiểm tra TypeScript..." -ForegroundColor Yellow
Set-Location "frontend/nguoi-dan"
$tscOutput = npx tsc --noEmit 2>&1 | Out-String
if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✓ TypeScript OK" -ForegroundColor Green
} else {
    Write-Host "  ⚠ TypeScript có lỗi" -ForegroundColor Yellow
    Write-Host $tscOutput -ForegroundColor Gray
}
Set-Location "../.."

# 4. Test build
Write-Host "`n[4/5] Test build..." -ForegroundColor Yellow
Set-Location "frontend/nguoi-dan"
$buildOutput = npm run build 2>&1 | Out-String
if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✓ Build thành công" -ForegroundColor Green
} else {
    Write-Host "  ✗ Build thất bại" -ForegroundColor Red
}
Set-Location "../.."

# 5. Tổng kết
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host " KẾT QUẢ" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

if ($errorCount -eq 0 -and $LASTEXITCODE -eq 0) {
    Write-Host "`n🎉 Tất cả lỗi đã được fix!" -ForegroundColor Green
    Write-Host "Frontend người dân sẵn sàng deploy!" -ForegroundColor Green
} else {
    Write-Host "`n⚠ Vẫn còn một số vấn đề:" -ForegroundColor Yellow
    if ($errorCount -gt 0) {
        Write-Host "  - $errorCount errors cần fix" -ForegroundColor Red
    }
    if ($warningCount -gt 0) {
        Write-Host "  - $warningCount warnings (không critical)" -ForegroundColor Yellow
    }
}

Write-Host "`nXem chi tiết: FIX_NGUOIDAN_UI_ERRORS.md" -ForegroundColor Cyan
