# Complete Testing Guide - After Video Handler Fix

## 🚀 5-Minute Setup & Test

### STEP 1: Clear Everything (1 min)
```
1. Open browser
2. Press Ctrl+Shift+Delete
3. Select "All time"
4. Check "Cookies and other site data"
5. Check "Cached images and files"
6. Click "Clear data"
```

### STEP 2: Hard Refresh (30 sec)
```
1. Go to your Odoo website page with video
2. Press Ctrl+Shift+R (or Cmd+Shift+R on Mac)
3. Wait for page to fully load
```

### STEP 3: Open Console (30 sec)
```
1. Press F12 (or right-click > Inspect)
2. Click "Console" tab
3. Clear any old logs (⌀ icon)
4. Refresh page again (F5)
5. Wait 3 seconds for all logs to appear
```

### STEP 4: Check Console Logs (2 min)
Look for these exact logs IN ORDER:

```
✅ Video handler fully loaded and active
```
↓ (scroll down in console to find)
```
🎬 Video frontend handler initialized
📹 Found 1 video container(s)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📺 Processing Video 1
   URL: /web/video/...
   📋 Raw attributes: {
      autoplay: "true"
      loop: "true"  
      hideControls: "false"
      hideFullscreen: "false"
   }
   🧹 Video element reset complete
   ✅ Controls: VISIBLE
   ✅ Loop: ENABLED
   ✅ Autoplay: ENABLED (muted)
   ▶️ Autoplay attempt 1/5...
   ✅ Autoplay successful on attempt 1
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Initialized 1 video(s)
```

## 📋 Expected Behaviors

### Autoplay = YES, Loop = YES, Hide Controls = NO
- ✅ Video plays automatically when page loads
- ✅ Video loops infinitely (restarts at end)
- ✅ Controls visible (play, timeline, volume, fullscreen)
- ✅ Audio is muted (requirement for autoplay)

### Autoplay = NO, Loop = NO, Hide Controls = YES
- ✅ Video does NOT play automatically
- ✅ Must click play button (no controls visible!)
- ✅ No loop - plays once and stops
- ✅ Can't see any control buttons

### Autoplay = YES, Loop = NO, Hide Controls = YES
- ✅ Video plays automatically
- ✅ No controls visible
- ✅ Plays once and stops
- ✅ Audio is muted

## 🔍 Detailed Verification

### Check 1: Console Logs Present
```
In F12 Console, type:
window.reinitializeVideos

Expected: ƒ initializeVideos()
If shows: undefined → Handler file didn't load
```

### Check 2: Data Attributes Set
```
1. Right-click video
2. Select "Inspect Element"
3. Look at the container div
4. Should show:
   <div class="media_iframe_video o_custom_video_container"
        data-video-autoplay="true"
        data-video-loop="true"
        data-video-hide-controls="false"
        data-video-hide-fullscreen="false">
```

### Check 3: Video Element Clean
```
In Inspector, look at <video> tag
Should show only:
   <video src="/web/video/..." preload="metadata">

Should NOT have:
   autoplay (in HTML)
   loop (in HTML)
   controls (in HTML)
   muted (in HTML)

(These are applied by JavaScript, not HTML)
```

### Check 4: Visual Verification
```
1. Wait 2 seconds for autoplay to start (if enabled)
2. Look for play button:
   - If "Hide controls" = YES → No controls visible ✓
   - If "Hide controls" = NO → Controls visible ✓
3. Play until end:
   - If "Loop" = YES → Restarts automatically ✓
   - If "Loop" = NO → Stops at end ✓
```

## ❌ If Not Working

### Problem: Console shows no logs
```
Solution:
1. Hard refresh: Ctrl+Shift+R
2. Wait 3 seconds
3. Check ALL console output (scroll up)
4. Look for errors (red messages)
```

### Problem: "undefined" for reinitializeVideos
```
Solution:
1. video_handler.js didn't load
2. Check __manifest__.py has:
   'assets': {
       'web.assets_frontend': [
           'website_video_upload/static/src/js/video_handler.js',
       ],
   }
3. Restart Odoo server
4. Hard refresh browser
```

### Problem: Logs show but no behavior
```
Solution:
1. Check data attributes in Inspector
2. If missing → createElements() not called correctly
3. Upload video again
4. Make sure to check options BEFORE clicking "Add"
```

### Problem: Loop not working
```
Solution:
1. Make sure "Loop" checkbox IS CHECKED in editor
2. Check console shows: ✅ Loop: ENABLED
3. Check HTML has: data-video-loop="true"
4. Play video to end and wait 2 seconds
5. Should restart automatically
```

### Problem: Autoplay not working
```
Solution:
1. Audio MUST be muted for autoplay (browser policy)
2. Check console shows: ✅ Autoplay: ENABLED (muted)
3. Wait 2 seconds when page loads
4. Video should start playing
5. If blocked, click anywhere on page then refresh
```

## ✅ Success Checklist

- [ ] Browser cache cleared
- [ ] Hard refresh done (Ctrl+Shift+R)
- [ ] Console shows initialization logs
- [ ] Logs show correct options (autoplay, loop, etc.)
- [ ] Data attributes visible in Inspector
- [ ] Video behaves according to options:
  - [ ] Autoplay works (if enabled)
  - [ ] Loop works (if enabled)
  - [ ] Controls shown/hidden correctly
  - [ ] Fullscreen button shown/hidden correctly
- [ ] No red errors in console
- [ ] Multiple videos work independently

## 🎉 Everything Working!

If all checks pass, your video options are now applying correctly on the website!

**Congrats!** 🚀
