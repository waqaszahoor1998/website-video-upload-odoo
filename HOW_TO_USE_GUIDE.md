# HOW TO USE THIS MODULE - STEP BY STEP GUIDE

## Overview
This module prevents automatic WebP conversion and preserves original image formats (PNG, JPG, GIF, etc.) in Odoo 19.

---

## INSTALLATION STEPS

### Step 1: Module is Already in Place
The module is located at: `/home/saif/odoo-19/odoo-19.0/custom_addons/website_video_upload/`

**Files included:**
- `models/product_image_preserve.py` - Python model override
- `views/product_image_preserve_views.xml` - System parameters
- `static/src/js/image_quality_preserve.js` - JavaScript
- `static/src/css/image_quality_preserve.css` - Styling

### Step 2: Restart Odoo Service

```bash
# Stop Odoo
sudo systemctl stop odoo

# Wait 3 seconds
sleep 3

# Start Odoo
sudo systemctl start odoo

# Verify it's running
sudo systemctl status odoo
```

### Step 3: Update App List in Odoo UI

1. Log in to Odoo
2. Go to **Apps** menu (top left)
3. Click **Update Apps List**
4. Wait for the update to complete

### Step 4: Install the Module

1. Go to **Apps** menu
2. Search for **"Website Video Upload"**
3. Click on the module
4. Click **Install** button
5. Wait for installation to complete

### Step 5: Clear Browser Cache

1. Press **Ctrl+Shift+Delete** (or Cmd+Shift+Delete on Mac)
2. Select **All time**
3. Check: Cookies, Cached images, Files
4. Click **Clear data**

### Step 6: Hard Refresh Browser

1. Go back to Odoo
2. Press **Ctrl+Shift+R** (or Cmd+Shift+R on Mac)
3. Wait for page to fully load

---

## HOW TO USE

### Method 1: Upload Images in Product Template

1. **Open Odoo** and log in
2. Go to **Products** → **Products**
3. Click on any product or create a new one
4. Go to the **Sales** tab
5. Scroll down to **eCommerce Media** section
6. Click **Add Media**
7. Upload your image (PNG, JPG, GIF, etc.)
8. The image will be saved in its ORIGINAL format (NOT converted to WebP)

### Method 2: Check if Format is Preserved

1. Open the product image you just uploaded
2. Look at the form - you should see:
   - **Original Format** field showing: PNG, JPG, GIF, etc.
   - **Preserve Quality** checkbox is enabled

### Method 3: Verify on Website

1. Open the website shop: `yoursite.com/shop`
2. Click on any product
3. Right-click on the product image
4. Click **Inspect** (F12)
5. Look at the `<img src="">` tag
6. Check the file extension - it should be `.png`, `.jpg`, or `.gif` (NOT `.webp`)

---

## WHAT HAS CHANGED

### Before (Without Module):
- Upload: `product.png` (500KB)
- Saved as: `product.webp` (100KB) - FORMAT CHANGED
- Quality: Reduced
- Pixels: May change

### After (With Module):
- Upload: `product.png` (500KB)
- Saved as: `product.png` (500KB) - SAME FORMAT
- Quality: 100% original
- Pixels: Preserved exactly

---

## SYSTEM PARAMETERS EXPLAINED

The module creates 3 system parameters:

### 1. `base.image_web_use_webp = False`
- **Purpose:** Disables WebP conversion globally
- **Location:** Settings → System Parameters
- **Value:** False (WebP disabled)

### 2. `product.preserve_original_image_format = True`
- **Purpose:** Flag to preserve original format
- **Location:** Settings → System Parameters
- **Value:** True (preserve original)

### 3. `base.image_quality = 100`
- **Purpose:** Set image quality to maximum
- **Location:** Settings → System Parameters
- **Value:** 100 (no compression)

---

## TESTING

### Test 1: PNG Upload
```
1. Upload a PNG image (e.g., image.png - 2MB)
2. Check "Original Format" field → Should show "PNG"
3. Check file size on website → Should be ~2MB
4. Inspect image → Should be .png (not .webp)
```

