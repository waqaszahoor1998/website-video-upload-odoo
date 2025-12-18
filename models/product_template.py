# Part of Odoo. See LICENSE file for full copyright and licensing details.

import base64
import mimetypes

from odoo import _, api, fields, models
from odoo.exceptions import ValidationError

from odoo.addons.html_editor.tools import get_video_embed_code, get_video_thumbnail


class ProductTemplate(models.Model):
    _inherit = 'product.template'

    video_url = fields.Char(
        string="Video URL",
        help="URL of a video for showcasing your product (YouTube, Vimeo, etc.). If set, this video will be displayed instead of the product image on the website.",
    )
    video_file = fields.Binary(
        string="Video File",
        help="Upload a video file from your computer. Supported formats: MP4, WebM, OGG. If both URL and file are set, the file will be used.",
    )
    video_filename = fields.Char(
        string="Video Filename",
        help="Name of the uploaded video file",
    )
    video_autoplay = fields.Boolean(
        string="Autoplay",
        default=False,
        help="Video will start playing automatically when page loads (requires muted for browser policy)",
    )
    video_loop = fields.Boolean(
        string="Loop",
        default=False,
        help="Video will restart automatically when it ends",
    )
    video_hide_controls = fields.Boolean(
        string="Hide Controls",
        default=False,
        help="Hide video player controls (play, pause, volume, etc.)",
    )
    video_hide_fullscreen = fields.Boolean(
        string="Hide Fullscreen",
        default=False,
        help="Hide fullscreen button in video controls",
    )
    embed_code = fields.Html(
        compute='_compute_embed_code',
        sanitize=False,
    )
    preview_embed_code = fields.Html(
        compute='_compute_preview_embed_code',
        sanitize=False,
        help="Preview version without control settings to prevent reloading",
    )
    has_video = fields.Boolean(
        compute='_compute_has_video',
        string="Has Video",
    )

    #=== COMPUTE METHODS ===#

    @api.depends('video_url', 'video_file')
    def _compute_has_video(self):
        for template in self:
            template.has_video = bool(template.video_url or template.video_file)

    @api.depends('video_url', 'video_file', 'video_autoplay', 'video_loop', 'video_hide_controls', 'video_hide_fullscreen')
    def _compute_preview_embed_code(self):
        """Preview embed code with control settings so toggles work in preview"""
        for template in self:
            embed = False
            if template.video_file:
                # For uploaded video files, create HTML5 video tag with current settings
                embed = template._get_video_file_embed_preview_with_settings()
            elif template.video_url:
                # For video URLs, use the embed code from html_editor with control params
                video_url = template.video_url
                # Add control parameters to YouTube/Vimeo URLs if needed
                if template.video_autoplay:
                    if 'youtube.com' in video_url or 'youtu.be' in video_url:
                        if '?' in video_url:
                            separator = '&' if 'autoplay' not in video_url else ''
                            video_url = f"{video_url}{separator}autoplay=1&mute=1"
                        else:
                            video_url = f"{video_url}?autoplay=1&mute=1"
                    elif 'vimeo.com' in video_url:
                        if '?' in video_url:
                            separator = '&' if 'autoplay' not in video_url else ''
                            video_url = f"{video_url}{separator}autoplay=1&muted=1"
                        else:
                            video_url = f"{video_url}?autoplay=1&muted=1"
                embed = get_video_embed_code(video_url)
            template.preview_embed_code = embed

    @api.depends('video_url', 'video_file', 'video_autoplay', 'video_loop', 'video_hide_controls', 'video_hide_fullscreen')
    def _compute_embed_code(self):
        """Final embed code with all control settings for website display"""
        for template in self:
            embed = False
            if template.video_file:
                # For uploaded video files, create HTML5 video tag
                embed = template._get_video_file_embed()
            elif template.video_url:
                # For video URLs, use the embed code from html_editor
                video_url = template.video_url
                # Add control parameters to YouTube/Vimeo URLs if needed (without modifying the field)
                if template.video_autoplay:
                    # For YouTube/Vimeo, add autoplay parameter to URL
                    if 'youtube.com' in video_url or 'youtu.be' in video_url:
                        if '?' in video_url:
                            separator = '&' if 'autoplay' not in video_url else ''
                            video_url = f"{video_url}{separator}autoplay=1&mute=1"
                        else:
                            video_url = f"{video_url}?autoplay=1&mute=1"
                    elif 'vimeo.com' in video_url:
                        if '?' in video_url:
                            separator = '&' if 'autoplay' not in video_url else ''
                            video_url = f"{video_url}{separator}autoplay=1&muted=1"
                        else:
                            video_url = f"{video_url}?autoplay=1&muted=1"
                embed = get_video_embed_code(video_url)
            template.embed_code = embed

    def _get_video_file_embed_preview(self):
        """Generate HTML5 video embed code for preview (with default controls, no settings)"""
        self.ensure_one()
        if not self.video_file:
            return False
        
        # Get video URL - Odoo serves binary fields through /web/content
        filename = self.video_filename or 'video.mp4'
        try:
            from odoo.http import request
            if hasattr(request, 'httprequest') and request.httprequest:
                base_url = request.httprequest.url_root.rstrip('/')
            else:
                base_url = self.env['ir.config_parameter'].sudo().get_param('web.base.url', '')
        except:
            base_url = self.env['ir.config_parameter'].sudo().get_param('web.base.url', '')
        
        # Use relative URL if base_url is not available (works in most cases)
        if base_url:
            video_url = f'{base_url}/web/content/product.template/{self.id}/video_file/{filename}'
        else:
            video_url = f'/web/content/product.template/{self.id}/video_file/{filename}'
        
        # Determine MIME type from filename
        mime_type = mimetypes.guess_type(filename)[0] or 'video/mp4'
        
        # Preview always has controls, no other settings
        return f'''<div class="o_custom_video_container o_product_video_container" data-is-local-video="true" style="width: 100%; height: 100%; display: block; overflow: hidden; position: relative; box-sizing: border-box;"><video controls style="width: 100%; height: 100%; max-width: 100%; max-height: 100%; object-fit: fill; background: #000; display: block; position: relative; box-sizing: border-box;" preload="metadata"><source src="{video_url}" type="{mime_type}">Your browser does not support the video tag.</video></div>'''

    def _get_video_file_embed_preview_with_settings(self):
        """Generate HTML5 video embed code for preview with current control settings"""
        self.ensure_one()
        if not self.video_file:
            return False
        
        # Get video URL - Odoo serves binary fields through /web/content
        filename = self.video_filename or 'video.mp4'
        try:
            from odoo.http import request
            if hasattr(request, 'httprequest') and request.httprequest:
                base_url = request.httprequest.url_root.rstrip('/')
            else:
                base_url = self.env['ir.config_parameter'].sudo().get_param('web.base.url', '')
        except:
            base_url = self.env['ir.config_parameter'].sudo().get_param('web.base.url', '')
        
        # Use relative URL if base_url is not available (works in most cases)
        if base_url:
            video_url = f'{base_url}/web/content/product.template/{self.id}/video_file/{filename}'
        else:
            video_url = f'/web/content/product.template/{self.id}/video_file/{filename}'
        
        # Determine MIME type from filename
        mime_type = mimetypes.guess_type(filename)[0] or 'video/mp4'
        
        # Build video attributes based on current settings
        video_attrs = []
        video_data_attrs = []
        
        # Controls
        if not self.video_hide_controls:
            video_attrs.append('controls')
        else:
            video_data_attrs.append('data-video-hide-controls="true"')
        
        # Autoplay (requires muted for browser policy)
        if self.video_autoplay:
            video_attrs.append('autoplay')
            video_attrs.append('muted')
            video_attrs.append('playsinline')
            video_data_attrs.append('data-video-autoplay="true"')
        
        # Loop
        if self.video_loop:
            video_attrs.append('loop')
            video_data_attrs.append('data-video-loop="true"')
        
        # Fullscreen restriction
        if self.video_hide_fullscreen:
            video_attrs.append('controlsList="nodownload nofullscreen"')
            video_attrs.append('disablePictureInPicture')
            video_data_attrs.append('data-video-hide-fullscreen="true"')
        
        attrs_str = ' '.join(video_attrs) if video_attrs else ''
        data_attrs_str = ' '.join(video_data_attrs) if video_data_attrs else ''
        
        return f'''<div class="o_custom_video_container o_product_video_container" data-is-local-video="true" {data_attrs_str} style="width: 100%; height: 100%; display: block; overflow: hidden; position: relative; box-sizing: border-box;"><video {attrs_str} style="width: 100%; height: 100%; max-width: 100%; max-height: 100%; object-fit: fill; background: #000; display: block; position: relative; box-sizing: border-box;" preload="metadata"><source src="{video_url}" type="{mime_type}">Your browser does not support the video tag.</video></div>'''

    def _get_video_file_embed(self):
        """Generate HTML5 video embed code for uploaded video file with all control settings"""
        self.ensure_one()
        if not self.video_file:
            return False
        
        # Get video URL - Odoo serves binary fields through /web/content
        # Use request to get base URL if available, otherwise use config parameter
        filename = self.video_filename or 'video.mp4'
        try:
            from odoo.http import request
            if hasattr(request, 'httprequest') and request.httprequest:
                base_url = request.httprequest.url_root.rstrip('/')
            else:
                base_url = self.env['ir.config_parameter'].sudo().get_param('web.base.url', '')
        except:
            base_url = self.env['ir.config_parameter'].sudo().get_param('web.base.url', '')
        
        # Use relative URL if base_url is not available (works in most cases)
        if base_url:
            video_url = f'{base_url}/web/content/product.template/{self.id}/video_file/{filename}'
        else:
            video_url = f'/web/content/product.template/{self.id}/video_file/{filename}'
        
        # Determine MIME type from filename
        mime_type = mimetypes.guess_type(filename)[0] or 'video/mp4'
        
        # Build video attributes based on settings
        video_attrs = []
        video_data_attrs = []
        
        # Controls
        if not self.video_hide_controls:
            video_attrs.append('controls')
        else:
            video_data_attrs.append('data-video-hide-controls="true"')
        
        # Autoplay (requires muted for browser policy)
        if self.video_autoplay:
            video_attrs.append('autoplay')
            video_attrs.append('muted')
            video_attrs.append('playsinline')
            video_data_attrs.append('data-video-autoplay="true"')
        
        # Loop
        if self.video_loop:
            video_attrs.append('loop')
            video_data_attrs.append('data-video-loop="true"')
        
        # Fullscreen restriction
        if self.video_hide_fullscreen:
            video_attrs.append('controlsList="nodownload nofullscreen"')
            video_attrs.append('disablePictureInPicture')
            video_data_attrs.append('data-video-hide-fullscreen="true"')
        
        attrs_str = ' '.join(video_attrs) if video_attrs else ''
        data_attrs_str = ' '.join(video_data_attrs) if video_data_attrs else ''
        
        return f'''<div class="o_custom_video_container o_product_video_container" data-is-local-video="true" {data_attrs_str} style="width: 100%; height: 100%; display: block; overflow: hidden; position: relative; box-sizing: border-box;"><video {attrs_str} style="width: 100%; height: 100%; max-width: 100%; max-height: 100%; object-fit: fill; background: #000; display: block; position: relative; box-sizing: border-box;" preload="metadata"><source src="{video_url}" type="{mime_type}">Your browser does not support the video tag.</video></div>'''

    #=== ONCHANGE METHODS ===#

    @api.onchange('video_url')
    def _onchange_video_url(self):
        # Clear video_file if URL is set
        if self.video_url:
            self.video_file = False
            self.video_filename = False
            # Optionally set thumbnail if no image exists
            # Uncomment the following if you want to auto-set thumbnail from video URL
            # if not self.image_1920:
            #     thumbnail = get_video_thumbnail(self.video_url)
            #     self.image_1920 = thumbnail and base64.b64encode(thumbnail) or False

    @api.onchange('video_file')
    def _onchange_video_file(self):
        # Clear video_url if file is uploaded
        if self.video_file:
            self.video_url = False
            # Don't clear image_1920 - allow both image and video to coexist
    
    @api.onchange('video_url', 'video_file')
    def _onchange_video_override_image(self):
        """Clear image when video is set to override it"""
        if self.has_video:
            # Optionally clear image - uncomment if you want automatic clearing
            # self.image_1920 = False
            pass

    #=== CONSTRAINT METHODS ===#

    @api.constrains('video_url')
    def _check_valid_video_url(self):
        for template in self:
            if template.video_url and not template.video_file:
                # Only validate URL if no file is uploaded
                embed = get_video_embed_code(template.video_url)
                if not embed:
                    raise ValidationError(_("Provided video URL for '%s' is not valid. Please enter a valid video URL.", template.name))

    @api.constrains('video_file', 'video_filename')
    def _check_video_file(self):
        for template in self:
            if template.video_file:
                # Auto-set filename if not provided
                if not template.video_filename:
                    template.video_filename = f'product_{template.id}_video.mp4'
                # Check file extension
                valid_extensions = ['mp4', 'webm', 'ogg', 'mov', 'avi']
                file_ext = template.video_filename.lower().split('.')[-1] if '.' in template.video_filename else ''
                if file_ext not in valid_extensions:
                    raise ValidationError(_("Invalid video file format. Supported formats: MP4, WebM, OGG, MOV, AVI. Current filename: %s", template.video_filename))

