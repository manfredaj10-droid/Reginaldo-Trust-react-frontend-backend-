import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { galleryService, sectionsService } from '../services/index.js';

const GALLERY_ITEMS = [
  {
    "id": 0,
    "category": "restoration",
    "caption": "Handing Over Restored Home to Family in Curtorim",
    "src": "/images/house-inaug-2.webp",
    "alt": "Aleixo Reginaldo Lourenco handing over rebuilt house keys to beneficiary family",
    "tag": "House Restoration"
  },
  {
    "id": 1,
    "category": "livelihood",
    "caption": "Fisheries Training & Livelihood Workshop",
    "src": "/images/fisheries-camp-1.webp",
    "alt": "Fisheries training camp conducted for coastal community members",
    "tag": "Livelihoods & Training"
  },
  {
    "id": 2,
    "category": "agriculture",
    "caption": "Promoting Traditional Biodiversity & Nutrition",
    "src": "/images/raan-baji-2.webp",
    "alt": "Display of locally harvested wild forest vegetables",
    "tag": "Agriculture"
  },
  {
    "id": 3,
    "category": "education",
    "caption": "Distribution of Free Books & School Bags",
    "src": "/images/books-bags-1.webp",
    "alt": "Schoolchildren receiving free notebooks and school bags from the Trust",
    "tag": "Education"
  },
  {
    "id": 4,
    "category": "environment",
    "caption": "Listening to Resident Concerns on Pollution & Environment",
    "src": "/images/civic-action-1.webp",
    "alt": "Trust team reviewing environmental concerns and civic grievances with locals",
    "tag": "Clean & Green"
  },
  {
    "id": 5,
    "category": "community",
    "caption": "Caring for Our Elders at Home for the Aged",
    "src": "/images/h1.webp",
    "alt": "Trust volunteers with residents at a home for the aged",
    "tag": "Elderly Care"
  },
  {
    "id": 6,
    "category": "community",
    "caption": "Grassroots Day Community Meeting in Curtorim",
    "src": "/images/grassroots-day-1.webp",
    "alt": "Community members gathered for Grassroots Day discussion",
    "tag": "Community Events"
  },
  {
    "id": 7,
    "category": "community",
    "caption": "Relief & Ration Distribution to Families in Need",
    "src": "/images/donate.webp",
    "alt": "Trust volunteers distributing free ration to families in need",
    "tag": "Community Relief"
  },
  {
    "id": 8,
    "category": "community",
    "caption": "Handi Cross Feast Celebration in Curtorim",
    "src": "/images/handi-cross-1.webp",
    "alt": "Celebrations at the historic Handi Cross feast",
    "tag": "Cultural Heritage"
  },
  {
    "id": 9,
    "category": "restoration",
    "caption": "House Blessing & Inauguration Ceremony",
    "src": "/images/house-inaug-1.webp",
    "alt": "Ceremony and blessing of newly restored home",
    "tag": "House Restoration"
  },
  {
    "id": 10,
    "category": "livelihood",
    "caption": "Fishermen Welfare & Aquaculture Training",
    "src": "/images/fisheries-camp-2.webp",
    "alt": "Interactive workshop on modern fishing techniques and safety",
    "tag": "Livelihoods & Training"
  },
  {
    "id": 11,
    "category": "restoration",
    "caption": "Restoration Program Beneficiary & Family",
    "src": "/images/house-inaug-3.webp",
    "alt": "Beneficiary family at their restored residence",
    "tag": "House Restoration"
  },
  {
    "id": 12,
    "category": "education",
    "caption": "Free School Supplies Distribution",
    "src": "/images/h2.webp",
    "alt": "Children receiving free school books and stationery",
    "tag": "Education"
  },
  {
    "id": 13,
    "category": "community",
    "caption": "Community Address & Citizen Dialogue",
    "src": "/images/grassroots-day-2.webp",
    "alt": "Public address and interactive dialogue with village residents",
    "tag": "Community Events"
  },
  {
    "id": 14,
    "category": "livelihood",
    "caption": "Skill Development & Community Engagement",
    "src": "/images/fisheries-camp-3.webp",
    "alt": "Participants sharing experiences at fisheries camp",
    "tag": "Livelihoods & Training"
  },
  {
    "id": 15,
    "category": "agriculture",
    "caption": "Raan Baji Traditional Wild Vegetables Exhibition",
    "src": "/images/raan-baji-1.webp",
    "alt": "Exhibition of indigenous Goan wild vegetables and edible greens",
    "tag": "Agriculture"
  },
  {
    "id": 16,
    "category": "community",
    "caption": "Community Gathering in Curtorim",
    "src": "/images/founder.webp",
    "alt": "Aleixo Reginaldo Lourenco addressing a community gathering",
    "tag": "Community Events"
  },
  {
    "id": 17,
    "category": "agriculture",
    "caption": "Community Gathering at Raan Baji Exhibition",
    "src": "/images/raan-baji-3.webp",
    "alt": "Locals and agriculturists learning about native wild produce",
    "tag": "Agriculture"
  },
  {
    "id": 18,
    "category": "environment",
    "caption": "Community Environmental & Waste Management Action",
    "src": "/images/civic-action-2.webp",
    "alt": "On-site inspection and community action regarding waste management",
    "tag": "Clean & Green"
  },
  {
    "id": 19,
    "category": "agriculture",
    "caption": "Rice Mill & Farming Support",
    "src": "/images/ricemill.webp",
    "alt": "Rice mill run by the Trust for local farmers",
    "tag": "Agriculture"
  },
  {
    "id": 20,
    "category": "community",
    "caption": "Independence Day Flag Hoisting & Gathering",
    "src": "/images/independence-day-1.webp",
    "alt": "Flag hoisting ceremony celebrating Independence Day",
    "tag": "Community Events"
  },
  {
    "id": 21,
    "category": "community",
    "caption": "Devotees & Families at Handi Cross",
    "src": "/images/handi-cross-2.webp",
    "alt": "Local families joining together in devotion at Handi Cross",
    "tag": "Community Events"
  },
  {
    "id": 22,
    "category": "community",
    "caption": "Honouring Community Contributors & Volunteers",
    "src": "/images/grassroots-day-3.webp",
    "alt": "Felicitation of local community volunteers and active citizens",
    "tag": "Community Events"
  },
  {
    "id": 23,
    "category": "community",
    "caption": "Youth & Students on Independence Day",
    "src": "/images/independence-day-2.webp",
    "alt": "Youth and students participating in patriotic celebrations",
    "tag": "Community Events"
  },
  {
    "id": 24,
    "category": "agriculture",
    "caption": "Free Sapling Distribution to Curtorim Residents",
    "src": "/images/agriculture-saplings.webp",
    "alt": "Trust truck distributing fruit-bearing saplings to villagers in Curtorim",
    "tag": "Agriculture"
  },
  {
    "id": 25,
    "category": "education",
    "caption": "Smart Digital Classroom Display Inauguration",
    "src": "/images/education-smart-class-1.webp",
    "alt": "Inauguration of digital smart board in village school",
    "tag": "Education"
  },
  {
    "id": 26,
    "category": "community",
    "caption": "Mega Medical Health Camp in Curtorim",
    "src": "/images/medical-camp-curtorim.webp",
    "alt": "Mega medical camp bringing specialist doctors to Curtorim residents",
    "tag": "Free Healthcare"
  },
  {
    "id": 27,
    "category": "environment",
    "caption": "Village Road Hotmixing & Infrastructure Upgrade",
    "src": "/images/road-hotmix-work.webp",
    "alt": "Hotmixing and road resurfacing work underway in Curtorim",
    "tag": "Infrastructure"
  },
  {
    "id": 28,
    "category": "community",
    "caption": "Free 24/7 Community Ambulance Service",
    "src": "/images/relief-ambulance.webp",
    "alt": "Reginaldo Trust 24/7 free community ambulance vehicle",
    "tag": "Emergency Relief"
  },
  {
    "id": 29,
    "category": "agriculture",
    "caption": "Free Tractors & Machinery for Local Farmers",
    "src": "/images/agriculture-tractors.webp",
    "alt": "Tractors provided free of cost to local farming families by Reginaldo Trust",
    "tag": "Agriculture"
  },
  {
    "id": 30,
    "category": "education",
    "caption": "Free School Bags & Stationery for Schoolchildren",
    "src": "/images/education-school-distribution.webp",
    "alt": "Schoolchildren receiving free school bags and stationery kits",
    "tag": "Education"
  },
  {
    "id": 31,
    "category": "community",
    "caption": "Community Health Checkup & Diagnostic Consultation",
    "src": "/images/medical-checkup-desk.webp",
    "alt": "Free health checkup camp and consultation for local families",
    "tag": "Free Healthcare"
  },
  {
    "id": 32,
    "category": "environment",
    "caption": "Inauguration & Blessing of Road Development Work",
    "src": "/images/road-blessing-ceremony.webp",
    "alt": "Blessing and commencement of road hotmixing project in Curtorim",
    "tag": "Infrastructure"
  },
  {
    "id": 33,
    "category": "education",
    "caption": "Career Guidance & Skill Training Camp with Don Bosco",
    "src": "/images/education-career-camp.webp",
    "alt": "Career guidance and employability skills training workshop for students",
    "tag": "Education"
  },
  {
    "id": 34,
    "category": "community",
    "caption": "Free Hospital Bed & Medical Equipment for Patients",
    "src": "/images/medical-bed-support.webp",
    "alt": "Hospital bed provided free of cost to needy patients by Reginaldo Trust",
    "tag": "Medical Equipment"
  },
  {
    "id": 35,
    "category": "agriculture",
    "caption": "Traditional Paddy Winnowing Alongside Farmers",
    "src": "/images/agriculture-harvest.webp",
    "alt": "Winnowing paddy harvest alongside farmers in Curtorim",
    "tag": "Agriculture"
  },
  {
    "id": 36,
    "category": "education",
    "caption": "Digital Learning Equipment for Village Schools",
    "src": "/images/education-smart-class-2.webp",
    "alt": "Handover of digital learning screen to school educators",
    "tag": "Education"
  },
  {
    "id": 37,
    "category": "community",
    "caption": "Free Senior Citizen Health Monitoring",
    "src": "/images/medical-senior-checkup.webp",
    "alt": "Health checkup and blood pressure monitoring for community elder",
    "tag": "Elderly Care"
  },
  {
    "id": 38,
    "category": "environment",
    "caption": "Completed Church Access Road in Curtorim",
    "src": "/images/road-church-access.webp",
    "alt": "Newly resurfaced asphalt road leading to historic church in Curtorim",
    "tag": "Infrastructure"
  },
  {
    "id": 39,
    "category": "community",
    "caption": "Free Hearse Van & Mobile Mortuary Support",
    "src": "/images/relief-hearse-van.webp",
    "alt": "Free hearse van and mobile morgue vehicle provided to the community",
    "tag": "Community Care"
  },
  {
    "id": 40,
    "category": "agriculture",
    "caption": "Agricultural Field Inspection & Paddy Revival",
    "src": "/images/agriculture-field-review.webp",
    "alt": "Aleixo Reginaldo Lourenco reviewing paddy cultivation in Curtorim fields",
    "tag": "Agriculture"
  },
  {
    "id": 41,
    "category": "education",
    "caption": "Notebooks & School Supplies for Primary Students",
    "src": "/images/education-stationery-dist.webp",
    "alt": "Distribution of free notebooks to students in village classroom",
    "tag": "Education"
  },
  {
    "id": 42,
    "category": "community",
    "caption": "Free Wheelchairs & Mobility Support for Patients",
    "src": "/images/relief-wheelchair.webp",
    "alt": "Wheelchair provided free of cost for elderly and mobility-impaired patients",
    "tag": "Mobility Support"
  },
  {
    "id": 43,
    "category": "education",
    "caption": "Supporting Youth Sports & Local Football",
    "src": "/images/education-sports-trophy.webp",
    "alt": "Local football tournament presentation with village youth team",
    "tag": "Youth & Sports"
  },
  {
    "id": 44,
    "category": "livelihood",
    "caption": "Agricultural College Practical Training Workshop",
    "src": "/images/education-agri-training.webp",
    "alt": "Goa College of Agriculture training session for rural students",
    "tag": "Livelihoods & Training"
  },
  {
    "id": 45,
    "category": "education",
    "caption": "Student Felicitation & Learning Kit Presentation",
    "src": "/images/education-student-kit.webp",
    "alt": "Presenting educational materials to student at training program",
    "tag": "Education"
  },
  {
    "id": 46,
    "category": "education",
    "caption": "Youth Scholarship & Financial Grant Handover",
    "src": "/images/education-scholarship-handover.webp",
    "alt": "Handing over scholarship award grant document to student",
    "tag": "Youth Scholarships"
  },
  {
    "id": 47,
    "category": "environment",
    "caption": "Emergency Road Repair & Safety Maintenance",
    "src": "/images/road-repair-clearance.webp",
    "alt": "Trust team filling road potholes and clearing roadside shoulders",
    "tag": "Road Safety"
  }
];

