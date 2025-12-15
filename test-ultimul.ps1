# Test final cu monitorizare log-uri

# Login
$loginBody = '{"email":"admin@spectra.com","password":"admin123"}'
$loginResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/admin/auth/login" -Method POST -ContentType "application/json" -Body $loginBody
$token = $loginResponse.token

Write-Host "Token obtinut: $($token.Substring(0, 50))..."

# Update cu valori complet diferite
$headers = @{"Authorization"="Bearer $token"}
$updateBody = '{"id":"1765476764436","name":"ULTIMUL_TEST","date":"2025-12-31","time":"23:59"}'

Write-Host "Trimit update cu: $updateBody"

try {
    $updateResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/admin/bookings/1765476764436" -Method PATCH -Headers $headers -ContentType "application/json" -Body $updateBody
    Write-Host "Raspuns update: $($updateResponse | ConvertTo-Json -Depth 10)"
} catch {
    Write-Host "Eroare update: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $reader.BaseStream.Position = 0
        $reader.DiscardBufferedData()
        $responseBody = $reader.ReadToEnd()
        Write-Host "Raspuns eroare: $responseBody"
    }
}

# Așteptăm procesarea
Start-Sleep -Seconds 3

# Verificare finală
$checkResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/test-sheets/debug-raw-structure" -Method GET
$row = $checkResponse.firstRowData
Write-Host "Verificare finala: Name=$($row.col1), Date=$($row.col4), Time=$($row.col5)"

if ($row.col1 -eq "ULTIMUL_TEST" -and $row.col4 -eq "2025-12-31" -and $row.col5 -eq "23:59") {
    Write-Host "🎉 SUCCES: Modificarile sunt PERMANENTE și persistă corect!"
} else {
    Write-Host "❌ ESUAT: Modificarile nu au persistat"
}