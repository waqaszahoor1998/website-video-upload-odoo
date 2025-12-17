# Video Upload with Controls - Complete Logic Implementation

## Overview

This document explains the complete logic flow for uploading videos with playback controls (autoplay, loop, hide controls, hide fullscreen) that properly persist when inserted into the Odoo 19 website.

## Architecture

The solution works in 5 stages:

### Stage 1: Upload & Preview (video_selector_upload.js)

**What happens:**
1. User uploads a video file or selects from previously uploaded videos
2. Video options are configured in the editor preview (autoplay, loop, hide controls, etc.)
3. Controls are stored in `this.localVideoOptions` state

**Key functions:**
- `handleVideoFileUpload()` - Uploads video to server via `/web/video/upload/json`
- `updateVideo()` - Detects local video and initializes options
- `onChangeOption()` - Updates control options and live preview
- `updateLocalVideoPreview()` - Shows how video will look with selected controls

**Data flow:**
```
User selects video → updateVideo() → Initialize state.options → updateLocalVideoPreview()
                                   → selectMedia(mediaData with controls)
```

### Stage 2: Add Button (MediaDialog.save() in video_selector_upload.js)

**What happens:**
1. User clicks "Add" button to insert video into website
2. MediaDialog.save() is called
3. createElements() is invoked to create the HTML structure
4. Video container div is created with control data attributes

**Key method: createElements()**
```javascript
- Creates div with classes: 'media_iframe_video' + 'o_custom_video_container'
- Sets data-video-* attributes on container (PRIMARY STORAGE)
- Creates video element
- Sets HTML attributes on video (autoplay, loop, controls, etc.)
- Appends video to container
```

**Critical storage points:**
```html
<div class="media_iframe_video o_custom_video_container" 
     data-video-autoplay="true"
     data-video-loop="true"
     data-video-hide-controls="false"
     data-video-hide-fullscreen="false"
     data-oe-expression="/web/video/...">
  <div class="media_iframe_video_size"></div>
  <video src="/web/video/..." 
         autoplay="autoplay" 
         muted="muted" 
         playsinline="playsinline" 
         loop="loop" 
         controls="controls">
  </video>
</div>
```

**Data flow:**
```
User clicks "Add" → MediaDialog.save() → renderMedia() 
                 → createElements() → Create HTML with controls
                 → props.save() → Insert into website HTML
```

### Stage 3: HTML Serialization (Odoo Editor)

**What happens:**
1. Odoo editor serializes the created HTML element into the database
2. Both container data attributes AND video element HTML attributes are saved
3. When page is published, the HTML is sent to the frontend with all attributes intact

**Why it works:**
- Container data attributes are preserved because they're standard HTML attributes
- Video element attributes (autoplay, loop, controls) are standard HTML5, Odoo preserves them
- The `data-oe-expression` attribute helps Odoo editor recognize it as a custom element

### Stage 4: Frontend Processing (video_frontend_processor.js)

**What happens:**
1. JavaScript runs on published website
2. Finds all video containers with class `o_custom_video_container`
3. Reads control settings from container data attributes
4. Applies control attributes to video elements
5. Continuously monitors for dynamically added videos (AJAX)

**Key function: processLocalVideos()**
```javascript
// Find containers
let videoContainers = document.querySelectorAll('.media_iframe_video.o_custom_video_container');

// For each container:
1. Read: data-video-autoplay, data-video-loop, data-video-hide-controls, data-video-hide-fullscreen
2. Apply control attributes to video element:
   - Autoplay: setAttribute('autoplay'), setAttribute('muted'), setAttribute('playsinline')
   - Loop: setAttribute('loop')
   - Hide controls: removeAttribute('controls') or setAttribute('controls')
   - Hide fullscreen: setAttribute('controlsList', 'nodownload nofullscreen')
```

**Data flow:**
```
Website loads → processLocalVideos() → Find .o_custom_video_container divs
             → Read data-video-* attributes
             → Apply to video elements
             → Video plays with correct controls
```

### Stage 5: Website Display

**What the user sees:**
- Video with selected controls working correctly
- Autoplay videos play automatically (muted)
- Loop videos repeat
- Controls can be hidden
- Fullscreen can be disabled

---

## Key Design Principles

### 1. **Dual Storage Strategy**
- **Primary:** Container data attributes (`data-video-*`)
  - These are plain HTML, always preserved
  - Read by frontend processor
- **Secondary:** Video element HTML attributes
  - These are standard HTML5, preserved by Odoo
  - Used as fallback by browser

### 2. **Fallback Detection**
The frontend processor checks multiple selectors to find videos:
```javascript
1. First: .media_iframe_video.o_custom_video_container (ideal case)
2. Second: .media_iframe_video with video child having /web/video/ src
3. Third: Elements with data-video-* attributes
```

