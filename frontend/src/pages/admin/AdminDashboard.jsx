import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  adminService,
  contactService,
  eventsService,
  galleryService,
  servicesService,
  initiativesService
} from '../../services/index.js';
import { useToast } from '../../context/ToastContext.jsx';

import Sidebar from './components/Sidebar.jsx';
import ImageUploader from './components/ImageUploader.jsx';
import PageSectionEditor from './components/PageSectionEditor.jsx';
import InitiativesEditor from './components/InitiativesEditor.jsx';
import SettingsEditor from './components/SettingsEditor.jsx';
import AdminProfileEditor from './components/AdminProfileEditor.jsx';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [user, setUser] = useState(adminService.getUser());
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Collections Data
  const [stats, setStats] = useState(null);
  const [inquiries, setInquiries] = useState([]);
  const [serviceRequests, setServiceRequests] = useState([]);
  const [servicesCatalog, setServicesCatalog] = useState([]);
  const [initiativesCount, setInitiativesCount] = useState(0);
  const [events, setEvents] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [galleryCategories, setGalleryCategories] = useState([]);
  const [galleryCategoryFilter, setGalleryCategoryFilter] = useState('all');
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategory, setNewCategory] = useState({ id: '', label: '' });
  const [inquiryFilter, setInquiryFilter] = useState('all');

  // Modals for CRUD
  const [serviceModal, setServiceModal] = useState({
    isOpen: false,
    mode: 'create',
    data: { id: null, title: '', short_title: '', description: '', icon: 'volunteer_activism', pointsText: '', order_index: 0 }
  });

  const [eventModal, setEventModal] = useState({
    isOpen: false,
    mode: 'create',
    data: { id: null, day: '', mon: 'Aug 2026', tag: 'Community Outreach', title: '', description: '', is_extra: 0 }
  });

  const [galleryModal, setGalleryModal] = useState({
    isOpen: false,
    mode: 'create',
    data: { id: null, category: 'community', tag: 'Community Care', caption: '', src: '/images/donate.webp', alt: '' }
  });

  // Auth Protection
  useEffect(() => {
    if (!adminService.isAuthenticated()) {
      navigate('/admin/login');
    }
  }, [navigate]);

  // Load Overview & Metrics
  const loadAllData = useCallback(async () => {
    setLoading(true);
    try {
      const [
        statsRes,
        contactsRes,
        requestsRes,
        catalogRes,
        initiativesRes,
        eventsRes,
        galleryRes,
        categoriesRes
      ] = await Promise.all([
        adminService.getStats().catch(() => null),
        contactService.getAll().catch(() => ({ data: [] })),
        servicesService.getAllRequests().catch(() => ({ data: [] })),
        servicesService.getCatalog().catch(() => ({ data: [] })),
        initiativesService.getAll().catch(() => []),
        eventsService.getAll().catch(() => ({ data: [] })),
        galleryService.getByCategory('all').catch(() => ({ data: [] })),
        galleryService.getCategories().catch(() => [])
      ]);

      if (statsRes?.stats) setStats(statsRes.stats);
      if (contactsRes?.data) setInquiries(contactsRes.data);
      if (requestsRes?.data) setServiceRequests(requestsRes.data);
      if (catalogRes?.data) setServicesCatalog(catalogRes.data);
      if (initiativesRes) setInitiativesCount(initiativesRes.length);
      if (eventsRes?.data) setEvents(eventsRes.data);
      if (galleryRes?.data) setGallery(galleryRes.data);
      if (Array.isArray(categoriesRes)) setGalleryCategories(categoriesRes);
    } catch (err) {
      console.error('[AdminDashboard] Load error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  const handleLogout = () => {
    adminService.logout();
    showToast('Logged out successfully');
    navigate('/admin/login');
  };

  // === SERVICES CATALOG CRUD ===
  const handleOpenServiceCreate = () => {
    setServiceModal({
      isOpen: true,
      mode: 'create',
      data: { id: null, title: '', short_title: '', description: '', icon: 'volunteer_activism', pointsText: '', order_index: servicesCatalog.length + 1 }
    });
  };

  const handleOpenServiceEdit = (svc) => {
    const pts = Array.isArray(svc.points) ? svc.points.join('\n') : '';
    setServiceModal({
      isOpen: true,
      mode: 'edit',
      data: {
        id: svc.id,
        title: svc.title,
        short_title: svc.short_title || svc.title,
        description: svc.description,
        icon: svc.icon || 'volunteer_activism',
        pointsText: pts,
        order_index: svc.order_index || 0
      }
    });
  };

  const handleSaveService = async (e) => {
    e.preventDefault();
    const { id, title, short_title, description, icon, pointsText, order_index } = serviceModal.data;
    const points = pointsText.split('\n').map(p => p.trim()).filter(Boolean);

    try {
      if (serviceModal.mode === 'create') {
        await servicesService.createService({ title, short_title, description, icon, points, order_index });
        showToast('New service program added to catalog!');
      } else {
        await servicesService.updateService(id, { title, short_title, description, icon, points, order_index });
        showToast('Service details updated successfully!');
      }
      setServiceModal({ isOpen: false, mode: 'create', data: {} });
      loadAllData();
    } catch (err) {
      showToast(err.message || 'Failed to save service');
    }
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm('Are you sure you want to remove this service from the website?')) return;
    try {
      await servicesService.deleteService(id);
      showToast('Service removed from website');
      loadAllData();
    } catch (err) {
      showToast(err.message || 'Failed to delete service');
    }
  };

  // === EVENTS CRUD ===
  const handleOpenEventCreate = () => {
    setEventModal({
      isOpen: true,
      mode: 'create',
      data: { id: null, day: '', mon: 'Aug 2026', tag: 'Community Outreach', title: '', description: '', is_extra: 0 }
    });
  };

  const handleOpenEventEdit = (ev) => {
    setEventModal({
      isOpen: true,
      mode: 'edit',
      data: { ...ev }
    });
  };

  const handleSaveEvent = async (e) => {
    e.preventDefault();
    const { id, day, mon, tag, title, description, is_extra } = eventModal.data;
    try {
      if (eventModal.mode === 'create') {
        await eventsService.create({ day, mon, tag, title, description, is_extra: Number(is_extra) || 0 });
        showToast('New event published to /ourwork!');
      } else {
        await eventsService.update(id, { day, mon, tag, title, description, is_extra: Number(is_extra) || 0 });
        showToast('Event updated successfully!');
      }
      setEventModal({ isOpen: false, mode: 'create', data: {} });
      loadAllData();
    } catch (err) {
      showToast(err.message || 'Failed to save event');
    }
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm('Delete this event from the website?')) return;
    try {
      await eventsService.delete(id);
      showToast('Event deleted from website');
      loadAllData();
    } catch (err) {
      showToast(err.message || 'Failed to delete event');
    }
  };

  // === GALLERY CRUD ===
  const handleOpenGalleryCreate = () => {
    setGalleryModal({
      isOpen: true,
      mode: 'create',
      data: { id: null, category: 'community', tag: 'Community Care', caption: '', src: '/images/donate.webp', alt: '' }
    });
  };

  const handleOpenGalleryEdit = (item) => {
    setGalleryModal({
      isOpen: true,
      mode: 'edit',
      data: { ...item }
    });
  };

  const handleSaveGallery = async (e) => {
    e.preventDefault();
    const { id, category, tag, caption, src, alt } = galleryModal.data;
    try {
      if (galleryModal.mode === 'create') {
        await galleryService.create({ category, tag, caption, src, alt });
        showToast('New photograph added to Gallery!');
      } else {
        await galleryService.update(id, { category, tag, caption, src, alt });
        showToast('Gallery photograph details updated!');
      }
      setGalleryModal({ isOpen: false, mode: 'create', data: {} });
      loadAllData();
    } catch (err) {
      showToast(err.message || 'Failed to save gallery item');
    }
  };

  const handleDeleteGallery = async (id) => {
    if (!window.confirm('Delete this photograph from the Gallery?')) return;
    try {
      await galleryService.delete(id);
      showToast('Photo removed from Gallery');
      loadAllData();
    } catch (err) {
      showToast(err.message || 'Failed to delete photo');
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.label.trim()) {
      showToast('Please provide a category label');
      return;
    }
    try {
      const res = await galleryService.addCategory(newCategory);
      if (res?.data) setGalleryCategories(res.data);
      setShowCategoryModal(false);
      setNewCategory({ id: '', label: '' });
      showToast(`Category sub-section "${newCategory.label}" added!`);
      loadAllData();
    } catch (err) {
      showToast(err.message || 'Failed to add category');
    }
  };

  const handleDeleteCategory = async (catId) => {
    if (!window.confirm(`Delete sub-section category "${catId}"?`)) return;
    try {
      const res = await galleryService.deleteCategory(catId);
      if (res?.data) setGalleryCategories(res.data);
      if (galleryCategoryFilter === catId) setGalleryCategoryFilter('all');
      showToast(`Category "${catId}" deleted`);
      loadAllData();
    } catch (err) {
      showToast(err.message || 'Failed to delete category');
    }
  };

  // === CITIZEN INQUIRIES & STATUS UPDATE ===
  const handleUpdateContactStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'new' ? 'in-progress' : currentStatus === 'in-progress' ? 'resolved' : 'new';
    try {
      await contactService.updateStatus(id, nextStatus);
      showToast(`Inquiry status updated to ${nextStatus}`);
      loadAllData();
    } catch (err) {
      showToast(err.message || 'Failed to update status');
    }
  };

  const handleDeleteContact = async (id) => {
    if (!window.confirm('Are you sure you want to delete this citizen inquiry?')) return;
    try {
      await adminService.deleteContact(id);
      showToast('Inquiry deleted successfully');
      loadAllData();
    } catch (err) {
      showToast(err.message || 'Failed to delete');
    }
  };

  const filteredInquiries = inquiries.filter(inq => {
    if (inquiryFilter === 'all') return true;
    return inq.status === inquiryFilter;
  });

  const unaddressedCount = inquiries.filter(i => i.status === 'new').length;

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans text-gray-900">
      {/* Responsive Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        badges={{
          initiatives: initiativesCount,
          services: servicesCatalog.length,
          events: events.length,
          gallery: gallery.length,
          inquiries: inquiries.length,
          inquiriesNew: unaddressedCount,
          requests: serviceRequests.length
        }}
        user={user}
        onLogout={handleLogout}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

        {/* Main Container */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Top App Header */}
          <header className="bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm">
            <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setMobileOpen(true)}
                  className="lg:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-100 cursor-pointer"
                  title="Open menu"
                >
                  <span className="material-symbols-outlined text-2xl">menu</span>
                </button>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block">
                    Reginaldo Trust Admin
                  </span>
                  <h2 className="text-base sm:text-lg font-bold text-gray-900">
                    {({
                      'overview':        '🏠 Dashboard',
                      'page-home':       '✏️ Home Page',
                      'page-about':      '✏️ About Us',
                      'page-services':   '✏️ Services',
                      'page-ourwork':    '✏️ Our Work',
                      'page-gallery':    '✏️ Gallery Page',
                      'page-contact':    '✏️ Contact Page',
                      'initiatives':     '📣 Initiatives',
                      'events':          '📅 Events',
                      'gallery-photos':  '🖼️ Photos',
                      'inquiries':       '📬 Messages',
                      'requests':        '🚑 Emergency Requests',
                      'settings':        '⚙️ Website Settings',
                      'profile':         '🔒 Change Password',
                    })[activeTab] || activeTab}
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={loadAllData}
                  disabled={loading}
                  className="p-2 text-gray-500 hover:text-primary hover:bg-gray-100 rounded-xl transition cursor-pointer"
                  title="Refresh"
                >
                  <span className="material-symbols-outlined text-xl">refresh</span>
                </button>
                <a
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold bg-primary text-white hover:bg-primary/90 transition shadow-sm"
                >
                  <span>View Website</span>
                  <span className="material-symbols-outlined text-base">open_in_new</span>
                </a>
              </div>
            </div>
          </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {/* TAB: DASHBOARD OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Welcome Banner */}
              <div className="bg-gradient-to-br from-primary to-[#1a2456] text-white rounded-3xl p-7 sm:p-10 shadow-lg relative overflow-hidden">
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 text-white text-xs font-semibold mb-4">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>Website is Live</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Welcome to the Admin Panel 👋</h1>
                  <p className="mt-2 text-sm text-white/80 leading-relaxed max-w-xl">
                    You can edit every part of the Reginaldo Trust website from here — text, photos, events, and more. Choose what you'd like to do below.
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    <a href="/" target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-primary rounded-xl text-sm font-bold hover:bg-white/90 transition shadow-sm">
                      <span className="material-symbols-outlined text-base">open_in_new</span>
                      View Live Website
                    </a>
                    <button onClick={() => setActiveTab('page-home')}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/15 text-white rounded-xl text-sm font-bold hover:bg-white/25 transition">
                      <span className="material-symbols-outlined text-base">edit</span>
                      Edit Home Page
                    </button>
                    <button onClick={() => setActiveTab('gallery-photos')}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/15 text-white rounded-xl text-sm font-bold hover:bg-white/25 transition">
                      <span className="material-symbols-outlined text-base">add_photo_alternate</span>
                      Add a Photo
                    </button>
                  </div>
                </div>
              </div>

              {/* New Messages Alert */}
              {unaddressedCount > 0 && (
                <button onClick={() => setActiveTab('inquiries')}
                  className="w-full bg-amber-50 border-2 border-amber-200 rounded-2xl p-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-amber-100 transition text-left">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-amber-600 text-2xl">mark_email_unread</span>
                    </div>
                    <div>
                      <p className="font-bold text-amber-900 text-base">
                        📬 {unaddressedCount} new {unaddressedCount === 1 ? 'message' : 'messages'} from citizens
                      </p>
                      <p className="text-sm text-amber-700 mt-0.5">Tap here to read and respond</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-amber-400 text-xl flex-shrink-0">chevron_right</span>
                </button>
              )}

              {/* Quick stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: 'inquiries',      icon: 'mail',     label: 'Messages',    value: inquiries.length  },
                  { id: 'initiatives',    icon: 'campaign', label: 'Initiatives', value: initiativesCount  },
                  { id: 'events',         icon: 'event',    label: 'Events',      value: events.length     },
                  { id: 'gallery-photos', icon: 'image',    label: 'Photos',      value: gallery.length    },
                ].map(item => (
                  <button key={item.id} onClick={() => setActiveTab(item.id)}
                    className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:border-primary hover:shadow-md transition cursor-pointer text-left group">
                    <span className="material-symbols-outlined text-gray-400 group-hover:text-primary text-2xl mb-2 block">{item.icon}</span>
                    <div className="text-2xl font-black text-gray-900">{item.value}</div>
                    <div className="text-xs text-gray-500 font-semibold mt-0.5">{item.label}</div>
                  </button>
                ))}
              </div>

              {/* Quick page editors */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h3 className="font-bold text-base text-gray-900 mb-4">✏️ Which page do you want to edit?</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {[
                    { id: 'page-home',     label: '🏠 Home Page',   desc: 'Banner, stats, mission, donations' },
                    { id: 'page-about',    label: '📖 About Us',    desc: 'Our story, vision, founder bio' },
                    { id: 'page-services', label: '🏥 Services',    desc: 'Programs, helpline, service list' },
                    { id: 'page-ourwork',  label: '💼 Our Work',    desc: 'Community drives, events, impact' },
                    { id: 'page-gallery',  label: '🖼️ Gallery',    desc: 'Photo archive heading & intro text' },
                    { id: 'page-contact',  label: '📞 Contact',     desc: 'Office address, phone, working hours' },
                  ].map((p) => (
                    <button key={p.id} onClick={() => setActiveTab(p.id)}
                      className="p-4 rounded-2xl border border-gray-100 hover:border-primary hover:bg-primary/5 text-left transition cursor-pointer group">
                      <div className="font-bold text-sm text-gray-900 group-hover:text-primary flex items-center justify-between">
                        <span>{p.label}</span>
                        <span className="material-symbols-outlined text-sm text-gray-300 group-hover:text-primary">arrow_forward</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{p.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: PAGE SECTION EDITORS (REQUIREMENTS 4 & 5) */}
          {activeTab === 'page-home' && <PageSectionEditor pageSlug="home" pageTitle="Home Page" />}
          {activeTab === 'page-about' && <PageSectionEditor pageSlug="about" pageTitle="About Us" />}
          {activeTab === 'page-services' && <PageSectionEditor pageSlug="services" pageTitle="Our Services" />}
          {activeTab === 'page-ourwork' && <PageSectionEditor pageSlug="ourwork" pageTitle="Our Work & Impact" />}
          {activeTab === 'page-gallery' && <PageSectionEditor pageSlug="gallery" pageTitle="Photo Gallery" />}
          {activeTab === 'page-contact' && <PageSectionEditor pageSlug="contact" pageTitle="Contact & Office" />}

          {/* TAB: CORE INITIATIVES CMS */}
          {activeTab === 'initiatives' && <InitiativesEditor />}

          {/* TAB: SERVICES CATALOG CMS */}
          {activeTab === 'services-catalog' && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden">
              <div className="p-5 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-display-lg text-lg font-bold text-primary">Services Catalog CMS</h3>
                  <p className="text-xs text-gray-500">Manage the 6 free core welfare programs and bullet points</p>
                </div>
                <button
                  onClick={handleOpenServiceCreate}
                  className="px-4 py-2 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary-dark transition cursor-pointer inline-flex items-center gap-1.5 shadow-2xs"
                >
                  <span className="material-symbols-outlined text-sm">add_circle</span>
                  <span>Add New Service</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-600">
                  <thead className="bg-gray-50 text-xs uppercase font-semibold text-gray-500 border-b border-gray-200">
                    <tr>
                      <th className="px-5 py-3.5">Icon & Title</th>
                      <th className="px-5 py-3.5">Short Title</th>
                      <th className="px-5 py-3.5">Description</th>
                      <th className="px-5 py-3.5">Points</th>
                      <th className="px-5 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {servicesCatalog.map((svc) => (
                      <tr key={svc.id} className="hover:bg-gray-50/80 transition">
                        <td className="px-5 py-4 font-semibold text-gray-900">
                          <div className="flex items-center gap-2.5">
                            <span className="material-symbols-outlined text-primary bg-primary/10 p-2 rounded-lg text-xl">
                              {svc.icon || 'medical_services'}
                            </span>
                            <span>{svc.title}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
                            {svc.short_title}
                          </span>
                        </td>
                        <td className="px-5 py-4 max-w-xs truncate" title={svc.description}>
                          {svc.description}
                        </td>
                        <td className="px-5 py-4 text-xs text-gray-500">
                          {Array.isArray(svc.points) ? `${svc.points.length} points` : '—'}
                        </td>
                        <td className="px-5 py-4 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              onClick={() => handleOpenServiceEdit(svc)}
                              className="p-1.5 rounded bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white transition cursor-pointer"
                              title="Edit Service"
                            >
                              <span className="material-symbols-outlined text-base">edit</span>
                            </button>
                            <button
                              onClick={() => handleDeleteService(svc.id)}
                              className="p-1.5 rounded bg-red-50 text-red-700 hover:bg-red-600 hover:text-white transition cursor-pointer"
                              title="Delete Service"
                            >
                              <span className="material-symbols-outlined text-base">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: EVENTS CMS */}
          {activeTab === 'events' && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">📅 Events & Community Drives</h3>
                  <p className="text-sm text-gray-500 mt-0.5">Add, edit, or remove events shown on the Our Work page.</p>
                </div>
                <button
                  onClick={handleOpenEventCreate}
                  className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition cursor-pointer inline-flex items-center gap-1.5 shadow-sm"
                >
                  <span className="material-symbols-outlined text-base">add</span>
                  <span>Add New Event</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-600">
                  <thead className="bg-gray-50 text-xs uppercase font-semibold text-gray-500 border-b border-gray-200">
                    <tr>
                      <th className="px-5 py-3.5">Date</th>
                      <th className="px-5 py-3.5">Tag</th>
                      <th className="px-5 py-3.5">Event Title</th>
                      <th className="px-5 py-3.5">Description</th>
                      <th className="px-5 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {events.map((ev) => (
                      <tr key={ev.id} className="hover:bg-gray-50/80 transition">
                        <td className="px-5 py-4 whitespace-nowrap">
                          <span className="font-bold text-primary text-base">{ev.day}</span>{' '}
                          <span className="text-xs text-gray-500">{ev.mon}</span>
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                            {ev.tag}
                          </span>
                        </td>
                        <td className="px-5 py-4 font-semibold text-gray-900">{ev.title}</td>
                        <td className="px-5 py-4 max-w-xs truncate" title={ev.description}>{ev.description}</td>
                        <td className="px-5 py-4 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              onClick={() => handleOpenEventEdit(ev)}
                              className="p-1.5 rounded bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white transition cursor-pointer"
                              title="Edit Event"
                            >
                              <span className="material-symbols-outlined text-base">edit</span>
                            </button>
                            <button
                              onClick={() => handleDeleteEvent(ev.id)}
                              className="p-1.5 rounded bg-red-50 text-red-700 hover:bg-red-600 hover:text-white transition cursor-pointer"
                              title="Delete Event"
                            >
                              <span className="material-symbols-outlined text-base">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: GALLERY PHOTOS CMS */}
          {activeTab === 'gallery-photos' && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">🖼️ Photos</h3>
                  <p className="text-sm text-gray-500 mt-0.5">Add, edit, or remove photos shown in the Gallery page.</p>
                </div>
                <button
                  type="button"
                  onClick={handleOpenGalleryCreate}
                  className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition cursor-pointer inline-flex items-center gap-1.5 shadow-sm"
                >
                  <span className="material-symbols-outlined text-base">add_photo_alternate</span>
                  <span>Add Photo</span>
                </button>
              </div>

              {/* Gallery Categories Bar */}
              <div className="px-5 py-3.5 bg-slate-50 border-b border-gray-200 flex items-center justify-between gap-3 overflow-x-auto">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-gray-600 uppercase tracking-wider mr-1 flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm text-primary">label</span>
                    <span>Categories:</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setGalleryCategoryFilter('all')}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition cursor-pointer ${
                      galleryCategoryFilter === 'all'
                        ? 'bg-primary text-white shadow-xs'
                        : 'bg-white text-gray-700 hover:bg-gray-200 border border-gray-200'
                    }`}
                  >
                    All Photos ({gallery.length})
                  </button>
                  {galleryCategories.map((cat) => {
                    const count = gallery.filter((p) => p.category === cat.id).length;
                    const isCustom = !['community', 'restoration', 'agriculture', 'education', 'livelihood', 'environment'].includes(cat.id);
                    return (
                      <span
                        key={cat.id}
                        className={`inline-flex items-center rounded-full text-xs font-semibold pl-3 pr-1.5 py-1 border transition ${
                          galleryCategoryFilter === cat.id
                            ? 'bg-primary text-white border-primary shadow-xs'
                            : 'bg-white text-gray-700 hover:bg-gray-100 border-gray-200'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => setGalleryCategoryFilter(cat.id)}
                          className="cursor-pointer"
                        >
                          {cat.label} ({count})
                        </button>
                        {isCustom && (
                          <button
                            type="button"
                            onClick={() => handleDeleteCategory(cat.id)}
                            className="ml-1.5 p-0.5 rounded-full hover:bg-red-100 hover:text-red-700 transition cursor-pointer"
                            title={`Delete category "${cat.label}"`}
                          >
                            <span className="material-symbols-outlined text-[13px]">close</span>
                          </button>
                        )}
                      </span>
                    );
                  })}
                  <button
                    type="button"
                    onClick={() => {
                      setNewCategory({ id: '', label: '' });
                      setShowCategoryModal(true);
                    }}
                    className="px-2.5 py-1 rounded-full text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/20 transition cursor-pointer inline-flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-xs">add</span>
                    <span>New Category</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-5">
                {(galleryCategoryFilter === 'all' ? gallery : gallery.filter(p => p.category === galleryCategoryFilter)).map((photo) => (
                  <div key={photo.id} className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden group flex flex-col justify-between">
                    <div className="relative aspect-[4/3] bg-gray-200 overflow-hidden">
                      <img
                        src={photo.src}
                        alt={photo.alt}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/images/donate.webp';
                        }}
                      />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold bg-black/70 text-white uppercase tracking-wider backdrop-blur-xs">
                        {photo.category}
                      </span>
                    </div>
                    <div className="p-3">
                      <span className="text-[11px] font-semibold text-primary block">{photo.tag}</span>
                      <h5 className="font-semibold text-xs text-gray-900 line-clamp-2 mt-0.5" title={photo.caption}>{photo.caption}</h5>
                      <div className="mt-3 pt-2 border-t border-gray-200 flex justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenGalleryEdit(photo)}
                          className="p-1 rounded bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white transition cursor-pointer"
                          title="Edit Photo"
                        >
                          <span className="material-symbols-outlined text-sm">edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteGallery(photo.id)}
                          className="p-1 rounded bg-red-50 text-red-700 hover:bg-red-600 hover:text-white transition cursor-pointer"
                          title="Delete Photo"
                        >
                          <span className="material-symbols-outlined text-sm">delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: CITIZEN ENQUIRIES */}
          {activeTab === 'inquiries' && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">📬 Messages from Citizens</h3>
                  <p className="text-sm text-gray-500 mt-0.5">People who filled in the contact form on the website.</p>
                </div>

                {/* Filter Tabs */}
                <div className="flex bg-gray-100 p-1 rounded-lg">
                  {['all', 'new', 'in-progress', 'resolved'].map((f) => (
                    <button
                      key={f}
                      onClick={() => setInquiryFilter(f)}
                      className={`px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-wider transition cursor-pointer ${
                        inquiryFilter === f ? 'bg-white text-primary shadow-xs font-bold' : 'text-gray-600 hover:text-primary'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {filteredInquiries.length === 0 ? (
                <div className="p-12 text-center text-gray-500">
                  <span className="material-symbols-outlined text-4xl mb-2 text-gray-400">inbox</span>
                  <p className="font-semibold">No {inquiryFilter !== 'all' ? inquiryFilter : ''} inquiries found.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-gray-50 text-xs uppercase font-semibold text-gray-500 border-b border-gray-200">
                      <tr>
                        <th className="px-5 py-3.5">Citizen Name</th>
                        <th className="px-5 py-3.5">Contact Details</th>
                        <th className="px-5 py-3.5">Service Category</th>
                        <th className="px-5 py-3.5">Message</th>
                        <th className="px-5 py-3.5">Status</th>
                        <th className="px-5 py-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredInquiries.map((inq) => (
                        <tr key={inq.id} className="hover:bg-gray-50/80 transition">
                          <td className="px-5 py-4 font-semibold text-gray-900 whitespace-nowrap">
                            {inq.name}
                            <span className="block text-xs font-normal text-gray-400">{inq.created_at}</span>
                          </td>
                          <td className="px-5 py-4">
                            <a href={`tel:${inq.phone}`} className="text-primary hover:underline font-semibold block">{inq.phone}</a>
                            {inq.email && <span className="text-xs text-gray-500 block">{inq.email}</span>}
                          </td>
                          <td className="px-5 py-4">
                            <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                              {inq.service}
                            </span>
                          </td>
                          <td className="px-5 py-4 max-w-xs truncate" title={inq.message}>{inq.message}</td>
                          <td className="px-5 py-4 whitespace-nowrap">
                            <button
                              onClick={() => handleUpdateContactStatus(inq.id, inq.status)}
                              className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider cursor-pointer ${
                                inq.status === 'resolved'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : inq.status === 'in-progress'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}
                              title="Click to cycle status: new -> in-progress -> resolved"
                            >
                              {inq.status}
                            </button>
                          </td>
                          <td className="px-5 py-4 text-right whitespace-nowrap">
                            <div className="inline-flex items-center gap-1.5">
                              <a
                                href={`https://wa.me/91${inq.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(inq.name)},%20regarding%20your%20inquiry%20to%20Reginaldo%20Trust...`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white transition"
                                title="Reply via WhatsApp"
                              >
                                <span className="material-symbols-outlined text-base">chat</span>
                              </a>
                              <button
                                onClick={() => handleDeleteContact(inq.id)}
                                className="p-1.5 rounded bg-red-50 text-red-700 hover:bg-red-600 hover:text-white transition cursor-pointer"
                                title="Delete inquiry"
                              >
                                <span className="material-symbols-outlined text-base">delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB: EMERGENCY REQUESTS */}
          {activeTab === 'requests' && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden">
              <div className="p-5 border-b border-gray-200">
                <h3 className="font-display-lg text-lg font-bold text-primary">Emergency & Assistance Applications</h3>
                <p className="text-xs text-gray-500">Urgent citizen requests for 24/7 Ambulance, Agriculture Machinery, and House Repairs</p>
              </div>

              {serviceRequests.length === 0 ? (
                <div className="p-12 text-center text-gray-500">
                  <span className="material-symbols-outlined text-4xl mb-2 text-gray-400">emergency</span>
                  <p className="font-semibold">No emergency requests registered yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-gray-50 text-xs uppercase font-semibold text-gray-500 border-b border-gray-200">
                      <tr>
                        <th className="px-5 py-3.5">Applicant</th>
                        <th className="px-5 py-3.5">Phone & Village</th>
                        <th className="px-5 py-3.5">Category</th>
                        <th className="px-5 py-3.5">Urgency</th>
                        <th className="px-5 py-3.5">Details</th>
                        <th className="px-5 py-3.5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {serviceRequests.map((req) => (
                        <tr key={req.id} className="hover:bg-gray-50/80 transition">
                          <td className="px-5 py-4 font-semibold text-gray-900">{req.applicant_name}</td>
                          <td className="px-5 py-4">
                            <a href={`tel:${req.phone}`} className="text-primary font-semibold block">{req.phone}</a>
                            <span className="text-xs text-gray-500">{req.village}</span>
                          </td>
                          <td className="px-5 py-4">
                            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                              {req.category}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${req.urgency === 'emergency' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-700'}`}>
                              {req.urgency}
                            </span>
                          </td>
                          <td className="px-5 py-4">{req.details || '—'}</td>
                          <td className="px-5 py-4">
                            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                              {req.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB: SITE SETTINGS & SEO */}
          {activeTab === 'settings' && <SettingsEditor />}

          {/* TAB: ADMIN CREDENTIALS */}
          {activeTab === 'profile' && <AdminProfileEditor user={user} onUserUpdated={setUser} />}
        </main>
      </div>

      {/* MODAL: SERVICE CREATE / EDIT */}
      {serviceModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-gray-900">
                {serviceModal.mode === 'create' ? '➕ Add New Service' : '✏️ Edit Service'}
              </h3>
              <button type="button" onClick={() => setServiceModal({ isOpen: false, mode: 'create', data: {} })} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>
            <form onSubmit={handleSaveService} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1">Service Name</label>
                <input
                  type="text"
                  required
                  value={serviceModal.data.title || ''}
                  onChange={(e) => setServiceModal({ ...serviceModal, data: { ...serviceModal.data, title: e.target.value } })}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder="e.g. Clean & Green Curtorim"
                />
                <p className="mt-1 text-xs text-gray-400">The full name of the service shown on the website.</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-1">Short Name</label>
                  <input
                    type="text"
                    required
                    value={serviceModal.data.short_title || ''}
                    onChange={(e) => setServiceModal({ ...serviceModal, data: { ...serviceModal.data, short_title: e.target.value } })}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-primary"
                    placeholder="e.g. Clean & Green"
                  />
                  <p className="mt-1 text-xs text-gray-400">Shorter version for the tab button.</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-1">Icon name</label>
                  <input
                    type="text"
                    value={serviceModal.data.icon || 'volunteer_activism'}
                    onChange={(e) => setServiceModal({ ...serviceModal, data: { ...serviceModal.data, icon: e.target.value } })}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-primary"
                    placeholder="e.g. recycling"
                  />
                  <p className="mt-1 text-xs text-gray-400">From <a href="https://fonts.google.com/icons" target="_blank" rel="noreferrer" className="text-primary underline">Google Icons</a></p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1">Short Description</label>
                <textarea
                  required
                  rows={2}
                  value={serviceModal.data.description || ''}
                  onChange={(e) => setServiceModal({ ...serviceModal, data: { ...serviceModal.data, description: e.target.value } })}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-primary"
                />
                <p className="mt-1 text-xs text-gray-400">A 1–2 sentence summary of what this service offers.</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1">Bullet Points (one per line)</label>
                <textarea
                  rows={4}
                  value={serviceModal.data.pointsText || ''}
                  onChange={(e) => setServiceModal({ ...serviceModal, data: { ...serviceModal.data, pointsText: e.target.value } })}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-primary"
                  placeholder={"Free tractors and machinery\nFree seeds and organic fertilisers\nFree soil testing kits"}
                />
                <p className="mt-1 text-xs text-gray-400">Each line becomes one bullet point. Press Enter between each item.</p>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setServiceModal({ isOpen: false, mode: 'create', data: {} })}
                  className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-bold text-white bg-primary hover:bg-primary/90 rounded-xl cursor-pointer shadow-sm"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EVENT CREATE / EDIT */}
      {eventModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-gray-900">
                {eventModal.mode === 'create' ? '➕ Add New Event' : '✏️ Edit Event'}
              </h3>
              <button type="button" onClick={() => setEventModal({ isOpen: false, mode: 'create', data: {} })} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>
            <form onSubmit={handleSaveEvent} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-1">Day number</label>
                  <input
                    type="text"
                    required
                    value={eventModal.data.day || ''}
                    onChange={(e) => setEventModal({ ...eventModal, data: { ...eventModal.data, day: e.target.value } })}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-primary"
                    placeholder="e.g. 15"
                  />
                  <p className="mt-1 text-xs text-gray-400">Just the day number.</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-1">Month & Year</label>
                  <input
                    type="text"
                    required
                    value={eventModal.data.mon || ''}
                    onChange={(e) => setEventModal({ ...eventModal, data: { ...eventModal.data, mon: e.target.value } })}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-primary"
                    placeholder="e.g. Aug 2026"
                  />
                  <p className="mt-1 text-xs text-gray-400">e.g. Jan 2026</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1">Category</label>
                <input
                  type="text"
                  required
                  value={eventModal.data.tag || ''}
                  onChange={(e) => setEventModal({ ...eventModal, data: { ...eventModal.data, tag: e.target.value } })}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-primary"
                  placeholder="e.g. Agriculture, Healthcare, Education"
                />
                <p className="mt-1 text-xs text-gray-400">A short label for the type of event (shown as a coloured badge).</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1">Event Name</label>
                <input
                  type="text"
                  required
                  value={eventModal.data.title || ''}
                  onChange={(e) => setEventModal({ ...eventModal, data: { ...eventModal.data, title: e.target.value } })}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-primary"
                  placeholder="e.g. Free Medical Camp at Curtorim Church Ground"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1">What happened at this event?</label>
                <textarea
                  required
                  rows={3}
                  value={eventModal.data.description || ''}
                  onChange={(e) => setEventModal({ ...eventModal, data: { ...eventModal.data, description: e.target.value } })}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-primary"
                  placeholder="Describe the event in 1–3 sentences..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEventModal({ isOpen: false, mode: 'create', data: {} })}
                  className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-bold text-white bg-primary hover:bg-primary/90 rounded-xl cursor-pointer shadow-sm"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: GALLERY CREATE / EDIT */}
      {galleryModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-gray-900">
                {galleryModal.mode === 'create' ? '🖼️ Add New Photo' : '✏️ Edit Photo'}
              </h3>
              <button type="button" onClick={() => setGalleryModal({ isOpen: false, mode: 'create', data: {} })} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>
            <form onSubmit={handleSaveGallery} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-1">Category</label>
                  <select
                    value={galleryModal.data.category || (galleryCategories[0]?.id || 'community')}
                    onChange={(e) => setGalleryModal({ ...galleryModal, data: { ...galleryModal.data, category: e.target.value } })}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm outline-none bg-white focus:border-primary"
                  >
                    {galleryCategories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.label}</option>
                    ))}
                  </select>
                  <p className="mt-1 text-xs text-gray-400">Which section of the gallery should this photo appear in?</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-1">Badge label</label>
                  <input
                    type="text"
                    required
                    value={galleryModal.data.tag || ''}
                    onChange={(e) => setGalleryModal({ ...galleryModal, data: { ...galleryModal.data, tag: e.target.value } })}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-primary"
                    placeholder="e.g. Free Healthcare"
                  />
                  <p className="mt-1 text-xs text-gray-400">A short label shown as a badge on the photo.</p>
                </div>
              </div>

              <div>
                <ImageUploader
                  label="Photo"
                  value={galleryModal.data.src || ''}
                  onChange={(val) => setGalleryModal({ ...galleryModal, data: { ...galleryModal.data, src: val } })}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1">Caption</label>
                <textarea
                  rows={2}
                  required
                  value={galleryModal.data.caption || ''}
                  onChange={(e) => setGalleryModal({ ...galleryModal, data: { ...galleryModal.data, caption: e.target.value } })}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-primary"
                  placeholder="e.g. Distributing free ration kits to elderly residents"
                />
                <p className="mt-1 text-xs text-gray-400">A short description that appears when hovering over the photo.</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1">Photo description (for accessibility)</label>
                <input
                  type="text"
                  required
                  value={galleryModal.data.alt || ''}
                  onChange={(e) => setGalleryModal({ ...galleryModal, data: { ...galleryModal.data, alt: e.target.value } })}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-primary"
                  placeholder="e.g. Trust volunteers handing ration bags to an elderly woman"
                />
                <p className="mt-1 text-xs text-gray-400">Describes the photo for visually impaired users and search engines.</p>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setGalleryModal({ isOpen: false, mode: 'create', data: {} })}
                  className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-bold text-white bg-primary hover:bg-primary/90 rounded-xl cursor-pointer shadow-sm"
                >
                  Save Photo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE GALLERY CATEGORY */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">🏷️ Add New Category</h3>
                <p className="text-sm text-gray-500 mt-0.5">Creates a new filter tab in the Gallery page.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowCategoryModal(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <form onSubmit={handleAddCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Category Display Label *
                </label>
                <input
                  type="text"
                  required
                  value={newCategory.label}
                  onChange={(e) => {
                    const label = e.target.value;
                    const autoId = label.toLowerCase().trim().replace(/[^a-z0-9_-]/g, '_').replace(/_+/g, '_');
                    setNewCategory({ label, id: autoId });
                  }}
                  placeholder="e.g. Free Medical Camps"
                  className="w-full px-3.5 py-2 border rounded-lg text-sm outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Category Slug / Identifier (Unique)
                </label>
                <input
                  type="text"
                  required
                  value={newCategory.id}
                  onChange={(e) => setNewCategory({ ...newCategory, id: e.target.value })}
                  placeholder="e.g. medical_camps"
                  className="w-full px-3.5 py-2 border rounded-lg text-sm font-mono text-xs outline-none focus:border-primary"
                />
                <span className="text-[10px] text-gray-400">Lowercase letters and underscores</span>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-primary hover:bg-primary-dark rounded-lg cursor-pointer shadow-xs inline-flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">add</span>
                  <span>Add Category</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
