import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { adminService } from '../../services/index.js';
import { useToast } from '../../context/ToastContext.jsx';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    if (adminService.isAuthenticated()) {
      navigate('/admin');
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await adminService.login(password);
      showToast('Welcome back! 👋');
      navigate('/admin');
    } catch (err) {
      setError('Wrong password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-12">
      {/* Card */}
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Top accent bar */}
        <div className="h-1.5 bg-gradient-to-r from-primary to-[#4a5fd1]" />

        <div className="px-8 py-8">
          {/* Logo & name */}
          <div className="flex flex-col items-center text-center mb-8">
            <img
              src="/images/favicon.png"
              alt="Reginaldo Trust"
              className="w-16 h-16 rounded-2xl shadow-md object-contain mb-3"
            />
            <h1 className="text-xl font-bold text-gray-900">Reginaldo Trust</h1>
            <p className="text-sm text-gray-500 mt-0.5">Website Admin Panel</p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-base shrink-0">error</span>
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1.5">
                Admin Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 pr-11 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  tabIndex={-1}
                >
                  <span className="material-symbols-outlined text-lg">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3 px-4 rounded-xl text-sm font-bold hover:bg-[#242f69] active:scale-[0.99] transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer mt-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign In →</span>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Back link */}
      <Link to="/" className="mt-6 text-sm text-gray-500 hover:text-primary inline-flex items-center gap-1.5 transition">
        <span className="material-symbols-outlined text-base">arrow_back</span>
        <span>Back to the public website</span>
      </Link>
    </div>
  );
}
