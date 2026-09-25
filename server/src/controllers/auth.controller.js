import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../config/db.js';
import { ENV } from '../config/env.js';

export const login = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const identifier = (email || username || '').trim();

    if (!identifier || !password) {
      return res.status(400).json({ success: false, error: 'Email/username and password are required' });
    }

    // Find user by email or username
    const user = db.prepare('SELECT * FROM users WHERE email = ? OR username = ?').get(identifier, identifier);

    // Fallback: If no user in database or initial setup, allow default admin password match
    let isPasswordValid = false;
    if (user) {
      isPasswordValid = await bcrypt.compare(password, user.password_hash);
    } else if (password === ENV.ADMIN_PASSWORD && (identifier === 'admin' || identifier === ENV.ADMIN_EMAIL)) {
      isPasswordValid = true;
    }

    if (!isPasswordValid) {
      return res.status(401).json({ success: false, error: 'Invalid admin credentials' });
    }

    const payload = {
      id: user ? user.id : 1,
      username: user ? user.username : 'admin',
      email: user ? user.email : ENV.ADMIN_EMAIL,
      role: 'admin'
    };

    const token = jwt.sign(payload, ENV.JWT_SECRET, { expiresIn: '7d' });

    return res.json({
      success: true,
      token,
      user: payload
    });
  } catch (err) {
    console.error('[AuthController] Login error:', err);
    return res.status(500).json({ success: false, error: 'Internal server error during login' });
  }
};

export const getMe = (req, res) => {
  try {
    const user = db.prepare('SELECT id, username, email, role, created_at FROM users WHERE id = ?').get(req.user.id);
    return res.json({
      success: true,
      user: user || req.user
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { email, current_password, new_password } = req.body;
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    if (new_password) {
      if (!current_password) {
        return res.status(400).json({ success: false, error: 'Current password is required to set a new password' });
      }
      const match = await bcrypt.compare(current_password, user.password_hash);
      if (!match) {
        return res.status(401).json({ success: false, error: 'Current password does not match' });
      }
      const newHash = await bcrypt.hash(new_password, 10);
      db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(newHash, user.id);
    }

    if (email && email.trim() !== user.email) {
      db.prepare('UPDATE users SET email = ? WHERE id = ?').run(email.trim(), user.id);
    }

    const updated = db.prepare('SELECT id, username, email, role FROM users WHERE id = ?').get(user.id);
    return res.json({
      success: true,
      message: 'Profile credentials updated successfully',
      user: updated
    });
  } catch (err) {
    console.error('[AuthController] Update profile error:', err);
    return res.status(500).json({ success: false, error: 'Failed to update credentials' });
  }
};
