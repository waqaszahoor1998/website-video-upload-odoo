# Complete Video Testing Guide - ALL Video Types

## 📋 Summary

Your addon now works with:
- ✅ **Local Videos** (Upload MP4, WebM, etc.)
- ✅ **YouTube Videos** (Paste URL)
- ✅ **Vimeo Videos** (Paste URL)

All with the same 4 options:
- Autoplay
- Loop
- Hide Controls
- Hide Fullscreen

## 🎯 MASTER TEST PLAN (30 minutes total)

### Phase 1: Local Video (10 min)
```
1. Open website editor
2. Click Media > Upload Video
3. Choose local MP4 file from your computer
4. Check ALL 4 options:
   ☑ Autoplay
   ☑ Loop
   ☑ Hide player controls
   ☑ Hide fullscreen button
5. See preview update (video plays auto, loops, no controls)
6. Click "Add"
7. Save page
8. Exit editor
9. View page on website
10. Video should play with all options applied
```

### Phase 2: YouTube Video (10 min)
```
1. Open website editor
2. Click Media > Videos tab
3. Paste YouTube URL: https://www.youtube.com/watch?v=dQw4w9WgXcQ
4. Check ALL 4 options:
   ☑ Autoplay
   ☑ Loop
   ☑ Hide player controls
   ☑ Hide fullscreen button
5. See preview update
6. Click "Add"
7. Save page
8. Exit editor
9. View page on website
10. Video should play with all options applied
11. Open F12 > Inspector
12. Check iframe src has: ?autoplay=1&loop=1&controls=0&fs=0
```

### Phase 3: Vimeo Video (10 min)
```
1. Open website editor
2. Click Media > Videos tab
3. Paste Vimeo URL: https://vimeo.com/76979871
4. Check ALL 4 options:
   ☑ Autoplay
   ☑ Loop
   ☑ Hide player controls
   ☑ Hide fullscreen button
5. See preview update
6. Click "Add"
7. Save page
8. Exit editor
9. View page on website
10. Video should play with all options applied
11. Open F12 > Inspector
12. Check iframe src has: ?autoplay=1&loop=1
```

## 🔬 DETAILED VERIFICATION TESTS

### Test 1: Autoplay Works
**For Local Video:**
```
✓ Click "Add" with Autoplay checked
✓ Save page
✓ View website
✓ Video starts playing without clicking
✓ Audio is muted (requirement for autoplay)
```

**For YouTube/Vimeo:**
```
✓ Click "Add" with Autoplay checked
✓ Save page
✓ View website
✓ Video starts playing without clicking
✓ URL has parameter: ?autoplay=1
```

### Test 2: Loop Works
**For Local Video:**
```
✓ Click "Add" with Loop checked
✓ Save page
✓ View website
✓ Play video to the end
✓ Video restarts automatically
✓ Loops infinitely
✓ Check F12 Console for "↻ Video ended - restarting"
```

**For YouTube/Vimeo:**
```
✓ Click "Add" with Loop checked
✓ Save page
✓ View website
✓ Play video to the end
✓ Video restarts automatically
✓ URL has parameter: &loop=1
```

### Test 3: Hide Controls Works
**For Local Video:**
```
✓ Click "Add" with "Hide player controls" checked
✓ Save page
✓ View website
✓ Video has NO play button
✓ Video has NO timeline
✓ Video has NO volume control
✓ Video has NO fullscreen button (unless explicitly enabled)
✓ Cannot right-click on video
```

**For YouTube/Vimeo:**
```
✓ Click "Add" with "Hide player controls" checked
✓ Save page
✓ View website
✓ Video has NO controls visible
✓ Cannot click to play (only autoplay if enabled)
✓ URL has parameter: &controls=0
```

### Test 4: Hide Fullscreen Works
**For Local Video:**
```
✓ Click "Add" with "Hide fullscreen button" checked
✓ Save page
✓ View website
✓ If controls are visible, NO fullscreen button
✓ Cannot go fullscreen
```

**For YouTube/Vimeo:**
```
✓ Click "Add" with "Hide fullscreen button" checked
✓ Save page
✓ View website
✓ NO fullscreen button visible
✓ Cannot go fullscreen
✓ URL has parameter: &fs=0 (YouTube only)
```

## 📊 COMBINATION TESTS

### Combination 1: All Options ON
```
Local Video:
✓ Plays automatically (muted)
✓ Loops infinitely
✓ No controls visible
✓ No fullscreen button
✓ Data attributes: all "true"

YouTube/Vimeo:
✓ Plays automatically
✓ Loops infinitely
✓ No controls visible
✓ No fullscreen button
✓ URL has: ?autoplay=1&loop=1&controls=0&fs=0
```

