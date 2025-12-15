# Test simplu pentru admin

# Login
$loginBody = '{"email":"admin@spectra.com","password":"admin123"}'
$loginResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/admin/auth/login" -Method POST -ContentType "application/json" -Body $loginBody
$token = $loginResponse.token

Write-Host "Token: $token"

# Update booking
$headers = @{"Authorization"="Bearer $token"}
$updateBody = '{"id":"1765476764436","name":"ADMIN_TEST_UPDATE"}'

$updateResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/admin/bookings/1765476764436" -Method PATCH -Headers $headers -ContentType "application/json" -Body $updateBody

Write-Host "Update response: $($updateResponse | ConvertTo-Json -Depth 10)"