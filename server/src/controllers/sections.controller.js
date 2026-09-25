import { db } from '../config/db.js';

export const getSectionsByPage = (req, res) => {
  try {
    const { pageSlug } = req.params;
    const sections = db.prepare('SELECT * FROM sections WHERE page_slug = ? ORDER BY order_index ASC, id ASC').all(pageSlug);
    const parsed = sections.map(s => ({
      ...s,
      content: typeof s.content === 'string' ? JSON.parse(s.content) : s.content
    }));
    return res.json({ success: true, count: parsed.length, data: parsed });
  } catch (err) {
    console.error('[SectionsController] Error fetching sections:', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const getSection = (req, res) => {
  try {
    const { pageSlug, sectionKey } = req.params;
    const section = db.prepare('SELECT * FROM sections WHERE page_slug = ? AND section_key = ?').get(pageSlug, sectionKey);

    if (!section) {
      return res.status(404).json({ success: false, error: 'Section not found' });
    }

    section.content = typeof section.content === 'string' ? JSON.parse(section.content) : section.content;
    return res.json({ success: true, data: section });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const updateSection = (req, res) => {
  try {
    const { pageSlug, sectionKey } = req.params;
    const { title, subtitle, content, is_published, order_index } = req.body;

    const existing = db.prepare('SELECT * FROM sections WHERE page_slug = ? AND section_key = ?').get(pageSlug, sectionKey);

    const updatedTitle = title !== undefined ? title : (existing ? existing.title : null);
    const updatedSubtitle = subtitle !== undefined ? subtitle : (existing ? existing.subtitle : null);
    const updatedPublished = is_published !== undefined ? (is_published ? 1 : 0) : (existing ? existing.is_published : 1);
    const updatedOrder = order_index !== undefined ? Number(order_index) : (existing ? existing.order_index : 0);

    let updatedContentString;
    if (content !== undefined) {
      updatedContentString = typeof content === 'string' ? content : JSON.stringify(content);
    } else if (existing) {
      updatedContentString = existing.content;
    } else {
      updatedContentString = '{}';
    }

    if (existing) {
      db.prepare(`
        UPDATE sections 
        SET title = ?, subtitle = ?, content = ?, is_published = ?, order_index = ?, updated_at = CURRENT_TIMESTAMP
        WHERE page_slug = ? AND section_key = ?
      `).run(updatedTitle, updatedSubtitle, updatedContentString, updatedPublished, updatedOrder, pageSlug, sectionKey);
    } else {
      db.prepare(`
        INSERT INTO sections (page_slug, section_key, title, subtitle, content, is_published, order_index)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(pageSlug, sectionKey, updatedTitle, updatedSubtitle, updatedContentString, updatedPublished, updatedOrder);
    }

    const saved = db.prepare('SELECT * FROM sections WHERE page_slug = ? AND section_key = ?').get(pageSlug, sectionKey);
    saved.content = JSON.parse(saved.content);

    return res.json({
      success: true,
      message: `Section '${sectionKey}' updated successfully`,
      data: saved
    });
  } catch (err) {
    console.error('[SectionsController] Error updating section:', err);
    return res.status(500).json({ success: false, error: 'Failed to update section' });
  }
};

export const deleteSection = (req, res) => {
  try {
    const { pageSlug, sectionKey } = req.params;
    const existing = db.prepare('SELECT * FROM sections WHERE page_slug = ? AND section_key = ?').get(pageSlug, sectionKey);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Section not found' });
    }

    db.prepare('DELETE FROM sections WHERE page_slug = ? AND section_key = ?').run(pageSlug, sectionKey);
    return res.json({ success: true, message: `Section '${sectionKey}' deleted successfully` });
  } catch (err) {
    console.error('[SectionsController] Error deleting section:', err);
    return res.status(500).json({ success: false, error: 'Failed to delete section' });
  }
};

