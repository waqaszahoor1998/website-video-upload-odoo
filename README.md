# Website Video Upload Module for Odoo 19

Complete solution for uploading and embedding local videos in your Odoo website with full playback control options.

## ✨ Features

### Video Upload
- 📹 Upload videos directly from the website editor
- 📁 Supported formats: MP4, WebM, OGG, MOV, AVI
- 📦 File size limit: 100MB per video
- 🔒 Secure storage in Odoo filestore
- 📋 Recently uploaded videos list with thumbnails

### Playback Controls
- ▶️ **Autoplay** - Video plays automatically (muted)
- 🔄 **Loop** - Video repeats when finished
- 🎛️ **Hide Controls** - Remove player controls from video
- 🖥️ **Hide Fullscreen** - Disable fullscreen button
- 👀 **Live Preview** - See options in real-time in editor

### Developer Experience
- ✅ Works exactly like YouTube/Vimeo in Odoo
- 🧹 Clean, maintainable code
- 📊 Comprehensive logging for debugging
- 🔍 Data attributes persist to HTML database
- 🎯 Frontend processor handles option application

## 📦 Installation

### Step 1: Add Module to Custom Addons
```bash
cd ~/odoo-19/odoo-19.0/custom_addons
git clone <your-repo> website_video_upload
cd website_video_upload
```

### Step 2: Install in Odoo
1. Go to **Apps** module
2. Search for "Website Video Upload"
3. Click **Install** button
4. Odoo will automatically load all JavaScript and CSS

### Step 3: Verify Installation
- Open website editor (Edit mode)
- Add a section
- Click **Media** button
- Go to **Videos** tab
- You should see **"Upload Local Video"** section with blue background

## 🚀 Usage

### Upload a Video
1. Click **"Choose Video File"** button
2. Select a video from your computer (MP4, WebM, OGG, MOV, or AVI)
3. Wait for upload to complete
4. Video appears in "Recently Uploaded" section

### Configure Video Options
Once video is selected:
1. ☐ **Autoplay** - Check to play automatically (muted)
2. ☐ **Loop** - Check to repeat video
3. ☐ **Hide player controls** - Check to hide play/pause/volume buttons
4. ☐ **Hide fullscreen button** - Check to disable fullscreen

### See Changes in Real-Time
- Video preview updates as you toggle options
- All changes visible before clicking "Add"

### Add Video to Website
1. Click **Add** button (bottom right of dialog)
2. Video element appears on your page
3. Click **Save** to save the page
4. View website to see video with your options applied

### Edit Existing Video
1. Click on video element on your page
2. Click three-dots menu
3. Click **Replace**
4. Change options as needed
5. Click **Add**
6. **Save** page

### Delete Video
1. Click video element
2. Click three-dots menu
3. Click **Remove**
4. **Save** page

## 🎯 How It Works

### Editor (Backend)
```
User uploads video
        ↓
JavaScript (video_selector_upload.js) processes upload
        ↓
Video stored in /filestore/videos/
        ↓
User configures options (autoplay, loop, etc.)
        ↓
Options stored in media object via props.selectMedia()
        ↓
createElements() called with media object
        ↓
<video> element created with data-video-* attributes
        ↓
HTML saved to database with attributes preserved
```

### Website Frontend
```
Page loads
        ↓
video_frontend_processor_fixed.js runs
        ↓
Script finds all <video> elements
        ↓
Reads data-video-* attributes
        ↓
Applies options (autoplay, loop, hide controls, etc.)
        ↓
User sees video with correct options
```

## 📁 File Structure

```
website_video_upload/
├── __init__.py
├── __manifest__.py                           # Module configuration
├── controllers/
│   ├── __init__.py
│   └── main.py                              # Video upload/serve routes
├── models/
│   ├── __init__.py
│   └── ir_ui_view_save_handler.py          # Attribute preservation on save
├── static/
│   └── src/
│       ├── css/
│       │   └── video_upload.css            # Styling
│       ├── js/
│       │   ├── video_selector_upload.js    # Editor logic
│       │   └── video_frontend_processor_fixed.js  # Frontend logic
│       └── xml/
│           └── video_upload_templates.xml  # UI templates
├── FIX_SUMMARY.md                           # Technical details
├── TESTING_GUIDE.md                         # How to test
├── UPGRADE_GUIDE.md                         # Module upgrade help
└── README.md                                # This file
```

