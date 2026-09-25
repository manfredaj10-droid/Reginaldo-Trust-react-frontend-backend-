import { db } from '../config/db.js';

// === SERVICES CATALOG CRUD ===

export const getCatalog = (req, res) => {
  try {
    const services = db.prepare('SELECT * FROM services_catalog ORDER BY order_index ASC, id ASC').all();
    const formatted = services.map(s => ({
      ...s,
      points: typeof s.points === 'string' ? JSON.parse(s.points) : s.points
    }));
    return res.json({ success: true, count: formatted.length, data: formatted });
  } catch (err) {
    console.error('[ServicesController] Error fetching services catalog:', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const createCatalogService = (req, res) => {
  try {
    const { title, short_title, description, icon, points, slug, order_index } = req.body;

    if (!title || !description) {
      return res.status(400).json({ success: false, error: 'Title and description are required' });
    }

    const finalSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const finalPoints = Array.isArray(points) ? JSON.stringify(points) : (typeof points === 'string' ? points : '[]');

    const stmt = db.prepare(`
      INSERT INTO services_catalog (slug, title, short_title, description, icon, points, order_index, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, 1)
    `);

    const result = stmt.run(
      finalSlug,
      title.trim(),
      short_title ? short_title.trim() : title.trim(),
      description.trim(),
      icon || 'volunteer_activism',
      finalPoints,
      Number(order_index) || 0
    );

    const saved = db.prepare('SELECT * FROM services_catalog WHERE id = ?').get(result.lastInsertRowid);
    saved.points = JSON.parse(saved.points);

    return res.status(201).json({ success: true, data: saved });
  } catch (err) {
    console.error('[ServicesController] Error creating service in catalog:', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const updateCatalogService = (req, res) => {
  try {
    const { id } = req.params;
    const { title, short_title, description, icon, points, order_index } = req.body;

    const existing = db.prepare('SELECT * FROM services_catalog WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Service not found' });
    }

    const updatedTitle = title !== undefined ? title.trim() : existing.title;
    const updatedShort = short_title !== undefined ? short_title.trim() : existing.short_title;
    const updatedDesc = description !== undefined ? description.trim() : existing.description;
    const updatedIcon = icon !== undefined ? icon.trim() : existing.icon;
    const updatedOrder = order_index !== undefined ? Number(order_index) : existing.order_index;
    const updatedPoints = points !== undefined 
      ? (Array.isArray(points) ? JSON.stringify(points) : points)
      : existing.points;

    db.prepare(`
      UPDATE services_catalog 
      SET title = ?, short_title = ?, description = ?, icon = ?, points = ?, order_index = ?
      WHERE id = ?
    `).run(updatedTitle, updatedShort, updatedDesc, updatedIcon, updatedPoints, updatedOrder, id);

    const updated = db.prepare('SELECT * FROM services_catalog WHERE id = ?').get(id);
    updated.points = JSON.parse(updated.points);

    return res.json({ success: true, data: updated });
  } catch (err) {
    console.error('[ServicesController] Error updating service in catalog:', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const deleteCatalogService = (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.prepare('SELECT * FROM services_catalog WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Service not found' });
    }

    db.prepare('DELETE FROM services_catalog WHERE id = ?').run(id);
    return res.json({ success: true, message: 'Service removed from catalog successfully' });
  } catch (err) {
    console.error('[ServicesController] Error deleting service from catalog:', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

// === CITIZEN EMERGENCY & ASSISTANCE REQUESTS ===

export const createServiceRequest = (req, res) => {
  try {
    const { applicant_name, phone, village, category, urgency, details } = req.body;

    if (!applicant_name || !applicant_name.trim()) {
      return res.status(400).json({ success: false, error: 'Applicant name is required' });
    }
    if (!phone || !phone.trim()) {
      return res.status(400).json({ success: false, error: 'Phone number is required' });
    }
    if (!category || !category.trim()) {
      return res.status(400).json({ success: false, error: 'Service category is required' });
    }

    const stmt = db.prepare(`
      INSERT INTO service_requests (applicant_name, phone, village, category, urgency, details, status)
      VALUES (?, ?, ?, ?, ?, ?, 'pending')
    `);

    const result = stmt.run(
      applicant_name.trim(),
      phone.trim(),
      village ? village.trim() : 'Curtorim',
      category.trim(),
      urgency ? urgency.trim() : 'normal',
      details ? details.trim() : null
    );

    const saved = db.prepare('SELECT * FROM service_requests WHERE id = ?').get(result.lastInsertRowid);

    return res.status(201).json({
      success: true,
      message: 'Service assistance request submitted successfully. The Trust team will contact you promptly.',
      data: saved
    });
  } catch (err) {
    console.error('[ServicesController] Error creating service request:', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const getServiceRequests = (req, res) => {
  try {
    const { category, status } = req.query;
    let query = 'SELECT * FROM service_requests WHERE 1=1';
    const params = [];

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }
    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }
    query += ' ORDER BY created_at DESC';

    const requests = db.prepare(query).all(...params);
    return res.json({ success: true, count: requests.length, data: requests });
  } catch (err) {
    console.error('[ServicesController] Error fetching service requests:', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};
