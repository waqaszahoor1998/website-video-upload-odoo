# Final Testing Guide - Video Options on Website

## Quick Test (5 Minutes)

### Step 1: Create Test Video
1. Go to **Website > Edit Page**
2. Add video block
3. Upload test video (or select from recent)
4. Check **all 4 options**:
   - ☑ Autoplay
   - ☑ Loop  
   - ☑ Hide player controls
   - ☑ Hide fullscreen button
5. Click **"Add"** button
6. **Save page** (Ctrl+S)

### Step 2: View on Website
1. Click **"Exit"** to leave editor
2. View the page **on website** (not in editor)
3. Open **F12 DevTools**
4. Go to **Console** tab

### Step 3: Verify
**You should see**:
```
🎬 Video frontend handler initialized
📹 Found 1 video container(s)
📺 Processing Video 1
   ✅ Autoplay: ENABLED (muted)
   ✅ Loop: ENABLED
   ✅ Controls: HIDDEN
   ✅ Fullscreen: DISABLED
✅ Initialized 1 video(s)
```

**Video should**:
- ✅ Play automatically (muted)
- ✅ Loop to beginning at end
- ✅ Have NO controls visible
- ✅ Have NO fullscreen button

---

## Detailed Test (15 Minutes)

### Test 1: Autoplay Option

**Setup**:
1. Edit page
2. Upload video
3. Check ONLY "Autoplay" checkbox
4. Add to page
5. Save

