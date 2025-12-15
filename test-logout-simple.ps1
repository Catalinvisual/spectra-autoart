# Test simplu logout/login

# Login
$loginBody = '{"email":"admin@spectra.com","password":"admin123"}'
$loginResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/admin/auth/login" -Method POST -ContentType "application/json" -Body $loginBody
$token = $loginResponse.token

Write-Host "Login successful"

# Update booking
$headers = @{"Authorization"="Bearer $token"}
$updateBody = '{"id":"1765476764436","name":"LOGOUT_TEST","date":"2025-12-30","time":"18:00"}'
$updateResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/admin/bookings/1765476764436" -Method PATCH -Headers $headers -ContentType "application/json" -Body $updateBody
Write-Host "Update successful"

# Verificare modificare
$checkResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/test-sheets/debug-raw-structure" -Method GET
$row = $checkResponse.firstRowData
Write-Host "Current data: Name=$($row.col1), Date=$($row.col4), Time=$($row.col5)"

# Simulare logout (token sters)
$token = $null
Write-Host "Logout simulated"

# Re-login
$newLoginResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/admin/auth/login" -Method POST -ContentType "application/json" -Body $loginBody
$newToken = $newLoginResponse.token

# Verificare finala
$finalCheckResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/test-sheets/debug-raw-structure" -Method GET
$finalRow = $finalCheckResponse.firstRowData
Write-Host "Final data: Name=$($finalRow.col1), Date=$($finalRow.col4), Time=$($finalRow.col5)"

if ($finalRow.col1 -eq "LOGOUT_TEST" -and $finalRow.col4 -eq "2025-12-30" -and $finalRow.col5 -eq "18:00") {
    Write-Host "SUCCESS: Modifications persist after logout/login!"
} else {
    Write-Host "FAILURE: Modifications did not persist"
}