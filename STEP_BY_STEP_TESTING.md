# STEP-BY-STEP TESTING GUIDE

## Pre-Testing Setup

### Step 1: Clear Cache
```bash
# Clear browser cache
Ctrl+Shift+Delete  (Windows/Linux)
Cmd+Shift+Delete   (Mac)

# Hard refresh the page
Ctrl+Shift+R       (Windows/Linux)
Cmd+Shift+R        (Mac)
```

### Step 2: Check Module is Installed
1. Go to **Apps** menu
2. Search for "Website Video Upload"
3. Verify status is "Installed" (green)
4. If not installed, click "Install"

---

## Testing Phase 1: Options Section Visibility

### Test 1.1: Upload Video and Verify Options Appear
**Steps**:
1. Go to **Website > Pages**
2. Click **Edit** on any page
3. Click **+ (Add)** button
4. Select **Add a Block > Video**
5. Click on video element to edit
6. Open **F12 DevTools** (press F12)
7. Go to **Console** tab
8. Click the **"Videos"** tab in the dialog
9. Click **"Choose Video File"** button
10. Select any video file (MP4, WebM, etc.)
11. Wait for upload to complete

**Expected Result**:
- ✅ Video appears in preview
- ✅ "Video Options" section appears below preview with 4 checkboxes:
  - Autoplay
  - Loop
  - Hide player controls
  - Hide fullscreen button
- ✅ Console shows:
  ```
  ✅ Video uploaded: /web/video/...
  🎬 Local video detected: /web/video/...
  📋 Initialized state.options: Array(4)
  🎬 updateLocalVideoPreview called
  ✅ Preview: Autoplay OFF
  ✅ Preview: Loop OFF
  ✅ Preview: Controls VISIBLE
  ✅ Preview: Fullscreen ENABLED
  ```

**If Options Don't Appear**:
- Check console for errors (red messages)
- Take screenshot and verify you uploaded a valid video
- Try hard refresh again
- Check module is really installed

---

## Testing Phase 2: Checkbox Functionality

### Test 2.1: Test Autoplay Option
**Steps**:
1. With video still in preview (from Phase 1)
2. Look at preview video - should have **PLAY button** visible
3. Check the **☐ Autoplay** checkbox
4. Watch preview video

**Expected Result**:
- ✅ No error in console
- ✅ Video **starts playing** automatically (muted)
- ✅ Console shows:
  ```
  🎬 Changing option: autoplay
  ✅ autoplay = true
  📋 Updated state.options: [...]
  🎬 updateLocalVideoPreview called
  ✅ Preview: Autoplay ON
  ```
- ✅ Uncheck it - video stops playing
- ✅ Console shows:
  ```
  ❌ Preview: Autoplay OFF
  ```

### Test 2.2: Test Loop Option
**Steps**:
1. Make sure Autoplay is **unchecked** (for clearer testing)
2. Check the **☐ Loop** checkbox
3. Click the PLAY button on preview video
4. Let video play to the end

**Expected Result**:
- ✅ No error in console
- ✅ Video plays to end
- ✅ Video **restarts automatically**
- ✅ Video loops infinitely
- ✅ Console shows:
  ```
  ✅ Loop: ENABLED
  ```

### Test 2.3: Test Hide Controls Option
**Steps**:
1. Uncheck Loop checkbox
2. Watch preview video - should show **player controls** (play button, timeline, volume, etc.)
3. Check the **☐ Hide player controls** checkbox
4. Watch preview video

**Expected Result**:
- ✅ No error in console
- ✅ Player **controls disappear**
- ✅ Video appears without any controls
- ✅ Console shows:
  ```
  ✅ Controls: HIDDEN
  ```
- ✅ Uncheck it - controls reappear
- ✅ Console shows:
  ```
  ✅ Controls: VISIBLE
  ```

### Test 2.4: Test Hide Fullscreen Option
**Steps**:
1. Make sure Hide Controls is **unchecked**
2. Look at preview video - should show **fullscreen button** in controls
3. Check the **☐ Hide fullscreen button** checkbox

**Expected Result**:
- ✅ No error in console
- ✅ Fullscreen button **disappears** from controls
- ✅ Only play, timeline, volume remain
- ✅ Console shows:
  ```
  ✅ Fullscreen: DISABLED
  ```

---

## Testing Phase 3: Save and Website Display

### Test 3.1: Save Page with Options
**Steps**:
1. Set options as desired (e.g., Autoplay ON, Loop OFF, Controls VISIBLE, Fullscreen ON)
2. Scroll down and click **SAVE** button
3. Wait for page to save
4. Check console for errors

