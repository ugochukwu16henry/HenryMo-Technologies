# Analytics Setup Guide

This guide will help you set up visitor tracking for your HenryMo Technologies app.

## 📊 Two Analytics Systems

Your app includes **two complementary analytics systems**:

1. **Built-in Analytics** - Stored in your database, viewable in Admin Dashboard
2. **Google Analytics** - Advanced analytics with geographic data, demographics, etc.

---

## 🔧 Setup Instructions

### Step 1: Run Database Migration

The analytics system requires a new database table. Run this migration:

```bash
npx prisma migrate dev --name add_page_views
```

Or if you're deploying to Railway, the migration will run automatically when you deploy.

### Step 2: Configure Google Analytics (Optional but Recommended)

#### Get Your Google Analytics Measurement ID:

1. Go to [analytics.google.com](https://analytics.google.com)
2. Click **"Start measuring"** or **"Admin"** → **"Create Property"**
3. Fill in:
   - Account name: `HenryMo Technologies`
   - Property name: `henrymo.tech` (or your domain)
   - Industry: `Technology`
   - Business size: Choose appropriate
4. Click **"Create"** and accept terms
5. Copy your **Measurement ID** (looks like `G-XXXXXXXXXX`)

#### Add to Railway:

1. Go to your Railway project dashboard
2. Click on your service
3. Go to **"Variables"** tab
4. Click **"+ New Variable"**
5. Add:
   - **Name**: `NEXT_PUBLIC_GA_ID`
   - **Value**: Your Measurement ID (e.g., `G-XXXXXXXXXX`)
6. Click **"Add"**
7. Railway will automatically redeploy your app

#### For Local Development:

Add to your `.env.local` file:

```
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

---

## 📈 Viewing Analytics

### Built-in Analytics Dashboard

1. Log into your admin panel: `https://your-domain.com/admin`
2. Click **"Analytics"** in the navigation
3. View:
   - Total page views
   - Unique visitors
   - Most visited pages
   - Recent activity
   - Average views per day

### Google Analytics Dashboard

1. Go to [analytics.google.com](https://analytics.google.com)
2. Select your property
3. View detailed reports including:
   - Geographic locations
   - Demographics
   - User flow
   - Traffic sources
   - Real-time visitors
   - And much more!

---

## 🍪 Cookie Consent

Analytics tracking respects user cookie consent:

- **Built-in tracking** only records page views if user accepts cookies
- **Google Analytics** only loads if user accepts cookies
- Users can decline cookies, and no tracking will occur

The cookie consent banner appears when users first visit your site.

---

## 🔍 What Gets Tracked

### Built-in Analytics tracks:

- Page URL visited
- Referrer (where visitor came from)
- User agent (browser/device info)
- Visitor ID (hashed for privacy)
- Timestamp

### Google Analytics tracks:

- All of the above, plus:
- Geographic location (country, city)
- Demographics (age, gender)
- Interests
- Device details
- User flow through site
- Conversion events
- And more...

---

## 📊 API Endpoints

### Built-in Analytics API:

- **GET** `/api/analytics?days=30` - Get analytics data

  - Parameters:
    - `days` (optional): Number of days to look back (default: 30)
  - Returns: Statistics, top pages, recent views

- **POST** `/api/track` - Track a page view
  - Body: `{ page, referrer, userAgent }`
  - Automatically called by the frontend

---

## 🚀 Testing

1. **Test cookie consent:**

   - Visit your site
   - Accept cookies
   - Check that analytics start tracking

2. **Test built-in analytics:**

   - Visit a few pages
   - Go to `/admin/analytics`
   - Verify your visits appear

3. **Test Google Analytics:**
   - Accept cookies
   - Visit your site
   - Go to Google Analytics → Realtime
   - You should see your visit

---

## ❓ Troubleshooting

### No analytics data showing:

1. **Check database migration:**

   ```bash
   npx prisma migrate status
   ```

2. **Check cookie consent:**

   - Clear your browser cookies
   - Visit site again
   - Accept cookies when prompted

3. **Check environment variables:**
   - In Railway, verify `NEXT_PUBLIC_GA_ID` is set
   - For local dev, check `.env.local`

### Google Analytics not working:

1. **Verify Measurement ID:**

   - Should start with `G-`
   - No extra spaces or characters

2. **Check browser console:**

   - Open DevTools (F12)
   - Look for errors in Console
   - Check Network tab for GA requests

3. **Verify cookie consent:**
   - Analytics only loads if cookies accepted
   - Check `localStorage.getItem('cookieConsent')` in console

---

## 🔒 Privacy & GDPR Compliance

- ✅ Cookie consent banner shown to all visitors
- ✅ Analytics only track if user consents
- ✅ IP addresses are hashed for privacy
- ✅ No personally identifiable information stored
- ✅ Users can decline tracking
- ✅ Privacy Policy page linked in cookie banner

---

## 📝 Notes

- Built-in analytics are **always available** and don't require external services
- Google Analytics requires an account but provides more detailed insights
- Both systems work together - you can use one or both
- Data is stored in your database for built-in analytics (no third-party dependency)
- Google Analytics data is stored by Google and accessible via their dashboard

---

## 🎯 Next Steps

1. ✅ Run the database migration
2. ✅ Set up Google Analytics (optional)
3. ✅ Visit your site and accept cookies
4. ✅ Check `/admin/analytics` to see your visits
5. ✅ Explore Google Analytics dashboard for detailed insights

Happy tracking! 📊
