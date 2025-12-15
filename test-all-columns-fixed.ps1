# Test getColumnIndex pentru toate coloanele

# Login
$loginBody = '{"email":"admin@spectra.com","password":"admin123"}'
$loginResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/admin/auth/login" -Method POST -ContentType "application/json" -Body $loginBody
$token = $loginResponse.token

Write-Host "Token obtinut"

$headers = @{"Authorization"="Bearer $token"}

# Test pentru toate coloanele importante
$columns = @("name", "email", "phone", "date", "time", "status")

foreach ($column in $columns) {
    $testBody = '{"columnName":"' + $column + '"}'
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:8080/api/test-sheets/get-column-index" -Method POST -Headers $headers -ContentType "application/json" -Body $testBody -UseBasicParsing
        $result = $response.Content | ConvertFrom-Json
        Write-Host "Column '$column' index: $($result.index)"
    } catch {
        Write-Host "Eroare pentru $column : $($_.Exception.Message)"
    }
}