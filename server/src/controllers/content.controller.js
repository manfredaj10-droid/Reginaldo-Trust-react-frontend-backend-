import { db } from '../config/db.js';

export const getAllContent = (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM site_content').all();
    const grouped = {};
    for (const r of rows) {
      if (!grouped[r.section]) grouped[r.section] = {};
      grouped[r.section][r.key] = r.value;
    }
    return res.json({ success: true, data: grouped });
  } catch (err) {
    console.error('[ContentController] Error fetching content:', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const getContentBySection = (req, res) => {
  try {
    const { section } = req.params;
    const rows = db.prepare('SELECT key, value FROM site_content WHERE section = ?').all(section);
    const content = {};
    for (const r of rows) {
      content[r.key] = r.value;
    }
    return res.json({ success: true, section, data: content });
  } catch (err) {
    console.error('[ContentController] Error fetching section content:', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const updateContentSection = (req, res) => {
  try {
    const { section } = req.params;
    const updates = req.body; // e.g. { hero_title: '...', hero_subtitle: '...' }

    if (!updates || typeof updates !== 'object') {
      return res.status(400).json({ success: false, error: 'Invalid update payload' });
    }

    const stmt = db.prepare(`
      INSERT INTO site_content (section, key, value, updated_at)
      VALUES (?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(section, key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP
    `);

    for (const [key, value] of Object.entries(updates)) {
      if (typeof value === 'string' || typeof value === 'number') {
        stmt.run(section, key, String(value));
      }
    }

    // Return the updated section
    const rows = db.prepare('SELECT key, value FROM site_content WHERE section = ?').all(section);
    const content = {};
    for (const r of rows) {
      content[r.key] = r.value;
    }

    return res.json({
      success: true,
      message: `Section '${section}' updated successfully`,
      data: content
    });
  } catch (err) {
    console.error('[ContentController] Error updating section content:', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};
