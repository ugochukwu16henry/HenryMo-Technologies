# Quick Fix Steps - Login Error

## ⚠️ **IMPORTANT: Stop Server First**

The server must be stopped before installing dependencies.

---

## 📝 **Step-by-Step Instructions**

### Step 1: Stop the Server
In the terminal where `npm run dev` is running:
- Press `Ctrl+C` to stop the server
- Wait for it to fully stop

### Step 2: Install Dependencies
```powershell
npm install bcryptjs tsx --save-dev
```

### Step 3: Seed Database
```powershell
npm run prisma:seed
```

Expected output:
```
🌱 Seeding database...
✅ Created superadmin: admin@henrymo.tech
✅ Created pages: home about
✅ Created portfolio items
🎉 Seeding completed!
```

### Step 4: Restart Server
```powershell
npm run dev
```

### Step 5: Test Login
In a new terminal (or after server starts):
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

---

## 🚀 **Quick Command Sequence**

```powershell
# 1. Stop server (Ctrl+C)

# 2. Install & Seed
npm install bcryptjs tsx --save-dev
npm run prisma:seed

# 3. Start server
npm run dev

# 4. Test (in new terminal)
$body = @{email="admin@henrymo.tech"; password="admin123"} | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method POST -Body $body -ContentType "application/json"
```

---

## ✅ **What Was Fixed**

1. ✅ `lib/auth.ts` - Lazy JWT_SECRET loading
2. ✅ `pages/api/auth/login.js` - Changed to bcryptjs
3. ✅ `package.json` - Updated dependency to bcryptjs

---

## 🐛 **If npm install still fails**

Try running PowerShell as Administrator, or:
```powershell
# Use npx (no install needed)
npx tsx prisma/seed.ts
```

Then manually install later when server is stopped.

