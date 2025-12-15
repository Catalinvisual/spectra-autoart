# Test direct cu date diferite

# Login
$loginBody = '{"email":"admin@spectra.com","password":"admin123"}'
$loginResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/admin/auth/login" -Method POST -ContentType "application/json" -Body $loginBody
$token = $loginResponse.token

Write-Host "Token: $($token.Substring(0, 50))..."

# Update cu valori complet diferite
$headers = @{"Authorization"="Bearer $token"}
$updateBody = '{"id":"1765476764436","name":"TEST_DIFFERENT","date":"2025-12-31","time":"23:59","email":"different@email.com"}'

Write-Host "Sending update with body: $updateBody"

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