$headers = @{
    "Authorization" = "Bearer Qfubr9jqdD7U5bhURNdHDHcJ8XTQCjJQKxzAF9SW"
    "Content-Type"  = "application/json"
}
$body = Get-Content -Raw -Path "cf_project.json"
try {
    $response = Invoke-RestMethod -Uri "https://api.cloudflare.com/client/v4/accounts/124354f269a25de1edc370340a02fb76/pages/projects" -Headers $headers -Method Post -Body $body
    $response | ConvertTo-Json -Depth 10
} catch {
    Write-Error $_
}
