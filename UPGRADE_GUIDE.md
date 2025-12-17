# How to Upgrade the Website Video Upload Module

## The Issue
When you see: **"Odoo is currently processing a scheduled action. Module operations are not possible at this time..."**

This happens because:
1. Odoo runs background cron jobs (scheduled actions)
2. These jobs lock certain database tables (like `ir_cron`)
3. Module upgrades need exclusive access to the database
4. The cron job and module upgrade are competing for database locks

## Solution 1: Wait and Retry (Easiest)
Simply wait 1-2 minutes and try upgrading again. The cron job usually finishes quickly.

**Steps:**
1. Go to Apps module
2. Search for "Website Video Upload"
3. Click on it
4. Click "Upgrade" button
5. If you get the error, wait 60-90 seconds
6. Refresh the page and try again

## Solution 2: Disable Cron Jobs Temporarily (Recommended)
This is the most reliable method for development.

**Step 1: Stop Cron Jobs**
1. Go to **Settings** → **Technical** → **Scheduled Actions**
2. Find all scheduled jobs (especially "Email Queue Manager" and "Notification")
3. For each job:
   - Click on it
   - Uncheck "Active" checkbox
   - Click "Save"

**Step 2: Upgrade Module**
1. Go to Apps module
2. Search for "Website Video Upload"
3. Click "Upgrade" button
4. Wait for success message

**Step 3: Re-enable Cron Jobs**
1. Go back to **Settings** → **Technical** → **Scheduled Actions**
2. For each job you disabled:
   - Click on it
   - Check "Active" checkbox
   - Click "Save"

## Solution 3: Restart Odoo Server (Nuclear Option)
If cron jobs are stuck, restart the server.

**Terminal Command:**
```bash
# Stop the Odoo server
Ctrl+C

# Wait a few seconds
sleep 3

# Start it again
./odoo-bin -c ./odoo.conf
```

Then try upgrading.

## Solution 4: Command Line Upgrade (Advanced)
Stop the web server and upgrade directly via CLI:

```bash
# Stop the Odoo server
Ctrl+C

# Upgrade the module via command line
./odoo-bin -d odoo19 -u website_video_upload --stop-after-init -c ./odoo.conf

# Restart the server
./odoo-bin -c ./odoo.conf
```

## Best Practice: Development Workflow

### For Active Development:

**1. First Time Setup**
```bash
# Install the module
./odoo-bin -d odoo19 -i website_video_upload --stop-after-init -c ./odoo.conf

# Restart server
./odoo-bin -c ./odoo.conf
```

**2. For Each Code Change**
- Make your code changes
- Do NOT use the web interface to upgrade
- Instead, use CLI:
  ```bash
  # Kill server (Ctrl+C)
  # Restart with update flag
  ./odoo-bin -d odoo19 -u website_video_upload --stop-after-init -c ./odoo.conf
  
  # Restart normally
  ./odoo-bin -c ./odoo.conf
  ```

**3. Disable Auto-Cron for Development**
Add this to your `odoo.conf`:
```ini
[options]
# ... existing options ...

# Disable cron jobs during development
max_cron_threads = 0
```

Then restart Odoo. Cron jobs won't run and you can upgrade anytime.

**When done developing, set it back:**
```ini
max_cron_threads = 4
```

## Quick Fix Checklist

If you're stuck with the error, try these in order:

- [ ] **Option 1:** Wait 90 seconds and retry (simplest)
- [ ] **Option 2:** Disable active cron jobs before upgrading (reliable)
- [ ] **Option 3:** Use CLI upgrade command (most robust)
- [ ] **Option 4:** Restart Odoo server and retry (if all else fails)

## Monitor Module Upgrade

To see what's happening during upgrade, check the **Odoo logs**:

```
INFO odoo_db odoo.modules.loading: loading 1 modules...
INFO odoo_db odoo.modules.loading: 1 modules loaded in 0.02s, 0 queries
```

This means:
- ✅ Module loaded successfully
- ✅ No upgrade needed or upgrade complete
- ✅ You can now use the module

## Verify Successful Upgrade

After upgrading:

1. **Check Module Status**
   - Go to Apps
   - Search "Website Video Upload"
   - Status should be "Installed"
   - Version should be "19.0.1.1.0" (or higher)

2. **Check JavaScript Loaded**
   - Open website in edit mode
   - Open Browser DevTools (F12)
   - Go to Console tab
   - You should see: `✅ VideoSelector initialized with local video options`

3. **Test Video Upload**
   - Add a video element
   - Click "Upload" button
   - Select a video file
   - Verify upload succeeds

## Troubleshooting Table

| Problem | Cause | Solution |
|---------|-------|----------|
| "Scheduled action" error | Cron job running | Wait 90s or disable cron |
| Module not upgrading | Database locked | Restart Odoo server |
| JavaScript not loading | Cache issue | Clear browser cache (Ctrl+Shift+Del) |
| Video options not showing | Module not upgraded | Run upgrade again |
| Upload button missing | Template not loaded | Check manifest assets |

## Important Notes

⚠️ **Never upgrade modules in production** while cron jobs are running
⚠️ **Always** verify the module is installed before testing
⚠️ **Clear browser cache** after upgrading (Ctrl+Shift+Delete)
⚠️ **Hard refresh** website pages (Ctrl+Shift+R)

## Version History

- **19.0.1.1.0** - Fixed video controls persistence
- **19.0.1.0.0** - Initial version

Each time you increment the version in `__manifest__.py`, Odoo knows to run the upgrade process.