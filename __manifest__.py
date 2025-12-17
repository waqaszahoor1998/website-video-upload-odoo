# -*- coding: utf-8 -*-
{
    'name': 'Website Video Upload & Image Quality Preservation',
    'version': '19.0.1.0.0',
    'category': 'Website',
    'summary': 'Upload videos and preserve original high-quality product images',
    'description': '''
Website Video Upload & Image Quality Preservation Module

FEATURES:

1. VIDEO UPLOAD WITH CONTROLS
   - Upload videos directly from website editor (MP4, WebM, OGG, MOV, AVI)
   - Full playback control configuration:
     * Autoplay enable/disable with muted playback
     * Loop enable/disable
     * Hide/show player controls
     * Hide/show fullscreen button
   - Real-time preview with controls in editor
   - Secure video serving with proper headers
   - Works like YouTube/Vimeo video insertion in Odoo

2. HIGH-QUALITY PRODUCT IMAGE PRESERVATION
   - Prevents automatic WebP conversion of images
   - Preserves original image dimensions (no resizing)
   - Maintains original file formats (PNG, JPEG, GIF, etc.)
   - Stores original format and dimensions metadata
   - Serves images at 95% quality for optimal performance

QUALITY RESULTS:
- PNG 1920x1080px → STAYS PNG 1920x1080px
- JPEG 1600x1200px → STAYS JPEG 1600x1200px
- All image variants use original format and dimensions
- 95% quality setting for optimal file size and visual quality

HOW IT WORKS:
- Overrides image.mixin to skip Odoo's compression
- Prevents automatic image resizing
- Web controller serves original format with correct MIME type
- Displays original format/dimensions in product forms

INSTALLATION:
1. Install the module from Apps
2. Upload product images - they will automatically preserve quality
3. View product on website - images display in HD quality

USAGE:
- Upload images at desired size (e.g., 1920x1080 for sliders)
- Check "IMAGE QUALITY INFORMATION" section to verify format/dimensions
- Images will maintain quality across all website pages
    ''',
    'author': 'Your Company',
    'website': 'https://www.yourcompany.com',
    'license': 'LGPL-3',
    'depends': [
        'website',
        'html_editor',
        'website_sale',
        'product',
        'base',
    ],
    'data': [
        'views/product_image_preserve_views.xml',
    ],
    'assets': {
        'web.assets_backend': [
            'website_video_upload/static/src/xml/video_upload_templates.xml',
            'website_video_upload/static/src/js/video_selector_upload.js',
            'website_video_upload/static/src/css/video_styles.css',
            'website_video_upload/static/src/css/video_upload.css',
            'website_video_upload/static/src/css/image_quality_preserve.css',
        ],
        'web.assets_frontend': [
            'website_video_upload/static/src/js/video_frontend_processor.js',
            'website_video_upload/static/src/css/video_styles.css',
            'website_video_upload/static/src/css/video_upload.css',
            'website_video_upload/static/src/css/image_quality_preserve.css',
        ],
        'website.assets_editor': [
            'website_video_upload/static/src/js/video_selector_upload.js',
            'website_video_upload/static/src/css/video_styles.css',
            'website_video_upload/static/src/css/video_upload.css',
        ],
    },
    'installable': True,
    'application': False,
    'auto_install': False,
}
