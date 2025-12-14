# Fix Railway Builder - Force Nixpacks

## Problem
Railway is trying to use Dockerfile instead of Nixpacks, causing build failures.

## Solution: Change Builder in Railway Dashboard

**You MUST manually change the builder in Railway dashboard!**

### Steps:

1. **Go to Railway Dashboard:**
   - Visit [railway.app](https://railway.app)
   - Open your project

2. **Select Your Web Service:**
   - Click on your web service (not the database)

3. **Go to Settings:**
   - Click on **"Settings"** tab at the top

4. **Change Builder:**
   - Scroll down to **"Build"** section
   - Find **"Builder"** dropdown
   - **CHANGE** from "Dockerfile" to **"Nixpacks"**
   - Click **"Save"** or it auto-saves

5. **Redeploy:**
   - Go to **"Deployments"** tab
   - Click **"Redeploy"** on the latest deployment
   - OR push a new commit to trigger rebuild

## Alternative: Delete Dockerfile Backup

If Railway still detects Dockerfile:

```bash
# Delete the backup file completely
git rm Dockerfile.backup
git commit -m "Remove Dockerfile to force Nixpacks"
git push
```

## Verify Builder

After changing, check the build logs:
- Should show "Using Nixpacks" or "Detected Next.js"
- Should NOT show "Using Detected Dockerfile"

## Why This Happens

Railway caches the builder type when you first deploy. Even if you rename/delete Dockerfile, it may still use the cached builder setting.

**The fix is ALWAYS to manually change it in the dashboard settings.**

---

**After changing to Nixpacks, your build should succeed!** ✅

