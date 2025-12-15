# Test simplu pentru a verifica că PATCH request-ul ajunge la server

# Login
$loginBody = '{"email":"admin@spectra.com","password":"admin123"}'
$loginResponse = Invoke-RestMethod -Uri "http://localhost:8081/api/admin/auth/login" -Method POST -ContentType "application/json" -Body $loginBody
$token = $loginResponse.token

Write-Host "Token obtinut: $($token.Substring(0, 50))..."

# PATCH request simplu
$headers = @{"Authorization"="Bearer $token"}
$updateBody = '{"name":"TEST_PATCH"}'

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