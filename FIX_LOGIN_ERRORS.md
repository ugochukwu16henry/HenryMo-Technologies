# Fix Login 500 Error - Action Plan

## 🔍 **Issues Identified**

1. ✅ **Database Connection**: WORKING (verified - pages endpoint works)
2. ❌ **Admin User**: May not exist (needs database seeding)
3. ❌ **Server Restart**: Required after code changes
4. ❌ **bcrypt Mismatch**: FIXED (login.js now uses bcryptjs to match seed.ts)

---

## ✅ **Fixes Already Applied**

1. ✅ **Fixed `lib/auth.ts`** - Changed to lazy JWT_SECRET loading
2. ✅ **Fixed `pages/api/auth/login.js`** - Changed from `bcrypt` to `bcryptjs` (matches seed.ts)
3. ✅ **Updated `package.json`** - Changed dependency from `bcrypt` to `bcryptjs`

---

## 📋 **Action Steps to Resolve**

### Step 1: Install Missing Dependencies

**⚠️ IMPORTANT**: Stop the server first (Ctrl+C in the terminal running `npm run dev`)

Then run:
```powershell
npm install bcryptjs tsx --save-dev
```

This will install:
- `bcryptjs` - For password hashing (matches seed.ts)
- `tsx` - For running TypeScript seed script

---

### Step 2: Seed the Database

After dependencies are installed, run:
```powershell
npm run prisma:seed
```

This will create:
- Admin user: `admin@henrymo.tech` / `admin123`
- Sample pages (home, about)
- Sample portfolio items

**Expected output**:
```
🌱 Seeding database...
✅ Created superadmin: admin@henrymo.tech
✅ Created pages: home about
✅ Created portfolio items
🎉 Seeding completed!
```

---

### Step 3: Restart the Server

Restart the development server to pick up all changes:
```powershell
npm run dev
```

The server needs to restart because:
- `lib/auth.ts` was modified (lazy JWT_SECRET loading)
- `pages/api/auth/login.js` was modified (bcryptjs import)
- New dependencies were installed

---

### Step 4: Test Login

After server restarts, test the login endpoint:
```powershell
$body = @{
    email = "admin@henrymo.tech"
    password = "admin123"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" `
    -Method POST `
    -Body $body `
    -ContentType "application/json"
```

**Expected response**:
```json
{
  "token": "eyJhbGc...",
  "user": {
    "id": 1,
    "email": "admin@henrymo.tech",
    "role": "SUPERADMIN"
  }
}
```

---

## 🔄 **Quick Fix Summary**

```powershell
# 1. Stop server (Ctrl+C)

# 2. Install dependencies
npm install bcryptjs tsx --save-dev

# 3. Seed database
npm run prisma:seed

# 4. Restart server
npm run dev

# 5. Test login (in new terminal)
$body = @{email="admin@henrymo.tech"; password="admin123"} | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method POST -Body $body -ContentType "application/json"
```

---

## ✅ **Verification Checklist**

After completing all steps, verify:

- [ ] Dependencies installed (`bcryptjs`, `tsx`)
- [ ] Database seeded (admin user exists)
- [ ] Server restarted
- [ ] Login endpoint returns 200 (not 500)
- [ ] Token received in response
- [ ] Can access protected endpoints with token

---

## 🐛 **If Still Failing**

If login still returns 500 after all steps:

1. **Check server logs** - Look at the terminal where `npm run dev` is running for error messages
2. **Verify .env file** - Ensure `JWT_SECRET` and `DATABASE_URL` are set
3. **Check database** - Verify PostgreSQL is running and accessible
4. **Verify user exists** - Check with Prisma Studio: `npm run prisma:studio`

---

**Last Updated**: $(Get-Date)  
**Status**: Ready to fix - Follow steps above

