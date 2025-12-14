# Railway Full-Stack Deployment Guide

## 🚂 Complete Guide to Deploy HenryMo Technologies on Railway

Railway is perfect for deploying both your Next.js app and PostgreSQL database together!

---

## Step 1: Sign Up for Railway

1. Go to [railway.app](https://railway.app)
2. Click "Start a New Project" or "Login"
3. Sign up using **GitHub** (recommended) for easy deployment

---

## Step 2: Commit package-lock.json (IMPORTANT!)

Before deploying, make sure `package-lock.json` is committed to your repo:

```bash
git add package-lock.json
git commit -m "Add package-lock.json for Railway deployment"
git push
```

**Why?** Railway needs `package-lock.json` for reliable dependency installation.

## Step 3: Create New Project

1. From Railway dashboard, click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Connect your GitHub account (if not already connected)
4. Select your `HenryMo-Technologies` repository
5. Railway will detect Next.js and use **Nixpacks** (configured via `nixpacks.toml`)
6. Click **"Deploy Now"**

Railway will automatically detect it's a Next.js app and start the deployment process.

---

## Step 4: Add PostgreSQL Database

1. In your Railway project, click **"+ New"** button
2. Select **"Database"** → **"Add PostgreSQL"**
3. Railway will automatically provision a PostgreSQL database
4. The `DATABASE_URL` environment variable will be automatically created

**Note:** Railway automatically creates the `DATABASE_URL` variable that your app can use!

---

## Step 5: Configure Environment Variables

1. Click on your **Web Service** (the Next.js app)
2. Go to **"Variables"** tab
3. Add all required environment variables:

### Required Variables:

```env
NODE_ENV=production
PORT=3000
JWT_SECRET=your-very-strong-random-secret-key-here
JWT_REFRESH_SECRET=your-very-strong-refresh-secret-key-here
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

### Database (Auto-added by Railway):

- `DATABASE_URL` - Automatically set by Railway when you add PostgreSQL
- **Note:** Railway's DATABASE_URL already includes SSL, so no need to add `?sslmode=require`

### Email Service (Optional but Recommended):

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
EMAIL_FROM=your-email@gmail.com
```

### Storage (Cloudflare R2 or AWS S3 - Optional):

```env
CLOUDFLARE_R2_ACCESS_KEY_ID=your-access-key
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your-secret-key
CLOUDFLARE_R2_BUCKET_NAME=henrymo-storage
CLOUDFLARE_R2_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com
```

Or for AWS S3:

```env
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_S3_BUCKET_NAME=henrymo-storage
AWS_REGION=us-east-1
```

### Social Media (Optional):

```env
FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret
LINKEDIN_CLIENT_ID=your-linkedin-client-id
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret
INSTAGRAM_APP_ID=your-instagram-app-id
INSTAGRAM_APP_SECRET=your-instagram-app-secret
TWITTER_CLIENT_ID=your-twitter-client-id
TWITTER_CLIENT_SECRET=your-twitter-client-secret
```

### CORS Origins:

```env
ALLOWED_ORIGINS=https://your-domain.railway.app,https://henrymo.tech
```

**Important:**

- Generate strong secrets for JWT: `openssl rand -base64 32`
- Update CORS origins with your actual domain
- All variables are available to both your app and can be shared between services

---

## Step 6: Configure Build Settings

**IMPORTANT:** Railway must use **Nixpacks**, not Docker!

1. In Railway dashboard, click on your **Web Service**
2. Go to **"Settings"** tab
3. Scroll to **"Build"** section
4. Ensure **"Builder"** is set to **"Nixpacks"** (NOT Dockerfile)
5. If it shows "Dockerfile", change it to "Nixpacks"

**Note:** The `railway.json` and `nixpacks.toml` files ensure Nixpacks is used, but verify in dashboard!

Railway auto-detects Next.js, but verify these settings:

1. Click on your **Web Service**
2. Go to **"Settings"** tab
3. Verify:
   - **Build Command:** `npm run build`
   - **Start Command:** `npm start`
   - **Root Directory:** `./`
   - **Node Version:** `18` or `20` (set in `package.json` or Railway settings)

---

## Step 7: Generate Production Secrets

Before deployment, generate secure secrets:

```bash
# Generate JWT secrets (run locally)
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
# Run twice to get JWT_SECRET and JWT_REFRESH_SECRET
```

Copy the generated secrets and add them to Railway environment variables.

---

## Step 8: Deploy and Run Migrations

### Option A: Automatic Migration (Recommended)

Railway will automatically run the build. After first deployment:

1. Go to your **Web Service** in Railway
2. Click on **"Deployments"** tab
3. Find your latest deployment
4. Click **"View Logs"** to see build progress

### Option B: Manual Migration via Railway CLI

1. Install Railway CLI:

   ```bash
   npm install -g @railway/cli
   ```

2. Login to Railway:

   ```bash
   railway login
   ```

3. Link your project:

   ```bash
   railway link
   ```

4. Run migrations:

   ```bash
   railway run npm run prisma:generate
   railway run npx prisma migrate deploy
   ```

5. (Optional) Seed database:
   ```bash
   railway run npm run prisma:seed
   ```

---

## Step 9: Set Up Custom Domain (Optional)

1. In Railway dashboard, click on your **Web Service**
2. Go to **"Settings"** → **"Networking"**
3. Click **"Generate Domain"** to get a Railway domain (e.g., `your-app.up.railway.app`)
4. Or add a custom domain:
   - Click **"Custom Domain"**
   - Enter your domain (e.g., `henrymo.tech`)
   - Follow DNS configuration instructions
   - Railway automatically provides SSL certificates!

---

## Step 10: Configure Database Connection

Railway's PostgreSQL automatically provides SSL. If you need to verify:

1. Go to your **PostgreSQL** service in Railway
2. Click **"Variables"** tab
3. Check `DATABASE_URL` - it should look like:
   ```
   postgresql://postgres:password@containers-us-west-xxx.railway.app:5432/railway
   ```
4. Your Prisma schema should work without modification

---

## Step 10: Update Build Scripts (if needed)

Check `package.json` has these scripts:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:studio": "prisma studio"
  }
}
```

---

## Step 11: Post-Deployment Checklist

After deployment:

- [ ] ✅ Verify deployment is successful (check Railway logs)
- [ ] ✅ Run database migrations: `railway run npx prisma migrate deploy`
- [ ] ✅ Test homepage: `https://your-app.railway.app`
- [ ] ✅ Test admin login: `https://your-app.railway.app/admin/login`
- [ ] ✅ Create admin account (if not seeded)
- [ ] ✅ Test API endpoints
- [ ] ✅ Test file uploads
- [ ] ✅ Test contact form
- [ ] ✅ Verify database connection in Railway dashboard

