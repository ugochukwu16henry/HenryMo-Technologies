# Database Setup Guide

This guide will help you set up your PostgreSQL database for the HenryMo Technologies project.

## Option 1: Local PostgreSQL (Recommended for Development)

### Step 1: Install PostgreSQL
- **Windows**: Download from [postgresql.org](https://www.postgresql.org/download/windows/)
- **macOS**: `brew install postgresql@14`
- **Linux**: `sudo apt-get install postgresql postgresql-contrib`

### Step 2: Create Database
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE henrymo_db;

# Create user (optional)
CREATE USER henrymo_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE henrymo_db TO henrymo_user;

# Exit
\q
```

### Step 3: Configure Environment
```bash
# Copy the example env file
cp env.example .env
```

Edit `.env` and set:
```env
DATABASE_URL="postgresql://henrymo_user:your_password@localhost:5432/henrymo_db?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
```

## Option 2: Cloud Database (Recommended for Production)

### Neon (Free Tier Available)
1. Sign up at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string
4. Add to `.env`:
   ```env
   DATABASE_URL="postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/henrymo_db?sslmode=require"
   ```

### Supabase (Free Tier Available)
1. Sign up at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings > Database
4. Copy the connection string (URI format)
5. Add to `.env`

### Railway
1. Sign up at [railway.app](https://railway.app)
2. Create new project > Add PostgreSQL
3. Copy the connection string
4. Add to `.env`

## Step 4: Run Migrations

Once your database is set up and `DATABASE_URL` is configured:

```bash
# Generate Prisma Client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Seed the database with initial data (admin user, sample pages)
npm run prisma:seed
```

## Step 5: Verify Setup

Check that everything works:

```bash
# Start the dev server
npm run dev

# Test the login endpoint (in another terminal)
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@henrymo.tech","password":"admin123"}'
```

You should receive a JWT token in the response.

## Default Admin Credentials

After seeding:
- **Email**: `admin@henrymo.tech`
- **Password**: `admin123`
- **Role**: `SUPERADMIN`

⚠️ **Change these in production!**

## Troubleshooting

### "Can't reach database server"
- Make sure PostgreSQL is running
- Check if `DATABASE_URL` is correct
- Verify firewall/network settings

### "Database does not exist"
- Create the database first (see Step 2 above)
- Or let Prisma create it by adding `?createDatabase=true` to your `DATABASE_URL`

### "Relation does not exist"
- Run migrations: `npm run prisma:migrate`
- Or reset database: `npx prisma migrate reset` (⚠️ This deletes all data!)

### "Prisma Client not generated"
- Run: `npm run prisma:generate`
- Restart your dev server

## Next Steps

Once the database is set up:
1. ✅ Test login at `/admin/login`
2. ✅ Access admin dashboard at `/admin`
3. ✅ Create CMS pages at `/admin/cms`
4. ✅ Test API endpoints

## Production Checklist

Before deploying:
- [ ] Use strong `JWT_SECRET` (generate with: `openssl rand -base64 32`)
- [ ] Change admin password
- [ ] Use SSL connection (`?sslmode=require` in DATABASE_URL)
- [ ] Enable connection pooling (for serverless)
- [ ] Set up database backups
