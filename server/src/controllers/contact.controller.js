import { db } from '../config/db.js';

export const createContact = (req, res) => {
  try {
    const { name, email, phone, service, message } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, error: 'Name is required' });
    }
    if (!phone || !phone.trim()) {
      return res.status(400).json({ success: false, error: 'Phone number is required' });
    }
    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, error: 'Message is required' });
    }

    const stmt = db.prepare(`
      INSERT INTO contacts (name, email, phone, service, message, status)
      VALUES (?, ?, ?, ?, ?, 'new')
    `);

    const result = stmt.run(
      name.trim(),
      email ? email.trim() : null,
      phone.trim(),
      service ? service.trim() : 'General Inquiry',
      message.trim()
    );

    const saved = db.prepare('SELECT * FROM contacts WHERE id = ?').get(result.lastInsertRowid);

    return res.status(201).json({
      success: true,
      message: 'Inquiry received successfully! Our team will get back to you shortly.',
      data: saved
    });
  } catch (err) {
    console.error('[ContactController] Error creating contact inquiry:', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const getContacts = (req, res) => {
  try {
    const { status } = req.query;
    let query = 'SELECT * FROM contacts';
    const params = [];

    if (status) {
      query += ' WHERE status = ?';
      params.push(status);
    }
    query += ' ORDER BY created_at DESC';

    const contacts = db.prepare(query).all(...params);
    return res.json({ success: true, count: contacts.length, data: contacts });
  } catch (err) {
    console.error('[ContactController] Error fetching contacts:', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const updateContactStatus = (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['new', 'in-progress', 'resolved'].includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status. Use "new", "in-progress", or "resolved".' });
    }

    const stmt = db.prepare('UPDATE contacts SET status = ? WHERE id = ?');
    const info = stmt.run(status, Number(id));

    if (info.changes === 0) {
      return res.status(404).json({ success: false, error: 'Contact inquiry not found' });
    }

    const updated = db.prepare('SELECT * FROM contacts WHERE id = ?').get(Number(id));
    return res.json({ success: true, data: updated });
  } catch (err) {
    console.error('[ContactController] Error updating contact status:', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const deleteContact = (req, res) => {
  try {
    const { id } = req.params;
    const stmt = db.prepare('DELETE FROM contacts WHERE id = ?');
    const info = stmt.run(Number(id));

    if (info.changes === 0) {
      return res.status(404).json({ success: false, error: 'Contact inquiry not found' });
    }

    return res.json({ success: true, message: 'Contact inquiry deleted successfully' });
  } catch (err) {
    console.error('[ContactController] Error deleting contact:', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};
