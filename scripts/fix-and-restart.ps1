# Quick Fix and Restart Script

Write-Host "🔍 Running Full Audit and Fix..." -ForegroundColor Cyan

# Stop all Node processes
Write-Host "`n🛑 Stopping all Node processes..." -ForegroundColor Yellow
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# Clean build cache
Write-Host "🧹 Cleaning build cache..." -ForegroundColor Yellow
if (Test-Path ".next") {
    Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
    Write-Host "   ✅ Cleaned .next directory" -ForegroundColor Green
}

# Verify critical files exist
Write-Host "`n📋 Verifying critical files..." -ForegroundColor Yellow
$criticalFiles = @(
    "pages/_app.js",
    "pages/_document.js",
    "pages/_error.js",
    "pages/index.js",
    "pages/admin/index.js",
    "components/Header.js",
    "components/Footer.js"
)

foreach ($file in $criticalFiles) {
    if (Test-Path $file) {
        Write-Host "   ✅ $file" -ForegroundColor Green
    } else {
        Write-Host "   ❌ $file MISSING!" -ForegroundColor Red
    }
}

# Check environment file
Write-Host "`n🔐 Checking environment..." -ForegroundColor Yellow
if (Test-Path ".env") {
    Write-Host "   ✅ .env file exists" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  .env file not found - copy from env.example" -ForegroundColor Yellow
}

# Check dependencies
Write-Host "`n📦 Checking dependencies..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Write-Host "   ✅ node_modules exists" -ForegroundColor Green
} else {
    Write-Host "   ❌ node_modules missing - run: npm install" -ForegroundColor Red
    exit 1
}

Write-Host "`n✅ Audit complete! Starting dev server..." -ForegroundColor Green
Write-Host "`n🚀 Starting: npm run dev`n" -ForegroundColor Cyan

npm run dev