### 3. **Browser Compatibility**
- Uses standard HTML5 attributes (autoplay, loop, controls, etc.)
- Mutes autoplay videos (browser requirement)
- Uses controlsList for fullscreen restrictions
- Handles browser autoplay blocking gracefully

---

## Control Attribute Mapping

| Control | HTML Attribute | Data Attribute | Effect |
|---------|----------------|----------------|--------|
| Autoplay ON | autoplay="autoplay" muted="muted" playsinline="playsinline" | data-video-autoplay="true" | Video starts automatically |
| Autoplay OFF | (removed) | data-video-autoplay="false" | Manual play required |
| Loop ON | loop="loop" | data-video-loop="true" | Video repeats |
| Loop OFF | (removed) | data-video-loop="false" | Plays once |
| Hide Controls | (remove controls) | data-video-hide-controls="true" | No control buttons visible |
| Show Controls | controls="controls" | data-video-hide-controls="false" | Control buttons visible |
| Hide Fullscreen | controlsList="nodownload nofullscreen" | data-video-hide-fullscreen="true" | Fullscreen disabled |
| Show Fullscreen | (removed) | data-video-hide-fullscreen="false" | Fullscreen enabled |

---

## Code Flow Summary

### Upload to Website Insertion (Complete Flow)

```
1. EDITOR - Upload/Select Video
   User uploads video → handleVideoFileUpload()
   Video saved to: /web/video/[filename]

2. EDITOR - Configure Controls
   User checks autoplay/loop/etc → onChangeOption()
   Controls updated in: this.localVideoOptions

3. EDITOR - Live Preview
   updateLocalVideoPreview() applies controls to preview video element
   User sees exactly how it will look

4. EDITOR - Click "Add"
   User clicks "Add" button → MediaDialog.save() called

5. CREATE ELEMENTS
   createElements(selectedMedia) called:
   - Creates <div class="media_iframe_video o_custom_video_container">
   - Sets data-video-autoplay, data-video-loop, etc on container
   - Creates <video> element with HTML attribute versions
   - Returns div with video inside

6. SAVE TO DATABASE
   Odoo editor receives returned div
   Serializes HTML to database
   Both data attributes AND video attributes saved

7. PUBLISH WEBSITE
   HTML is sent to frontend with all attributes intact

8. FRONTEND - Process Videos
   video_frontend_processor.js runs:
   - Finds .o_custom_video_container divs
   - Reads data-video-* attributes
   - Applies control attributes to video elements
   - Video plays with correct controls
```

---

## Debugging

### If controls aren't working:

1. **In Editor:**
   - Open browser console
   - Check if preview shows correct controls
   - Verify `this.localVideoOptions` has correct values
   - Check if data attributes are set in createElements log

2. **On Published Website:**
   - Check browser console for "Video Frontend Processor" messages
   - Search for "Final video element attributes" to see what's applied
   - Verify container has `o_custom_video_container` class
   - Check if data-video-* attributes are present in HTML

3. **HTML Inspection:**
   ```html
   <!-- Look for this structure in published website -->
   <div class="media_iframe_video o_custom_video_container" 
        data-video-autoplay="true"
        data-video-loop="true"
        data-video-hide-controls="false"
        data-video-hide-fullscreen="false">
     <video src="/web/video/..." autoplay="autoplay" loop="loop" controls="controls"></video>
   </div>
   ```

---

## Testing Checklist

- [ ] Upload video in editor
- [ ] Verify video appears in "Recently Uploaded" list
- [ ] Configure controls in preview (autoplay, loop, hide controls, hide fullscreen)
- [ ] Verify preview video shows correct behavior
- [ ] Click "Add" to insert into website
- [ ] Publish website
- [ ] View published website
- [ ] Verify video plays with correct controls
- [ ] Check browser console for frontend processor logs

---

## Files Involved

1. **Backend:**
   - `controllers/main.py` - Video upload and serving

2. **Frontend Editor:**
   - `static/src/js/video_selector_upload.js` - Main logic
   - `static/src/xml/video_upload_templates.xml` - UI templates

3. **Frontend Website:**
   - `static/src/js/video_frontend_processor.js` - Control application
   - `static/src/js/video_selector_patch.js` - VideoSelector patches
   - `static/src/js/video_frontend_processor.js` - Render media patches

4. **Manifest:**
   - `__manifest__.py` - Asset registration

---

## Summary

The solution works by:
1. Storing control settings in data attributes on the container
2. Also setting standard HTML attributes on the video element
3. Having the frontend processor read the data attributes and verify/apply controls
4. Using standard HTML5 attributes that Odoo preserves during serialization

This ensures controls work reliably from editor preview → website HTML → published website display.
