import { db } from '../config/db.js';

export const getSettings = (req, res) => {
  try {
    const rows = db.prepare('SELECT key, value FROM site_settings').all();
    const settings = {};
    for (const r of rows) {
      settings[r.key] = r.value;
    }
    return res.json({ success: true, data: settings });
  } catch (err) {
    console.error('[SettingsController] Error fetching settings:', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const updateSettings = (req, res) => {
  try {
    const updates = req.body;
    if (!updates || typeof updates !== 'object') {
      return res.status(400).json({ success: false, error: 'Invalid settings payload' });
    }

    const stmt = db.prepare(`
      INSERT INTO site_settings (key, value, updated_at)
      VALUES (?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP
    `);

    for (const [k, v] of Object.entries(updates)) {
      if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') {
        stmt.run(k, String(v));
      }
    }

    const rows = db.prepare('SELECT key, value FROM site_settings').all();
    const settings = {};
    for (const r of rows) {
      settings[r.key] = r.value;
    }

    return res.json({
      success: true,
      message: 'Site settings updated successfully',
      data: settings
    });
  } catch (err) {
    console.error('[SettingsController] Error updating settings:', err);
    return res.status(500).json({ success: false, error: 'Failed to update settings' });
  }
};
