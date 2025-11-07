# Gumlet Video Loading Issues - Comprehensive Audit

## Date: November 7, 2025

## Executive Summary
After a thorough audit of all Gumlet video implementations across the portfolio site, I've identified several critical issues that are preventing videos from loading properly.

---

## 🔴 Critical Issues Identified

### 1. **Inconsistent Parameter Usage**
Different components are using different parameter combinations, leading to unpredictable behavior:

**Problem Components:**
- `GumletPlayer.jsx` - Missing `playsinline` parameter
- `VideoBackground.jsx` - Using deprecated `quality` parameter
- `ModularVideoPlayer.jsx` - Using `preload=metadata` which delays loading
- `UniversalVideoBackground.jsx` - Conflicting autoplay logic
- `ProjectCardVideo.jsx` - Missing critical parameters

**Correct Gumlet Parameters:**
```
https://play.gumlet.io/embed/{VIDEO_ID}?
  autoplay=true          // Required for background videos
  loop=true              // For continuous playback
  muted=true             // REQUIRED for autoplay to work
  playsinline=true       // CRITICAL for mobile devices
  preload=auto           // Better than 'metadata' or 'true'
  background=true        // Hides controls
```

### 2. **Missing or Incorrect iframe `allow` Attribute**
The `allow` attribute must include specific permissions for Gumlet videos to work:

**Current (Incorrect):**
```jsx
allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen"
```

**Should Be:**
```jsx
allow="autoplay; fullscreen; picture-in-picture; encrypted-media; clipboard-write"
```

**Key Changes:**
- `autoplay` MUST be first
- Remove `accelerometer` and `gyroscope` (not needed, can cause issues)
- Add `clipboard-write` for some Gumlet features

### 3. **Autoplay Policy Violations**
Browsers block autoplay unless specific conditions are met:
- Video MUST be muted
- `playsinline` MUST be present (especially on iOS)
- `autoplay` attribute must be in the `allow` list

**Affected Files:**
- All case study pages (AForAdleyCase.jsx, QuarterMachineCase.jsx, SpacestationAnimationCase.jsx)
- ProjectDetails.jsx
- ModularVideoPlayer.jsx
- FlexibleVideoPlayer.jsx

### 4. **Hardcoded Video IDs**
Some pages have hardcoded Gumlet video IDs that appear multiple times with the same ID:

**Repeated Video ID: `6840a1250f8d7a051834fe38`**
- Found in: AForAdleyCase.jsx (lines 217, 331)
- Found in: SpacestationAnimationCase.jsx (lines 225, 346)
- Found in: ProjectDetails.jsx (line 445)

This suggests these might be placeholder videos or test videos that should be replaced with actual project videos.

### 5. **Parameter Conflicts**
Using `background=true` with other parameters can cause conflicts:

**Conflicting Combinations Found:**
```javascript
// WRONG - disable_player_controls conflicts with background
background=true&disable_player_controls=true

// RIGHT - background=true already hides controls
background=true
```

### 6. **Quality Parameter Issues**
The `quality` parameter in VideoBackground.jsx might not be supported by Gumlet:

```javascript
// In VideoBackground.jsx - line 61
quality=${quality}  // This might not work with Gumlet
```

---

## 📍 Affected Components & Files

### **High Priority (Broken)**
1. ✅ `src/components/VideoBackground.jsx` - Hero backgrounds not loading
2. ✅ `src/components/ModularVideoPlayer.jsx` - Approach section videos failing
3. ✅ `src/components/UniversalVideoBackground.jsx` - Case study heroes broken
4. ✅ `src/components/FlexibleVideoPlayer.jsx` - Supporting videos not playing
5. ✅ `src/components/ProjectCardVideo.jsx` - Archive card videos broken

### **Medium Priority (Partially Working)**
6. ⚠️ `src/components/AdleyVideoBackground.jsx` - May have loading delays
7. ⚠️ `src/components/BaseVideoBackground.jsx` - Inconsistent behavior
8. ⚠️ `src/components/LazyVideoPlayer.jsx` - Lazy loading issues

### **Low Priority (Informational)**
9. ℹ️ `src/components/GumletPlayer.jsx` - Unused but has issues
10. ℹ️ `src/components/ModalVideoPlayer.jsx` - Modal videos work but could be optimized

### **Pages with Direct Gumlet Embeds**
- `src/pages/AForAdleyCase.jsx` - Lines 217, 331
- `src/pages/QuarterMachineCase.jsx` - Line 231
- `src/pages/SpacestationAnimationCase.jsx` - Lines 225, 346
- `src/pages/ProjectDetails.jsx` - Line 445

---

## 🔧 Recommended Solutions

### Solution 1: Standardize Gumlet URL Generation
Create a single utility function for generating Gumlet URLs:

```javascript
// src/utils/gumletHelper.js
export const getGumletUrl = (videoId, options = {}) => {
  const {
    autoplay = true,
    loop = true,
    muted = true,
    background = true,
    preload = 'auto'
  } = options;

  const params = new URLSearchParams({
    autoplay: autoplay.toString(),
    loop: loop.toString(),
    muted: muted.toString(),
    playsinline: 'true', // Always required
    preload,
    ...(background && { background: 'true' })
  });

  return `https://play.gumlet.io/embed/${videoId}?${params.toString()}`;
};
```

### Solution 2: Fix iframe `allow` Attribute
Update all iframes to use the correct permissions:

```javascript
allow="autoplay; fullscreen; picture-in-picture; encrypted-media; clipboard-write"
```

### Solution 3: Add Error Handling & Fallbacks
Implement proper error handling for failed video loads:

```javascript
<iframe
  src={gumletUrl}
  onError={() => {
    console.error('Gumlet video failed to load:', videoId);
    setHasError(true);
  }}
  onLoad={() => {
    console.log('Gumlet video loaded successfully:', videoId);
    setIsLoaded(true);
  }}
