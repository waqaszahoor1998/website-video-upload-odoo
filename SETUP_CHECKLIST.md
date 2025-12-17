# SETUP CHECKLIST - Image Preservation Module

## Pre-Installation
- [ ] Odoo 19 running
- [ ] website_sale module installed
- [ ] PIL/Pillow installed: `pip install Pillow`
- [ ] Database backup created

## Installation Steps
- [ ] Navigate to custom_addons/website_video_upload
- [ ] Verify files exist:
  - [ ] models/product_image_preserve.py
  - [ ] views/product_image_preserve_views.xml
  - [ ] views/website_product_image_original.xml
  - [ ] __manifest__.py
- [ ] Go to Apps → Update Apps List
- [ ] Search "Website Video Upload & Image Preservation"
- [ ] Click Update

## Post-Installation Configuration
- [ ] Go to Settings → Technical → System Parameters
- [ ] Add parameter:
  - Key: `base.image_autoresize_max_px`
  - Value: `0`
- [ ] Save

## Verification Steps
- [ ] Open Products → Products
- [ ] Create new product or edit existing
- [ ] Upload test image (4420x6960 or larger)
- [ ] Check "Image Quality Settings" section
  - [ ] "Preserve Original Format" = True
  - [ ] "Preserve Original Dimensions" = True
- [ ] Check "Main Image Information" section
  - [ ] "Main Image Format" shows format (PNG, JPEG, etc.)
  - [ ] "Main Image Dimensions" shows dimensions (e.g., 4420 x 6960 px)
- [ ] Save product
- [ ] Go to website Shop page
- [ ] Right-click product image → Inspect Element
- [ ] Check image URL:
  - [ ] URL contains `/web/content/` (GOOD ✓)
  - [ ] NOT `/web/image/product.template/XX/image_1920` (OLD ✗)
- [ ] Check image file size:
  - [ ] File size is original size (not compressed)
  - [ ] Dimensions match uploaded image

## Troubleshooting Checklist
If images still appear small/blurry:
- [ ] Clear browser cache (Ctrl+Shift+Delete)
- [ ] Hard refresh website (Ctrl+F5)
- [ ] Check browser DevTools → Network tab → image request
- [ ] Verify Response Headers include correct Content-Type
- [ ] Restart Odoo service
- [ ] Check odoo.log for errors
- [ ] Re-upload image after restart

## Performance Verification
- [ ] Page load time acceptable (<3 seconds)
- [ ] Images display correctly on:
  - [ ] Desktop
  - [ ] Tablet
  - [ ] Mobile
- [ ] No console errors in DevTools

## Final Sign-Off
- [ ] All checks passed
- [ ] Module ready for production
- [ ] Backup created before deployment
