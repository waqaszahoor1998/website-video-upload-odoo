/** @odoo-module **/

/**
 * Frontend Video Processor
 * Applies video controls based on data attributes when page loads
 */

// Suppress Odoo's SetCoverImagePositionAction errors for our video elements
window.addEventListener('error', function(e) {
    if (e.message && (e.message.includes("Cannot read properties of null (reading 'src')") || 
                      e.message.includes("Cannot read property 'src' of null"))) {
        // Check if this is from our video wrapper
        if (document.querySelector('[data-is-local-video-wrapper="true"]') ||
            document.querySelector('.o_custom_video_container[data-is-local-video="true"]')) {
            console.warn('⚠️ Suppressing Odoo cover image error for local videos');
            e.preventDefault();
            return true;
        }
    }
}, true);

// Also handle unhandled promise rejections
window.addEventListener('unhandledrejection', function(e) {
    if (e.reason && e.reason.message && 
        (e.reason.message.includes("Cannot read properties of null (reading 'src')") ||
         e.reason.message.includes("Cannot read property 'src' of null"))) {
        console.warn('⚠️ Suppressing unhandled promise rejection for local videos');
        e.preventDefault();
    }
});

export function processLocalVideos() {
    console.log('🎬 Video Frontend Processor Loaded');
    
    // Check if in editor mode - but still process background videos
    const isEditorMode = document.body.classList.contains('editor_enable') ||
                         document.body.classList.contains('o_website_preview') ||
                         document.querySelector('.o_we_website_top_actions') ||
                         document.querySelector('.oe_overlay') ||
                         document.querySelector('#oe_snippets');
    
    if (isEditorMode) {
        console.log('🎬 Editor mode detected - processing background videos only');
        // Process background video iframes even in editor
        processBackgroundVideoIframes();
    }
    
    // Find all local video containers
    const videoContainers = document.querySelectorAll('.o_custom_video_container[data-is-local-video="true"]');
    console.log(`🎬 Found ${videoContainers.length} local video containers`);
    
    videoContainers.forEach((container) => {
        const video = container.querySelector('video');
        if (!video) {
            console.warn('⚠️ No video element found in container');
            return;
        }
        
        console.log('🎬 Processing video container');
        
        // Read control settings from data attributes
        const autoplay = container.getAttribute('data-video-autoplay') === 'true';
        const loop = container.getAttribute('data-video-loop') === 'true';
        const hideControls = container.getAttribute('data-video-hide-controls') === 'true';
        const hideFullscreen = container.getAttribute('data-video-hide-fullscreen') === 'true';
        
        console.log('🎬 Control settings:', { autoplay, loop, hideControls, hideFullscreen });
        
        // Apply autoplay
        if (autoplay) {
            video.autoplay = true;
            video.muted = true;
            video.setAttribute('autoplay', '');
            video.setAttribute('muted', '');
            video.setAttribute('playsinline', '');
            console.log('✅ Applied: Autoplay ON');
        }
        
        // Apply loop
        if (loop) {
            video.loop = true;
            video.setAttribute('loop', '');
            console.log('✅ Applied: Loop ON');
        }
        
        // Apply controls visibility
        if (hideControls) {
            video.controls = false;
            video.removeAttribute('controls');
            video.classList.add('no-controls');
            console.log('✅ Applied: Controls HIDDEN');
        } else {
            video.controls = true;
            video.setAttribute('controls', '');
            video.classList.remove('no-controls');
            console.log('✅ Applied: Controls VISIBLE');
        }
        
        // Apply fullscreen restriction
        if (hideFullscreen) {
            video.setAttribute('controlsList', 'nodownload nofullscreen');
            video.setAttribute('disablePictureInPicture', 'true');
            console.log('✅ Applied: Fullscreen DISABLED');
        } else {
            video.removeAttribute('controlsList');
            video.removeAttribute('disablePictureInPicture');
            console.log('✅ Applied: Fullscreen ENABLED');
        }
        
        console.log('✅ Video processing complete');
    });
    
    // ═══════════════════════════════════════════════════════════════════
    // Process background videos - Convert img with video src to video element
    // ═══════════════════════════════════════════════════════════════════
    
    // Process ALL iframes - check if they contain local video URLs
    const allIframes = document.querySelectorAll('iframe');
    console.log(`🎬 Checking ${allIframes.length} iframes for local videos`);
    
    allIframes.forEach((iframe) => {
        const src = iframe.src || iframe.getAttribute('data-src') || '';
        
        // Check if it's a local video URL
        const isLocalVideo = src.includes('/web/video/') || src.includes('/web/content/');
        const videoExtensions = ['.webm', '.mp4', '.ogg', '.mov', '.avi'];
        const isVideoFile = videoExtensions.some(ext => src.includes(ext));
        
        if (isLocalVideo || isVideoFile) {
            console.log('🎬 Found iframe with local video, converting:', src);
            
            // Clean the src (remove any query params like &enablejsapi=1)
            let cleanSrc = src.split('&')[0].split('?')[0];
            if (!cleanSrc.includes('.mp4') && !cleanSrc.includes('.webm')) {
                cleanSrc = src;
            }
            
            // Get parent container to read control settings
            const container = iframe.closest('.media_iframe_video, .o_custom_video_container');
            
            // Read control settings from container data attributes
            let autoplay = false;
            let loop = false;
            let hideControls = false;
            let hideFullscreen = false;
            let isBackground = false;
            
            if (container) {
                autoplay = container.getAttribute('data-video-autoplay') === 'true';
                loop = container.getAttribute('data-video-loop') === 'true';
                hideControls = container.getAttribute('data-video-hide-controls') === 'true';
                hideFullscreen = container.getAttribute('data-video-hide-fullscreen') === 'true';
                isBackground = container.classList.contains('o_background_video');
            }
            
            // Also check if iframe itself has background class
            if (iframe.classList.contains('o_bg_video_iframe')) {
                isBackground = true;
            }
            
            // Check parent elements for background indicators
            const parentSection = iframe.closest('.s_cover, [data-bg-video-src], .o_we_bg_filter');
            if (parentSection) {
                isBackground = true;
            }
            
            // Background videos always have specific settings
            if (isBackground) {
                autoplay = true;
                loop = true;
                hideControls = true;
                hideFullscreen = true;
                console.log('🎬 Background video detected - forcing background settings');
            }
            
            console.log('🎬 Video settings:', { autoplay, loop, hideControls, hideFullscreen, isBackground });
            
            const video = document.createElement('video');
            video.src = cleanSrc;
            video.className = iframe.className;
            video.style.cssText = iframe.style.cssText;
            video.setAttribute('data-src', cleanSrc);
            video.setAttribute('data-is-local-video', 'true');
            video.style.width = '100%';
            video.style.height = '100%';
            video.preload = 'metadata';
            
            // Apply autoplay
            if (autoplay) {
                video.autoplay = true;
                video.muted = true;  // Required for autoplay
                video.setAttribute('autoplay', '');
                video.setAttribute('muted', '');
                video.setAttribute('playsinline', '');
            }
            
            // Apply loop
            if (loop) {
                video.loop = true;
                video.setAttribute('loop', '');
            }
            
            // Apply controls
            if (hideControls) {
                video.controls = false;
                video.removeAttribute('controls');
            } else {
                video.controls = true;
                video.setAttribute('controls', '');
            }
            
            // Apply fullscreen restriction
            if (hideFullscreen) {
                video.setAttribute('controlsList', 'nodownload nofullscreen');
                video.setAttribute('disablePictureInPicture', 'true');
            }
            
            // Object fit based on context
            video.style.objectFit = isBackground ? 'cover' : 'contain';
            
            iframe.replaceWith(video);
            console.log('✅ Converted iframe to video element with controls:', !hideControls);
            
            // Try to play if autoplay
            if (autoplay) {
                video.play().catch(e => console.log('Autoplay blocked, user interaction needed'));
            }
        }
    });
    
    const bgVideoImages = document.querySelectorAll('img.o_we_background_video[data-is-local-video="true"]');
    console.log(`🎬 Found ${bgVideoImages.length} background video images to convert`);
    
    bgVideoImages.forEach((img) => {
        console.log('🎬 Converting background video img to actual video element');
        console.log('🎬 IMG src:', img.src);
        
        // Only process if src ends with video extension
        const videoExtensions = ['.webm', '.mp4', '.ogg', '.mov', '.avi'];
        const isVideoFile = videoExtensions.some(ext => img.src.endsWith(ext) || img.src.includes(ext + '?'));
        
        if (!isVideoFile) {
            console.log('⚠️ Image src is not a video file, skipping:', img.src);
            return;
        }
        
        console.log('✅ Image is a video file, converting...');
        
        // Get the parent cover section
        const coverSection = img.closest('.s_cover, [data-bg-image-src]');
        if (!coverSection) {
            console.warn('⚠️ Could not find cover section parent');
            return;
        }
        
        // Create video element
        const video = document.createElement('video');
        video.src = img.src;
        video.className = img.className;
        video.setAttribute('data-src', img.getAttribute('data-src'));
        video.setAttribute('data-video-src', img.getAttribute('data-video-src'));
        video.setAttribute('data-bg-video', img.getAttribute('data-bg-video'));
        video.setAttribute('data-is-local-video', 'true');
        video.style.width = img.style.width || '100%';
        video.style.height = img.style.height || '100%';
        video.style.objectFit = img.style.objectFit || 'cover';
        video.style.display = img.style.display || 'block';
        
        // Background videos should autoplay
        video.autoplay = true;
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        video.setAttribute('autoplay', '');
        video.setAttribute('muted', '');
        video.setAttribute('loop', '');
        video.setAttribute('playsinline', '');
        video.removeAttribute('controls');
        
        // Hide controls and disable fullscreen for background videos
        video.setAttribute('controlsList', 'nodownload nofullscreen');
        video.setAttribute('disablePictureInPicture', 'true');
        
        // Replace img with video
        img.replaceWith(video);
        
        console.log('✅ Background video element created and inserted');
        console.log('✅ Video autoplay:', video.autoplay);
        console.log('✅ Video muted:', video.muted);
        console.log('✅ Video loop:', video.loop);
    });
}

