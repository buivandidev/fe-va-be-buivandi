$files = 'D:\febecuoiki\backend\phuongxa-api\src\PhuongXa.API\Controllers\Admin\AdminApplicationsController.cs', 'D:\febecuoiki\backend\phuongxa-api\src\PhuongXa.API\Controllers\Public\PublicApplicationsController.cs'
foreach ($f in $files) {
    if (Test-Path $f) {
        $c = Get-Content $f -Encoding UTF8 -Raw
        if (-not $c.Contains("using System.Linq;")) {
            Set-Content $f -Value ("using System.Linq;`r`n" + $c) -Encoding UTF8
        }
    }
}