import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingActions from './components/FloatingActions';
import ScrollToTop from './components/ScrollToTop';
import { useScrollEffects } from './hooks/useScrollEffects';

import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import OurWork from './pages/OurWork';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminLogin from './pages/admin/AdminLogin';

export default function App() {
  useScrollEffects();
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <ScrollToTop />
      {!isAdminRoute && <Navbar />}
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/index.html" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/ourwork" element={<OurWork />} />
          <Route path="/programs" element={<OurWork />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </div>
      {!isAdminRoute && <FloatingActions />}
      {!isAdminRoute && <Footer />}
    </div>
  );
}
