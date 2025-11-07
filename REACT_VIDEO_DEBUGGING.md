# 🔍 React Video Debugging Guide

## Issue: Videos Work in Static HTML But NOT in React

### ✅ Confirmed Working:
- `gumlet-test.html` - Videos load and play correctly
- Gumlet servers are responding
- Video IDs are valid
- Privacy settings are correct

### ❌ Not Working:
- React application - Videos not playing

---

## 🎯 This Tells Us:

The problem is **React-specific**, not Gumlet-specific. Possible causes:

1. **React StrictMode** - Causing double renders/unmounts
2. **CSS Interference** - Styles hiding or blocking videos
3. **Component Lifecycle** - Videos mounting/unmounting incorrectly
4. **State Management** - Re-renders changing video URLs
5. **Event Handlers** - Preventing video interaction
6. **Dev Server** - Different behavior than production

---

## 🧪 Diagnostic Test Page Created

I've created a test page within your React app: **`/video-test`**

### How to Use:

1. **Start your dev server** (if not already running):
   ```bash
   npm run dev
   ```

2. **Navigate to the test page**:
   ```
   http://localhost:5173/video-test
   ```

3. **Check the results:**
   - Do videos show "loaded" status?
   - Check browser console (F12) for errors
   - Look for CORS, CSP, or iframe errors
   - Check Network tab for failed requests

---

## 🔍 What to Look For

### In Browser Console (F12):

**Good Signs (✅):**
```
[VideoTest] VideoTest component mounted
[VideoTest] ✅ Video 68411e53ed94500acc2ec4b2 loaded successfully
```

**Bad Signs (❌):**
```
Blocked by Content Security Policy
Failed to load resource: net::ERR_BLOCKED_BY_CLIENT
Cross-Origin Request Blocked
iframe refused to connect
```

### In Network Tab (F12):

Filter by: **play.gumlet.io**

**Check for:**
- Status codes (should be 200)
- Failed requests (red)
- Blocked requests
- CORS errors

---

## 🐛 Common React-Specific Issues

### Issue 1: React StrictMode Double Mounting

**Problem:** React StrictMode mounts components twice in development, which can cause videos to fail.

**Check in Console:**
```javascript
// You should see this ONCE, not TWICE:
[VideoTest] VideoTest component mounted
```

**Temporary Fix:** Disable StrictMode (ONLY for testing)
```jsx
// In src/main.jsx
ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>  // Comment out
    <App />
  // </React.StrictMode>
);
```

### Issue 2: CSS pointer-events: none

**Problem:** CSS might be blocking iframe interaction

**Check:** Look for this in DevTools → Elements:
```css
iframe {
  pointer-events: none;  /* This blocks interaction */
}
```

**Found in your code:** `src/index.css` has some `pointer-events: none` rules

### Issue 3: Component Re-renders

**Problem:** Component re-rendering too frequently, causing iframe to reload

**Check Console for:**
- Multiple "mounted" messages
- Videos loading repeatedly
- URLs changing

### Issue 4: Browser Autoplay Policy

**Problem:** Browsers block autoplay in certain contexts

**Check:**
- Videos must be muted for autoplay
- `allow` attribute must include "autoplay"
- `playsinline` must be true

---

## 🔧 Quick Fixes to Try

### Fix 1: Disable StrictMode (Temporarily)

```jsx
// src/main.jsx
ReactDOM.createRoot(document.getElementById('root')).render(
  <App />  // Without StrictMode wrapper
);
```

### Fix 2: Force Video Interaction

Add a "Click to Play" button as a workaround for autoplay restrictions.

### Fix 3: Check for CSS Conflicts

```javascript
// In browser console:
document.querySelectorAll('iframe').forEach(iframe => {
  console.log('iframe:', iframe.src);
  console.log('pointer-events:', getComputedStyle(iframe).pointerEvents);
  console.log('display:', getComputedStyle(iframe).display);
  console.log('opacity:', getComputedStyle(iframe).opacity);
});
```

### Fix 4: Try Without PageTransition

PageTransition component might be causing issues. Test without it:

```jsx
<Route path="/video-test" element={<VideoTest />} />  // No PageTransition
```

---

## 📋 Debugging Checklist

### Step 1: Visit Test Page
- [ ] Go to `http://localhost:5173/video-test`
- [ ] Do videos appear?
- [ ] Do they show "loaded" status?

### Step 2: Check Console
- [ ] Open DevTools (F12)
- [ ] Any red errors?
- [ ] Any CSP/CORS warnings?
- [ ] Any iframe errors?

### Step 3: Check Network
- [ ] Filter: `play.gumlet.io`
- [ ] All requests status 200?
- [ ] Any blocked requests?
- [ ] Any failed requests?

### Step 4: Check Elements
- [ ] Inspect iframe elements
- [ ] Check computed styles
- [ ] Look for `display: none`
- [ ] Look for `opacity: 0`
- [ ] Look for `pointer-events: none`

### Step 5: Compare Behavior
- [ ] Does `gumlet-test.html` still work?
- [ ] What's different in React version?
- [ ] Same browser?
- [ ] Same network?

---

## 🎯 Next Steps Based on Results

### If Videos Load on Test Page ✅

**Good News!** Your code is correct. The issue is:
- Component-specific (not global)
- Likely in specific page implementations
- Possibly in wrapper components

**Action:** Check specific pages like `AForAdleyCase.jsx`

### If Videos DON'T Load on Test Page ❌

**Issue is Global.** Possible causes:
1. React StrictMode interference
2. Global CSS blocking iframes
3. Vite dev server configuration
4. Browser extension blocking

**Action:** 
1. Try disabling StrictMode
2. Check for browser extensions (test in incognito)
3. Check Vite configuration

---

## 💡 Most Likely Issue: React StrictMode

React StrictMode in development causes components to mount twice, which can break video players.

**Evidence:**
- Static HTML works ✅
- Same code in React doesn't ❌
- Only happens in development

**Solution:**
1. Test without StrictMode
2. If that fixes it, we need to make components StrictMode-safe
3. For production build, StrictMode doesn't cause issues

---

## 🚀 Quick Test Commands

```bash
# 1. Ensure dev server is running
npm run dev

# 2. Open test page
# Navigate to: http://localhost:5173/video-test

# 3. Open browser console
# Press F12, go to Console tab

# 4. Check for errors
# Look for red error messages

# 5. Test in incognito
# Ctrl+Shift+N (Windows) or Cmd+Shift+N (Mac)
```

---

## 📞 Report Back With:

1. **Test Page Results:**
   - Do videos appear? (Yes/No)
   - Do they show "loaded"? (Yes/No)

2. **Console Errors:**
   - Any red errors? (Copy/paste them)
   - Any warnings about iframes?

3. **Network Tab:**
   - Do requests to `play.gumlet.io` succeed?
   - Status codes?

4. **Behavior:**
   - Do videos play automatically?
   - Can you see the video player?
   - Is there a black box where video should be?

---

This will help us identify the exact cause and fix it quickly!


