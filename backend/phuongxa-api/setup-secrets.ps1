# Script Setup User Secrets cho Backend
# Chạy script này để cấu hình secrets an toàn

Write-Host "🔐 Setup User Secrets cho PhuongXa API" -ForegroundColor Cyan
Write-Host ""

# Chuyển vào thư mục API
Set-Location src/PhuongXa.API

# Initialize user secrets
Write-Host "📝 Initializing user secrets..." -ForegroundColor Yellow
dotnet user-secrets init

# Prompt for secrets
Write-Host ""
Write-Host "Vui lòng nhập các thông tin sau:" -ForegroundColor Green
Write-Host ""

# Database Password
$dbPassword = Read-Host "Database Password (PostgreSQL)"
if ($dbPassword) {
    $connectionString = "Host=localhost;Port=5432;Database=phuongxa_db;Username=postgres;Password=$dbPassword"
    dotnet user-secrets set "ConnectionStrings:DefaultConnection" $connectionString
    Write-Host "✅ Database connection string đã được lưu" -ForegroundColor Green
}

# JWT Key
Write-Host ""
$jwtKey = Read-Host "JWT Secret Key (ít nhất 32 ký tự, để trống để tự động tạo)"
if (-not $jwtKey) {
    # Generate random JWT key
    $jwtKey = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 64 | ForEach-Object {[char]$_})
    Write-Host "🔑 JWT Key đã được tạo tự động" -ForegroundColor Yellow
}
dotnet user-secrets set "Jwt:Key" $jwtKey
Write-Host "✅ JWT Key đã được lưu" -ForegroundColor Green

# Admin Password
Write-Host ""
$adminPassword = Read-Host "Admin Password (mặc định: Admin@123)"
if (-not $adminPassword) {
    $adminPassword = "Admin@123"
}
dotnet user-secrets set "DefaultAdmin:Password" $adminPassword
Write-Host "✅ Admin password đã được lưu" -ForegroundColor Green

# Email Settings (Optional)
Write-Host ""
$setupEmail = Read-Host "Bạn có muốn cấu hình Email không? (y/n)"
if ($setupEmail -eq 'y') {
    $smtpHost = Read-Host "SMTP Host (vd: smtp.gmail.com)"
    $smtpPort = Read-Host "SMTP Port (vd: 587)"
    $senderEmail = Read-Host "Sender Email"
    $senderName = Read-Host "Sender Name"
    $emailUsername = Read-Host "Email Username"
    $emailPassword = Read-Host "Email Password" -AsSecureString
    $emailPasswordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($emailPassword))
    
    dotnet user-secrets set "Email:SmtpHost" $smtpHost
    dotnet user-secrets set "Email:SmtpPort" $smtpPort
    dotnet user-secrets set "Email:SenderEmail" $senderEmail
    dotnet user-secrets set "Email:SenderName" $senderName
    dotnet user-secrets set "Email:Username" $emailUsername
    dotnet user-secrets set "Email:Password" $emailPasswordPlain
    dotnet user-secrets set "Email:EnableSsl" "true"
    
    Write-Host "✅ Email settings đã được lưu" -ForegroundColor Green
}

# List all secrets
Write-Host ""
Write-Host "📋 Danh sách secrets đã được cấu hình:" -ForegroundColor Cyan
dotnet user-secrets list

Write-Host ""
Write-Host "✅ Hoàn thành! User secrets đã được cấu hình." -ForegroundColor Green
Write-Host ""
Write-Host "📝 Lưu ý:" -ForegroundColor Yellow
Write-Host "  - Secrets được lưu tại: %APPDATA%\Microsoft\UserSecrets" -ForegroundColor Gray
Write-Host "  - Không commit secrets vào Git" -ForegroundColor Gray
Write-Host "  - Để xem secrets: dotnet user-secrets list" -ForegroundColor Gray
Write-Host "  - Để xóa secret: dotnet user-secrets remove <key>" -ForegroundColor Gray
Write-Host ""
