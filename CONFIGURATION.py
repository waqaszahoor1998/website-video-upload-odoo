#!/usr/bin/env python3
"""
Installation and Configuration Guide for Local Video Upload with Controls

PREREQUISITE: You must have Odoo 19 Community Edition installed

INSTALLATION STEPS:
==================

1. Copy the module to custom_addons:
   cp -r website_video_upload /home/saif/odoo-19/odoo-19.0/custom_addons/

2. Restart Odoo server:
   - Kill the running process
   - Start fresh: odoo -c /etc/odoo/odoo.conf

3. Update module list in Odoo:
   - Go to Apps → Update Apps List
   - Search for "website_video_upload"
   - Click "Install"

4. Verify installation:
   - Go to Website → Pages
   - Edit any page
   - Insert → Video
   - Should see "Upload Local Video" tab


FILE STRUCTURE:
===============

website_video_upload/
├── __init__.py
├── __manifest__.py (UPDATED - added frontend processor)
├── controllers/
│   └── main.py (Video upload/delete routes)
├── static/
│   ├── src/
│   │   ├── js/
│   │   │   ├── video_selector_upload.js (UPDATED - enhanced createElements)
│   │   │   └── video_frontend_processor.js (NEW)
│   │   ├── css/
│   │   │   └── video_styles.css (NEW)
│   │   └── xml/
│   │       └── video_upload_templates.xml (UPDATED)
│   └── description/ (addon icon, etc.)
├── IMPLEMENTATION.md (NEW - technical details)
├── README_LOCAL_VIDEOS.md (NEW - user guide)
└── CONFIGURATION.py (THIS FILE)


CONFIGURATION:
==============

Max Upload Size (100MB - change in two places):

1. In video_selector_upload.js (line ~16):
   const MAX_VIDEO_SIZE = 100 * 1024 * 1024;  // Change this value

2. In main.py (line ~35):
   MAX_VIDEO_SIZE = 100 * 1024 * 1024  # Change this value

Example to change to 500MB:
   - video_selector_upload.js: const MAX_VIDEO_SIZE = 500 * 1024 * 1024;
   - main.py: MAX_VIDEO_SIZE = 500 * 1024 * 1024


SUPPORTED FORMATS:
==================

Video Codecs: H.264, VP8, VP9, Theora
Audio Codecs: AAC, MP3, Vorbis, Opus

Containers: MP4, WebM, OGG, MOV, AVI

To add more formats, update in TWO places:

1. video_selector_upload.js (line ~11):
   const SUPPORTED_VIDEO_FORMATS = [
       "video/mp4",
       "video/webm",
       "video/ogg",
       "video/quicktime",
       "video/x-msvideo",
       // ADD NEW FORMAT HERE
   ];

2. main.py (line ~30):
   allowed_mimetypes = [
       "video/mp4",
       "video/webm",
       "video/ogg",
       "video/quicktime",
       "video/x-msvideo",
       # ADD NEW FORMAT HERE
   ]

3. video_upload_templates.xml (line ~35):
   accept="video/mp4,video/webm,video/ogg,video/quicktime,video/x-msvideo"


IMPORTANT: Browser Autoplay Policy
===================================

Modern browsers REQUIRE these conditions for autoplay:

1. Video must be MUTED
   <video autoplay muted>  ✓ Works
   <video autoplay>        ✗ Blocked

2. User must interact with page first
   - Click anywhere on page
   - Or set muted="muted" to bypass

3. HTTPS recommended (HTTP may block autoplay on some browsers)

The code handles this automatically:
   if (shouldAutoplay) {
       videoElement.setAttribute('autoplay', 'autoplay');
       videoElement.setAttribute('muted', 'muted');      // Required!
       videoElement.setAttribute('playsinline', 'playsinline');
   }


TROUBLESHOOTING:
================

Problem: "Upload button doesn't appear"
Solution:
  1. Clear browser cache (Ctrl+Shift+Delete)
  2. Clear Odoo assets (rm -rf /home/saif/odoo-19/odoo-19.0/addons/*/static/src/web/bundles)
  3. Restart Odoo server
  4. Hard refresh browser (Ctrl+F5)

Problem: "Video controls don't show in editor preview"
Solution:
  1. Check browser console (F12 → Console tab)
  2. Look for errors about localVideoOptions
  3. Verify video_selector_upload.js loaded correctly

Problem: "Controls work in preview but not on website"
Solution:
  1. Inspect page source (Ctrl+U)
  2. Find <video> element
  3. Check for data-autoplay="true", data-loop="true", etc.
  4. If missing, the frontend processor didn't run - reload page
  5. Check browser console for errors

Problem: "Autoplay doesn't work"
Solution:
  1. Verify "Autoplay" checkbox is enabled in editor
  2. Check that "Muted" is also enabled (browser requirement)
  3. Try with muted=true even if autoplay user preference is off
  4. Reload page in incognito window

Problem: "Video doesn't play at all"
Solution:
  1. Check browser console for CORS errors
  2. Verify /web/video/<filename> route returns 200 status
  3. Test URL directly in browser: http://your-site/web/video/filename.mp4
  4. Check file permissions in filestore directory


DATABASE & FILES:
=================

Uploaded videos are stored:
- Database: ir.attachment records (type='url')
- Files: /home/saif/odoo-19/odoo-19.0/filestore/{db_name}/videos/

To clean up deleted videos:
   cd /home/saif/odoo-19/odoo-19.0/filestore/{db_name}/videos/
   ls -la  # See all videos
   rm filename.mp4  # Delete specific file


SECURITY CONSIDERATIONS:
========================

1. File uploads are authenticated (auth="user"):
   - Only logged-in users can upload
   - Public site visitors cannot upload

2. Uploaded videos are public:
   - Set public=True in ir.attachment creation
   - Anyone can access via /web/video/<filename>

3. Deletion is authenticated:
   - Only logged-in users can delete videos

4. Path traversal protection:
   - Code checks that video path is within /videos/ directory
   - Prevents ../../../etc/passwd attacks

To restrict video access to specific users, modify main.py:
   @http.route("/web/video/<filename>", auth="user")  # Require login


ADVANCED CUSTOMIZATION:
=======================

Change video container styling:

In static/src/css/video_styles.css:
   .o_custom_video_container video {
       width: 100%;
       height: auto;
       display: block;
       background: #000;
       /* ADD YOUR CUSTOM CSS HERE */
       border: 2px solid blue;
       border-radius: 8px;
   }

Change preview styling:

In static/src/xml/video_upload_templates.xml, find:
   <div class="o_video_preview ratio ratio-16x9 bg-dark rounded overflow-hidden">
   
And modify classes as needed.


DEVELOPMENT MODE:
=================

To enable debug logging:

1. In video_selector_upload.js:
   - All console.log statements already in place
   - Open F12 Console in browser

2. In video_frontend_processor.js:
   - All console.log statements already in place
   - Check page load console

3. In main.py:
   - Logs go to Odoo server console
   - Run: odoo -c /etc/odoo/odoo.conf --log-level=debug

To test without UI:
   curl -F "file=@video.mp4" \\
        -H "X-Odoo-DB: your_db" \\
        http://localhost:8069/web/video/upload/json


PERFORMANCE TIPS:
=================

1. Compress videos before uploading:
   ffmpeg -i input.mp4 -c:v libx264 -preset medium -crf 28 output.mp4

2. Use WebM format for smaller file sizes:
   ffmpeg -i input.mp4 -c:v libvpx-vp9 -crf 30 output.webm

3. Limit preview thumbnail generation (Django-like approach):
   - Currently no thumbnail generation
   - Can be added in main.py if needed

4. Use CDN for video serving in production:
   - Configure proxy in nginx to serve from /web/video/*


API INTEGRATION:
================

To integrate with other Odoo modules:

from odoo import http
from odoo.addons.website_video_upload.controllers.main import VideoUploadController

# Use the controller methods directly:
result = VideoUploadController().upload_video_json(
    file_data=base64_data,
    filename="myfile.mp4",
    mimetype="video/mp4"
)


VERSION COMPATIBILITY:
=====================

Tested on:
- Odoo 19 Community Edition
- Python 3.8+
- PostgreSQL 10+

May work on:
- Odoo 18 (with minor adjustments)
- Earlier versions (not tested)

Requires:
- web module (standard)
- html_editor module (standard)
- website module (standard)


LICENSE & SUPPORT:
==================

This module is provided as-is.
For issues: Check IMPLEMENTATION.md for technical details.

Last Updated: 2024
"""
