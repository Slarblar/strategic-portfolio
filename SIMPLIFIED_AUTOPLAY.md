# Simplified Video Autoplay - Like a Performant GIF

## What We Built

A simple autoplay mode for short videos (like Barbacoa's 4-second logo animation) that works like a performant GIF.

## How It Works

### Archive Card (Simplified)
- ✅ Shows static thumbnail (no video preview)
- ✅ "+Video" badge indicates video content
- ✅ Click card → Opens modal

### Modal with Autoplay Mode
- ✅ Video starts playing immediately
- ✅ Loops continuously like a GIF
- ✅ No play/pause button
- ✅ No visible controls
- ✅ Just a mute/unmute button
- ✅ Click on video → Advances to next image (if any)

## Configuration

### In project.json:
```json
{
  "title": "Barbacoa",
  "videoId": "6989658b4db88a967f795e3e",
  "videoType": "gumlet",
  "videoUrl": "https://play.gumlet.io/embed/6989658b4db88a967f795e3e",
  "videoMode": "autoplay"
}
```

## Video Modes

### `"autoplay"` - Like a GIF
Perfect for: Short loops, logo animations, 3-10 second clips
- Autoplays on modal open
- Loops forever
- No controls visible
- Mute button in corner
- Clean, simple interface

### `"manual"` - Traditional Player (Default)
Perfect for: Long videos, walkthroughs, presentations
- User clicks to play
- Full controls
- Plays once (no loop)
- Pause button

## Technical Details

### Autoplay URL:
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

### Component Structure:
- **Autoplay mode**: Simple iframe with mute button
- **Manual mode**: Full controls with play/pause overlay
- **Mode determined by**: `videoMode` prop from project data

## User Experience

1. User sees Barbacoa card with thumbnail
2. User clicks card
3. Modal opens
4. Video immediately starts playing and looping
5. User can click on video to advance to next image
6. Or use arrow buttons to navigate
7. Video keeps looping in background

## Files Modified

1. `ModalVideoPlayer.jsx` - Split into two rendering modes
2. `SplitLayoutModal.jsx` - Pass videoMode prop
3. `public/timeline/2025/barbacoa/project.json` - Added videoMode
4. `dist/timeline/2025/barbacoa/project.json` - Added videoMode

---

**Status**: ✅ Complete
**Example**: Barbacoa (2025) - 4-second logo animation
**Behavior**: Like an animated GIF, but better performance
