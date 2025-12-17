# Quick Reference - Video Options Implementation

## What Was Fixed

✅ **Autoplay Option** - Now autoplays video in both preview and website (with muted attribute)
✅ **Loop Option** - Now loops infinitely when enabled
✅ **Hide Controls Option** - Now hides player controls properly
✅ **Hide Fullscreen Option** - Now hides fullscreen button when enabled
✅ **Preview Updates** - Checkboxes now update preview in real-time
✅ **Final Element Creation** - Options properly applied to saved videos

## State Management Flow

```
localVideoOptions (reactive state)
    ├── autoplay: boolean
    ├── loop: boolean
    ├── hideControls: boolean
    └── hideFullscreen: boolean
            ↓
      Maps to state.options array
            ↓
      Used in updateLocalVideoPreview()
            ↓
      Used in createElements() for final HTML
            ↓
      Stored as dataset attributes (data-video-*)
            ↓
      Read by frontend video_handler.js
```

## Method Call Flow

### When user toggles checkbox:
```
onChangeOption('autoplay')
  → Toggle localVideoOptions.autoplay
  → Update state.options with new value
  → Call updateLocalVideoPreview()
  → Preview updates immediately
```

### When user uploads/selects video:
```
updateVideo()
  → Detect local video URL
  → Initialize state.options from localVideoOptions
  → Call updateLocalVideoPreview()
  → Display options checkboxes
```

### When user saves page:
```
createElements()
  → Read localVideoOptions values
  → Set dataset attributes on container
  → Apply attributes to video element
  → Return HTML element to be saved
```

### When page loads on website:
```
video_handler.js onLoad
  → Find .o_custom_video_container elements
  → Read data-video-* attributes
  → Apply attributes to video elements
  → Setup autoplay/loop handlers
  → Log details to console
```

## Key Code Patterns

### Clearing all attributes (always do this first!)
```javascript
video.removeAttribute('autoplay');
video.removeAttribute('loop');
video.removeAttribute('controls');
video.removeAttribute('muted');
video.removeAttribute('playsinline');
video.removeAttribute('controlsList');
video.removeAttribute('disablePictureInPicture');

// Reset properties
video.autoplay = false;
video.loop = false;
video.controls = false;
video.muted = false;
```

### Applying autoplay (requires both property AND attribute)
```javascript
video.autoplay = true;
video.muted = true;  // CRITICAL: Browser policy
video.setAttribute('autoplay', '');
video.setAttribute('muted', '');
video.setAttribute('playsinline', '');  // Mobile support

// Try to play
video.play().catch(err => console.warn('Autoplay blocked:', err));
```

### Applying loop
```javascript
video.loop = true;
video.setAttribute('loop', '');

// Backup handler for browser compatibility
video.addEventListener('ended', function() {
  this.currentTime = 0;
  this.play().catch(err => console.warn('Loop failed:', err));
});
```

### Applying hide controls
```javascript
if (hideControls) {
  video.controls = false;
  // Don't set attribute - absence of 'controls' = hidden
} else {
  video.controls = true;
  video.setAttribute('controls', '');
}
```

### Applying hide fullscreen
```javascript
if (hideFullscreen) {
  video.setAttribute('controlsList', 'nodownload nofullscreen');
  video.setAttribute('disablePictureInPicture', 'true');
}
```

### Storing in dataset for frontend
```javascript
const div = document.createElement('div');
div.className = 'o_custom_video_container';
div.dataset.videoAutoplay = this.localVideoOptions.autoplay ? 'true' : 'false';
div.dataset.videoLoop = this.localVideoOptions.loop ? 'true' : 'false';
div.dataset.videoHideControls = this.localVideoOptions.hideControls ? 'true' : 'false';
div.dataset.videoHideFullscreen = this.localVideoOptions.hideFullscreen ? 'true' : 'false';
```

### Reading from dataset (frontend)
```javascript
const autoplay = container.dataset.videoAutoplay === 'true';
const loop = container.dataset.videoLoop === 'true';
const hideControls = container.dataset.videoHideControls === 'true';
const hideFullscreen = container.dataset.videoHideFullscreen === 'true';
```

## Testing Checklist

