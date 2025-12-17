# 🚀 QUICK START - Test the Iframe Approach

## One-Time Setup (2 minutes)

```bash
# 1. Stop Odoo
killall python3
sleep 3

# 2. Clear everything
find /home/saif/odoo-19 -name "*.pyc" -delete
find /home/saif/odoo-19 -type d -name "__pycache__" -exec rm -rf {} +

# 3. Clear browser cache (Ctrl+Shift+Delete, select ALL TIME)

# 4. Start Odoo in dev mode
cd /home/saif/odoo-19
odoo-bin -d yourdb --addons-path=. --dev=xml,reload

# 5. Wait for: HTTP server ready
```

## Test Flow (3 minutes)

1. **Edit website:**
   - Website → Pages → Edit

2. **Add video:**
   - Click + → Video

3. **Upload & configure:**
   - Choose video file (or select existing)
   - ✓ Check "Autoplay" 
   - ✓ Check "Loop"
   - ✓ Check "Hide player controls"
   - Watch preview change in real-time

4. **Insert:**
   - Click "Add"
   - Save page
   - Publish

5. **Verify on website:**
   - Open published page
   - ✅ Video should auto-play
   - ✅ Video should loop
   - ✅ No player controls visible

## Debug: Check Inspector (F12)

Right-click video → Inspect Element

**You should see:**
```html
<div class="o_card_img card-img-top media_iframe_video" 
     data-is-local-video="true"
     data-video-autoplay="true"
     data-video-loop="true"
     data-video-hide-controls="true">
  <iframe src="/web/video/filename?autoplay=1&muted=1&loop=1&controls=0"
          allowfullscreen="true">
  </iframe>
</div>
```

## Key Indicators

### ✅ SUCCESS
- Editor log: `🎬 createElements() called in VideoSelector`
- Website log: `🎬 [Frontend] Found X local video container(s)`
- Website log: `✅ Applied: Autoplay ON`
- Website log: `✅ Applied: Loop ON`
- Iframe src contains query parameters: `?autoplay=1&...`
- Video behavior matches your settings

### ❌ NOT WORKING
- No `🎬 createElements()` log → Cache not cleared
- Found 0 video containers → Check iframe has `/web/video/` URL
- Iframe src has NO query parameters → Frontend processor didn't run
- Video doesn't auto-play → Check `autoplay=1` in URL

## Browser Console Commands

```javascript
// Find all local video divs
document.querySelectorAll('[data-is-local-video="true"]').length

// Check iframe src
document.querySelector('iframe').src

// Check data attributes
const div = document.querySelector('[data-is-local-video="true"]');
console.log({
  autoplay: div.getAttribute('data-video-autoplay'),
  loop: div.getAttribute('data-video-loop'),
  hideControls: div.getAttribute('data-video-hide-controls')
});
```

## If Still Not Working

**Problem: 0 containers found**
- Check iframe has `/web/video/` in src
- Check `data-is-local-video="true"` exists on container

**Problem: Iframe src has NO query parameters**
- Open browser console (F12)
- Check for error logs
- Verify `video_frontend_processor.js` is loaded
- Look for: `✅ Video Frontend Processor initialized`

**Problem: Video doesn't auto-play**
- Check iframe src ends with: `?autoplay=1&muted=1`
- Browser might block autoplay - check browser warnings
- Try: Turn off ad blockers, check privacy settings

**Nuclear Reset:**
```bash
# Remove ALL Odoo cache
rm -rf /home/saif/odoo-19/.web_cache
rm -rf /home/saif/odoo-19/web

# Kill Python completely
pkill -9 python3

# Restart
cd /home/saif/odoo-19
odoo-bin -d yourdb --addons-path=. --dev=xml,reload

# Then Ctrl+Shift+Delete in browser (clear ALL TIME)
```

---

## Expected Console Output

**In Editor (when clicking "Add"):**
```
🎬 createElements() called in VideoSelector
🎬 Processing media: {src: '/web/video/...', isLocalVideo: true}
🎬 Creating LOCAL VIDEO using iframe approach
🎬 Found iframe from parent, updating for local video
✅ Updated iframe src to local video: /web/video/...
✅ Container data attributes: {autoplay: true, loop: true, ...}
```

**On Website (when page loads):**
```
🎬 Video Frontend Processor Loaded
🎬 [Frontend] Starting processLocalVideos()
🎬 [Frontend] Found X .media_iframe_video divs
🎬 [Frontend] Found X local video container(s)
🎬 Processing local video 1
📋 Read control settings: {autoplay: true, loop: true, hideControls: true, ...}
✅ Applied: Autoplay ON
✅ Applied: Loop ON
✅ Applied: Controls HIDDEN
✅ Local video iframe processed successfully
```

---

**Ready to test! 🎬**
