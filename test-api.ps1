# API Testing Script for HenryMo Technologies
# This script tests the main API endpoints

$baseUrl = "http://localhost:3000"
$token = ""

Write-Host "🧪 Testing HenryMo Technologies API" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Health Check (if available)
Write-Host "1. Testing Health Check..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/api/health" -Method GET -ErrorAction Stop
    Write-Host "   ✅ Health check passed" -ForegroundColor Green
    Write-Host "   Status: $($response.StatusCode)" -ForegroundColor Gray
} catch {
    Write-Host "   ⚠️  Health endpoint not available (this is OK)" -ForegroundColor Yellow
}
Write-Host ""

# Test 2: Get CMS Pages (Public endpoint)
Write-Host "2. Testing GET /api/cms/pages (Public)..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/cms/pages" -Method GET -ErrorAction Stop
    Write-Host "   ✅ Pages endpoint works" -ForegroundColor Green
    Write-Host "   Found $($response.Count) pages" -ForegroundColor Gray
} catch {
    Write-Host "   ❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 3: Login
Write-Host "3. Testing POST /api/auth/login..." -ForegroundColor Yellow
$loginBody = @{
    email = "admin@henrymo.tech"
    password = "admin123"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method POST -Body $loginBody -ContentType "application/json" -ErrorAction Stop
    $token = $response.token
    Write-Host "   ✅ Login successful" -ForegroundColor Green
    Write-Host "   Token received: $($token.Substring(0, 20))..." -ForegroundColor Gray
} catch {
    Write-Host "   ❌ Login failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   ⚠️  Make sure you have seeded the database with: npm run prisma:seed" -ForegroundColor Yellow
    exit
}
Write-Host ""

# Test 4: Get Current User (Protected)
Write-Host "4. Testing GET /api/auth/me (Protected)..." -ForegroundColor Yellow
$headers = @{
    "Authorization" = "Bearer $token"
}
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/auth/me" -Method GET -Headers $headers -ErrorAction Stop
    Write-Host "   ✅ Auth check works" -ForegroundColor Green
    Write-Host "   User: $($response.email) ($($response.role))" -ForegroundColor Gray
} catch {
    Write-Host "   ❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 5: Create CMS Page (Admin)
Write-Host "5. Testing POST /api/cms/pages (Admin)..." -ForegroundColor Yellow
$pageBody = @{
    title = "Test Page"
    slug = "test-page-$(Get-Date -Format 'yyyyMMddHHmmss')"
    content = "This is a test page created by the API test script"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/cms/pages" -Method POST -Body $pageBody -ContentType "application/json" -Headers $headers -ErrorAction Stop
    Write-Host "   ✅ Page created successfully" -ForegroundColor Green
    Write-Host "   Page ID: $($response.id), Slug: $($response.slug)" -ForegroundColor Gray
} catch {
    Write-Host "   ❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 6: Get Scheduled Posts
Write-Host "6. Testing GET /api/social/schedule..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/social/schedule" -Method GET -Headers $headers -ErrorAction Stop
    Write-Host "   ✅ Schedule endpoint works" -ForegroundColor Green
    Write-Host "   Found $($response.Count) scheduled posts" -ForegroundColor Gray
} catch {
    Write-Host "   ❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 7: Get Social Accounts
Write-Host "7. Testing GET /api/social/accounts..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/social/accounts" -Method GET -Headers $headers -ErrorAction Stop
    Write-Host "   ✅ Social accounts endpoint works" -ForegroundColor Green
    Write-Host "   Found $($response.Count) connected accounts" -ForegroundColor Gray
} catch {
    Write-Host "   ❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

Write-Host "====================================" -ForegroundColor Cyan
Write-Host "✅ API Testing Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  - Test OAuth flows: /api/social/connect/linkedin" -ForegroundColor Gray
Write-Host "  - Test file upload: POST /api/upload" -ForegroundColor Gray
Write-Host "  - View admin dashboard: http://localhost:3000/admin" -ForegroundColor Gray

