# Debugging Guide for Video Options

## Console Output Interpretation

### Successful Upload
```
✅ VideoSelector initialized with local video options
✅ Loaded 3 videos (from Recently Uploaded)
🎬 Local video detected: /web/video/myfile_timestamp_hash.mp4
✅ State options initialized: Array(4) [...]
✅ Video selected!
```

### Checkbox Toggle
```
🎬 Changing option: autoplay
✅ autoplay = true
📋 Updated state.options: [...]
🎬 updateLocalVideoPreview called
📋 Current options: {autoplay: true, loop: false, hideControls: false, ...}
✅ Preview: Autoplay ON
✅ Preview: Controls VISIBLE
✅ Preview: Fullscreen ENABLED
❌ Preview: Loop OFF
📊 Final preview state: {autoplay: true, loop: false, controls: true, muted: true}
```

### Save Page
```
🎬 Creating final video element
📋 Final options: {shouldAutoplay: true, shouldLoop: false, ...}
✅ Final: Autoplay ON
✅ Final: Controls SHOWN
✅ Final: Fullscreen ENABLED
❌ Final: Loop OFF
✅ Final element created
📊 Dataset: {videoAutoplay: 'true', videoLoop: 'false', ...}
📊 Video attrs: {autoplay: true, loop: false, controls: true}
```

### Website Load
```
🎬 Video frontend handler initialized
📹 Found 1 video container(s)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📺 Processing Video 1
   URL: /web/video/myfile_timestamp_hash.mp4
   Dataset: {videoAutoplay: 'true', videoLoop: 'false', ...}
📋 Options: {autoplay: true, loop: false, hideControls: false, hideFullscreen: false}
✅ Autoplay: ENABLED (muted)
▶️ Attempting autoplay...
✅ Autoplay successful
✅ Controls: VISIBLE
✅ Fullscreen: ENABLED
❌ Loop: DISABLED
📊 Final Attributes:
   - autoplay: true
   - loop: false
   - controls: true
   - muted: true
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Initialized 1 video(s)
```

## Common Issues & How to Debug

### Issue 1: Checkboxes don't appear
**Symptoms**: Options section not visible in editor

**Debug Steps**:
```javascript
// In browser console (F12):

// 1. Check if options are being initialized
document.querySelector('[t-name="html_editor.VideoSelector"]')
// Should exist

// 2. Check state.options
// Need Vue DevTools, but can see in HTML:
document.querySelector('input[type="checkbox"]')
// Should exist if initialized

// 3. Check platform detection
// Upload video and check console:
// Should see: "🎬 Local video detected: /web/video/..."

// 4. Check state.platform
// Should log: "state.platform = 'local'"
```

**Solutions**:
- Ensure video URL starts with `/web/video/` or `/web/content/`
- Check `updateVideo()` is called after upload
- Verify `getLocalVideoOptions()` returns 4 options

### Issue 2: Checkbox toggles but preview doesn't update
**Symptoms**: Click checkbox, but preview video doesn't change behavior

**Debug Steps**:
```javascript
// In browser console:

// 1. Find preview video element
const previewVideo = document.querySelector(
  '.o_video_dialog_preview_container video'
);
previewVideo
// Should exist

// 2. Check video element properties
console.log({
  autoplay: previewVideo.autoplay,
  loop: previewVideo.loop,
  controls: previewVideo.controls,
  muted: previewVideo.muted
});

// 3. Check HTML attributes
console.log({
  autoplayAttr: previewVideo.hasAttribute('autoplay'),
  loopAttr: previewVideo.hasAttribute('loop'),
  controlsAttr: previewVideo.hasAttribute('controls'),
  mutedAttr: previewVideo.hasAttribute('muted')
});

// 4. Monitor console logs when clicking checkbox
// Should see: "🎬 Changing option: autoplay"
// Should see: "✅ autoplay = true"
// Should see: "✅ Preview: Autoplay ON"
```

**Solutions**:
- Check browser console is showing logs
- Ensure checkbox onclick handler is bound
- Verify `updateLocalVideoPreview()` is called
- Check 50ms delay in `onChangeOption()` is working

### Issue 3: Website shows options not applied
**Symptoms**: Video saved with options, but website doesn't follow them

**Debug Steps**:
```javascript
// In browser console on live website:

// 1. Find video container
const container = document.querySelector('.o_custom_video_container');
container
// Should exist

// 2. Check dataset attributes
console.log('Dataset:', container.dataset);
// Should show: {videoAutoplay: 'true', videoLoop: 'false', ...}

// 3. Check video element attributes
const video = container.querySelector('video');
console.log({
  src: video.src,
  autoplay: video.hasAttribute('autoplay'),
  loop: video.hasAttribute('loop'),
  controls: video.hasAttribute('controls'),
  muted: video.hasAttribute('muted'),
  controlsList: video.getAttribute('controlsList')
});

// 4. Check if video_handler.js ran
// Should see: "🎬 Video frontend handler initialized"

// 5. Manually run handler
window.reinitializeVideos()
// Should output logs and might fix the issue
```

**Solutions**:
- Check dataset attributes are saved in HTML
- Verify video_handler.js is loaded (in Assets)
- Ensure manifest.py lists the file in `web.assets_frontend`
- Check for JavaScript errors in console

### Issue 4: Autoplay not working on website
**Symptoms**: Autoplay checked in editor, video doesn't play on website

