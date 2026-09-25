import { db } from '../config/db.js';

export const getGallery = (req, res) => {
  try {
    const { category } = req.query;
    let query = 'SELECT * FROM gallery';
    const params = [];

    if (category && category !== 'all') {
      query += ' WHERE category = ?';
      params.push(category);
    }
    query += ' ORDER BY id ASC';

    const items = db.prepare(query).all(...params);
    return res.json({ success: true, count: items.length, data: items });
  } catch (err) {
    console.error('[GalleryController] Error fetching gallery items:', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const createGalleryItem = (req, res) => {
  try {
    const { category, tag, caption, src, alt } = req.body;

    if (!category || !tag || !caption || !src || !alt) {
      return res.status(400).json({ success: false, error: 'All gallery item fields are required' });
    }

    const stmt = db.prepare(`
      INSERT INTO gallery (category, tag, caption, src, alt)
      VALUES (?, ?, ?, ?, ?)
    `);

    const result = stmt.run(category, tag, caption, src, alt);
    const saved = db.prepare('SELECT * FROM gallery WHERE id = ?').get(result.lastInsertRowid);

    return res.status(201).json({ success: true, data: saved });
  } catch (err) {
    console.error('[GalleryController] Error creating gallery item:', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const updateGalleryItem = (req, res) => {
  try {
    const { id } = req.params;
    const { category, tag, caption, src, alt } = req.body;

    const existing = db.prepare('SELECT * FROM gallery WHERE id = ?').get(Number(id));
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Gallery item not found' });
    }

    const stmt = db.prepare(`
      UPDATE gallery 
      SET category = ?, tag = ?, caption = ?, src = ?, alt = ?
      WHERE id = ?
    `);

    stmt.run(
      category !== undefined ? category : existing.category,
      tag !== undefined ? tag : existing.tag,
      caption !== undefined ? caption : existing.caption,
      src !== undefined ? src : existing.src,
      alt !== undefined ? alt : existing.alt,
      Number(id)
    );

    const updated = db.prepare('SELECT * FROM gallery WHERE id = ?').get(Number(id));
    return res.json({ success: true, data: updated });
  } catch (err) {
    console.error('[GalleryController] Error updating gallery item:', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const deleteGalleryItem = (req, res) => {
  try {
    const { id } = req.params;
    const stmt = db.prepare('DELETE FROM gallery WHERE id = ?');
    const info = stmt.run(Number(id));

    if (info.changes === 0) {
      return res.status(404).json({ success: false, error: 'Gallery item not found' });
    }

    return res.json({ success: true, message: 'Gallery item deleted successfully' });
  } catch (err) {
    console.error('[GalleryController] Error deleting gallery item:', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

const DEFAULT_CATEGORIES = [
  { id: 'community', label: 'Community Events' },
  { id: 'restoration', label: 'House Restoration' },
  { id: 'agriculture', label: 'Agriculture' },
  { id: 'education', label: 'Education' },
  { id: 'livelihood', label: 'Livelihoods & Training' },
  { id: 'environment', label: 'Clean & Green' }
];

export const getCategories = (req, res) => {
  try {
    const row = db.prepare('SELECT value FROM site_settings WHERE key = ?').get('gallery_categories');
    let categories = DEFAULT_CATEGORIES;

    if (row && row.value) {
      try {
        const parsed = JSON.parse(row.value);
        if (Array.isArray(parsed) && parsed.length > 0) {
          categories = parsed;
        }
      } catch {
        // Fallback to default
      }
    }

    // Check if gallery table has any custom categories not yet in the list
    const distinctRows = db.prepare('SELECT DISTINCT category FROM gallery WHERE category IS NOT NULL').all();
    const existingIds = new Set(categories.map(c => c.id));
    let modified = false;

    for (const r of distinctRows) {
      if (r.category && !existingIds.has(r.category)) {
        const label = r.category.charAt(0).toUpperCase() + r.category.slice(1).replace(/[_-]/g, ' ');
        categories.push({ id: r.category, label });
        existingIds.add(r.category);
        modified = true;
      }
    }

    if (!row || modified) {
      db.prepare(`
        INSERT INTO site_settings (key, value, updated_at) 
        VALUES ('gallery_categories', ?, CURRENT_TIMESTAMP)
        ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP
      `).run(JSON.stringify(categories));
    }

    return res.json({ success: true, data: categories });
  } catch (err) {
    console.error('[GalleryController] Error fetching categories:', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const createCategory = (req, res) => {
  try {
    const { id, label } = req.body;
    if (!label) {
      return res.status(400).json({ success: false, error: 'Category label is required' });
    }

    const catId = (id || label).toLowerCase().trim().replace(/[^a-z0-9_-]/g, '_').replace(/_+/g, '_');
    const row = db.prepare('SELECT value FROM site_settings WHERE key = ?').get('gallery_categories');
    let categories = DEFAULT_CATEGORIES;

    if (row && row.value) {
      try {
        categories = JSON.parse(row.value);
      } catch {}
    }

    if (categories.some(c => c.id === catId)) {
      return res.status(400).json({ success: false, error: `Category with ID "${catId}" already exists` });
    }

    categories.push({ id: catId, label: label.trim() });

    db.prepare(`
      INSERT INTO site_settings (key, value, updated_at) 
      VALUES ('gallery_categories', ?, CURRENT_TIMESTAMP)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP
    `).run(JSON.stringify(categories));

    return res.status(201).json({ success: true, data: categories, added: { id: catId, label: label.trim() } });
  } catch (err) {
    console.error('[GalleryController] Error creating category:', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const deleteCategory = (req, res) => {
  try {
    const { id } = req.params;
    const row = db.prepare('SELECT value FROM site_settings WHERE key = ?').get('gallery_categories');
    let categories = DEFAULT_CATEGORIES;

    if (row && row.value) {
      try {
        categories = JSON.parse(row.value);
      } catch {}
    }

    const filtered = categories.filter(c => c.id !== id);
    if (filtered.length === categories.length) {
      return res.status(404).json({ success: false, error: 'Category not found' });
    }

    db.prepare(`
      INSERT INTO site_settings (key, value, updated_at) 
      VALUES ('gallery_categories', ?, CURRENT_TIMESTAMP)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP
    `).run(JSON.stringify(filtered));

    return res.json({ success: true, data: filtered, message: `Category '${id}' removed` });
  } catch (err) {
    console.error('[GalleryController] Error deleting category:', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

