# Script tu dong deploy len Azure bang Kudu REST API
param(
    [Parameter(Mandatory=$true)]
    [string]$BackendAppName,
    
    [Parameter(Mandatory=$true)]
    [string]$BackendUsername,
    
    [Parameter(Mandatory=$true)]
    [string]$BackendPassword,
    
    [Parameter(Mandatory=$true)]
    [string]$AdminAppName,
    
    [Parameter(Mandatory=$true)]
    [string]$AdminUsername,
    
    [Parameter(Mandatory=$true)]
    [string]$AdminPassword,
    
    [Parameter(Mandatory=$true)]
    [string]$NguoidanAppName,
    
    [Parameter(Mandatory=$true)]
    [string]$NguoidanUsername,
    
    [Parameter(Mandatory=$true)]
    [string]$NguoidanPassword
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host " AUTO DEPLOY TO AZURE" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$ErrorActionPreference = "Stop"

# Ensure TLS 1.2 for Kudu endpoints (common on older Windows defaults)
try {
    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
} catch {}

# Function to deploy via Kudu ZipDeploy API
function Deploy-ToAzure {
    param(
        [string]$AppName,
        [string]$Username,
        [string]$Password,
        [string]$ZipPath,
        [string]$DisplayName
    )
    
    Write-Host "`n[DEPLOY] $DisplayName..." -ForegroundColor Yellow
    
    # Create authorization header
    $base64AuthInfo = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("${Username}:${Password}"))
    
    # Kudu ZipDeploy endpoint
    # Supporting regional endpoints like southeastasia-01.azurewebsites.net
    $kuduUrl = "https://${AppName}.scm.southeastasia-01.azurewebsites.net/api/zipdeploy"
    
    Write-Host "  -> Uploading to $kuduUrl..." -ForegroundColor Cyan
    
    try {
        # Use -InFile to stream ZIP (more reliable than ReadAllBytes)
        $resp = Invoke-WebRequest -Uri ($kuduUrl + "?isAsync=true") `
            -Method Post `
            -Headers @{ Authorization = "Basic $base64AuthInfo" } `
            -InFile $ZipPath `
            -ContentType "application/zip" `
            -TimeoutSec 600 `
            -UseBasicParsing

        if ($resp.StatusCode -in 200, 201, 202) {
            Write-Host "  OK - Deploy accepted (HTTP $($resp.StatusCode))." -ForegroundColor Green
            return $true
        }

        Write-Host "  FAILED - Unexpected status: $($resp.StatusCode)" -ForegroundColor Red
        return $false
    } catch {
        Write-Host "  FAILED - Error: $($_.Exception.Message)" -ForegroundColor Red
        try {
            if ($_.Exception.Response -and $_.Exception.Response.GetResponseStream()) {
                $sr = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
                $body = $sr.ReadToEnd()
                if ($body) { Write-Host "  Detail: $body" -ForegroundColor Red }
            }
        } catch {}
        return $false
    }
}

# Check if ZIP files exist
$OutDir = "deploy_out_final"
$BackendZip = "$OutDir/backend-api.zip"
$AdminZip = "$OutDir/frontend-admin.zip"
$NguoidanZip = "$OutDir/frontend-nguoidan.zip"

if (!(Test-Path $BackendZip)) {
    Write-Host "ERROR: $BackendZip not found. Run build-for-azure.ps1 first!" -ForegroundColor Red
    exit 1
}

if (!(Test-Path $AdminZip)) {
    Write-Host "ERROR: $AdminZip not found. Run build-for-azure.ps1 first!" -ForegroundColor Red
    exit 1
}

if (!(Test-Path $NguoidanZip)) {
    Write-Host "ERROR: $NguoidanZip not found. Run build-for-azure.ps1 first!" -ForegroundColor Red
    exit 1
}

# Deploy each service
$results = @{
    Backend = $false
    Admin = $false
    Nguoidan = $false
}

Write-Host "`nStarting deployment for 3 services..." -ForegroundColor Cyan

# 1. Deploy Backend
$results.Backend = Deploy-ToAzure `
    -AppName $BackendAppName `
    -Username $BackendUsername `
    -Password $BackendPassword `
    -ZipPath $BackendZip `
    -DisplayName "Backend API"

Start-Sleep -Seconds 5

# 2. Deploy Admin
$results.Admin = Deploy-ToAzure `
    -AppName $AdminAppName `
    -Username $AdminUsername `
    -Password $AdminPassword `
    -ZipPath $AdminZip `
    -DisplayName "Frontend Admin"

Start-Sleep -Seconds 5

# 3. Deploy Nguoidan
$results.Nguoidan = Deploy-ToAzure `
    -AppName $NguoidanAppName `
    -Username $NguoidanUsername `
    -Password $NguoidanPassword `
    -ZipPath $NguoidanZip `
    -DisplayName "Frontend Citizen"

# Summary
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host " DEPLOYMENT SUMMARY" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

Write-Host "`nBackend API:        " -NoNewline
if ($results.Backend) { Write-Host "SUCCESS" -ForegroundColor Green } else { Write-Host "FAILED" -ForegroundColor Red }

Write-Host "Frontend Admin:     " -NoNewline
if ($results.Admin) { Write-Host "SUCCESS" -ForegroundColor Green } else { Write-Host "FAILED" -ForegroundColor Red }

Write-Host "Frontend Citizen:   " -NoNewline
if ($results.Nguoidan) { Write-Host "SUCCESS" -ForegroundColor Green } else { Write-Host "FAILED" -ForegroundColor Red }

Write-Host "`n========================================" -ForegroundColor Cyan

if ($results.Backend -and $results.Admin -and $results.Nguoidan) {
    Write-Host "ALL DEPLOYMENTS COMPLETED SUCCESSFULLY!" -ForegroundColor Green
    Write-Host "`nURLs:" -ForegroundColor Cyan
    Write-Host "  Backend:   https://${BackendAppName}.azurewebsites.net" -ForegroundColor Yellow
    Write-Host "  Admin:     https://${AdminAppName}.azurewebsites.net" -ForegroundColor Yellow
    Write-Host "  Citizen:   https://${NguoidanAppName}.azurewebsites.net" -ForegroundColor Yellow
} else {
    Write-Host "WARNING: Some services failed to deploy. Check logs above." -ForegroundColor Yellow
}
