# -*- coding: utf-8 -*-
"""
Product Image Quality Preservation Module for Odoo 19
Preserves original image format and dimensions without WebP conversion
"""

from odoo import models, fields, api
import base64
import io
import logging

try:
    from PIL import Image
    HAS_PIL = True
except ImportError:
    HAS_PIL = False

_logger = logging.getLogger(__name__)


class ProductImage(models.Model):
    _inherit = 'product.image'

    original_format = fields.Char(
        string='Original Format',
        help='Original image format (PNG, JPEG, GIF, etc.)',
        store=True,
        readonly=True
    )

    original_dimensions = fields.Char(
        string='Original Dimensions',
        help='Original image dimensions (width x height in pixels)',
        store=True,
        readonly=True
    )

    def _detect_image_format_and_dimensions(self, image_data):
        """Detect image format and dimensions from base64 encoded image data"""
        if not image_data:
            return None, None

        try:
            if HAS_PIL:
                image_bytes = base64.b64decode(image_data)
                image = Image.open(io.BytesIO(image_bytes))
                image_format = image.format or 'UNKNOWN'
                width, height = image.size
                dimensions = f"{width} x {height} px"
                _logger.info(f"Image detected - Format: {image_format}, Dimensions: {width}x{height}px")
                return image_format, dimensions
            else:
                _logger.warning("PIL library not available, cannot detect image format/dimensions")
                return None, None
        except Exception as e:
            _logger.warning(f"Could not detect image format and dimensions: {e}")
            return None, None

    @api.model_create_multi
    def create(self, vals_list):
        """Prevent image processing on creation and detect image format/dimensions"""
        for vals in vals_list:
            # Replicate 1920 to all sizes to prevent resizing
            for size_field in ['image_1024', 'image_512', 'image_256', 'image_128']:
                if 'image_1920' in vals:
                    vals[size_field] = vals['image_1920']
            
            # Detect and store image format and dimensions
            if 'image_1920' in vals and vals['image_1920']:
                image_format, dimensions = self._detect_image_format_and_dimensions(vals['image_1920'])
                if image_format:
                    vals['original_format'] = image_format
                    vals['original_dimensions'] = dimensions
                    _logger.info(f"Image created - Format: {image_format}, Dimensions: {dimensions}")
        
        return super().create(vals_list)

    def write(self, vals):
        """Detect new image format/dimensions on update"""
        if 'image_1920' in vals and vals['image_1920']:
            # Replicate 1920 to all sizes to prevent resizing
            for size_field in ['image_1024', 'image_512', 'image_256', 'image_128']:
                vals[size_field] = vals['image_1920']
            
            # Detect and store image format and dimensions
            image_format, dimensions = self._detect_image_format_and_dimensions(vals['image_1920'])
            if image_format:
                vals['original_format'] = image_format
                vals['original_dimensions'] = dimensions
                _logger.info(f"Image updated - Format: {image_format}, Dimensions: {dimensions}")
        
        return super().write(vals)


class ProductTemplate(models.Model):
    """Override product template to preserve image quality"""
    _inherit = 'product.template'

    main_image_format = fields.Char(
        string='Main Image Format',
        compute='_compute_main_image_info',
        store=False
    )

    main_image_dimensions = fields.Char(
        string='Main Image Dimensions',
        compute='_compute_main_image_info',
        store=False
    )

    @api.depends('image_1920')
    def _compute_main_image_info(self):
        """Display main image format and dimensions"""
        for record in self:
            if record.image_1920 and HAS_PIL:
                try:
                    image_bytes = base64.b64decode(record.image_1920)
                    image = Image.open(io.BytesIO(image_bytes))
                    record.main_image_format = image.format or 'UNKNOWN'
                    width, height = image.size
                    record.main_image_dimensions = f"{width} x {height} px"
                except Exception as e:
                    _logger.warning(f"Error computing image info: {e}")
                    record.main_image_format = 'Unknown'
                    record.main_image_dimensions = 'Unknown'
            else:
                record.main_image_format = False
                record.main_image_dimensions = False


class ImageMixin(models.AbstractModel):
    """Override image.mixin to preserve original image quality"""
    _inherit = 'image.mixin'

    def _image_process(self, image, size=(0, 0), crop=None, colorize=False, quality=0, format='PNG'):
        """
        Block image processing for product images to preserve quality
        """
        if not image:
            return image
        
        # Prevent processing for product models
        if self._name in ['product.image', 'product.template', 'product.product']:
            _logger.info(f"{self._name}: Preserving original image without processing")
            return image
        
        return super()._image_process(
            image, size=size, crop=crop, colorize=colorize, quality=quality, format=format
        )

    def _image_get_resized_images(self, vals=None, crop_image=False):
        """
        Prevent automatic image resizing for product images
        All sizes point to the original 1920 image
        """
        if not vals:
            vals = {}
        
        if self._name in ['product.image', 'product.template', 'product.product'] and 'image_1920' in vals:
            _logger.info(f"{self._name}: Using original image for all sizes (no resizing)")
            return {
                'image_1024': vals.get('image_1920'),
                'image_512': vals.get('image_1920'),
                'image_256': vals.get('image_1920'),
                'image_128': vals.get('image_1920'),
                'image_1920': vals.get('image_1920')
            }
        
        return super()._image_get_resized_images(vals=vals, crop_image=crop_image)
