import React from 'react';
import { Link } from 'react-router-dom';

export default function Sidebar({
  activeTab,
  setActiveTab,
  badges = {},
  user,
  onLogout,
  mobileOpen,
  setMobileOpen
}) {
  const navItems = [
    { group: 'Edit Your Website', items: [
      { id: 'page-home',    label: 'Home Page',   icon: 'home',           desc: 'Banner, stats, mission' },
      { id: 'page-about',   label: 'About Us',    icon: 'groups',         desc: 'Story, vision, founders' },
      { id: 'page-services',label: 'Services',    icon: 'volunteer_activism', desc: 'Programs & helpline' },
      { id: 'page-ourwork', label: 'Our Work',    icon: 'handshake',      desc: 'Events, drives, impact' },
      { id: 'page-gallery', label: 'Gallery',     icon: 'photo_library',  desc: 'Photos & categories' },
      { id: 'page-contact', label: 'Contact',     icon: 'location_on',    desc: 'Address, hours, map' },
    ]},
    { group: 'Manage Content', items: [
      { id: 'initiatives',    label: 'Initiatives',     icon: 'campaign',     badge: badges.initiatives },
      { id: 'events',         label: 'Events',          icon: 'event',        badge: badges.events },
      { id: 'gallery-photos', label: 'Photos',          icon: 'image',        badge: badges.gallery },
      { id: 'inquiries',      label: 'Messages',        icon: 'mail',         badge: badges.inquiries, alert: Boolean(badges.inquiriesNew) },
    ]},
    { group: 'Settings', items: [
      { id: 'settings', label: 'Website Settings', icon: 'settings' },
      { id: 'profile',  label: 'Change Password',  icon: 'lock' },
    ]},
  ];

  const handleSelectTab = (id) => {
    setActiveTab(id);
    if (setMobileOpen) setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-xs"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-gray-100 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto shadow-lg ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-primary">
          <div className="flex items-center gap-3">
            <img
              src="/images/favicon.png"
              alt="Logo"
              className="w-9 h-9 rounded-full object-contain bg-white p-0.5 shadow"
            />
            <div>
              <h1 className="text-sm font-bold text-white tracking-wide leading-tight">Reginaldo Trust</h1>
              <span className="text-[10px] text-white/70 font-semibold uppercase tracking-wider">Admin Panel</span>
            </div>
          </div>
          {setMobileOpen && (
            <button
              onClick={() => setMobileOpen(false)}
              className="lg:hidden text-white/80 hover:text-white p-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          )}
        </div>

        {/* Nav */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
          {navItems.map((section, sidx) => (
            <div key={sidx}>
              <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                {section.group}
              </p>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelectTab(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer group ${
                        isActive
                          ? 'bg-primary text-white shadow-sm'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-primary'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={`material-symbols-outlined text-xl ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-primary'}`}>
                          {item.icon}
                        </span>
                        <span>{item.label}</span>
                      </div>
                      {item.badge !== undefined && item.badge !== null && (
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold min-w-[22px] text-center ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : item.alert
                            ? 'bg-red-100 text-red-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-gray-100 bg-gray-50 space-y-2">
          <div className="flex items-center gap-2 px-2 py-1.5">
            <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
              {(user?.username || 'A')[0].toUpperCase()}
            </div>
            <div className="truncate flex-1 min-w-0">
              <span className="block text-xs font-bold text-gray-800 truncate">{user?.username || 'admin'}</span>
              <span className="block text-[10px] text-gray-400 truncate">Administrator</span>
            </div>
            <span className="flex-shrink-0 w-2 h-2 rounded-full bg-emerald-400" title="Online"></span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg bg-white hover:bg-gray-100 border border-gray-200 text-xs font-semibold text-gray-700 transition"
            >
              <span className="material-symbols-outlined text-sm">open_in_new</span>
              <span>Live Site</span>
            </Link>
            <button
              onClick={onLogout}
              className="flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold transition cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">logout</span>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
