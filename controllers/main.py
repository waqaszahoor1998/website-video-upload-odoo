# -*- coding: utf-8 -*-
import base64
import logging
import os
import json
from odoo import http
from odoo.exceptions import AccessError, ValidationError

_logger = logging.getLogger(__name__)


class VideoUploadController(http.Controller):
    """Controller to handle video file uploads"""

    @http.route(
        "/web/video/upload/json",
        type="jsonrpc",
        auth="user",
        methods=["POST"],
    )
    def upload_video_json(self, file_data, filename, mimetype):
        """Handle video upload via JSON RPC - Save as video ONLY (not document)"""
        try:
            _logger.info(f"Video upload attempt: {filename}, mimetype: {mimetype}")
            
            # Decode base64
            if isinstance(file_data, str):
                if file_data.startswith("data:"):
                    file_data = file_data.split(",", 1)[1]
                try:
                    file_bytes = base64.b64decode(file_data)
                except Exception as e:
                    _logger.error(f"Base64 decode error: {e}")
                    return {
                        "success": False,
                        "error": f"Invalid base64 data: {str(e)}",
                    }
            else:
                file_bytes = file_data

            file_size = len(file_bytes)
            _logger.info(f"File size: {file_size} bytes")
            
            # Validate file size (100MB max)
            MAX_VIDEO_SIZE = 100 * 1024 * 1024
            if file_size > MAX_VIDEO_SIZE:
                return {
                    "success": False,
                    "error": "File too large. Maximum 100MB.",
                }

            # Validate file type
            allowed_mimetypes = [
                "video/mp4",
                "video/webm",
                "video/ogg",
                "video/quicktime",
                "video/x-msvideo",
            ]
            
            if mimetype not in allowed_mimetypes:
                return {
                    "success": False,
                    "error": f"Invalid video format: {mimetype}. Allowed: MP4, WebM, OGG, MOV, AVI",
                }

            try:
                # Get Odoo filestore path
                from odoo.tools import config
                filestore_path = config.filestore(http.request.db)
                
                # Create videos directory if it doesn't exist
                videos_dir = os.path.join(filestore_path, 'videos')
                if not os.path.exists(videos_dir):
                    os.makedirs(videos_dir, exist_ok=True)
                
                # Generate unique filename to avoid conflicts
                import hashlib
                import time
                timestamp = int(time.time() * 1000)
                file_hash = hashlib.md5(file_bytes).hexdigest()[:8]
                clean_filename = filename.rsplit('.', 1)[0] if '.' in filename else filename
                safe_filename = f"{clean_filename}_{timestamp}_{file_hash}"
                
                # Get file extension
                file_ext = filename.rsplit('.', 1)[-1] if '.' in filename else 'webm'
                safe_filename = f"{safe_filename}.{file_ext}"
                
                # Save file to disk
                file_path = os.path.join(videos_dir, safe_filename)
                with open(file_path, 'wb') as f:
                    f.write(file_bytes)
                
                _logger.info(f"Video file saved to: {file_path}")
                
                # Build URL for the video - custom route
                video_url = f"/web/video/{safe_filename}"
                
                # Create ir.attachment as VIDEO type (not document)
                # Key: Don't store datas, use url only - this prevents it from appearing in documents
                attachment = http.request.env['ir.attachment'].sudo().create({
                    'name': filename,
                    'type': 'url',  # IMPORTANT: url type for videos
                    'url': video_url,  # Custom video URL
                    'mimetype': mimetype,
                    'public': True,
                    'res_model': 'ir.ui.view',  # Associate with views (website content)
                    'res_id': 0,
                    'description': json.dumps({
                        'original_filename': filename,
                        'video_options': {
                            'autoplay': False,
                            'loop': False,
                            'hideControls': False,
                            'hideFullscreen': False,
                        }
                    }),
                })
                
                _logger.info(f"Created video attachment ID: {attachment.id}, URL: {video_url}")
                
                response = {
                    "success": True,
                    "url": video_url,
                    "attachment_url": f"/web/content/{attachment.id}",
                    "filename": safe_filename,
                    "name": filename,
                    "mimetype": mimetype,
                    "attachment_id": attachment.id,
                    "id": attachment.id,  # Add id field for compatibility
                }
                
                _logger.info(f"Video upload successful: {response}")
                return response

            except Exception as e:
                _logger.exception("Error saving video file")
                return {
                    "success": False,
                    "error": f"File save error: {str(e)}",
                }

        except Exception as e:
            _logger.exception("Error during video upload")
            return {
                "success": False,
                "error": f"Server error: {str(e)}",
            }

    @http.route(
        "/web/video/<filename>",
        type="http",
        auth="public",
        methods=["GET"],
    )
    def get_video(self, filename):
        """Serve video files with proper headers for browser playback"""
        try:
            # Remove query parameters and URL encoding
            filename = filename.split("?")[0].split("&")[0]
            filename = filename.replace('%20', ' ')  # Handle spaces
            
            _logger.info(f"Attempting to serve video: {filename}")
            
            from odoo.tools import config
            filestore_path = config.filestore(http.request.db)
            video_path = os.path.join(filestore_path, 'videos', filename)
            
            _logger.info(f"Full path: {video_path}")
            
            # Security check: ensure path is within videos directory
            video_dir = os.path.join(filestore_path, 'videos')
            if not os.path.abspath(video_path).startswith(os.path.abspath(video_dir)):
                _logger.warning(f"Path traversal attempt: {video_path}")
                return http.request.not_found()
            
            if not os.path.exists(video_path):
                _logger.warning(f"Video file not found: {video_path}")
                # List directory to debug
                if os.path.exists(video_dir):
                    files = os.listdir(video_dir)
                    _logger.warning(f"Available files: {files}")
                return http.request.not_found()
            
            _logger.info(f"Serving video file: {video_path}")
            
            # Determine content type
            content_type = 'video/mp4'
            if filename.endswith('.webm'):
                content_type = 'video/webm'
            elif filename.endswith('.ogg'):
                content_type = 'video/ogg'
            elif filename.endswith('.mov'):
                content_type = 'video/quicktime'
            elif filename.endswith('.avi'):
                content_type = 'video/x-msvideo'
            
            with open(video_path, 'rb') as f:
                video_data = f.read()
            
            return http.Response(
                video_data,
                content_type=content_type,
                headers=[
                    ('Content-Disposition', f'inline; filename={filename}'),
                    ('Cache-Control', 'public, max-age=31536000'),
                    ('Access-Control-Allow-Origin', '*'),
                    ('Accept-Ranges', 'bytes'),  # Enable seeking
                ],
                direct_passthrough=True,
            )
        except Exception as e:
            _logger.exception(f"Error serving video {filename}")
            return http.request.not_found()
    
    @http.route(
        "/web/video/save-options",
        type="json",
        auth="user",
        methods=["POST"],
    )
    def save_video_options(self, attachment_id, options, **kw):
        """Save video control options to attachment"""
        try:
            attachment = http.request.env['ir.attachment'].sudo().browse(int(attachment_id))
            if attachment.exists():
                # Get existing description (might have other data)
                try:
                    current_desc = json.loads(attachment.description) if attachment.description else {}
                except:
                    current_desc = {}
                
                # Update video options
                current_desc['video_options'] = options
                
                # Store updated description
                attachment.description = json.dumps(current_desc)
                
                _logger.info(f"Saved options for video {attachment_id}: {options}")
                return {'success': True, 'message': 'Options saved'}
        except Exception as e:
            _logger.exception(f"Error saving video options for {attachment_id}")
            return {'success': False, 'error': str(e)}
        return {'success': False, 'error': 'Attachment not found'}
    
    @http.route(
        "/web/video/list",
        type="json",
        auth="user",
        methods=["POST"],
    )
    def list_uploaded_videos(self):
        """Return list of uploaded videos for suggestions - ONLY videos, not documents"""
        try:
            # Get all video attachments that are URL type (not binary)
            videos = http.request.env['ir.attachment'].sudo().search([
                ('mimetype', 'in', [
                    'video/mp4',
                    'video/webm',
                    'video/ogg',
                    'video/quicktime',
                    'video/x-msvideo',
                ]),
                ('type', '=', 'url'),
                ('public', '=', True),
                ('res_model', '=', 'ir.ui.view'),
            ], order='create_date desc', limit=50)
            
            result = []
            for video in videos:
                video_url = video.url or f'/web/content/{video.id}'
                
                # Try to parse options from description
                options = {
                    'autoplay': False,
                    'loop': False,
                    'hideControls': False,
                    'hideFullscreen': False,
                }
                try:
                    if video.description:
                        desc_data = json.loads(video.description)
                        if 'video_options' in desc_data:
                            options.update(desc_data['video_options'])
                except:
                    pass
                
                result.append({
                    'id': video.id,
                    'name': video.name,
                    'url': video_url,
                    'mimetype': video.mimetype,
                    'create_date': video.create_date.isoformat() if video.create_date else None,
                    'options': options,
                })
            
            _logger.info(f"Found {len(result)} uploaded videos (URL type only)")
            return {
                'success': True,
                'videos': result,
            }
        except Exception as e:
            _logger.exception("Error fetching video list")
            return {
                'success': False,
                'error': str(e),
                'videos': [],
            }

    @http.route(
        "/web/video/delete",
        type="json",
        auth="user",
        methods=["POST"],
    )
    def delete_uploaded_video(self, attachment_id):
        """Delete uploaded video and its file"""
        try:
            attachment = http.request.env['ir.attachment'].sudo().browse(attachment_id)
            
            if not attachment.exists():
                return {
                    'success': False,
                    'error': 'Video not found',
                }
            
            # Check if user has permission
            if attachment.type != 'url' or not attachment.url.startswith('/web/video/'):
                return {
                    'success': False,
                    'error': 'Invalid video attachment',
                }
            
            # Extract filename from URL
            video_url = attachment.url
            filename = video_url.replace('/web/video/', '')
            
            # Delete physical file
            try:
                from odoo.tools import config
                filestore_path = config.filestore(http.request.db)
                video_path = os.path.join(filestore_path, 'videos', filename)
                
                if os.path.exists(video_path):
                    os.remove(video_path)
                    _logger.info(f"Deleted video file: {video_path}")
            except Exception as e:
                _logger.warning(f"Could not delete video file: {e}")
            
            # Delete attachment record
            video_name = attachment.name
            attachment.unlink()
            
            _logger.info(f"Deleted video attachment ID: {attachment_id}, name: {video_name}")
            
            return {
                'success': True,
                'message': f'Video "{video_name}" deleted successfully',
            }
            
        except Exception as e:
            _logger.exception(f"Error deleting video {attachment_id}")
            return {
                'success': False,
                'error': f'Delete error: {str(e)}',
            }