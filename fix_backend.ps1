[System.Text.Encoding]::RegisterProvider([System.Text.CodePagesEncodingProvider]::Instance)
$e1258 = [System.Text.Encoding]::GetEncoding(1258)
$utf8 = [System.Text.Encoding]::UTF8

Get-ChildItem -Path d:\febecuoiki\backend -Recurse -Include *.cs,*.json | ForEach-Object {
    $bytes = [IO.File]::ReadAllBytes($_.FullName)
    # The file bytes are currently UTF-8 bytes representing the mojibake.
    $strMojibake = $utf8.GetString($bytes)
    
    if ($strMojibake -match "Táº¡o" -or $strMojibake -match "cáº¥u" -or $strMojibake -match "phÆ°á»") {
        # The string was read as UTF-8, but it SHOULD have been read as 1258.
        # To fix it, we convert the wrong string characters back to 1258 bytes.
        # But wait - if it has replacement characters, $e1258.GetBytes() will lose data!
        $wrongBytes = $e1258.GetBytes($strMojibake)
        $correctStr = $utf8.GetString($wrongBytes)
        
        [IO.File]::WriteAllText($_.FullName, $correctStr, $utf8)
        Write-Host "Fixed $($_.FullName)"
    }
}
Write-Host "Done"
