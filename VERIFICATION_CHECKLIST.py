#!/usr/bin/env python3
"""
Verification Checklist - Local Video Upload with Controls

Run this after installation to verify everything is working.
"""

CHECKLIST = """
✓ STEP 1: Check Files Exist
=====================================

[ ] /custom_addons/website_video_upload/__init__.py
[ ] /custom_addons/website_video_upload/__manifest__.py
[ ] /custom_addons/website_video_upload/controllers/main.py

[ ] /custom_addons/website_video_upload/static/src/js/video_selector_upload.js
[ ] /custom_addons/website_video_upload/static/src/js/video_frontend_processor.js (NEW)
[ ] /custom_addons/website_video_upload/static/src/css/video_styles.css (NEW)
[ ] /custom_addons/website_video_upload/static/src/xml/video_upload_templates.xml

Documentation files:
[ ] QUICK_START.md
[ ] SOLUTION_SUMMARY.md
[ ] README_LOCAL_VIDEOS.md
[ ] IMPLEMENTATION.md
[ ] CODE_CHANGES.md
[ ] CONFIGURATION.py


✓ STEP 2: Verify Code Changes in video_selector_upload.js
=====================================

Open: static/src/js/video_selector_upload.js

Look for these sections - they must be present:

[ ] Line ~25-30: this.localVideoOptions with autoplay, loop, hideControls, hideFullscreen
[ ] Line ~450-475: createElements() method handles local videos with:
    - Reads this.localVideoOptions
    - Creates video element with data-autoplay="true" etc.
    - Applies both HTML attributes AND data attributes
[ ] Line ~475-530: updateVideo() method includes:
    - mediaData object with controls property
    - Passes controls to selectMedia()


✓ STEP 3: Verify video_frontend_processor.js Exists
=====================================

File: static/src/js/video_frontend_processor.js

Must contain:
[ ] Function restoreLocalVideoControls()
[ ] Scans for .o_custom_video_container elements
[ ] Reads data-autoplay, data-loop, data-hide-controls, data-hide-fullscreen
[ ] Reapplies these as HTML attributes
[ ] Runs on DOMContentLoaded event


✓ STEP 4: Verify __manifest__.py Has Frontend Assets
=====================================

File: __manifest__.py

Check assets section includes:
[ ] 'web.assets_frontend': [
        'website_video_upload/static/src/js/video_frontend_processor.js',
        'website_video_upload/static/src/css/video_styles.css',
    ]


✓ STEP 5: Test in Odoo
=====================================

Browser: Go to Odoo backend
[ ] Go to Apps → Update Apps List
[ ] Search for "website_video_upload"
[ ] Module installed successfully
[ ] No errors in console (F12 → Console)

Browser: Go to Website Editor
[ ] Go to Website → Pages → Edit any page
[ ] Click Insert → Video
[ ] "Upload Local Video" tab appears
[ ] Upload button visible
[ ] Previously uploaded videos list appears (if any)

Upload Test:
[ ] Click "Choose Video File"
[ ] Select a video (MP4, WebM, etc.)
[ ] Upload succeeds
[ ] "Video uploaded successfully!" notification appears
[ ] Video appears in "Recently Uploaded" section

Controls Test:
[ ] Toggle "Autoplay" checkbox
[ ] Preview shows video autoplaying (if it loads)
[ ] Toggle "Loop" checkbox
[ ] Toggle "Hide player controls" checkbox
[ ] Toggle "Hide fullscreen button" checkbox
[ ] Preview updates for each toggle

Insert Test:
[ ] With some controls enabled
[ ] Click "Add" button
[ ] Video inserts into page
[ ] Save page
[ ] Reload editor
[ ] Video controls are still there ✓

Website Test:
[ ] Logout (or view in incognito)
[ ] Go to page with video
[ ] Video should have correct controls
[ ] Autoplay works (if enabled)
[ ] Loop works (if enabled)
[ ] Controls hidden (if enabled)


✓ STEP 6: Verify Data Persistence
=====================================

Browser Console (F12):
[ ] Run: document.querySelectorAll('.o_custom_video_container')
[ ] Should return all video containers
[ ] Inspect one: Right-click → Inspect
[ ] Look for <video> element
[ ] Check it has these attributes:
    [ ] data-autoplay="true" or "false"
    [ ] data-loop="true" or "false"
    [ ] data-hide-controls="true" or "false"
    [ ] data-hide-fullscreen="true" or "false"

JavaScript Test:
video = document.querySelector('.o_custom_video_container video');
console.log(video.getAttribute('data-autoplay'));  // Should return 'true' or 'false'
console.log(video.getAttribute('data-loop'));
console.log(video.getAttribute('data-hide-controls'));
console.log(video.getAttribute('data-hide-fullscreen'));


✓ STEP 7: Check Server Logs
=====================================

When uploading, you should see in Odoo server logs:
[ ] "Video upload attempt: [filename]"
[ ] "File size: [bytes]"
[ ] "Video file saved to: [path]"
[ ] "Created video attachment ID: [id]"
[ ] "Video upload successful"

Check filestore directory:
[ ] /home/saif/odoo-19/odoo-19.0/filestore/{db_name}/videos/
[ ] Should contain uploaded video files
[ ] File permissions should be readable


✓ STEP 8: Test All Video Formats
=====================================

Try uploading each format:
[ ] MP4 (video/mp4)
[ ] WebM (video/webm)
[ ] OGG (video/ogg)
[ ] MOV (video/quicktime)
[ ] AVI (video/x-msvideo)

All should:
[ ] Upload successfully
[ ] Appear in preview
[ ] Play when inserted


✓ STEP 9: Test Edge Cases
=====================================

[ ] Upload file > 100MB → Should show "File too large" error
[ ] Upload non-video file → Should show "Invalid format" error
[ ] Toggle all controls then click Add → Should work
[ ] Toggle no controls then click Add → Should work
[ ] Edit video to change controls → Should update


✓ STEP 10: Cross-Browser Testing
=====================================

Test on:
[ ] Chrome
[ ] Firefox
[ ] Safari
[ ] Edge

Each should:
[ ] Upload works
[ ] Preview works
[ ] Controls work
[ ] Autoplay works (with muted)
[ ] No console errors


✓ STEP 11: Performance Check
=====================================

[ ] Page with multiple videos loads quickly
[ ] Video scrubbing (seeking) works smoothly
[ ] No lag when toggling controls
[ ] Console shows no memory leaks
[ ] Network tab shows videos streaming properly


✓ STEP 12: Documentation Check
=====================================

[ ] QUICK_START.md is clear and complete
[ ] SOLUTION_SUMMARY.md explains the solution
[ ] IMPLEMENTATION.md has technical details
[ ] CODE_CHANGES.md shows what changed
[ ] CONFIGURATION.py has admin settings
[ ] README_LOCAL_VIDEOS.md is comprehensive


✓ STEP 13: Security Check
=====================================

[ ] Anonymous users cannot upload (must be logged in)
[ ] Uploaded videos are accessible via /web/video/
[ ] Path traversal protection works
[ ] File type validation works
[ ] File size validation works
[ ] Delete only works for authenticated users


✓ STEP 14: Final Integration Test
=====================================

Complete workflow:
1. [ ] Log in as admin
2. [ ] Go to Website → Pages
3. [ ] Edit a page
4. [ ] Insert → Video
5. [ ] Upload local video
6. [ ] Set controls (autoplay, loop, hide controls, hide fullscreen)
7. [ ] Click Add
8. [ ] Verify video appears with controls in editor
9. [ ] Save page
10. [ ] Refresh editor - controls still there
11. [ ] Logout
12. [ ] View page as visitor
13. [ ] Video plays with exact controls you set
14. [ ] Login again
15. [ ] Edit video - controls still there
16. [ ] Edit another page, add same video with different controls
17. [ ] Each video has its own settings
18. [ ] Delete a video
19. [ ] Verify it's removed from server

All tests pass? ✅ YOU'RE GOOD TO GO!


Common Issues During Testing
=============================

Issue: Module doesn't appear in Apps list
Solution:
  1. Clear browser cache (Ctrl+Shift+Del)
  2. Go to Apps → Update Apps List (wait 30 seconds)
  3. Refresh page (Ctrl+F5)
  4. Search again

Issue: "Upload Local Video" tab missing
Solution:
  1. Restart Odoo server completely
  2. Clear /addons/*/static/src/web/bundles directory
  3. Hard refresh browser (Ctrl+F5)

Issue: Controls don't appear in preview
Solution:
  1. Open F12 Console
  2. Look for errors about localVideoOptions
  3. Check that video_selector_upload.js loaded
  4. Verify updateLocalVideoPreview() function exists

Issue: Video doesn't autoplay on frontend
Solution:
  1. Check that "Autoplay" toggle was enabled
  2. Check that "Muted" is also enabled (browser requirement)
  3. Inspect video element for data-autoplay="true"
  4. Check browser autoplay policy (some block by default)

Issue: Controls don't persist after save
Solution:
  1. Check page source for data-autoplay, data-loop attributes
  2. Verify video_frontend_processor.js loaded (check Network tab)
  3. Check browser console for processor errors
  4. Hard reload page (Ctrl+Shift+R)


Success Indicators
==================

When everything works, you'll see:

✅ Editor Preview:
   - Video shows with exact controls you set
   - Toggles update preview immediately
   - All 4 control options work

✅ After Save:
   - Page saves without errors
   - Controls survive page reload
   - Editor shows saved state

✅ Frontend:
   - Video plays on public site
   - Autoplay works (if enabled)
   - Loop works (if enabled)
   - Controls hidden (if enabled)
   - No console errors
   - Works on mobile browsers

✅ Management:
   - Can upload multiple videos
   - Can reuse same video with different controls
   - Can delete videos
   - Can edit videos to change controls
   - Works with multiple pages


Support Documentation
======================

If issues occur, consult:
- QUICK_START.md (basic usage)
- SOLUTION_SUMMARY.md (overview)
- IMPLEMENTATION.md (technical details)
- CODE_CHANGES.md (what changed)
- CONFIGURATION.py (settings)
- README_LOCAL_VIDEOS.md (full guide)

Last Updated: 2024
Status: READY FOR PRODUCTION
"""

if __name__ == '__main__':
    print(CHECKLIST)
    print("\n" + "="*50)
    print("Print this checklist and work through each item")
    print("="*50)
