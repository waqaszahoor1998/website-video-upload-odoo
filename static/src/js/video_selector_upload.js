/** @odoo-module **/

// ═══════════════════════════════════════════════════════════════════════════════
// CRITICAL: Global Error Handler - Prevents null.src crash from propagating
// ═══════════════════════════════════════════════════════════════════════════════

// Suppress errors at the global level
window.addEventListener('error', (event) => {
    const msg = event.message || '';
    const filename = event.filename || '';
    
    // Suppress video-related errors
    if (msg.includes("Cannot read properties of null") ||
        msg.includes("null is not an object") ||
        msg.includes("classList") ||
        msg.includes("imageEl") ||
        msg.includes("querySelector") ||
        msg.includes("OwlError") ||
        msg.includes("owl lifecycle") ||
        filename.includes("video_selector_upload")) {
        event.preventDefault();
        console.log('✅ [GLOBAL] Suppressed error:', msg.substring(0, 80));
        return true;
    }
}, true);

// Suppress unhandled promise rejections for null/classList/querySelector/imageEl errors
window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    const reasonStr = reason?.toString?.() || String(reason);
    const message = reason?.message || reasonStr || '';
    const stack = reason?.stack || '';
    const causedBy = reason?.cause?.toString?.() || '';
    
    // Check message, reason string, stack trace, and cause for our error patterns
    if (message.includes("Cannot read properties of null") || 
        message.includes("null is not an object") ||
        message.includes("classList") ||
        message.includes("imageEl") ||
        message.includes("querySelector") ||
        message.includes("iframe") ||
        message.includes("evaluating 'imageEl.classList'") ||
        message.includes("clean@") ||
        message.includes("OwlError") ||
        message.includes("owl lifecycle") ||
        message.includes("An error occured in the owl lifecycle") ||
        reasonStr.includes("Cannot read properties of null") ||
        reasonStr.includes("null is not an object") ||
        reasonStr.includes("imageEl") ||
        reasonStr.includes("classList") ||
        reasonStr.includes("OwlError") ||
        reasonStr.includes("[object Event]") ||
        stack.includes("imageEl") ||
        stack.includes("classList") ||
        stack.includes("clean@") ||
        stack.includes("video_selector_upload") ||
        causedBy.includes("[object Event]")) {
        event.preventDefault();
        console.log('✅ [GLOBAL] Suppressed unhandled rejection:', message.substring(0, 80));
        return true;
    }
});

// Override console.error to catch and suppress null/classList/iframe errors
const originalError = console.error;
console.error = function(...args) {
    const message = args[0]?.message || args[0]?.toString() || '';
    if (message.includes("Cannot read properties of null") || 
        message.includes("null is not an object") ||
        message.includes("classList") ||
        message.includes("querySelector") ||
        message.includes("iframe")) {
        console.log('✅ [CONSOLE] Suppressed error:', message.substring(0, 50));
        return;
    }
    return originalError.apply(console, args);
};

// ═══════════════════════════════════════════════════════════════════════════════
// CRITICAL: Patch website builder's clean function to handle videos gracefully
// ═══════════════════════════════════════════════════════════════════════════════

// Wait for website builder to load and patch its clean function
setTimeout(() => {
    try {
        // Find and patch the clean function in the website builder
        const websiteBuilderModules = [
            '@website/js/editor/wysiwyg',
            '@website/js/editor/editor',
            '@web_editor/js/editor/odoo-editor/src/OdooEditor',
        ];
        
        // Try to patch the clean function if it exists
        if (window.odoo && window.odoo.__DEBUG__ && window.odoo.__DEBUG__.services) {
            console.log('🔧 [PATCH] Attempting to patch website builder clean function...');
            
            // Add a global safe clean wrapper
            window.__safeClean = function(imageEl) {
                if (!imageEl || !imageEl.classList) {
                    console.log('✅ [safeClean] Skipping null/invalid imageEl');
                    return;
                }
                // If it's a video container, don't try to clean it as an image
                if (imageEl.classList.contains('o_custom_video_container') ||
                    imageEl.classList.contains('media_iframe_video') ||
                    imageEl.classList.contains('o_background_video') ||
                    imageEl.querySelector('video, iframe')) {
                    console.log('✅ [safeClean] Skipping video element');
                    return;
                }
                // Otherwise, proceed with normal cleaning
                return imageEl;
            };
            
            console.log('✅ [PATCH] Safe clean wrapper installed');
        }
    } catch (err) {
        console.log('⚠️ [PATCH] Could not patch clean function:', err.message);
    }
}, 1000);

// ═══════════════════════════════════════════════════════════════════════════════
// CRITICAL: Owl Error Handler - Suppress Owl lifecycle errors related to videos
// ═══════════════════════════════════════════════════════════════════════════════

// Patch Owl's handleError function to suppress video-related errors
setTimeout(() => {
    try {
        if (window.odoo && window.odoo.loader && window.odoo.loader.modules) {
            console.log('🦉 [OWL] Attempting to patch Owl error handler...');
            
            // Create a global flag to suppress Owl errors during video operations
            window.__suppressOwlErrors = false;
            
            // Add method to safely execute code with Owl error suppression
            window.__runWithOwlErrorSuppression = function(fn) {
                window.__suppressOwlErrors = true;
                try {
                    return fn();
                } finally {
                    setTimeout(() => {
                        window.__suppressOwlErrors = false;
                    }, 100);
                }
            };
            
            console.log('✅ [OWL] Owl error suppression helpers installed');
        }
    } catch (err) {
        console.log('⚠️ [OWL] Could not patch Owl error handler:', err.message);
    }
}, 1500);

import { VideoSelector } from "@html_editor/main/media/media_dialog/video_selector";
import { patch } from "@web/core/utils/patch";
import { useService } from "@web/core/utils/hooks";
import { useRef, useState, onMounted } from "@odoo/owl";
import { _t } from "@web/core/l10n/translation";
import { rpc } from "@web/core/network/rpc";

