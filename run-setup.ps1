# Database Setup Script for Windows
# Run this script to set up your database

Write-Host "🔧 HenryMo Technologies - Database Setup" -ForegroundColor Cyan
Write-Host ""

# Check if .env exists
if (-not (Test-Path .env)) {
    Write-Host "❌ .env file not found!" -ForegroundColor Red
    Write-Host "   Run: node setup-database.js" -ForegroundColor Yellow
    exit 1
}

# Check if database connection string is set
$envContent = Get-Content .env -Raw
if ($envContent -notmatch 'DATABASE_URL="postgresql://') {
    Write-Host "⚠️  DATABASE_URL not configured in .env file" -ForegroundColor Yellow
    Write-Host "   Please update .env with your database connection string" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ .env file found" -ForegroundColor Green
Write-Host ""

# Step 1: Generate Prisma Client
Write-Host "📦 Step 1: Generating Prisma Client..." -ForegroundColor Cyan
try {
    npm run prisma:generate
    if ($LASTEXITCODE -ne 0) {
        Write-Host ""
        Write-Host "⚠️  Prisma generate failed. This might be because:" -ForegroundColor Yellow
        Write-Host "   1. Dev server is running (stop it with Ctrl+C)" -ForegroundColor Yellow
        Write-Host "   2. Another process is using Prisma files" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "   Try stopping all Node processes and run this script again." -ForegroundColor Yellow
        exit 1
    }
    Write-Host "✅ Prisma Client generated successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to generate Prisma Client" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Step 2: Run Migrations
Write-Host "🗄️  Step 2: Running database migrations..." -ForegroundColor Cyan
try {
    npm run prisma:migrate
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Migration failed. Check your DATABASE_URL in .env" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Migrations completed successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Migration failed" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Step 3: Seed Database
Write-Host "🌱 Step 3: Seeding database with initial data..." -ForegroundColor Cyan
try {
    npm run prisma:seed
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Seeding failed" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Database seeded successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Seeding failed" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🎉 Database setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Next Steps:" -ForegroundColor Cyan
Write-Host "   1. Start dev server: npm run dev" -ForegroundColor White
Write-Host "   2. Visit: http://localhost:3000/admin/login" -ForegroundColor White
Write-Host "   3. Login with: admin@henrymo.tech / admin123" -ForegroundColor White
Write-Host ""

