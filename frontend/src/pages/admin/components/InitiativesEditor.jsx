import React, { useState, useEffect, useCallback } from 'react';
import { initiativesService } from '../../../services/index.js';
import { useToast } from '../../../context/ToastContext.jsx';
import ImageUploader from './ImageUploader.jsx';

export default function InitiativesEditor() {
  const [initiatives, setInitiatives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({
    isOpen: false,
    mode: 'create', // 'create' | 'edit'
    data: {
      id: null,
      title: '',
      category: '',
      description: '',
      icon: 'volunteer_activism',
      image: '/images/donate.webp',
      button_text: 'See Details',
      button_url: '/services',
      order_index: 0,
      is_published: 1
    }
  });

  const { showToast } = useToast();

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const items = await initiativesService.getAll();
      setInitiatives(items || []);
    } catch (err) {
      console.error('[InitiativesEditor] Load error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleOpenCreate = () => {
    setModal({
      isOpen: true,
      mode: 'create',
      data: {
        id: null,
        title: '',
        category: 'Farming',
        description: '',
        icon: 'agriculture',
        image: '/images/raan-baji-1.webp',
        button_text: 'See Details',
        button_url: '/services',
        order_index: initiatives.length + 1,
        is_published: 1
      }
    });
  };

  const handleOpenEdit = (init) => {
    setModal({
      isOpen: true,
      mode: 'edit',
      data: { ...init }
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const { id, title, category, description, icon, image, button_text, button_url, order_index, is_published } = modal.data;

    try {
      if (modal.mode === 'create') {
        await initiativesService.create({
          title,
          category,
          description,
          icon,
          image,
          button_text,
          button_url,
          order_index: Number(order_index) || 0,
          is_published: is_published ? 1 : 0
        });
        showToast('New initiative published successfully!');
      } else {
        await initiativesService.update(id, {
          title,
          category,
          description,
          icon,
          image,
          button_text,
          button_url,
          order_index: Number(order_index) || 0,
          is_published: is_published ? 1 : 0
        });
        showToast('Initiative updated successfully!');
      }
      setModal({ isOpen: false, mode: 'create', data: {} });
      loadData();
    } catch (err) {
      showToast(err.message || 'Failed to save initiative');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this initiative? It will be removed from the home page.')) return;
    try {
      await initiativesService.delete(id);
      showToast('Initiative removed successfully');
      loadData();
    } catch (err) {
      showToast(err.message || 'Failed to delete');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="inline-block animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mb-2"></div>
        <p className="text-xs font-semibold text-gray-500">Loading initiatives...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display-lg text-xl font-bold text-primary">Core Initiatives CMS</h2>
          <p className="text-xs text-gray-500 mt-1">
            Manage the highlight program cards displayed on the Home page (Free Agriculture, Healthcare, Restoration, etc.)
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary-dark transition cursor-pointer inline-flex items-center gap-1.5 shadow-xs"
        >
          <span className="material-symbols-outlined text-sm">add_circle</span>
          <span>Add New Initiative</span>
        </button>
      </div>

      {/* Grid of Initiatives */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {initiatives.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden flex flex-col justify-between hover:border-primary/40 transition"
          >
            <div>
              {/* Image Banner */}
              <div className="relative aspect-[16/10] bg-gray-100 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/images/donate.webp';
                  }}
                />
                <div className="absolute top-2.5 left-2.5 flex gap-1.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary text-white uppercase tracking-wider">
                    {item.category}
                  </span>
                  {item.is_published === 0 && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-white uppercase tracking-wider">
                      Draft
                    </span>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-lg">
                    {item.icon || 'volunteer_activism'}
                  </span>
                  <h3 className="font-bold text-sm text-gray-900 line-clamp-1">{item.title}</h3>
                </div>
                <p className="text-xs text-gray-600 line-clamp-3">{item.description}</p>
              </div>
            </div>

            {/* Action Bar */}
            <div className="px-4 py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
              <span className="text-[11px] font-mono text-gray-400">
                Order: {item.order_index}
              </span>
              <div className="flex gap-1.5">
                <button
                  onClick={() => handleOpenEdit(item)}
                  className="p-1.5 rounded bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white transition cursor-pointer"
                  title="Edit Initiative"
                >
                  <span className="material-symbols-outlined text-base">edit</span>
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 rounded bg-red-50 text-red-700 hover:bg-red-600 hover:text-white transition cursor-pointer"
                  title="Delete Initiative"
                >
                  <span className="material-symbols-outlined text-base">delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Create / Edit */}
      {modal.isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <h3 className="font-display-lg text-lg font-bold text-primary mb-4">
              {modal.mode === 'create' ? 'Add New Initiative Card' : 'Edit Initiative Card'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={modal.data.title || ''}
                  onChange={(e) => setModal({ ...modal, data: { ...modal.data, title: e.target.value } })}
                  className="w-full px-3.5 py-2 border rounded-lg text-sm outline-none"
                  placeholder="e.g. Agriculture & Farming Support"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Category Badge</label>
                  <input
                    type="text"
                    required
                    value={modal.data.category || ''}
                    onChange={(e) => setModal({ ...modal, data: { ...modal.data, category: e.target.value } })}
                    className="w-full px-3.5 py-2 border rounded-lg text-sm outline-none"
                    placeholder="e.g. Farming, Healthcare"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Icon (Material Symbol)</label>
                  <input
                    type="text"
                    value={modal.data.icon || 'volunteer_activism'}
                    onChange={(e) => setModal({ ...modal, data: { ...modal.data, icon: e.target.value } })}
                    className="w-full px-3.5 py-2 border rounded-lg text-sm outline-none"
                    placeholder="e.g. agriculture, school"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={modal.data.description || ''}
                  onChange={(e) => setModal({ ...modal, data: { ...modal.data, description: e.target.value } })}
                  className="w-full px-3.5 py-2 border rounded-lg text-sm outline-none"
                />
              </div>

              <div>
                <ImageUploader
                  label="Card Thumbnail Image"
                  value={modal.data.image || ''}
                  onChange={(val) => setModal({ ...modal, data: { ...modal.data, image: val } })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Button Text</label>
                  <input
                    type="text"
                    value={modal.data.button_text || 'See Details'}
                    onChange={(e) => setModal({ ...modal, data: { ...modal.data, button_text: e.target.value } })}
                    className="w-full px-3.5 py-2 border rounded-lg text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Button URL</label>
                  <input
                    type="text"
                    value={modal.data.button_url || '/services'}
                    onChange={(e) => setModal({ ...modal, data: { ...modal.data, button_url: e.target.value } })}
                    className="w-full px-3.5 py-2 border rounded-lg text-sm outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Display Order</label>
                  <input
                    type="number"
                    value={modal.data.order_index ?? 0}
                    onChange={(e) => setModal({ ...modal, data: { ...modal.data, order_index: e.target.value } })}
                    className="w-full px-3.5 py-2 border rounded-lg text-sm outline-none"
                  />
                </div>
                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
                    <input
                      type="checkbox"
                      checked={modal.data.is_published !== 0}
                      onChange={(e) => setModal({ ...modal, data: { ...modal.data, is_published: e.target.checked ? 1 : 0 } })}
                      className="rounded text-primary focus:ring-primary h-4 w-4"
                    />
                    <span>Publish live</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setModal({ isOpen: false, mode: 'create', data: {} })}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-primary hover:bg-primary-dark rounded-lg cursor-pointer shadow-xs"
                >
                  Save Initiative
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
