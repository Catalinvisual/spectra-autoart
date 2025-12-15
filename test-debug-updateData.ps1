# Test debug - verificare updateData
Write-Host "=== TEST DEBUG: VERIFICARE updateData ===" -ForegroundColor Green

# Login
$loginBody = '{"email":"admin@spectra.com","password":"admin123"}'
try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:8081/api/admin/auth/login" -Method POST -ContentType "application/json" -Body $loginBody
    $token = $loginResponse.token
    
    Write-Host "✅ Login successful" -ForegroundColor Green
    
    # Test: Modifică doar numele
    Write-Host ""
    Write-Host "=== TEST: Modifică doar numele ===" -ForegroundColor Yellow
    $headers = @{"Authorization"="Bearer $token"}
    
    $updateBody = @{
        name = "DEBUG_TEST_NAME"
    } | ConvertTo-Json
    
    Write-Host "Trimit doar modificare de nume: DEBUG_TEST_NAME"
    
    $updateResponse = Invoke-RestMethod -Uri "http://localhost:8081/api/admin/bookings/1765476764436" -Method PATCH -Headers $headers -ContentType "application/json" -Body $updateBody
    Write-Host ""
    Write-Host "Răspuns server:" -ForegroundColor White
    Write-Host "  Success: $($updateResponse.success)"
    Write-Host "  Message: $($updateResponse.message)"
    Write-Host "  HasChanges: $($updateResponse.hasChanges)"
    
    if ($updateResponse.error) {
        Write-Host "  Eroare: $($updateResponse.error)" -ForegroundColor Red
        Write-Host "  Detalii: $($updateResponse.details)" -ForegroundColor Red
    }
    
} catch {
    Write-Host "EROARE: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $reader.BaseStream.Position = 0
        $reader.DiscardBufferedData()
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response: $responseBody" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "=== VERIFICĂ LOG-URILE SERVERULUI ===" -ForegroundColor Yellow
Write-Host "Caută în log-uri: '🎯 Starting direct cell updates' și '🔄 Updating cell by index'"