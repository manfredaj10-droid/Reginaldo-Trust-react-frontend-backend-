import React, { useState } from 'react';
import { adminService } from '../../../services/index.js';
import { useToast } from '../../../context/ToastContext.jsx';

export default function AdminProfileEditor({ user, onUserUpdated }) {
  const [email, setEmail] = useState(user?.email || 'admin@reginaldotrust.org');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (newPassword && newPassword !== confirmPassword) {
      showToast('New passwords do not match!');
      return;
    }

    if (newPassword && !currentPassword) {
      showToast('Please enter your current password to set a new password');
      return;
    }

    setSaving(true);
    try {
      const res = await adminService.updateProfile({
        email,
        current_password: currentPassword || undefined,
        new_password: newPassword || undefined
      });

      showToast('Admin profile credentials updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      if (res?.user && onUserUpdated) {
        onUserUpdated(res.user);
      }
    } catch (err) {
      showToast(err.message || 'Failed to update credentials');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-gray-200 shadow-xs p-6 space-y-6">
      <div className="border-b border-gray-100 pb-4">
        <h2 className="font-display-lg text-xl font-bold text-primary">Administrator Credentials</h2>
        <p className="text-xs text-gray-500 mt-1">
          Manage administrator email address and change portal login password.
        </p>
      </div>

      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Username</label>
          <input
            type="text"
            disabled
            value={user?.username || 'admin'}
            className="w-full px-3.5 py-2 border rounded-lg text-sm bg-gray-100 text-gray-500 cursor-not-allowed font-mono"
          />
          <span className="text-[11px] text-gray-400 mt-0.5 block">Username cannot be modified.</span>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Admin Email Address</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="pt-4 border-t border-gray-100 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700">Change Password</h3>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Required only if changing password"
              className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary-dark transition cursor-pointer flex items-center gap-1.5 shadow-xs disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-sm">
              {saving ? 'hourglass_top' : 'lock_reset'}
            </span>
            <span>{saving ? 'Updating...' : 'Update Credentials'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
