"""
Advanced Configuration for Image Quality Preservation Module
Customize behavior of image preservation in Odoo 19
"""

# ============================================================================
# IMAGE FORMAT PRESERVATION SETTINGS
# ============================================================================

class ImagePreservationSettings:
    """
    Configure image preservation behavior
    """
    
    # Disable WebP conversion completely
    DISABLE_WEBP_CONVERSION = True
    
    # Preserve original quality (no compression)
    PRESERVE_ORIGINAL_QUALITY = True
    
    # Maximum allowed image quality (0-100)
    MAX_IMAGE_QUALITY = 100
    
    # Supported image formats to preserve
    SUPPORTED_FORMATS = {
        'PNG': {'mime': 'image/png', 'quality': 100},
        'JPG': {'mime': 'image/jpeg', 'quality': 100},
        'JPEG': {'mime': 'image/jpeg', 'quality': 100},
        'GIF': {'mime': 'image/gif', 'quality': 100},
        'BMP': {'mime': 'image/bmp', 'quality': 100},
        'TIFF': {'mime': 'image/tiff', 'quality': 100},
        'WEBP': {'mime': 'image/webp', 'quality': 100},
    }
    
    # Enable format auto-detection
    AUTO_DETECT_FORMAT = True
    
    # Store original format in database
    STORE_ORIGINAL_FORMAT = True
    
    # Log format preservation actions
    LOG_PRESERVATION_ACTIONS = True


# ============================================================================
# FILE SIZE AND DIMENSION SETTINGS
# ============================================================================

class FileSizeSettings:
    """
    Configure file size and dimension handling
    """
    
    # Maximum file size (in bytes) - 0 = unlimited
    MAX_FILE_SIZE = 0  # No limit
    
    # Preserve exact pixel dimensions
    PRESERVE_PIXEL_DIMENSIONS = True
    
    # Do not resize images
    NO_AUTOMATIC_RESIZE = True
    
    # Do not crop images
    NO_AUTOMATIC_CROP = True
    
    # Maintain aspect ratio (even if not resizing)
    MAINTAIN_ASPECT_RATIO = True


# ============================================================================
# COMPRESSION SETTINGS (All set to NO COMPRESSION)
# ============================================================================

class CompressionSettings:
    """
    Compression is completely disabled
    """
    
    # Disable all image compression
    ENABLE_COMPRESSION = False
    
    # Compression quality (ignored if compression disabled)
    COMPRESSION_QUALITY = 100
    
    # JPEG quality
    JPEG_QUALITY = 100
    
    # PNG optimization level (0-9, 0=no compression)
    PNG_OPTIMIZATION_LEVEL = 0
    
    # WebP quality
    WEBP_QUALITY = 100
    
    # Progressive JPEG
    PROGRESSIVE_JPEG = False
    
    # Strip metadata (EXIF)
    STRIP_METADATA = False


# ============================================================================
# DISPLAY AND RENDERING SETTINGS
# ============================================================================

class DisplaySettings:
    """
    Configure how images are displayed
    """
    
    # Image rendering method (crisp-edges = no interpolation)
    IMAGE_RENDERING = 'crisp-edges'
    
    # Prevent image smoothing/antialiasing
    PREVENT_IMAGE_SMOOTHING = True
    
    # Disable image filters
    ENABLE_FILTERS = False
    
    # Disable image transformations (rotate, scale, etc.)
    DISABLE_TRANSFORMS = True
    
    # Object-fit for images
    OBJECT_FIT = 'contain'  # contain, cover, fill, scale-down
    
    # Background for images with transparency
    IMAGE_BACKGROUND = '#ffffff'


# ============================================================================
# CACHE SETTINGS
# ============================================================================

class CacheSettings:
    """
    Configure caching behavior
    """
    
    # Cache original images
    CACHE_ORIGINAL_IMAGES = True
    
    # Cache converted images (we don't convert, but relevant for other formats)
    CACHE_CONVERTED_IMAGES = False
    
    # Cache duration (in seconds)
    CACHE_DURATION = 31536000  # 1 year
    
    # Clear cache on image update
    CLEAR_CACHE_ON_UPDATE = True


# ============================================================================
# WEBSITE FRONTEND SETTINGS
# ============================================================================

class WebsiteFrontendSettings:
    """
    Configure website behavior
    """
    
    # Disable WebP picture element
    DISABLE_WEBP_PICTURE_ELEMENT = True
    
    # Force original format in img src
    FORCE_ORIGINAL_FORMAT_SRC = True
    
    # Show format in image title
    SHOW_FORMAT_IN_TITLE = True
    
    # Add format indicator badge
    SHOW_FORMAT_BADGE = True
    
    # Format badge position (top-left, top-right, bottom-left, bottom-right)
    FORMAT_BADGE_POSITION = 'top-right'
    
    # Format badge color
    FORMAT_BADGE_COLOR = '#28a745'  # Green


# ============================================================================
# LOGGING AND DEBUG SETTINGS
# ============================================================================

class LoggingSettings:
    """
    Configure logging
    """
    
    # Enable debug logging
    DEBUG_MODE = False
    
    # Log all format detections
    LOG_FORMAT_DETECTION = True
    
    # Log all uploads
    LOG_UPLOADS = True
    
    # Log all display operations
    LOG_DISPLAY = False
    
    # Log level (DEBUG, INFO, WARNING, ERROR)
    LOG_LEVEL = 'INFO'


