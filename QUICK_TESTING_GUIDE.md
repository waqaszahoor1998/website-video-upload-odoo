# Quick Testing Guide - Video Upload with Controls

## Pre-Testing Setup

1. Restart Odoo:
   ```bash
   # Stop Odoo if running
   # Start with: odoo-bin -d database_name --addons-path=... --dev=xml,reload
   ```

2. Clear browser cache and restart browser

3. Log into Odoo 19

## Step-by-Step Testing

### Test 1: Upload Video and Configure Controls

**Steps:**
1. Go to Website → Website Pages (any page)
2. Click "Edit" 
3. Click + icon to add content
4. Find "Video" in media selection
5. Click "Choose Video File"
6. Select a video file from your PC (MP4 recommended)
7. Wait for upload to complete
8. Video should appear in preview

**Expected Result:**
- ✅ Video appears in preview
- ✅ Console shows: "✅ Video uploaded: /web/video/..."
- ✅ Video appears in "Recently Uploaded" section

### Test 2: Enable Autoplay

**Steps:**
1. In preview, check the "Autoplay" checkbox
2. Wait 1 second
3. Preview video should start playing automatically (muted)
4. Console should show: "✅ Preview: Autoplay ON"

**Expected Result:**
- ✅ Preview video plays automatically
- ✅ Video is muted
- ✅ Console logs show autoplay enabled

### Test 3: Enable Loop

**Steps:**
1. Check "Loop" checkbox
2. Wait for preview video to finish
3. Video should restart automatically

**Expected Result:**
- ✅ Video repeats when finished
- ✅ Console shows: "✅ Preview: Loop ON"

### Test 4: Hide Controls

**Steps:**
1. Check "Hide player controls" checkbox
2. Look at preview video
3. Control buttons should disappear

**Expected Result:**
- ✅ No play/pause/volume buttons visible
- ✅ Console shows: "✅ Preview: Controls HIDDEN"

### Test 5: Hide Fullscreen

**Steps:**
1. Check "Hide fullscreen button" checkbox
2. Look at preview (controls may be hidden, so may not see effect)

**Expected Result:**
- ✅ Console shows: "✅ Preview: Fullscreen DISABLED"

### Test 6: Insert Video with Controls

**Steps:**
1. Leave all 4 controls checked (Autoplay, Loop, Hide Controls, Hide Fullscreen)
2. Click "Add" button
3. Wait for insertion complete
4. Video should appear on page in edit mode

**Expected Result:**
- ✅ Video appears on page
- ✅ Console shows createElements logs
- ✅ Check element in browser inspector - should have data-video-* attributes

### Test 7: Inspect HTML

**Steps:**
1. Right-click on inserted video
2. Select "Inspect" or "Inspect Element"
3. Look at HTML structure

**Expected Result:**
```html
<div class="media_iframe_video o_custom_video_container" 
     data-video-autoplay="true"
     data-video-loop="true"
     data-video-hide-controls="true"
     data-video-hide-fullscreen="true"
     data-oe-expression="/web/video/...">
  <video src="/web/video/..." 
         autoplay="autoplay" 
         muted="muted" 
         loop="loop">
  </video>
</div>
```

### Test 8: Publish and View Website

**Steps:**
1. Click "Save"
2. Click "Publish"
3. Click "Preview" or open website in new tab
4. Navigate to page with video
5. Video should play with controls you configured

**Expected Result:**
- ✅ Video auto-plays (muted)
- ✅ Video loops when finished
- ✅ No control buttons visible
- ✅ Cannot go fullscreen
- ✅ Console shows "Video Frontend Processor" logs starting with:
  ```
  🎬 Video Frontend Processor Loaded
  🎬 [Frontend] DOM already loaded, processing immediately
  🎬 [Frontend] Starting processLocalVideos()
  ```

### Test 9: Add Different Video with Different Controls

**Steps:**
1. Go back to edit mode
2. Add another video from "Recently Uploaded"
3. This time: Check ONLY Autoplay
4. Leave Loop, Hide Controls, Hide Fullscreen unchecked
5. Click "Add"

**Expected Result:**
- ✅ Second video appears
- ✅ This video auto-plays (muted)
- ✅ Control buttons ARE visible
- ✅ Video does NOT loop
- ✅ Fullscreen button IS available

### Test 10: Test on Published Website

**Steps:**
1. Publish page again
2. View on published website (not edit mode)
3. Both videos should play with their respective controls

