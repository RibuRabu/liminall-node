$adminKey = Read-Host "Anna PROVISION_ADMIN_KEY"

$headers = @{
  "x-admin-key" = $adminKey
}

$response = Invoke-RestMethod `
  -Method Post `
  -Uri "https://liminall-node-engine.rkallio88.workers.dev/api/provision" `
  -Headers $headers

$response | ConvertTo-Json -Depth 10