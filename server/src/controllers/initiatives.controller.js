import { db } from '../config/db.js';

export const getInitiatives = (req, res) => {
  try {
    const items = db.prepare('SELECT * FROM initiatives ORDER BY order_index ASC, id ASC').all();
    return res.json({ success: true, count: items.length, data: items });
  } catch (err) {
    console.error('[InitiativesController] Error fetching initiatives:', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const createInitiative = (req, res) => {
  try {
    const { title, category, description, icon, image, button_text, button_url, order_index, is_published } = req.body;

    if (!title || !category || !description) {
      return res.status(400).json({ success: false, error: 'Title, category, and description are required' });
    }

    const stmt = db.prepare(`
      INSERT INTO initiatives (title, category, description, icon, image, button_text, button_url, order_index, is_published)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      title.trim(),
      category.trim(),
      description.trim(),
      icon || 'volunteer_activism',
      image || '/images/donate.webp',
      button_text || 'See Details',
      button_url || '/services',
      Number(order_index) || 0,
      is_published !== undefined ? (is_published ? 1 : 0) : 1
    );

    const saved = db.prepare('SELECT * FROM initiatives WHERE id = ?').get(result.lastInsertRowid);
    return res.status(201).json({ success: true, data: saved });
  } catch (err) {
    console.error('[InitiativesController] Error creating initiative:', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const updateInitiative = (req, res) => {
  try {
    const { id } = req.params;
    const { title, category, description, icon, image, button_text, button_url, order_index, is_published } = req.body;

    const existing = db.prepare('SELECT * FROM initiatives WHERE id = ?').get(Number(id));
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Initiative not found' });
    }

    db.prepare(`
      UPDATE initiatives 
      SET title = ?, category = ?, description = ?, icon = ?, image = ?, button_text = ?, button_url = ?, order_index = ?, is_published = ?
      WHERE id = ?
    `).run(
      title !== undefined ? title.trim() : existing.title,
      category !== undefined ? category.trim() : existing.category,
      description !== undefined ? description.trim() : existing.description,
      icon !== undefined ? icon : existing.icon,
      image !== undefined ? image : existing.image,
      button_text !== undefined ? button_text : existing.button_text,
      button_url !== undefined ? button_url : existing.button_url,
      order_index !== undefined ? Number(order_index) : existing.order_index,
      is_published !== undefined ? (is_published ? 1 : 0) : existing.is_published,
      Number(id)
    );

    const updated = db.prepare('SELECT * FROM initiatives WHERE id = ?').get(Number(id));
    return res.json({ success: true, data: updated });
  } catch (err) {
    console.error('[InitiativesController] Error updating initiative:', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const deleteInitiative = (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.prepare('SELECT * FROM initiatives WHERE id = ?').get(Number(id));
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Initiative not found' });
    }

    db.prepare('DELETE FROM initiatives WHERE id = ?').run(Number(id));
    return res.json({ success: true, message: 'Initiative deleted successfully' });
  } catch (err) {
    console.error('[InitiativesController] Error deleting initiative:', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};
