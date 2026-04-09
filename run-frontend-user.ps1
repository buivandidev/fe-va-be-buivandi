# Script to run the user-facing frontend (nguoi-dan)
Write-Host "Starting user frontend (nguoi-dan)..."
$env:NEXT_PUBLIC_API_BASE_URL = "http://localhost:5187"
$env:API_BASE_URL = "http://localhost:5187"
Write-Host "Citizen FE API Base: http://localhost:5187" -ForegroundColor Cyan
npm --prefix d:\febecuoiki\frontend\nguoi-dan run dev
