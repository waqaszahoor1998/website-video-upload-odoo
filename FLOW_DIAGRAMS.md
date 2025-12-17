# Video Options Flow Diagram

## Complete Data Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         USER INTERACTIONS                                    │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  1. USER UPLOADS/SELECTS VIDEO                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│  - Clicks "Choose Video File"                                               │
│  - OR selects from "Recently Uploaded"                                      │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    │                               │
        handleVideoFileUpload()          onSelectUploadedVideo()
                    │                               │
                    ▼                               ▼
          ┌──────────────────┐          ┌──────────────────┐
          │  Upload to RPC   │          │  Select existing │
          │  /web/video/     │          │  video URL       │
          │  upload/json     │          │                  │
          └──────────────────┘          └──────────────────┘
                    │                               │
                    └───────────────┬───────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  2. SET state.urlInput                                                      │
│  ─────────────────────────────────────────────────────────────────────────  │
│  this.state.urlInput = "/web/video/filename.mp4"                            │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  3. CALL updateVideo()                                                      │
│  ─────────────────────────────────────────────────────────────────────────  │
│  - Detect local video URL                                                   │
│  - Set state.platform = 'local'                                             │
│  - Initialize state.options from localVideoOptions                          │
│  - Call updateLocalVideoPreview()                                           │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  4. UPDATE PREVIEW                                                          │
│  ─────────────────────────────────────────────────────────────────────────  │
│  updateLocalVideoPreview()                                                  │
│  ├─ Find .o_video_dialog_preview_container                                  │
│  ├─ Get or create <video> element                                           │
│  ├─ Clear ALL attributes                                                    │
│  ├─ Apply each option:                                                      │
│  │  ├─ autoplay: setAttribute + muted + playsinline                         │
│  │  ├─ loop: setAttribute + addEventListener('ended')                       │
│  │  ├─ hideControls: removeAttribute('controls')                            │
│  │  └─ hideFullscreen: setAttribute('controlsList', 'nofullscreen')         │
│  └─ Attempt video.play() if autoplay                                        │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  5. OPTIONS CHECKBOXES APPEAR                                               │
│  ─────────────────────────────────────────────────────────────────────────  │
│  - "Autoplay" ☐ Autoplay (Videos are muted...)                              │
│  - "Loop" ☐ Loop                                                            │
│  - "Hide player controls" ☐ Hide player controls                            │
│  - "Hide fullscreen button" ☐ Hide fullscreen button                        │
│  (Rendered from state.options via template)                                 │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  6. USER TOGGLES CHECKBOX                                                   │
│  ─────────────────────────────────────────────────────────────────────────  │
│  User clicks "☐ Autoplay" checkbox                                          │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  7. onChangeOption('autoplay') CALLED                                       │
│  ─────────────────────────────────────────────────────────────────────────  │
│  a) Check platform is 'local'                                               │
│  b) Map option ID to property:                                              │
│     'autoplay' → 'autoplay'                                                 │
│  c) Toggle: localVideoOptions.autoplay = !localVideoOptions.autoplay        │
│  d) Update state.options[0].value = true                                    │
│  e) await delay 50ms (let state update)                                     │
│  f) Call this.updateLocalVideoPreview()                                     │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  8. PREVIEW UPDATES IN REAL-TIME                                            │
│  ─────────────────────────────────────────────────────────────────────────  │
│  Video in preview section now:                                              │
│  - Autoplays (muted) ✓                                                      │
│  - Shows in checkboxes as checked ✓                                         │
│  - Console logs: "✅ Preview: Autoplay ON"                                  │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    │                               │
        (Repeat for other options)       USER CLICKS "SAVE"
                    │                               │
                    └───────────────┬───────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  9. createElements() CALLED                                                 │
