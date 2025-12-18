# Testing Guide - Website Sale Product Video Module

## Prerequisites

1. Odoo 19.0 installed and running
2. `website_sale` module installed
3. Database with website and eCommerce configured

## Step 1: Start/Restart Odoo Server

### Option A: If Odoo is already running
```bash
# Restart the Odoo server to load the new module
# Stop the current server (Ctrl+C) and restart it
```

### Option B: Start Odoo server
```bash
cd /Users/m.w.zahoor/Desktop/odoo-19.0
python3 odoo-bin -c odoo.conf
# Or if no config file:
python3 odoo-bin --addons-path=addons --database=your_database_name
```

**Important**: Make sure the addons path includes the directory where `website_sale_product_video` is located.

## Step 2: Update Apps List

1. Open Odoo in your browser (usually `http://localhost:8069`)
2. Login as Administrator
3. Go to **Apps** menu (or click the Apps icon)
4. Click **Update Apps List** button (top right)
5. Wait for the update to complete

## Step 3: Install the Module

1. In the Apps menu, remove the "Apps" filter (click "Apps" dropdown and select "All")
2. Search for: **"Website Sale Product Video"** or **"product video"**
3. Click on the module
4. Click **Install** button
5. Wait for installation to complete

## Step 4: Test Video URL Functionality

### Test 1: Add Video URL to Product

1. Go to **Sales > Products > Products**
2. Open any product (or create a new one)
3. Scroll to the **"eCommerce Media"** section
4. You should see:
   - **"Product Video (Alternative to Image)"** label
   - **"Video URL (YouTube, Vimeo, etc.)"** field
   - **"Upload Video File"** option

5. **Test with YouTube URL:**
   - Enter: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
   - You should see a video preview appear on the right
   - Click **Save**

6. **Check the Website:**
   - Go to your website
   - Navigate to the product page
   - The video should display instead of the product image

### Test 2: Add Video File Upload

1. Go back to the product form
2. Clear the video URL field
3. Click **"Upload Video File"**
4. Select a video file (MP4, WebM, OGG, MOV, or AVI)
5. The filename should auto-populate or you can enter it manually
6. You should see the video preview
7. Click **Save**

8. **Check the Website:**
   - Go to the product page on your website
   - The uploaded video should display with HTML5 video player

### Test 3: Video Priority (File vs URL)

1. Add both a video URL and upload a video file
2. Save the product
3. Check the website - the **file should take priority** over the URL

## Step 5: Verify Functionality

### Checklist:

- [ ] Module installs without errors
- [ ] Video URL field appears in product form
- [ ] Video file upload field appears in product form
- [ ] YouTube/Vimeo URL preview works
- [ ] Video file upload works
- [ ] Video displays on product page (URL)
- [ ] Video displays on product page (file)
- [ ] Video file takes priority when both are set
- [ ] Invalid URL shows error message
- [ ] Invalid file format shows error message
- [ ] Thumbnail generates from video URL (if no image)

## Troubleshooting

### Module Not Appearing in Apps

**Solution:**
- Check that the module is in the correct addons path
- Verify `__manifest__.py` is correct
- Restart Odoo server
- Clear browser cache

### Installation Errors

**Check Odoo Logs:**
```bash
# Look for errors in the terminal where Odoo is running
# Or check log file if configured
```

**Common Issues:**
- Missing dependencies: Ensure `website_sale` is installed
- Syntax errors: Check Python files for syntax issues
- View errors: Check XML files for proper structure

### Video Not Displaying on Website

**Check:**
1. Is the video URL/file saved? (check product form)
2. Does the product have `is_published = True`?
3. Check browser console for JavaScript errors
4. Verify template inheritance is working

### Video File Not Uploading

**Check:**
1. File size limits (Odoo default is usually 128MB)
2. File format is supported (MP4, WebM, OGG, MOV, AVI)
3. Filename is provided or auto-generated

## Testing Different Scenarios

### Scenario 1: Product with Video URL Only
- Add YouTube URL
- No image uploaded
- Expected: Video displays, thumbnail may be generated

### Scenario 2: Product with Video File Only
- Upload MP4 file
- No URL provided
- Expected: HTML5 video player displays

### Scenario 3: Product with Both Video and Image
- Add video URL/file
- Also has product image
- Expected: Video takes priority on product page

### Scenario 4: Invalid Video URL
- Enter invalid URL like "test123"
- Expected: Error message appears

### Scenario 5: Invalid File Format
- Try to upload .txt or .pdf file
- Expected: Error message about supported formats

## Uninstalling the Module

1. Go to **Apps** menu
2. Search for "Website Sale Product Video"
3. Click **Uninstall**
4. Confirm uninstallation
5. All video data will be removed from products

## Notes

- Videos are stored in the database (for files) or referenced via URL
- Large video files may impact database size
- Consider using video URLs for better performance
- The module follows Odoo inheritance patterns - safe to uninstall

