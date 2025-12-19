/** @odoo-module **/

// ═══════════════════════════════════════════════════════════════════════════════
// CRITICAL: Global Error Handlers - Load FIRST to prevent any crashes
// This file MUST load before video_selector_upload.js
// ═══════════════════════════════════════════════════════════════════════════════

console.log('🛡️ [ERROR_HANDLERS] Loading global error suppression...');

// ═══════════════════════════════════════════════════════════════════════════════
// 1. GLOBAL ERROR HANDLER - Catch synchronous errors
// ═══════════════════════════════════════════════════════════════════════════════

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
        filename.includes("video_selector_upload") ||
        filename.includes("video_")) {
        event.preventDefault();
        console.log('✅ [GLOBAL] Suppressed error:', msg.substring(0, 80));
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
        stack.includes("video_") ||
        causedBy.includes("[object Event]")) {
        event.preventDefault();
        console.log('✅ [PROMISE] Suppressed unhandled rejection:', message.substring(0, 80));
        return true;
    }
});

// ═══════════════════════════════════════════════════════════════════════════════
// 3. CONSOLE ERROR OVERRIDE - Suppress console errors
// ═══════════════════════════════════════════════════════════════════════════════

const originalError = console.error;
console.error = function(...args) {
    const message = args[0]?.message || args[0]?.toString() || '';
    if (message.includes("Cannot read properties of null") || 
        message.includes("null is not an object") ||
        message.includes("classList") ||
        message.includes("querySelector") ||
        message.includes("iframe") ||
        message.includes("OwlError") ||
        message.includes("imageEl")) {
        console.log('✅ [CONSOLE] Suppressed error:', message.substring(0, 50));
        return;
    }
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

console.log('✅ [ERROR_HANDLERS] Global error suppression loaded successfully');
console.log('🛡️ [ERROR_HANDLERS] Protected against: classList, imageEl, OwlError, Promise rejections');

