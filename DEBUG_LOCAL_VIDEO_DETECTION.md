# 🔍 DEBUG GUIDE - Checking if Local Video is Being Detected

## The Issue

When clicking "Add" button, console shows:
```
🎬 First element is local video? false
🎬 Processing non-local video element
```

Even though you uploaded a LOCAL video.

## Root Cause

The `createElements()` method is correctly setting `o_custom_video_container` class, but something is clearing it or the detection in `renderMedia()` is failing.

## How to Debug

### Step 1: Check if `createElements()` is Being Called with Local Video Data

**Open browser console (F12)** and look for these logs when you click "Add":

```
🎬 getSelectedMedia() called
🎬 state.platform: local
🎬 state.src: /web/video/Screencast...
✅ Built local video selectedMedia:
🎬 isLocalVideo flag set to: true
🎬 platform set to: local
```

**If you DON'T see these logs:**
- Cache not cleared properly
- JavaScript not reloaded
- → Clear cache completely: `Ctrl+Shift+Delete` (select ALL TIME)
- → Restart browser tab
- → Try again

**If you DO see these logs:**
- Proceed to Step 2

### Step 2: Check if `createElements()` Receives Local Video Flag

Look for:
```
🎬 createElements() called in VideoSelector
🎬 Processing media: {src: '/web/video/...', isLocalVideo: true}
🎬 Creating LOCAL VIDEO using VIDEO ELEMENT (not iframe)
✅ Set div classes: media_iframe_video o_custom_video_container
✅ Final div has o_custom_video_container? true
```

**If isLocalVideo is FALSE:**
- The flag isn't being passed from `getSelectedMedia()`
- Check that `state.platform === 'local'` in getSelectedMedia()

**If isLocalVideo is TRUE but classes are missing:**
- classList.add() might not be working
- Check browser console for JavaScript errors

### Step 3: Check if Classes Survive to `renderMedia()`

Look for in `renderMedia()`:
```
🎬 First element className BEFORE processing: media_iframe_video o_custom_video_container
🎬 First element classList: ["media_iframe_video", "o_custom_video_container"]
🎬 First element is local video? true
```

**If className is EMPTY:**
- Something is clearing the classes between createElements() and renderMedia()
- This might be parent's processing

**If it shows TRUE:**
- Issue might be elsewhere

### Step 4: Run These Commands in Browser Console

```javascript
// 1. Check last video element
const lastDiv = document.querySelector('[data-is-local-video="true"]');
console.log('Found local video div?', !!lastDiv);
console.log('Classes:', lastDiv?.className);
console.log('Has o_custom_video_container?', lastDiv?.classList.contains('o_custom_video_container'));

// 2. Check video element inside
const video = lastDiv?.querySelector('video');
console.log('Found video element?', !!video);
console.log('Video src:', video?.src);

// 3. Check data attributes
console.log('data-is-local-video:', lastDiv?.getAttribute('data-is-local-video'));
console.log('data-video-autoplay:', lastDiv?.getAttribute('data-video-autoplay'));
```

## Common Issues & Solutions

### Issue 1: `isLocalVideo: true` but createElements() shows `isLocalVideo: false`

**Problem:** Data not passed correctly to createElements()

**Solution:**
```javascript
// In console, check what selectMedia stored:
console.log('Check this.props.selectMedia data');
// If it shows YouTube/Vimeo URL instead of /web/video/, 
// then state.platform is not being set to 'local'
```

### Issue 2: Classes set in createElements() but empty in renderMedia()

**Problem:** Parent's processing is overwriting

**Solution:** Make sure renderMedia() check happens BEFORE parent processing

**In code:**
```javascript
// Check isLocalVideo FIRST before parent adds classes
const isLocalVideo = element.classList.contains('o_custom_video_container') || 
                    element.getAttribute('data-is-local-video') === 'true';

// If local video, DON'T call parent processing
if (!isLocalVideo) {
    // Only parent processing for YouTube/Vimeo
    element.classList.add(...this.props.media.classList);
}
```

### Issue 3: Classes exist but detection still says false

**Problem:** classList or getAttribute not working as expected

**Solution:** Use data attribute as primary check:

```javascript
// Always check data-is-local-video FIRST
const isLocalVideo = element.getAttribute('data-is-local-video') === 'true' ||
                    element.classList.contains('o_custom_video_container');
```

## Full Debug Checklist

- [ ] Console shows `🎬 getSelectedMedia() called`
- [ ] Console shows `🎬 state.platform: local`
- [ ] Console shows `✅ Built local video selectedMedia`
- [ ] Console shows `🎬 isLocalVideo flag set to: true`
- [ ] Console shows `🎬 createElements() called in VideoSelector`
- [ ] Console shows `isLocalVideo: true` in createElements
- [ ] Console shows `✅ Set div classes: media_iframe_video o_custom_video_container`
- [ ] Console shows `true` for `First element has o_custom_video_container?`
- [ ] `document.querySelector('[data-is-local-video="true"]')` finds the element
- [ ] Element has classes `media_iframe_video o_custom_video_container`

## If Still Not Working

1. **Copy all console logs starting from "Add" button click**
2. **Post them here**
3. We can trace exactly where the issue is

## Key File Sections to Check

**getSelectedMedia()** (video_selector_upload.js, line ~390)
- Should set `isLocalVideo: true` for local videos
- Should set `platform: 'local'`

**createElements()** (video_selector_upload.js, line ~420)
- Should detect `isLocalVideo === true`
- Should set `o_custom_video_container` class
- Should set `data-is-local-video="true"` attribute

**renderMedia()** (MediaDialog patch, line ~730)
- Should check `data-is-local-video` attribute
- Should NOT call parent processing for local videos

---

**Follow this guide to identify exactly where the local video flag is being lost!**
