Write-Host "Waiting 3 minutes for deployment to complete..."
Start-Sleep -Seconds 180
Write-Host "Checking server status..."

try {
    $response = Invoke-WebRequest -Uri "https://spectraautoart.nl/api/health" -TimeoutSec 10
    Write-Host "Server is back online! Status: $($response.StatusCode)"
} catch {
    Write-Host "Server still not responding or error occurred"
    Write-Host "Error: $($_.Exception.Message)"
}

Write-Host "Now testing admin endpoints..."
node test_admin_with_auth.js