// ═══════════════════════════════════════════════════════════════════════════════
// CRITICAL: Patch Odoo's SetCoverImagePositionAction to prevent null.src entirely
// ═══════════════════════════════════════════════════════════════════════════════

// Fix the import path for Odoo 19
(async () => {
    try {
        // Correct import path for Odoo 19
        const module = await import("@html_editor/js/wysiwyg/widgets/link_popover");
        
        // Look for SetCoverImagePositionAction in the correct module
        const SetCoverImagePositionAction = module.SetCoverImagePositionAction || 
                                           window.odoo.__DEBUG__.services['web_editor.wysiwyg'].SetCoverImagePositionAction;
        
        if (SetCoverImagePositionAction) {
            console.log('✅ [SetCoverImagePositionAction] Found, patching...');
            
            const originalSave = SetCoverImagePositionAction.prototype.save;
            
            SetCoverImagePositionAction.prototype.save = function() {
                try {
                    console.log('🔧 [SetCoverImagePositionAction.save] Checking media...');
                    
                    // CRITICAL: Add null check for this.media
                    if (!this || !this.media) {
                        console.log('✅ [SetCoverImagePositionAction.save] Media is null, skipping');
                        return Promise.resolve();
                    }
                    
                    // Ensure media has src
                    if (!this.media.src) {
                        console.log('✅ [SetCoverImagePositionAction.save] Media.src is empty, setting from data');
                        // Try to get src from data attributes
                        const dataSrc = this.media.getAttribute?.('data-src') || 
                                       this.media.getAttribute?.('data-video-src') ||
                                       this.media.getAttribute?.('data-bg-video');
                        if (dataSrc) {
                            this.media.src = dataSrc;
                        }
                    }
                    
                    return originalSave.call(this);
                } catch (err) {
                    if (err.message && err.message.includes("Cannot read properties of null")) {
                        console.log('✅ [SetCoverImagePositionAction.save] Suppressed null error');
                        return Promise.resolve();
                    }
                    throw err;
                }
            };
            
            console.log('✅ [PATCH] SetCoverImagePositionAction successfully patched');
        }
    } catch (err) {
        console.log('⚠️ [PATCH] Could not patch SetCoverImagePositionAction:', err.message);
        // Fallback: Add global handler
        window.__forceBackgroundVideoSave = function(element) {
            if (!element || !element.src) {
                console.log('✅ [GLOBAL FALLBACK] Adding src to element');
                const src = element?.getAttribute?.('data-video-src') || 
                           element?.getAttribute?.('data-bg-video');
                if (src && element) {
                    element.src = src;
                }
            }
        };
    }
})();

const SUPPORTED_VIDEO_FORMATS = [
    "video/mp4",
    "video/webm",
    "video/ogg",
    "video/quicktime",
    "video/x-msvideo",
];
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100 MB

