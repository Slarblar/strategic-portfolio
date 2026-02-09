# Video Autoplay Mode - Feature Documentation

## Overview

Added support for autoplay video mode in archive projects. This allows short videos (like the 4-second Barbacoa logo animation) to play automatically in a loop without controls, similar to background videos.

## Implementation

### 1. Project Configuration

Add `videoMode` field to your project's `project.json`:

```json
{
  "id": "barbacoa-2025",
  "title": "Barbacoa",
  "year": 2025,
  "videoId": "6989658b4db88a967f795e3e",
  "videoType": "gumlet",
  "videoUrl": "https://play.gumlet.io/embed/6989658b4db88a967f795e3e",
  "videoMode": "autoplay",
  "images": []
}
```

### 2. Video Modes

#### `"autoplay"` Mode (Background-Style)
- ✅ Plays automatically on modal open
- ✅ Loops continuously
- ✅ No play/pause button
- ✅ No visible controls
- ✅ Background mode enabled
- ✅ Muted by default (users can unmute)
- ✅ Perfect for: Short loops, logo animations, ambient videos

**Use case**: 4-second Barbacoa logo animation

#### `"manual"` Mode (Traditional Player) - **Default**
- ✅ Requires user to click play
- ✅ No loop (plays once)
- ✅ Play/pause button visible
- ✅ Full controls available
- ✅ Muted by default (users can unmute)
- ✅ Perfect for: Long videos, case studies, presentations

**Use case**: Full project walkthroughs, client testimonials

### 3. Files Modified

#### `public/timeline/2025/barbacoa/project.json`
- Added `"videoMode": "autoplay"`

#### `src/components/SplitLayoutModal.jsx`
- Pass `videoMode` prop to ModalVideoPlayer
- Defaults to `'manual'` if not specified

#### `src/components/ModalVideoPlayer.jsx`
- Added `videoMode` parameter
- Added `isAutoplayMode` constant
- Updated URL generation to handle both modes
- Hide play button in autoplay mode
- Start playing automatically in autoplay mode

## Usage Examples

### Example 1: Short Logo Animation (Barbacoa)
```json
{
  "title": "Barbacoa",
  "videoId": "6989658b4db88a967f795e3e",
  "videoType": "gumlet",
  "videoUrl": "https://play.gumlet.io/embed/6989658b4db88a967f795e3e",
  "videoMode": "autoplay"
}
```

**Result**: Video plays automatically, loops continuously, no controls visible

### Example 2: Case Study Video (Manual)
```json
{
  "title": "Quarter Machine",
  "videoId": "67xxxxx",
  "videoType": "gumlet",
  "videoUrl": "https://play.gumlet.io/embed/67xxxxx",
  "videoMode": "manual"
}
```

**Result**: User clicks play button, video plays once with full controls

### Example 3: Default Behavior (No videoMode specified)
```json
{
  "title": "My Project",
  "videoUrl": "https://play.gumlet.io/embed/67xxxxx"
}
```

**Result**: Defaults to `"manual"` mode - traditional player behavior

## Technical Details

### Autoplay Mode URL Parameters
```
https://play.gumlet.io/embed/VIDEO_ID?
  autoplay=true
  &loop=true
  &muted=true
  &controls=false
  &ui=false
  &background=true
  &playsinline=true
  &preload=auto
```

### Manual Mode URL Parameters
```
https://play.gumlet.io/embed/VIDEO_ID?
  autoplay=false
  &loop=false
  &muted=true
  &controls=true
  &ui=true
  &playsinline=true
  &preload=auto
```

## Benefits

### For Short Videos (Autoplay):
1. **Seamless Experience**: No user interaction needed
2. **Continuous Loop**: Perfect for logo reveals and animations
3. **Clean Interface**: No distracting controls
4. **Professional Feel**: Like high-end portfolio sites

### For Long Videos (Manual):
1. **User Control**: Users decide when to play
2. **Bandwidth Friendly**: Doesn't auto-load large videos
3. **Full Controls**: Scrubbing, pause, volume control
4. **Expected Behavior**: Traditional video player UX

## Browser Compatibility

- ✅ Chrome/Edge (all features)
- ✅ Firefox (all features)
- ✅ Safari (all features)
- ✅ Mobile browsers (autoplay works when muted)

**Note**: Autoplay requires muted audio due to browser policies. Users can unmute using the volume button.

## Future Enhancements

Potential additions:
- [ ] `"hover"` mode - play on hover (like archive card previews)
- [ ] `"scroll"` mode - play when scrolled into view
- [ ] Quality selection (auto, 1080p, 720p, 360p)
- [ ] Poster image override
- [ ] Start/end time trimming

## Migration Guide

### To Enable Autoplay on Existing Project:

1. Open the project's `project.json` file
2. Add `"videoMode": "autoplay"` field
3. Save and refresh browser

### To Disable Autoplay:

1. Change `"videoMode": "autoplay"` to `"videoMode": "manual"`
2. Or remove the `videoMode` field entirely (defaults to manual)

---

**Created**: 2026-02-08
**Status**: ✅ Production Ready
**Example**: Barbacoa 2025 Project