│  ─────────────────────────────────────────────────────────────────────────  │
│  - Detect local video URL                                                   │
│  - Create <div class="o_custom_video_container">                            │
│  - Create <video src="...">                                                 │
│  - Set dataset attributes:                                                  │
│    ├─ data-video-autoplay="true"                                            │
│    ├─ data-video-loop="false"                                               │
│    ├─ data-video-hide-controls="false"                                      │
│    └─ data-video-hide-fullscreen="false"                                    │
│  - Apply all HTML attributes to video element                               │
│  - Return element for saving to page                                        │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  10. PAGE SAVED TO DATABASE                                                 │
│  ─────────────────────────────────────────────────────────────────────────  │
│  HTML is stored:                                                            │
│  <div class="o_custom_video_container"                                      │
│       data-video-autoplay="true"                                            │
│       data-video-loop="false"                                               │
│       data-video-hide-controls="false"                                      │
│       data-video-hide-fullscreen="false">                                   │
│    <video src="/web/video/..." autoplay="" muted="" loop=""></video>        │
│  </div>                                                                      │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  11. USER VIEWS PAGE ON WEBSITE                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│  - Website loads HTML with video element                                    │
│  - Page loaded in browser                                                   │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  12. video_handler.js RUNS (DOMContentLoaded)                               │
│  ─────────────────────────────────────────────────────────────────────────  │
│  initializeVideos()                                                         │
│  ├─ Find all .o_custom_video_container elements                             │
│  ├─ For each video:                                                         │
│  │  ├─ Read dataset attributes                                              │
│  │  │  ├─ autoplay = true                                                   │
│  │  │  ├─ loop = false                                                      │
│  │  │  ├─ hideControls = false                                              │
│  │  │  └─ hideFullscreen = false                                            │
│  │  ├─ Clear all attributes                                                 │
│  │  ├─ Apply same logic as editor preview                                   │
│  │  │  ├─ Set autoplay + muted + playsinline                                │
│  │  │  ├─ Don't set loop (was false)                                        │
│  │  │  ├─ Set controls (was false, so show controls)                        │
│  │  │  └─ Don't set controlsList (was false)                                │
│  │  ├─ Try video.play() if autoplay                                         │
│  │  └─ Setup backup loop handler if needed                                  │
│  └─ Log all details to console                                              │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  13. VIDEO DISPLAYS WITH OPTIONS APPLIED                                    │
│  ─────────────────────────────────────────────────────────────────────────  │
│  Video autoplays (muted) ✓                                                  │
│  User can see controls (hideControls was false) ✓                           │
│  Can use fullscreen button (hideFullscreen was false) ✓                     │
│  Doesn't loop (loop was false) ✓                                            │
└─────────────────────────────────────────────────────────────────────────────┘
```

## State Management Architecture

```
┌────────────────────────────────────────────────────────────────────┐
│                      COMPONENT STATE                               │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  localVideoOptions (useState)                                     │
│  ├─ autoplay: false                                               │
│  ├─ loop: false                                                   │
│  ├─ hideControls: false                                           │
│  └─ hideFullscreen: false                                         │
│         ↑ (Toggle on checkbox change)                             │
│         │ (Read from dataset when editing)                        │
│                                                                    │
│                                                                    │
│  state.options (useState array)                                   │
│  ├─ [0] { id: 'autoplay', value: false, ... }                    │
│  ├─ [1] { id: 'loop', value: false, ... }                        │
│  ├─ [2] { id: 'hide_controls', value: false, ... }               │
│  └─ [3] { id: 'hide_fullscreen', value: false, ... }             │
│         ↑ (Synced from localVideoOptions)                         │
│         │ (Used by template to render checkboxes)                 │
│                                                                    │
│                                                                    │
│  state.src = "/web/video/filename.mp4"                            │
│  state.platform = "local"                                         │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
                              ↓
        ┌─────────────────────┴─────────────────────┐
        │                                           │
        ▼                                           ▼
┌──────────────────────────┐         ┌──────────────────────────┐
│  EDITOR PREVIEW          │         │  HTML SERIALIZATION      │
├──────────────────────────┤         ├──────────────────────────┤
│                          │         │                          │
│ updateLocalVideoPreview()│         │ createElements()         │
│                          │         │                          │
│ Finds video element      │         │ Reads localVideoOptions  │
│ Applies attributes       │         │ Applies attributes       │
│ Updates in real-time     │         │ Sets dataset attributes  │
│                          │         │ Returns HTML element     │
└──────────────────────────┘         └──────────────────────────┘
        │                                           │
        ▼                                           ▼
    Live preview                              Page saved with:
    (Checkbox toggle)                         <div data-video-*>
                                              <video attributes>
                                              </div>