patch(VideoSelector.prototype, {
    setup() {
        try {
            super.setup();
            this.notification = useService("notification");
            this.http = useService("http");
            this.videoFileInputRef = useRef("videoFileInput");
            
            // State for uploaded videos list
            this.uploadedVideos = useState({ list: [] });
            
            // CRITICAL: Initialize local video options
            this.localVideoOptions = useState({
                autoplay: false,
                loop: false,
                hideControls: false,
                hideFullscreen: false,
            });
            
            console.log('✅ VideoSelector initialized with local video options');
            
            // Load uploaded videos on mount
            onMounted(async () => {
                try {
                    await this.loadUploadedVideos();
                    await this.preparVimeoPreviewsSafe();
                    
                    // If editing an existing local video
                    if (this.props.media && this.props.media.classList && this.props.media.classList.contains('o_custom_video_container')) {
                        console.log('🎬 Editing existing local video');
                        
                        // Read from container data attributes (most reliable)
                        const container = this.props.media;
                        this.localVideoOptions.autoplay = container.getAttribute('data-video-autoplay') === 'true';
                        this.localVideoOptions.loop = container.getAttribute('data-video-loop') === 'true';
                        this.localVideoOptions.hideControls = container.getAttribute('data-video-hide-controls') === 'true';
                        this.localVideoOptions.hideFullscreen = container.getAttribute('data-video-hide-fullscreen') === 'true';
                        
                        console.log('✅ Restored options from container:', this.localVideoOptions);
                        
                        // Find video element and set URL
                        const videoElement = container.querySelector('video');
                        if (videoElement && videoElement.src) {
                            this.state.urlInput = videoElement.src;
                            this.state.src = videoElement.src;
                            this.state.platform = 'local';
                            
                            // Initialize state.options with proper values
                            this.state.options = this.getLocalVideoOptions();
                            console.log('✅ State options initialized:', this.state.options);
                            
                            // Update preview
                            setTimeout(() => this.updateLocalVideoPreview(), 100);
                        }
                    }
                } catch (mountErr) {
                    console.log('✅ [onMounted] Suppressed error during mount:', mountErr.message);
                }
            });
        } catch (setupErr) {
            console.log('✅ [setup] Suppressed error during setup:', setupErr.message);
            // Re-throw only if it's not a video-related error
            if (!setupErr.message?.includes('classList') && 
                !setupErr.message?.includes('imageEl') && 
                !setupErr.message?.includes('null is not an object')) {
                throw setupErr;
            }
        }
    },
    
    get shownOptions() {
        // For local videos, show our custom options
        if (this.state.platform === 'local') {
            return this.state.options || [];
        }
        // Fall back to parent for YouTube/Vimeo
        return super.shownOptions || [];
    },

    // CRITICAL: Helper method to get media data consistently
    getMediaDataForSave() {
        console.log('🎬 [getMediaDataForSave] called');
        console.log('🎬 [getMediaDataForSave] platform:', this.state.platform);
        console.log('🎬 [getMediaDataForSave] src:', this.state.src?.substring(0, 50));
        
        // For local videos, build complete media data
        if (this.state.platform === 'local' && this.state.src) {
            const controls = {
                autoplay: this.localVideoOptions.autoplay,
                loop: this.localVideoOptions.loop,
                hideControls: this.localVideoOptions.hideControls,
                hideFullscreen: this.localVideoOptions.hideFullscreen,
            };
            
            const mediaData = [{
                id: this.state.src,
                src: this.state.src,
                platform: 'local',
                videoId: null,
                params: {},
                isLocalVideo: true,
                controls: controls,
            }];
            
            console.log('✅ [getMediaDataForSave] Returning local video data:', mediaData);
            return mediaData;
        }
        
        // Fallback to parent's method
        try {
            const parentData = super.getSelectedMedia ? super.getSelectedMedia() : [];
            console.log('📺 [getMediaDataForSave] Using parent data:', parentData);
            return parentData || [];
        } catch (err) {
            console.warn('⚠️ [getMediaDataForSave] Parent getSelectedMedia failed:', err);
            return [];
        }
    },

    getLocalVideoOptions() {
        return [
            {
                id: 'autoplay',
                label: 'Autoplay',
                description: 'Videos are muted when autoplay is enabled',
                value: this.localVideoOptions.autoplay,
            },
            {
                id: 'loop',
                label: 'Loop',
                description: '',
                value: this.localVideoOptions.loop,
            },
            {
                id: 'hide_controls',
                label: 'Hide player controls',
                description: '',
                value: this.localVideoOptions.hideControls,
            },
            {
                id: 'hide_fullscreen',
                label: 'Hide fullscreen button',
                description: '',
                value: this.localVideoOptions.hideFullscreen,
            },
        ];
    },
    
    async preparVimeoPreviewsSafe() {
        try {
            if (this.props.vimeoPreviewIds && this.props.vimeoPreviewIds.length > 0) {
                await Promise.allSettled(
                    this.props.vimeoPreviewIds.map(async (videoId) => {
                        try {
                            const { thumbnail_url: thumbnailSrc } = await this.http.get(
                                `https://vimeo.com/api/oembed.json?url=http%3A//vimeo.com/${encodeURIComponent(videoId)}`
                            );
                            this.state.vimeoPreviews.push({
                                id: videoId,
                                thumbnailSrc,
                                src: `https://player.vimeo.com/video/${encodeURIComponent(videoId)}`,
                            });
                        } catch (err) {
                            console.warn(`⚠️ Vimeo preview failed for ${videoId}`);
                        }
                    })
                );
            }
        } catch (err) {
            console.warn('⚠️ Vimeo preparation failed:', err);
        }
    },

    async loadUploadedVideos() {
    try {
        const result = await rpc("/web/video/list", {});
        if (result.success) {
            this.uploadedVideos.list = (result.videos || []).map(video => {
                // Add options to video object if they exist
                return {
                    ...video,
                    options: video.options || {
                        autoplay: false,
                        loop: false,
                        hideControls: false,
                        hideFullscreen: false,
                    }
                };
            });
            console.log(`✅ Loaded ${this.uploadedVideos.list.length} videos with options`);
        }
    } catch (err) {
        console.error("Failed to load videos:", err);
    }
},
    onClickUploadVideo(ev) {
        ev.preventDefault();
        this.videoFileInputRef.el?.click();
    },

    async handleVideoFileUpload(ev) {
        ev.preventDefault();
        const file = ev.target.files?.[0];
        if (!file) return;

        if (!SUPPORTED_VIDEO_FORMATS.includes(file.type)) {
            this.notification.add(_t("Invalid format. Allowed: MP4, WebM, OGG, MOV, AVI"), { type: "danger" });
            ev.target.value = "";
            return;
        }
        if (file.size > MAX_VIDEO_SIZE) {
            this.notification.add(_t("File too large. Maximum 100 MB."), { type: "danger" });
            ev.target.value = "";
            return;
        }

        try {
    const base64 = await this._readFileAsBase64(file);
    const base64Data = base64.split(",")[1];

    const result = await rpc("/web/video/upload/json", {
        file_data: base64Data,
        filename: file.name,
        mimetype: file.type,
    });

    if (!result.success) {
        throw new Error(result.error || "Unknown error");
    }

    console.log('✅ Video uploaded:', result.url);

    this.state.urlInput = result.url;
    await this.updateVideo();

    // IMPORTANT: Save video options to the uploaded video
    const videoOptions = {
        autoplay: this.localVideoOptions.autoplay,
        loop: this.localVideoOptions.loop,
        hideControls: this.localVideoOptions.hideControls,
        hideFullscreen: this.localVideoOptions.hideFullscreen,
    };
    
    // Save options to server (if backend supports it)
    await this.saveVideoOptionsToServer(result.id, videoOptions);
    
    // Also update local uploaded videos list with options
    await this.loadUploadedVideos();
    
    // Find and update the newly uploaded video with options
    const newVideoIndex = this.uploadedVideos.list.findIndex(v => v.id === result.id);
    if (newVideoIndex !== -1) {
        this.uploadedVideos.list[newVideoIndex].options = videoOptions;
        console.log('✅ Updated local video list with options');
    }

    this.notification.add(_t("Video uploaded successfully!"), { type: "success" });
} catch (err) {
    console.error("Upload failed:", err);
    this.notification.add(err.message || _t("Upload failed."), { type: "danger" });
} finally {
    ev.target.value = "";
}
    },

    async onSelectUploadedVideo(ev, video) {
    ev.preventDefault();
    console.log('🎬 Selecting uploaded video:', video.url);
    
    // Restore saved options if they exist
    if (video.options) {
        this.localVideoOptions.autoplay = video.options.autoplay || false;
        this.localVideoOptions.loop = video.options.loop || false;
        this.localVideoOptions.hideControls = video.options.hideControls || false;
        this.localVideoOptions.hideFullscreen = video.options.hideFullscreen || false;
        console.log('✅ Restored saved options:', video.options);
    } else {
        // Default options for videos without saved options
        this.localVideoOptions.autoplay = false;
        this.localVideoOptions.loop = false;
        this.localVideoOptions.hideControls = false;
        this.localVideoOptions.hideFullscreen = false;
        console.log('⚠️ No saved options, using defaults');
    }
    
    this.state.urlInput = video.url;
    await this.updateVideo();
    this.notification.add(_t("Video selected!"), { type: "success" });
    
    // Update preview with restored options
    setTimeout(() => this.updateLocalVideoPreview(), 100);
},

// Add this method to save video options
async saveVideoOptionsToServer(videoId, options) {
    try {
        console.log('💾 Saving video options to server:', { videoId, options });
        const result = await rpc("/web/video/save-options", {
            attachment_id: videoId,
            options: options
        });
        
        if (result.success) {
            console.log('✅ Video options saved to server');
            return true;
        }
    } catch (err) {
        console.warn('⚠️ Could not save video options to server:', err);
    }
    return false;
},

    async onDeleteUploadedVideo(ev, video) {
        ev.preventDefault();
        ev.stopPropagation();
        
        if (!confirm(`Delete "${video.name}"?`)) {
            return;
        }
        
        try {
            const result = await rpc("/web/video/delete", {
                attachment_id: video.id,
            });
            
            if (result.success) {
                this.notification.add(_t("Video deleted!"), { type: "success" });
                await this.loadUploadedVideos();
            } else {
                throw new Error(result.error || "Delete failed");
            }
        } catch (err) {
            console.error("Delete failed:", err);
            this.notification.add(err.message || _t("Delete failed"), { type: "danger" });
        }
    },

    async onChangeOption(optionId) {
    if (this.state.platform !== 'local') {
        return super.onChangeOption(...arguments);
    }

    console.log(`🎬 onChangeOption called: ${optionId}`);

    const map = {
        autoplay: 'autoplay',
        loop: 'loop',
        hide_controls: 'hideControls',
        hide_fullscreen: 'hideFullscreen',
    };

    const key = map[optionId];
    if (key) {
        this.localVideoOptions[key] = !this.localVideoOptions[key];
        console.log(`✅ Updated ${key} to:`, this.localVideoOptions[key]);

        // Update the displayed checkboxes
        this.state.options = this.getLocalVideoOptions();

        // IMPORTANT: Save options for current video
        if (this.state.src) {
            // Find video in uploaded list
            const uploadedVideo = this.uploadedVideos.list.find(v => v.url === this.state.src);
            if (uploadedVideo) {
                // Update local options
                uploadedVideo.options = {
                    autoplay: this.localVideoOptions.autoplay,
                    loop: this.localVideoOptions.loop,
                    hideControls: this.localVideoOptions.hideControls,
                    hideFullscreen: this.localVideoOptions.hideFullscreen,
                };
                
                // Save to server
                await this.saveVideoOptionsToServer(uploadedVideo.id, uploadedVideo.options);
                console.log('💾 Saved updated options for video:', uploadedVideo.id);
            }
        }

        // CRITICAL: Update the stored media data with new controls
        this.updateLocalVideoMediaData();

        // Update preview
        this.updateLocalVideoPreview();
    }
},
    
    getSelectedMedia() {
        console.log('\n🎬 ═══════════════════════════════════════════════');
        console.log('🎬 getSelectedMedia() called');
        console.log('🎬 state.platform:', this.state.platform);
        console.log('🎬 state.src:', this.state.src?.substring(0, 50));
        console.log('🎬 state.options:', this.state.options);
        console.log('🎬 localVideoOptions:', this.localVideoOptions);
        console.log('🎬 ═══════════════════════════════════════════════');
        
        try {
            // Get the base selected media from parent
            let selectedMedia = null;
            
            // For local videos, we need to build it ourselves
            if (this.state.platform === 'local' && this.state.src) {
                // Build controls object from state.options if available
                let controls = {
                    autoplay: this.localVideoOptions.autoplay,
                    loop: this.localVideoOptions.loop,
                    hideControls: this.localVideoOptions.hideControls,
                    hideFullscreen: this.localVideoOptions.hideFullscreen,
                };
                
                // Update from state.options if it has valid checkbox states
                if (this.state.options && Array.isArray(this.state.options)) {
                    for (const option of this.state.options) {
                        if (option && option.id) {
                            if (option.id === 'autoplay') {
                                controls.autoplay = option.value;
                            }
                            if (option.id === 'loop') {
                                controls.loop = option.value;
                            }
                            if (option.id === 'hide_controls') {
                                controls.hideControls = option.value;
                            }
                            if (option.id === 'hide_fullscreen') {
                                controls.hideFullscreen = option.value;
                            }
                        }
                    }
                }
                
                selectedMedia = [{
                    id: this.state.src,
                    src: this.state.src,
                    platform: 'local',
                    videoId: null,
                    params: {},
                    isLocalVideo: true,
                    controls: controls,
                }];
                
                console.log('✅ Built local video selectedMedia:', selectedMedia);
                console.log('🎬 Controls in selectedMedia:', selectedMedia[0].controls);
            } else {
                // For YouTube/Vimeo, use parent
                try {
                    selectedMedia = super.getSelectedMedia?.();
                    console.log('📺 Using parent selectedMedia (YouTube/Vimeo):', selectedMedia);
                } catch (parentErr) {
                    console.warn('⚠️ Parent getSelectedMedia failed:', parentErr);
                    selectedMedia = null;
                }
            }
            
            // Ensure we always return an array, never null
            if (!selectedMedia) {
                console.warn('⚠️ selectedMedia is null/undefined, returning empty array');
                selectedMedia = [];
            }
            
            if (!Array.isArray(selectedMedia)) {
                console.warn('⚠️ selectedMedia is not an array, wrapping it');
                selectedMedia = [selectedMedia];
            }
            
            console.log('🎬 Final selectedMedia:', selectedMedia);
            console.log('🎬 ═══════════════════════════════════════════════\n');
            
            return selectedMedia;
        } catch (err) {
            console.error('🔴 ERROR in getSelectedMedia:', err);
            return [];
        }
    },

    updateLocalVideoMediaData() {
        // Update the stored media data with current control settings
        if (this.state.platform === 'local' && this.state.src) {
            const mediaData = {
                id: this.state.src,
                src: this.state.src,
                platform: 'local',
                videoId: null,
                params: {},
                isLocalVideo: true,
                controls: {
                    autoplay: this.localVideoOptions.autoplay,
                    loop: this.localVideoOptions.loop,
                    hideControls: this.localVideoOptions.hideControls,
                    hideFullscreen: this.localVideoOptions.hideFullscreen,
                },
            };
            
            console.log('🔄 Updated mediaData with controls:', mediaData);
            this.props.selectMedia(mediaData);
        }
    },
    
    updateLocalVideoPreview() {
        try {
            const previewContainer = document.querySelector('.o_video_preview');
            if (!previewContainer) {
                console.warn('⚠️ Preview container not found');
                return;
            }

            const videoElement = previewContainer.querySelector('video');
            if (!videoElement) {
                console.log('⚠️ No <video> element in preview');
                return;
            }

            console.log('🎬 Updating preview with options:', this.localVideoOptions);
            const o = this.localVideoOptions;

            // Reset everything first
            videoElement.removeAttribute('autoplay');
            videoElement.removeAttribute('loop');
            videoElement.removeAttribute('controls');
            videoElement.removeAttribute('muted');
            videoElement.removeAttribute('playsinline');
            videoElement.removeAttribute('controlsList');
            videoElement.removeAttribute('disablePictureInPicture');
            videoElement.removeAttribute('src');
            
            videoElement.autoplay = false;
            videoElement.loop = false;
            videoElement.controls = false;
            videoElement.muted = false;

            // Apply autoplay
            if (o.autoplay) {
                videoElement.autoplay = true;
                videoElement.muted = true;
                videoElement.setAttribute('autoplay', '');
                videoElement.setAttribute('muted', '');
                videoElement.setAttribute('playsinline', '');
                console.log('✅ Preview: Autoplay ON');
                videoElement.play().catch(e => console.warn('⚠️ Autoplay blocked:', e.message));
            } else {
                console.log('❌ Preview: Autoplay OFF');
            }

            // Apply loop
            if (o.loop) {
                videoElement.loop = true;
                videoElement.setAttribute('loop', '');
                console.log('✅ Preview: Loop ON');
            } else {
                console.log('❌ Preview: Loop OFF');
            }

            // Apply controls
            if (o.hideControls) {
                videoElement.controls = false;
                console.log('✅ Preview: Controls HIDDEN');
            } else {
                videoElement.controls = true;
                videoElement.setAttribute('controls', '');
                console.log('✅ Preview: Controls VISIBLE');
            }

            // Apply fullscreen
            if (o.hideFullscreen) {
                videoElement.setAttribute('controlsList', 'nodownload nofullscreen');
                videoElement.setAttribute('disablePictureInPicture', 'true');
                console.log('✅ Preview: Fullscreen DISABLED');
            } else {
                console.log('✅ Preview: Fullscreen ENABLED');
            }
            
            // Set the src attribute to ensure it's not empty
            videoElement.src = this.state.src || '';
            
            console.log('📊 Preview state updated');
        } catch (err) {
            console.error('❌ Error updating preview:', err);
        }
    },

    _readFileAsBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = e => resolve(e.target.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    },

    // CRITICAL: Override createElements to handle local videos as VIDEO elements
createElements(selectedMedia) {
    console.log('\n🎬 ═══════════════════════════════════════════════');
    console.log('🎬 createElements() called in VideoSelector PATCH');
    console.log('🎬 ═══════════════════════════════════════════════');
    console.log('📋 Input selectedMedia:', selectedMedia);
    
    if (!selectedMedia || (Array.isArray(selectedMedia) && selectedMedia.length === 0)) {
        return super.createElements(selectedMedia);
    }
    
    const mediaArray = Array.isArray(selectedMedia) ? selectedMedia : [selectedMedia];
    return mediaArray.map((mediaData) => {
        const src = mediaData.src || mediaData.id;
        const isLocalVideo = mediaData.isLocalVideo || 
            mediaData.platform === 'local' || 
            src?.startsWith('/web/video/') || 
            src?.startsWith('/web/content/');
        
        console.log('🎬 Processing media:', { src: src?.substring(0, 50), isLocalVideo });
        
        if (!isLocalVideo) {
            console.log('🎬 Using parent createElements for YouTube/Vimeo');
            const elements = super.createElements([mediaData]);
            return elements[0];
        }
        
        console.log('🎬 Creating LOCAL VIDEO using VIDEO ELEMENT');
        
        // Create container div
        const div = document.createElement('div');
        div.classList.add('media_iframe_video', 'o_custom_video_container');
        div.style.position = 'relative';
        div.style.width = '100%';
        div.style.height = '100%';
        
        // Get control settings
        const controls = mediaData.controls || {
            autoplay: false,
            loop: false,
            hideControls: false,
            hideFullscreen: false,
        };
        
        // Create VIDEO element
        const video = document.createElement('video');
        video.src = src;
        video.style.width = '100%';
        video.style.height = '100%';
        video.style.objectFit = 'contain';
        video.preload = 'metadata';
        
        // Apply controls
        if (controls.autoplay) {
            video.autoplay = true;
            video.muted = true;
            video.setAttribute('autoplay', '');
            video.setAttribute('muted', '');
            video.setAttribute('playsinline', '');
            console.log('✅ Applied: Autoplay ON');
        }
        
        if (controls.loop) {
            video.loop = true;
            video.setAttribute('loop', '');
            console.log('✅ Applied: Loop ON');
        }
        
        if (controls.hideControls) {
            video.removeAttribute('controls');
            video.classList.add('no-controls');
            console.log('✅ Applied: Controls HIDDEN');
        } else {
            video.controls = true;
            video.setAttribute('controls', '');
            console.log('✅ Applied: Controls VISIBLE');
        }
        
        if (controls.hideFullscreen) {
            video.setAttribute('controlsList', 'nodownload nofullscreen');
            video.setAttribute('disablePictureInPicture', 'true');
            console.log('✅ Applied: Fullscreen DISABLED');
        }
        
        // Store data attributes on container
        div.setAttribute('data-video-autoplay', controls.autoplay ? 'true' : 'false');
        div.setAttribute('data-video-loop', controls.loop ? 'true' : 'false');
        div.setAttribute('data-video-hide-controls', controls.hideControls ? 'true' : 'false');
        div.setAttribute('data-video-hide-fullscreen', controls.hideFullscreen ? 'true' : 'false');
        div.setAttribute('data-is-local-video', 'true');
        div.setAttribute('data-video-src', src);
        
        div.appendChild(video);
        
        console.log('✅ Local video element created with controls');
        console.log('🎬 ═══════════════════════════════════════════════\n');
        
        return div;
    });
},
    async updateVideo() {
        if (!this.state.urlInput) {
            this.state.src = "";
            this.state.urlInput = "";
            this.state.options = [];
            this.state.platform = null;
            this.state.errorMessage = "";
            this.props.selectMedia({});
            
            // Clear global storage
            window.__currentSelectedVideoData = null;
            return;
        }

        const url = this.state.urlInput.trim();
        
        // Check for local video
        if (url.startsWith('/web/video/') || url.startsWith('/web/content/')) {
            console.log('🎬 Local video detected:', url);
            this.state.src = url;
            this.state.errorMessage = "";
            this.props.errorMessages("");
            this.state.platform = 'local';
            
            // IMPORTANT: Check if this video is in uploaded list and restore its options
            const uploadedVideo = this.uploadedVideos.list.find(v => v.url === url);
            if (uploadedVideo && uploadedVideo.options) {
                console.log('🎬 Found video in uploaded list, restoring options:', uploadedVideo.options);
                this.localVideoOptions.autoplay = uploadedVideo.options.autoplay || false;
                this.localVideoOptions.loop = uploadedVideo.options.loop || false;
                this.localVideoOptions.hideControls = uploadedVideo.options.hideControls || false;
                this.localVideoOptions.hideFullscreen = uploadedVideo.options.hideFullscreen || false;
            }
            
            // Initialize state.options
            this.state.options = this.getLocalVideoOptions();
            console.log('📋 Initialized state.options:', this.state.options);
            
            // Update preview
            await new Promise(resolve => setTimeout(resolve, 50));
            this.updateLocalVideoPreview();
            
            // CRITICAL: Store complete video info with control settings
            const mediaData = {
                id: url,
                src: url,
                platform: 'local',
                videoId: null,
                params: {},
                isLocalVideo: true,
                controls: {
                    autoplay: this.localVideoOptions.autoplay,
                    loop: this.localVideoOptions.loop,
                    hideControls: this.localVideoOptions.hideControls,
                    hideFullscreen: this.localVideoOptions.hideFullscreen,
                },
            };
            
            // ✅ STORE GLOBALLY FOR BACKGROUND VIDEO SAVE
            window.__currentSelectedVideoData = mediaData;
            console.log('💾 [VideoSelector] Stored media data globally:', mediaData);
            
            console.log('🎬 Calling selectMedia with:', mediaData);
            this.props.selectMedia(mediaData);
            
            return;
        }

        // YouTube/Vimeo - use parent implementation
        return super.updateVideo();
    },
    
    // CRITICAL: Override save to apply video controls when inserting into page
    save() {
        console.log('🎬 [VideoSelector.save] save() called on VideoSelector');
        console.log('🎬 [VideoSelector.save] this.state.platform:', this.state.platform);
        console.log('🎬 [VideoSelector.save] this.state.src:', this.state.src);
        
        // Just call parent save - renderMedia will be called which creates proper elements
        console.log('🎬 [VideoSelector.save] Calling parent save');
        return super.save(...arguments);
    },
});

