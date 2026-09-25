import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { contentService, initiativesService, sectionsService } from '../services/index.js';

const DEFAULT_INITIATIVES = [
  {
    id: 1,
    title: 'Healthcare & Emergency Support',
    category: '24/7 Free Ambulance',
    description: 'Round-the-clock free ambulance and hearse van service, hospital aid, and frequent village medical camps.',
    image: '/images/h1.webp',
    button_text: 'Free community service',
    button_url: '/services#services'
  },
  {
    id: 2,
    title: 'Farm Machinery & Rice Mill',
    category: 'Agriculture',
    description: 'Free lending of tractors, power tillers, and harvesters to Curtorim farmers, plus high-efficiency local paddy processing.',
    image: '/images/ricemill.webp',
    button_text: 'Backing local cultivators',
    button_url: '/services#agriculture'
  },
  {
    id: 3,
    title: 'Care for the Elderly',
    category: 'Dignity & Care',
    description: 'Regular visits, essential supplies, mobility equipment, and ongoing support for residents of homes for the aged.',
    image: '/images/h1.webp',
    button_text: 'Compassion & fellowship',
    button_url: '/services#services'
  },
  {
    id: 4,
    title: 'Education & Scholarships',
    category: 'Youth & Education',
    description: 'Free annual distribution of notebooks, school bags, learning kits, and merit-based financial aid for needy students.',
    image: '/images/books-bags-1.webp',
    button_text: 'Empowering the next generation',
    button_url: '/services#services'
  },
  {
    id: 5,
    title: 'Dignified House Restoration',
    category: 'Shelter & Dignity',
    description: 'Repairing dangerous roofs and rebuilding structurally unsafe homes for impoverished families with full safety standards.',
    image: '/images/house-inaug-2.webp',
    button_text: 'Secure shelter for families',
    button_url: '/services#services'
  },
  {
    id: 6,
    title: 'Livelihoods & Skills Camps',
    category: 'Skills & Livelihood',
    description: 'Conducting coastal fisheries workshops, modern vocational skill training, and job placement assistance drives.',
    image: '/images/fisheries-camp-1.webp',
    button_text: 'Self-reliance & growth',
    button_url: '/services#services'
  }
];

