# Test cu token fresh

# Login fresh
$loginBody = '{"email":"admin@spectra.com","password":"admin123"}'
$loginResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/admin/auth/login" -Method POST -ContentType "application/json" -Body $loginBody
$token = $loginResponse.token

Write-Host "Fresh token: $($token.Substring(0, 50))..."

# Update cu token fresh
$headers = @{"Authorization"="Bearer $token"}
$updateBody = '{"id":"1765476764436","name":"FRESH_TEST","date":"2025-12-31","time":"20:00"}'

try {
    $updateResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/admin/bookings/1765476764436" -Method PATCH -Headers $headers -ContentType "application/json" -Body $updateBody
    Write-Host "Update response: $($updateResponse | ConvertTo-Json -Depth 10)"
} catch {
    Write-Host "Update error: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $reader.BaseStream.Position = 0
        $reader.DiscardBufferedData()
        $responseBody = $reader.ReadToEnd()
        Write-Host "Error response: $responseBody"
    }
}

# Verificare finala
$checkResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/test-sheets/debug-raw-structure" -Method GET
$row = $checkResponse.firstRowData
Write-Host "Final verification: Name=$($row.col1), Date=$($row.col4), Time=$($row.col5)"