/>
```

### Solution 4: Verify Video IDs
Check all video IDs in Gumlet dashboard to ensure they:
- Exist and are published
- Have proper embed permissions
- Are not expired or deleted

### Solution 5: Remove Parameter Conflicts
Remove redundant or conflicting parameters:
- Don't use `disable_player_controls` with `background=true`
- Don't use `quality` parameter (Gumlet handles this automatically)
- Use `preload=auto` instead of `preload=true`

---

## 📋 Implementation Checklist

### Phase 1: Core Fixes (Critical)
- [ ] Create `src/utils/gumletHelper.js` utility
- [ ] Update all components to use standardized URL generation
- [ ] Fix all `allow` attributes
- [ ] Add `playsinline=true` to all Gumlet embeds
- [ ] Ensure all videos have `muted=true` for autoplay

### Phase 2: Component Updates (High Priority)
- [ ] Fix `VideoBackground.jsx`
- [ ] Fix `ModularVideoPlayer.jsx`
- [ ] Fix `UniversalVideoBackground.jsx`
- [ ] Fix `FlexibleVideoPlayer.jsx`
- [ ] Fix `ProjectCardVideo.jsx`

### Phase 3: Page Updates (Medium Priority)
- [ ] Fix `AForAdleyCase.jsx`
- [ ] Fix `QuarterMachineCase.jsx`
- [ ] Fix `SpacestationAnimationCase.jsx`
- [ ] Fix `ProjectDetails.jsx`

### Phase 4: Verification (Testing)
- [ ] Test all videos on desktop browsers (Chrome, Firefox, Safari, Edge)
- [ ] Test all videos on mobile devices (iOS Safari, Chrome Mobile)
- [ ] Test all videos on tablet devices
- [ ] Test with slow network conditions
- [ ] Verify autoplay works consistently
- [ ] Verify hover interactions work
- [ ] Check console for errors

---

## 🎯 Expected Outcomes

After implementing these fixes:
1. ✅ All Gumlet videos should load consistently
2. ✅ Autoplay should work on all browsers and devices
3. ✅ No console errors related to video loading
4. ✅ Smooth transitions and hover effects
5. ✅ Better performance and reduced loading times
6. ✅ Consistent behavior across all pages

---

## 📊 Video ID Inventory

### Verified Video IDs:
- `68411e53ed94500acc2ec4b2` - A for Adley Hero
- `684112f32ea48d13d446c58c` - Quarter Machine Hero
- `68414d69ed94500acc302885` - Spacestation Animation Hero
- `684b9feae78588ecc9339a87` - Proper Hemp Co Hero
- `684be5bc84f5064184ad49e9` - Home Page Hero

### Suspicious/Repeated IDs (Need Verification):
- `6840a1250f8d7a051834fe38` - Used in 5 different places (likely placeholder)

### Quarter Machine Videos:
- `684289e8ed94500acc381c4b` - Technical Architecture
- `684290b02ea48d13d4506ae6` - User Experience
- `684295daed94500acc386298` - Platform Innovation
- `68429aac0f8d7a05184138e0` - Partnerships
- `6842a319ed94500acc38fa5c` - Hero Mobile/Desktop

### Spacestation Animation Videos:
- `6840d19e2ea48d13d445d48b` - Default
- `6840072a0f8d7a05183029b8` - Strategic Team
- `683ff9330f8d7a05182fb176` - Production Pipeline
- `6840affaed94500acc2ced6a` - Diversified Content
- `68451246ed94500acc484fa8` - Business Development

### A for Adley Videos:
- `684208c62ea48d13d44df9d1` - Default

### Proper Hemp Co Videos:
- `6847c67ff923a3909d01b53b` - Default/Ecommerce

---

## 🚨 Immediate Action Items

1. **VERIFY ALL VIDEO IDS** - Log into Gumlet dashboard and confirm all IDs exist
2. **Replace the repeated ID** `6840a1250f8d7a051834fe38` with actual project-specific videos
3. **Create the gumletHelper.js utility** to standardize URL generation
4. **Update all iframe allow attributes** to include correct permissions
5. **Add playsinline=true** to ALL Gumlet embeds (critical for mobile)

---

## 💡 Additional Recommendations

### Performance Optimization:
1. Use `loading="lazy"` for videos below the fold
2. Implement Intersection Observer for all videos
3. Defer loading of non-critical videos
4. Consider adding thumbnail previews with faster loading

### User Experience:
1. Add loading states/spinners
2. Implement error boundaries for failed videos
3. Add fallback images for failed video loads
4. Consider adding "tap to play" for mobile users

### Monitoring:
1. Add analytics for video load failures
2. Track video play rates
3. Monitor performance metrics
4. Set up error logging for debugging

---

## Notes
- All Gumlet videos require `muted=true` for autoplay to work (browser policy)
- iOS Safari requires `playsinline=true` or videos will open fullscreen
- The `background=true` parameter should be sufficient for hiding controls
- Consider network conditions - provide quality fallbacks


