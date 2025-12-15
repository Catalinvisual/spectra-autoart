# Test final cu modificarea completă

# Login
$loginBody = '{"email":"admin@spectra.com","password":"admin123"}'
$loginResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/admin/auth/login" -Method POST -ContentType "application/json" -Body $loginBody
$token = $loginResponse.token

Write-Host "Token: $($token.Substring(0, 50))..."

# Update cu valori complet diferite
$headers = @{"Authorization"="Bearer $token"}
$updateBody = '{"id":"1765476764436","name":"FINAL_TEST_SUCCESS","date":"2025-12-31","time":"23:59","email":"final@test.com"}'

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

# Verificare finală
Start-Sleep -Seconds 2  # Așteptăm puțin pentru procesare
$checkResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/test-sheets/debug-raw-structure" -Method GET
$row = $checkResponse.firstRowData
Write-Host "Final verification: Name=$($row.col1), Date=$($row.col4), Time=$($row.col5), Email=$($row.col2)"

if ($row.col1 -eq "FINAL_TEST_SUCCESS" -and $row.col4 -eq "2025-12-31" -and $row.col5 -eq "23:59" -and $row.col2 -eq "final@test.com") {
    Write-Host "🎉 SUCCESS: All modifications are PERMANENT and persist correctly!"
} else {
    Write-Host "❌ FAILURE: Modifications did not persist"
}