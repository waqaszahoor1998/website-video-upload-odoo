"""
OVERRIDE SUMMARY: Add Button Logic for Local Videos with Controls

Problem Fixed:
- Video controls (autoplay, loop, hideControls, hideFullscreen) were not persisting 
  when the "Add" button was clicked
- Controls worked in preview but disabled when inserted into the website

Solution Implemented:
1. Enhanced createElements() method to read and apply controls from localVideoOptions
2. Updated updateVideo() to pass full media data with control settings to selectMedia()
3. Added data attributes (data-autoplay, data-loop, data-hide-controls, data-hide-fullscreen) 
   to video elements - these persist in HTML when saved
4. Created frontend processor (video_frontend_processor.js) to restore controls on page load
5. Updated manifest to load frontend processor on website frontend

Key Changes:

A) video_selector_upload.js - createElements():
   - Reads controls from this.localVideoOptions (set by UI toggles)
   - Applies both HTML attributes AND data attributes
   - HTML attributes control playback in editor
   - Data attributes persist in saved HTML

B) video_selector_upload.js - updateVideo():
   - Now passes complete mediaData object with controls to selectMedia()
   - Data attributes ensure controls survive Odoo's HTML save/load cycle

C) video_frontend_processor.js (NEW):
   - Runs on page load (DOMContentLoaded event)
   - Scans for .o_custom_video_container elements
   - Reads data-autoplay, data-loop, data-hide-controls, data-hide-fullscreen
   - Applies these settings to restore controls on the frontend

D) video_styles.css (NEW):
   - CSS to hide controls when hideControls is enabled
   - Styling for video containers

E) __manifest__.py:
   - Added video_frontend_processor.js to web.assets_frontend

Flow Diagram:
=============

EDIT MODE:
1. User uploads video → handleVideoFileUpload() → /web/video/upload/json
2. User toggles controls → onChangeOption() → updates localVideoOptions
3. Preview updates → updateLocalVideoPreview()
4. User clicks "Add" → createElements() → reads localVideoOptions
5. Video element created with data-autoplay, data-loop, etc.
6. Odoo saves HTML with these data attributes

FRONTEND (Visitor Mode):
1. Page loads → DOMContentLoaded fires
2. video_frontend_processor.js runs
3. Scans for .o_custom_video_container elements
4. Reads data-* attributes
5. Applies to video element → controls persist!

Critical Implementation Details:
================================

1. Data Attributes vs HTML Attributes:
   - HTML attributes (autoplay, loop, controls) control immediate behavior
   - Data attributes (data-autoplay, data-loop, etc.) survive HTML serialization
   - Frontend processor reads data attributes and reapplies HTML attributes

2. Control Mappings:
   autoplay: true → setAttribute('autoplay', 'muted', 'playsinline')
   loop: true → setAttribute('loop', '')
   hideControls: true → removeAttribute('controls') + add class 'no-controls'
   hideFullscreen: true → setAttribute('controlsList', 'nodownload nofullscreen')

3. Inverted Logic for Controls:
   - UI shows: "Hide player controls" (hideControls boolean)
   - When TRUE: don't show controls (no controls attribute)
   - When FALSE: show controls (add controls attribute)

4. Autoplay Requires Muted:
   - Modern browsers require muted for autoplay to work
   - When autoplay=true, also set muted=true and playsinline=true

Testing:
========

In Edit Mode:
1. Upload a video
2. Toggle: Autoplay ON, Loop ON, Hide Controls ON, Hide Fullscreen ON
3. Check preview - should show video without controls, looping
4. Click "Add" button
5. Save page

On Frontend:
1. Load page as visitor
2. Video should autoplay, loop, have no controls
3. Seek bar disabled if hideControls=true

Expected HTML Output:
<div class="media_iframe_video o_custom_video_container" data-oe-expression="/web/video/...">
    <div class="css_editable_mode_display"></div>
    <div class="media_iframe_video_size" contenteditable="false"></div>
    <video src="/web/video/..." 
           preload="metadata"
           autoplay="autoplay" 
           muted="muted" 
           playsinline="playsinline"
           loop="loop"
           data-autoplay="true"
           data-loop="true"
           data-hide-controls="true"
           data-hide-fullscreen="true"
           class="no-controls"
           style="width: 100%; height: auto; max-width: 100%; background: #000; border-radius: 8px; display: block;">
    </video>
</div>

Supported Video Formats:
- video/mp4 (.mp4)
- video/webm (.webm)
- video/ogg (.ogg)
- video/quicktime (.mov)
- video/x-msvideo (.avi)

Max File Size: 100MB

Backend Routes:
- POST /web/video/upload/json - Upload video
- GET /web/video/<filename> - Serve video
- POST /web/video/list - List uploaded videos
- POST /web/video/delete - Delete video
"""