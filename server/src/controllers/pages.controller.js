import { db } from '../config/db.js';

export const getPages = (req, res) => {
  try {
    const pages = db.prepare('SELECT * FROM pages ORDER BY id ASC').all();
    return res.json({ success: true, count: pages.length, data: pages });
  } catch (err) {
    console.error('[PagesController] Error fetching pages:', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const getPageBySlug = (req, res) => {
  try {
    const { slug } = req.params;
    const page = db.prepare('SELECT * FROM pages WHERE slug = ?').get(slug);

    if (!page) {
      return res.status(404).json({ success: false, error: 'Page not found' });
    }

    const sections = db.prepare('SELECT * FROM sections WHERE page_slug = ? ORDER BY order_index ASC, id ASC').all(slug);
    const parsedSections = sections.map(s => ({
      ...s,
      content: typeof s.content === 'string' ? JSON.parse(s.content) : s.content
    }));

    return res.json({
      success: true,
      data: {
        ...page,
        sections: parsedSections
      }
    });
  } catch (err) {
    console.error('[PagesController] Error fetching page:', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const updatePageSEO = (req, res) => {
  try {
    const { slug } = req.params;
    const { title, seo_title, meta_description, og_image, is_published } = req.body;

    const existing = db.prepare('SELECT * FROM pages WHERE slug = ?').get(slug);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Page not found' });
    }

    db.prepare(`
      UPDATE pages 
      SET title = ?, seo_title = ?, meta_description = ?, og_image = ?, is_published = ?, updated_at = CURRENT_TIMESTAMP
      WHERE slug = ?
    `).run(
      title !== undefined ? title : existing.title,
      seo_title !== undefined ? seo_title : existing.seo_title,
      meta_description !== undefined ? meta_description : existing.meta_description,
      og_image !== undefined ? og_image : existing.og_image,
      is_published !== undefined ? (is_published ? 1 : 0) : existing.is_published,
      slug
    );

    const updated = db.prepare('SELECT * FROM pages WHERE slug = ?').get(slug);
    return res.json({ success: true, message: 'Page SEO updated successfully', data: updated });
  } catch (err) {
    console.error('[PagesController] Error updating SEO:', err);
    return res.status(500).json({ success: false, error: 'Failed to update page settings' });
  }
};
