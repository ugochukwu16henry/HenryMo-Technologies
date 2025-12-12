# Complete Database Setup Guide

## Step 1: Choose Your Database Option

### Option A: Cloud Database (Recommended - Easiest) ⭐

Choose one of these free cloud database services:

#### Neon (Recommended)
1. **Sign up**: Go to [neon.tech](https://neon.tech) and create a free account
2. **Create project**: Click "Create Project"
3. **Get connection string**: 
   - Go to your project dashboard
   - Click on "Connection Details"
   - Copy the connection string (it will look like: `postgresql://user:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require`)

#### Supabase (Alternative)
1. **Sign up**: Go to [supabase.com](https://supabase.com) and create a free account
2. **Create project**: Click "New Project"
3. **Get connection string**:
   - Go to Settings > Database
   - Copy the "Connection string" (URI format)

### Option B: Local PostgreSQL

1. **Download PostgreSQL**: 
   - Windows: [postgresql.org/download/windows](https://www.postgresql.org/download/windows/)
   - Install with default settings
   - Remember the password you set for the `postgres` user

2. **Create Database**:
   ```powershell
   # Open PowerShell and run:
   psql -U postgres
   # Then in psql:
   CREATE DATABASE henrymo_db;
   \q
   ```

3. **Update .env**:
   ```
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/henrymo_db?schema=public"
   ```

---

## Step 2: Configure .env File

1. **Open your `.env` file** in the project root

2. **Update DATABASE_URL**:
   ```env
   # For Neon/Supabase (replace with your actual connection string):
   DATABASE_URL="postgresql://user:password@host:5432/dbname?sslmode=require"
   
   # For Local PostgreSQL:
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/henrymo_db?schema=public"
   ```

3. **Verify JWT_SECRET is set** (should be auto-generated if you ran setup script)

---

## Step 3: Run Database Migrations

```powershell
# Generate Prisma Client
npm run prisma:generate

# Run migrations to create tables
npm run prisma:migrate

# Seed database with initial data (admin user, sample pages)
npm run prisma:seed
```

---

## Step 4: Test the Setup

1. **Start the dev server** (if not already running):
   ```powershell
   npm run dev
   ```

2. **Test login**:
   - Visit: http://localhost:3000/admin/login
   - Email: `admin@henrymo.tech`
   - Password: `admin123`

3. **Test protected routes**:
   - After login, you should be redirected to `/admin`
   - Try accessing `/admin/cms` - should be protected
   - Try logging out and accessing `/admin` directly - should redirect to login

---

## Step 5: Test Protected Routes

### Manual Testing:

1. **Without Authentication**:
   - Open browser in incognito/private mode
   - Visit: http://localhost:3000/admin
   - Should redirect to `/admin/login`

2. **With Authentication**:
   - Login at `/admin/login`
   - Should see admin dashboard
   - Should see your email in the header

3. **API Testing** (optional):
   ```powershell
   # Login to get token
   $response = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" `
     -Method POST `
     -ContentType "application/json" `
     -Body '{"email":"admin@henrymo.tech","password":"admin123"}'
   
   $token = $response.token
   
   # Test protected API
   Invoke-RestMethod -Uri "http://localhost:3000/api/auth/me" `
     -Headers @{Authorization = "Bearer $token"}
   ```

---

## Troubleshooting

### "Can't reach database server"
- **Cloud**: Check your connection string is correct
- **Local**: Make sure PostgreSQL service is running
  ```powershell
  # Check if PostgreSQL is running
  Get-Service postgresql*
  ```

### "Database does not exist"
- Create the database first (see Option B above)
- Or use Neon/Supabase which creates it automatically

### "Relation does not exist"
- Run migrations: `npm run prisma:migrate`
- Or reset: `npx prisma migrate reset` (⚠️ deletes all data!)

### "Prisma Client not generated"
- Run: `npm run prisma:generate`
- Restart dev server

### "Authentication failed" in browser
- Check DATABASE_URL is correct in .env
- Make sure migrations ran successfully
- Verify seed data exists: `npm run prisma:seed`

---

## Quick Setup Commands

```powershell
# 1. Generate secure .env (if needed)
node setup-database.js

# 2. Setup database
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed

# 3. Start server
npm run dev
```

---

## Default Admin Credentials

After seeding:
- **Email**: `admin@henrymo.tech`
- **Password**: `admin123`
- **Role**: `SUPERADMIN`

⚠️ **IMPORTANT**: Change these credentials in production!

