import React, { useState, useRef } from 'react';
import { uploadService } from '../../../services/index.js';
import { useToast } from '../../../context/ToastContext.jsx';

export default function ImageUploader({ label = 'Image URL / Upload', value = '', onChange, previewHeight = 'h-24' }) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const { showToast } = useToast();

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (JPG, PNG, WebP)');
      return;
    }

    setUploading(true);
    try {
      const res = await uploadService.uploadImage(file);
      if (res?.url) {
        onChange(res.url);
        showToast('Image uploaded successfully!');
      } else {
        showToast('Upload failed. Please try again.');
      }
    } catch (err) {
      showToast(err.message || 'Image upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-1.5">
      {label && <label className="block text-xs font-semibold text-gray-700">{label}</label>}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="e.g. /images/donate.webp or upload a file"
            className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none pr-8"
          />
          {value && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 cursor-pointer"
              title="Clear image"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          )}
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />

        <button
          type="button"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
          className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 border border-gray-300 transition-colors disabled:opacity-50 cursor-pointer whitespace-nowrap shrink-0"
        >
          <span className="material-symbols-outlined text-sm">
            {uploading ? 'hourglass_top' : 'cloud_upload'}
          </span>
          <span>{uploading ? 'Uploading...' : 'Upload'}</span>
        </button>
      </div>

      {/* Image Preview Thumbnail */}
      {value && (
        <div className="relative mt-2 inline-block rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
          <img
            src={value}
            alt="Preview"
            className={`${previewHeight} w-auto object-cover rounded`}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/images/favicon.png';
            }}
          />
          <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded font-mono">
            Preview
          </span>
        </div>
      )}
    </div>
  );
}
