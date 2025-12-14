# Deployment Guide - Going Live with HenryMo Technologies

## 🚀 Recommended: Deploy to Vercel (Easiest for Next.js)

### Prerequisites
- GitHub account
- Vercel account (free at [vercel.com](https://vercel.com))
- Database (Railway, Render, or any PostgreSQL)

### Step 1: Prepare Your Repository

1. **Push your code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Ready for deployment"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Create `.vercelignore` file** (optional, to exclude files from deployment):
   ```
   node_modules
   .next
   .env.local
   .env.development
   .env.test
   ```

### Step 2: Set Up Database

**Option A: Railway (You already have this setup)**
- Follow `RAILWAY_SETUP.md` to create PostgreSQL database
- Copy the `DATABASE_URL` connection string

**Option B: Render**
- Go to [render.com](https://render.com)
- Create PostgreSQL database
- Copy connection string

### Step 3: Deploy to Vercel

1. **Go to Vercel:**
   - Visit [vercel.com](https://vercel.com)
   - Sign up/Login with GitHub

2. **Import Your Project:**
   - Click "Add New Project"
   - Select your GitHub repository
   - Click "Import"

3. **Configure Project:**
   - **Framework Preset:** Next.js (auto-detected)
   - **Root Directory:** `./` (default)
   - **Build Command:** `npm run build` (default)
   - **Output Directory:** `.next` (default)
   - **Install Command:** `npm install` (default)

4. **Add Environment Variables:**
   Click "Environment Variables" and add all variables from your `.env`:
   
   ```
   DATABASE_URL=your-railway-database-url?sslmode=require
   JWT_SECRET=your-production-jwt-secret
   JWT_REFRESH_SECRET=your-production-refresh-secret
   NODE_ENV=production
   PORT=3000
   
   # Add all other variables from env.example
   EMAIL_USER=...
   EMAIL_PASSWORD=...
   CLOUDFLARE_R2_ACCESS_KEY_ID=...
   CLOUDFLARE_R2_SECRET_ACCESS_KEY=...
   CLOUDFLARE_R2_BUCKET_NAME=...
   # ... etc
   ```

5. **Deploy:**
   - Click "Deploy"
   - Wait for build to complete (3-5 minutes)
   - Your site will be live at `your-project.vercel.app`

### Step 4: Run Database Migrations

After first deployment, run migrations:

1. **Option 1: Via Vercel CLI**
   ```bash
   npm install -g vercel
   vercel login
   vercel link
   vercel env pull .env.production
   npm run prisma:generate
   npx prisma migrate deploy
   ```

2. **Option 2: Local connection to production DB**
   - Use your production `DATABASE_URL` locally
   - Run: `npx prisma migrate deploy`
   - ⚠️ Only do this if your local machine is secure

3. **Option 3: Use Prisma Studio Cloud (Recommended)**
   - Vercel supports running scripts during deployment
   - Add to `package.json`:
   ```json
   "vercel-build": "prisma generate && prisma migrate deploy && next build"
   ```

### Step 5: Set Up Custom Domain (Optional)

1. In Vercel dashboard, go to your project
2. Click "Settings" → "Domains"
3. Add your domain (e.g., `henrymo.tech`)
4. Follow DNS configuration instructions
5. SSL certificate is automatic!

---

## 🚂 Alternative: Deploy to Railway (Full Stack)

### Step 1: Set Up Railway Project

1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Connect your repository

### Step 2: Configure Services

1. **Add PostgreSQL Database:**
   - Click "New" → "Database" → "Add PostgreSQL"
   - Railway auto-creates `DATABASE_URL`

2. **Add Web Service:**
   - Click "New" → "GitHub Repo"
   - Select your repository
   - Railway auto-detects Next.js

### Step 3: Configure Environment Variables

In Railway dashboard, add environment variables:
- Copy all from your `.env.example`
- Railway automatically provides `DATABASE_URL`

### Step 4: Configure Build Settings

In Railway web service settings:
- **Build Command:** `npm run build`
- **Start Command:** `npm start`
- **Root Directory:** `./`

### Step 5: Run Migrations

Add a one-time command in Railway:
1. Go to your web service
2. Click "Settings" → "Deploy"
3. Add deploy script or use Railway CLI:
   ```bash
   railway run npm run prisma:migrate
   ```

---

## 🔧 Post-Deployment Checklist

- [ ] Database migrations run successfully
- [ ] Environment variables configured
- [ ] Admin account created/seeded
- [ ] Test admin login: `/admin/login`
- [ ] Test API endpoints
- [ ] Test file uploads
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active
- [ ] Test contact form
- [ ] Test blog functionality
- [ ] Test portfolio items

---

## 📝 Environment Variables for Production

Make sure these are set in your deployment platform:

**Required:**
```
DATABASE_URL=postgresql://...?sslmode=require
JWT_SECRET=<generate-strong-random-string>
JWT_REFRESH_SECRET=<generate-strong-random-string>
NODE_ENV=production
```

**Recommended:**
```
EMAIL_USER=your-email@domain.com
EMAIL_PASSWORD=your-app-password
CLOUDFLARE_R2_ACCESS_KEY_ID=...
CLOUDFLARE_R2_SECRET_ACCESS_KEY=...
CLOUDFLARE_R2_BUCKET_NAME=henrymo-storage
```

**Optional (Social Media):**
```
FACEBOOK_APP_ID=...
LINKEDIN_CLIENT_ID=...
INSTAGRAM_APP_ID=...
TWITTER_CLIENT_ID=...
```

---

## 🛠️ Troubleshooting

### Build Fails
- Check build logs in Vercel/Railway dashboard
- Ensure all dependencies are in `package.json`
- Verify Node.js version (should be 18+)

### Database Connection Errors
- Verify `DATABASE_URL` is correct
- Ensure `?sslmode=require` is added for Railway
- Check database is running (not paused)

### Environment Variables Not Working
- Ensure variables are set in deployment platform (not just local `.env`)
- Redeploy after adding new variables
- Check variable names match exactly (case-sensitive)

### Prisma Errors
- Run `npm run prisma:generate` before build
- Ensure migrations are run: `npx prisma migrate deploy`
- Check Prisma schema matches database

---

## 🎯 Quick Start (Vercel - 5 minutes)

1. Push code to GitHub
2. Import to Vercel
3. Add `DATABASE_URL` and `JWT_SECRET` environment variables
4. Deploy
5. Run migrations: `npx prisma migrate deploy --schema=./prisma/schema.prisma`
6. Done! 🎉

---

## 💰 Cost Estimate

**Vercel Free Tier:**
- ✅ 100GB bandwidth/month
- ✅ Unlimited deployments
- ✅ Custom domains
- ✅ SSL certificates
- 💰 $0/month for small projects

**Railway Free Tier:**
- ✅ $5 credit/month
- ✅ PostgreSQL database
- ⚠️ May need paid plan for production traffic

**Recommended for Production:**
- Vercel Hobby: $0/month (free tier is usually enough)
- Railway Starter: ~$5-10/month
- Total: ~$5-10/month

---

## 🔒 Security Checklist for Production

- [ ] Use strong, random `JWT_SECRET` and `JWT_REFRESH_SECRET`
- [ ] Enable HTTPS only
- [ ] Set secure cookie settings
- [ ] Use environment variables (never commit secrets)
- [ ] Enable database SSL (`?sslmode=require`)
- [ ] Set up proper CORS origins
- [ ] Enable rate limiting
- [ ] Regular backups of database
- [ ] Monitor for security updates

---

## 📞 Need Help?

If deployment fails:
1. Check build logs in your platform's dashboard
2. Verify all environment variables are set
3. Ensure database is accessible
4. Check Prisma migrations are complete

Good luck with your deployment! 🚀

