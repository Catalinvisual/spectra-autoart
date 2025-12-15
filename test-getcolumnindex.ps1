# Test direct getColumnIndex

# Login
$loginBody = '{"email":"admin@spectra.com","password":"admin123"}'
$loginResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/admin/auth/login" -Method POST -ContentType "application/json" -Body $loginBody
$token = $loginResponse.token

Write-Host "Token obtinut"

# Test getColumnIndex direct
$headers = @{"Authorization"="Bearer $token"}

# Test pentru "name"
$testBody = '{"columnName":"name"}'
try {
    $response = Invoke-RestMethod -Uri "http://localhost:8080/api/test-sheets/get-column-index" -Method POST -Headers $headers -ContentType "application/json" -Body $testBody
    Write-Host "Column 'name' index: $($response.index)"
} catch {
    Write-Host "Eroare getColumnIndex: $($_.Exception.Message)"
}

# Test pentru "date"
$testBody = '{"columnName":"date"}'
try {
    $response = Invoke-RestMethod -Uri "http://localhost:8080/api/test-sheets/get-column-index" -Method POST -Headers $headers -ContentType "application/json" -Body $testBody
    Write-Host "Column 'date' index: $($response.index)"
} catch {
    Write-Host "Eroare getColumnIndex: $($_.Exception.Message)"
}