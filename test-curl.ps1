# Test direct cu curl pentru a vedea răspunsul complet

# Login
$loginBody = '{"email":"admin@spectra.com","password":"admin123"}'
$loginResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/admin/auth/login" -Method POST -ContentType "application/json" -Body $loginBody
$token = $loginResponse.token

Write-Host "Token obtinut: $($token)"

# Test pentru "name" cu Invoke-WebRequest pentru a vedea status code
$headers = @{"Authorization"="Bearer $token"}
$testBody = '{"columnName":"name"}'

try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080/api/test-sheets/get-column-index" -Method POST -Headers $headers -ContentType "application/json" -Body $testBody
    Write-Host "Status Code: $($response.StatusCode)"
    Write-Host "Response: $($response.Content)"
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