// Run when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', processLocalVideos);
} else {
    // DOM already loaded
    processLocalVideos();
}

// Also process dynamically added videos
const observer = new MutationObserver((mutations) => {
    let shouldProcess = false;
    
    mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
            // Check for new video containers
            const newVideos = document.querySelectorAll('.o_custom_video_container[data-is-local-video="true"]:not(.video-processed)');
            if (newVideos.length > 0) {
                newVideos.forEach(v => v.classList.add('video-processed'));
                shouldProcess = true;
            }
            
            // Check for new iframes with video URLs
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1) { // Element node
                    const iframes = node.querySelectorAll ? node.querySelectorAll('iframe') : [];
                    iframes.forEach(iframe => {
                        const src = iframe.src || '';
                        if (src.includes('/web/video/') || src.includes('.mp4') || src.includes('.webm')) {
                            shouldProcess = true;
                        }
                    });
                    // Also check if the node itself is an iframe
                    if (node.tagName === 'IFRAME') {
                        const src = node.src || '';
                        if (src.includes('/web/video/') || src.includes('.mp4') || src.includes('.webm')) {
                            shouldProcess = true;
                        }
                    }
                }
            });
        }
    });
    
    if (shouldProcess) {
        console.log('🎬 DOM changed, re-processing videos...');
        // Small delay to let DOM settle
        setTimeout(processLocalVideos, 100);
    }
});