const DEFAULT_HERO_SLIDES = [
  { image: '/images/h1.webp', alt: 'Trust volunteers visiting residents at a home for the aged' },
  { image: '/images/h2.webp', alt: 'Schoolchildren receiving free books and stationery' },
  { image: '/images/donate.webp', alt: 'Trust volunteers distributing free ration to families in need' }
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [touchStartX, setTouchStartX] = useState(0);
  const [homeData, setHomeData] = useState(null);
  const [sectionsData, setSectionsData] = useState({});
  const [initiativesList, setInitiativesList] = useState(DEFAULT_INITIATIVES);

  useEffect(() => {
    let isMounted = true;
    contentService.get('home')
      .then(res => {
        if (isMounted && res?.data) setHomeData(res.data);
      })
      .catch(() => null);

    sectionsService.getByPage('home')
      .then(res => {
        if (isMounted && Array.isArray(res)) {
          const map = {};
          res.forEach(s => { map[s.section_key] = s; });
          setSectionsData(map);
        }
      })
      .catch(() => null);

    initiativesService.getAll()
      .then(res => {
        if (isMounted && Array.isArray(res) && res.length > 0) {
          setInitiativesList(res);
        }
      })
      .catch(() => null);

    return () => { isMounted = false; };
  }, []);

  const heroContent = sectionsData.hero?.content;
  const rawSlides = heroContent?.slides;
  const activeSlides = (Array.isArray(rawSlides) && rawSlides.length > 0)
    ? rawSlides.map((s, i) => ({
        image: s?.image || s?.src || DEFAULT_HERO_SLIDES[i % DEFAULT_HERO_SLIDES.length].image,
        alt: s?.alt || DEFAULT_HERO_SLIDES[i % DEFAULT_HERO_SLIDES.length].alt
      }))
    : (heroContent?.bg_image
        ? [
            { image: heroContent.bg_image, alt: DEFAULT_HERO_SLIDES[0].alt },
            DEFAULT_HERO_SLIDES[1],
            DEFAULT_HERO_SLIDES[2]
          ]
        : DEFAULT_HERO_SLIDES);
  const totalSlides = activeSlides.length > 0 ? activeSlides.length : 1;

  useEffect(() => {
    if (isHovered || totalSlides <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 6000);
    return () => clearInterval(timer);
  }, [isHovered, totalSlides]);

  return (
    <main id="main-content">
<header className="relative pt-24 pb-14 sm:pt-28 sm:pb-16 md:pt-32 md:pb-20 px-4 sm:px-6 md:px-8 lg:px-margin-desktop overflow-hidden min-h-[500px] sm:min-h-[540px] md:min-h-[580px] flex flex-col justify-center"
    onMouseEnter={() => setIsHovered(true)}
    onMouseLeave={() => setIsHovered(false)}
    onTouchStart={(e) => setTouchStartX(e.changedTouches[0].screenX)}
    onTouchEnd={(e) => {
      const diff = e.changedTouches[0].screenX - touchStartX;
      if (Math.abs(diff) > 40 && totalSlides > 1) {
        if (diff < 0) setCurrentSlide((prev) => (prev + 1) % totalSlides);
        else setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
      }
    }}
  >
      <div className="hero-slider">
        {activeSlides.map((slide, idx) => (
          <div key={idx} className={`hero-slide ${currentSlide === idx ? 'active' : ''}`}>
            <img
              alt={slide.alt || 'Reginaldo Trust community welfare activity'}
              src={slide.image}
              width="1600"
              height="900"
              fetchPriority={idx === 0 ? 'high' : 'auto'}
              loading={idx === 0 ? 'eager' : 'lazy'}
              decoding="async"
              onError={(e) => {
                const fallback = DEFAULT_HERO_SLIDES[idx % DEFAULT_HERO_SLIDES.length]?.image;
                if (fallback && e.currentTarget.src !== fallback) {
                  e.currentTarget.src = fallback;
                }
              }}
            />
          </div>
        ))}
      </div>
      <div className="hero-overlay"></div>
      
      <div className="max-w-7xl mx-auto w-full relative z-20">
        <div className="w-full md:w-3/5 lg:w-7/12 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-4 backdrop-blur-sm shadow-sm">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span>Registered Public Charitable Trust • Goa</span>
          </div>
          <h1 className="font-display-lg text-[28px] sm:text-[38px] md:text-5xl lg:text-display-lg text-primary mb-3.5 sm:mb-4 leading-[1.18] font-bold char-reveal-container active" id="main-hero-title">
            <span className="char-reveal-word">
              {"Serving".split("").map((c, i) => <span key={i} className="char-reveal-char" style={{ transitionDelay: `${i * 40}ms` }}>{c}</span>)}
            </span>{" "}
            <span className="char-reveal-word">
              {"Humanity".split("").map((c, i) => <span key={i} className="char-reveal-char" style={{ transitionDelay: `${(7 + i) * 40}ms` }}>{c}</span>)}
            </span>{" "}
            <span className="char-reveal-word">
              {"With".split("").map((c, i) => <span key={i} className="char-reveal-char" style={{ transitionDelay: `${(15 + i) * 40}ms` }}>{c}</span>)}
            </span>{" "}
            <span className="char-reveal-word">
              {"Compassion".split("").map((c, i) => <span key={i} className="char-reveal-char" style={{ transitionDelay: `${(19 + i) * 40}ms` }}>{c}</span>)}
            </span>
          </h1>
          <p className="font-body-lg text-sm sm:text-base md:text-lg lg:text-xl text-on-surface/85 mb-6 md:mb-8 max-w-xl mx-auto md:mx-0 leading-relaxed">
            {sectionsData.hero?.content?.narrative_1 || "Supporting communities for over 20 years. Dedicated to the upliftment of the poor, deserving, and needy without discrimination of caste, creed, or religion."}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center md:justify-start">
            <a href="/contact" className="bg-primary text-on-primary px-6 sm:px-8 py-3 sm:py-3.5 rounded font-label-md text-sm sm:text-label-md btn-hover shadow-md text-center font-semibold inline-flex items-center justify-center gap-2 min-h-[44px]">
              <span>Join Our Mission</span>
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </a>
            <a href="/services" className="border-2 border-primary/30 hover:border-primary text-primary px-6 sm:px-8 py-3 sm:py-3.5 rounded font-label-md text-sm sm:text-label-md btn-hover transition-colors text-center font-semibold inline-flex items-center justify-center min-h-[44px]">
              Explore Services
            </a>
          </div>
          {/* Trust metric highlights */}
          <div className="flex items-center gap-3 sm:gap-6 mt-6 md:mt-8 pt-5 md:pt-6 border-t border-surface-container-high/60 text-xs text-on-surface/75 flex-wrap justify-center md:justify-start">
            <div className="flex items-center gap-1.5 font-medium">
              <span className="material-symbols-outlined text-primary text-base">verified</span>
              <span>20+ Years Serving Goa</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium">
              <span className="material-symbols-outlined text-primary text-base">volunteer_activism</span>
              <span>100% Free Public Services</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium">
              <span className="material-symbols-outlined text-primary text-base">diversity_1</span>
              <span>All Communities Welcomed</span>
            </div>
          </div>
        </div>
      </div>

      <div className="hero-dots" id="hero-dots">
        {activeSlides.map((_, idx) => (
          <button
            key={idx}
            type="button"
            aria-label={`Go to slide ${idx + 1}`}
            className={`dot ${currentSlide === idx ? 'active' : ''}`}
            onClick={() => setCurrentSlide(idx)}
          />
        ))}
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
<section className="py-12 md:py-16 px-margin-mobile md:px-margin-desktop bg-surface-container-lowest" id="about">
      <div className="max-w-7xl mx-auto">

        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-8 md:mb-12 reveal-on-scroll">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-primary/10 border border-primary/20 text-primary uppercase tracking-wider mb-3 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
            <span>{sectionsData.journey?.subtitle || "About Us & Impact"}</span>
          </div>
          <h2 className="font-display-lg text-headline-lg md:text-5xl text-primary font-bold animated-heading justify-center" data-animate-heading="">{sectionsData.journey?.title || "Our Journey of Upliftment"}</h2>
          <div className="w-16 h-1 bg-primary mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          
          {/* Left: Founder Image + Badge (Col 5) */}
          <div className="lg:col-span-5 relative max-w-md mx-auto lg:max-w-none">
            <div className="aspect-[4/3] sm:aspect-square bg-surface-container rounded-2xl overflow-hidden shadow-xl image-reveal shimmer-loading">
              <img alt="Aleixo Reginaldo Lourenco addressing a community gathering in Curtorim" className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700" onLoad={(e) => e.currentTarget.parentElement?.classList.remove('shimmer-loading')} src={sectionsData.journey?.content?.image || "/images/founder.webp"} loading="lazy" decoding="async" />
            </div>
            <div className="absolute bottom-2 right-2 sm:-bottom-4 sm:-right-4 p-3 sm:p-4 bg-primary text-on-primary rounded-xl shadow-xl reveal-on-scroll flex items-center gap-2.5 sm:gap-3">
              <span className="material-symbols-outlined text-2xl md:text-3xl text-primary-container">verified</span>
              <div>
                <p className="font-display-lg text-sm sm:text-base md:text-lg font-bold leading-tight">{sectionsData.journey?.content?.counter_years || "20+"} Years</p>
                <p className="text-[11px] sm:text-xs text-white/80 uppercase tracking-wider">Serving Goa with Care</p>
              </div>
            </div>
          </div>

          {/* Right: Story Narrative + Integrated 3-Stat Strip (Col 7) */}
          <div className="lg:col-span-7 flex flex-col justify-center text-center lg:text-left reveal-on-scroll">
            <p className="font-body-lg text-base md:text-lg text-on-surface/85 mb-4 leading-relaxed">
              {sectionsData.journey?.content?.narrative_1 ? (
                <span>{sectionsData.journey.content.narrative_1}</span>
              ) : (
                <><strong className="text-primary font-bold">REGINALDO TRUST</strong> is a registered public charitable trust dedicated to the upliftment of the poor, deserving, and needy across Curtorim village and surrounding areas in Goa — without discrimination of caste, creed, or religion.</>
              )}
            </p>
            <p className="font-body-lg text-sm sm:text-base text-on-surface/75 mb-6 md:mb-8 leading-relaxed">
              {sectionsData.journey?.content?.narrative_2 || "Founded on empathy and hands-on community service, every initiative we run — from free 24/7 ambulances and farmer machinery to student laptops and rebuilt homes — is delivered 100% free to beneficiaries."}
            </p>

            {/* Integrated Impact Counters Strip */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 p-3.5 sm:p-4 bg-surface-container-low rounded-2xl border border-primary-container/30 mb-6 text-center" id="impact">
              <div className="p-2 sm:p-2.5">
                <div className="font-display-lg text-2xl sm:text-3xl md:text-4xl text-primary font-bold counter" data-target={sectionsData.journey?.content?.counter_years || "20+"}>0</div>
                <p className="font-label-md text-[11px] sm:text-xs text-on-surface/70 uppercase tracking-wider mt-1 font-semibold">Years of Service</p>
              </div>
              <div className="p-2 sm:p-2.5 border-x border-surface-container-high/80">
                <div className="font-display-lg text-2xl sm:text-3xl md:text-4xl text-primary font-bold counter" data-target={sectionsData.journey?.content?.counter_lives || "1000+"}>0</div>
                <p className="font-label-md text-[11px] sm:text-xs text-on-surface/70 uppercase tracking-wider mt-1 font-semibold">Lives Touched</p>
              </div>
              <div className="p-2 sm:p-2.5">
                <div className="font-display-lg text-2xl sm:text-3xl md:text-4xl text-primary font-bold counter" data-target={sectionsData.journey?.content?.counter_activities || "50+"}>0</div>
                <p className="font-label-md text-[11px] sm:text-xs text-on-surface/70 uppercase tracking-wider mt-1 font-semibold">Activities Held</p>
              </div>
            </div>

            <div className="flex justify-center lg:justify-start">
              <a href="/about" className="bg-primary text-on-primary px-6 sm:px-8 py-3 rounded-lg font-label-md text-sm sm:text-label-md font-semibold btn-hover active:scale-95 inline-flex items-center gap-2 shadow-md">
                <span>Read Our Full Story</span>
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
<section className="py-12 md:py-16 px-margin-mobile md:px-margin-desktop bg-surface" id="initiatives">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col items-center text-center mb-8 md:mb-12 reveal-on-scroll">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-primary/10 border border-primary/20 text-primary uppercase tracking-wider mb-3 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
            <span>{sectionsData.initiatives?.subtitle || "Areas of Action"}</span>
          </div>
          <h2 className="font-display-lg text-headline-lg md:text-5xl text-primary font-bold animated-heading justify-center" data-animate-heading="">{sectionsData.initiatives?.title || "Our Core Initiatives"}</h2>
          <div className="w-16 h-1 bg-primary mx-auto mt-4 rounded-full"></div>
        </div>

        {/* 6-Card Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          
          {/* Card 1: Free Healthcare & Ambulance */}
          <a href="services.html#services" className="group bg-white rounded-2xl overflow-hidden border border-surface-container-high shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between interactive-lift">
            <div className="relative h-44 sm:h-48 overflow-hidden">
              <img src="/images/h1.webp" alt="Healthcare and relief assistance" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" decoding="async" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent"></div>
              <span className="absolute top-3 left-3 bg-red-600 text-white text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                <span>24/7 Free Ambulance</span>
              </span>
            </div>
            <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-display-lg text-lg sm:text-xl font-bold text-primary group-hover:text-primary/85 transition-colors mb-2">Healthcare & Emergency Support</h3>
                <p className="text-on-surface/75 text-sm leading-relaxed">Round-the-clock free ambulance and hearse van service, hospital aid, and frequent village medical camps.</p>
              </div>
              <div className="mt-4 pt-4 border-t border-surface-container-high flex items-center justify-between text-xs font-semibold text-primary">
                <span>Free community service</span>
                <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </div>
            </div>
          </a>

          {/* Card 2: Modern Rice Mill & Farm Machinery */}
          <a href="services.html#agriculture" className="group bg-white rounded-2xl overflow-hidden border border-surface-container-high shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between interactive-lift">
            <div className="relative h-44 sm:h-48 overflow-hidden">
              <img src="/images/ricemill.webp" alt="Rice mill and farm equipment for farmers" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" decoding="async" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent"></div>
              <span className="absolute top-3 left-3 bg-primary text-white text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
                <span>Agriculture</span>
              </span>
            </div>
            <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-display-lg text-lg sm:text-xl font-bold text-primary group-hover:text-primary/85 transition-colors mb-2">Farm Machinery & Rice Mill</h3>
                <p className="text-on-surface/75 text-sm leading-relaxed">Free lending of tractors, power tillers, and harvesters to Curtorim farmers, plus high-efficiency local paddy processing.</p>
              </div>
              <div className="mt-4 pt-4 border-t border-surface-container-high flex items-center justify-between text-xs font-semibold text-primary">
                <span>Backing local cultivators</span>
                <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </div>
            </div>
          </a>

          {/* Card 3: Care for the Elderly */}
          <a href="services.html#services" className="group bg-white rounded-2xl overflow-hidden border border-surface-container-high shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between interactive-lift">
            <div className="relative h-44 sm:h-48 overflow-hidden">
              <img src="/images/h1.webp" alt="Elderly care and visits" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" decoding="async" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent"></div>
              <span className="absolute top-3 left-3 bg-primary text-white text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
                <span>Dignity & Care</span>
              </span>
            </div>
            <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-display-lg text-lg sm:text-xl font-bold text-primary group-hover:text-primary/85 transition-colors mb-2">Care for the Elderly</h3>
                <p className="text-on-surface/75 text-sm leading-relaxed">Regular visits, essential supplies, mobility equipment, and ongoing support for residents of homes for the aged.</p>
              </div>
              <div className="mt-4 pt-4 border-t border-surface-container-high flex items-center justify-between text-xs font-semibold text-primary">
                <span>Compassion & fellowship</span>
                <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </div>
            </div>
          </a>

          {/* Card 4: Education & Scholarships */}
          <a href="services.html#services" className="group bg-white rounded-2xl overflow-hidden border border-surface-container-high shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between interactive-lift">
            <div className="relative h-44 sm:h-48 overflow-hidden">
              <img src="/images/books-bags-1.webp" alt="Free books and school bags distribution" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" decoding="async" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent"></div>
              <span className="absolute top-3 left-3 bg-primary text-white text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
                <span>Youth & Education</span>
              </span>
            </div>
            <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-display-lg text-lg sm:text-xl font-bold text-primary group-hover:text-primary/85 transition-colors mb-2">Education & Scholarships</h3>
                <p className="text-on-surface/75 text-sm leading-relaxed">Free annual distribution of notebooks, school bags, learning kits, and merit-based financial aid for needy students.</p>
              </div>
              <div className="mt-4 pt-4 border-t border-surface-container-high flex items-center justify-between text-xs font-semibold text-primary">
                <span>Empowering the next generation</span>
                <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </div>
            </div>
          </a>

          {/* Card 5: House Restoration & Shelter */}
          <a href="services.html#services" className="group bg-white rounded-2xl overflow-hidden border border-surface-container-high shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between interactive-lift">
            <div className="relative h-44 sm:h-48 overflow-hidden">
              <img src="/images/house-inaug-2.webp" alt="Rebuilt house handover" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" decoding="async" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent"></div>
              <span className="absolute top-3 left-3 bg-primary text-white text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
                <span>Shelter & Dignity</span>
              </span>
            </div>
            <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-display-lg text-lg sm:text-xl font-bold text-primary group-hover:text-primary/85 transition-colors mb-2">Dignified House Restoration</h3>
                <p className="text-on-surface/75 text-sm leading-relaxed">Repairing dangerous roofs and rebuilding structurally unsafe homes for impoverished families with full safety standards.</p>
              </div>
              <div className="mt-4 pt-4 border-t border-surface-container-high flex items-center justify-between text-xs font-semibold text-primary">
                <span>Secure shelter for families</span>
                <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </div>
            </div>
          </a>

          {/* Card 6: Livelihoods & Vocational Training */}
          <a href="services.html#services" className="group bg-white rounded-2xl overflow-hidden border border-surface-container-high shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between interactive-lift">
            <div className="relative h-44 sm:h-48 overflow-hidden">
              <img src="/images/fisheries-camp-1.webp" alt="Fisheries training camp" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" decoding="async" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent"></div>
              <span className="absolute top-3 left-3 bg-primary text-white text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
                <span>Skills & Livelihood</span>
              </span>
            </div>
            <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-display-lg text-lg sm:text-xl font-bold text-primary group-hover:text-primary/85 transition-colors mb-2">Livelihoods & Skills Camps</h3>
                <p className="text-on-surface/75 text-sm leading-relaxed">Conducting coastal fisheries workshops, modern vocational skill training, and job placement assistance drives.</p>
              </div>
              <div className="mt-4 pt-4 border-t border-surface-container-high flex items-center justify-between text-xs font-semibold text-primary">
                <span>Self-reliance & growth</span>
                <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </div>
            </div>
          </a>

        </div>

        <div className="text-center mt-8 md:mt-10 reveal-on-scroll">
          <a href="/services" className="bg-primary text-on-primary px-6 sm:px-8 py-3 rounded-lg font-label-md text-sm sm:text-label-md btn-hover active:scale-95 inline-flex items-center gap-2 font-semibold shadow-sm">
            <span>Explore All Our Services</span>
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </a>
        </div>

      </div>
    </section>
<section className="py-12 md:py-16 px-margin-mobile md:px-margin-desktop bg-surface-container-low/60 overflow-hidden" id="mission">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col items-center text-center mb-8 md:mb-12 reveal-on-scroll">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-primary/10 border border-primary/20 text-primary uppercase tracking-wider mb-3 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
            <span>{sectionsData.support_areas?.subtitle || "Our Mission"}</span>
          </div>
          <h2 className="font-display-lg text-headline-lg md:text-5xl text-primary font-bold animated-heading justify-center" data-animate-heading="">{sectionsData.support_areas?.title || "Key Areas of Support"}</h2>
          <div className="w-16 h-1 bg-primary mx-auto mt-4 rounded-full"></div>
        </div>

        {/* 4-Card Responsive Grid with Proper Space Utilization */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 mt-6 md:mt-8">

          {/* Card 1: Home for the Aged */}
          <a href="services.html#services" className="group relative bg-white/90 backdrop-blur-md border border-surface-container-high rounded-2xl p-5 sm:p-6 shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden interactive-lift reveal-on-scroll" style={{"transitionDelay":"100ms"}}>
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary-container/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
            </div>
            <div className="absolute top-0 left-0 w-full h-1 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left">
            </div>
            <div>
              <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-xl bg-primary-container/50 flex items-center justify-center transition-all duration-300 group-hover:bg-primary shadow-xs mb-4 group-hover:rotate-3">
                <span className="material-symbols-outlined text-primary text-2xl sm:text-3xl transition-colors duration-300 group-hover:text-white">home</span>
              </div>
              <h3 className="font-display-lg text-lg sm:text-xl font-bold text-primary tracking-tight mb-2 group-hover:text-primary transition-colors">
                Home for the Aged</h3>
              <p className="text-sm text-on-surface/75 leading-relaxed">Providing dedicated residential care, regular volunteer
                visits, essential supplies, and warm fellowship for elderly citizens.</p>
            </div>
            <div className="border-t border-surface-container-high/80 pt-3.5 mt-5 flex items-center justify-between">
              <span className="text-xs font-semibold text-primary/80 tracking-wide flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/70"></span>
                <span>Planned project</span>
              </span>
              <span className="material-symbols-outlined text-sm text-primary group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </div>
          </a>

          {/* Card 2: Rice Mill for Farmers */}
          <a href="services.html#agriculture" className="group relative bg-white/90 backdrop-blur-md border border-surface-container-high rounded-2xl p-5 sm:p-6 shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden interactive-lift reveal-on-scroll" style={{"transitionDelay":"200ms"}}>
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary-container/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
            </div>
            <div className="absolute top-0 left-0 w-full h-1 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left">
            </div>
            <div>
              <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-xl bg-primary-container/50 flex items-center justify-center transition-all duration-300 group-hover:bg-primary shadow-xs mb-4 group-hover:rotate-3">
                <span className="material-symbols-outlined text-primary text-2xl sm:text-3xl transition-colors duration-300 group-hover:text-white">agriculture</span>
              </div>
              <h3 className="font-display-lg text-lg sm:text-xl font-bold text-primary tracking-tight mb-2 group-hover:text-primary transition-colors">
                Rice Mill for Farmers</h3>
              <p className="text-sm text-on-surface/75 leading-relaxed">Modern local grain processing and free lending of
                tractors, power tillers, and harvesters directly to Curtorim cultivators.</p>
            </div>
            <div className="border-t border-surface-container-high/80 pt-3.5 mt-5 flex items-center justify-between">
              <span className="text-xs font-semibold text-primary/80 tracking-wide flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/70"></span>
                <span>In development</span>
              </span>
              <span className="material-symbols-outlined text-sm text-primary group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </div>
          </a>

          {/* Card 3: Holistic Health */}
          <a href="services.html#services" className="group relative bg-white/90 backdrop-blur-md border border-surface-container-high rounded-2xl p-5 sm:p-6 shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden interactive-lift reveal-on-scroll" style={{"transitionDelay":"300ms"}}>
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary-container/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
            </div>
            <div className="absolute top-0 left-0 w-full h-1 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left">
            </div>
            <div>
              <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-xl bg-primary-container/50 flex items-center justify-center transition-all duration-300 group-hover:bg-primary shadow-xs mb-4 group-hover:rotate-3">
                <span className="material-symbols-outlined text-primary text-2xl sm:text-3xl transition-colors duration-300 group-hover:text-white">health_and_safety</span>
              </div>
              <h3 className="font-display-lg text-lg sm:text-xl font-bold text-primary tracking-tight mb-2 group-hover:text-primary transition-colors">
                Holistic Health</h3>
              <p className="text-sm text-on-surface/75 leading-relaxed">Round-the-clock free emergency ambulance runs,
                specialized village health camps, and mobility aid distributions.</p>
            </div>
            <div className="border-t border-surface-container-high/80 pt-3.5 mt-5 flex items-center justify-between">
              <span className="text-xs font-semibold text-primary/80 tracking-wide flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/70"></span>
                <span>Camps, equipment & ambulance</span>
              </span>
              <span className="material-symbols-outlined text-sm text-primary group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </div>
          </a>

          {/* Card 4: Up-skilling Labs */}
          <a href="services.html#services" className="group relative bg-white/90 backdrop-blur-md border border-surface-container-high rounded-2xl p-5 sm:p-6 shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden interactive-lift reveal-on-scroll" style={{"transitionDelay":"400ms"}}>
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary-container/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
            </div>
            <div className="absolute top-0 left-0 w-full h-1 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left">
            </div>
            <div>
              <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-xl bg-primary-container/50 flex items-center justify-center transition-all duration-300 group-hover:bg-primary shadow-xs mb-4 group-hover:rotate-3">
                <span className="material-symbols-outlined text-primary text-2xl sm:text-3xl transition-colors duration-300 group-hover:text-white">workspace_premium</span>
              </div>
              <h3 className="font-display-lg text-lg sm:text-xl font-bold text-primary tracking-tight mb-2 group-hover:text-primary transition-colors">
                Up-skilling Labs</h3>
              <p className="text-sm text-on-surface/75 leading-relaxed">Youth vocational skill workshops, coastal fisheries
                camps, free learning supplies, and career guidance drives.</p>
            </div>
            <div className="border-t border-surface-container-high/80 pt-3.5 mt-5 flex items-center justify-between">
              <span className="text-xs font-semibold text-primary/80 tracking-wide flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/70"></span>
                <span>Workshops & job camps</span>
              </span>
              <span className="material-symbols-outlined text-sm text-primary group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </div>
          </a>

        </div>

      </div>
    </section>
<section className="py-12 md:py-16 px-margin-mobile md:px-margin-desktop bg-surface-container-lowest" id="gallery-section">
      <div className="max-w-7xl mx-auto">

        {/* Header ON TOP */}
        <div className="flex flex-col items-center text-center mb-8 md:mb-12 reveal-on-scroll">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-primary/10 border border-primary/20 text-primary uppercase tracking-wider mb-3 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
            <span>Community In Action</span>
          </div>
          <h3 className="font-display-lg text-headline-lg md:text-5xl text-primary font-bold animated-heading justify-center" data-animate-heading="">Gallery Highlights</h3>
          <div className="w-16 h-1 bg-primary mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-8 md:mb-10">
          {/* 1. House Restoration */}
          <div className="h-40 sm:h-48 md:h-56 lg:h-64 rounded-xl overflow-hidden group interactive-lift relative image-reveal shimmer-loading" style={{"transitionDelay":"100ms"}}>
            <img alt="Aleixo Reginaldo Lourenco handing over rebuilt house keys to family" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" onLoad={(e) => e.currentTarget.parentElement?.classList.remove('shimmer-loading')} src="/images/house-inaug-2.webp" loading="lazy" decoding="async" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
              <span className="font-label-md text-white text-[11px] sm:text-xs uppercase tracking-wider block font-semibold truncate">House
                Restoration</span>
              <p className="text-white/85 text-[11px] sm:text-xs truncate mt-0.5">Handing over rebuilt home</p>
            </div>
          </div>

          {/* 2. Education */}
          <div className="h-40 sm:h-48 md:h-56 lg:h-64 rounded-xl overflow-hidden group interactive-lift relative image-reveal shimmer-loading" style={{"transitionDelay":"150ms"}}>
            <img alt="Children receiving free books and school bags" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" onLoad={(e) => e.currentTarget.parentElement?.classList.remove('shimmer-loading')} src="/images/books-bags-1.webp" loading="lazy" decoding="async" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
              <span className="font-label-md text-white text-[11px] sm:text-xs uppercase tracking-wider block font-semibold truncate">Education
                Support</span>
              <p className="text-white/85 text-[11px] sm:text-xs truncate mt-0.5">Free books & bags distribution</p>
            </div>
          </div>

          {/* 3. Fisheries & Skills */}
          <div className="h-40 sm:h-48 md:h-56 lg:h-64 rounded-xl overflow-hidden group interactive-lift relative image-reveal shimmer-loading" style={{"transitionDelay":"200ms"}}>
            <img alt="Fisheries training camp conducted for coastal community" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" onLoad={(e) => e.currentTarget.parentElement?.classList.remove('shimmer-loading')} src="/images/fisheries-camp-1.webp" loading="lazy" decoding="async" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
              <span className="font-label-md text-white text-[11px] sm:text-xs uppercase tracking-wider block font-semibold truncate">Livelihoods
                & Training</span>
              <p className="text-white/85 text-[11px] sm:text-xs truncate mt-0.5">Fisheries & coastal skills camp</p>
            </div>
          </div>

          {/* 4. Agriculture / Raan Baji */}
          <div className="h-40 sm:h-48 md:h-56 lg:h-64 rounded-xl overflow-hidden group interactive-lift relative image-reveal shimmer-loading" style={{"transitionDelay":"250ms"}}>
            <img alt="Raan Baji traditional wild vegetables exhibition" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" onLoad={(e) => e.currentTarget.parentElement?.classList.remove('shimmer-loading')} src="/images/raan-baji-2.webp" loading="lazy" decoding="async" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
              <span className="font-label-md text-white text-[11px] sm:text-xs uppercase tracking-wider block font-semibold truncate">Agriculture</span>
              <p className="text-white/85 text-[11px] sm:text-xs truncate mt-0.5">Traditional wild produce fest</p>
            </div>
          </div>

          {/* 5. Elderly Care */}
          <div className="h-40 sm:h-48 md:h-56 lg:h-64 rounded-xl overflow-hidden group interactive-lift relative image-reveal shimmer-loading" style={{"transitionDelay":"300ms"}}>
            <img alt="Trust volunteers with residents at a home for the aged" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" onLoad={(e) => e.currentTarget.parentElement?.classList.remove('shimmer-loading')} src="/images/h1.webp" loading="lazy" decoding="async" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
              <span className="font-label-md text-white text-[11px] sm:text-xs uppercase tracking-wider block font-semibold truncate">Elderly
                Care</span>
              <p className="text-white/85 text-[11px] sm:text-xs truncate mt-0.5">Home for the aged visits</p>
            </div>
          </div>

          {/* 6. Grassroots Day */}
          <div className="h-40 sm:h-48 md:h-56 lg:h-64 rounded-xl overflow-hidden group interactive-lift relative image-reveal shimmer-loading" style={{"transitionDelay":"350ms"}}>
            <img alt="Community members gathered for Grassroots Day in Curtorim" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" onLoad={(e) => e.currentTarget.parentElement?.classList.remove('shimmer-loading')} src="/images/grassroots-day-1.webp" loading="lazy" decoding="async" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
              <span className="font-label-md text-white text-[11px] sm:text-xs uppercase tracking-wider block font-semibold truncate">Community
                Outreach</span>
              <p className="text-white/85 text-[11px] sm:text-xs truncate mt-0.5">Grassroots Day consultation</p>
            </div>
          </div>

          {/* 7. Handi Cross Feast */}
          <div className="h-40 sm:h-48 md:h-56 lg:h-64 rounded-xl overflow-hidden group interactive-lift relative image-reveal shimmer-loading" style={{"transitionDelay":"400ms"}}>
            <img alt="Handi Cross feast celebration with community devotees" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" onLoad={(e) => e.currentTarget.parentElement?.classList.remove('shimmer-loading')} src="/images/handi-cross-1.webp" loading="lazy" decoding="async" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
              <span className="font-label-md text-white text-[11px] sm:text-xs uppercase tracking-wider block font-semibold truncate">Cultural
                Heritage</span>
              <p className="text-white/85 text-[11px] sm:text-xs truncate mt-0.5">Handi Cross feast fellowship</p>
            </div>
          </div>

          {/* 8. Clean & Green / Civic Action */}
          <div className="h-40 sm:h-48 md:h-56 lg:h-64 rounded-xl overflow-hidden group interactive-lift relative image-reveal shimmer-loading" style={{"transitionDelay":"450ms"}}>
            <img alt="Reviewing environmental concerns and waste management with residents" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" onLoad={(e) => e.currentTarget.parentElement?.classList.remove('shimmer-loading')} src="/images/civic-action-1.webp" loading="lazy" decoding="async" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
              <span className="font-label-md text-white text-[11px] sm:text-xs uppercase tracking-wider block font-semibold truncate">Clean
                & Green</span>
              <p className="text-white/85 text-[11px] sm:text-xs truncate mt-0.5">Civic & environmental action</p>
            </div>
          </div>
        </div>

        <div className="text-center mt-8 md:mt-10 reveal-on-scroll">
          <a href="/gallery" className="inline-flex items-center justify-center bg-primary text-on-primary px-6 sm:px-8 py-3 rounded-lg font-label-md text-sm font-semibold btn-hover active:scale-95 shadow-md">View
            Full Gallery</a>
        </div>

      </div>
    </section>
<section className="py-12 md:py-16 px-margin-mobile md:px-margin-desktop bg-primary text-on-primary" id="donate">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Mission Statement & Trust Promise (lg:col-span-5) */}
          <div className="lg:col-span-5 text-center lg:text-left reveal-on-scroll">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-white/15 border border-white/25 text-white uppercase tracking-wider mb-3 backdrop-blur-sm shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
              <span>{sectionsData.support_mission?.subtitle || "Make a Difference"}</span>
            </div>
            <h2 className="font-display-lg text-2xl sm:text-3xl md:text-4xl text-white font-bold mb-3 leading-tight">
              {sectionsData.support_mission?.title || "Support Our Mission"}
            </h2>
            <div className="p-4 sm:p-5 rounded-2xl bg-white/10 border border-white/20 mb-5 backdrop-blur-sm">
              <p className="font-display-lg text-base sm:text-lg text-white/95 leading-snug italic mb-2.5">
                {sectionsData.support_mission?.content?.quote || "\"Dedicated to the upliftment of the poor, deserving, and needy — supporting communities for over 20 years.\""}
              </p>
              <div className="flex items-center gap-2 text-xs font-medium text-white/80">
                <span className="material-symbols-outlined text-sm text-primary-container">verified</span>
                <span>Reginaldo Trust • Registered Public Charitable Trust</span>
              </div>
            </div>
            <p className="text-white/85 text-sm leading-relaxed mb-5">
              {sectionsData.support_mission?.content?.narrative_1 || "Every service we run — the ambulances, hearse van, medical camps, farm machinery, and school supplies — is given free of cost. Your support keeps it that way."}
            </p>
            <div className="flex items-center justify-center lg:justify-start gap-4 text-xs text-white/80">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">call</span>
                <span>{sectionsData.support_mission?.content?.phone || "+91 98224 85327"}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">mail</span>
                <span>{sectionsData.support_mission?.content?.email || "reginaldotrust@gmail.com"}</span>
              </span>
            </div>
          </div>

          {/* Right Column: 3 Support Pillars & Action Buttons (lg:col-span-7) */}
          <div className="lg:col-span-7 reveal-on-scroll">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-white/10 border border-white/20 rounded-xl p-4 sm:p-5 hover:bg-white/15 transition-all">
                <span className="material-symbols-outlined text-white text-3xl mb-2.5 block">agriculture</span>
                <h3 className="font-display-lg text-white font-bold text-base mb-1">Fund Farm Machinery</h3>
                <p className="text-xs text-white/80 leading-relaxed">Tractors, tillers, and harvesters lent free to Curtorim farming families.</p>
              </div>
              <div className="bg-white/10 border border-white/20 rounded-xl p-4 sm:p-5 hover:bg-white/15 transition-all">
                <span className="material-symbols-outlined text-white text-3xl mb-2.5 block">medical_services</span>
                <h3 className="font-display-lg text-white font-bold text-base mb-1">Back Medical Support</h3>
                <p className="text-xs text-white/80 leading-relaxed">Wheelchairs, walkers, medical kits, and 24/7 emergency ambulance runs.</p>
              </div>
              <div className="bg-white/10 border border-white/20 rounded-xl p-4 sm:p-5 hover:bg-white/15 transition-all">
                <span className="material-symbols-outlined text-white text-3xl mb-2.5 block">school</span>
                <h3 className="font-display-lg text-white font-bold text-base mb-1">Sponsor a Student</h3>
                <p className="text-xs text-white/80 leading-relaxed">School bags, books, uniforms, laptops, and education fee scholarships.</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <a href="/contact" className="inline-flex items-center justify-center bg-white text-primary px-6 sm:px-8 py-3 rounded-lg font-label-md text-sm font-semibold btn-hover shadow-lg active:scale-95 text-center">
                <span>Talk to Us About Giving</span>
                <span className="material-symbols-outlined text-base ml-1.5">arrow_forward</span>
              </a>
              <a href="https://wa.me/919822485327" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center border-2 border-white/60 text-white px-6 sm:px-8 py-3 rounded-lg font-label-md text-sm font-semibold btn-hover hover:border-white hover:bg-white/10 transition-colors active:scale-95 text-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"></path><path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.118 1.532 5.845L0 24l6.335-1.51A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.369l-.36-.214-3.732.89.935-3.63-.235-.374A9.818 9.818 0 1112 21.818z"></path></svg>
                <span>Message on WhatsApp</span>
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>

    </main>
  );
}
