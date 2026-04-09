# Script test tất cả các API endpoints
# Chạy script này sau khi đã đăng nhập và có token

param(
    [string]$Token = "",
    [string]$BaseUrl = "http://localhost:5000"
)

if ([string]::IsNullOrEmpty($Token)) {
    Write-Host "❌ Vui lòng cung cấp token: .\TEST_ALL_ENDPOINTS.ps1 -Token 'your_token_here'" -ForegroundColor Red
    exit 1
}

$headers = @{
    "Authorization" = "Bearer $Token"
    "Content-Type" = "application/json"
}

function Test-Endpoint {
    param(
        [string]$Method,
        [string]$Url,
        [string]$Description,
        [object]$Body = $null
    )
    
    Write-Host "`n🔍 Testing: $Description" -ForegroundColor Cyan
    Write-Host "   $Method $Url" -ForegroundColor Gray
    
    try {
        $params = @{
            Method = $Method
            Uri = "$BaseUrl$Url"
            Headers = $headers
            ErrorAction = "Stop"
        }
        
        if ($Body) {
            $params.Body = ($Body | ConvertTo-Json -Depth 10)
        }
        
        $response = Invoke-RestMethod @params
        Write-Host "   ✅ Success" -ForegroundColor Green
        return $true
    }
    catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        Write-Host "   ❌ Failed: $statusCode - $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

Write-Host "========================================" -ForegroundColor Yellow
Write-Host "  API ENDPOINTS TEST" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Yellow
Write-Host "Base URL: $BaseUrl" -ForegroundColor Yellow
Write-Host ""

$results = @{
    Passed = 0
    Failed = 0
}

# ========== DASHBOARD ==========
Write-Host "`n📊 DASHBOARD ENDPOINTS" -ForegroundColor Magenta
if (Test-Endpoint "GET" "/api/admin/dashboard/stats" "Get dashboard stats") { $results.Passed++ } else { $results.Failed++ }
if (Test-Endpoint "GET" "/api/admin/dashboard/articles-chart?soThang=6" "Get articles chart") { $results.Passed++ } else { $results.Failed++ }
if (Test-Endpoint "GET" "/api/admin/dashboard/applications-status-chart" "Get applications status chart") { $results.Passed++ } else { $results.Failed++ }

# ========== USERS ==========
Write-Host "`n👥 USERS ENDPOINTS" -ForegroundColor Magenta
if (Test-Endpoint "GET" "/api/admin/users?trang=1&kichThuocTrang=10" "Get users list") { $results.Passed++ } else { $results.Failed++ }

# ========== ARTICLES ==========
Write-Host "`n📝 ARTICLES ENDPOINTS" -ForegroundColor Magenta
if (Test-Endpoint "GET" "/api/admin/articles/admin?trang=1&kichThuocTrang=10" "Get articles list") { $results.Passed++ } else { $results.Failed++ }

# ========== SERVICES ==========
Write-Host "`n🛎️ SERVICES ENDPOINTS" -ForegroundColor Magenta
if (Test-Endpoint "GET" "/api/admin/services/admin?trang=1&kichThuocTrang=10" "Get services list") { $results.Passed++ } else { $results.Failed++ }

# ========== APPLICATIONS ==========
Write-Host "`n📋 APPLICATIONS ENDPOINTS" -ForegroundColor Magenta
if (Test-Endpoint "GET" "/api/admin/applications?trang=1&kichThuocTrang=10" "Get applications list") { $results.Passed++ } else { $results.Failed++ }
if (Test-Endpoint "GET" "/api/public/departments" "Get departments list") { $results.Passed++ } else { $results.Failed++ }

# ========== COMMENTS ==========
Write-Host "`n💬 COMMENTS ENDPOINTS" -ForegroundColor Magenta
if (Test-Endpoint "GET" "/api/admin/comments?trang=1&kichThuocTrang=10" "Get comments list") { $results.Passed++ } else { $results.Failed++ }

# ========== CATEGORIES ==========
Write-Host "`n📂 CATEGORIES ENDPOINTS" -ForegroundColor Magenta
if (Test-Endpoint "GET" "/api/categories" "Get categories list") { $results.Passed++ } else { $results.Failed++ }

# ========== MEDIA ==========
Write-Host "`n🖼️ MEDIA ENDPOINTS" -ForegroundColor Magenta
if (Test-Endpoint "GET" "/api/admin/media?trang=1&kichThuocTrang=12" "Get media list") { $results.Passed++ } else { $results.Failed++ }
if (Test-Endpoint "GET" "/api/admin/media/albums" "Get albums list") { $results.Passed++ } else { $results.Failed++ }

# ========== AUDIT LOGS ==========
Write-Host "`n📜 AUDIT LOGS ENDPOINTS" -ForegroundColor Magenta
if (Test-Endpoint "GET" "/api/admin/audit-logs?trang=1&kichThuocTrang=10" "Get audit logs") { $results.Passed++ } else { $results.Failed++ }

# ========== PUBLIC ENDPOINTS (No auth required) ==========
Write-Host "`n🌐 PUBLIC ENDPOINTS" -ForegroundColor Magenta
$publicHeaders = @{ "Content-Type" = "application/json" }
try {
    $response = Invoke-RestMethod -Method GET -Uri "$BaseUrl/api/public/articles?trang=1&kichThuocTrang=10" -Headers $publicHeaders
    Write-Host "   ✅ Public articles list" -ForegroundColor Green
    $results.Passed++
} catch {
    Write-Host "   ❌ Public articles list failed" -ForegroundColor Red
    $results.Failed++
}

try {
    $response = Invoke-RestMethod -Method GET -Uri "$BaseUrl/api/public/services?trang=1&kichThuocTrang=10" -Headers $publicHeaders
    Write-Host "   ✅ Public services list" -ForegroundColor Green
    $results.Passed++
} catch {
    Write-Host "   ❌ Public services list failed" -ForegroundColor Red
    $results.Failed++
}

# ========== SUMMARY ==========
Write-Host "`n========================================" -ForegroundColor Yellow
Write-Host "  TEST SUMMARY" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Yellow
Write-Host "✅ Passed: $($results.Passed)" -ForegroundColor Green
Write-Host "❌ Failed: $($results.Failed)" -ForegroundColor Red
$total = $results.Passed + $results.Failed
$percentage = [math]::Round(($results.Passed / $total) * 100, 2)
Write-Host "📊 Success Rate: $percentage%" -ForegroundColor $(if ($percentage -ge 80) { "Green" } elseif ($percentage -ge 50) { "Yellow" } else { "Red" })
Write-Host ""

if ($results.Failed -eq 0) {
    Write-Host "🎉 All tests passed!" -ForegroundColor Green
} else {
    Write-Host "⚠️ Some tests failed. Please check the errors above." -ForegroundColor Yellow
}
