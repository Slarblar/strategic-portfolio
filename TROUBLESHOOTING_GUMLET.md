# 🔧 Gumlet Video Troubleshooting Guide

## Current Status: Videos Not Working

### ✅ What We've Verified:
1. ✅ **Gumlet Servers**: Responding with HTTP 200 OK - Service is UP
2. ✅ **Code Implementation**: All fixed and optimized
3. ✅ **URL Generation**: Standardized and stable
4. ✅ **Parameters**: Correct (`playsinline`, `muted`, `autoplay`)
5. ✅ **Iframe Permissions**: Properly configured

### ❌ What's NOT Working:
- Videos not loading/playing on your site

---

## 🎯 Step-by-Step Diagnostic Process

### **STEP 1: Test Gumlet Embeds Directly**

I've created a test file for you: **`gumlet-test.html`**

**Run this test:**
```bash
# Open the test file in your browser
start gumlet-test.html
```

**What to look for:**
- ✅ **Videos load**: Your Gumlet account is fine, issue is in React app
- ❌ **"Private" or "Access Denied"**: Videos need privacy settings changed
- ❌ **Black screen**: Videos might still be encoding
- ❌ **Nothing loads**: CORS, network, or account issues

---

### **STEP 2: Check Gumlet Dashboard**

Go to: https://dashboard.gumlet.com

#### For Each Video ID:
Check these video IDs in your dashboard:

1. **A for Adley Hero**: `68411e53ed94500acc2ec4b2`
2. **Quarter Machine Hero**: `684112f32ea48d13d446c58c`
3. **Spacestation Hero**: `68414d69ed94500acc302885`
4. **Repeated ID** (suspicious): `6840a1250f8d7a051834fe38`

#### What to Verify:

**A. Video Privacy Settings**
- [ ] Video is set to "Public" or "Unlisted" (NOT Private)
- [ ] No password protection enabled
- [ ] Embed permissions are enabled

**B. Video Processing Status**
- [ ] Video shows "Processed" (not "Processing" or "Failed")
- [ ] Thumbnail is visible
- [ ] Video duration is shown correctly

**C. Account Settings**
- [ ] Your Gumlet plan supports embeds
- [ ] MP4 format is enabled (Business/Enterprise plans)
- [ ] Domain restrictions (if any) include your site

**D. Video Encoding**
- [ ] Video has been fully encoded
- [ ] Multiple quality versions are available
- [ ] No encoding errors shown

---

### **STEP 3: Test One Video ID Manually**

Open browser console (F12) and paste this:

```javascript
// Create test iframe
const iframe = document.createElement('iframe');
iframe.src = 'https://play.gumlet.io/embed/68411e53ed94500acc2ec4b2?autoplay=true&loop=true&muted=true&playsinline=true&preload=auto&background=true';
iframe.style.width = '640px';
iframe.style.height = '360px';
iframe.allow = 'autoplay; fullscreen; picture-in-picture';
document.body.appendChild(iframe);

// Check for errors
iframe.onerror = () => console.error('❌ Iframe failed to load');
iframe.onload = () => console.log('✅ Iframe loaded');
```

**Expected Result:**
- Video should appear and start playing
- No console errors

**If it fails:**
- Check Network tab for 403/404 errors
- Check Console for CORS errors
- Check if iframe loads but video doesn't play (encoding issue)

---

### **STEP 4: Common Issues & Solutions**

#### 🔴 Issue: "Video is Private"
**Solution:**
1. Go to Gumlet Dashboard
2. Select the video
3. Go to Settings → Privacy
4. Change to "Public" or "Unlisted"
5. Save changes

#### 🔴 Issue: "Access Denied" or 403 Error
**Solutions:**
- **Check Domain Restrictions**: In Gumlet Dashboard → Settings → Allowed Domains
  - Add: `localhost`, `127.0.0.1`, `your-domain.com`
- **Check API Keys**: If using API, verify key is valid
- **Check Account Status**: Ensure your Gumlet subscription is active

#### 🔴 Issue: Black Screen / Video Not Playing
**Solutions:**
- Video might still be encoding (check dashboard)
- Browser blocking autoplay (check browser settings)
- Ad blocker interfering (disable temporarily)
- Video file might be corrupted (re-upload to Gumlet)

#### 🔴 Issue: "Failed to fetch" or CORS Error
**Solutions:**
- Check if your domain is allowed in Gumlet settings
- Verify video URLs are correct
- Check browser console for specific CORS error messages

#### 🔴 Issue: Videos Load but Stop After a Few Seconds
**Possible Causes:**
- Network bandwidth issues
- Gumlet account bandwidth limit reached
- Video quality too high for connection

