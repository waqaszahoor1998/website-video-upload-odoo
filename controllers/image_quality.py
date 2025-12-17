# -*- coding: utf-8 -*-
"""
Web image serving override to maintain quality
"""

from odoo.http import request, Response, route, Controller
import base64
import logging

_logger = logging.getLogger(__name__)


class ImageQualityPreserveController(Controller):
    """Controller to serve original quality product images"""

    @route(['/web/image/<string:model>/<int:id>/<string:field>',
            '/web/image/<string:model>/<int:id>/<string:field>/<string:filename>'],
           type='http', auth='public', csrf=False)
    def serve_product_image(self, model, id, field, filename=None, **kwargs):
        """Serve original unprocessed images for product models"""
        try:
            # Only serve product images with quality preservation
            if model in ['product.image', 'product.template', 'product.product']:
                record = request.env[model].sudo().browse(int(id))
                if record and hasattr(record, 'image_1920') and record.image_1920:
                    image_data = base64.b64decode(record.image_1920)
                    
                    # Detect MIME type from original format if available
                    mimetype = 'image/jpeg'
                    if hasattr(record, 'original_format') and record.original_format:
                        fmt = record.original_format.lower()
                        mime_map = {
                            'png': 'image/png',
                            'gif': 'image/gif',
                            'webp': 'image/webp',
                            'svg': 'image/svg+xml',
                            'jpeg': 'image/jpeg',
                            'jpg': 'image/jpeg'
                        }
                        mimetype = mime_map.get(fmt, 'image/jpeg')
                    
                    _logger.info(f"Serving {mimetype} image for {model} ID {id}")
                    return Response(image_data, mimetype=mimetype, direct_passthrough=True)
        except Exception as e:
            _logger.warning(f"Error serving image: {e}")
        
        # For non-product images, let Odoo handle it normally
        return request.env['ir.http']._serve_files(model, id, field, filename=filename, **kwargs)
