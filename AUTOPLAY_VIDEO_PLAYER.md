# AutoplayVideoPlayer Component

## Overview

A dedicated, reusable video player component designed specifically for short looping videos that behave like performant GIFs.

## Component: `AutoplayVideoPlayer`

Location: `src/components/AutoplayVideoPlayer.jsx`

### Purpose

Provides a clean, simple video player that:
- Autoplays immediately on load
- Loops continuously
- Has no visible controls
- No buttons or UI elements
- Muted by default (browser autoplay policy)
- Perfect for logo animations, short motion graphics, and ambient loops

### Usage

```jsx
import AutoplayVideoPlayer from './components/AutoplayVideoPlayer';

<AutoplayVideoPlayer 
  videoData={{
    url: "https://play.gumlet.io/embed/VIDEO_ID",
    title: "Video Title"
  }}
  onLoadingComplete={() => console.log('Video loaded')}
/>
```

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `videoData` | Object | Yes | Video data object with `url` and `title` |
| `videoData.url` | String | Yes | Gumlet or Vimeo embed URL |
| `videoData.title` | String | Yes | Video title for accessibility |
| `onLoadingComplete` | Function | No | Callback fired when video iframe loads |

### Features

- ✅ **Autoplay**: Starts playing immediately (muted)
- ✅ **Loop**: Plays continuously forever
- ✅ **No Controls**: Clean interface with no UI
- ✅ **Muted**: Always muted (browser requirement)
- ✅ **Responsive**: Maintains 16:9 aspect ratio
- ✅ **Background Mode**: Uses Gumlet background mode for optimal performance
- ✅ **Gumlet Support**: Optimized for Gumlet videos
- ✅ **Vimeo Support**: Works with Vimeo videos too

### Video Parameters

#### Gumlet:
```
autoplay=true
loop=true
muted=true
controls=false
ui=false
background=true
playsinline=true
preload=auto
```

#### Vimeo:
```
api=1
autoplay=1
loop=1
controls=0
title=0
byline=0
portrait=0
muted=1
background=1
```

## Integration with ModalVideoPlayer

The `ModalVideoPlayer` automatically uses `AutoplayVideoPlayer` when `videoMode="autoplay"`:

```jsx
<ModalVideoPlayer 
  videoData={videoData}
  videoMode="autoplay" // Uses AutoplayVideoPlayer
/>

<ModalVideoPlayer 
  videoData={videoData}
  videoMode="manual" // Uses traditional controls
/>
```

## Project Configuration

Add to `project.json`:

```json
{
  "title": "Barbacoa",
  "videoUrl": "https://play.gumlet.io/embed/6989658b4db88a967f795e3e",
  "videoMode": "autoplay"
}
```

## Use Cases

### Perfect For:
- ✅ Logo reveals (3-10 seconds)
- ✅ Motion graphics loops
- ✅ Brand animations
- ✅ Ambient background videos
- ✅ Product showcases (short loops)
- ✅ Micro-interactions
- ✅ Loading animations

### Not Ideal For:
- ❌ Long videos (use `ModalVideoPlayer` with `videoMode="manual"`)
- ❌ Videos requiring sound (always muted)
- ✅ Videos needing user control (use manual mode)
- ❌ Tutorial or educational content

## Comparison

| Feature | AutoplayVideoPlayer | ModalVideoPlayer (Manual) |
|---------|-------------------|--------------------------|
| Autoplay | ✅ Always | ❌ User click required |
| Loop | ✅ Forever | ❌ Plays once |
| Controls | ❌ None | ✅ Full controls |
| Mute Button | ❌ No UI | ✅ Yes |
| Play Button | ❌ No UI | ✅ Yes |
| Use Case | GIF-style loops | Traditional videos |
| Best For | 3-10 sec clips | 30+ sec videos |

## Example Projects

### Barbacoa (2025)
```json
{
  "title": "Barbacoa",
  "videoUrl": "https://play.gumlet.io/embed/6989658b4db88a967f795e3e",
  "videoMode": "autoplay",
  "description": "4-second logo reveal animation"
}
```

**Result**: Clean looping animation, no controls, like a high-quality GIF

## Component Architecture

```
ModalVideoPlayer (parent)
  ├─ if videoMode === "autoplay"
  │   └─ AutoplayVideoPlayer (GIF-style)
  │       └─ iframe (autoplay, loop, no controls)
  │
  └─ if videoMode === "manual" 
      └─ Traditional Player (full controls)
          ├─ iframe (manual play)
          ├─ Play/Pause button
          └─ Mute/Unmute button
```

## Browser Compatibility

- ✅ Chrome/Edge (all features)
- ✅ Firefox (all features)
- ✅ Safari (all features)
- ✅ Mobile browsers (autoplay works when muted)

**Note**: Autoplay only works when muted due to browser autoplay policies. This is why `AutoplayVideoPlayer` doesn't have a mute button - it must remain muted.

## Future Enhancements

Potential additions:
- [ ] Quality selection
- [ ] Poster image override
- [ ] Start/end time trimming
- [ ] Playback speed control
- [ ] Click to pause (optional prop)

---

**Created**: 2026-02-08
**Status**: ✅ Production Ready
**Component**: `AutoplayVideoPlayer.jsx`
**Example**: Barbacoa 2025 Project
