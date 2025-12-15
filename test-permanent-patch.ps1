# Test pentru a verifica persistența permanentă

# Login
$loginBody = '{"email":"admin@spectra.com","password":"admin123"}'
$loginResponse = Invoke-RestMethod -Uri "http://localhost:8081/api/admin/auth/login" -Method POST -ContentType "application/json" -Body $loginBody
$token = $loginResponse.token

Write-Host "Token obtinut: $($token.Substring(0, 50))..."

# PATCH request cu valoare unica pentru a verifica persistenta
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$testValue = "TEST_PERMANENT_$timestamp"
$updateBody = "{`"name`":`"$testValue`"}"

Write-Host "Trimit PATCH request cu: $updateBody"
Write-Host "ORA CURENTA: $(Get-Date -Format 'HH:mm:ss')"

$headers = @{"Authorization"="Bearer $token"}

try {
    $updateResponse = Invoke-WebRequest -Uri "http://localhost:8081/api/admin/bookings/1765476764436" -Method PATCH -Headers $headers -ContentType "application/json" -Body $updateBody -UseBasicParsing
    Write-Host "Status Code: $($updateResponse.StatusCode)"
    Write-Host "Response: $($updateResponse.Content)"
    Write-Host "Modificare trimisa la $(Get-Date -Format 'HH:mm:ss')"
    Write-Host "Valoare test: $testValue"
} catch {
    Write-Host "Eroare: $($_.Exception.Message)"
}

Write-Host ""
Write-Host "IMPORTANT: Asteapta 2-3 minute si verifica din nou in admin panel"
Write-Host "Booking ID: 1765476764436"
Write-Host "Valoare trimisa: $testValue"