### Editor Testing
- [ ] Open video selector dialog
- [ ] Upload/select a video
- [ ] "Video Options" section appears
- [ ] Check "Autoplay" → preview starts playing (muted)
- [ ] Check "Loop" → video loops when ends
- [ ] Check "Hide player controls" → controls disappear
- [ ] Check "Hide fullscreen button" → fullscreen button hidden
- [ ] Uncheck options → changes apply immediately
- [ ] Browser console shows detailed logs
- [ ] Save page

### Website Testing
- [ ] Load saved page
- [ ] Video with Autoplay ON: plays automatically
- [ ] Video with Loop ON: loops infinitely
- [ ] Video with Hide Controls ON: no controls visible
- [ ] Video with Hide Fullscreen ON: no fullscreen option
- [ ] Browser inspector shows correct attributes
- [ ] Browser inspector shows dataset attributes
- [ ] Console on live site shows initialization logs

### Browser Compatibility
- [ ] Works in Chrome/Edge
- [ ] Works in Firefox
- [ ] Works in Safari
- [ ] Works on mobile browsers
- [ ] Autoplay works (remember: requires muted attribute)

## Debug Commands

### In browser console (editor preview):
```javascript
// Check localVideoOptions (in component scope)
// Need to inspect component directly - usually via Vue DevTools

// Check if preview container exists
document.querySelector('.o_video_dialog_preview_container')

// Check preview video element
document.querySelector('.o_video_dialog_preview_container video')

// Check video attributes
const video = document.querySelector('.o_video_dialog_preview_container video');
console.log({
  autoplay: video.hasAttribute('autoplay'),
  loop: video.hasAttribute('loop'),
  controls: video.hasAttribute('controls'),
  muted: video.hasAttribute('muted'),
  src: video.src
});
```

### On live website:
```javascript
// Find all video containers
const containers = document.querySelectorAll('.o_custom_video_container');
console.log('Found containers:', containers.length);

// Check each video
containers.forEach((c, i) => {
  const video = c.querySelector('video');
  console.log(`Video ${i}:`, {
    dataset: c.dataset,
    autoplay: video.hasAttribute('autoplay'),
    loop: video.hasAttribute('loop'),
    controls: video.hasAttribute('controls'),
    muted: video.hasAttribute('muted'),
    src: video.src
  });
});

// Manually reinitialize
window.reinitializeVideos()
```

## Files Modified Summary

| File | Changes |
|------|---------|
| `video_selector_upload.js` | Fixed state management, preview updates, element creation |
| `video_handler.js` | Enhanced logging, proper attribute clearing |
| `video_upload_templates.xml` | Added options display section |
| `video_upload.css` | Existing styles (no changes needed) |
| `main.py` | Existing controller (no changes needed) |

## Common Mistakes to Avoid

❌ **Don't** forget to set `muted` attribute with autoplay
```javascript
// WRONG - won't autoplay in browsers
video.setAttribute('autoplay', '');

// CORRECT - will autoplay
video.setAttribute('autoplay', '');
video.setAttribute('muted', '');
```

❌ **Don't** forget to clear attributes before applying new ones
```javascript
// WRONG - old values might conflict
video.setAttribute('controls', 'false');  // Invalid!

// CORRECT - remove to hide, set to show
video.removeAttribute('controls');  // Hide
video.setAttribute('controls', '');  // Show
```

❌ **Don't** only set property without attribute (for HTML serialization)
```javascript
// WRONG - works in preview, not saved to HTML
video.autoplay = true;

// CORRECT - both property and attribute
video.autoplay = true;
video.setAttribute('autoplay', '');
```

❌ **Don't** forget to call updateLocalVideoPreview() after changing state
```javascript
// WRONG - state changes but preview doesn't update
this.localVideoOptions.autoplay = true;

// CORRECT - manually update preview
this.localVideoOptions.autoplay = true;
this.updateLocalVideoPreview();  // or await and delay
```

## Performance Considerations

- **Preview updates**: 50ms delay ensures DOM is ready
- **Frontend handler**: Runs once on page load
- **No polling**: Event-based (ended event for loop)
- **Memory efficient**: Reuses video element when possible

## Future Enhancement Ideas

1. **Video Quality** - Add quality selector
2. **Start Time** - Add start at feature (like YouTube)
3. **Poster Image** - Allow custom preview image
4. **Analytics** - Track play count, watch time
5. **Subtitles** - Support video subtitles/captions
6. **Custom Styling** - Allow custom CSS classes
7. **Video Duration** - Display duration before play
8. **Thumbnail Preview** - Show multiple frames on hover
