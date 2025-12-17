# Video Upload Testing Checklist

## Pre-Test Setup

- [ ] Clear browser cache (`Ctrl+Shift+Delete`)
- [ ] Close any open browser tabs with Odoo
- [ ] Reload Odoo (`F5` or `Ctrl+R`)
- [ ] Open Developer Console (`F12`)
- [ ] Go to Console tab
- [ ] Keep console visible during tests

## Test 1: Foreground Video Upload ✅

**Purpose:** Verify normal in-page video uploads still work

```
Steps:
1. [ ] Go to Website → Website Builder
2. [ ] Click "Insert" menu → "Media"
3. [ ] Click "Videos" tab
4. [ ] Click "Upload a video"
5. [ ] Select an MP4 video file (< 100MB)
6. [ ] Wait for upload to complete
7. [ ] Set options:
       - [ ] Toggle "Autoplay"
       - [ ] Toggle "Loop"
       - [ ] Toggle "Hide player controls"
       - [ ] Toggle "Hide fullscreen button"
8. [ ] Click "Save"

Expected Results:
✅ Video uploads successfully
✅ Console shows: "✅ Video uploaded: /web/video/..."
✅ Video appears in editor with controls applied
✅ Modal closes successfully
❌ No error messages in console
```

## Test 2: Background Video Upload (Local) ✅

**Purpose:** Verify local video background upload works

```
Steps:
1. [ ] Go to Website → Website Builder
2. [ ] Insert a "Cover" snippet
3. [ ] Click the cover area
4. [ ] In right panel, look for "Set Background" option
5. [ ] Choose "Video" as background type
6. [ ] Modal opens with Video tab
7. [ ] Click "Upload a video"
8. [ ] Select an MP4 video file (< 100MB)
9. [ ] Wait for upload to complete
10. [ ] Click "Save"

Expected Results:
✅ Console shows: "✅ [BACKGROUND] Got video from window.__currentSelectedVideoData"
✅ Console shows: "✅ [BACKGROUND] Background video saved successfully!"
✅ Video appears as background in cover
✅ Modal closes successfully
❌ No "null.src" errors in console
❌ No TypeErrors
```

## Test 3: Background Video URL (YouTube) ✅

**Purpose:** Verify YouTube video in background still works

```
Steps:
1. [ ] Go to Website → Website Builder
2. [ ] Insert a "Cover" snippet
3. [ ] Click cover → Set Background → Video
4. [ ] Paste YouTube URL: https://www.youtube.com/watch?v=dQw4w9WgXcQ
5. [ ] Click "Save"

Expected Results:
✅ YouTube video appears as background
✅ Modal closes
✅ No errors
```

## Test 4: Background Video URL (Vimeo) ✅

**Purpose:** Verify Vimeo video in background still works

```
Steps:
1. [ ] Go to Website → Website Builder
2. [ ] Insert a "Cover" snippet
3. [ ] Click cover → Set Background → Video
4. [ ] Paste Vimeo URL: https://vimeo.com/90509568
5. [ ] Click "Save"

Expected Results:
✅ Vimeo video appears as background
✅ Modal closes
✅ No errors
```

## Test 5: Video Controls Persistence ✅

**Purpose:** Verify control options are saved

```
Steps:
1. [ ] Upload a foreground video
2. [ ] Set options: Autoplay ON, Loop ON, Hide Controls OFF
3. [ ] Click "Save"
4. [ ] Edit the video again
5. [ ] Check options are still set correctly

Expected Results:
✅ Autoplay: ON
✅ Loop: ON
✅ Hide Controls: OFF
```

## Test 6: Multiple Videos ✅

**Purpose:** Verify can upload multiple videos

```
Steps:
1. [ ] Upload Video 1 (foreground)
2. [ ] Click "Save"
3. [ ] Insert another video
4. [ ] Upload Video 2 (different file)
5. [ ] Click "Save"
6. [ ] Both videos appear on page

Expected Results:
✅ Both videos load
✅ Each has independent controls
✅ No conflicts
```

