# Test direct - verificare imediată în Google Sheets

# Login
$loginBody = '{"email":"admin@spectra.com","password":"admin123"}'
try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:8081/api/admin/auth/login" -Method POST -ContentType "application/json" -Body $loginBody
    $token = $loginResponse.token
    
    Write-Host "=== TOKEN OBTINUT ==="
    Write-Host "Token: $($token.Substring(0, 50))..."
    
    # Test 1: Obține booking-ul înainte de modificare
    Write-Host ""
    Write-Host "=== PAS 1: Obține booking-ul înainte de modificare ==="
    $headers = @{"Authorization"="Bearer $token"}
    
    $beforeResponse = Invoke-RestMethod -Uri "http://localhost:8081/api/admin/bookings/1765476764436" -Method GET -Headers $headers
    Write-Host "NUME ÎNAINTE: $($beforeResponse.name)"
    Write-Host "EMAIL ÎNAINTE: $($beforeResponse.email)"
    Write-Host "TELEFON ÎNAINTE: $($beforeResponse.phone)"
    
    # Test 2: Modifică booking-ul cu valoare unică
    Write-Host ""
    Write-Host "=== PAS 2: Modifică booking-ul ==="
    $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
    $testName = "TEST_DIRECT_$timestamp"
    $updateBody = "{`"name`":`"$testName`", `"email`":`"test_direct@email.com`", `"phone`":`"999999999`"}"
    
    Write-Host "Trimit modificările: $updateBody"
    Write-Host "ORA: $(Get-Date -Format 'HH:mm:ss')"
    
    $updateResponse = Invoke-RestMethod -Uri "http://localhost:8081/api/admin/bookings/1765476764436" -Method PATCH -Headers $headers -ContentType "application/json" -Body $updateBody
    Write-Host "Răspuns: $updateResponse"
    Write-Host "Success: $($updateResponse.success)"
    Write-Host "Message: $($updateResponse.message)"
    Write-Host "HasChanges: $($updateResponse.hasChanges)"
    
    # Test 3: Verifică imediat după modificare
    Write-Host ""
    Write-Host "=== PAS 3: Verifică imediat după modificare ==="
    $afterResponse = Invoke-RestMethod -Uri "http://localhost:8081/api/admin/bookings/1765476764436" -Method GET -Headers $headers
    Write-Host "NUME DUPĂ: $($afterResponse.name)"
    Write-Host "EMAIL DUPĂ: $($afterResponse.email)"  
    Write-Host "TELEFON DUPĂ: $($afterResponse.phone)"
    
    # Verifică dacă modificările sunt vizibile
    if ($afterResponse.name -eq $testName -and $afterResponse.email -eq "test_direct@email.com" -and $afterResponse.phone -eq "999999999") {
        Write-Host ""
        Write-Host "✅ MODIFICĂRILE SUNT VIZIBILE ÎN UI!"
        Write-Host "📝 Valoare test: $testName"
        Write-Host "⏰ Verifică în Google Sheets direct: https://docs.google.com/spreadsheets/d/1dy4hozgiP4CoTnasPyjR9o7_qgRMoank0V9_IbzDt90"
        Write-Host "🔍 Caută rândul cu ID: 1765476764436"
        Write-Host ""
        Write-Host "⚠️  IMPORTANT: Verifică MANUAL în Google Sheets dacă valorile sunt actualizate!"
        Write-Host "   Dacă în Google Sheets valorile sunt vechi, atunci problema este confirmată."
    } else {
        Write-Host ""
        Write-Host "❌ Modificările NU sunt vizibile nici măcar în UI!"
    }
    
} catch {
    Write-Host "EROARE: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $reader.BaseStream.Position = 0
        $reader.DiscardBufferedData()
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response: $responseBody"
    }
}