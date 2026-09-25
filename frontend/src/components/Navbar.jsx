import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/' || location.pathname === '/index.html';
    return location.pathname === path;
  };

  const navClass = (path) => {
    const base = 'nav-link font-label-md text-label-md transition-colors';
    return isActive(path)
      ? `${base} active-page text-primary font-bold`
      : `${base} text-on-surface/80 hover:text-primary`;
  };

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:bg-primary focus:text-white focus:px-4 focus:py-2 focus:rounded shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-container"
      >
        Skip to main content
      </a>
      <nav
        className="fixed top-0 w-full z-50 backdrop-blur-md border-b border-surface-container-high"
        aria-label="Main navigation"
        style={{ backgroundColor: 'rgba(251,248,255,0.96)' }}
      >
        <div className="flex justify-between items-center px-4 sm:px-6 md:px-8 lg:px-margin-desktop py-2 sm:py-base max-w-7xl mx-auto">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 sm:gap-sm" aria-label="Reginaldo Trust Home">
            <img
              src="/images/logo.webp"
              alt="Reginaldo Trust"
              className="h-10 sm:h-12 md:h-14 lg:h-16 w-auto object-contain"
              width="500"
              height="196"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                if (e.currentTarget.nextElementSibling) {
                  e.currentTarget.nextElementSibling.style.display = 'flex';
                }
              }}
            />
            <div style={{ display: 'none' }} className="items-center gap-2">
              <div className="w-9 h-9 sm:w-11 sm:h-11 md:w-14 md:h-14 bg-primary rounded flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-xl sm:text-2xl md:text-3xl">volunteer_activism</span>
              </div>
              <span className="font-display-lg text-primary font-bold text-base sm:text-lg md:text-xl">Reginaldo Trust</span>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8">
            <Link className={navClass('/')} to="/">Home</Link>
            <Link className={navClass('/about')} to="/about">About Us</Link>
            <Link className={navClass('/services')} to="/services">Services</Link>
            <Link className={navClass('/ourwork')} to="/ourwork">Programs</Link>
            <Link className={navClass('/gallery')} to="/gallery">Gallery</Link>
            <Link className={navClass('/contact')} to="/contact">Contact</Link>
          </div>

          {/* Donate + Hamburger */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/#donate"
              className="bg-primary text-on-primary px-3 sm:px-5 py-1.5 sm:py-2 rounded-lg font-label-md text-xs sm:text-sm font-semibold btn-hover active:scale-95 shadow-sm inline-flex items-center gap-1 sm:gap-1.5"
            >
              <span className="material-symbols-outlined text-sm sm:text-base">volunteer_activism</span>
              <span>Donate</span>
            </Link>
            <button
              id="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-surface-container transition-colors focus:outline-none focus:ring-2 focus:ring-primary min-w-[40px] min-h-[40px] flex items-center justify-center"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
            >
              <span className="material-symbols-outlined text-primary text-2xl">
                {mobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        <div
          id="mobile-menu"
          className={`mobile-menu lg:hidden flex-col border-t border-surface-container-high px-4 sm:px-6 py-3 gap-1.5 shadow-xl ${
            mobileMenuOpen ? 'open' : ''
          }`}
          role="region"
          aria-label="Mobile menu"
          style={{ backgroundColor: '#fbf8ff' }}
        >
          <Link
            className={`font-label-md text-sm px-3.5 py-3 rounded-lg transition-colors flex items-center justify-between min-h-[44px] ${
              isActive('/') ? 'bg-primary text-white font-bold' : 'text-on-surface/80 hover:bg-surface-container'
            }`}
            to="/"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span>Home</span>
            <span className="material-symbols-outlined text-sm opacity-60">arrow_forward</span>
          </Link>
          <Link
            className={`font-label-md text-sm px-3.5 py-3 rounded-lg transition-colors flex items-center justify-between min-h-[44px] ${
              isActive('/about') ? 'bg-primary text-white font-bold' : 'text-on-surface/80 hover:bg-surface-container'
            }`}
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span>About Us</span>
            <span className="material-symbols-outlined text-sm opacity-60">arrow_forward</span>
          </Link>
          <Link
            className={`font-label-md text-sm px-3.5 py-3 rounded-lg transition-colors flex items-center justify-between min-h-[44px] ${
              isActive('/services') ? 'bg-primary text-white font-bold' : 'text-on-surface/80 hover:bg-surface-container'
            }`}
            to="/services"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span>Services</span>
            <span className="material-symbols-outlined text-sm opacity-60">arrow_forward</span>
          </Link>
          <Link
            className={`font-label-md text-sm px-3.5 py-3 rounded-lg transition-colors flex items-center justify-between min-h-[44px] ${
              isActive('/ourwork') ? 'bg-primary text-white font-bold' : 'text-on-surface/80 hover:bg-surface-container'
            }`}
            to="/ourwork"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span>Programs</span>
            <span className="material-symbols-outlined text-sm opacity-60">arrow_forward</span>
          </Link>
          <Link
            className={`font-label-md text-sm px-3.5 py-3 rounded-lg transition-colors flex items-center justify-between min-h-[44px] ${
              isActive('/gallery') ? 'bg-primary text-white font-bold' : 'text-on-surface/80 hover:bg-surface-container'
            }`}
            to="/gallery"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span>Gallery</span>
            <span className="material-symbols-outlined text-sm opacity-60">arrow_forward</span>
          </Link>
          <Link
            className={`font-label-md text-sm px-3.5 py-3 rounded-lg transition-colors flex items-center justify-between min-h-[44px] ${
              isActive('/contact') ? 'bg-primary text-white font-bold' : 'text-on-surface/80 hover:bg-surface-container'
            }`}
            to="/contact"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span>Contact</span>
            <span className="material-symbols-outlined text-sm opacity-60">arrow_forward</span>
          </Link>
          <div className="pt-3 border-t border-surface-container-high mt-1 flex flex-col gap-2">
            <Link
              to="/#donate"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center bg-primary text-white py-3 rounded-lg font-label-md font-semibold shadow-sm active:scale-95 transition-all min-h-[44px] flex items-center justify-center"
            >
              Donate Now
            </Link>
            <a
              href="tel:+919822485327"
              className="w-full text-center py-2.5 text-primary font-label-md text-xs font-semibold flex items-center justify-center gap-1.5 opacity-85 hover:opacity-100 min-h-[44px]"
            >
              <span className="material-symbols-outlined text-base">call</span> 24/7 Helpline: +91 98224 85327
            </a>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Backdrop */}
      <div
        id="mobile-menu-backdrop"
        onClick={() => setMobileMenuOpen(false)}
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        } lg:hidden`}
        aria-hidden="true"
      ></div>
    </>
  );
}
