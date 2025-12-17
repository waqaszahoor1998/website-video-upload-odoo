# -*- coding: utf-8 -*-
"""
System-wide image quality preservation configuration
Maintains high quality for product images by preventing compression
"""

from odoo import models, api
import logging

_logger = logging.getLogger(__name__)


class IrConfigParameter(models.Model):
    _inherit = 'ir.config_parameter'

    @api.model
    def init_image_quality_settings(self):
        """Initialize system-wide image quality settings"""
        param = self.env['ir.config_parameter'].sudo()
        
        # Set maximum quality for images (95%)
        param.set_param('website.image.quality', '95')
        
        _logger.info("Image quality settings: 95% quality set for all images")
