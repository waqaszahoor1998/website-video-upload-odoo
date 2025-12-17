# Video Control Flow Diagram

## Complete Video Insertion Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          EDITOR (Odoo Backend)                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  STEP 1: USER UPLOADS VIDEO                                                │
│  ┌──────────────────────────────────────┐                                  │
│  │ Click "Choose Video File"            │                                  │
│  │ Select file from PC                  │                                  │
│  └────────────┬─────────────────────────┘                                  │
│               ↓                                                              │
│  handleVideoFileUpload()                                                    │
│  ├─ Convert file to base64                                                │
│  ├─ Call /web/video/upload/json                                          │
│  └─ Save to: /web/video/[filename]                                       │
│               ↓                                                              │
│  STEP 2: VIDEO APPEARS IN PREVIEW                                         │
│  ┌──────────────────────────────────────┐                                  │
│  │ Video loads in preview                │                                  │
│  │ Suggested videos list updated         │                                  │
│  └────────────┬─────────────────────────┘                                  │
│               ↓                                                              │
│  STEP 3: USER CONFIGURES CONTROLS                                         │
│  ┌──────────────────────────────────────┐                                  │
│  │ ☐ Autoplay    (uncheck to disable)  │                                  │
│  │ ☐ Loop        (uncheck to disable)  │                                  │
│  │ ☐ Hide Controls (uncheck to show)   │                                  │
│  │ ☐ Hide Fullscreen (uncheck to show) │                                  │
│  └────────────┬─────────────────────────┘                                  │
│               ↓                                                              │
│  onChangeOption() for each control                                         │
│  ├─ Update this.localVideoOptions                                         │
│  ├─ Update state.options                                                  │
│  └─ updateLocalVideoPreview() - shows exact behavior                      │
│               ↓                                                              │
│  STEP 4: PREVIEW SHOWS REAL BEHAVIOR                                      │
│  ┌──────────────────────────────────────┐                                  │
│  │ Video: ▶ 00:10 / 01:00              │ (If autoplay checked)          │
│  │ [No controls visible if hidden]      │                                  │
│  │ [Loops if loop checked]              │                                  │
│  └────────────┬─────────────────────────┘                                  │
│               ↓                                                              │
│  STEP 5: USER CLICKS "ADD"                                                │
│  ┌──────────────────────────────────────┐                                  │
│  │ Click "Add" button                   │                                  │
│  └────────────┬─────────────────────────┘                                  │
│               ↓                                                              │
│  MediaDialog.save() called                                                 │
│  ├─ validateMedia()                                                       │
│  ├─ renderMedia() - calls createElements()                               │
│  └─ props.save() - inserts into page                                     │
│               ↓                                                              │
│  STEP 6: CREATE ELEMENTS WITH CONTROLS                                    │
│  ┌──────────────────────────────────────┐                                  │
│  │ createElements(selectedMedia)         │                                  │
│  │                                      │                                  │
│  │ Create: <div class=                 │                                  │
│  │   "media_iframe_video               │                                  │
│  │   o_custom_video_container"          │                                  │
│  │   data-video-autoplay="true"         │                                  │
│  │   data-video-loop="true"             │                                  │
│  │   data-video-hide-controls="false"  │                                  │
│  │   data-video-hide-fullscreen="false" │                                  │
│  │   data-oe-expression="/web/video/...">│                                 │
│  │   <video src="/web/video/..."       │                                  │
│  │      autoplay="autoplay"             │                                  │
│  │      muted="muted"                  │                                  │
│  │      playsinline="playsinline"       │                                  │
│  │      loop="loop"                     │                                  │
│  │      controls="controls">            │                                  │
│  │   </video>                          │                                  │
│  │ </div>                              │                                  │
│  └────────────┬─────────────────────────┘                                  │
│               ↓                                                              │
│  STEP 7: HTML SAVED TO DATABASE                                           │
│  ┌──────────────────────────────────────┐                                  │
│  │ Odoo serializes HTML element         │                                  │
│  │ Saves to ir.ui.view table            │                                  │
│  │ Both data attributes AND HTML attrs  │                                  │
│  │ are preserved                        │                                  │
│  └────────────┬─────────────────────────┘                                  │
│               ↓                                                              │
│       Click "Save" & "Publish"                                            │
│               ↓                                                              │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
                                  ↓
                                  ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│                        WEBSITE (Frontend)                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  STEP 8: PAGE LOADS                                                        │
