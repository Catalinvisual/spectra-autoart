# Test complet pentru admin - login și update booking

Write-Host "🧪 Testing admin login..."

try {
    # Login
    $loginBody = @{
        email = "admin@spectra.com"
        password = "admin123"
    } | ConvertTo-Json
    
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/admin/auth/login" -Method POST -ContentType "application/json" -Body $loginBody
    $token = $loginResponse.token
    
    Write-Host "✅ Login successful, token received"
    Write-Host "🔑 Token: $($token.Substring(0, 50))..."
    
    # Test update booking
    Write-Host "🧪 Testing booking update..."
    
    $headers = @{
        "Authorization" = "Bearer $token"
    }
    
    $updateBody = @{
        id = "1765476764436"
        name = "TEST_ADMIN_UPDATE"
        date = "2025-12-20"
        time = "14:30"
    } | ConvertTo-Json
    
    $updateResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/admin/bookings/1765476764436" -Method PATCH -Headers $headers -ContentType "application/json" -Body $updateBody
    
    Write-Host "✅ Booking update successful!"
    Write-Host "📊 Response: $($updateResponse | ConvertTo-Json -Depth 10)"
    
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $reader.BaseStream.Position = 0
        $reader.DiscardBufferedData()
        $responseBody = $reader.ReadToEnd()
        Write-Host "📄 Response: $responseBody"
    }
}