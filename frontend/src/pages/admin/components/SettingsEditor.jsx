import React, { useState, useEffect, useCallback } from 'react';
import { settingsService } from '../../../services/index.js';
import { useToast } from '../../../context/ToastContext.jsx';

export default function SettingsEditor() {
  const [settings, setSettings] = useState({
    site_name: '',
    site_tagline: '',
    contact_phone: '',
    emergency_phone: '',
    whatsapp_number: '',
    contact_email: '',
    office_address: '',
    facebook_url: '',
    instagram_url: '',
    working_hours: '',
    footer_copyright: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await settingsService.get();
      if (data && typeof data === 'object') {
        setSettings(prev => ({ ...prev, ...data }));
      }
    } catch (err) {
      console.error('[SettingsEditor] Load error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await settingsService.update(settings);
      showToast('Site settings updated and published live!');
    } catch (err) {
      showToast(err.message || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="inline-block animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mb-2"></div>
        <p className="text-xs font-semibold text-gray-500">Loading site settings...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display-lg text-xl font-bold text-primary">Global Site Settings & Branding</h2>
          <p className="text-xs text-gray-500 mt-1">
            Configure trust branding, emergency ambulance hotlines, office details, and social channels.
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2.5 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary-dark transition cursor-pointer flex items-center gap-1.5 shadow-xs disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-sm">
            {saving ? 'hourglass_top' : 'save'}
          </span>
          <span>{saving ? 'Saving...' : 'Save All Settings'}</span>
        </button>
      </div>

      {/* Grid Settings Panels */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Branding & Identity */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-primary font-bold text-sm border-b pb-2">
            <span className="material-symbols-outlined text-lg">badge</span>
            <span>Branding & Identity</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Organization / Trust Name</label>
            <input
              type="text"
              value={settings.site_name || ''}
              onChange={(e) => handleChange('site_name', e.target.value)}
              className="w-full px-3.5 py-2 border rounded-lg text-sm outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Tagline</label>
            <input
              type="text"
              value={settings.site_tagline || ''}
              onChange={(e) => handleChange('site_tagline', e.target.value)}
              className="w-full px-3.5 py-2 border rounded-lg text-sm outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Footer Copyright Notice</label>
            <input
              type="text"
              value={settings.footer_copyright || ''}
              onChange={(e) => handleChange('footer_copyright', e.target.value)}
              className="w-full px-3.5 py-2 border rounded-lg text-sm outline-none"
            />
          </div>
        </div>

        {/* Hotlines & Communication */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-primary font-bold text-sm border-b pb-2">
            <span className="material-symbols-outlined text-lg">contact_phone</span>
            <span>Emergency & Helpline Numbers</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              24/7 Ambulance & Emergency Line
            </label>
            <input
              type="text"
              value={settings.emergency_phone || ''}
              onChange={(e) => handleChange('emergency_phone', e.target.value)}
              className="w-full px-3.5 py-2 border rounded-lg text-sm text-red-600 font-bold outline-none"
              placeholder="+91 98221 99999"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Primary Office Phone
            </label>
            <input
              type="text"
              value={settings.contact_phone || ''}
              onChange={(e) => handleChange('contact_phone', e.target.value)}
              className="w-full px-3.5 py-2 border rounded-lg text-sm outline-none"
              placeholder="+91 98221 23456"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              WhatsApp Support Number (without + symbol)
            </label>
            <input
              type="text"
              value={settings.whatsapp_number || ''}
              onChange={(e) => handleChange('whatsapp_number', e.target.value)}
              className="w-full px-3.5 py-2 border rounded-lg text-sm outline-none"
              placeholder="919822123456"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Official Email Address
            </label>
            <input
              type="email"
              value={settings.contact_email || ''}
              onChange={(e) => handleChange('contact_email', e.target.value)}
              className="w-full px-3.5 py-2 border rounded-lg text-sm outline-none"
              placeholder="contact@reginaldotrust.org"
            />
          </div>
        </div>

        {/* Location & Timings */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-primary font-bold text-sm border-b pb-2">
            <span className="material-symbols-outlined text-lg">schedule</span>
            <span>Office Location & Hours</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Physical Office Address</label>
            <textarea
              rows={3}
              value={settings.office_address || ''}
              onChange={(e) => handleChange('office_address', e.target.value)}
              className="w-full px-3.5 py-2 border rounded-lg text-sm outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Working Hours</label>
            <input
              type="text"
              value={settings.working_hours || ''}
              onChange={(e) => handleChange('working_hours', e.target.value)}
              className="w-full px-3.5 py-2 border rounded-lg text-sm outline-none"
            />
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-primary font-bold text-sm border-b pb-2">
            <span className="material-symbols-outlined text-lg">share</span>
            <span>Social Media Channels</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Facebook Page URL</label>
            <input
              type="url"
              value={settings.facebook_url || ''}
              onChange={(e) => handleChange('facebook_url', e.target.value)}
              className="w-full px-3.5 py-2 border rounded-lg text-sm outline-none"
              placeholder="https://facebook.com/..."
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Instagram Profile URL</label>
            <input
              type="url"
              value={settings.instagram_url || ''}
              onChange={(e) => handleChange('instagram_url', e.target.value)}
              className="w-full px-3.5 py-2 border rounded-lg text-sm outline-none"
              placeholder="https://instagram.com/..."
            />
          </div>
        </div>
      </div>
    </form>
  );
}
