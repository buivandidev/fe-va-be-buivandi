# Script to run the admin frontend
Write-Host "Starting admin frontend..."

# Run in project directory so Next.js always loads frontend/.env
Set-Location "D:\febecuoiki\frontend"

# Clear stale Next.js build cache to avoid webpack runtime errors
if (Test-Path ".next") {
    Write-Host "Clearing .next cache..." -ForegroundColor Yellow
    Remove-Item ".next" -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "Done." -ForegroundColor Green
}

# Ensure required env vars exist even when shell is missing .env loading
$env:NEXT_PUBLIC_BASE_URL = "http://localhost:5187"
$env:API_BASE_URL = "http://localhost:5187"
$env:NEXT_PUBLIC_API_BASE_URL = "http://localhost:5187"
Write-Host "Admin FE API Base: http://localhost:5187" -ForegroundColor Cyan

# Keep admin FE on fixed port 3001
npm run dev -- -p 3001
