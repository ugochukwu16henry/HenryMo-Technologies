# Railway Database Setup Script
# Tests connection and runs migrations for Railway

Write-Host "🚂 Railway Database Setup" -ForegroundColor Cyan
Write-Host ""

# Check if .env exists
if (-not (Test-Path .env)) {
    Write-Host "❌ .env file not found!" -ForegroundColor Red
    Write-Host "   Run: node setup-database.js first" -ForegroundColor Yellow
    exit 1
}

# Check if DATABASE_URL is set
$envContent = Get-Content .env -Raw
if ($envContent -notmatch 'DATABASE_URL="postgresql://') {
    Write-Host "❌ DATABASE_URL not found in .env!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please:" -ForegroundColor Yellow
    Write-Host "1. Go to Railway dashboard" -ForegroundColor White
    Write-Host "2. Click on your PostgreSQL service" -ForegroundColor White
    Write-Host "3. Go to Variables tab" -ForegroundColor White
    Write-Host "4. Copy DATABASE_URL" -ForegroundColor White
    Write-Host "5. Add it to your .env file" -ForegroundColor White
    Write-Host ""
    exit 1
}

# Check if it's Railway
if ($envContent -match 'railway\.app') {
    Write-Host "✅ Railway connection string detected" -ForegroundColor Green
} else {
    Write-Host "⚠️  Railway connection string not detected" -ForegroundColor Yellow
    Write-Host "   Make sure you're using Railway DATABASE_URL" -ForegroundColor Yellow
}

# Check for SSL
if ($envContent -match 'sslmode=require') {
    Write-Host "✅ SSL enabled" -ForegroundColor Green
} else {
    Write-Host "⚠️  SSL not enabled - adding it is recommended" -ForegroundColor Yellow
    Write-Host "   Add ?sslmode=require to your DATABASE_URL" -ForegroundColor Yellow
}

Write-Host ""

# Step 1: Test Connection
Write-Host "📡 Step 1: Testing Railway connection..." -ForegroundColor Cyan
try {
    node test-railway-connection.js
    if ($LASTEXITCODE -ne 0) {
        Write-Host ""
        Write-Host "❌ Connection test failed!" -ForegroundColor Red
        Write-Host "   Fix the connection issues above and try again" -ForegroundColor Yellow
        exit 1
    }
} catch {
    Write-Host "❌ Connection test failed" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Step 2: Generate Prisma Client
Write-Host "📦 Step 2: Generating Prisma Client..." -ForegroundColor Cyan
try {
    npm run prisma:generate
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Prisma generate failed" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Prisma Client generated" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to generate Prisma Client" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Step 3: Run Migrations
Write-Host "🗄️  Step 3: Running migrations..." -ForegroundColor Cyan
try {
    npm run prisma:migrate
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Migrations failed" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Migrations completed" -ForegroundColor Green
} catch {
    Write-Host "❌ Migration failed" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Step 4: Seed Database
Write-Host "🌱 Step 4: Seeding database..." -ForegroundColor Cyan
try {
    npm run prisma:seed
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Seeding failed" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Database seeded" -ForegroundColor Green
} catch {
    Write-Host "❌ Seeding failed" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🎉 Railway database setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Next Steps:" -ForegroundColor Cyan
Write-Host "   1. Start dev server: npm run dev" -ForegroundColor White
Write-Host "   2. Visit: http://localhost:3000/admin/login" -ForegroundColor White
Write-Host "   3. Login: admin@henrymo.tech / admin123" -ForegroundColor White
Write-Host ""
Write-Host "✨ Your database is now on Railway cloud!" -ForegroundColor Green
Write-Host ""

