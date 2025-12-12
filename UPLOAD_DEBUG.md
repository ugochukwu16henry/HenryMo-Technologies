# 🔍 Upload Debugging Guide

## ❌ Common Upload Issues

### Issue 1: Windows Temp Directory
**Problem**: Code was using `/tmp` which doesn't exist on Windows
**Fix**: Now uses `os.tmpdir()` which works on all platforms

### Issue 2: Directory Not Created
**Problem**: `public/uploads` directory might not exist
**Fix**: Code now auto-creates the directory if it doesn't exist

### Issue 3: Database Not Required
**Note**: The upload API does NOT use the database. It only:
- Receives the file
- Validates admin authentication
- Saves to local storage OR R2/S3
- Returns the file URL

---

## 🔧 How to Debug

### Check Browser Console
1. Open browser DevTools (F12)
2. Go to Console tab
3. Try uploading an image
4. Look for error messages

### Check Server Logs
1. Look at the terminal where `npm run dev` is running
2. Check for error messages like:
   - "Upload error: ..."
   - "Error details: ..."

### Test Upload API Directly
```javascript
// In browser console
const formData = new FormData();
formData.append('file', fileInput.files[0]);

fetch('/api/upload', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
  },
  body: formData
})
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);
```

---

## ✅ What I Fixed

1. **Windows Compatibility**: Changed `/tmp` to `os.tmpdir()`
2. **Better Error Messages**: Now shows error details in development
3. **Auto-create directories**: Ensures `public/uploads` exists

---

## 🧪 Test It

1. Make sure you're logged in as admin
2. Go to Portfolio → Add/Edit Item
3. Click "Select Image"
4. Choose an image file
5. Wait for upload to complete
6. Check if preview appears

---

## 📋 Common Error Messages

### "Admin access required"
- **Cause**: Not logged in or token expired
- **Fix**: Log in again at `/admin/login`

### "No file uploaded"
- **Cause**: File input is empty
- **Fix**: Make sure you selected a file

### "File upload failed"
- **Cause**: Could be many things
- **Fix**: Check server logs for detailed error

### "Image size must be less than 10MB"
- **Cause**: File too large
- **Fix**: Use a smaller image or compress it

---

## 🔍 Next Steps if Still Failing

1. Check the exact error message in browser console
2. Check server terminal for error logs
3. Verify you're logged in as admin
4. Try uploading a very small image first
5. Check if `public/uploads` directory exists and is writable

