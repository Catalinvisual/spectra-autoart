# Test simplu pentru ștergere imagine

Write-Host "🧪 Testare ștergere imagine..." -ForegroundColor Cyan

# Login
Write-Host "🔐 Login admin..." -ForegroundColor Yellow
$loginBody = '{"email":"admin@example.com","password":"password123"}'
$loginResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/admin/auth/login" -Method Post -ContentType "application/json" -Body $loginBody
$token = $loginResponse.token
Write-Host "✅ Token: $($token.Substring(0,20))..." -ForegroundColor Green

# Test ștergere
Write-Host "🗑️ Ștergere imagine..." -ForegroundColor Yellow
try {
    $headers = @{"Authorization"="Bearer $token"}
    $response = Invoke-RestMethod -Uri "http://localhost:8080/api/admin/gallery/samples%2Fanimals%2Fcat" -Method Delete -Headers $headers
    Write-Host "✅ Succes: $($response | ConvertTo-Json)" -ForegroundColor Green
} catch {
    Write-Host "❌ Eroare: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $stream = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($stream)
        $errorText = $reader.ReadToEnd()
        Write-Host "Detalii: $errorText" -ForegroundColor Red
    }
}