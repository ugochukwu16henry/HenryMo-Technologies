# Railway Database Setup Guide

## Step 1: Sign Up for Railway

1. Go to [railway.app](https://railway.app)
2. Click "Start a New Project" or "Login" if you already have an account
3. Sign up using GitHub (recommended) or email

## Step 2: Create PostgreSQL Database

1. **Create a New Project**:
   - Click "New Project" from your dashboard
   - Select "Empty Project" or "Deploy from GitHub repo"

2. **Add PostgreSQL Database**:
   - Click "New" button in your project
   - Select "Database" → "Add PostgreSQL"
   - Railway will automatically provision a PostgreSQL database

3. **Get Connection String**:
   - Click on the PostgreSQL service you just created
   - Go to the "Variables" tab
   - Look for `DATABASE_URL` or `POSTGRES_URL`
   - Click "Copy" to copy the connection string
   
   It will look like:
   ```
   postgresql://postgres:password@containers-us-west-xxx.railway.app:5432/railway
   ```

## Step 3: Update Your .env File

1. Open your `.env` file in the project root

2. Replace the `DATABASE_URL` with your Railway connection string:

   ```env
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@containers-us-west-xxx.railway.app:5432/railway?sslmode=require"
   ```

   ⚠️ **Important**: Add `?sslmode=require` at the end for secure connection

3. Save the file

## Step 4: Run Migrations

Once your `.env` is updated:

```powershell
# Generate Prisma Client
npm run prisma:generate

# Run migrations to create tables
npm run prisma:migrate

# Seed database with initial data
npm run prisma:seed
```

## Step 5: Verify Connection

Test that everything works:

```powershell
# Start dev server
npm run dev

# In another terminal, test the connection
node test-auth.js
```

Or visit: http://localhost:3000/admin/login

---

## Railway Dashboard Features

- **Metrics**: View database usage and performance
- **Logs**: Check database logs in real-time
- **Settings**: Configure database settings
- **Backups**: Railway automatically handles backups
- **Scaling**: Easily scale your database as needed

## Railway Free Tier

Railway offers:
- ✅ $5 free credit per month
- ✅ PostgreSQL database included
- ✅ Automatic backups
- ✅ SSL/HTTPS support
- ✅ Multiple regions available

---

## Troubleshooting

### Connection Timeout
- Make sure `?sslmode=require` is in your connection string
- Check that Railway service is running (not paused)

### Authentication Failed
- Verify the connection string is correct
- Make sure you copied the full string including password

### Migration Errors
- Ensure your Railway database is running
- Check the connection string in `.env`
- Verify Prisma can connect: `npx prisma db pull` (should show tables)

---

## Quick Setup Checklist

- [ ] Signed up for Railway
- [ ] Created new project
- [ ] Added PostgreSQL database
- [ ] Copied `DATABASE_URL` from Railway
- [ ] Updated `.env` file with Railway connection string
- [ ] Added `?sslmode=require` to connection string
- [ ] Ran `npm run prisma:generate`
- [ ] Ran `npm run prisma:migrate`
- [ ] Ran `npm run prisma:seed`
- [ ] Tested connection with `node test-auth.js`

---

## Next Steps

Once Railway database is set up:
1. ✅ Your database is now in the cloud (accessible anywhere)
2. ✅ Automatic backups are enabled
3. ✅ Ready for deployment to production
4. ✅ Can connect from local development or production

You can now use the same database for both development and production! 🎉

