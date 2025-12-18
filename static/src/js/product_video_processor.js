/** @odoo-module **/

/**
 * Product Video Frontend Processor
 * Applies video controls (autoplay, loop, hide controls) to product videos on website
 */

export function processProductVideos() {
    console.log('🎬 Product Video Processor Loaded');
    
    // Find all product video containers
    const videoContainers = document.querySelectorAll('.o_product_video_container, .o_custom_video_container[data-is-local-video="true"]');
    console.log(`🎬 Found ${videoContainers.length} product video containers`);
    
    videoContainers.forEach((container) => {
        const video = container.querySelector('video');
        if (!video) {
            console.warn('⚠️ No video element found in container');
            return;
        }
        
        console.log('🎬 Processing product video container');
        
        // Read control settings from data attributes
        const autoplay = container.getAttribute('data-video-autoplay') === 'true' || 
                        container.dataset.videoAutoplay === 'true';
        const loop = container.getAttribute('data-video-loop') === 'true' || 
                    container.dataset.videoLoop === 'true';
        const hideControls = container.getAttribute('data-video-hide-controls') === 'true' || 
                            container.dataset.videoHideControls === 'true';
        const hideFullscreen = container.getAttribute('data-video-hide-fullscreen') === 'true' || 
                              container.dataset.videoHideFullscreen === 'true';
        
        console.log('🎬 Control settings:', { autoplay, loop, hideControls, hideFullscreen });
        
        // Clear all existing attributes first
        video.removeAttribute('autoplay');
        video.removeAttribute('loop');
        video.removeAttribute('muted');
        video.removeAttribute('playsinline');
        video.removeAttribute('controlsList');
        video.removeAttribute('disablePictureInPicture');
        video.autoplay = false;
        video.loop = false;
        video.muted = false;
        
        // Apply autoplay (requires muted for browser policy)
        if (autoplay) {
            video.autoplay = true;
            video.muted = true;
            video.setAttribute('autoplay', '');
            video.setAttribute('muted', '');
            video.setAttribute('playsinline', '');
            
            // Try to play
            const playPromise = video.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.warn('⚠️ Autoplay failed:', error.message);
                });
            }
            console.log('✅ Applied: Autoplay ON');
        }
        
        // Apply loop
        if (loop) {
            video.loop = true;
            video.setAttribute('loop', '');
            
            // Backup handler for browser compatibility
            video.addEventListener('ended', function() {
                this.currentTime = 0;
                this.play().catch(err => console.warn('Loop failed:', err));
            });
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
        
        console.log('✅ Product video processing complete');
    });
}

// Run on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', processProductVideos);
} else {
    processProductVideos();
}

// Also process dynamically added videos (for AJAX content)
const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if (mutation.addedNodes.length) {
            const hasNewVideos = Array.from(mutation.addedNodes).some(node => {
                if (node.nodeType === 1) { // Element node
                    return node.querySelector && (
                        node.querySelector('.o_product_video_container') ||
                        node.querySelector('.o_custom_video_container[data-is-local-video="true"]') ||
                        node.classList.contains('o_product_video_container') ||
                        (node.classList.contains('o_custom_video_container') && node.dataset.isLocalVideo === 'true')
                    );
                }
                return false;
            });
            if (hasNewVideos) {
                console.log('🎬 New videos detected, processing...');
                processProductVideos();
            }
        }
    });
});

// Start observing
observer.observe(document.body, {
    childList: true,
    subtree: true
});