## 🔧 Configuration

### Adjust Maximum Video Size
Edit `/controllers/main.py`:
```python
MAX_VIDEO_SIZE = 100 * 1024 * 1024  # 100MB
# Change 100 to desired size in MB
```

### Adjust Storage Location
Videos are stored in Odoo's filestore: `/filestore/videos/`

To change, edit `/controllers/main.py`:
```python
videos_dir = os.path.join(filestore_path, 'videos')
# Change 'videos' to preferred directory name
```

### Change Supported Formats
Edit `/controllers/main.py`:
```python
allowed_mimetypes = [
    "video/mp4",
    "video/webm",
    "video/ogg",
    "video/quicktime",
    "video/x-msvideo",
]
# Add or remove as needed
```

## 🐛 Troubleshooting

### Video upload button not appearing
**Problem:** Upload section missing from video dialog
**Solution:** 
- Verify module is installed (Apps → "Website Video Upload")
- Clear browser cache (Ctrl+Shift+Delete)
- Hard refresh page (Ctrl+Shift+R)

### Video options not visible
**Problem:** Autoplay, Loop, etc. checkboxes not showing
**Solution:**
- Make sure you selected a LOCAL video (not YouTube/Vimeo)
- Check browser console (F12) for errors
- Verify video URL starts with `/web/video/`

### Video plays but options don't work
**Problem:** Video autoplay/loop not working on website
**Solution:**
- Open DevTools on website (F12)
- Inspect video element
- Check for `data-video-autoplay="true"` attribute
- Hard refresh page to clear cache
- Check browser console for "Video Frontend Processor" logs

### Module won't upgrade
**Problem:** "Odoo is currently processing a scheduled action"
**Solution:** See UPGRADE_GUIDE.md for detailed instructions
- Wait 90 seconds and retry
- Disable cron jobs before upgrading
- Use CLI: `./odoo-bin -u website_video_upload --stop-after-init`

## 📊 Debug Information

### Editor Console (F12 - Console Tab)
You should see:
```
✅ VideoSelector initialized with local video options
✅ Loaded X videos
🎬 Local video detected: /web/video/...
📋 State options initialized: [...]
✅ Video info stored with options
🎬 createElements() called
✅ Creating local video element
✅ Video element created with all attributes
```

### Website Console (F12 - Console Tab)
You should see:
```
🎬 Video Frontend Processor Script Loaded
🎬 DOM already loaded, processing immediately
🎯 Total unique videos to process: X
✅ This is a local/uploaded video, checking attributes...
✅ Applied: autoplay
✅ Applied: loop
...
```

### Server Logs
Check Odoo logs for upload/serve operations:
```
INFO odoo19 odoo.addons.website_video_upload.controllers.main: Video upload attempt: video.mp4
INFO odoo19 odoo.addons.website_video_upload.controllers.main: Found X uploaded videos
```

## 🔐 Security Features

✅ **Path Traversal Protection** - Video serve route validates paths
✅ **File Type Validation** - Only video formats accepted
✅ **File Size Limits** - 100MB maximum
✅ **Secure Upload** - Base64 validation
✅ **URL Encoding Handling** - Spaces and special chars handled
✅ **Unique Filenames** - Timestamp + hash prevents conflicts

## 🎨 Styling

CSS is in `static/src/css/video_upload.css`:
- `.o_video_upload_tab` - Upload section styling
- `.o_uploaded_videos_grid` - Video grid layout
- `.o_video_item` - Individual video card
- `.no-controls` - Hide video controls styling

## 📚 Documentation Files

- **README.md** (this file) - Overview and quick start
- **FIX_SUMMARY.md** - Technical deep dive
- **TESTING_GUIDE.md** - Comprehensive test checklist
- **UPGRADE_GUIDE.md** - Module upgrade troubleshooting

## 🤝 Support

### Common Issues
1. Video not uploading → Check file size < 100MB
2. Options not persisting → Check `data-video-*` attributes in DevTools
3. Module won't upgrade → See UPGRADE_GUIDE.md