**Debug Steps**:
```javascript
// 1. Check attributes
const video = document.querySelector('.o_custom_video_container video');
console.log({
  hasAutoplay: video.hasAttribute('autoplay'),
  hasMuted: video.hasAttribute('muted'),
  hasPlaysinline: video.hasAttribute('playsinline'),
  src: video.src
});

// 2. Check readyState
console.log('Ready state:', video.readyState);
// 0 = HAVE_NOTHING, 2 = HAVE_CURRENT_DATA, 4 = HAVE_ENOUGH_DATA

// 3. Check if video can load
video.play()
  .then(() => console.log('✅ Can play'))
  .catch(err => console.log('❌ Cannot play:', err.message));

// 4. Check browser autoplay policy
// Some browsers require muted + user interaction
```

**Solutions**:
- ALWAYS set `muted` attribute with autoplay
- Ensure video URL is accessible
- Check browser allows autoplay (might need muted)
- Try user click to trigger playback (fallback)

### Issue 5: Loop doesn't work
**Symptoms**: Loop checked in editor, video stops at end

**Debug Steps**:
```javascript
// 1. Check loop attribute
const video = document.querySelector('.o_custom_video_container video');
console.log({
  hasLoop: video.hasAttribute('loop'),
  loopProperty: video.loop,
});

// 2. Check for event listener
// Can't easily inspect from console, but check logs:
// Should see: "✅ Loop: ENABLED"

// 3. Manually test
video.loop = true;
video.setAttribute('loop', '');
video.play();
// Video should restart automatically at end

// 4. Check for errors when ended
video.addEventListener('ended', () => {
  console.log('Video ended');
  video.currentTime = 0;
  video.play().catch(err => console.log('Replay error:', err));
});
```

**Solutions**:
- Ensure both property AND attribute are set
- Check backup event listener is working
- Verify video `src` is correct and accessible
- Try different video format if having issues

### Issue 6: Controls appear when they shouldn't
**Symptoms**: Hide Controls checked, but controls still visible

**Debug Steps**:
```javascript
// 1. Check controls attribute
const video = document.querySelector('.o_custom_video_container video');
console.log({
  hasControls: video.hasAttribute('controls'),
  controlsProperty: video.controls,
  dataset: video.parentElement.dataset.videoHideControls
});

// 2. Check if CSS is interfering
const styles = window.getComputedStyle(video);
console.log('Computed:', {
  display: styles.display,
  visibility: styles.visibility,
  pointerEvents: styles.pointerEvents
});

// 3. Check for conflicting classes
console.log({
  classes: video.className,
  parentClasses: video.parentElement.className
});

// 4. Remove attribute and see if controls disappear
video.removeAttribute('controls');
video.controls = false;
```

**Solutions**:
- Check dataset attribute has correct value
- Verify `hideControls` maps to correct property
- Ensure attribute removal is working
- Check CSS isn't adding controls back

## Browser-Specific Issues

### Chrome/Edge
- Autoplay usually works with muted
- Loop attribute works reliably
- Controls hiding works as expected

### Firefox
- Might require playsinline for autoplay
- Loop attribute supported
- Check for CSP (Content Security Policy) issues

### Safari
- Very strict autoplay policy
- Requires both muted AND user gesture sometimes
- Consider fallback to manual play button

### Mobile Browsers
- Autoplay often blocked (security)
- Use playsinline for fullscreen videos
- Test on actual devices, not emulators

## Performance Debugging

### Check if handler is slow
```javascript
// Measure video handler performance
const start = performance.now();
window.reinitializeVideos();
const end = performance.now();
console.log(`Handler took ${end - start}ms`);
```

### Monitor memory usage
```javascript
// In Chrome DevTools:
// Performance > Record
// Run window.reinitializeVideos()
// Check memory spike
// Should be minimal for each video
```

## Logging Levels

| Symbol | Meaning |
|--------|---------|
| 🎬 | Main action (upload, detect, process) |
| ✅ | Success (option enabled, setting applied) |
| ❌ | Disabled/Negative (option off, not applied) |
| 📋 | Info/Data (showing values, state) |
| 📺 | Video-specific action |
| 📹 | Container/DOM action |
| ⚠️ | Warning (might not work, fallback) |
| ▶️ | Play/Action attempt |
| ↻ | Loop/Repeat action |
| 💡 | Hint/Suggestion |
| 📊 | Summary/Final state |

## Advanced Debugging

### Monitor state changes
```javascript
// Add temporary logging to component
// In video_selector_upload.js:
onChangeOption(optionId) {
  console.log('BEFORE:', this.localVideoOptions);
  // ... existing code ...
  console.log('AFTER:', this.localVideoOptions);
  console.log('state.options:', this.state.options);
}
```

### Watch DOM mutations
```javascript
// In browser console:
const observer = new MutationObserver(mutations => {
  mutations.forEach(m => {
    if (m.type === 'attributes' && m.target.tagName === 'VIDEO') {
      console.log('Video attributes changed:', m.target.attributes);
    }
  });
});

observer.observe(
  document.querySelector('.o_custom_video_container'), 
  { attributes: true, subtree: true }
);
```

### Trace function calls
```javascript
// Add before calling function:
const originalFunc = MyClass.prototype.updateLocalVideoPreview;
MyClass.prototype.updateLocalVideoPreview = function() {
  console.log('updateLocalVideoPreview called');
  console.trace(); // Shows call stack
  return originalFunc.call(this);
};
```

## Testing Checklist for Debugging

- [ ] Clear browser cache (Ctrl+Shift+Delete)
- [ ] Check browser console for errors
- [ ] Open DevTools (F12) > Elements > Find video element
- [ ] Verify all attributes are present
- [ ] Check data-* attributes on parent div
- [ ] Monitor console during each action
- [ ] Test in different browsers
- [ ] Test on mobile devices
- [ ] Try incognito/private mode
- [ ] Reload page completely (Ctrl+Shift+R)
- [ ] Check video file is accessible (/web/video/... in new tab)
