$body = @{
    rowIndex = 0
    columnIndex = 1
    value = "Antonia"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:8080/api/test-sheets/test-update-cell-by-index" -Method POST -ContentType "application/json" -Body $body
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