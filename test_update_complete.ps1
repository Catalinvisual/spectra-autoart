# Test pentru noul endpoint de update cu token valid
$headers = @{
    "Authorization" = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc2NDQwNjk1NywiZXhwIjoxNzY0NDkzMzU3fQ.pQgG9zMthwOX-fngBW8A7DuiLNxereVIv5x5o1KbmVM"
    "Content-Type" = "application/json"
}

Write-Host "📋 Getting gallery images..." -ForegroundColor Yellow

try {
    $galleryResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/admin/gallery" -Method Get -Headers $headers
    Write-Host "✅ Found $($galleryResponse.Count) images" -ForegroundColor Green
    
    if ($galleryResponse.Count -gt 0) {
        $firstImage = $galleryResponse[0]
        Write-Host "🖼️ Testing with image: $($firstImage.id) - Active: $($firstImage.active)" -ForegroundColor Cyan
        
        # Toggle status
        $newStatus = !$firstImage.active
        $body = @{
            active = $newStatus
        } | ConvertTo-Json
        
        Write-Host "🔄 Updating image $($firstImage.id) to active=$newStatus" -ForegroundColor Yellow
        
        $updateResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/admin/gallery/$($firstImage.id)" -Method Put -Headers $headers -Body $body
        Write-Host "✅ Update successful: $($updateResponse | ConvertTo-Json -Depth 5)" -ForegroundColor Green
        
        # Verify update
        $verifyResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/admin/gallery" -Method Get -Headers $headers
        $updatedImage = $verifyResponse | Where-Object { $_.id -eq $firstImage.id }
        Write-Host "✅ Verification - Image $($updatedImage.id) now active: $($updatedImage.active)" -ForegroundColor Green
        
    } else {
        Write-Host "⚠️ No images found in gallery" -ForegroundColor Yellow
    }
    
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $reader.BaseStream.Position = 0
        $reader.DiscardBufferedData()
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response: $responseBody" -ForegroundColor Red
    }
}