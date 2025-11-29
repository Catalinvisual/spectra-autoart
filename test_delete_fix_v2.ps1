# Test script pentru verificare ștergere imagine cu ruta corectă

Write-Host "🧪 Testare ștergere imagine cu ruta corectă..." -ForegroundColor Cyan

# Obține token admin
Write-Host "🔐 Obținere token admin..." -ForegroundColor Yellow
try {
    $loginBody = @{
        email = "admin@example.com"
        password = "password123"
    } | ConvertTo-Json
    
    Write-Host "📤 Trimitere request login cu body: $loginBody" -ForegroundColor Gray
    
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/admin/auth/login" -Method Post -ContentType "application/json" -Body $loginBody
    
    Write-Host "✅ Răspuns login: $($loginResponse | ConvertTo-Json -Depth 10)" -ForegroundColor Green
    
    $token = $loginResponse.token
    if (-not $token) {
        throw "Token nu a fost returnat în răspuns"
    }
    
    Write-Host "✅ Token obținut: $($token.Substring(0,20))..." -ForegroundColor Green
} catch {
    Write-Host "❌ Eroare la obținerea token-ului:" -ForegroundColor Red
    Write-Host "Status: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    Write-Host "Mesaj: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# ID-ul imaginii de test (URL-encoded)
$imageId = "samples%2Fanimals%2Fcat"

Write-Host "🗑️ Testare ștergere imagine cu ID: $imageId" -ForegroundColor Yellow

# Testare ștergere cu ruta corectă /api/admin/gallery/
try {
    $headers = @{
        "Authorization" = "Bearer $token"
    }
    
    Write-Host "📤 Trimitere request DELETE către: http://localhost:8080/api/admin/gallery/$imageId" -ForegroundColor Gray
    Write-Host "📋 Headers: $($headers | ConvertTo-Json)" -ForegroundColor Gray
    
    $deleteResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/admin/gallery/$imageId" -Method Delete -Headers $headers
    
    Write-Host "✅ Imagine ștearsă cu succes!" -ForegroundColor Green
    Write-Host "Răspuns: $($deleteResponse | ConvertTo-Json -Depth 10)" -ForegroundColor White
} catch {
    Write-Host "❌ Eroare la ștergere:" -ForegroundColor Red
    Write-Host "Status: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    Write-Host "Mesaj: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.Exception.Response) {
        try {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            $reader.BaseStream.Position = 0
            $reader.DiscardBufferedData()
            $responseBody = $reader.ReadToEnd()
            Write-Host "Răspuns complet: $responseBody" -ForegroundColor Red
        } catch {
            Write-Host "Nu s-a putut citi răspunsul complet" -ForegroundColor Red
        }
    }
}