const FILTER_TABS = [
  { id: 'all', label: 'All Photos' },
  { id: 'community', label: 'Community Events' },
  { id: 'restoration', label: 'House Restoration' },
  { id: 'agriculture', label: 'Agriculture' },
  { id: 'education', label: 'Education' },
  { id: 'livelihood', label: 'Livelihoods & Training' },
  { id: 'environment', label: 'Clean & Green' },
];

const INITIAL_LIMIT = 9;

export default function Gallery() {
  const [galleryData, setGalleryData] = useState(GALLERY_ITEMS);
  const [sectionsData, setSectionsData] = useState({});
  const [filterTabs, setFilterTabs] = useState(FILTER_TABS);
  const [activeFilter, setActiveFilter] = useState('all');
  const [isExpanded, setIsExpanded] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState(0);

  useEffect(() => {
    let isMounted = true;
    galleryService.getByCategory('all')
      .then(res => {
        if (isMounted && res && res.data && res.data.length > 0) {
          setGalleryData(res.data);
        }
      })
      .catch(err => {
        console.warn('Using fallback gallery items due to API error:', err);
      });

    galleryService.getCategories()
      .then(cats => {
        if (isMounted && Array.isArray(cats) && cats.length > 0) {
          setFilterTabs([{ id: 'all', label: 'All Photos' }, ...cats]);
        }
      })
      .catch(() => null);

    sectionsService.getByPage('gallery')
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

  // Filter items
  const matchingItems = activeFilter === 'all'
    ? galleryData
    : galleryData.filter((item) => item.category === activeFilter);

  const displayedItems = isExpanded
    ? matchingItems
    : matchingItems.slice(0, INITIAL_LIMIT);

  // Lightbox controls
  const openLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
    document.body.style.overflow = '';
  }, []);

  const nextLightbox = useCallback(() => {
    setLightboxIndex((prev) => (prev + 1) % displayedItems.length);
  }, [displayedItems.length]);

  const prevLightbox = useCallback(() => {
    setLightboxIndex((prev) => (prev - 1 + displayedItems.length) % displayedItems.length);
  }, [displayedItems.length]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prevLightbox();
      if (e.key === 'ArrowRight') nextLightbox();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, closeLightbox, nextLightbox, prevLightbox]);

  return (
    <main id="main-content">
      <header className="page-hero pt-28 pb-14 md:pt-32 md:pb-16 px-margin-mobile md:px-margin-desktop relative">
  <div className="page-hero-pattern"></div>
  <div className="max-w-7xl mx-auto relative z-10 text-center">
    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 border border-white/25 text-white text-xs font-semibold mb-4 backdrop-blur-sm shadow-sm">
      <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
      <span>Moments That Matter • Photo Archive</span>
    </div>
    <h1 className="font-display-lg text-headline-lg md:text-display-lg text-on-primary mb-md animated-heading justify-center" data-animate-heading="" id="gallery-page-title">
      {sectionsData.hero?.title || "Our Gallery"}
    </h1>
    <p className="font-body-lg text-body-lg text-on-primary/70 max-w-2xl mx-auto leading-relaxed reveal-on-scroll" style={{"transitionDelay":"400ms"}}>
      {sectionsData.hero?.content?.narrative_1 || "A visual record of our work, events, and the communities we serve — over 20 years of compassion in action."}
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

      {/* Gallery Section */}
      <section className="py-12 md:py-16 px-margin-mobile md:px-margin-desktop bg-surface-container-lowest" id="gallery">
        <div className="max-w-7xl mx-auto">
          {/* Section intro */}
          <div className="flex flex-col items-center text-center mb-8 md:mb-10 reveal-on-scroll">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-primary/10 border border-primary/20 text-primary uppercase tracking-wider mb-3 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
              <span>{sectionsData.capturing_journey?.subtitle || "Photo Archive"}</span>
            </div>
            <h2 className="font-display-lg text-headline-lg text-primary mb-xs animated-heading justify-center" data-animate-heading="">
              {sectionsData.capturing_journey?.title || "Capturing Our Journey"}
            </h2>
            <div className="w-16 h-1 bg-primary mx-auto mt-3 mb-4 rounded-full"></div>
            <p className="font-body-lg text-body-lg text-on-surface/70 max-w-2xl mx-auto">
              {sectionsData.capturing_journey?.content?.narrative_1 || "Browse photos from our programs, community events, outreach activities, and celebrations across Curtorim village and surrounding areas."}
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex gap-2 sm:gap-2.5 justify-start sm:justify-center overflow-x-auto sm:flex-wrap no-scrollbar pb-2 sm:pb-0 px-1 -mx-2 sm:mx-0 mb-8 md:mb-10 reveal-on-scroll" style={{ transitionDelay: '100ms' }} id="filter-bar" role="tablist" aria-label="Photo categories">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={activeFilter === tab.id}
                className={`filter-btn ${activeFilter === tab.id ? 'active' : ''}`}
                onClick={() => {
                  setActiveFilter(tab.id);
                  setIsExpanded(false);
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Gallery Grid */}
          {matchingItems.length === 0 ? (
            <div id="no-results" className="text-center py-16 text-on-surface/60">
              <span className="material-symbols-outlined text-5xl mb-2 text-primary/40">photo_library</span>
              <p className="font-display-md text-lg font-semibold text-primary">No photographs in this category yet.</p>
              <p className="text-sm mt-1">Please select another category above.</p>
            </div>
          ) : (
            <div className="masonry-grid">
              {displayedItems.map((item, idx) => (
                <div
                  key={item.id}
                  className="masonry-item image-reveal active"
                  data-category={item.category}
                  data-caption={item.caption}
                  onClick={() => openLightbox(idx)}
                  tabIndex={0}
                  role="button"
                  aria-label={`View ${item.caption}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      openLightbox(idx);
                    }
                  }}
                >
                  <img
                    src={item.src}
                    alt={item.alt}
                    width="800"
                    height="600"
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/images/donate.webp';
                    }}
                  />
                  <div className="overlay">
                    <span className="font-label-md text-label-md text-white text-xs uppercase tracking-wider">
                      {item.tag}
                    </span>
                  </div>
                  <div className="overlay-icon">
                    <span className="material-symbols-outlined text-white text-4xl">zoom_in</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* View More / Fewer Button */}
          {matchingItems.length > INITIAL_LIMIT && (
            <div id="gallery-more-container" className="text-center pt-4">
              <button
                id="gallery-more-btn"
                type="button"
                onClick={() => {
                  const nextState = !isExpanded;
                  setIsExpanded(nextState);
                  if (!nextState) {
                    document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border-2 border-primary text-primary font-label-md text-sm font-semibold hover:bg-primary hover:text-white transition-all duration-300 shadow-sm active:scale-95"
                aria-expanded={isExpanded}
              >
                <span id="gallery-more-label">
                  {isExpanded
                    ? 'View Fewer Photos'
                    : `View More Photos (${matchingItems.length - INITIAL_LIMIT} more)`}
                </span>
                <span
                  id="gallery-more-icon"
                  className="material-symbols-outlined text-lg transition-transform duration-300"
                  style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
                >
                  expand_more
                </span>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      {lightboxOpen && displayedItems[lightboxIndex] && (
        <div
          id="lightbox"
          className="open"
          role="dialog"
          aria-modal="true"
          aria-label="Image Lightbox"
          onClick={(e) => {
            if (e.target.id === 'lightbox') closeLightbox();
          }}
          onTouchStart={(e) => setTouchStartX(e.changedTouches[0].screenX)}
          onTouchEnd={(e) => {
            const diff = e.changedTouches[0].screenX - touchStartX;
            if (Math.abs(diff) > 40 && displayedItems.length > 1) {
              if (diff < 0) nextLightbox();
              else prevLightbox();
            }
          }}
        >
          <button
            id="lightbox-close"
            type="button"
            aria-label="Close image preview"
            onClick={closeLightbox}
          >
            <span className="material-symbols-outlined text-3xl">close</span>
          </button>

          {displayedItems.length > 1 && (
            <>
              <button
                id="lightbox-prev"
                type="button"
                aria-label="Previous image"
                onClick={(e) => {
                  e.stopPropagation();
                  prevLightbox();
                }}
              >
                <span className="material-symbols-outlined text-2xl">arrow_back</span>
              </button>
              <button
                id="lightbox-next"
                type="button"
                aria-label="Next image"
                onClick={(e) => {
                  e.stopPropagation();
                  nextLightbox();
                }}
              >
                <span className="material-symbols-outlined text-2xl">arrow_forward</span>
              </button>
            </>
          )}

          <img
            id="lightbox-img"
            src={displayedItems[lightboxIndex].src}
            alt={displayedItems[lightboxIndex].alt}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/images/donate.webp';
            }}
          />
          <div id="lightbox-caption">{displayedItems[lightboxIndex].caption}</div>
          <div id="lightbox-counter">
            {lightboxIndex + 1} / {displayedItems.length}
          </div>
        </div>
      )}
    </main>
  );
}
