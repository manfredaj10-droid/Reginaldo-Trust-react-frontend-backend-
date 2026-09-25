import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const ToastContext = createContext({ showToast: () => {} });

export function ToastProvider({ children }) {
  const [toast, setToast] = useState({ message: '', visible: false });

  const showToast = useCallback((message) => {
    setToast({ message, visible: true });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 3500);
  }, []);

  useEffect(() => {
    window.showToast = showToast;
    return () => {
      delete window.showToast;
    };
  }, [showToast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        id="toast"
        role="status"
        aria-live="polite"
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] bg-primary text-white text-sm font-semibold px-5 py-3 rounded-full shadow-lg pointer-events-none transition-all duration-300 flex items-center gap-2 ${
          toast.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <span className="material-symbols-outlined text-base">check_circle</span>
        <span>{toast.message}</span>
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