### Test 2: JPG Upload
```
1. Upload a JPG image (e.g., photo.jpg - 1MB)
2. Check "Original Format" field → Should show "JPG"
3. Inspect image → Should be .jpg (not .webp)
4. Compare quality → Should match original
```

### Test 3: GIF Upload
```
1. Upload a GIF image (e.g., animation.gif - 500KB)
2. Check "Original Format" field → Should show "GIF"
3. Check file size → Should be ~500KB
4. Animation should work (if animated)
```

---

## TROUBLESHOOTING

### Issue 1: Images Still Converting to WebP

**Solution:**
```bash
# 1. Clear browser cache completely
#    Press Ctrl+Shift+Delete → Clear all

# 2. Hard refresh page
#    Press Ctrl+Shift+R

# 3. Check Odoo logs
tail -f /var/log/odoo/odoo.log

# 4. Restart Odoo
sudo systemctl restart odoo

# 5. Re-upload image
```

### Issue 2: Module Not Installed

**Solution:**
```
1. Go to Apps → Update Apps List
2. Search "Website Video Upload"
3. If not found:
   - Delete Odoo cache: rm -rf ~/.local/share/Odoo/odoo
   - Restart Odoo: sudo systemctl restart odoo
4. Try installing again
```

### Issue 3: Original Format Shows "UNKNOWN"

**Solution:**
```
1. Make sure image file is valid
2. Use supported formats: PNG, JPG, GIF, BMP, TIFF
3. Re-upload the image
4. Check browser console (F12) for errors
```

### Issue 4: File Size Still Reduced

**Solution:**
```
1. Check system parameter:
   Settings → System Parameters
   Search "base.image_web_use_webp"
   Value should be "False"

2. If setting is wrong:
   - Edit it and set to "False"
   - Save

3. Restart Odoo:
   sudo systemctl restart odoo

4. Re-upload image
```

---

## VERIFICATION CHECKLIST

- [ ] Module installed and enabled
- [ ] Odoo restarted
- [ ] Browser cache cleared
- [ ] PNG uploaded → Shows "PNG" in Original Format
- [ ] JPG uploaded → Shows "JPG" in Original Format
- [ ] File sizes match originals (no compression)
- [ ] Website shows original format (.png, .jpg, not .webp)
- [ ] No errors in browser console (F12)
- [ ] No errors in Odoo logs

---

## FILE LOCATIONS

### Module Files
```
/home/saif/odoo-19/odoo-19.0/custom_addons/website_video_upload/
├── __init__.py                              (Module init)
├── __manifest__.py                          (Module metadata)
├── models/
│   ├── __init__.py
│   └── product_image_preserve.py            (Image preservation logic)
├── views/
│   └── product_image_preserve_views.xml     (System parameters)
└── static/
    └── src/
        ├── css/
        │   └── image_quality_preserve.css   (Styling)
        └── js/
            └── image_quality_preserve.js    (JavaScript)
```

### Odoo Configuration
```
System Parameters: Settings → System Parameters
- base.image_web_use_webp = False
- product.preserve_original_image_format = True
- base.image_quality = 100
```

---

## SUPPORT

### Check Logs
```bash
# View Odoo logs
tail -f /var/log/odoo/odoo.log

# Search for specific messages
grep "image" /var/log/odoo/odoo.log
grep "format" /var/log/odoo/odoo.log
```

### Database Check
```bash
# Connect to Odoo database
psql -U odoo -d odoo19

# Check product_image table
SELECT id, name, original_format, preserve_original 
FROM product_image 
LIMIT 5;
```

### Browser Console (F12)
- Press F12 to open Developer Tools
- Go to Console tab
- Look for any JavaScript errors
- Check for "Image preservation" messages

---

## SUMMARY

✅ **Module installed:** Images are now preserved in original format
✅ **No WebP conversion:** All images stay as PNG, JPG, GIF, etc.
✅ **Original quality:** No compression applied
✅ **Pixel preservation:** Dimensions unchanged
✅ **Easy to verify:** Check "Original Format" field on images

**To upload images:**
1. Products → Edit Product
2. Sales tab → eCommerce Media
3. Add Media → Upload image
4. Image saves in original format automatically!
