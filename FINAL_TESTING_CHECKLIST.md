# ✅ FINAL TESTING CHECKLIST

## Pre-Test

- [ ] Stop Odoo: `killall python3`
- [ ] Wait 3 seconds
- [ ] Clear browser cache: `Ctrl+Shift+Delete` → Select **ALL TIME**
- [ ] Close browser completely
- [ ] Delete Odoo cache: `rm -rf /home/saif/odoo-19/.web_cache`

## Start Odoo

```bash
cd /home/saif/odoo-19
odoo-bin -d yourdb --addons-path=. --dev=xml,reload
```

- [ ] Wait for "HTTP server ready" message
- [ ] Open browser
- [ ] Open F12 (Developer Tools → Console tab)

## Test 1: Foreground Video with All Controls

1. **Navigate to Website → Edit Page**
2. **Click + → Video**
3. **Upload local video file**
4. **Check ALL options:**
   - [ ] Autoplay
   - [ ] Loop
   - [ ] Hide player controls
   - [ ] Hide fullscreen button
5. **Click "Add" button**

**Expected Console Output:**
```
✅ Preview: Autoplay ON
✅ Preview: Loop ON
✅ Preview: Controls HIDDEN
✅ Preview: Fullscreen DISABLED

🎬 [MediaDialog] renderMedia() called
🎬 Is local video detected? true
🎬 LOCAL VIDEO DETECTED - Creating VIDEO element manually
✅ Applied: Autoplay ON
✅ Applied: Loop ON
✅ Applied: Controls HIDDEN
✅ Applied: Fullscreen DISABLED
✅ Video element created successfully
✅ Element className: media_iframe_video o_custom_video_container
✅ Element data-is-local-video: true
```

**If you see this:** ✅ SUCCESS! Proceed to next test.

**If you see:** `data-is-local-video: null` → Cache issue, restart everything and try again.

## Test 2: Save & Publish

1. **Click "Save"**
2. **Click "Publish"**
3. **View the published page**

**Expected:**
- Video should appear
- Video should auto-play
- Video should loop
- Video controls should be HIDDEN
- Fullscreen button should be HIDDEN

## Test 3: Inspect Element

1. **Right-click on video → Inspect (F12)**
2. **Look for HTML:**
   ```html
   <div class="media_iframe_video o_custom_video_container"
        data-is-local-video="true"
        data-video-autoplay="true"
        data-video-loop="true"
        data-video-hide-controls="true"
        data-video-hide-fullscreen="true">
     <video src="/web/video/..." autoplay="" muted="" loop="" playsinline=""></video>
   </div>
   ```

- [ ] Has `class="media_iframe_video o_custom_video_container"`
- [ ] Has `data-is-local-video="true"`
- [ ] Has `data-video-autoplay="true"`
- [ ] Has `data-video-loop="true"`
- [ ] Has `data-video-hide-controls="true"`
- [ ] Has `data-video-hide-fullscreen="true"`
- [ ] Video element has `autoplay=""` attribute
- [ ] Video element has `muted=""` attribute
- [ ] Video element has `loop=""` attribute

## Test 4: Test with No Controls

1. **Go back to edit page**
2. **Click + → Video**
3. **Upload new video**
4. **DON'T check any options**
5. **Click "Add"**
6. **Publish**

**Expected on website:**
- Video shows with ALL controls visible
- NO autoplay
- NO loop
- Fullscreen button visible

**Expected in HTML:**
```html
<div class="media_iframe_video o_custom_video_container"
     data-is-local-video="true"
     data-video-autoplay="false"
     data-video-loop="false"
     data-video-hide-controls="false"
     data-video-hide-fullscreen="false">
  <video src="/web/video/..." controls=""></video>
</div>
```

## Test 5: YouTube/Vimeo Still Works

1. **Click + → Video → Paste YouTube URL**
2. **Click "Add"**
3. **Publish**

**Expected:**
- Works normally
- Shows iframe, not video element
- YouTube player works as usual

## Success Criteria

✅ All 5 tests pass
✅ Console shows `data-is-local-video: true`
✅ HTML has all data-video-* attributes
✅ Video controls work as configured
✅ YouTube/Vimeo still work

---

## If Any Test Fails

**1. Console shows `Element data-is-local-video: null`:**
- Clear cache completely
- Restart browser AND Odoo
- Try again

**2. Video doesn't show on website:**
- Check that `/web/video/` route is working
- Check file permissions on video files
- Check error logs: `tail -f /var/log/odoo.log`

**3. Controls don't apply on website:**
- Check `video_frontend_processor.js` is loaded
- Verify `data-video-*` attributes exist in HTML
- Check frontend console for errors

**4. YouTube/Vimeo broken:**
- Check parent's renderMedia still called for non-local videos
- Verify `isLocalVideo` check is correct

---

**Once all tests pass, you're DONE! 🎉**

The video upload system with full control persistence is fully functional!
