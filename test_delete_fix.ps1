# Test script pentru verificare ștergere imagine cu ruta corectă

Write-Host "🧪 Testare ștergere imagine cu ruta corectă..." -ForegroundColor Cyan

# Obține token admin
$loginResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/admin/auth/login" -Method Post -ContentType "application/json" -Body (@{
    email = "admin@example.com"
    password = "password123"
} | ConvertTo-Json)

$token = $loginResponse.token
Write-Host "✅ Token obținut: $($token.Substring(0,20))..." -ForegroundColor Green

# ID-ul imaginii de test (URL-encoded)
$imageId = "samples%2Fanimals%2Fcat"

Write-Host "🗑️ Testare ștergere imagine cu ID: $imageId" -ForegroundColor Yellow

# Testare ștergere cu ruta corectă /api/admin/gallery/
try {
    $deleteResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/admin/gallery/$imageId" -Method Delete -Headers @{
        "Authorization" = "Bearer $token"
    }
    
    Write-Host "✅ Imagine ștearsă cu succes!" -ForegroundColor Green
    Write-Host "Răspuns: $($deleteResponse | ConvertTo-Json -Depth 10)" -ForegroundColor White
} catch {
    Write-Host "❌ Eroare la ștergere:" -ForegroundColor Red
    Write-Host "Status: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    Write-Host "Mesaj: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $reader.BaseStream.Position = 0
        $reader.DiscardBufferedData()
        $responseBody = $reader.ReadToEnd()
        Write-Host "Răspuns complet: $responseBody" -ForegroundColor Red
    }
}