│  ┌──────────────────────────────────────┐                                  │
│  │ Browser loads HTML from server       │                                  │
│  │ HTML contains video with controls    │                                  │
│  │ JavaScript files loaded              │                                  │
│  └────────────┬─────────────────────────┘                                  │
│               ↓                                                              │
│  STEP 9: VIDEO FRONTEND PROCESSOR RUNS                                    │
│  ┌──────────────────────────────────────┐                                  │
│  │ video_frontend_processor.js executes │                                  │
│  │                                      │                                  │
│  │ 1. Wait for DOM ready                │                                  │
│  │ 2. Find all .o_custom_video_container│                                  │
│  │ 3. Find all .media_iframe_video      │                                  │
│  │ 4. Find all [data-video-*]           │                                  │
│  │                                      │                                  │
│  │ Multiple detection strategies in case│                                  │
│  │ HTML structure varies                │                                  │
│  └────────────┬─────────────────────────┘                                  │
│               ↓                                                              │
│  STEP 10: READ CONTROL SETTINGS                                           │
│  ┌──────────────────────────────────────┐                                  │
│  │ For each video container:            │                                  │
│  │                                      │                                  │
│  │ shouldAutoplay =                     │                                  │
│  │   container.getAttribute(            │                                  │
│  │   'data-video-autoplay') === 'true'  │                                  │
│  │                                      │                                  │
│  │ shouldLoop =                         │                                  │
│  │   container.getAttribute(            │                                  │
│  │   'data-video-loop') === 'true'      │                                  │
│  │                                      │                                  │
│  │ shouldHideControls =                 │                                  │
│  │   container.getAttribute(            │                                  │
│  │   'data-video-hide-controls') === 'true'                               │
│  │                                      │                                  │
│  │ shouldHideFullscreen =               │                                  │
│  │   container.getAttribute(            │                                  │
│  │   'data-video-hide-fullscreen') === 'true'                             │
│  └────────────┬─────────────────────────┘                                  │
│               ↓                                                              │
│  STEP 11: APPLY CONTROL ATTRIBUTES                                        │
│  ┌──────────────────────────────────────┐                                  │
│  │ videoElement.removeAttribute('*')    │ Reset first                      │
│  │                                      │                                  │
│  │ if (shouldAutoplay) {                │                                  │
│  │   setAttribute('autoplay')           │                                  │
│  │   setAttribute('muted')              │ Required for browser              │
│  │   setAttribute('playsinline')        │                                  │
│  │ }                                    │                                  │
│  │                                      │                                  │
│  │ if (shouldLoop) {                    │                                  │
│  │   setAttribute('loop')               │                                  │
│  │ }                                    │                                  │
│  │                                      │                                  │
│  │ if (!shouldHideControls) {           │                                  │
│  │   setAttribute('controls')           │                                  │
│  │ } else {                             │                                  │
│  │   removeAttribute('controls')        │                                  │
│  │ }                                    │                                  │
│  │                                      │                                  │
│  │ if (shouldHideFullscreen) {          │                                  │
│  │   setAttribute('controlsList',       │                                  │
│  │   'nodownload nofullscreen')         │                                  │
│  │ }                                    │                                  │
│  └────────────┬─────────────────────────┘                                  │
│               ↓                                                              │
│  STEP 12: VIDEO PLAYS WITH CONTROLS                                       │
│  ┌──────────────────────────────────────┐                                  │
│  │ ▶ Video auto-plays (if enabled)      │                                  │
│  │ ↻ Video loops (if enabled)           │                                  │
│  │ 🎮 Controls visible/hidden           │                                  │
│  │ ⛔ Fullscreen available/disabled     │                                  │
│  │                                      │                                  │
│  │ EXACTLY as configured in editor!    │                                  │
│  └──────────────────────────────────────┘                                  │
│               ↓                                                              │
│  STEP 13: MONITOR FOR NEW CONTENT                                         │
│  ┌──────────────────────────────────────┐                                  │
│  │ MutationObserver watches for new DOM │                                  │
│  │ If new videos added (via AJAX):      │                                  │
│  │   - Detect them                      │                                  │
│  │   - Process controls                 │                                  │
│  │   - Re-run processLocalVideos()      │                                  │
│  └──────────────────────────────────────┘                                  │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Control Attribute Mapping

