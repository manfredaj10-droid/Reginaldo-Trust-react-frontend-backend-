import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="w-full bg-surface-container-highest px-margin-mobile md:px-margin-desktop py-8 text-on-surface mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col gap-6 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
          {/* Brand + Social Icons */}
          <div className="flex flex-col gap-4">
            <Link to="/" aria-label="Reginaldo Trust">
              <img
                src="/images/logo.webp"
                alt="Reginaldo Trust"
                className="h-14 w-auto object-contain"
                width="500"
                height="196"
                loading="lazy"
              />
            </Link>
            <p className="text-sm opacity-80 leading-relaxed max-w-sm">
              Reginaldo Trust is a registered charitable trust in Goa dedicated to uplifting underserved communities through education, healthcare, agriculture support, and dignity-driven social service.
            </p>
            <div className="flex items-center gap-3 mt-1">
              <a
                href="https://wa.me/919822485327"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat with us on WhatsApp"
                className="w-9 h-9 rounded-full flex items-center justify-center hover:-translate-y-1 transition-transform shadow-sm"
                style={{ background: '#25D366' }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.118 1.532 5.845L0 24l6.335-1.51A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.369l-.36-.214-3.732.89.935-3.63-.235-.374A9.818 9.818 0 1112 21.818z"/>
                </svg>
              </a>
              <a
                href="https://x.com/reginaldotrust"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Reginaldo Trust on X"
                className="w-9 h-9 rounded-full flex items-center justify-center hover:-translate-y-1 transition-transform shadow-sm"
                style={{ background: '#000' }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-3">
            <h4 className="font-bold text-primary uppercase tracking-widest text-xs">Contact Information</h4>
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded text-xs font-semibold w-fit">
              <span className="material-symbols-outlined text-sm text-red-600">e911_emergency</span>
              <span>24/7 Ambulance &amp; Relief Assistance</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-primary text-xl shrink-0">location_on</span>
              <p className="text-sm opacity-80">H. No. 1088, St. Xavier, Raia, Salcete, Goa 403720</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-primary text-xl shrink-0">call</span>
              <div className="flex flex-col gap-1 text-sm">
                <a href="tel:+919822485327" className="opacity-80 hover:text-primary hover:opacity-100 transition-colors font-medium">+91 98224 85327</a>
                <a href="tel:+919764917977" className="opacity-80 hover:text-primary hover:opacity-100 transition-colors font-medium">+91 97649 17977</a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-primary text-xl shrink-0">mail</span>
              <a href="mailto:reginaldotrust@gmail.com" className="text-sm opacity-80 hover:text-primary hover:opacity-100 transition-colors break-all font-medium">reginaldotrust@gmail.com</a>
            </div>
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-primary text-xl shrink-0">schedule</span>
              <p className="text-sm opacity-80">Mon–Sat, 9:00 AM – 5:00 PM</p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-3">
            <h4 className="font-bold text-primary uppercase tracking-widest text-xs">Quick Links</h4>
            <div className="grid grid-cols-2 gap-2">
              <Link to="/" className="text-sm opacity-80 hover:text-primary transition-colors">Home</Link>
              <Link to="/about" className="text-sm opacity-80 hover:text-primary transition-colors">About Us</Link>
              <Link to="/services" className="text-sm opacity-80 hover:text-primary transition-colors">Services</Link>
              <Link to="/ourwork" className="text-sm opacity-80 hover:text-primary transition-colors">Programs</Link>
              <Link to="/gallery" className="text-sm opacity-80 hover:text-primary transition-colors">Gallery</Link>
              <Link to="/contact" className="text-sm opacity-80 hover:text-primary transition-colors">Contact</Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-surface-container-high/70 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs opacity-75 text-center sm:text-left">
          <p className="tracking-wide">
            © {new Date().getFullYear()} <span className="font-semibold text-primary">Reginaldo Trust</span>. All Rights Reserved.
          </p>
          <p className="tracking-wide flex items-center justify-center sm:justify-start gap-1">
            <span>Designed &amp; Developed by</span>
            <a
              href="https://cybercreative.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-semibold inline-flex items-center gap-0.5 transition-colors"
            >
              Cyber Creative
              <span className="material-symbols-outlined text-[13px] opacity-70">open_in_new</span>
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
