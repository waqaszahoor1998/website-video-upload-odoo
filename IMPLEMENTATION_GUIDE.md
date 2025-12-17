# Video Upload Module - Implementation Guide for Video Options

## Problem Summary
Video options (Autoplay, Loop, Hide Controls, Hide Fullscreen) were not working because:
1. State management for options was incomplete
2. Preview updates weren't triggered when checkboxes changed
3. Option values weren't properly synced between localVideoOptions and state.options
4. Final video elements weren't getting the correct attributes

## Solution Overview

### Fixed Components in video_selector_upload.js

#### 1. setup() Method
- Initializes `localVideoOptions` as reactive state with all 4 options
- When editing existing videos, restores options from dataset
- Initializes `state.options` array with proper values
- Schedules preview update after initialization

#### 2. getLocalVideoOptions() Method
Returns an array of option objects:
```javascript
[
  { id: 'autoplay', label: 'Autoplay', value: true/false, ... },
  { id: 'loop', label: 'Loop', value: true/false, ... },
  { id: 'hide_controls', label: 'Hide player controls', value: true/false, ... },
  { id: 'hide_fullscreen', label: 'Hide fullscreen button', value: true/false, ... },
]
```

#### 3. onChangeOption() Method
Now properly:
1. Maps checkbox ID to localVideoOptions property name
2. Toggles the boolean value
3. Updates state.options with new value
4. Calls updateLocalVideoPreview() to show changes immediately

#### 4. updateLocalVideoPreview() Method - COMPLETE REWRITE
Critical improvements:
- Finds the preview container in the dialog
- Creates video element if it doesn't exist yet
- **CLEARS ALL ATTRIBUTES FIRST** - prevents conflicts
- Applies each option via setAttribute() + property assignment
- Handles autoplay with proper muted attribute
- Handles loop with backup event listener
- Attempts to play video if autoplay is enabled

#### 5. updateVideo() Method
For local videos:
- Sets platform = 'local'
- Initializes state.options with current localVideoOptions values
- Calls updateLocalVideoPreview() immediately
- Updates state after 50ms delay to ensure DOM is ready

#### 6. createElements() Method
For local videos:
- Reads final values from localVideoOptions
- Sets dataset attributes on container div (for frontend)
- Applies both properties AND attributes to video element
- Logs all final values for debugging

### Key Implementation Details

#### Why Both Properties AND Attributes?
```javascript
// Property: Controls JavaScript behavior
video.autoplay = true;
video.loop = true;
video.controls = false;

// Attribute: Ensures HTML serialization (saved with page)
video.setAttribute('autoplay', '');
video.setAttribute('loop', '');
// No setAttribute for controls=false (removal is sufficient)
```

#### Why Clear All Attributes First?
```javascript
video.removeAttribute('autoplay');
video.removeAttribute('loop');
video.removeAttribute('controls');
video.removeAttribute('muted');
video.removeAttribute('playsinline');
video.removeAttribute('controlsList');
video.removeAttribute('disablePictureInPicture');

// Prevents attribute conflicts and stale values
```

#### Why Use Dataset Attributes?
The frontend handler (video_handler.js) reads these from HTML:
```html
<div class="o_custom_video_container"
     data-video-autoplay="true"
     data-video-loop="false"
     data-video-hide-controls="true"
     data-video-hide-fullscreen="false">
     <video src="/web/video/..."></video>
</div>
```

### Frontend Handler (video_handler.js)
On page load:
1. Finds all `.o_custom_video_container` elements
2. Reads dataset attributes
3. Applies the same logic to video elements
4. Handles autoplay with browser requirements (muted + playsinline)
5. Sets up backup loop handler for older browsers

## Testing Instructions

### In the Editor (Preview)

1. **Upload a video**
   - Click "Choose Video File"
   - Select any video file (MP4, WebM, etc.)
   
2. **Test Autoplay option**
   - Check "Autoplay" checkbox
   - Preview video should start playing (muted)
   - Open browser console, should see: "✅ Preview: Autoplay ON"
   - Uncheck → video should pause
   - Console shows: "❌ Preview: Autoplay OFF"

3. **Test Loop option**
   - Check "Loop" checkbox
   - Preview video loops continuously
   - Console shows: "✅ Preview: Loop ON"

4. **Test Hide Controls option**
   - Check "Hide player controls" checkbox
   - Video controls disappear from preview
   - Console shows: "✅ Preview: Controls HIDDEN"
   - Uncheck → controls reappear

