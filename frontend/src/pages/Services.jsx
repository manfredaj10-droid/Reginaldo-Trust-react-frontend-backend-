import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { sectionsService } from '../services/index.js';

export default function Services() {
  const [sectionsData, setSectionsData] = useState({});

  useEffect(() => {
    let isMounted = true;
    sectionsService.getByPage('services')
      .then(res => {
        if (isMounted && Array.isArray(res)) {
          const map = {};
          res.forEach(s => { map[s.section_key] = s; });
          setSectionsData(map);
        }
      })
      .catch(() => null);
    return () => { isMounted = false; };
  }, []);

  return (
    <main id="main-content">
<header className="page-hero pt-28 pb-14 md:pt-32 md:pb-16 px-margin-mobile md:px-margin-desktop">
  <div className="page-hero-pattern"></div>
  <div className="max-w-7xl mx-auto relative z-10 text-center">
    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 border border-white/25 text-white text-xs font-semibold mb-4 backdrop-blur-sm shadow-sm">
      <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
      <span>Free Of Cost, Always • Public Charity</span>
    </div>
    <h1 className="font-display-lg text-headline-lg md:text-display-lg text-on-primary mb-md font-bold animated-heading justify-center" data-animate-heading="">
      {sectionsData.hero?.title || "Our Services"}
    </h1>
    <p className="font-body-lg text-body-lg text-on-primary/75 max-w-2xl mx-auto leading-relaxed reveal-on-scroll" style={{"transitionDelay":"300ms"}}>
      {sectionsData.hero?.content?.narrative_1 || "Machinery, medical equipment, transport, scholarships, restoration work and training — every service listed here is provided free of cost to the people of Curtorim village and the surrounding areas, without any reservation as to caste, creed or religion."}
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
<section className="py-12 md:py-16 px-margin-mobile md:px-margin-desktop bg-surface" id="services">
  <div className="max-w-7xl mx-auto">

    <div className="flex flex-col items-center text-center mb-8 md:mb-12 reveal-on-scroll">
      <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-primary/10 border border-primary/20 text-primary uppercase tracking-wider mb-3 shadow-xs">
        <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
        <span>{sectionsData.six_areas?.subtitle || "What We Provide"}</span>
      </div>
      <h2 className="font-display-lg text-2xl sm:text-headline-lg md:text-5xl text-primary font-bold tracking-tight">{sectionsData.six_areas?.title || "Six Areas of Service"}</h2>
      <div className="w-16 h-1 bg-primary mx-auto mt-4 rounded-full"></div>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">

      {/* 1. Agriculture */}
      <a href="#agriculture" className="service-card group block p-5 sm:p-6 bg-surface-container-lowest border border-surface-container-high rounded-2xl flex flex-col reveal-on-scroll" style={{"transitionDelay":"60ms"}}>
        <div className="service-icon w-14 h-14 rounded-xl bg-primary-container/50 flex items-center justify-center mb-5">
          <span className="material-symbols-outlined text-primary text-3xl">agriculture</span>
        </div>
        <h3 className="font-display-lg text-xl font-bold text-primary tracking-tight mb-sm">Agriculture & Farming Support</h3>
        <p className="font-body-md text-body-md text-on-surface/75 leading-relaxed flex-grow">
          Free tractors, power tillers, power trailers and harvesters, seeds and saplings, plus training workshops that help farming families bring fallow land back into cultivation.
        </p>
        <span className="mt-5 inline-flex items-center gap-1 font-label-md text-label-md text-primary text-sm">
          See the details
          <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">arrow_forward</span>
        </span>
      </a>

      {/* 2. Education */}
      <a href="/ourwork" className="service-card group block p-5 sm:p-6 bg-surface-container-lowest border border-surface-container-high rounded-2xl flex flex-col reveal-on-scroll" style={{"transitionDelay":"120ms"}}>
        <div className="service-icon w-14 h-14 rounded-xl bg-primary-container/50 flex items-center justify-center mb-5">
          <span className="material-symbols-outlined text-primary text-3xl">school</span>
        </div>
        <h3 className="font-display-lg text-xl font-bold text-primary tracking-tight mb-sm">Education & Skill Development</h3>
        <p className="font-body-md text-body-md text-on-surface/75 leading-relaxed flex-grow">
          Scholarships for deserving students, recognition for toppers and rank holders, and free laptops, computers, printers, photocopiers and projectors for schools and students who need them.
        </p>
        <span className="mt-5 inline-flex items-center gap-1 font-label-md text-label-md text-primary text-sm">
          Explore programs
          <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">arrow_forward</span>
        </span>
      </a>

      {/* 3. Medical */}
      <a href="/contact" className="service-card group block p-5 sm:p-6 bg-surface-container-lowest border border-surface-container-high rounded-2xl flex flex-col reveal-on-scroll" style={{"transitionDelay":"180ms"}}>
        <div className="service-icon w-14 h-14 rounded-xl bg-primary-container/50 flex items-center justify-center mb-5">
          <span className="material-symbols-outlined text-primary text-3xl">medical_services</span>
        </div>
        <h3 className="font-display-lg text-xl font-bold text-primary tracking-tight mb-sm">Medical & Health Services</h3>
        <p className="font-body-md text-body-md text-on-surface/75 leading-relaxed flex-grow">
          Dental, eye care, general health and blood donation camps, a free physiotherapy clinic, wheelchairs and walkers for the aged, and a free 24/7 ambulance, hearse van and moveable morgue.
        </p>
        <span className="mt-5 inline-flex items-center gap-1 font-label-md text-label-md text-primary text-sm">
          Request assistance
          <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">arrow_forward</span>
        </span>
      </a>

      {/* 4. Clean & Green */}
      <a href="#clean-green" className="service-card group block p-5 sm:p-6 bg-surface-container-lowest border border-surface-container-high rounded-2xl flex flex-col reveal-on-scroll" style={{"transitionDelay":"240ms"}}>
        <div className="service-icon w-14 h-14 rounded-xl bg-primary-container/50 flex items-center justify-center mb-5">
          <span className="material-symbols-outlined text-primary text-3xl">eco</span>
        </div>
        <h3 className="font-display-lg text-xl font-bold text-primary tracking-tight mb-sm">Clean & Green Curtorim</h3>
        <p className="font-body-md text-body-md text-on-surface/75 leading-relaxed flex-grow">
          Our environmental initiative — sapling distribution, door-to-door waste management, and eco-friendly practices that keep the village clean, green and liveable.
        </p>
        <span className="mt-5 inline-flex items-center gap-1 font-label-md text-label-md text-primary text-sm">
          See the details
          <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">arrow_forward</span>
        </span>
      </a>

      {/* 5. Social Empowerment */}
      <a href="#social-empowerment" className="service-card group block p-5 sm:p-6 bg-surface-container-lowest border border-surface-container-high rounded-2xl flex flex-col reveal-on-scroll" style={{"transitionDelay":"300ms"}}>
        <div className="service-icon w-14 h-14 rounded-xl bg-primary-container/50 flex items-center justify-center mb-5">
          <span className="material-symbols-outlined text-primary text-3xl">diversity_3</span>
        </div>
        <h3 className="font-display-lg text-xl font-bold text-primary tracking-tight mb-sm">Social Empowerment</h3>
        <p className="font-body-md text-body-md text-on-surface/75 leading-relaxed flex-grow">
          Job fairs and employment camps, career guidance workshops, and cyber hygiene training that connect local youth to real work and keep families safe online.
        </p>
        <span className="mt-5 inline-flex items-center gap-1 font-label-md text-label-md text-primary text-sm">
          See the details
          <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">arrow_forward</span>
        </span>
      </a>

      {/* 6. House Restoration & Community Support */}
      <a href="#house-restoration" className="service-card group block p-5 sm:p-6 bg-surface-container-lowest border border-surface-container-high rounded-2xl flex flex-col reveal-on-scroll" style={{"transitionDelay":"360ms"}}>
        <div className="service-icon w-14 h-14 rounded-xl bg-primary-container/50 flex items-center justify-center mb-5">
          <span className="material-symbols-outlined text-primary text-3xl">home_repair_service</span>
        </div>
        <h3 className="font-display-lg text-xl font-bold text-primary tracking-tight mb-sm">House Restoration & Community Help</h3>
        <p className="font-body-md text-body-md text-on-surface/75 leading-relaxed flex-grow">
          Restoration work for families who cannot afford repairs, plus utility vehicles, crane support, temporary road fixes and online bill payment help for those unfamiliar with digital services.
        </p>
        <span className="mt-5 inline-flex items-center gap-1 font-label-md text-label-md text-primary text-sm">
          See the details
          <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">arrow_forward</span>
        </span>
      </a>

    </div>
  </div>
</section>
<section className="py-12 md:py-16 px-margin-mobile md:px-margin-desktop bg-surface-container-lowest" id="clean-green">
  <div className="max-w-7xl mx-auto">

    <div className="flex flex-col items-center text-center mb-8 md:mb-12 reveal-on-scroll">
      <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-primary/10 border border-primary/20 text-primary uppercase tracking-wider mb-3 shadow-xs">
        <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
        <span>{sectionsData.clean_green?.subtitle || "Environmental Initiative"}</span>
      </div>
      <h2 className="font-display-lg text-2xl sm:text-headline-lg md:text-5xl text-primary font-bold tracking-tight">{sectionsData.clean_green?.title || "Clean & Green Curtorim"}</h2>
      <div className="w-16 h-1 bg-primary mx-auto mt-4 rounded-full"></div>
      <p className="font-body-lg text-body-lg text-on-surface/70 max-w-2xl mx-auto mt-4 leading-relaxed">
        {sectionsData.clean_green?.content?.narrative_1 || "A village-wide effort to plant more, waste less, and protect the land and water that Curtorim depends on."}
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">

      {/* Block 1: Sapling Distribution */}
      <div className="service-card p-5 sm:p-6 bg-surface border border-surface-container-high rounded-2xl reveal-on-scroll" style={{"transitionDelay":"80ms"}}>
        <div className="service-icon w-14 h-14 rounded-xl bg-primary-container/50 flex items-center justify-center mb-5">
          <span className="material-symbols-outlined text-primary text-3xl">forest</span>
        </div>
        <h3 className="font-display-lg text-xl font-bold text-primary tracking-tight mb-sm">Sapling Distribution</h3>
        <p className="font-body-md text-body-md text-on-surface/75 leading-relaxed mb-5">
          Free fruit-bearing, coconut and shade saplings given to households, farmers and schools across the constituency.
        </p>
        <ul className="space-y-2 font-body-md text-sm text-on-surface/70">
          <li className="flex gap-2"><span className="material-symbols-outlined text-primary text-base shrink-0">check_circle</span>Free fruit-bearing & coconut saplings</li>
          <li className="flex gap-2"><span className="material-symbols-outlined text-primary text-base shrink-0">check_circle</span>Tree-planting drives with local youth</li>
          <li className="flex gap-2"><span className="material-symbols-outlined text-primary text-base shrink-0">check_circle</span>Roadside and public-space greening</li>
        </ul>
      </div>

      {/* Block 2: Waste Management */}
      <div className="service-card p-5 sm:p-6 bg-surface border border-surface-container-high rounded-2xl reveal-on-scroll" style={{"transitionDelay":"160ms"}}>
        <div className="service-icon w-14 h-14 rounded-xl bg-primary-container/50 flex items-center justify-center mb-5">
          <span className="material-symbols-outlined text-primary text-3xl">delete_sweep</span>
        </div>
        <h3 className="font-display-lg text-xl font-bold text-primary tracking-tight mb-sm">Waste Management</h3>
        <p className="font-body-md text-body-md text-on-surface/75 leading-relaxed mb-5">
          Door-to-door collection and regular clearing drives that keep roadsides, fields and drains free of dumped waste.
        </p>
        <ul className="space-y-2 font-body-md text-sm text-on-surface/70">
          <li className="flex gap-2"><span className="material-symbols-outlined text-primary text-base shrink-0">check_circle</span>Door-to-door waste collection</li>
          <li className="flex gap-2"><span className="material-symbols-outlined text-primary text-base shrink-0">check_circle</span>Dustbins placed in public spaces</li>
          <li className="flex gap-2"><span className="material-symbols-outlined text-primary text-base shrink-0">check_circle</span>Removal of illegally dumped & plastic waste</li>
        </ul>
      </div>

      {/* Block 3: Eco-Friendly Initiatives */}
      <div className="service-card p-5 sm:p-6 bg-surface border border-surface-container-high rounded-2xl reveal-on-scroll" style={{"transitionDelay":"240ms"}}>
        <div className="service-icon w-14 h-14 rounded-xl bg-primary-container/50 flex items-center justify-center mb-5">
          <span className="material-symbols-outlined text-primary text-3xl">compost</span>
        </div>
        <h3 className="font-display-lg text-xl font-bold text-primary tracking-tight mb-sm">Eco-Friendly Initiatives</h3>
        <p className="font-body-md text-body-md text-on-surface/75 leading-relaxed mb-5">
          Practical steps that reduce chemical use, protect the soil, and prepare the village for each monsoon.
        </p>
        <ul className="space-y-2 font-body-md text-sm text-on-surface/70">
          <li className="flex gap-2"><span className="material-symbols-outlined text-primary text-base shrink-0">check_circle</span>Self-developed organic fertilisers</li>
          <li className="flex gap-2"><span className="material-symbols-outlined text-primary text-base shrink-0">check_circle</span>Seasonal drainage & tree-branch grooming</li>
          <li className="flex gap-2"><span className="material-symbols-outlined text-primary text-base shrink-0">check_circle</span>Awareness on land protection & recycling</li>
        </ul>
      </div>

    </div>
  </div>
</section>
<section className="py-12 md:py-16 px-margin-mobile md:px-margin-desktop bg-surface" id="house-restoration">
  <div className="max-w-7xl mx-auto">

    <div className="bg-surface-container-lowest border border-surface-container-high rounded-2xl p-5 sm:p-6 md:p-8 shadow-sm reveal-on-scroll">

      {/* Header ON TOP */}
      <div className="flex flex-col items-center text-center mb-6 pb-5 border-b border-surface-container-high">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-primary/10 border border-primary/20 text-primary uppercase tracking-wider mb-3 shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
          <span>{sectionsData.house_restoration?.subtitle || "Restoration Work"}</span>
        </div>
        <h2 className="font-display-lg text-2xl sm:text-headline-lg md:text-4xl text-primary font-bold tracking-tight">{sectionsData.house_restoration?.title || "House Restoration"}</h2>
        <div className="w-16 h-1 bg-primary mx-auto mt-4 rounded-full"></div>
        <p className="font-body-md text-body-md text-on-surface/70 mt-3 max-w-2xl mx-auto leading-relaxed">
          {sectionsData.house_restoration?.content?.narrative_1 || "Repair and restoration work taken up by Reginaldo Trust for families who cannot afford it — carried out free of cost, most often before and after the monsoon."}
        </p>
      </div>

      {/* Real Restoration Project Showcase */}
      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <div className="rounded-xl overflow-hidden shadow-sm border border-surface-container-high relative group h-56 sm:h-64 md:h-72">
          <img src="/images/house-inaug-2.webp" alt="Handing over rebuilt home to family in Curtorim" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" decoding="async" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent"></div>
          <div className="absolute inset-x-0 bottom-0 p-4 text-white">
            <span className="text-[11px] uppercase tracking-wider font-semibold bg-primary/90 px-2 py-0.5 rounded inline-block">Completed Project</span>
            <p className="text-sm font-bold mt-1">Rebuilt Home Handover to Resident Family</p>
          </div>
        </div>
        <div className="rounded-xl overflow-hidden shadow-sm border border-surface-container-high relative group h-56 sm:h-64 md:h-72">
          <img src="/images/house-inaug-1.webp" alt="Blessing ceremony of newly restored house" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" decoding="async" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent"></div>
          <div className="absolute inset-x-0 bottom-0 p-4 text-white">
            <span className="text-[11px] uppercase tracking-wider font-semibold bg-primary/90 px-2 py-0.5 rounded inline-block">Community Blessing</span>
            <p className="text-sm font-bold mt-1">House Inauguration & Blessing Ceremony</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4 md:gap-5">

        <div className="restore-tile p-4 sm:p-5 bg-surface-container-low border border-surface-container-high rounded-xl reveal-on-scroll" style={{"transitionDelay":"60ms"}}>
          <span className="restore-num font-display-lg text-3xl font-bold text-primary/25 block mb-2">01</span>
          <h3 className="font-display-lg text-base font-bold text-primary tracking-tight mb-1">Roof Repair & Re-Roofing</h3>
          <p className="font-body-md text-sm text-on-surface/70 leading-relaxed">Replacing broken tiles and sheeting, and sealing leaks before the rains arrive.</p>
        </div>

        <div className="restore-tile p-4 sm:p-5 bg-surface-container-low border border-surface-container-high rounded-xl reveal-on-scroll" style={{"transitionDelay":"120ms"}}>
          <span className="restore-num font-display-lg text-3xl font-bold text-primary/25 block mb-2">02</span>
          <h3 className="font-display-lg text-base font-bold text-primary tracking-tight mb-1">Structural & Wall Repairs</h3>
          <p className="font-body-md text-sm text-on-surface/70 leading-relaxed">Rebuilding cracked or weakened walls and shoring up unsafe sections of the home.</p>
        </div>

        <div className="restore-tile p-4 sm:p-5 bg-surface-container-low border border-surface-container-high rounded-xl reveal-on-scroll" style={{"transitionDelay":"180ms"}}>
          <span className="restore-num font-display-lg text-3xl font-bold text-primary/25 block mb-2">03</span>
          <h3 className="font-display-lg text-base font-bold text-primary tracking-tight mb-1">Monsoon Damage Restoration</h3>
          <p className="font-body-md text-sm text-on-surface/70 leading-relaxed">Emergency help for households hit by storm, flooding or fallen-tree damage.</p>
        </div>

        <div className="restore-tile p-4 sm:p-5 bg-surface-container-low border border-surface-container-high rounded-xl reveal-on-scroll" style={{"transitionDelay":"240ms"}}>
          <span className="restore-num font-display-lg text-3xl font-bold text-primary/25 block mb-2">04</span>
          <h3 className="font-display-lg text-base font-bold text-primary tracking-tight mb-1">Flooring & Waterproofing</h3>
          <p className="font-body-md text-sm text-on-surface/70 leading-relaxed">Levelling and sealing floors and damp-proofing walls to keep interiors dry.</p>
        </div>

        <div className="restore-tile p-4 sm:p-5 bg-surface-container-low border border-surface-container-high rounded-xl reveal-on-scroll" style={{"transitionDelay":"300ms"}}>
          <span className="restore-num font-display-lg text-3xl font-bold text-primary/25 block mb-2">05</span>
          <h3 className="font-display-lg text-base font-bold text-primary tracking-tight mb-1">Electrical Safety & Wiring</h3>
          <p className="font-body-md text-sm text-on-surface/70 leading-relaxed">Making unsafe wiring, fittings and connections safe for the family living there.</p>
        </div>

        <div className="restore-tile p-4 sm:p-5 bg-surface-container-low border border-surface-container-high rounded-xl reveal-on-scroll" style={{"transitionDelay":"360ms"}}>
          <span className="restore-num font-display-lg text-3xl font-bold text-primary/25 block mb-2">06</span>
          <h3 className="font-display-lg text-base font-bold text-primary tracking-tight mb-1">Water & Sanitation Fittings</h3>
          <p className="font-body-md text-sm text-on-surface/70 leading-relaxed">Restoring water connections, plumbing and basic sanitation facilities.</p>
        </div>

      </div>

      <div className="mt-6 pt-5 border-t border-surface-container-high flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <p className="font-body-md text-sm text-on-surface/70">
          Need restoration help, or know a family who does? Reach out and we will visit.
        </p>
        <a href="/contact" className="bg-primary text-on-primary px-6 py-2.5 rounded font-label-md text-label-md btn-hover active:scale-95 shrink-0">Request a Visit</a>
      </div>

    </div>
  </div>
</section>
<section className="py-12 md:py-16 px-margin-mobile md:px-margin-desktop bg-surface-container-lowest" id="social-empowerment">
  <div className="max-w-7xl mx-auto">

    <div className="flex flex-col items-center text-center mb-8 md:mb-12 reveal-on-scroll">
      <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-primary/10 border border-primary/20 text-primary uppercase tracking-wider mb-3 shadow-xs">
        <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
        <span>{sectionsData.social_empowerment?.subtitle || "Building Livelihoods"}</span>
      </div>
      <h2 className="font-display-lg text-2xl sm:text-headline-lg md:text-5xl text-primary font-bold tracking-tight">{sectionsData.social_empowerment?.title || "Social Empowerment Initiatives"}</h2>
      <div className="w-16 h-1 bg-primary mx-auto mt-4 rounded-full"></div>
      <p className="font-body-lg text-body-lg text-on-surface/70 max-w-2xl mx-auto mt-4 leading-relaxed">
        {sectionsData.social_empowerment?.content?.narrative_1 || "Helping young people in Curtorim find work, choose a direction, and stay safe in a digital world."}
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">

      <div className="service-card p-5 sm:p-6 bg-surface border border-surface-container-high rounded-2xl reveal-on-scroll" style={{"transitionDelay":"80ms"}}>
        <div className="service-icon w-14 h-14 rounded-xl bg-primary-container/50 flex items-center justify-center mb-5">
          <span className="material-symbols-outlined text-primary text-3xl">work</span>
        </div>
        <h3 className="font-display-lg text-xl font-bold text-primary tracking-tight mb-sm">Job Fairs & Employment Camps</h3>
        <p className="font-body-md text-body-md text-on-surface/75 leading-relaxed">
          Employment camps that bring local industry and job seekers into the same room — connecting Curtorim's youth directly to openings in Goa's industrial estates and beyond.
        </p>
      </div>

      <div className="service-card p-5 sm:p-6 bg-surface border border-surface-container-high rounded-2xl reveal-on-scroll" style={{"transitionDelay":"160ms"}}>
        <div className="service-icon w-14 h-14 rounded-xl bg-primary-container/50 flex items-center justify-center mb-5">
          <span className="material-symbols-outlined text-primary text-3xl">record_voice_over</span>
        </div>
        <h3 className="font-display-lg text-xl font-bold text-primary tracking-tight mb-sm">Career Guidance Workshops</h3>
        <p className="font-body-md text-body-md text-on-surface/75 leading-relaxed">
          Career-building sessions for students and school leavers covering course choices, government schemes, interview preparation and the skills employers are actually asking for.
        </p>
      </div>

      <div className="service-card p-5 sm:p-6 bg-surface border border-surface-container-high rounded-2xl reveal-on-scroll" style={{"transitionDelay":"240ms"}}>
        <div className="service-icon w-14 h-14 rounded-xl bg-primary-container/50 flex items-center justify-center mb-5">
          <span className="material-symbols-outlined text-primary text-3xl">security</span>
        </div>
        <h3 className="font-display-lg text-xl font-bold text-primary tracking-tight mb-sm">Cyber Hygiene & Data Protection</h3>
        <p className="font-body-md text-body-md text-on-surface/75 leading-relaxed">
          Practical workshops on online fraud, safe banking and protecting personal data — plus hands-on help with online bill payments for people unfamiliar with digital services.
        </p>
      </div>

    </div>
  </div>
</section>
<section className="py-12 md:py-16 px-margin-mobile md:px-margin-desktop bg-surface" id="agriculture">
  <div className="max-w-7xl mx-auto">

    {/* Header ON TOP */}
    <div className="flex flex-col items-center text-center mb-8 md:mb-12 reveal-on-scroll">
      <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-primary/10 border border-primary/20 text-primary uppercase tracking-wider mb-3 shadow-xs">
        <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
        <span>{sectionsData.agricultural_support?.subtitle || "Backing Our Farmers"}</span>
      </div>
      <h2 className="font-display-lg text-2xl sm:text-headline-lg md:text-5xl text-primary font-bold tracking-tight">{sectionsData.agricultural_support?.title || "Agricultural Support"}</h2>
      <div className="w-16 h-1 bg-primary mx-auto mt-4 rounded-full"></div>
      <p className="font-body-lg text-body-lg text-on-surface/75 max-w-2xl mx-auto mt-4 leading-relaxed">
        {sectionsData.agricultural_support?.content?.narrative_1 || "Agriculture is the backbone of Curtorim. The Trust has worked alongside farming families for close to two decades, putting machinery, know-how and materials in their hands at no cost."}
      </p>
    </div>

    <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">

      {/* Image */}
      <div className="w-full max-w-lg mx-auto lg:max-w-none image-reveal">
        <div className="aspect-[16/10] sm:aspect-[4/3] lg:aspect-[16/10] bg-surface-container rounded-2xl overflow-hidden shadow-xl border border-surface-container-high">
          <img src={sectionsData.agricultural_support?.content?.image || "/images/ricemill.webp"} alt="Rice mill run by the Trust for local farmers in Curtorim" width="600" height="440" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" loading="lazy" decoding="async" />
        </div>
      </div>

      {/* Features */}
      <div className="space-y-3.5">

          <div className="check-row flex gap-3.5 p-3.5 sm:p-4 rounded-xl border border-surface-container-high bg-surface-container-lowest reveal-on-scroll" style={{"transitionDelay":"220ms"}}>
            <div className="w-11 h-11 rounded-lg bg-primary-container/50 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-primary text-2xl">cast_for_education</span>
            </div>
            <div>
              <h3 className="font-display-lg text-base sm:text-lg font-bold text-primary tracking-tight mb-0.5">Training Workshops for Farmers</h3>
              <p className="font-body-md text-sm text-on-surface/70 leading-relaxed">
                Hands-on workshops and farmers' melas covering organic fertiliser production, soil and land protection, waste recycling, and modern cultivation techniques.
              </p>
            </div>
          </div>

          <div className="check-row flex gap-3.5 p-3.5 sm:p-4 rounded-xl border border-surface-container-high bg-surface-container-lowest reveal-on-scroll" style={{"transitionDelay":"280ms"}}>
            <div className="w-11 h-11 rounded-lg bg-primary-container/50 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-primary text-2xl">agriculture</span>
            </div>
            <div>
              <h3 className="font-display-lg text-base sm:text-lg font-bold text-primary tracking-tight mb-0.5">Tractors & Agriculture Equipment Support</h3>
              <p className="font-body-md text-sm text-on-surface/70 leading-relaxed">
                Free use of tractors, power tillers, power trailers, harvesters and grass-cutting machines — the equipment most smallholders could never buy on their own.
              </p>
            </div>
          </div>

          <div className="check-row flex gap-3.5 p-3.5 sm:p-4 rounded-xl border border-surface-container-high bg-surface-container-lowest reveal-on-scroll" style={{"transitionDelay":"340ms"}}>
            <div className="w-11 h-11 rounded-lg bg-primary-container/50 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-primary text-2xl">volunteer_activism</span>
            </div>
            <div>
              <h3 className="font-display-lg text-base sm:text-lg font-bold text-primary tracking-tight mb-0.5">Supporting Farmers</h3>
              <p className="font-body-md text-sm text-on-surface/70 leading-relaxed">
                Free seeds, fruit-bearing and coconut saplings and fertilisers, help bringing fallow land back into cultivation, and a rice mill that keeps the local paddy economy turning.
              </p>
            </div>
          </div>

        </div>
      </div>

    </div>
  
</section>
<section className="py-12 md:py-16 px-margin-mobile md:px-margin-desktop bg-primary">
  <div className="max-w-4xl mx-auto flex flex-col items-center text-center reveal-on-scroll">
    <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-white/15 border border-white/25 text-white uppercase tracking-wider mb-3 backdrop-blur-sm shadow-sm">
      <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
      <span>Need Our Help?</span>
    </div>
    <h2 className="font-display-lg text-2xl sm:text-headline-lg text-on-primary mb-3 font-bold">Every Service Here Is Free</h2>
    <p className="font-body-lg text-body-lg text-on-primary/80 mb-8 max-w-2xl mx-auto leading-relaxed">
      If you or someone you know in Curtorim and the surrounding areas needs any of this support, get in touch. There is no charge, and no paperwork to worry about.
    </p>
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <a href="/contact" className="bg-on-primary text-primary px-8 py-3 rounded font-label-md text-label-md btn-hover shadow-lg">Contact the Trust</a>
      <a href="https://wa.me/919822485327" target="_blank" rel="noopener" className="border-2 border-on-primary/50 text-on-primary px-8 py-3 rounded font-label-md text-label-md btn-hover hover:border-on-primary transition-colors">Message on WhatsApp</a>
    </div>
  </div>
</section>

    </main>
  );
}