---

## Step 12: Create Admin Account

If you haven't seeded the database, create admin account:

**Option 1: Via Railway CLI**

```bash
railway run node -e "
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();
async function main() {
  const hashedPassword = await bcrypt.hash('your-admin-password', 10);
  await prisma.user.create({
    data: {
      email: 'admin@henrymo.tech',
      password: hashedPassword,
      name: 'Admin User',
      role: 'ADMIN'
    }
  });
  console.log('Admin created!');
}
main().catch(console.error).finally(() => prisma.$disconnect());
"
```

**Option 2: Use Prisma Studio**

```bash
railway run npx prisma studio
# This opens a browser interface to manage your database
```

---

## Troubleshooting

### Build Fails

1. **Check Railway Logs:**

   - Go to your service → "Deployments" → "View Logs"
   - Look for error messages

2. **Common Issues:**
   - Missing environment variables
   - Node version mismatch (ensure Node 18+)
   - Prisma client not generated (add `prisma:generate` to build)

### Database Connection Errors

1. **Verify DATABASE_URL:**

   - Check it's set in Railway Variables
   - Ensure PostgreSQL service is running (not paused)

2. **Run Migrations:**
   ```bash
   railway run npx prisma migrate deploy
   ```

### App Crashes After Deployment

1. **Check Application Logs:**

   - Railway dashboard → Service → "Deployments" → "View Logs"

2. **Common Causes:**
   - Missing environment variables
   - Database migrations not run
   - Port configuration (Railway uses `PORT` env var automatically)

### File Uploads Not Working

1. **Check Storage Configuration:**
   - Verify Cloudflare R2 or AWS S3 credentials
   - Check bucket name and permissions
   - Ensure `public/uploads` directory exists (for local fallback)

---

## Railway Pricing

**Free Tier ($5 credit/month):**

- ✅ $5 free credit
- ✅ PostgreSQL database included
- ✅ Automatic SSL certificates
- ✅ Custom domains
- ✅ 500 hours of usage/month

**Starter Plan ($5/month + usage):**

- Everything in free tier
- More resources
- Better performance

**Note:** Railway charges per usage. Small projects usually stay within free tier!

---

## Environment Variables Summary

Copy this checklist and fill in your Railway Variables:

```
✅ DATABASE_URL (auto-added by Railway)
✅ NODE_ENV=production
✅ PORT=3000
✅ JWT_SECRET=<generate-strong-secret>
✅ JWT_REFRESH_SECRET=<generate-strong-secret>
✅ EMAIL_USER=<your-email>
✅ EMAIL_PASSWORD=<app-password>
✅ EMAIL_FROM=<your-email>
✅ CLOUDFLARE_R2_ACCESS_KEY_ID=<optional>
✅ CLOUDFLARE_R2_SECRET_ACCESS_KEY=<optional>
✅ CLOUDFLARE_R2_BUCKET_NAME=<optional>
✅ ALLOWED_ORIGINS=<your-domains>
```

---

## Quick Deploy Script

Create a quick deployment checklist:

1. ✅ Push code to GitHub
2. ✅ Connect repo to Railway
3. ✅ Add PostgreSQL database
4. ✅ Add all environment variables
5. ✅ Deploy (automatic)
6. ✅ Run migrations: `railway run npx prisma migrate deploy`
7. ✅ Seed database (optional): `railway run npm run prisma:seed`
8. ✅ Test deployment
9. ✅ Set up custom domain

---

## Monitoring Your Deployment

Railway provides:

- **Real-time logs:** View application logs live
- **Metrics:** CPU, memory, network usage
- **Deployment history:** View all deployments
- **Database metrics:** Connection count, queries, etc.

---

## Next Steps After Deployment

1. ✅ Set up monitoring (Railway has built-in monitoring)
2. ✅ Configure backups (Railway auto-backups PostgreSQL)
3. ✅ Set up CI/CD (automatic on git push)
4. ✅ Configure custom domain
5. ✅ Set up email notifications for deployments

---

## Need Help?

- Railway Docs: [docs.railway.app](https://docs.railway.app)
- Railway Discord: [discord.gg/railway](https://discord.gg/railway)
- Check Railway logs for specific errors

---

**You're all set!** Your Next.js app with PostgreSQL database will be running on Railway! 🚀
