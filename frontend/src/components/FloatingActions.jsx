import React, { useState, useEffect } from 'react';

export default function FloatingActions() {
  const [showToTop, setShowToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      setShowToTop(scrollTop > 350);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Floating Social Icons */}
      <div className="floating-socials" aria-label="Quick contact links">
        <a
          href="https://wa.me/919822485327"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with us on WhatsApp"
          className="fab-whatsapp"
          title="WhatsApp"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="white" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.118 1.532 5.845L0 24l6.335-1.51A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.369l-.36-.214-3.732.89.935-3.63-.235-.374A9.818 9.818 0 1112 21.818z"/>
          </svg>
        </a>
        <a
          href="https://x.com/reginaldotrust"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Reginaldo Trust on X"
          className="fab-twitter"
          title="Twitter / X"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="white" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        </a>
      </div>

      {/* Back to Top Button */}
      <button
        id="toTopBtn"
        type="button"
        onClick={scrollToTop}
        className={`fixed bottom-6 right-4 bg-primary text-white p-3 rounded-full shadow-lg transition-all duration-300 z-50 hover:bg-primary/90 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
          showToTop ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-label="Back to top"
      >
        <span className="material-symbols-outlined text-2xl">arrow_upward</span>
      </button>
    </>
  );
}
