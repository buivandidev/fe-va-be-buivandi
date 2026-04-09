# Script kiểm tra tổng quát hệ thống FE/BE Admin

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "KIỂM TRA TỔNG QUÁT HỆ THỐNG" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$issues = @()
$warnings = @()
$passed = @()

# 1. KIỂM TRA CẤU HÌNH
Write-Host "1. KIỂM TRA CẤU HÌNH" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

# Backend appsettings
if (Test-Path "backend/phuongxa-api/src/PhuongXa.API/appsettings.json") {
    $appsettings = Get-Content "backend/phuongxa-api/src/PhuongXa.API/appsettings.json" | ConvertFrom-Json
    
    # Kiểm tra JWT Key
    if ($appsettings.Jwt.Key -and $appsettings.Jwt.Key.Length -ge 64) {
        Write-Host "  ✓ JWT Key: OK (${($appsettings.Jwt.Key.Length)} chars)" -ForegroundColor Green
        $passed += "JWT Key configured"
    } else {
        Write-Host "  ✗ JWT Key: Quá ngắn hoặc thiếu" -ForegroundColor Red
        $issues += "JWT Key phải có ít nhất 64 ký tự"
    }
    
    # Kiểm tra Connection String
    if ($appsettings.ConnectionStrings.DefaultConnection) {
        Write-Host "  ✓ Database Connection: Configured" -ForegroundColor Green
        $passed += "Database connection configured"
    } else {
        Write-Host "  ✗ Database Connection: Thiếu" -ForegroundColor Red
        $issues += "Thiếu connection string"
    }
} else {
    Write-Host "  ✗ appsettings.json: Không tìm thấy" -ForegroundColor Red
    $issues += "Thiếu file appsettings.json"
}

# Frontend environment
if (Test-Path "frontend/src/lib/config/environment.ts") {
    Write-Host "  ✓ Frontend Config: Tồn tại" -ForegroundColor Green
    $passed += "Frontend config exists"
} else {
    Write-Host "  ✗ Frontend Config: Không tìm thấy" -ForegroundColor Red
    $issues += "Thiếu file environment.ts"
}

# .env.local files
if (Test-Path "frontend/.env.local") {
    Write-Host "  ✓ Frontend .env.local: Tồn tại" -ForegroundColor Green
    $passed += "Frontend .env.local exists"
} else {
    Write-Host "  ⚠ Frontend .env.local: Không tìm thấy" -ForegroundColor Yellow
    $warnings += "Nên tạo frontend/.env.local"
}

Write-Host ""

# 2. KIỂM TRA DEPENDENCIES
Write-Host "2. KIỂM TRA DEPENDENCIES" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

# Backend - .NET
try {
    $dotnetVersion = dotnet --version 2>$null
    if ($dotnetVersion) {
        Write-Host "  ✓ .NET SDK: $dotnetVersion" -ForegroundColor Green
        $passed += ".NET SDK installed"
    }
} catch {
    Write-Host "  ✗ .NET SDK: Chưa cài đặt" -ForegroundColor Red
    $issues += "Cần cài đặt .NET SDK"
}

# Frontend - Node.js
try {
    $nodeVersion = node --version 2>$null
    if ($nodeVersion) {
        Write-Host "  ✓ Node.js: $nodeVersion" -ForegroundColor Green
        $passed += "Node.js installed"
    }
} catch {
    Write-Host "  ✗ Node.js: Chưa cài đặt" -ForegroundColor Red
    $issues += "Cần cài đặt Node.js"
}

# Frontend - npm
try {
    $npmVersion = npm --version 2>$null
    if ($npmVersion) {
        Write-Host "  ✓ npm: v$npmVersion" -ForegroundColor Green
        $passed += "npm installed"
    }
} catch {
    Write-Host "  ✗ npm: Chưa cài đặt" -ForegroundColor Red
    $issues += "Cần cài đặt npm"
}

# Frontend node_modules
if (Test-Path "frontend/node_modules") {
    Write-Host "  ✓ Frontend node_modules: Đã cài đặt" -ForegroundColor Green
    $passed += "Frontend dependencies installed"
} else {
    Write-Host "  ✗ Frontend node_modules: Chưa cài đặt" -ForegroundColor Red
    $issues += "Chạy 'npm install' trong thư mục frontend"
}

Write-Host ""

# 3. KIỂM TRA DATABASE
Write-Host "3. KIỂM TRA DATABASE" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

