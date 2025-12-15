# Test pentru a verifica hasChanges și log-urile complete

# Login
$loginBody = '{"email":"admin@spectra.com","password":"admin123"}'
$loginResponse = Invoke-RestMethod -Uri "http://localhost:8081/api/admin/auth/login" -Method POST -ContentType "application/json" -Body $loginBody
$token = $loginResponse.token

Write-Host "Token obtinut: $($token.Substring(0, 50))..."

# Mai întâi să obținem booking-ul actual pentru a vedea valorile originale
$headers = @{"Authorization"="Bearer $token"}

Write-Host "Obțin booking-ul curent..."
try {
    $bookingResponse = Invoke-RestMethod -Uri "http://localhost:8081/api/admin/bookings/1765476764436" -Method GET -Headers $headers -ContentType "application/json"
    Write-Host "Booking actual: $($bookingResponse | ConvertTo-Json -Depth 3)"
} catch {
    Write-Host "Eroare la obținerea booking-ului: $($_.Exception.Message)"
}

# Acum trimitem PATCH cu o valoare sigur diferită
$updateBody = '{"name":"TEST_PATCH_DEBUG_12345"}'

Write-Host "Trimit PATCH request cu: $updateBody"

try {
    $updateResponse = Invoke-WebRequest -Uri "http://localhost:8081/api/admin/bookings/1765476764436" -Method PATCH -Headers $headers -ContentType "application/json" -Body $updateBody -UseBasicParsing
    Write-Host "Status Code: $($updateResponse.StatusCode)"
    Write-Host "Response: $($updateResponse.Content)"
} catch {
    Write-Host "Status Code: $($_.Exception.Response.StatusCode)"
    Write-Host "Error: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $reader.BaseStream.Position = 0
        $reader.DiscardBufferedData()
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response Body: $responseBody"
    }
}