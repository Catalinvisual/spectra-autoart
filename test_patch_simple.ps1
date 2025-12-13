$headers = @{
    "Authorization" = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQHNwZWN0cmEuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzY1NTcwMzcwLCJleHAiOjE3NjU2NTY3NzB9.HjmuAFFgQbDIP5UwjlK_M_pndjdIPemuaLv3Z8D_d9g"
    "Content-Type" = "application/json"
}

$body = @{
    date = "2025-12-30"
    time = "14:30"
    status = "confirmed"
} | ConvertTo-Json

try {
    Write-Host "🧪 Testing PATCH request to server..."
    $response = Invoke-RestMethod -Uri "http://localhost:8081/api/admin/bookings/1765210107161" -Method Patch -Headers $headers -Body $body
    Write-Host "✅ Response: " $response
} catch {
    Write-Host "❌ Error: " $_.Exception.Message
    if ($_.Exception.Response) {
        Write-Host "Status Code: " $_.Exception.Response.StatusCode
    }
}