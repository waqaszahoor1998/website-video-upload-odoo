# URGENT FIX - TypeError: Cannot read properties of undefined

## Problem
When clicking checkboxes for video options, error occurs:
```
TypeError: Cannot read properties of undefined (reading 'querySelector')
```

## Root Cause
The `updateLocalVideoPreview()` method was trying to access `this.el.querySelector()`, but `this.el` is **undefined** in the patched VideoSelector component.

### Why this.el doesn't exist:
- Owl component's `this.el` is the root element of the component
- The `.o_video_preview` is NOT a direct child of the VideoSelector component root
- It's a child of the parent VideoSelector template which we're inheriting

## Solution
Use `document.querySelector()` instead of `this.el.querySelector()` to find the preview container in the DOM.

### Changed:
```javascript
// ❌ WRONG
const previewContainer = this.el.querySelector('.o_video_preview');

// ✅ CORRECT  
const previewContainer = document.querySelector('.o_video_preview');
```

## Why This Works
- `document.querySelector()` searches the entire DOM
- `.o_video_preview` has a unique class in the page at any given time
- Works regardless of component hierarchy
- Safe because the dialog is only open for one selector at a time

## Testing After Fix

1. **Hard refresh** (Ctrl+Shift+R)
2. **Upload/select video** in editor
3. **Click checkboxes** - should work without errors
4. **Check console** - should show logs like:
   ```
   ✅ Preview: Loop ON
   ✅ Preview: Controls HIDDEN
   etc.
   ```
5. **Preview should update** in real-time as you toggle options

## Files Fixed
- `video_selector_upload.js` - `updateLocalVideoPreview()` method

## No Other Changes Needed
This is a simple fix - just changed how we access the DOM.