// Observe the document body for changes
observer.observe(document.body, {
    childList: true,
    subtree: true,
});

// Also run periodically for editor scenarios
setInterval(() => {
    const iframesWithVideo = document.querySelectorAll('iframe[src*="/web/video/"], iframe[src*=".mp4"]');
    if (iframesWithVideo.length > 0) {
        console.log('🎬 Found unconverted video iframes, processing...');
        processLocalVideos();
    }
}, 2000);

console.log('✅ Video Frontend Processor Initialized');

// Function to process background video iframes specifically
function processBackgroundVideoIframes() {
    const bgContainers = document.querySelectorAll('.o_background_video, .media_iframe_video.o_background_video');
    console.log(`🎬 Processing ${bgContainers.length} background video containers`);
    
    bgContainers.forEach(container => {
        const iframe = container.querySelector('iframe');
        if (!iframe) return;
        
        const src = iframe.src || iframe.getAttribute('data-src') || '';
        if (!src.includes('/web/video/') && !src.includes('.mp4') && !src.includes('.webm')) return;
        
        console.log('🎬 Converting background iframe to video:', src);
        
        // Clean src
        let cleanSrc = src.split('&')[0].split('?')[0];
        
        const video = document.createElement('video');
        video.src = cleanSrc;
        video.className = iframe.className;
        video.style.cssText = iframe.style.cssText;
        video.setAttribute('data-src', cleanSrc);
        video.setAttribute('data-is-local-video', 'true');
        
        // Background video settings
        video.autoplay = true;
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        video.setAttribute('autoplay', '');
        video.setAttribute('muted', '');
        video.setAttribute('loop', '');
        video.setAttribute('playsinline', '');
        video.controls = false;
        video.removeAttribute('controls');
        video.classList.add('no-controls');
        video.style.objectFit = 'cover';
        video.style.pointerEvents = 'none';
        
        iframe.replaceWith(video);
        console.log('✅ Background iframe converted to video');
        
        video.play().catch(e => console.log('Autoplay blocked'));
    });
}