# PostgreSQL
try {
    $pgVersion = psql --version 2>$null
    if ($pgVersion) {
        Write-Host "  ✓ PostgreSQL: Đã cài đặt" -ForegroundColor Green
        $passed += "PostgreSQL installed"
    }
} catch {
    Write-Host "  ⚠ PostgreSQL: Không tìm thấy trong PATH" -ForegroundColor Yellow
    $warnings += "Kiểm tra PostgreSQL đã cài đặt và chạy"
}

# Kiểm tra kết nối database
if (Test-Path "backend/phuongxa-api/src/PhuongXa.API/appsettings.Development.json") {
    $devSettings = Get-Content "backend/phuongxa-api/src/PhuongXa.API/appsettings.Development.json" | ConvertFrom-Json
    $connString = $devSettings.ConnectionStrings.DefaultConnection
    
    if ($connString -match "Database=([^;]+)") {
        $dbName = $matches[1]
        Write-Host "  ℹ Database Name: $dbName" -ForegroundColor Cyan
    }
}

Write-Host ""

# 4. KIỂM TRA PROCESSES ĐANG CHẠY
Write-Host "4. KIỂM TRA PROCESSES ĐANG CHẠY" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

# Backend
$backendProcess = Get-Process -Name "PhuongXa.API" -ErrorAction SilentlyContinue
if ($backendProcess) {
    $ramMB = [math]::Round($backendProcess.WorkingSet / 1MB, 2)
    Write-Host "  ✓ Backend API: Đang chạy (PID: $($backendProcess.Id), RAM: ${ramMB}MB)" -ForegroundColor Green
    $passed += "Backend running"
} else {
    Write-Host "  ✗ Backend API: Không chạy" -ForegroundColor Red
    $issues += "Backend chưa được khởi động"
}

# Frontend
$nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    $totalRAM = ($nodeProcesses | Measure-Object -Property WorkingSet -Sum).Sum / 1MB
    Write-Host "  ✓ Node.js: $($nodeProcesses.Count) process(es) (Total RAM: $([math]::Round($totalRAM, 2))MB)" -ForegroundColor Green
    
    # Kiểm tra RAM usage
    foreach ($proc in $nodeProcesses) {
        $ramMB = [math]::Round($proc.WorkingSet / 1MB, 2)
        if ($ramMB -gt 1024) {
            Write-Host "    ⚠ PID $($proc.Id): ${ramMB}MB (vượt giới hạn 1GB)" -ForegroundColor Yellow
            $warnings += "Node.js process $($proc.Id) sử dụng quá nhiều RAM"
        }
    }
    $passed += "Frontend running"
} else {
    Write-Host "  ✗ Node.js: Không có process nào" -ForegroundColor Red
    $issues += "Frontend chưa được khởi động"
}

Write-Host ""

# 5. KIỂM TRA PORTS
Write-Host "5. KIỂM TRA PORTS" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

$ports = @{
    "5000" = "Backend API"
    "3000" = "Frontend Admin"
    "3001" = "Frontend Người Dân"
}

foreach ($port in $ports.Keys) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:$port" -Method Get -TimeoutSec 3 -ErrorAction Stop
        Write-Host "  ✓ Port $port (${($ports[$port])}): Responding" -ForegroundColor Green
        $passed += "Port $port active"
    } catch {
        if ($_.Exception.Message -match "Unable to connect") {
            Write-Host "  ✗ Port $port (${($ports[$port])}): Không phản hồi" -ForegroundColor Red
            $issues += "Port $port không hoạt động"
        } else {
            Write-Host "  ⚠ Port $port (${($ports[$port])}): $($_.Exception.Message)" -ForegroundColor Yellow
        }
    }
}

Write-Host ""

# 6. KIỂM TRA BUILD ARTIFACTS
Write-Host "6. KIỂM TRA BUILD ARTIFACTS" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

# Backend DLL
if (Test-Path "backend/phuongxa-api/src/PhuongXa.API/bin/Debug/net10.0/PhuongXa.API.dll") {
    Write-Host "  ✓ Backend Build: Tồn tại" -ForegroundColor Green
    $passed += "Backend compiled"
} else {
    Write-Host "  ⚠ Backend Build: Chưa build" -ForegroundColor Yellow
    $warnings += "Nên build backend trước khi chạy"
}

# Frontend .next
if (Test-Path "frontend/.next") {
    Write-Host "  ✓ Frontend Build Cache: Tồn tại" -ForegroundColor Green
    $passed += "Frontend cache exists"
} else {
    Write-Host "  ℹ Frontend Build Cache: Chưa có (sẽ tạo khi dev)" -ForegroundColor Cyan
}

