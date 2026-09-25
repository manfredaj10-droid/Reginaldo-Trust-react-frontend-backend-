import { db } from '../config/db.js';

export const getEvents = (req, res) => {
  try {
    const { is_extra } = req.query;
    let query = 'SELECT * FROM events';
    const params = [];

    if (is_extra !== undefined) {
      query += ' WHERE is_extra = ?';
      params.push(Number(is_extra));
    }
    query += ' ORDER BY id ASC';

    const events = db.prepare(query).all(...params);
    return res.json({ success: true, count: events.length, data: events });
  } catch (err) {
    console.error('[EventsController] Error fetching events:', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const createEvent = (req, res) => {
  try {
    const { day, mon, tag, title, description, is_extra } = req.body;

    if (!day || !mon || !tag || !title || !description) {
      return res.status(400).json({ success: false, error: 'All event fields are required' });
    }

    const stmt = db.prepare(`
      INSERT INTO events (day, mon, tag, title, description, is_extra)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(day, mon, tag, title, description, is_extra ? 1 : 0);
    const saved = db.prepare('SELECT * FROM events WHERE id = ?').get(result.lastInsertRowid);

    return res.status(201).json({ success: true, data: saved });
  } catch (err) {
    console.error('[EventsController] Error creating event:', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const updateEvent = (req, res) => {
  try {
    const { id } = req.params;
    const { day, mon, tag, title, description, is_extra } = req.body;

    const existing = db.prepare('SELECT * FROM events WHERE id = ?').get(Number(id));
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }

    const stmt = db.prepare(`
      UPDATE events 
      SET day = ?, mon = ?, tag = ?, title = ?, description = ?, is_extra = ?
      WHERE id = ?
    `);

    stmt.run(
      day !== undefined ? day : existing.day,
      mon !== undefined ? mon : existing.mon,
      tag !== undefined ? tag : existing.tag,
      title !== undefined ? title : existing.title,
      description !== undefined ? description : existing.description,
      is_extra !== undefined ? (is_extra ? 1 : 0) : existing.is_extra,
      Number(id)
    );

    const updated = db.prepare('SELECT * FROM events WHERE id = ?').get(Number(id));
    return res.json({ success: true, data: updated });
  } catch (err) {
    console.error('[EventsController] Error updating event:', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const deleteEvent = (req, res) => {
  try {
    const { id } = req.params;
    const stmt = db.prepare('DELETE FROM events WHERE id = ?');
    const info = stmt.run(Number(id));

    if (info.changes === 0) {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }

    return res.json({ success: true, message: 'Event deleted successfully' });
  } catch (err) {
    console.error('[EventsController] Error deleting event:', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};
