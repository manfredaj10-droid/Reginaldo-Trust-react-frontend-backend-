import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { sectionsService } from '../services/index.js';

export default function About() {
  const [sectionsData, setSectionsData] = useState({});

  useEffect(() => {
    let isMounted = true;
    sectionsService.getByPage('about')
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
<section className="relative py-20 md:py-28 pt-28 md:pt-36 flex items-center justify-center text-center overflow-hidden">
  <div className="absolute inset-0">
    <img src="/images/h1.webp" alt="Trust volunteers visiting residents at a home for the aged" width="1600" height="900" className="w-full h-full object-cover" fetchpriority="high" decoding="async" />
  </div>
  <div className="absolute inset-0 bg-gradient-to-b from-surface/90 via-surface/75 to-surface/90 md:bg-surface/80"></div>
  <div className="relative z-10 flex flex-col items-center px-4 text-center w-full">

    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-3 backdrop-blur-sm shadow-sm">
      <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
      <span>Registered Public Charitable Trust • Goa</span>
    </div>

    <h1 className="font-display-lg text-[28px] sm:text-5xl md:text-6xl font-bold text-primary animated-heading leading-tight max-w-4xl mx-auto text-center justify-center">
      {sectionsData.hero?.title || "About Reginaldo Trust"}
    </h1>

    <p className="mt-3 text-primary text-base sm:text-xl md:text-2xl font-semibold reveal-on-scroll text-center">
      {sectionsData.hero?.subtitle || "Serving Humanity With Compassion & Dedication"}
    </p>
  </div>
</section>
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
<section className="py-12 md:py-16 px-margin-mobile md:px-margin-desktop max-w-6xl mx-auto">

  {/* Section Header ON TOP */}
  <div className="flex flex-col items-center text-center mb-8 md:mb-12 reveal-on-scroll">
    <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-primary/10 border border-primary/20 text-primary uppercase tracking-wider mb-3 shadow-xs">
      <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
      <span>{sectionsData.who_we_are?.subtitle || "Our Identity"}</span>
    </div>
    <h2 className="font-display-lg text-2xl sm:text-headline-lg md:text-5xl text-primary font-bold tracking-tight">{sectionsData.who_we_are?.title || "Who We Are"}</h2>
    <div className="w-16 h-1 bg-primary mx-auto mt-4 rounded-full"></div>
  </div>

  <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
    <div className="w-full max-w-sm md:max-w-md mx-auto">
      <div className="rounded-2xl overflow-hidden shadow-xl border border-surface-container-high image-reveal bg-surface-container-low">
        <img src={sectionsData.who_we_are?.content?.image || "/images/founder.webp"} alt="Aleixo Reginaldo Lourenco addressing a community gathering in Curtorim" width="513" height="763" className="w-full h-auto block hover:scale-[1.02] transition-transform duration-700" loading="lazy" decoding="async" />
      </div>
    </div>
    <div className="space-y-4 md:space-y-5 text-gray-700 text-base md:text-lg reveal-on-scroll">
      <p>{sectionsData.who_we_are?.content?.narrative_1 || "REGINALDO TRUST is a registered trust working for the upliftment of the poor, deserving and needy of society, without any reservation as to caste, creed or religion."}</p>
      <p>{sectionsData.who_we_are?.content?.narrative_2 || "Our objective is to elevate the lives of people across Goa by providing adequate facilities and working towards the betterment of our future generation. We have served the general public of Curtorim village and the surrounding areas for close to two decades — and did not fail our people even during the Covid years."}</p>
      <p>{sectionsData.who_we_are?.content?.narrative_3 ? sectionsData.who_we_are.content.narrative_3 : <>Every service and facility we offer — machinery, medical equipment, transport, scholarships — is provided <strong className="text-primary">free of cost</strong> to those who need it.</>}</p>
      
      {/* Trust credentials mini-grid */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        <div className="p-3 bg-surface-container-low rounded-lg border border-primary-container/30">
          <div className="text-xs text-on-surface/60 uppercase font-semibold">Registration</div>
          <div className="text-sm font-bold text-primary">Govt. Registered Trust</div>
        </div>
        <div className="p-3 bg-surface-container-low rounded-lg border border-primary-container/30">
          <div className="text-xs text-on-surface/60 uppercase font-semibold">Service Philosophy</div>
          <div className="text-sm font-bold text-primary">100% Free Public Relief</div>
        </div>
      </div>
    </div>
  </div>
</section>
<section className="py-12 md:py-16 px-margin-mobile md:px-margin-desktop bg-surface-container-lowest">
  <div className="max-w-6xl mx-auto">
    <div className="flex flex-col items-center text-center mb-8 md:mb-12 reveal-on-scroll">
      <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-primary/10 border border-primary/20 text-primary uppercase tracking-wider mb-3 shadow-xs">
        <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
        <span>{sectionsData.vision_mission?.subtitle || "Our Objectives"}</span>
      </div>
      <h2 className="font-display-lg text-2xl sm:text-headline-lg text-primary font-bold tracking-tight">{sectionsData.vision_mission?.title || "What the Trust Sets Out to Do"}</h2>
      <div className="w-16 h-1 bg-primary mx-auto mt-4 rounded-full"></div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
      <div className="flex gap-4 p-4 sm:p-5 bg-surface rounded-xl border border-primary-container/40 reveal-on-scroll shadow-xs">
        <span className="material-symbols-outlined text-primary text-2xl shrink-0">agriculture</span>
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed"><strong className="text-primary">Promoting agriculture</strong> — free seeds, fruit-bearing and coconut saplings, fertilisers, grass-cutting machines, tractors, power tillers and harvesters, and help bringing fallow land back into cultivation.</p>
      </div>
      <div className="flex gap-4 p-4 sm:p-5 bg-surface rounded-xl border border-primary-container/40 reveal-on-scroll shadow-xs" style={{"transitionDelay":"80ms"}}>
        <span className="material-symbols-outlined text-primary text-2xl shrink-0">compost</span>
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed"><strong className="text-primary">Organic farming education</strong> — promoting self-developed organic fertilisers and teaching land protection and waste management.</p>
      </div>
      <div className="flex gap-4 p-4 sm:p-5 bg-surface rounded-xl border border-primary-container/40 reveal-on-scroll shadow-xs" style={{"transitionDelay":"160ms"}}>
        <span className="material-symbols-outlined text-primary text-2xl shrink-0">school</span>
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed"><strong className="text-primary">Promoting education</strong> — scholarships for deserving students, recognition for toppers and rank holders, and free laptops, computers, printers, photocopiers and projectors for schools and students.</p>
      </div>
      <div className="flex gap-4 p-4 sm:p-5 bg-surface rounded-xl border border-primary-container/40 reveal-on-scroll shadow-xs" style={{"transitionDelay":"240ms"}}>
        <span className="material-symbols-outlined text-primary text-2xl shrink-0">medical_services</span>
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed"><strong className="text-primary">Medical facilities</strong> — medical camps and dispensaries, plus free wheelchairs, water beds, air beds, walkers, diabetes kits, ambulances, hearse vans and moveable morgues.</p>
      </div>
      <div className="flex gap-4 p-4 sm:p-5 bg-surface rounded-xl border border-primary-container/40 reveal-on-scroll shadow-xs" style={{"transitionDelay":"320ms"}}>
        <span className="material-symbols-outlined text-primary text-2xl shrink-0">eco</span>
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed"><strong className="text-primary">Environmental protection</strong> — cleaning drives, sapling distribution, seasonal drainage and tree-branch work, and public awareness on protecting the environment.</p>
      </div>
      <div className="flex gap-4 p-4 sm:p-5 bg-surface rounded-xl border border-primary-container/40 reveal-on-scroll shadow-xs" style={{"transitionDelay":"400ms"}}>
        <span className="material-symbols-outlined text-primary text-2xl shrink-0">groups</span>
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed"><strong className="text-primary">Skill & youth development</strong> — skill and youth programmes, technical courses, farmers' melas, job fairs, and first aid and safety camps.</p>
      </div>
    </div>
  </div>
</section>
<section className="py-12 md:py-16 px-margin-mobile md:px-margin-desktop bg-surface" id="impact">
  <div className="max-w-7xl mx-auto">
    <div className="flex flex-col items-center text-center mb-8 md:mb-12 reveal-on-scroll">
      <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-primary/10 border border-primary/20 text-primary uppercase tracking-wider mb-3 shadow-xs">
        <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
        <span>{sectionsData.decades_service?.subtitle || "Our Impact"}</span>
      </div>
      <h2 className="font-display-lg text-2xl sm:text-headline-lg md:text-4xl text-primary font-bold tracking-tight animated-heading justify-center" data-animate-heading="">{sectionsData.decades_service?.title || "Decades of Dedicated Service"}</h2>
      <div className="w-16 h-1 bg-primary mx-auto mt-4 rounded-full"></div>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">

      <div className="bg-surface-container-low p-5 sm:p-6 rounded-2xl text-center border border-primary-container/30 interactive-lift reveal-on-scroll shadow-xs" style={{"transitionDelay":"100ms"}}>
        <span className="material-symbols-outlined text-primary text-3xl md:text-4xl mb-2">calendar_today</span>
        <div className="font-display-lg text-3xl md:text-4xl text-primary font-bold mb-1 counter" data-target={sectionsData.decades_service?.content?.counter_years || "20+"}>0</div>
        <p className="font-label-md text-xs sm:text-sm text-on-surface/70 uppercase tracking-wider font-semibold">Years of Service</p>
      </div>

      <div className="bg-surface-container-low p-5 sm:p-6 rounded-2xl text-center border border-primary-container/30 interactive-lift reveal-on-scroll shadow-xs" style={{"transitionDelay":"200ms"}}>
        <span className="material-symbols-outlined text-primary text-3xl md:text-4xl mb-2">group</span>
        <div className="font-display-lg text-3xl md:text-4xl text-primary font-bold mb-1 counter" data-target={sectionsData.decades_service?.content?.counter_lives || "1000+"}>0</div>
        <p className="font-label-md text-xs sm:text-sm text-on-surface/70 uppercase tracking-wider font-semibold">Lives Touched</p>
      </div>

      <div className="bg-surface-container-low p-5 sm:p-6 rounded-2xl text-center border border-primary-container/30 interactive-lift reveal-on-scroll shadow-xs" style={{"transitionDelay":"300ms"}}>
        <span className="material-symbols-outlined text-primary text-3xl md:text-4xl mb-2">volunteer_activism</span>
        <div className="font-display-lg text-3xl md:text-4xl text-primary font-bold mb-1 counter" data-target={sectionsData.decades_service?.content?.counter_activities || "50+"}>0</div>
        <p className="font-label-md text-xs sm:text-sm text-on-surface/70 uppercase tracking-wider font-semibold">Activities Conducted</p>
      </div>
    </div>
  </div>
</section>
<section className="py-12 md:py-16 px-margin-mobile md:px-margin-desktop bg-surface-container-lowest overflow-hidden">
  <div className="max-w-7xl mx-auto">
    <div className="flex flex-col items-center text-center mb-8 md:mb-12 reveal-on-scroll">
      <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-primary/10 border border-primary/20 text-primary uppercase tracking-wider mb-3 shadow-xs">
        <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
        <span>Where We Work</span>
      </div>
      <h2 className="font-display-lg text-2xl sm:text-headline-lg md:text-4xl text-primary font-bold tracking-tight animated-heading justify-center" data-animate-heading="">Rooted in South Goa</h2>
      <div className="w-16 h-1 bg-primary mx-auto mt-4 rounded-full"></div>
    </div>

    <div className="grid md:grid-cols-2 gap-8 md:gap-10 items-center">

      <div className="reveal-on-scroll image-reveal">
        <a href="https://www.google.com/maps/search/?api=1&query=H+No.+1088,+St.+Xavier,+Raia,+Salcete,+Goa+-+403720,+India" target="_blank" className="block relative rounded-2xl overflow-hidden h-64 sm:h-72 md:h-80 border border-primary-container/40 shadow-sm">

          {/* Map */}
          <iframe className="absolute inset-0 w-full h-full pointer-events-none" style={{"border":"0","filter":"saturate(0.95) contrast(1.05)"}} src="https://www.google.com/maps?q=H%20No.%201088,%20St.%20Xavier,%20Raia,%20Salcete,%20Goa%20-%20403720,%20India&output=embed">
          </iframe>

          <div className="absolute inset-0 shadow-[inset_0_0_60px_rgba(0,0,0,0.15)] z-10"></div>

          <div className="absolute top-4 left-4 z-20 text-xs tracking-wide text-primary font-semibold bg-white/80 backdrop-blur px-3 py-1 rounded-full shadow-xs">
            Raia, Goa
          </div>

          <div className="absolute bottom-4 left-4 z-20 text-xs text-primary/80 font-medium bg-white/80 backdrop-blur px-3 py-1 rounded-full shadow-xs">
            Click to open in Google Maps
          </div>

        </a>
      </div>

      {/* Text + reach stats */}
      <div className="space-y-6 reveal-on-scroll" style={{"transitionDelay":"200ms"}}>
        <p className="font-body-lg text-base text-on-surface/80 leading-relaxed">
          Our work is anchored in <strong className="text-primary font-semibold">Curtorim village</strong>, in the Salcete region of South Goa — a community we have called home and served for over 20 years. From this base, our programs reach surrounding villages and families across the district.
        </p>

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div className="p-3.5 sm:p-4 bg-surface rounded-xl border border-primary-container/30 text-center interactive-lift shadow-xs">
            <span className="material-symbols-outlined text-primary text-2xl mb-1 block">location_on</span>
            <p className="font-display-lg font-bold text-primary text-lg sm:text-xl">Curtorim</p>
            <p className="font-body-md text-on-surface/60 text-xs mt-0.5 font-medium">Home base</p>
          </div>
          <div className="p-3.5 sm:p-4 bg-surface rounded-xl border border-primary-container/30 text-center interactive-lift shadow-xs">
            <span className="material-symbols-outlined text-primary text-2xl mb-1 block">map</span>
            <p className="font-display-lg font-bold text-primary text-lg sm:text-xl">South Goa</p>
            <p className="font-body-md text-on-surface/60 text-xs mt-0.5 font-medium">Area of reach</p>
          </div>
          <div className="p-3.5 sm:p-4 bg-surface rounded-xl border border-primary-container/30 text-center interactive-lift shadow-xs">
            <span className="material-symbols-outlined text-primary text-2xl mb-1 block">groups</span>
            <p className="font-display-lg font-bold text-primary text-lg sm:text-xl">All</p>
            <p className="font-body-md text-on-surface/60 text-xs mt-0.5 font-medium">Castes & creeds</p>
          </div>
          <div className="p-3.5 sm:p-4 bg-surface rounded-xl border border-primary-container/30 text-center interactive-lift shadow-xs">
            <span className="material-symbols-outlined text-primary text-2xl mb-1 block">diversity_3</span>
            <p className="font-display-lg font-bold text-primary text-lg sm:text-xl">20+</p>
            <p className="font-body-md text-on-surface/60 text-xs mt-0.5 font-medium">Years locally rooted</p>
          </div>
        </div>
      </div>

    </div>
  </div>
</section>
<section className="py-12 md:py-16 px-margin-mobile md:px-margin-desktop bg-primary" id="donate">
  <div className="max-w-4xl mx-auto text-center reveal-on-scroll">
    <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-white/15 border border-white/25 text-white uppercase tracking-wider mb-3 backdrop-blur-sm shadow-sm">
      <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
      <span>Make a Difference</span>
    </div>
    <h2 className="font-display-lg text-2xl sm:text-headline-lg text-on-primary mb-3 animated-heading justify-center font-bold" data-animate-heading="">Be Part of This Impact</h2>
    <p className="font-body-lg text-sm sm:text-base text-on-primary/80 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed">
      Your contribution directly funds the homes, health services, and training programs that keep this work alive across South Goa. Every rupee reaches a person who needs it.
    </p>
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
      <a href="/contact" className="bg-on-primary text-primary px-6 sm:px-8 py-3 rounded-lg font-label-md text-sm sm:text-base font-semibold btn-hover shadow-lg">Donate Now</a>
      <a href="/ourwork" className="border-2 border-on-primary/50 text-on-primary px-6 sm:px-8 py-3 rounded-lg font-label-md text-sm sm:text-base font-semibold btn-hover hover:border-on-primary transition-colors">See Our Programs</a>
    </div>
  </div>
</section>

    </main>
  );
}