Write-Host ""

# 7. KIỂM TRA RAM OPTIMIZATION
Write-Host "7. KIỂM TRA RAM OPTIMIZATION" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

# Kiểm tra NODE_OPTIONS trong .env.local
if (Test-Path "frontend/.env.local") {
    $envContent = Get-Content "frontend/.env.local" -Raw
    if ($envContent -match "NODE_OPTIONS.*max-old-space-size") {
        Write-Host "  ✓ RAM Limit: Đã cấu hình" -ForegroundColor Green
        $passed += "RAM optimization configured"
    } else {
        Write-Host "  ⚠ RAM Limit: Chưa cấu hình" -ForegroundColor Yellow
        $warnings += "Nên thêm NODE_OPTIONS vào .env.local"
    }
}

# Kiểm tra cross-env
if (Test-Path "frontend/package.json") {
    $packageJson = Get-Content "frontend/package.json" | ConvertFrom-Json
    if ($packageJson.devDependencies.'cross-env') {
        Write-Host "  ✓ cross-env: Đã cài đặt" -ForegroundColor Green
        $passed += "cross-env installed"
    } else {
        Write-Host "  ⚠ cross-env: Chưa cài đặt" -ForegroundColor Yellow
        $warnings += "Nên cài đặt cross-env"
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "KẾT QUẢ KIỂM TRA" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "✓ Passed: $($passed.Count)" -ForegroundColor Green
Write-Host "⚠ Warnings: $($warnings.Count)" -ForegroundColor Yellow
Write-Host "✗ Issues: $($issues.Count)" -ForegroundColor Red
Write-Host ""

if ($issues.Count -gt 0) {
    Write-Host "CÁC VẤN ĐỀ CẦN FIX:" -ForegroundColor Red
    foreach ($issue in $issues) {
        Write-Host "  • $issue" -ForegroundColor Red
    }
    Write-Host ""
}

if ($warnings.Count -gt 0) {
    Write-Host "CẢNH BÁO:" -ForegroundColor Yellow
    foreach ($warning in $warnings) {
        Write-Host "  • $warning" -ForegroundColor Yellow
    }
    Write-Host ""
}

# Đánh giá tổng thể
Write-Host "ĐÁNH GIÁ TỔNG THỂ:" -ForegroundColor Cyan
if ($issues.Count -eq 0 -and $warnings.Count -eq 0) {
    Write-Host "  🎉 HỆ THỐNG HOÀN HẢO!" -ForegroundColor Green
    Write-Host "  Tất cả kiểm tra đều passed. Hệ thống sẵn sàng." -ForegroundColor Green
} elseif ($issues.Count -eq 0) {
    Write-Host "  ✓ HỆ THỐNG ỔN ĐỊNH" -ForegroundColor Green
    Write-Host "  Có một số cảnh báo nhỏ nhưng hệ thống có thể chạy." -ForegroundColor Yellow
} else {
    Write-Host "  ⚠ CẦN KHẮC PHỤC" -ForegroundColor Yellow
    Write-Host "  Có $($issues.Count) vấn đề cần được fix trước khi chạy." -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "HÀNH ĐỘNG KHUYẾN NGHỊ" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if ($issues.Count -gt 0) {
    Write-Host "1. Fix các issues trên" -ForegroundColor White
    Write-Host "2. Chạy lại script này để kiểm tra" -ForegroundColor White
    Write-Host "3. Nếu OK, khởi động hệ thống:" -ForegroundColor White
    Write-Host "   .\START_ALL_SERVERS.ps1" -ForegroundColor Cyan
} else {
    if (-not $backendProcess -and -not $nodeProcesses) {
        Write-Host "Khởi động hệ thống:" -ForegroundColor White
        Write-Host "  .\START_ALL_SERVERS.ps1" -ForegroundColor Cyan
    } else {
        Write-Host "Hệ thống đang chạy tốt!" -ForegroundColor Green
        Write-Host ""
        Write-Host "URLs:" -ForegroundColor White
        Write-Host "  Backend API:        http://localhost:5000" -ForegroundColor Cyan
        Write-Host "  Swagger:            http://localhost:5000/swagger" -ForegroundColor Cyan
        Write-Host "  Frontend Admin:     http://localhost:3000" -ForegroundColor Cyan
        Write-Host "  Frontend Người Dân: http://localhost:3001" -ForegroundColor Cyan
    }
}

Write-Host ""