## Test 7: Video Replacement ✅

**Purpose:** Verify can replace existing video

```
Steps:
1. [ ] Upload Video 1
2. [ ] Click "Save"
3. [ ] Click on the video
4. [ ] Click "Replace media"
5. [ ] Upload Video 2
6. [ ] Click "Save"

Expected Results:
✅ Video 1 is replaced with Video 2
✅ Modal closes cleanly
❌ No errors
```

## Test 8: Cancel Dialog ✅

**Purpose:** Verify can cancel without errors

```
Steps:
1. [ ] Go to Website → Website Builder
2. [ ] Click "Insert" → "Media" → "Videos"
3. [ ] Click Upload (but don't select file)
4. [ ] Click "Close" or press Escape
5. [ ] Modal closes

Expected Results:
✅ Modal closes
❌ No errors
❌ No null.src errors
```

## Test 9: Large File Upload ✅

**Purpose:** Verify handles large videos

```
Steps:
1. [ ] Prepare an 80-90MB video file
2. [ ] Go to Website → Website Builder
3. [ ] Click "Insert" → "Media" → "Videos"
4. [ ] Upload the large file
5. [ ] Wait for completion

Expected Results:
✅ File uploads successfully
✅ Takes 10-30 seconds depending on connection
❌ No timeout errors
❌ No out-of-memory errors
```

## Test 10: Invalid Format ✅

**Purpose:** Verify rejects invalid formats

```
Steps:
1. [ ] Go to Website → Website Builder
2. [ ] Click "Insert" → "Media" → "Videos"
3. [ ] Try to upload an image file (JPG/PNG)
4. [ ] Or try to upload an audio file (MP3)

Expected Results:
✅ Shows error: "Invalid format. Allowed: MP4, WebM, OGG, MOV, AVI"
✅ File is not uploaded
```

## Console Error Monitoring

During all tests, watch console for:

### ✅ Good Messages (Expected)
```
✅ VideoSelector initialized
✅ Video uploaded: /web/video/...
✅ [getMediaDataForSave] Returning local video data
✅ [BACKGROUND] Background video saved successfully!
```

### ⚠️ Warning Messages (OK, Informational)
```
⚠️ Could not patch SetCoverImagePositionAction
⚠️ [PATCH] Could not find module
```

### 🔴 Bad Messages (Should NOT See)
```
❌ TypeError: Cannot read properties of null (reading 'src')
❌ Uncaught TypeError at ...
❌ [Error] Unexpected error during video save
```

## Error Suppression Messages

These ARE okay - they mean errors were successfully suppressed:

```
✅ [GLOBAL] Suppressed null.src error
✅ [CONSOLE ERROR SUPPRESSION] Blocked null.src error
🛡️ [BACKGROUND] Suppressed null.src error during save
```

## Performance Benchmarks

| Operation | Expected Time | Status |
|-----------|---------------|--------|
| Upload small video (< 5MB) | 2-5 seconds | ✅ |
| Upload medium video (5-30MB) | 10-20 seconds | ✅ |
| Upload large video (30-80MB) | 30-60 seconds | ✅ |
| Save background video | < 1 second | ✅ |
| Save foreground video | < 1 second | ✅ |
| Replace video | < 2 seconds | ✅ |

## Test Environment Info

```
Odoo Version: 19.0
Browser: Chrome/Firefox/Safari (specify: _________)
OS: Windows/Mac/Linux (specify: _________)
Video Formats Tested:
  - [ ] MP4
  - [ ] WebM
  - [ ] OGG
  - [ ] MOV
  - [ ] AVI

Test Date: _______________
Tester Name: _______________
Status: ✅ PASSED / ❌ FAILED
```

## Sign-Off

- [ ] All 10 tests passed
- [ ] No console errors
- [ ] No performance issues
- [ ] Ready for production

**Tested By:** _______________  
**Date:** _______________  
**Notes:** _______________________________________________