5. **Test Hide Fullscreen option**
   - Check "Hide fullscreen button" checkbox
   - Fullscreen button hidden (controlsList="nofullscreen")
   - Console shows: "✅ Preview: Fullscreen DISABLED"

### On the Live Website

1. **Save page with options enabled**
   - In editor, set Autoplay + Loop ON
   - Save page

2. **View page on website**
   - Video should autoplay
   - Video should loop infinitely
   - Check browser inspector → right-click video → Inspect Element
   - Verify attributes: `autoplay=""`, `loop=""`
   - Verify muted: `muted=""` (required for autoplay)

3. **Check dataset attributes**
   - In inspector, check parent div:
   ```html
   data-video-autoplay="true"
   data-video-loop="true"
   data-video-hide-controls="false"
   data-video-hide-fullscreen="false"
   ```

## Browser Console Debugging

### Enable console logs
All methods log detailed information:
```
🎬 updateLocalVideoPreview called
📋 Current options: {autoplay: true, loop: false, hideControls: false, hideFullscreen: false}
✅ Preview: Autoplay ON
✅ Preview: Controls VISIBLE
✅ Preview: Fullscreen ENABLED
❌ Preview: Loop OFF
```

### Manually reinitialize videos
```javascript
// In browser console on live website:
window.reinitializeVideos()

// Or check if options are applied:
document.querySelectorAll('.o_custom_video_container').forEach(c => {
  console.log('Dataset:', c.dataset);
  const video = c.querySelector('video');
  console.log('Attrs:', {
    autoplay: video.hasAttribute('autoplay'),
    loop: video.hasAttribute('loop'),
    controls: video.hasAttribute('controls'),
    muted: video.hasAttribute('muted')
  });
});
```

## Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| Checkboxes don't appear | state.options not initialized | Check `updateVideo()` is called |
| Checkbox doesn't update preview | `updateLocalVideoPreview()` not called | Verify `onChangeOption()` logic |
| Autoplay works in editor, not on website | Dataset attrs not set | Check `createElements()` sets all data-* attrs |
| Autoplay doesn't work on website | Missing `muted` attribute | Browser policy: autoplay requires muted |
| Video shows options but wrong state | State sync issue | Check `localVideoOptions` ↔ `state.options` sync |
| Preview video plays then stops | Loop handler not working | Check backup event listener in video_handler.js |

## File Summary of Changes

### video_selector_upload.js
- **setup()**: Initialize localVideoOptions, restore from dataset
- **onChangeOption()**: Toggle option and update preview immediately
- **updateLocalVideoPreview()**: Complete rewrite for reliability
- **updateVideo()**: Initialize state.options for local videos
- **createElements()**: Apply all options to final element
- **applyVideoOptions()**: Helper method for attribute application

### video_handler.js
- Enhanced initialization with better logging
- Proper attribute clearing before applying new ones
- Handles all browser compatibility issues

### video_upload_templates.xml
- Added options section display below main form

## Architecture Flow

```
User checks Autoplay checkbox
    ↓
onChangeOption('autoplay') called
    ↓
localVideoOptions.autoplay = true (toggled)
    ↓
state.options[0].value = true (updated)
    ↓
updateLocalVideoPreview() called
    ↓
Video element found in preview container
    ↓
All attributes cleared
    ↓
Autoplay attributes applied:
  - video.setAttribute('autoplay', '')
  - video.setAttribute('muted', '')
  - video.setAttribute('playsinline', '')
  - video.autoplay = true (property)
  ↓
video.play() attempted (may be blocked by browser)
    ↓
Console shows: "✅ Preview: Autoplay ON"
    ↓
User saves page
    ↓
createElements() called
    ↓
Final video element created with:
  - div.dataset.videoAutoplay = 'true'
  - video.setAttribute('autoplay', '')
  - All other options applied
    ↓
Page saved to database
    ↓
Frontend loads page
    ↓
video_handler.js runs
    ↓
Reads dataset attributes from HTML
    ↓
Applies same logic to video elements
    ↓
Video autoplays on website
```

## Performance Notes

- No performance impact: same video element operations
- Preview updates debounced (50ms delay for state sync)
- Frontend handler runs once on page load
- No polling or repeated checks

## Backward Compatibility

- Works with existing YouTube/Vimeo videos (super.onChangeOption() fallback)
- Works with background videos (forces all options ON)
- Works with editing existing local videos (restores from dataset)
