import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { contactService } from '../services/index.js';

export default function Contact() {
  const { showToast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const f = form.elements;
    const name = f.name?.value?.trim() || '';
    const mobile = f.mobile?.value?.trim() || '';
    const email = f.email?.value?.trim() || '';
    const subject = f.subject?.value?.trim() || '';
    const message = f.message?.value?.trim() || '';

    setIsSubmitting(true);

    try {
      // 1. Save inquiry to SQLite backend database via structured service
      await contactService.submitInquiry({
        name,
        phone: mobile,
        email,
        service: subject,
        message
      });
    } catch (err) {
      console.warn('[Contact] Backend submission notice:', err.message);
    } finally {
      setIsSubmitting(false);
    }

    // 2. Also open WhatsApp with formatted message
    const phoneNumber = "919822485327";
    let text = `*NEW INQUIRY - REGINALDO TRUST*\n\n` +
      `*Name:* ${name}\n` +
      `*Mobile:* ${mobile}\n`;

    if (email) {
      text += `*Email:* ${email}\n`;
    }

    text += `*Inquiring About:* ${subject}\n\n` +
      `*Message:*\n${message}\n\n` +
      `_Sent via reginaldotrust.org_`;

    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener");

    if (showToast) {
      showToast("Inquiry saved! Opening WhatsApp...");
    } else if (typeof window.showToast === 'function') {
      window.showToast("Inquiry saved! Opening WhatsApp...");
    }

    form.reset();
  };

  return (
    <main id="main-content">
<header className="relative pt-28 pb-10 md:pt-32 md:pb-12 bg-surface-container-low px-margin-mobile md:px-margin-desktop text-center">
  <div className="max-w-3xl mx-auto">
    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-4 backdrop-blur-sm shadow-sm">
      <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
      <span>Official Directory • Registered Trust</span>
    </div>
    <h1 className="font-display-lg text-headline-lg md:text-4xl text-primary mb-sm font-bold">Contact Reginaldo Trust</h1>
    <p className="font-body-md text-body-md text-on-surface/80 leading-relaxed max-w-lg mx-auto">
      Connect directly with our administration and care coordinators at our tracking endpoints in Goa.
    </p>
  </div>
</header>
<div className="bg-primary py-3.5 sm:py-4 overflow-hidden border-y border-white/10 marquee-wrapper relative shadow-inner">
  <div className="marquee-container font-display-lg text-xs sm:text-sm md:text-base uppercase tracking-[0.22em]">
    <div className="marquee-content text-on-primary font-semibold">
      <span className="mx-3 inline-flex items-center gap-3"><span>Hope</span><span className="text-primary-container/70 text-xs">✦</span></span>
      <span className="mx-3 inline-flex items-center gap-3"><span>Compassion</span><span className="text-primary-container/70 text-xs">✦</span></span>
      <span className="mx-3 inline-flex items-center gap-3"><span>Charity</span><span className="text-primary-container/70 text-xs">✦</span></span>
      <span className="mx-3 inline-flex items-center gap-3"><span>Community Care</span><span className="text-primary-container/70 text-xs">✦</span></span>
      <span className="mx-3 inline-flex items-center gap-3"><span>Elderly Support</span><span className="text-primary-container/70 text-xs">✦</span></span>
      <span className="mx-3 inline-flex items-center gap-3"><span>Free Healthcare</span><span className="text-primary-container/70 text-xs">✦</span></span>
      <span className="mx-3 inline-flex items-center gap-3"><span>Farmer Machinery</span><span className="text-primary-container/70 text-xs">✦</span></span>
      <span className="mx-3 inline-flex items-center gap-3"><span>House Restoration</span><span className="text-primary-container/70 text-xs">✦</span></span>
      <span className="mx-3 inline-flex items-center gap-3"><span>Youth Scholarships</span><span className="text-primary-container/70 text-xs">✦</span></span>
      <span className="mx-3 inline-flex items-center gap-3"><span>Clean & Green</span><span className="text-primary-container/70 text-xs">✦</span></span>
      <span className="mx-3 inline-flex items-center gap-3"><span>100% Free Relief</span><span className="text-primary-container/70 text-xs">✦</span></span>
      <span className="mx-3 inline-flex items-center gap-3"><span>Serving Goa 20+ Years</span><span className="text-primary-container/70 text-xs">✦</span></span>
    </div>
    <div aria-hidden="true" className="marquee-content text-on-primary font-semibold">
      <span className="mx-3 inline-flex items-center gap-3"><span>Hope</span><span className="text-primary-container/70 text-xs">✦</span></span>
      <span className="mx-3 inline-flex items-center gap-3"><span>Compassion</span><span className="text-primary-container/70 text-xs">✦</span></span>
      <span className="mx-3 inline-flex items-center gap-3"><span>Charity</span><span className="text-primary-container/70 text-xs">✦</span></span>
      <span className="mx-3 inline-flex items-center gap-3"><span>Community Care</span><span className="text-primary-container/70 text-xs">✦</span></span>
      <span className="mx-3 inline-flex items-center gap-3"><span>Elderly Support</span><span className="text-primary-container/70 text-xs">✦</span></span>
      <span className="mx-3 inline-flex items-center gap-3"><span>Free Healthcare</span><span className="text-primary-container/70 text-xs">✦</span></span>
      <span className="mx-3 inline-flex items-center gap-3"><span>Farmer Machinery</span><span className="text-primary-container/70 text-xs">✦</span></span>
      <span className="mx-3 inline-flex items-center gap-3"><span>House Restoration</span><span className="text-primary-container/70 text-xs">✦</span></span>
      <span className="mx-3 inline-flex items-center gap-3"><span>Youth Scholarships</span><span className="text-primary-container/70 text-xs">✦</span></span>
      <span className="mx-3 inline-flex items-center gap-3"><span>Clean & Green</span><span className="text-primary-container/70 text-xs">✦</span></span>
      <span className="mx-3 inline-flex items-center gap-3"><span>100% Free Relief</span><span className="text-primary-container/70 text-xs">✦</span></span>
      <span className="mx-3 inline-flex items-center gap-3"><span>Serving Goa 20+ Years</span><span className="text-primary-container/70 text-xs">✦</span></span>
    </div>
  </div>
</div>
<section className="py-10 md:py-14 px-margin-mobile md:px-margin-desktop bg-surface">
  <div className="max-w-6xl mx-auto">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

      {/* Card: Address */}
      <div className="bg-white p-5 sm:p-6 rounded-xl border border-surface-container-high shadow-sm flex flex-col justify-between interactive-lift reveal-on-scroll">
        {/* Content wrapper with flex-grow */}
        <div className="flex-grow">
          <div className="w-10 h-10 rounded-lg bg-primary-container/40 flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-primary text-xl">location_on</span>
          </div>
          <h3 className="font-display-lg text-lg font-bold text-primary mb-sm">Registered Address</h3>
          <p className="font-body-md text-sm text-on-surface/80 leading-relaxed mb-6">
            Reginaldo Trust,<br />
            H No. 1088, St. Xavier,<br />
            Raia, Salcete, Goa <br />
            
          </p>
        </div>
        {/* CTA button */}
        <a href="https://maps.google.com/?q=Reginaldo+Trust,+Raia,+Salcete,+Goa" target="_blank" rel="noopener noreferrer" className="w-full bg-surface-container-high hover:bg-primary hover:text-on-primary text-primary py-sm px-md rounded font-label-md text-sm font-semibold transition-all active:scale-95 flex items-center justify-between group mb-6">
          <span>Open in Google Maps</span>
          <span className="material-symbols-outlined text-md opacity-70 group-hover:translate-x-0.5 transition-transform">directions</span>
        </a>
        {/* Footer */}
        <div className="bg-surface-container/50 px-sm py-xs rounded text-center">
          <span className="text-[11px] uppercase font-label-md tracking-wider text-on-surface/60 font-semibold">Primary Operations: Raia & Curtorim</span>
        </div>
      </div>

      {/* Card: Phone */}
      <div className="bg-white p-5 sm:p-6 rounded-xl border border-surface-container-high shadow-sm flex flex-col justify-between interactive-lift reveal-on-scroll" style={{"transitionDelay":"500ms"}}>
        {/* Content wrapper with flex-grow */}
        <div className="flex-grow">
          <div className="w-10 h-10 rounded-lg bg-primary-container/40 flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-primary text-xl">call</span>
          </div>
          <h3 className="font-display-lg text-lg font-bold text-primary mb-sm">Program Assistance Line</h3>
          <p className="font-body-md text-sm text-on-surface/80 leading-relaxed mb-6">
            For admissions, agricultural relief programs, or structural support updates:
          </p>
        </div>
        {/* CTA buttons with Copy to Clipboard */}
        <div className="flex items-center gap-2 mb-3">
          <a href="tel:+919822485327" className="flex-grow bg-surface-container-high hover:bg-primary hover:text-on-primary text-primary py-sm px-md rounded font-label-md text-sm font-semibold transition-all active:scale-95 flex items-center justify-between group shadow-sm">
            <span>+91 98224 85327</span>
            <span className="material-symbols-outlined text-md opacity-70 group-hover:translate-x-0.5 transition-transform">call</span>
          </a>
          <button type="button" onClick={() => { navigator.clipboard.writeText('+919822485327'); showToast('Copied +91 98224 85327 to clipboard'); }} className="p-2.5 rounded bg-surface-container-high hover:bg-primary hover:text-white text-primary transition-all shadow-sm flex items-center justify-center shrink-0" title="Copy phone number" aria-label="Copy phone number +91 98224 85327">
            <span className="material-symbols-outlined text-sm">content_copy</span>
          </button>
        </div>

        <div className="flex items-center gap-2 mb-6">
          <a href="tel:+919764917977" className="flex-grow bg-surface-container-high hover:bg-primary hover:text-on-primary text-primary py-sm px-md rounded font-label-md text-sm font-semibold transition-all active:scale-95 flex items-center justify-between group shadow-sm">
            <span>+91 97649 17977</span>
            <span className="material-symbols-outlined text-md opacity-70 group-hover:translate-x-0.5 transition-transform">call</span>
          </a>
          <button type="button" onClick={() => { navigator.clipboard.writeText('+919764917977'); showToast('Copied +91 97649 17977 to clipboard'); }} className="p-2.5 rounded bg-surface-container-high hover:bg-primary hover:text-white text-primary transition-all shadow-sm flex items-center justify-center shrink-0" title="Copy phone number" aria-label="Copy phone number +91 97649 17977">
            <span className="material-symbols-outlined text-sm">content_copy</span>
          </button>
        </div>

        {/* Footer */}
        <div className="bg-surface-container/50 px-sm py-xs rounded text-center">
          <span className="text-[11px] uppercase font-label-md tracking-wider text-on-surface/60 font-semibold">Mon-Sat: 9:00 AM - 5:00 PM</span>
        </div>
      </div>

      {/* Card: Email */}
      <div className="bg-white p-5 sm:p-6 rounded-xl border border-surface-container-high shadow-sm flex flex-col justify-between interactive-lift reveal-on-scroll" style={{"transitionDelay":"200ms"}}>
        <div className="flex-grow">
          <div className="w-10 h-10 rounded-lg bg-primary-container/40 flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-primary text-xl">mail</span>
          </div>
          <h3 className="font-display-lg text-lg font-bold text-primary mb-sm">Email Correspondence</h3>
          <p className="font-body-md text-sm text-on-surface/80 leading-relaxed mb-4">
            For programmatic collaborations, secure donation tracking, or general queries:
          </p>
        </div>
        <div className="flex items-center gap-2 mb-6">
          <a href="mailto:reginaldotrust@gmail.com" className="flex-grow bg-surface-container-high hover:bg-primary hover:text-on-primary text-primary py-sm px-md rounded font-label-md text-sm font-semibold transition-all active:scale-95 flex items-center justify-between group shadow-sm">
            <span className="truncate">reginaldotrust@gmail.com</span>
            <span className="material-symbols-outlined text-md opacity-70 group-hover:translate-x-0.5 transition-transform">mail</span>
          </a>
          <button type="button" onClick={() => { navigator.clipboard.writeText('reginaldotrust@gmail.com'); showToast('Copied email address to clipboard'); }} className="p-2.5 rounded bg-surface-container-high hover:bg-primary hover:text-white text-primary transition-all shadow-sm flex items-center justify-center shrink-0" title="Copy email address" aria-label="Copy email address">
            <span className="material-symbols-outlined text-sm">content_copy</span>
          </button>
        </div>
        {/* Footer */}
        <div className="bg-surface-container/50 px-sm py-xs rounded text-center">
          <span className="text-[11px] uppercase font-label-md tracking-wider text-on-surface/60 font-semibold">Response Window: 24-48 Hours</span>
        </div>
      </div>

    </div>
  </div>
</section>
<section className="py-12 md:py-16 px-margin-mobile md:px-margin-desktop bg-surface-container-low" id="inquiry">
  <div className="max-w-2xl mx-auto">

    {/* Section Header */}
    <div className="flex flex-col items-center text-center mb-8 reveal-on-scroll">
      <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-primary/10 border border-primary/20 text-primary uppercase tracking-wider mb-2.5 shadow-xs">
        <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
        <span>Direct Inquiry</span>
      </div>
      <h2 className="font-display-lg text-primary text-2xl sm:text-3xl font-bold tracking-tight mb-1.5">
        Send Us a Message
      </h2>
      <p className="text-on-surface/70 text-sm sm:text-base">
        Fill out the details below to connect with the Trust office on WhatsApp.
      </p>
    </div>

    {/* Clean Form Card */}
    <div className="bg-white rounded-2xl border border-surface-container-high shadow-sm p-6 sm:p-8 reveal-on-scroll" style={{"transitionDelay":"100ms"}}>
      <form id="whatsapp-form" className="space-y-4 sm:space-y-5" onSubmit={handleSubmit}>

        {/* Row 1: Name & Mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          <div>
            <label htmlFor="contact-name" className="block text-sm font-semibold text-on-surface mb-1.5">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input type="text" id="contact-name" name="name" required="" autoComplete="name" placeholder="Enter your full name" className="w-full rounded-lg border border-surface-container-high bg-white px-3.5 py-2.5 sm:py-3 text-sm text-on-surface placeholder:text-on-surface/40 focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all" />
          </div>

          <div>
            <label htmlFor="contact-mobile" className="block text-sm font-semibold text-on-surface mb-1.5">
              Mobile Number <span className="text-red-500">*</span>
            </label>
            <input type="tel" id="contact-mobile" name="mobile" required="" autoComplete="tel" placeholder="10-digit mobile number" pattern="[0-9]{10}" title="Please enter a valid 10-digit mobile number" className="w-full rounded-lg border border-surface-container-high bg-white px-3.5 py-2.5 sm:py-3 text-sm text-on-surface placeholder:text-on-surface/40 focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all" />
          </div>
        </div>

        {/* Row 2: Email & Subject Dropdown */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          <div>
            <label htmlFor="contact-email" className="block text-sm font-semibold text-on-surface mb-1.5">
              Email Address
            </label>
            <input type="email" id="contact-email" name="email" autoComplete="email" placeholder="name@example.com" className="w-full rounded-lg border border-surface-container-high bg-white px-3.5 py-2.5 sm:py-3 text-sm text-on-surface placeholder:text-on-surface/40 focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all" />
          </div>

          <div>
            <label htmlFor="contact-subject" className="block text-sm font-semibold text-on-surface mb-1.5">
              Inquiring About <span className="text-red-500">*</span>
            </label>
            <select id="contact-subject" name="subject" required="" className="w-full rounded-lg border border-surface-container-high bg-white px-3.5 py-2.5 sm:py-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all">
              <option value="General Inquiry">General Inquiry</option>
              <option value="Agriculture & Farm Machinery">Agriculture & Farm Machinery</option>
              <option value="Healthcare & Medical Equipment">Healthcare & Medical Equipment</option>
              <option value="House Restoration Support">House Restoration Support</option>
              <option value="Education & Scholarships">Education & Scholarships</option>
              <option value="Ambulance & Emergency Relief">Ambulance & Emergency Relief</option>
              <option value="Other Assistance">Other Assistance</option>
            </select>
          </div>
        </div>

        {/* Row 3: Message */}
        <div>
          <label htmlFor="contact-message" className="block text-sm font-semibold text-on-surface mb-1.5">
            Your Message <span className="text-red-500">*</span>
          </label>
          <textarea id="contact-message" name="message" rows="4" required="" placeholder="Describe your request or how the Trust can help..." className="w-full rounded-lg border border-surface-container-high bg-white px-3.5 py-2.5 sm:py-3 text-sm text-on-surface placeholder:text-on-surface/40 focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all leading-relaxed"></textarea>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button type="submit" className="w-full bg-primary text-white py-3 sm:py-3.5 px-6 rounded-lg text-sm sm:text-base font-semibold hover:bg-[#242f69] active:scale-[0.99] transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer">
            <span>Send Message on WhatsApp</span>
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </button>
          
          <p className="text-center text-xs text-on-surface/60 mt-3">
            Response usually within 24–48 hours • Free community service
          </p>
        </div>

      </form>
    </div>

  </div>
</section>

    </main>
  );
}