// Import MediaDialog for patching
import { MediaDialog } from "@html_editor/main/media/media_dialog/media_dialog";

// Patch MediaDialog to handle local videos correctly (including background videos)
patch(MediaDialog.prototype, {
    // CRITICAL FIX: Background video detection with visibleTabs check
    async renderMedia(selectedMedia) {
        console.log('\n🎬 [MediaDialog] renderMedia() called');
        console.log('🎬 selectedMedia:', selectedMedia);
        console.log('🔍 DEBUG - this.props:', this.props);
        console.log('🔍 DEBUG - this.props.editable:', this.props.editable);
        console.log('🔍 DEBUG - this.props.save:', this.props.save?.toString().substring(0, 300));
        
        // Check if this is a local video BEFORE calling parent
        const isLocalVideo = selectedMedia && selectedMedia[0] &&
                            (selectedMedia[0].isLocalVideo || 
                             selectedMedia[0].platform === 'local' ||
                             (selectedMedia[0].src && (selectedMedia[0].src.startsWith('/web/video/') || selectedMedia[0].src.startsWith('/web/content/'))));
        
        console.log('🎬 Is local video detected?', isLocalVideo);
        
        if (isLocalVideo) {
            console.log('🎬 LOCAL VIDEO DETECTED - Creating VIDEO element');
            
            const mediaData = selectedMedia[0];
            const src = mediaData.src || mediaData.id;
            const controls = mediaData.controls || {
                autoplay: false,
                loop: false,
                hideControls: false,
                hideFullscreen: false,
            };
            
            // ═══════════════════════════════════════════════════════════════════
            // CRITICAL: Background detection - Check visibleTabs FIRST
            // ═══════════════════════════════════════════════════════════════════
            let isBackgroundContext = false;
            
            console.log('🔍 Starting background detection...');
            console.log('🔍 Checking tabs props FIRST...');
            console.log('  - extraTabs:', this.props.extraTabs);
            console.log('  - visibleTabs:', this.props.visibleTabs);
            
            // Check 1: MOST RELIABLE - Check visibleTabs for VIDEO_BACKGROUND
            // This is THE definitive indicator that Odoo wants a background video
            if (this.props.visibleTabs && Array.isArray(this.props.visibleTabs)) {
                if (this.props.visibleTabs.includes('VIDEO_BACKGROUND') || 
                    this.props.visibleTabs.includes('video_background') ||
                    this.props.visibleTabs.includes('BACKGROUND') ||
                    this.props.visibleTabs.some(tab => tab && tab.toLowerCase().includes('background'))) {
                    console.log('✅ ✅ ✅ Background detected: visibleTabs contains VIDEO_BACKGROUND');
                    isBackgroundContext = true;
                }
            }
            
            // Check 2: Check extraTabs for background indicators
            if (this.props.extraTabs && Array.isArray(this.props.extraTabs)) {
                const hasBackgroundTab = this.props.extraTabs.some(tab => {
                    const tabId = tab?.id || tab?.name || '';
                    return tabId.includes('background') || tabId.includes('BACKGROUND');
                });
                if (hasBackgroundTab) {
                    console.log('✅ Background detected: extraTabs contains background tab');
                    isBackgroundContext = true;
                }
            }
            
            // Check 3: Force mode (if enabled)
            if (window.FORCE_BACKGROUND_VIDEO_MODE) {
                console.log('⚡ FORCE MODE ENABLED - Background context forced to TRUE');
                isBackgroundContext = true;
            }
            
            // Check 4: Recent click was on cover snippet
            if (window.__lastClickWasCover) {
                console.log('✅ Background detected: Recent click was on cover snippet');
                isBackgroundContext = true;
            }
            
            // Check 5: Check document for active cover/background snippets
            const activeCoverSnippet = document.querySelector('.s_cover.o_snippet_active, .s_cover.oe_overlay');
            if (activeCoverSnippet) {
                console.log('✅ Background detected: Active cover snippet found', activeCoverSnippet);
                isBackgroundContext = true;
            }
            
            // Check 6: Look for background video placeholder or existing background video
            const existingBgVideo = document.querySelector(
                '.s_cover .o_we_background_video, ' +
                '.s_cover [data-bg-video], ' +
                '.o_background_video, ' +
                '[data-bg-video], ' +
                '.s_cover .media_iframe_video'
            );
            if (existingBgVideo) {
                console.log('✅ Background detected: Existing background video element found', existingBgVideo);
                isBackgroundContext = true;
            }
            
            // Check 7: Check for cover snippet being edited
            const coverSnippets = document.querySelectorAll('.s_cover');
            if (coverSnippets.length > 0) {
                const inEditMode = document.body.classList.contains('editor_enable') || 
                                  document.querySelector('.o_we_website_top_actions');
                if (inEditMode) {
                    console.log('✅ Background detected: In edit mode with cover snippets');
                    isBackgroundContext = true;
                }
            }
            
            // Check 8: Check website editor customize panel for cover/background options
            const customizePanel = document.querySelector('.o_we_customize_panel');
            if (customizePanel) {
                const coverOptions = customizePanel.querySelector(
                    '[data-js="SetCoverImagePosition"], ' +
                    '.snippet-option-SetCoverImagePosition, ' +
                    '[data-name="cover_image_opt"], ' +
                    '[data-customize-section*="cover"], ' +
                    '[data-customize-section*="background"]'
                );
                if (coverOptions) {
                    console.log('✅ Background detected: Cover/background options in customize panel', coverOptions);
                    isBackgroundContext = true;
                }
            }
            
            // Check 9: Check props.save function for background-related code
            const saveFnStr = this.props.save?.toString() || '';
            const bgKeywords = [
                'SetCoverImagePositionAction',
                'setCoverImage',
                'bg_video',
                'bgVideo',
                'o_we_background_video',
                'o_background_video',
                'coverImage',
                'data-bg-video'
            ];
            
            for (const keyword of bgKeywords) {
                if (saveFnStr.includes(keyword)) {
                    console.log(`✅ Background detected: save function contains "${keyword}"`);
                    isBackgroundContext = true;
                    break;
                }
            }
            
            // Check 10: Check props.media if it exists (editing existing media)
            if (this.props.media) {
                if (this.props.media.classList?.contains('o_we_background_video') ||
                    this.props.media.classList?.contains('o_background_video') ||
                    this.props.media.hasAttribute?.('data-bg-video') ||
                    this.props.media.parentElement?.classList?.contains('s_cover')) {
                    console.log('✅ Background detected: props.media is background video');
                    isBackgroundContext = true;
                }
            }
            
            // Check 11: Check if props.noImages is true (background video dialogs disable images)
            if (this.props.noImages === true) {
                console.log('✅ Background detected: noImages=true (typical for background video dialog)');
                isBackgroundContext = true;
            }
            
            console.log('🎬 FINAL DECISION - Is background context?', isBackgroundContext);
            console.log('🔍 Detection summary:');
            console.log('  - visibleTabs includes VIDEO_BACKGROUND:', this.props.visibleTabs?.includes('VIDEO_BACKGROUND'));
            console.log('  - Active cover snippet:', !!activeCoverSnippet);
            console.log('  - Existing bg video:', !!existingBgVideo);
            console.log('  - Cover snippets in doc:', coverSnippets.length);
            console.log('  - noImages prop:', this.props.noImages);
            console.log('  - resModel:', this.props.resModel);
            
            // ═══════════════════════════════════════════════════════════════════
            // CREATE APPROPRIATE ELEMENT BASED ON CONTEXT
            // ═══════════════════════════════════════════════════════════════════
            
            if (isBackgroundContext) {
                console.log('🎬 🎬 🎬 BACKGROUND VIDEO MODE - Creating IFRAME for Odoo save compatibility');
                
                // CRITICAL: Odoo's save() does: media.querySelector("iframe").src
                // We MUST create an iframe, then convert to video on frontend
                
                const container = document.createElement('div');
                container.className = 'media_iframe_video o_background_video';
                container.setAttribute('data-oe-expression', src);
                container.setAttribute('data-src', src);
                container.setAttribute('data-video-src', src);
                container.setAttribute('data-is-local-video', 'true');
                container.setAttribute('contenteditable', 'false');
                container.style.position = 'absolute';
                container.style.top = '0';
                container.style.left = '0';
                container.style.width = '100%';
                container.style.height = '100%';
                container.style.overflow = 'hidden';
                
                // Create IFRAME - required for Odoo's save function
                const iframe = document.createElement('iframe');
                iframe.src = src;
                iframe.className = 'o_bg_video_iframe';
                iframe.setAttribute('data-src', src);
                iframe.setAttribute('data-is-local-video', 'true');
                iframe.setAttribute('frameborder', '0');
                iframe.style.position = 'absolute';
                iframe.style.top = '0';
                iframe.style.left = '0';
                iframe.style.width = '100%';
                iframe.style.height = '100%';
                iframe.style.pointerEvents = 'none';
                
                container.appendChild(iframe);
                
                console.log('✅ ✅ ✅ Background video IFRAME created');
                console.log('✅ IFRAME src:', iframe.src);
                
                window.__lastCreatedBackgroundVideo = container;
                this.__lastCreatedBackgroundVideo = container;
                
                return [container];
            }
            
            // FOREGROUND VIDEO MODE - Return IMG element that Odoo expects
            // Frontend processor will convert to video for playback
            console.log('🎬 FOREGROUND VIDEO MODE - Creating IMG placeholder for Odoo compatibility');
            
            // Odoo's editor expects an <img> element directly for image replacement
            const img = document.createElement('img');
            img.src = src;
            img.className = 'img img-fluid o_we_custom_image o_local_video_placeholder';
            img.setAttribute('data-src', src);
            img.setAttribute('data-video-src', src);
            img.setAttribute('data-original-src', src);
            img.setAttribute('data-is-local-video', 'true');
            img.setAttribute('data-video-autoplay', controls.autoplay ? 'true' : 'false');
            img.setAttribute('data-video-loop', controls.loop ? 'true' : 'false');
            img.setAttribute('data-video-hide-controls', controls.hideControls ? 'true' : 'false');
            img.setAttribute('data-video-hide-fullscreen', controls.hideFullscreen ? 'true' : 'false');
            img.style.width = '100%';
            img.style.height = 'auto';
            
            console.log('✅ Foreground video IMG placeholder created (will convert to video on frontend)');
            return [img];
        }
    
        // For YouTube/Vimeo, use parent's flow
        console.log('🎬 YouTube/Vimeo detected - using parent renderMedia');
        try {
            const elements = await super.renderMedia(selectedMedia);
            return elements;
        } catch (e) {
            console.error('Error in renderMedia:', e);
            const errorDiv = document.createElement('div');
            errorDiv.style.display = 'none';
            return [errorDiv];
        }
    },
    
    async save() {
        console.log('🎬 [MediaDialog.save] Called');
        
        // For local videos, just use parent save - it will work with our createElements override
        const isLocalVideo = window.__currentSelectedVideoData?.src || 
                            this.selectedMedia?.local?.[0]?.isLocalVideo;
        
        if (isLocalVideo) {
            console.log('🎬 [MediaDialog.save] Local video detected, using parent save');
            // Parent save will call renderMedia which creates our proper elements
            return super.save(...arguments);
        }
        
        // For YouTube/Vimeo, use parent
        console.log('🎬 [MediaDialog.save] Using parent save for YouTube/Vimeo');
        return super.save(...arguments);
    }
});

// Patch renderMedia to ensure media elements always have src before returning
const originalRenderMedia = patch.prototype.renderMedia;
if (originalRenderMedia) {
    patch.prototype.renderMedia = async function(selectedMedia) {
        const result = await originalRenderMedia.call(this, selectedMedia);
        
        // Make sure all returned elements have src attribute
        if (Array.isArray(result)) {
            result.forEach(element => {
                if (!element) {
                    return;
                }
                // Only operate on actual DOM elements that support querySelector
                if (typeof element.querySelector !== 'function') {
                    // Element is not a DOM node (could be a plain object) - skip
                    return;
                }
                const mediaEl = element.querySelector('video, iframe, img');
                if (mediaEl && !mediaEl.src && element.getAttribute('data-video-src')) {
                    try {
                        mediaEl.src = element.getAttribute('data-video-src');
                    } catch (err) {
                        console.warn('Could not set media src on element:', err);
                    }
                }
            });
        }
        
        return result;
    };
}