**Expected Result:**
- ✅ First video: Auto-plays, loops, no controls, no fullscreen
- ✅ Second video: Auto-plays, doesn't loop, shows controls, fullscreen available

---

## Console Debugging

### Look for these Success Messages:

**In Editor:**
```
✅ VideoSelector initialized with local video options
✅ Video uploaded: /web/video/...
✅ Local video detected: /web/video/...
🎬 createElements() called - Creating video elements
✅ Container attributes set
✅ Video attributes finalized
🎬 [MediaDialog] save() called - ADD button pressed
🎬 [MediaDialog] createElements returned
✅ LOCAL VIDEO DETECTED - Preserving controls
```

**On Published Website:**
```
🎬 Video Frontend Processor Loaded
🎬 [Frontend] DOM already loaded, processing immediately
🎬 [Frontend] Starting processLocalVideos()
🎬 [Frontend] Found X .media_iframe_video.o_custom_video_container
✅ Applied: Autoplay ON (muted)
✅ Applied: Loop ON
✅ Applied: Controls HIDDEN
✅ Applied: Fullscreen DISABLED
✅ Video processed successfully
```

### Troubleshooting Messages:

If you see these, there's a problem:

```
⚠️ No video element found in container
❌ ERROR: Video element not found!
⚠️ Autoplay blocked by browser
❌ Failed to insert video
```

---

## Common Issues and Fixes

### Issue: Controls don't work after clicking "Add"

**Check:**
1. Is o_custom_video_container class on container div?
2. Are data-video-* attributes present on container?
3. Are HTML attributes on video element?

**Fix:**
- Clear browser cache
- Restart Odoo
- Check console for errors

### Issue: Video doesn't auto-play on published site

**Check:**
1. Is video muted? (Required for autoplay)
2. Are controls checked in editor?
3. Check published website console

**Fix:**
- Make sure "Autoplay" checkbox is CHECKED in editor
- Autoplay only works if video is MUTED
- Some browsers block autoplay - check browser settings

### Issue: Controls are still visible when "Hide player controls" is checked

**Check:**
1. Is data-video-hide-controls="true" in HTML?
2. Is controls="controls" on video element?
3. Check console for "Controls HIDDEN" message

**Fix:**
- Refresh published page
- Clear cache completely
- Check if CSS is overriding controls visibility

### Issue: "Recently Uploaded" videos list is empty

**Check:**
1. Did upload complete successfully?
2. Check console for upload errors
3. Check database - ir.attachment records created?

**Fix:**
- Try uploading again
- Check server logs
- Verify /web/video/upload/json endpoint works

---

## Browser Console Commands

You can test directly in browser console:

```javascript
// Find all video containers
document.querySelectorAll('.o_custom_video_container')

// Find first video
document.querySelector('video')

// Check video attributes
const video = document.querySelector('video');
console.log({
    src: video.src,
    autoplay: video.autoplay,
    loop: video.loop,
    controls: video.controls,
    muted: video.muted,
    hasAutoplayAttr: video.hasAttribute('autoplay'),
    hasLoopAttr: video.hasAttribute('loop'),
    hasControlsAttr: video.hasAttribute('controls'),
})

// Check container attributes
const container = document.querySelector('.o_custom_video_container');
console.log({
    autoplay: container.getAttribute('data-video-autoplay'),
    loop: container.getAttribute('data-video-loop'),
    hideControls: container.getAttribute('data-video-hide-controls'),
    hideFullscreen: container.getAttribute('data-video-hide-fullscreen'),
})

// Manually trigger processor
if (typeof processLocalVideos === 'function') {
    processLocalVideos();
}
```

---

## Final Verification Checklist

- [ ] Video uploads successfully
- [ ] Preview shows correct controls
- [ ] All 4 control options work in preview
- [ ] Click "Add" successfully inserts video
- [ ] HTML has data-video-* attributes
- [ ] HTML has video element with HTML attributes
- [ ] Published website loads video processor script
- [ ] Video plays with correct controls on published site
- [ ] Different videos can have different control settings
- [ ] No console errors

If all items are checked, the video upload with controls is working correctly!

---

## Performance Note

The video frontend processor runs:
1. Once on page load (DOMContentLoaded)
2. Continuously monitors for new videos (MutationObserver)

This ensures:
- Videos added via AJAX are processed
- Dynamically loaded content works
- Multiple videos on same page work
- No performance impact (observers only trigger on DOM changes)
