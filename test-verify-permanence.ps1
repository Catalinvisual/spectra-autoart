# Verificare finală - obține booking-ul după 2-3 minute

# Login
$loginBody = '{"email":"admin@spectra.com","password":"admin123"}'
try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:8081/api/admin/auth/login" -Method POST -ContentType "application/json" -Body $loginBody
    $token = $loginResponse.token
    
    Write-Host "Token obtinut: $($token.Substring(0, 50))..."
    
    # Obține booking-ul pentru a verifica persistența
    Write-Host "Verific booking-ul 1765476764436..."
    $headers = @{"Authorization"="Bearer $token"}
    
    $bookingResponse = Invoke-RestMethod -Uri "http://localhost:8081/api/admin/bookings/1765476764436" -Method GET -Headers $headers
    
    Write-Host "Booking gasit:"
    Write-Host "  ID: $($bookingResponse.id)"
    Write-Host "  Nume: $($bookingResponse.name)"
    Write-Host "  Email: $($bookingResponse.email)"
    Write-Host "  Telefon: $($bookingResponse.phone)"
    Write-Host "  Data: $($bookingResponse.date)"
    Write-Host "  Ora: $($bookingResponse.time)"
    Write-Host "  Status: $($bookingResponse.status)"
    
    # Verifică dacă numele este cel trimis anterior
    if ($bookingResponse.name -like "TEST_PERMANENT_*") {
        Write-Host ""
        Write-Host "✅ MODIFICAREA PERSISTĂ! Numele este: $($bookingResponse.name)"
        Write-Host "✅ Modificările sunt salvate permanent în Google Sheets!"
    } else {
        Write-Host ""
        Write-Host "❌ Modificarea nu a persistat. Numele este: $($bookingResponse.name)"
    }
    
} catch {
    Write-Host "Eroare: $($_.Exception.Message)"
}