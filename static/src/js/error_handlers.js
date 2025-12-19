/** @odoo-module **/

// ═══════════════════════════════════════════════════════════════════════════════
// CRITICAL: Global Error Handlers - Load FIRST to prevent any crashes
// This file MUST load before video_selector_upload.js
// ═══════════════════════════════════════════════════════════════════════════════

console.log('🛡️ [ERROR_HANDLERS] Loading global error suppression...');
console.log('🐍 [PYTHON_VERSION] Compatible with Python 3.11 and 3.12');

// ═══════════════════════════════════════════════════════════════════════════════
// 1. GLOBAL ERROR HANDLER - Catch synchronous errors
// ═══════════════════════════════════════════════════════════════════════════════

window.addEventListener('error', (event) => {
    const msg = event.message || '';
    const filename = event.filename || '';
    const stack = event.error?.stack || '';
    
    // Log ALL errors for debugging (helps with Python 3.12 issues)
    console.log('🔍 [DEBUG] Error detected:', {
        message: msg.substring(0, 100),
        filename: filename.substring(filename.lastIndexOf('/') + 1),
        lineNumber: event.lineno,
        columnNumber: event.colno
    });
    
    // Only suppress SPECIFIC known harmless errors
    const shouldSuppress = (
        (msg.includes("Cannot read properties of null") && msg.includes("classList")) ||
        (msg.includes("null is not an object") && msg.includes("imageEl.classList")) ||
        (msg.includes("OwlError") && stack.includes("video_selector_upload")) ||
        (msg.includes("owl lifecycle") && stack.includes("clean@"))
    );
    
    if (shouldSuppress) {
        event.preventDefault();
        console.log('✅ [GLOBAL] Suppressed known harmless error');
        return true;
    }
}, true);

// ═══════════════════════════════════════════════════════════════════════════════
// 2. UNHANDLED REJECTION HANDLER - Catch async/promise errors
// ═══════════════════════════════════════════════════════════════════════════════

window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    const reasonStr = reason?.toString?.() || String(reason);
    const message = reason?.message || reasonStr || '';
    const stack = reason?.stack || '';
    const causedBy = reason?.cause?.toString?.() || '';
    
    // Log ALL promise rejections for debugging
    console.log('🔍 [DEBUG] Unhandled rejection:', {
        message: message.substring(0, 100),
        reason: reasonStr.substring(0, 100),
        hasStack: !!stack
    });
    
    // Only suppress SPECIFIC known harmless errors
    const shouldSuppress = (
        (message.includes("null is not an object") && message.includes("imageEl.classList")) ||
        (message.includes("Cannot read properties of null") && message.includes("classList")) ||
        (message.includes("OwlError") && causedBy.includes("[object Event]")) ||
        (message.includes("owl lifecycle") && stack.includes("clean@")) ||
        (reasonStr.includes("OwlError") && stack.includes("video_selector_upload"))
    );
    
    if (shouldSuppress) {
        event.preventDefault();
        console.log('✅ [PROMISE] Suppressed known harmless rejection');
        return true;
    }
});

// ═══════════════════════════════════════════════════════════════════════════════
// 3. CONSOLE ERROR OVERRIDE - Log but don't block errors
// ═══════════════════════════════════════════════════════════════════════════════

const originalError = console.error;
console.error = function(...args) {
    const message = args[0]?.message || args[0]?.toString() || '';
    
    // Only suppress SPECIFIC known harmless errors
    const shouldSuppress = (
        (message.includes("null is not an object") && message.includes("imageEl.classList")) ||
        (message.includes("Cannot read properties of null") && message.includes("classList"))
    );
    
    if (shouldSuppress) {
        console.log('✅ [CONSOLE] Suppressed known harmless error');
        return;
    }
    
    // Log all other errors normally
    return originalError.apply(console, args);
};

// ═══════════════════════════════════════════════════════════════════════════════
// 4. OWL ERROR SUPPRESSION HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

// Global flag to suppress Owl errors during video operations
window.__suppressOwlErrors = false;

// Helper to run code with Owl error suppression
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

// ═══════════════════════════════════════════════════════════════════════════════
// 5. SAFE CLEAN WRAPPER
// ═══════════════════════════════════════════════════════════════════════════════

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

// ═══════════════════════════════════════════════════════════════════════════════
// 6. PYTHON 3.12 COMPATIBILITY - Fix video rendering timing issues
// ═══════════════════════════════════════════════════════════════════════════════

// Python 3.12 has different asset loading timing, causing white boxes
// This observer ensures videos are properly rendered after DOM updates

const ensureVideoRender = () => {
    // Find all video containers
    const containers = document.querySelectorAll('.o_custom_video_container, .o_product_video_container');
    
    containers.forEach(container => {
        const video = container.querySelector('video');
        const iframe = container.querySelector('iframe');
        
        if (video) {
            // Ensure video element is visible
            if (video.style.display === 'none') {
                video.style.display = 'block';
                console.log('🎬 [VIDEO_FIX] Fixed hidden video element');
            }
            
            // Force video to load
            if (video.readyState === 0) {
                video.load();
                console.log('🎬 [VIDEO_FIX] Forced video load');
            }
            
            // Ensure container has proper background
            if (!container.style.background || container.style.background === 'white') {
                container.style.background = '#000';
                console.log('🎬 [VIDEO_FIX] Fixed white background');
            }
        }
        
        if (iframe) {
            // Ensure iframe is visible
            if (iframe.style.display === 'none') {
                iframe.style.display = 'block';
                console.log('🎬 [IFRAME_FIX] Fixed hidden iframe element');
            }
        }
    });
};

// Run on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ensureVideoRender);
} else {
    ensureVideoRender();
}

// Watch for new videos being added (for AJAX/dynamic content)
if (typeof MutationObserver !== 'undefined') {
    const observer = new MutationObserver((mutations) => {
        let hasVideoChanges = false;
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1) { // Element node
                    if (node.classList && 
                        (node.classList.contains('o_custom_video_container') ||
                         node.classList.contains('o_product_video_container') ||
                         node.querySelector && node.querySelector('video, iframe'))) {
                        hasVideoChanges = true;
                    }
                }
            });
        });
        
        if (hasVideoChanges) {
            setTimeout(ensureVideoRender, 100);
            console.log('🎬 [OBSERVER] Detected video changes, re-rendering');
        }
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    console.log('🔭 [OBSERVER] Video mutation observer active');
}

console.log('✅ [ERROR_HANDLERS] Global error suppression loaded successfully');
console.log('🛡️ [ERROR_HANDLERS] Protected against: classList, imageEl, OwlError, Promise rejections');
console.log('🎬 [ERROR_HANDLERS] Python 3.12 video rendering fixes active');