// ═══════════════════════════════════════════════════════════════════
// TEMPORARY DEBUG: Force background mode for local videos
// Add this at the TOP of your video_selector.js, before any patches
// ═══════════════════════════════════════════════════════════════════

// Global flag to force background mode
window.FORCE_BACKGROUND_VIDEO_MODE = false;

// Helper function to toggle force mode
window.toggleForceBackgroundMode = function() {
    window.FORCE_BACKGROUND_VIDEO_MODE = !window.FORCE_BACKGROUND_VIDEO_MODE;
    console.log(`🎬 Force background mode: ${window.FORCE_BACKGROUND_VIDEO_MODE ? '✅ ENABLED' : '❌ DISABLED'}`);
    console.log('💡 Reload the page and try uploading a video again');
    return window.FORCE_BACKGROUND_VIDEO_MODE;
};

console.log('💡 Force background mode helper loaded');
console.log('💡 To force background mode, run: window.toggleForceBackgroundMode()');
console.log('💡 Current state:', window.FORCE_BACKGROUND_VIDEO_MODE ? 'ENABLED' : 'DISABLED');

// ═══════════════════════════════════════════════════════════════════
// Add this check at the START of your renderMedia function
// Right after "console.log('🔍 Starting background detection...');"
// ═══════════════════════════════════════════════════════════════════

// FORCE MODE CHECK (add this in renderMedia after line "let isBackgroundContext = false;")
/*
if (window.FORCE_BACKGROUND_VIDEO_MODE) {
    console.log('⚡ FORCE MODE ENABLED - Background context forced to TRUE');
    isBackgroundContext = true;
}
*/

// ═══════════════════════════════════════════════════════════════════
// Alternative: Auto-detect based on dialog trigger
// ═══════════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
    // Monitor clicks on elements that might trigger background video dialog
    document.addEventListener('click', (e) => {
        const target = e.target;
        
        // Check if click was on/in a cover snippet
        const coverSnippet = target.closest('.s_cover');
        if (coverSnippet) {
            console.log('🎬 Click detected on cover snippet - marking for background mode');
            window.__lastClickWasCover = true;
            setTimeout(() => {
                window.__lastClickWasCover = false;
            }, 5000); // Clear after 5 seconds
        }
        
        // Check if click was on background video options
        const bgVideoOption = target.closest('[data-js="SetCoverImagePosition"], .snippet-option-SetCoverImagePosition');
        if (bgVideoOption) {
            console.log('🎬 Click detected on cover image option - marking for background mode');
            window.__lastClickWasCover = true;
            setTimeout(() => {
                window.__lastClickWasCover = false;
            }, 5000);
        }
    }, true);
});

// ═══════════════════════════════════════════════════════════════════
// Add this additional check in your renderMedia detection logic:
// ═══════════════════════════════════════════════════════════════════

/*
// Check 13: Check if recent click was on cover snippet
if (window.__lastClickWasCover) {
    console.log('✅ Background detected: Recent click was on cover snippet');
    isBackgroundContext = true;
}
*/