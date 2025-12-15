# Test complet login/logout pentru admin

Write-Host "🧪 Test 1: Login admin..."
$loginBody = '{"email":"admin@spectra.com","password":"admin123"}'
$loginResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/admin/auth/login" -Method POST -ContentType "application/json" -Body $loginBody
$token = $loginResponse.token
Write-Host "✅ Login successful"

Write-Host "🧪 Test 2: Update booking (modificare permanenta)..."
$headers = @{"Authorization"="Bearer $token"}
$updateBody = '{"id":"1765476764436","name":"PERMANENT_TEST","date":"2025-12-25","time":"16:00"}'
$updateResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/admin/bookings/1765476764436" -Method PATCH -Headers $headers -ContentType "application/json" -Body $updateBody
Write-Host "✅ Update successful: $($updateResponse.message)"

Write-Host "🧪 Test 3: Verificare modificare in Google Sheets..."
$checkResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/test-sheets/debug-raw-structure" -Method GET
$firstRow = $checkResponse.firstRowData
Write-Host "📊 Current data in Google Sheets:"
Write-Host "  - ID: $($firstRow.col0)"
Write-Host "  - Name: $($firstRow.col1)"
Write-Host "  - Email: $($firstRow.col2)"
Write-Host "  - Date: $($firstRow.col4)"
Write-Host "  - Time: $($firstRow.col5)"

Write-Host "🧪 Test 4: Logout..."
# Simulăm logout prin invalidarea token-ului (în practică, clientul șterge token-ul)
$token = $null
$headers = @{}  
Write-Host "✅ Logout simulated (token cleared)"

Write-Host "🧪 Test 5: Re-login și verificare persistență..."
$loginResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/admin/auth/login" -Method POST -ContentType "application/json" -Body $loginBody
$newToken = $loginResponse.token
$newHeaders = @{"Authorization"="Bearer $newToken"}

# Verificăm din nou datele
$finalCheckResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/test-sheets/debug-raw-structure" -Method GET
$finalRow = $finalCheckResponse.firstRowData

Write-Host "📊 Final verification after re-login:"
Write-Host "  - ID: $($finalRow.col0)"
Write-Host "  - Name: $($finalRow.col1)"
Write-Host "  - Date: $($finalRow.col4)"
Write-Host "  - Time: $($finalRow.col5)"

# Verificăm dacă modificările persistă
if ($finalRow.col1 -eq "PERMANENT_TEST" -and $finalRow.col4 -eq "2025-12-25" -and $finalRow.col5 -eq "16:00") {
    Write-Host "✅ SUCCESS: All modifications are PERMANENT and persist after logout/login!"
} else {
    Write-Host "❌ FAILURE: Modifications did not persist"
}

Write-Host "🎉 Test complet finalizat!"