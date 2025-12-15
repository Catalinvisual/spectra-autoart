$token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQHNwZWN0cmEuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzY1NzkwMzQxLCJleHAiOjE3NjU4NzY3NDF9.q-KoBnB98Oj8StG8aF8KMx7sU1IySIdgz"

$headers = @{
    "Authorization" = "Bearer $token"
}

$body = @{
    id = "1765476764436"
    name = "Antonia"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:8080/api/admin/bookings/1765476764436" -Method PATCH -Headers $headers -ContentType "application/json" -Body $body
    Write-Host "Success: $($response | ConvertTo-Json -Depth 10)"
} catch {
    Write-Host "Error: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $reader.BaseStream.Position = 0
        $reader.DiscardBufferedData()
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response: $responseBody"
    }
}