### Debug Steps
1. Check browser console (F12)
2. Check server logs
3. Inspect HTML with DevTools
4. Verify file is in `/filestore/videos/`

## 📝 Version History

### 19.0.1.1.0 (Latest)
- ✅ Fixed video controls persistence
- ✅ Proper data attribute storage
- ✅ Frontend processor implementation
- ✅ YouTube/Vimeo compatibility
- ✅ Comprehensive documentation

### 19.0.1.0.0
- ✅ Initial release
- ✅ Video upload functionality
- ✅ Basic video playback

## 📄 License

LGPL-3 - See LICENSE file

## 👨‍💻 Author

Your Company Name
Website: https://www.yourcompany.com

---

**Last Updated:** December 9, 2025
**Odoo Version:** 19.0
**Status:** Stable ✅

# Image Format & Dimension Preservation Module

## Problem: Why was it showing "UNKNOWN"?

The original implementation had **compute fields** that tried to detect image format and dimensions dynamically:

```python
original_format = fields.Char(compute='_compute_original_format', store=True)
original_dimensions = fields.Char(compute='_compute_original_dimensions', store=True)
```

### Why This Failed:

1. **Timing Issue**: Compute fields are called AFTER the record is created/saved, but by that time:
   - Odoo's image processing pipeline has already modified the image
   - The PIL library couldn't properly detect the format because it was already processed
   - The file extension was already changed or format was already converted

2. **Image Processing Interference**: Odoo was processing the image before our detection code could run

3. **Missing PIL Context**: When compute fields tried to detect the format, the image had already been through processing

## Solution: Direct Detection in create() and write()

The **new implementation** detects format and dimensions IMMEDIATELY when the image is being saved:

```python
def create(self, vals_list):
    for vals in vals_list:
        if 'image_1920' in vals and vals['image_1920']:
            # DETECT BEFORE SAVING
            image_format, dimensions = self._detect_image_format_and_dimensions(vals['image_1920'])
            vals['original_format'] = image_format
            vals['original_dimensions'] = dimensions
    return super().create(vals_list)
```

### Why This Works:

1. **Early Detection**: Format/dimensions are detected BEFORE Odoo's image processing pipeline runs
2. **Raw Image Data**: We detect from the original base64 image data before any Odoo processing
3. **Direct Assignment**: Values are stored directly in `vals`, not computed later
4. **PIL Working Correctly**: PIL can properly analyze the raw, unmodified image data

## Result:

✅ **PNG 1080x1080px** → Shows as "PNG" and "1080 x 1080 px"  
✅ **JPEG 800x600px** → Shows as "JPEG" and "800 x 600 px"  
✅ **GIF 512x512px** → Shows as "GIF" and "512 x 512 px"  

No more "UNKNOWN" values!

## How to Verify It Works:

1. Upload a product image (e.g., PNG file)
2. Open the "Extra Product Media" dialog
3. Check the **"IMAGE QUALITY INFORMATION"** section
4. You should see the actual format (PNG, JPEG, etc.) and dimensions (e.g., 1080 x 1080 px)

## Technical Details:

### Flow:

```
1. User uploads image (e.g., PNG 1080x1080px)
   ↓
2. Odoo receives base64 encoded image data
   ↓
3. Our create() method is called
   ↓
4. _detect_image_format_and_dimensions() runs on raw base64 data
   ↓
5. PIL.Image.open() reads the format and dimensions
   ↓
6. Values stored: original_format = "PNG", original_dimensions = "1080 x 1080 px"
   ↓
7. _image_process() is called (our override returns image unchanged)
   ↓
8. Image saved without any conversion or resizing
```

### Key File: product_image_preserve.py

- `_detect_image_format_and_dimensions()` - Detects format and dimensions from base64 image data
- `create()` - Calls detection before saving
- `write()` - Calls detection when image is updated
- `_image_process()` - Returns image unchanged (no WebP conversion or resizing)
- `_image_get_resized_images()` - Prevents creation of resized variants

## Requirements:

- Python Pillow library (PIL): `pip install Pillow`
- Odoo 19.0
- The module must load AFTER the product module

## Installation:

1. Place module in: `/addons/website_video_upload/`
2. Install module: `Settings → Apps → Install → Website Video Upload & Image Preservation`
3. Upload a product image to test