### Combination 2: All Options OFF
```
Local Video:
✓ Shows play button
✓ Shows timeline
✓ Shows volume control
✓ Shows fullscreen button
✓ Must click to play
✓ No loop
✓ Data attributes: all "false"

YouTube/Vimeo:
✓ Shows all controls
✓ Must click to play
✓ No loop
✓ Fullscreen button visible
✓ URL has: no parameters (or minimal params)
```

### Combination 3: Autoplay + Hide Controls
```
Local Video:
✓ Plays automatically
✓ No controls visible
✓ Audio muted

YouTube/Vimeo:
✓ Plays automatically
✓ No controls visible
✓ URL has: ?autoplay=1&controls=0
```

### Combination 4: Loop + Hide Fullscreen
```
Local Video:
✓ Loops infinitely
✓ Can see controls
✓ No fullscreen button

YouTube/Vimeo:
✓ Loops infinitely
✓ Can see controls
✓ No fullscreen button
✓ URL has: ?loop=1&fs=0
```

## 🔍 HTML INSPECTION TESTS

### Test Local Video HTML
```
Right-click video > Inspect
Look for:
<div class="media_iframe_video o_custom_video_container"
     data-video-autoplay="true"
     data-video-loop="true"
     data-video-hide-controls="true"
     data-video-hide-fullscreen="true">
  <video src="/web/video/..."></video>
</div>

✓ All data-video-* attributes present
✓ Correct true/false values
✓ Video has correct src
```

### Test YouTube HTML
```
Right-click video > Inspect
Look for:
<iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&loop=1&controls=0&fs=0"
        frameborder="0"
        allowfullscreen="allowfullscreen">
</iframe>

✓ iframe src has all parameters
✓ Parameters match selected options
✓ URL format is correct
```

### Test Vimeo HTML
```
Right-click video > Inspect
Look for:
<iframe src="https://player.vimeo.com/video/76979871?autoplay=1&loop=1&controls=0"
        frameborder="0"
        allowfullscreen="allowfullscreen">
</iframe>

✓ iframe src has parameters
✓ Parameters match selected options
✓ URL format is correct
```

## 🖥️ BROWSER CONSOLE TESTS

### For Local Videos
```
F12 > Console

Should see logs like:
✓ "🎬 Video frontend handler initialized"
✓ "📹 Found 1 video container(s)"
✓ "✅ Autoplay: ENABLED (muted)"
✓ "✅ Loop: ENABLED"
✓ "✅ Controls: HIDDEN"
✓ "✅ Fullscreen: DISABLED"
✓ "✅ Initialized 1 video(s)"

If you see errors:
✓ Check browser console for red error messages
✓ Note any issues and report
```

## 📝 TESTING CHECKLIST

### Before Testing
- [ ] Clear browser cache (Ctrl+Shift+Delete)
- [ ] Hard refresh browser (Ctrl+Shift+R)
- [ ] Close any open editor tabs
- [ ] Use an incognito/private window if possible

### Local Video Test
- [ ] Upload test video from computer
- [ ] Options work in preview
- [ ] Add to page and save
- [ ] View website with local video
- [ ] All options apply correctly
- [ ] Console logs appear
- [ ] Inspect HTML shows data attributes

### YouTube Test
- [ ] Paste YouTube URL
- [ ] Options work in preview
- [ ] Add to page and save
- [ ] View website with YouTube video
- [ ] All options apply correctly
- [ ] Inspect HTML shows URL parameters
- [ ] Verify URL has ?autoplay=1&loop=1&controls=0&fs=0

### Vimeo Test
- [ ] Paste Vimeo URL
- [ ] Options work in preview
- [ ] Add to page and save
- [ ] View website with Vimeo video
- [ ] All options apply correctly
- [ ] Inspect HTML shows URL parameters
- [ ] Verify URL has correct parameters

### Multiple Videos Test
- [ ] Add 3 different videos (local, YouTube, Vimeo)
- [ ] Each with DIFFERENT option combinations
- [ ] Save page
- [ ] View website
- [ ] Each video behaves according to ITS options
- [ ] No conflicts between videos
- [ ] Console shows all 3 initialized

### Edge Cases
- [ ] Add video, then edit it again - options should load
- [ ] Add video with no options checked
- [ ] Add video with all options checked
- [ ] Change option and preview updates
- [ ] Save page with mixed video types

## ✅ Success Criteria

All tests pass if:
- ✅ Local videos: Options apply, video_handler.js runs
- ✅ YouTube videos: Options apply via URL parameters
- ✅ Vimeo videos: Options apply via URL parameters
- ✅ Preview updates when toggling options
- ✅ HTML saved correctly with options
- ✅ Website displays videos with correct options
- ✅ Multiple videos work independently
- ✅ No console errors

## 🎉 You're Ready!

Everything should be working now. Follow these tests and confirm all video types work with their respective option systems!

**Good luck with testing!** 🚀