# ============================================================================
# PRODUCT IMAGE SPECIFIC SETTINGS
# ============================================================================

class ProductImageSettings:
    """
    Product image specific settings
    """
    
    # Apply preservation to template images
    PRESERVE_TEMPLATE_IMAGES = True
    
    # Apply preservation to variant images
    PRESERVE_VARIANT_IMAGES = True
    
    # Apply preservation to extra images
    PRESERVE_EXTRA_IMAGES = True
    
    # Create thumbnail without conversion
    PRESERVE_THUMBNAIL_FORMAT = True
    
    # Image sizes to create (keeping original)
    IMAGE_SIZES = {
        'image_128': False,      # No resize
        'image_256': False,      # No resize
        'image_512': False,      # No resize
        'image_1024': False,     # No resize
        'image_1920': False,     # No resize
    }


# ============================================================================
# MIGRATION FROM OLD SYSTEM
# ============================================================================

class MigrationSettings:
    """
    Settings for migrating from WebP system
    """
    
    # Re-process old WebP images to original format
    REPROCESS_OLD_IMAGES = False
    
    # Try to recover original format
    RECOVER_ORIGINAL_FORMAT = True
    
    # Batch size for re-processing
    BATCH_SIZE = 100
    
    # Keep WebP copies as fallback
    KEEP_WEBP_FALLBACK = False


# ============================================================================
# PYTHON CODE EXAMPLES FOR CUSTOMIZATION
# ============================================================================

"""
EXAMPLE 1: Override preservation in custom code

from odoo import models

class ProductImage(models.Model):
    _inherit = 'product.image'
    
    def write(self, vals):
        # Always preserve for this custom model
        vals['preserve_quality'] = True
        return super().write(vals)


EXAMPLE 2: Check format before saving

from odoo import models, api

class ProductTemplate(models.Model):
    _inherit = 'product.template'
    
    def create(self, vals):
        result = super().create(vals)
        # Verify all images are preserved
        for image in result.product_template_image_ids:
            assert image.preserve_quality
        return result


EXAMPLE 3: Custom image validation

from odoo import models, api

class ProductImage(models.Model):
    _inherit = 'product.image'
    
    @api.constrains('image_1920')
    def _check_image_quality(self):
        for record in self:
            if not record.preserve_quality:
                raise ValidationError('All images must preserve quality!')


EXAMPLE 4: Get image without conversion

from odoo import models

class ProductImage(models.Model):
    _inherit = 'product.image'
    
    def get_display_image(self):
        # Always returns original format
        return self._get_image_for_display()


EXAMPLE 5: Log format information

from odoo import models
import logging

_logger = logging.getLogger(__name__)

class ProductImage(models.Model):
    _inherit = 'product.image'
    
    def create(self, vals):
        result = super().create(vals)
        _logger.info(f"Image created: {result.name} - Format: {result.original_format}")
        return result
"""


# ============================================================================
# JAVASCRIPT CUSTOMIZATION (in image_quality_preserve.js)
# ============================================================================

"""
EXAMPLE: Custom JavaScript configuration

// Customize preservation behavior
const ImagePreservationConfig = {
    preserveWebP: false,                    // Never convert to WebP
    preserveQuality: true,                  // Always preserve quality
    allowedFormats: ['PNG', 'JPG', 'JPEG', 'GIF'],  // Limit formats
    maxQuality: 100,                        // Maximum quality
    autoDetectFormat: true,                 // Auto-detect on upload
    logToConsole: false,                    // Disable console logs
    enableFormatBadge: true,                // Show format indicator
};

// Override image upload handler
function customImageUploadHandler(file) {
    const format = getImageFormat(file.type);
    console.log(`Custom: Preserving ${format} format`);
    
    // Your custom logic here
    preserveImageFormat();
}
"""


# ============================================================================
# TROUBLESHOOTING CONFIGURATION
# ============================================================================

class TroubleshootingConfig:
    """
    Enable detailed troubleshooting
    """
    
    # Enable all debug logging
    ENABLE_DEBUG = False
    
    # Log all format detections
    LOG_DETECTIONS = True
    
    # Log all transformations
    LOG_TRANSFORMATIONS = False
    
    # Log cache operations
    LOG_CACHE = False
    
    # Save debug info to file
    SAVE_DEBUG_LOG = False
    
    # Debug log file location
    DEBUG_LOG_FILE = '/tmp/image_preservation_debug.log'


# ============================================================================
# DEFAULT CONFIGURATION FUNCTION
# ============================================================================

def get_default_config():
    """
    Get complete default configuration dictionary
    """
    return {
        'preservation': ImagePreservationSettings,
        'file_size': FileSizeSettings,
        'compression': CompressionSettings,
        'display': DisplaySettings,
        'cache': CacheSettings,
        'frontend': WebsiteFrontendSettings,
        'logging': LoggingSettings,
        'product_image': ProductImageSettings,
        'migration': MigrationSettings,
        'troubleshooting': TroubleshootingConfig,
    }


# ============================================================================
# APPLY CONFIGURATION
# ============================================================================

def apply_configuration(odoo_env):
    """
    Apply configuration to Odoo environment
    
    Usage in Python:
        config = get_default_config()
        apply_configuration(self.env)
    """
    config = get_default_config()
    # Configuration is applied automatically via models and views
    return config