```

## Option Application Logic

```
┌─────────────────────────────────────────┐
│  Option Value in localVideoOptions      │
└─────────────────────────────────────────┘
                    │
                    ▼
    ┌───────────────────────────────┐
    │  Is option TRUE?              │
    └───────────────────────────────┘
        │              │
      YES              NO
        │              │
        ▼              ▼
    Apply          Remove
    Attribute      Attribute
    
    ┌──────────────────┐    ┌──────────────────────┐
    │ setAttribute()   │    │ removeAttribute()    │
    │ Set Property     │    │ Reset Property       │
    └──────────────────┘    └──────────────────────┘


DETAILED EXAMPLE: AUTOPLAY OPTION

┌─────────────────┐
│ localVideoOptions
│   .autoplay=true
└─────────────────┘
        │
        ▼
┌─────────────────────────────────────┐
│ updateLocalVideoPreview()           │
├─────────────────────────────────────┤
│ if (this.localVideoOptions.autoplay)│
│   video.autoplay = true             │
│   video.muted = true                │
│   video.setAttribute('autoplay', '') │
│   video.setAttribute('muted', '')   │
│   video.setAttribute('playsinline')│
│   video.play()                      │
│ }                                   │
└─────────────────────────────────────┘
        │
        ▼
    Preview shows:
    ✓ Video autoplays
    ✓ Muted (required for autoplay)
    ✓ Can play inline on mobile
    

DETAILED EXAMPLE: HIDE CONTROLS OPTION

┌─────────────────┐
│ localVideoOptions
│  .hideControls=true
└─────────────────┘
        │
        ▼
┌─────────────────────────────────────┐
│ updateLocalVideoPreview()           │
├─────────────────────────────────────┤
│ if (this.localVideoOptions.        │
│     hideControls) {                 │
│   video.controls = false            │
│   // Don't set attribute            │
│   // Absence = hidden               │
│ } else {                            │
│   video.controls = true             │
│   video.setAttribute('controls', '')│
│ }                                   │
└─────────────────────────────────────┘
        │
        ▼
    Preview shows:
    ✓ No player controls visible
```

## Attribute vs Property Relationship

```
┌────────────────────────────────────────────────────────────────┐
│                HTML ATTRIBUTE vs JS PROPERTY                   │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│ AUTOPLAY:                                                      │
│  HTML:  <video autoplay muted>                                 │
│  JS:    video.autoplay = true                                  │
│  JS:    video.muted = true                                     │
│  Both needed for browsers to recognize                         │
│                                                                │
│ LOOP:                                                          │
│  HTML:  <video loop>                                           │
│  JS:    video.loop = true                                      │
│  Both needed for reliable looping                              │
│                                                                │
│ CONTROLS:                                                      │
│  HTML:  <video controls>  (presence = show)                    │
│  JS:    video.controls = true                                  │
│  Presence of attribute = show controls                         │
│                                                                │
│ MUTED:                                                         │
│  HTML:  <video muted>                                          │
│  JS:    video.muted = true                                     │
│  Required with autoplay for browser policy                     │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

## Information Flow Summary

```
EDITOR → Upload/Select → updateVideo() → state.options → Template (checkboxes)
  ↓                                            ↑
  └─ localVideoOptions ─→ updateLocalVideoPreview() ← User toggles
         ↑                                            │
         │ (User changes option)        ─────────────┘
         │                              
         ↓                              
    state.options updated
         │
         ▼
SAVE → createElements() → Apply options → HTML element with dataset
         ↓
    Page saved to DB
         │
         ▼
VIEW ON WEBSITE → Load HTML → video_handler.js → Read dataset → Apply options
         │
         └─ Video displays with all options applied ✓
```