```
┌─────────────────────────────────────────────────────────────────┐
│                    Control Attribute Map                        │
├──────────────────┬──────────────────┬──────────────────────────┤
│ Control Setting  │ Storage (Container Data Attribute)          │
├──────────────────┼──────────────────┼──────────────────────────┤
│                  │                  │  HTML Attributes on      │
│                  │ data-video-...   │  <video> Element         │
├──────────────────┼──────────────────┼──────────────────────────┤
│ Autoplay ON      │ autoplay="true"  │ autoplay="autoplay"      │
│                  │                  │ muted="muted"            │
│                  │                  │ playsinline="playsinline"│
├──────────────────┼──────────────────┼──────────────────────────┤
│ Autoplay OFF     │ autoplay="false" │ (attributes removed)     │
├──────────────────┼──────────────────┼──────────────────────────┤
│ Loop ON          │ loop="true"      │ loop="loop"              │
├──────────────────┼──────────────────┼──────────────────────────┤
│ Loop OFF         │ loop="false"     │ (attribute removed)      │
├──────────────────┼──────────────────┼──────────────────────────┤
│ Controls SHOW    │ hide-controls="false" │ controls="controls" │
├──────────────────┼──────────────────┼──────────────────────────┤
│ Controls HIDE    │ hide-controls="true"  │ (attribute removed)  │
├──────────────────┼──────────────────┼──────────────────────────┤
│ Fullscreen SHOW  │ hide-fullscreen="false" │ (attrs removed)   │
├──────────────────┼──────────────────┼──────────────────────────┤
│ Fullscreen HIDE  │ hide-fullscreen="true" │ controlsList=...   │
│                  │                  │ disablePictureInPicture  │
└──────────────────┴──────────────────┴──────────────────────────┘
```

## Data Persistence Through Layers

```
EDITOR STATE (JavaScript)
├─ this.localVideoOptions
│  ├─ autoplay: true/false
│  ├─ loop: true/false
│  ├─ hideControls: true/false
│  └─ hideFullscreen: true/false
│
SELECTED MEDIA (JavaScript)
├─ mediaData.controls
│  └─ (copies of localVideoOptions)
│
HTML ELEMENT (DOM)
├─ Container <div>
│  ├─ data-video-autoplay="true/false"
│  ├─ data-video-loop="true/false"
│  ├─ data-video-hide-controls="true/false"
│  └─ data-video-hide-fullscreen="true/false"
│
├─ Video <video>
│  ├─ autoplay="autoplay" (if enabled)
│  ├─ loop="loop" (if enabled)
│  ├─ controls="controls" (if shown)
│  ├─ controlsList="nodownload nofullscreen" (if fullscreen disabled)
│  └─ muted="muted" (if autoplay)
│
DATABASE (ir.ui.view HTML field)
├─ Complete HTML with both:
│  ├─ Data attributes on container
│  └─ HTML attributes on video
│
FRONTEND JavaScript (processLocalVideos)
├─ Reads data attributes from container
├─ Applies HTML attributes to video
└─ Video plays with correct controls
```

## Error Handling Flow

```
Problem: Controls not working on published site

DEBUG STEPS:
│
├─ STEP 1: Check if o_custom_video_container class present
│  ├─ NO  → Container div class missing
│  │       Solution: Check createElements() output
│  │
│  └─ YES → Continue to STEP 2
│
├─ STEP 2: Check if data-video-* attributes present
│  ├─ NO  → Data attributes not stored
│  │       Solution: Check data attribute setting in createElements()
│  │
│  └─ YES → Continue to STEP 3
│
├─ STEP 3: Check if video element exists
│  ├─ NO  → Video element not created
│  │       Solution: Check video element creation
│  │
│  └─ YES → Continue to STEP 4
│
├─ STEP 4: Check if HTML attributes present
│  ├─ NO  → HTML attributes not set
│  │       Solution: Check video element attribute setting
│  │
│  └─ YES → Continue to STEP 5
│
├─ STEP 5: Check if processLocalVideos ran
│  ├─ NO  → Frontend processor didn't run
│  │       Solution: Check if video_frontend_processor.js loaded
│  │
│  └─ YES → Continue to STEP 6
│
└─ STEP 6: All checks pass - Controls should work
   If not working: Check browser autoplay policy
                  Check browser console for errors
```

## Complete Control Attribute Example

```html
<!-- BEFORE: User configures in editor -->
Preview: ✓ Autoplay  ✓ Loop  ☐ Hide Controls  ☐ Hide Fullscreen

<!-- AFTER: HTML created and inserted -->
<div class="media_iframe_video o_custom_video_container"
     data-oe-expression="/web/video/example_1234567_abcdef.mp4"
     data-video-autoplay="true"
     data-video-loop="true"
     data-video-hide-controls="false"
     data-video-hide-fullscreen="false">
  
  <div class="media_iframe_video_size"></div>
  
  <video src="/web/video/example_1234567_abcdef.mp4"
         preload="metadata"
         contenteditable="false"
         autoplay="autoplay"
         muted="muted"
         playsinline="playsinline"
         loop="loop"
         controls="controls"
         style="width: 100%; height: auto; max-width: 100%; background: #000; border-radius: 8px; display: block;">
    Your browser does not support the video tag.
  </video>
</div>

<!-- ON PUBLISHED WEBSITE: processLocalVideos() reads and verifies attributes -->
<!-- Result: Video auto-plays (muted), loops, shows controls, fullscreen enabled -->
```

---

**This visual flow shows exactly how data flows from the editor through the database to the published website, with controls persisting at every stage.**
