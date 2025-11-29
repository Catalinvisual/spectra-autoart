# Test pentru noul endpoint de update
$headers = @{
    "Authorization" = "Bearer YOUR_ADMIN_TOKEN"
    "Content-Type" = "application/json"
}

$body = @{
    active = $false
} | ConvertTo-Json

# Înlocuiește cu un ID real de imagine
$imageId = "samples/animals/cat"

Write-Host "🔄 Testing PUT /api/admin/gallery/${imageId}" -ForegroundColor Yellow
Write-Host "Request body: $body" -ForegroundColor Cyan

# Test actual update
try {
    $response = Invoke-RestMethod -Uri "http://localhost:8080/api/admin/gallery/${imageId}" -Method Put -Headers $headers -Body $body
    Write-Host "✅ Update response: $($response | ConvertTo-Json -Depth 10)" -ForegroundColor Green
} catch {
    Write-Host "❌ Update error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $reader.BaseStream.Position = 0
        $reader.DiscardBufferedData()
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response: $responseBody" -ForegroundColor Red
    }
}