**View on Website**:
1. Refresh page
2. Video should **start playing** automatically
3. Should be **MUTED** (can't hear sound)
4. Controls should be **visible**
5. Fullscreen button should be **visible**

**Console Should Show**:
```
✅ Autoplay: ENABLED (muted)
❌ Loop: DISABLED
✅ Controls: VISIBLE
✅ Fullscreen: ENABLED
```

### Test 2: Loop Option

**Setup**:
1. Edit page  
2. Upload video (different from Test 1)
3. Check ONLY "Loop" checkbox
4. Add to page
5. Save

**View on Website**:
1. Refresh page
2. Video should have **play button** (not autoplay)
3. Play video until end
4. Video should **restart automatically**
5. Video should **loop infinitely**

**Console Should Show**:
```
❌ Autoplay: DISABLED
✅ Loop: ENABLED
✅ Controls: VISIBLE
✅ Fullscreen: ENABLED
```

**To verify loop**:
1. Let video play to end
2. Watch console for: `↻ Video 1 ended, restarting`
3. Video restarts automatically

### Test 3: Hide Controls Option

**Setup**:
1. Edit page
2. Upload video
3. Check ONLY "Hide player controls" checkbox
4. Add to page
5. Save

**View on Website**:
1. Refresh page
2. Video should appear **without any controls**
3. No play button
4. No timeline
5. No volume control
6. No fullscreen button

**Try to click on video**:
- Video should **NOT show any controls**
- Video should **NOT respond to clicks**

**Console Should Show**:
```
❌ Autoplay: DISABLED
❌ Loop: DISABLED
✅ Controls: HIDDEN
✅ Fullscreen: ENABLED
```

### Test 4: Hide Fullscreen Button

**Setup**:
1. Edit page
2. Upload video
3. Check ONLY "Hide fullscreen button" checkbox
4. Add to page  
5. Save

**View on Website**:
1. Refresh page
2. Video should show **player controls**
3. But **NO fullscreen button**
4. Play, timeline, volume should be visible
5. Fullscreen button should be **missing**

**Console Should Show**:
```
❌ Autoplay: DISABLED
❌ Loop: DISABLED
✅ Controls: VISIBLE
✅ Fullscreen: DISABLED
```

### Test 5: All Options Combined

**Setup**:
1. Edit page
2. Upload video
3. Check **ALL 4 options**
4. Add to page
5. Save

**Expected Behavior**:
- ✅ Video plays automatically (muted)
- ✅ Loops at end
- ✅ No controls visible
- ✅ No fullscreen button

**Console Should Show**:
```
✅ Autoplay: ENABLED (muted)
✅ Loop: ENABLED
✅ Controls: HIDDEN
✅ Fullscreen: DISABLED
```

### Test 6: Multiple Videos with Different Options

**Setup**:
1. Edit page
2. Add 3 videos with different options:
   - Video 1: All ON
   - Video 2: All OFF  
   - Video 3: Loop + Hide Controls only
3. Save page

**Expected Behavior**:
- Video 1: Autoplays, loops, no controls, no fullscreen
- Video 2: Shows play button, controls, fullscreen, no loop
- Video 3: Shows play button, no controls, can loop, fullscreen

**Console Should Show**:
```
📹 Found 3 video container(s)
📺 Processing Video 1
...settings for video 1...
📺 Processing Video 2
...settings for video 2...
📺 Processing Video 3
...settings for video 3...
✅ Initialized 3 video(s)
```

---

## Inspector Verification

### Check Data Attributes
1. Right-click video
2. Select **"Inspect Element"**
3. Look at HTML:

**Should see**:
```html
<div class="media_iframe_video o_custom_video_container"
     data-video-autoplay="true"
     data-video-loop="false"
     data-video-hide-controls="false"
     data-video-hide-fullscreen="false">
```

### Check Video Attributes
1. Expand the `<video>` tag in inspector
2. Look at its attributes

**Should see**:
```html
<video src="/web/video/filename.webm"
       autoplay=""
       muted=""
       playsinline=""
       preload="metadata">
</video>
```

Or if different options:
```html
<video src="/web/video/filename.webm"
       loop=""
       preload="metadata">
</video>
```

---

## Troubleshooting

### Problem: Video Shows Controls Even Though "Hide" is Checked

**Debug**:
1. Inspect HTML
2. Is `data-video-hide-controls="true"` there? 
3. Is `controls` attribute on `<video>` tag?
4. Check console for errors

**Solution**:
1. Edit video again
2. Uncheck and re-check the option
3. Re-save page
4. Hard refresh website (Ctrl+Shift+R)

### Problem: Loop Not Working

**Debug**:
1. Inspect HTML
2. Is `data-video-loop="true"` there?
3. Is `loop=""` attribute on `<video>`?
4. Check console for: `↻ Video X ended, restarting`

**Solution**:
1. Edit video  
2. Verify Loop checkbox IS CHECKED
3. Save page
4. Hard refresh website
5. Play video to end

### Problem: Autoplay Not Starting

**Note**: Browsers may block autoplay without user interaction.

**Debug**:
1. Is `data-video-autoplay="true"`?
2. Check console for `▶️ Attempting autoplay...`
3. Is `autoplay=""` attribute there?

**Solution**:
1. Browsers require **muted** autoplay (already handled)
2. Try clicking on page first, then refresh
3. Check browser autoplay policies

### Problem: Console Shows No Logs

**Check**:
1. Are you viewing **website**, not editor?
2. F12 > Console tab opened?
3. Check for errors (red messages)
4. Scroll up in console to see initial logs

**Solution**:
1. Hard refresh (Ctrl+Shift+R)
2. Check module installed (Apps > Website Video Upload)
3. Check for JavaScript errors

---

## Success Checklist

After fixing, verify:

- [ ] Autoplay option works in preview
- [ ] Loop option works in preview
- [ ] Hide controls option works in preview
- [ ] Hide fullscreen option works in preview
- [ ] No errors in console when toggling
- [ ] Options section appears in editor
- [ ] Data attributes saved in HTML
- [ ] video_handler.js runs on website
- [ ] Console logs show correct options
- [ ] Video behavior matches options on website
- [ ] Multiple videos have independent options
- [ ] YouTube/Vimeo videos still work

---

## All Tests Passing = ✅ COMPLETE

Once all tests pass, the module is fully functional!

The options are now working from **editor preview** → **HTML save** → **website display** ✨
