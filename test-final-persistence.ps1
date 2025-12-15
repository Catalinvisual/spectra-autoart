# Test final - verificare persistență completă în Google Sheets
Write-Host "=== TEST FINAL: VERIFICARE PERSISTENȚĂ ÎN GOOGLE SHEETS ===" -ForegroundColor Green

# Login
$loginBody = '{"email":"admin@spectra.com","password":"admin123"}'
try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:8081/api/admin/auth/login" -Method POST -ContentType "application/json" -Body $loginBody
    $token = $loginResponse.token
    
    Write-Host "✅ Login successful" -ForegroundColor Green
    Write-Host "Token: $($token.Substring(0, 50))..."
    
    # Test 1: Obține booking-ul înainte de modificare
    Write-Host ""
    Write-Host "=== PAS 1: Obține booking-ul înainte de modificare ===" -ForegroundColor Yellow
    $headers = @{"Authorization"="Bearer $token"}
    
    $beforeResponse = Invoke-RestMethod -Uri "http://localhost:8081/api/admin/bookings/1765476764436" -Method GET -Headers $headers
    Write-Host "ÎNAINTE:" -ForegroundColor Cyan
    Write-Host "  Nume: $($beforeResponse.name)"
    Write-Host "  Email: $($beforeResponse.email)"
    Write-Host "  Telefon: $($beforeResponse.phone)"
    Write-Host "  Dată: $($beforeResponse.date)"
    Write-Host "  Oră: $($beforeResponse.time)"
    
    # Test 2: Modifică booking-ul cu valoare unică
    Write-Host ""
    Write-Host "=== PAS 2: Modifică booking-ul ===" -ForegroundColor Yellow
    $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
    $testName = "TEST_FINAL_$timestamp"
    $updateBody = @{
        name = $testName
        email = "test_final@email.com"
        phone = "111222333"
        date = "2025-01-20"
        time = "15:30"
    } | ConvertTo-Json
    
    Write-Host "Trimit modificările:" -ForegroundColor White
    Write-Host "  Nume: $testName"
    Write-Host "  Email: test_final@email.com"
    Write-Host "  Telefon: 111222333"
    Write-Host "  Dată: 2025-01-20"
    Write-Host "  Oră: 15:30"
    Write-Host "ORA: $(Get-Date -Format 'HH:mm:ss')"
    
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
    
    # Test 3: Verifică imediat după modificare (cu fresh=true pentru date proaspete)
    Write-Host ""
    Write-Host "=== PAS 3: Verifică imediat după modificare ===" -ForegroundColor Yellow
    Write-Host "Cerem date PROASPETE din Google Sheets..."
    $afterResponse = Invoke-RestMethod -Uri "http://localhost:8081/api/admin/bookings/1765476764436?fresh=true" -Method GET -Headers $headers
    Write-Host "DUPĂ:" -ForegroundColor Cyan
    Write-Host "  Nume: $($afterResponse.name)"
    Write-Host "  Email: $($afterResponse.email)"  
    Write-Host "  Telefon: $($afterResponse.phone)"
    Write-Host "  Dată: $($afterResponse.date)"
    Write-Host "  Oră: $($afterResponse.time)"
    
    # Verifică dacă modificările sunt vizibile
    if ($afterResponse.name -eq $testName -and 
        $afterResponse.email -eq "test_final@email.com" -and 
        $afterResponse.phone -eq "111222333" -and
        $afterResponse.date -eq "2025-01-20" -and
        $afterResponse.time -eq "15:30") {
        Write-Host ""
        Write-Host "✅ MODIFICĂRILE SUNT VIZIBILE ÎN UI!" -ForegroundColor Green
        Write-Host "📝 Valoare test: $testName"
        Write-Host ""
        Write-Host "⚠️  IMPORTANT: Verifică MANUAL în Google Sheets!" -ForegroundColor Yellow
        Write-Host "   URL: https://docs.google.com/spreadsheets/d/1dy4hozgiP4CoTnasPyjR9o7_qgRMoank0V9_IbzDt90"
        Write-Host "   Caută rândul cu ID: 1765476764436"
        Write-Host ""
        Write-Host "🔍 Dacă în Google Sheets valorile sunt actualizate, atunci problema este REZOLVATĂ!" -ForegroundColor Green
    } else {
        Write-Host ""
        Write-Host "❌ Modificările NU sunt vizibile nici măcar în UI!" -ForegroundColor Red
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
Write-Host "=== TEST FINAL COMPLETAT ===" -ForegroundColor Green