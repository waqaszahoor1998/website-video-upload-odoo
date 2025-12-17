# Quick Start Guide: Image Quality Preservation in Odoo 19

## Problem
When uploading product images in Odoo 19, they are automatically converted to WebP format, changing the original file format and potentially reducing quality.

## Solution Summary
This module prevents WebP conversion and preserves original image formats (PNG, JPG, etc.) with full quality and original pixel dimensions.

## Files Created

### 1. **models/product_image_preserve.py** ✅
- Extends `product.image` model
- Auto-detects image format (PNG, JPG, GIF, etc.)
- Adds `original_format` field
- Adds `preserve_quality` flag
- Methods:
  - `_compute_original_format()`: Detects format from image bytes
  - `_get_image_for_display()`: Returns original image
  - `get_image_url()`: Generates URL without conversion

### 2. **views/product_image_preserve_views.xml** ✅
- Overrides product image forms
- Adds quality preservation controls
- Disables WebP conversion in product templates
- Shows original format information to users

### 3. **static/src/css/image_quality_preserve.css** ✅
- Styles quality preservation controls
- Visual indicators for format preservation
- Responsive design

### 4. **static/src/js/image_quality_preserve.js** ✅
- Disables WebP conversion at client level
- Auto-detects format on upload
- Marks images for preservation
- Prevents image transformation

### 5. **__manifest__.py** (Updated) ✅
- Registers new views
- Includes CSS and JS assets
- Sets up module metadata

## Installation Steps

```bash
# 1. Module is already in the correct location
cd /home/saif/odoo-19/odoo-19.0/custom_addons/website_video_upload

# 2. Verify files exist
ls -la models/product_image_preserve.py
ls -la views/product_image_preserve_views.xml
ls -la static/src/css/image_quality_preserve.css
ls -la static/src/js/image_quality_preserve.js

# 3. In Odoo, update apps list
# Go to Apps → Update Apps List → Search "Website Video Upload" → Install
```

## How It Works

### When You Upload an Image:

1. **Upload Process:**
   ```
   User uploads image.png
         ↓
   JavaScript detects format
         ↓
   Format stored: "PNG"
         ↓
   Image saved in original format
         ↓
   No WebP conversion applied
   ```

2. **Display Process:**
   ```
   Product form loads
         ↓
   Python code detects original format
         ↓
   Shows "PNG" in Original Format field
         ↓
   Website displays as PNG (not WebP)
   ```

## Key Features

| Feature | Before | After |
|---------|--------|-------|
| Image Format | Converted to WebP | PNG/JPG preserved |
| File Size | Optimized (smaller) | Original size |
| Quality | Reduced by compression | 100% original quality |
| Pixels | May change | Preserved exactly |
| User Control | None | Preserve Quality checkbox |

## Usage Example

### In Product Template Form:

1. **Open Product:**
   - Go to Products → Products
   - Open any product

2. **Upload Image:**
   - Go to Sales tab
   - Scroll to "eCommerce Media"
   - Click "Add Media"
   - Select image file (PNG, JPG, etc.)

3. **See Results:**
   - "Original Format" field shows: "PNG"
   - "Preserve Quality" checkbox is enabled
   - Image is saved without conversion

### On Website:

- Visit /shop
- Open product page
- Right-click image → Inspect
- Check src attribute
- File will be in original format (not .webp)

## Database Changes

Two new fields added to `product.image`:

```python
original_format = fields.Char()        # Stores: PNG, JPG, GIF, etc.
preserve_quality = fields.Boolean()    # Default: True
```

## Supported Formats

✅ PNG - Best for graphics and text
✅ JPG - Best for photographs
✅ GIF - Animated or simple graphics
✅ BMP - Uncompressed images
✅ TIFF - Professional quality
✅ WebP - If uploaded as WebP

## Configuration

Default settings in `image_quality_preserve.js`:

```javascript
ImagePreservationConfig = {
    preserveWebP: false,      // Disable WebP conversion
    preserveQuality: true,    // Keep original quality
    allowedFormats: ['PNG', 'JPG', 'JPEG', 'GIF', 'BMP', 'TIFF'],
    maxQuality: 100           // 100% quality
}
```

To customize, edit `static/src/js/image_quality_preserve.js`

## Testing

### Test 1: PNG Preservation
```
1. Upload test.png (500x500px)
2. Check Original Format field → Should show "PNG"
3. Website /shop → Inspect image → Should be PNG
4. File size should match original
```

### Test 2: JPG Preservation
```
1. Upload photo.jpg (1920x1080px)
2. Check Original Format field → Should show "JPG"
3. Website /shop → Inspect image → Should be JPG
4. Visual quality should match original
```

### Test 3: Quality Check
```
1. Original image: 2MB
2. After upload: Should be ~2MB (not reduced)
3. Visual inspection: No visible quality loss
4. Pixels: Should match original dimensions
```

## Troubleshooting

### Issue: Images still show as WebP

**Solution:**
```bash
# 1. Clear browser cache (Ctrl+Shift+Delete)
# 2. Hard refresh page (Ctrl+Shift+R)
# 3. Check browser console (F12) for errors
# 4. Restart Odoo service
systemctl restart odoo
```

### Issue: Original Format shows "UNKNOWN"

**Solution:**
```bash
# 1. Re-upload the image
# 2. Ensure image format is valid
# 3. Check console logs (F12 → Console)
# 4. Supported formats: PNG, JPG, GIF, BMP, TIFF
```

### Issue: Module not appearing

**Solution:**
```bash
# 1. Go to Apps → Update Apps List
# 2. Search "Website Video Upload"
# 3. If not found, reinstall module
# 4. Restart Odoo
```

## File Size Impact

| Scenario | Effect |
|----------|--------|
| Original PNG (2MB) | Stays 2MB |
| Original JPG (500KB) | Stays 500KB |
| Original GIF (1MB) | Stays 1MB |
| Reduce server processing | ✅ Yes (no conversion) |
| Website performance | ✅ Better (no compression overhead) |

## Next Steps

1. **Install Module:**
   - Apps → Update Apps List
   - Search "Website Video Upload"
   - Click Install

2. **Test Upload:**
   - Create/edit product
   - Upload test image
   - Verify format preserved

3. **Check Website:**
   - Visit /shop
   - Inspect product images
   - Confirm original format

4. **Configure (Optional):**
   - Edit `image_quality_preserve.js`
   - Adjust settings if needed
   - Save and restart Odoo

## Support Files

For more detailed information, see:
- `IMAGE_PRESERVATION_README.md` - Complete documentation
- `models/product_image_preserve.py` - Python implementation
- `views/product_image_preserve_views.xml` - UI modifications
- `static/src/js/image_quality_preserve.js` - Client-side logic

## Questions?

Check the full documentation:
```bash
cat /home/saif/odoo-19/odoo-19.0/custom_addons/website_video_upload/IMAGE_PRESERVATION_README.md
```