**Expected Result**:
- ✅ Page saves successfully
- ✅ No errors in console
- ✅ Options are saved to the page

### Test 3.2: View on Website Frontend
**Steps**:
1. Click **X** to close the editor
2. View the page on the **public website** (not in editor)
3. Open **F12 DevTools** to see console
4. Check the video element

**Expected Result**:
- ✅ Console shows initialization logs:
  ```
  🎬 Video frontend handler initialized
  📹 Found 1 video container(s)
  📺 Processing Video 1
  ✅ Autoplay: ENABLED (muted)
  ✅ Controls: VISIBLE
  ✅ Fullscreen: ENABLED
  ✅ Initialized 1 video(s)
  ```
- ✅ Video displays with correct options applied:
  - If Autoplay was ON: video plays automatically
  - If Loop was ON: video loops
  - If Hide Controls was ON: no controls visible
  - If Hide Fullscreen was ON: no fullscreen button

### Test 3.3: Inspect HTML Attributes
**Steps**:
1. Right-click on video element
2. Select **Inspect Element**
3. Look at the HTML

**Expected Result**:
- ✅ Should see attributes like:
  ```html
  <div class="o_custom_video_container"
       data-video-autoplay="true"
       data-video-loop="false"
       data-video-hide-controls="false"
       data-video-hide-fullscreen="false">
    <video src="/web/video/..." 
           autoplay=""
           muted=""
           controls=""
           preload="metadata">
    </video>
  </div>
  ```
- ✅ Dataset attributes match your settings
- ✅ Video has correct attributes set

---

## Testing Phase 4: Edge Cases

### Test 4.1: Edit Existing Video
**Steps**:
1. Edit the page again
2. Click on the video element
3. Click "Edit Media"
4. Go to Videos tab

**Expected Result**:
- ✅ Options are **restored** to saved values
- ✅ Preview shows correct settings
- ✅ Checkboxes show correct values

### Test 4.2: Multiple Videos on Same Page
**Steps**:
1. Add another video to the page
2. Set different options (e.g., Autoplay OFF, Loop ON)
3. Save page
4. View on website

**Expected Result**:
- ✅ Each video has its own settings
- ✅ Video 1 plays according to its options
- ✅ Video 2 plays according to its options
- ✅ Console shows both videos processed:
  ```
  📹 Found 2 video container(s)
  📺 Processing Video 1
  📺 Processing Video 2
  ✅ Initialized 2 video(s)
  ```

### Test 4.3: YouTube/Vimeo Still Work
**Steps**:
1. Edit page
2. Click on a non-local video (YouTube/Vimeo if present)
3. Or add a new YouTube video

**Expected Result**:
- ✅ Options section does NOT appear (because platform != 'local')
- ✅ YouTube/Vimeo's native options are used
- ✅ No conflicts with local video options

---

## Troubleshooting

### Issue: Options don't appear
**Debug Steps**:
```javascript
// In console, run:
document.querySelector('.o_video_options_section')
// Should return an element, not null

// Check platform:
// Look for: "🎬 Local video detected: /web/video/..."
// in console logs
```

### Issue: Console shows errors
**Actions**:
- Take screenshot of error
- Check error message carefully
- Most common: "Cannot read properties of undefined"
  - This means DOM is not being found properly
  - Check F12 > Elements tab to verify structure

### Issue: Options toggle but preview doesn't change
**Debug Steps**:
```javascript
// In console:
document.querySelector('.o_video_preview video').loop
// Should change to true/false when you toggle

document.querySelector('.o_video_preview video').controls
// Should change when you toggle Hide Controls
```

### Issue: Website shows wrong options
**Check**:
1. Edit page again - are saved options correct?
2. Hard refresh website (Ctrl+Shift+R)
3. Check HTML attributes with Inspect Element
4. Look for correct `data-video-*` attributes

---

## Success Criteria

You'll know everything is working when:

✅ Options section appears in editor
✅ All 4 checkboxes toggle without errors
✅ Preview updates in real-time when toggling
✅ Page saves successfully
✅ Website shows correct video behavior
✅ HTML has proper attributes
✅ Multiple videos on same page work independently
✅ YouTube/Vimeo still work

---

## Quick Reference Commands

**Hard Refresh**: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)

**Open DevTools**: `F12`

**Go to Console**: Press `F12`, then click **Console** tab

**Search Console**: `Ctrl+F` in console, type text

**Clear Console**: `Ctrl+L` or click clear button

**Inspect Element**: Right-click > Inspect Element (or press `F12` then click icon)