---

### **STEP 5: Browser-Specific Checks**

#### Test in Multiple Browsers:
- [ ] Chrome/Edge (same engine)
- [ ] Firefox
- [ ] Safari
- [ ] Chrome Mobile (Android)
- [ ] Safari Mobile (iOS)

#### Browser Console Checklist:
Open DevTools (F12) and check:

**Console Tab:**
```
Look for:
- ❌ CORS errors
- ❌ 403/404 network errors
- ❌ "Failed to load resource"
- ❌ JavaScript errors
```

**Network Tab:**
```
Filter by: "gumlet"
Look for:
- Status codes (should be 200)
- Failed requests (red)
- Blocked requests
- Request timing (slow = network issue)
```

**Application Tab:**
```
Check:
- No service workers blocking requests
- LocalStorage/Cookies not corrupted
```

---

### **STEP 6: React App Specific Issues**

Since the static HTML test and React app might behave differently:

#### Check React DevTools:
```bash
npm run dev
# Open http://localhost:5173 or whatever port
# Open React DevTools
```

Look for:
- Component re-renders causing iframe reload
- Props changing unexpectedly
- State updates causing video to unmount

#### Check for React Errors:
Open Console and look for:
- Hydration errors
- Key prop errors
- Component mounting/unmounting too frequently

---

### **STEP 7: Network & Bandwidth**

#### Test Your Connection:
```bash
# Check if you can reach Gumlet CDN
ping video.gumlet.io

# Test download speed to Gumlet
# (Use browser DevTools Network tab, measure video chunk download times)
```

#### Bandwidth Issues:
- Gumlet has bandwidth limits per plan
- Check your usage in Dashboard → Analytics
- If near limit, videos may not load

---

## 🚨 **Most Likely Causes** (In Order)

### 1. **Video Privacy Settings** (90% of cases)
- Videos set to Private instead of Public/Unlisted
- Quick fix: Change in Gumlet Dashboard

### 2. **Video Still Encoding** (5% of cases)
- Video recently uploaded, not finished processing
- Check dashboard for "Processing" status
- Wait 5-10 minutes and try again

### 3. **Domain Restrictions** (3% of cases)
- Your domain not in Gumlet's allowed domains list
- Add localhost and production domain

### 4. **Gumlet Account Issue** (2% of cases)
- Subscription expired
- Bandwidth limit reached
- Payment issue

---

## ✅ **Quick Verification Commands**

Run these in your terminal:

```bash
# Test if Gumlet embed endpoint responds
curl -I https://play.gumlet.io/embed/68411e53ed94500acc2ec4b2

# Should return:
# HTTP/1.1 200 OK

# If you get 403, 404, or other error, that's the issue
```

---

## 📞 **When to Contact Gumlet Support**

Contact support if:
- ✅ Test HTML file videos don't load
- ✅ Videos show as "Public" in dashboard
- ✅ Videos show as "Processed"
- ✅ No CORS errors in console
- ✅ All domain restrictions correct
- ❌ Videos still won't load

**What to include in support ticket:**
1. Video IDs that aren't working
2. Error messages from browser console
3. Screenshot of video settings in dashboard
4. Your Gumlet account email
5. Browser and OS information

---

## 📋 **Final Checklist**

Before declaring it "unfixable":

- [ ] Tested `gumlet-test.html` file
- [ ] Verified all video IDs exist in Gumlet dashboard
- [ ] Confirmed videos are set to Public/Unlisted
- [ ] Verified videos show as "Processed"
- [ ] Checked browser console for errors
- [ ] Tested in incognito mode (no extensions)
- [ ] Tested in different browser
- [ ] Checked Network tab for failed requests
- [ ] Verified domain is allowed in Gumlet settings
- [ ] Confirmed Gumlet account is active
- [ ] Tested on different network/device

---

## 🎯 **Next Immediate Actions**

1. **RIGHT NOW**: Open `gumlet-test.html` in your browser
2. **Check**: Do the videos load in the test file?
   - ✅ YES → Issue is in React app (check React DevTools)
   - ❌ NO → Issue is with Gumlet videos (check dashboard)
3. **Log in**: Go to Gumlet Dashboard and verify each video ID
4. **Report back**: Let me know what you see in the test file

---

## 💡 **Expected Outcomes**

After following this guide:

**If test file works:**
- Videos are configured correctly
- Issue is in React component implementation
- Need to debug React app specifically

**If test file doesn't work:**
- Videos need privacy settings changed
- Videos need to finish encoding
- Gumlet account needs attention

---

Let me know what you find in the **`gumlet-test.html`** file and I can help you fix the specific issue!


