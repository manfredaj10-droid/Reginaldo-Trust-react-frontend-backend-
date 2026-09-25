import { db } from '../config/db.js';

export const getEnquiries = (req, res) => {
  try {
    const { status } = req.query;
    let query = 'SELECT * FROM contacts';
    const params = [];

    if (status && status !== 'all') {
      query += ' WHERE status = ?';
      params.push(status);
    }
    query += ' ORDER BY created_at DESC';

    const items = db.prepare(query).all(...params);
    return res.json({ success: true, count: items.length, data: items });
  } catch (err) {
    console.error('[EnquiriesController] Error fetching enquiries:', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const updateEnquiryStatus = (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['new', 'read', 'replied', 'archived', 'in-progress', 'resolved'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ success: false, error: 'Valid status required: new, read, replied, archived' });
    }

    const stmt = db.prepare('UPDATE contacts SET status = ? WHERE id = ?');
    stmt.run(status, Number(id));

    const updated = db.prepare('SELECT * FROM contacts WHERE id = ?').get(Number(id));
    return res.json({ success: true, data: updated });
  } catch (err) {
    console.error('[EnquiriesController] Error updating enquiry status:', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const deleteEnquiry = (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM contacts WHERE id = ?').run(Number(id));
    return res.json({ success: true, message: 'Enquiry deleted successfully' });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};
