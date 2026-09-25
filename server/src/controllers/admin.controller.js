import { db } from '../config/db.js';
import { ENV } from '../config/env.js';

export const login = (req, res) => {
  try {
    const { password } = req.body;

    if (!password || password !== ENV.ADMIN_PASSWORD) {
      return res.status(401).json({ success: false, error: 'Invalid admin credentials' });
    }

    return res.json({
      success: true,
      token: 'reginaldo-admin-auth-token-valid',
      user: { role: 'admin', name: 'Trust Administrator' }
    });
  } catch (err) {
    console.error('[AdminController] Login error:', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const getStats = (req, res) => {
  try {
    const totalContacts = db.prepare('SELECT count(*) as c FROM contacts').get().c;
    const newContacts = db.prepare("SELECT count(*) as c FROM contacts WHERE status = 'new'").get().c;
    
    const totalRequests = db.prepare('SELECT count(*) as c FROM service_requests').get().c;
    const pendingRequests = db.prepare("SELECT count(*) as c FROM service_requests WHERE status = 'pending'").get().c;

    const totalEvents = db.prepare('SELECT count(*) as c FROM events').get().c;
    const totalGallery = db.prepare('SELECT count(*) as c FROM gallery').get().c;

    return res.json({
      success: true,
      stats: {
        totalContacts,
        newContacts,
        totalRequests,
        pendingRequests,
        totalEvents,
        totalGallery
      }
    });
  } catch (err) {
    console.error('[AdminController] Stats error:', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};
