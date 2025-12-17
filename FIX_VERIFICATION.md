# QUICK FIX VERIFICATION - Video Options

## What Was Just Fixed

The video options section was not appearing because:
1. `shownOptions` getter was missing for local videos
2. Template was checking both `state.platform === 'local'` AND `shownOptions.length > 0` (which was 0)
3. Now the getter returns state.options directly for local videos

## How to Test

### Step 1: Clear Cache
```bash
# Clear browser cache
Ctrl+Shift+Delete  # Or Cmd+Shift+Delete on Mac

# Also clear Odoo cache (optional but recommended)
rm -rf ~/.cache/odoo
```

### Step 2: Refresh the Page
- Go to Website > Pages > Edit a page
- Add or edit a video element
- Click "Edit Media"
- Go to "Videos" tab

### Step 3: Upload/Select Video
1. Click "Choose Video File" and upload a video
2. OR select from "Recently Uploaded"
3. Wait for preview to load

### Step 4: Verify Options Appear
You should now see:
```
📋 Video Options
☐ Autoplay    Videos are muted when autoplay is enabled
☐ Loop
☐ Hide player controls
☐ Hide fullscreen button
```

### Step 5: Test Each Option

#### Test Autoplay
- Check ☑ Autoplay
- Preview video should start playing (muted)
- Browser console should show:
  ```
  🎬 Changing option: autoplay
  ✅ autoplay = true
  📋 Updated state.options: [...]
  🎬 updateLocalVideoPreview called
  ✅ Preview: Autoplay ON
  ```
- Uncheck to disable

#### Test Loop
- Check ☑ Loop
- Preview video should loop infinitely
- Console should show:
  ```
  ✅ Loop: ENABLED
  ```
- Play to end → video restarts automatically

#### Test Hide Controls
- Check ☑ Hide player controls
- Preview video controls should disappear
- Console should show:
  ```
  ✅ Controls: HIDDEN
  ```
- Uncheck to show controls again

#### Test Hide Fullscreen
- Check ☑ Hide fullscreen button
- Fullscreen button hidden from preview
- Console should show:
  ```
  ✅ Fullscreen: DISABLED
  ```

### Step 6: Save and View on Website
1. Set desired options (e.g., Autoplay ON, Loop OFF)
2. Save page
3. View on website (front-end)
4. Video should autoplay (muted)
5. Should not loop
6. Controls should be visible
7. Fullscreen should work

## Browser Console Log Sequence

**After uploading:**
```
✅ Video uploaded: /web/video/filename...
🎬 Local video detected: /web/video/filename...
📋 Initialized state.options: Array(4)
📋 Final state.options for template: Array(4)
🎬 updateLocalVideoPreview called
📋 Current options: {autoplay: false, loop: false, hideControls: false, hideFullscreen: false}
✅ Preview: Autoplay OFF
✅ Preview: Loop OFF
✅ Preview: Controls VISIBLE
✅ Preview: Fullscreen ENABLED
📊 Final preview state: {autoplay: false, loop: false, controls: true, muted: false}
```

**When clicking checkbox:**
```
🎬 Changing option: loop
✅ loop = true
📋 Updated state.options: [...]
🎬 updateLocalVideoPreview called
📋 Current options: {autoplay: false, loop: true, hideControls: false, hideFullscreen: false}
✅ Preview: Loop ON
```

## If Options Still Don't Appear

Try these troubleshooting steps:

1. **Hard refresh the page**
   ```
   Ctrl+Shift+R  (Windows/Linux)
   Cmd+Shift+R   (Mac)
   ```

2. **Check browser console for errors**
   - F12 to open DevTools
   - Go to Console tab
   - Look for red error messages
   - Screenshot and share if found

3. **Verify module is installed**
   - Go to Apps > Search "Website Video Upload"
   - Should show "Website Video Upload v19.0.1.0.0"
   - Status should be "Installed" (green)

4. **Check if video is being detected as local**
   - Upload a video
   - Check console for: `🎬 Local video detected: /web/video/...`
   - If not shown, video URL is not being recognized

5. **Verify template is being inherited**
   - F12 > Elements > Find class="o_video_options_section"
   - Should exist in DOM when local video is selected

6. **Manually test in console**
   ```javascript
   // In browser console after uploading video:
   
   // Check if state.platform is local
   // (Can't easily access from console, but logs should show it)
   
   // Check if options section exists
   document.querySelector('.o_video_options_section')
   // Should return element, not null
   
   // If null, options section not rendered
   // Check browser console for template errors
   ```

## Common Issues

| Symptom | Cause | Fix |
|---------|-------|-----|
| Options section not appearing | shownOptions empty | Refresh page hard (Ctrl+Shift+R) |
| Checkboxes appear unchecked | localVideoOptions not synced | Select video again |
| Preview doesn't update | updateLocalVideoPreview not called | Check console for errors |
| Options don't save | createElements not using values | Save page again |
| Website shows wrong options | dataset attributes not set | Save page again |

## Next Steps After Verification

1. Test all 4 options work correctly
2. Save page with options enabled
3. View on website (front-end) - options should be applied
4. Check HTML inspector on website:
   ```html
   <div class="o_custom_video_container"
        data-video-autoplay="true"
        data-video-loop="false"
        data-video-hide-controls="false"
        data-video-hide-fullscreen="false">
   ```
5. Options should be visible in checkboxes on page
6. Video should play according to options on website

## Success Indicators

✅ Options section appears in editor
✅ Checkboxes toggle and update preview immediately
✅ Console shows detailed logs for each action
✅ Options save with page
✅ Website shows correct video behavior
✅ HTML attributes are set correctly
✅ Dataset attributes are saved
