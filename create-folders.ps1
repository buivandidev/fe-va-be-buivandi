# Script tạo cấu trúc folders và files cho Admin Frontend

# Tạo các folders cần thiết
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
        Write-Host "✓ Created $folder" -ForegroundColor Green
    } else {
        Write-Host "✓ $folder already exists" -ForegroundColor Yellow
    }
}

Write-Host "`nFolders created successfully!" -ForegroundColor Cyan
Write-Host "Ready to create component files..." -ForegroundColor Cyan
