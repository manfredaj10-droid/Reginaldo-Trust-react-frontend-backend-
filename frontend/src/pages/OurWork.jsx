import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { eventsService, sectionsService } from '../services/index.js';

const FALLBACK_EVENTS = [
  { id: 1, day: "14", mon: "Aug 2026", tag: "House Restoration", title: "Restored Home Handover & Blessing", description: "Formal blessing and handover of a rebuilt, fully restored home to an underprivileged family in Curtorim.", is_extra: 0 },
  { id: 2, day: "08", mon: "Aug 2026", tag: "Agriculture", title: "Raan Baji Indigenous Produce Fest", description: "Exhibition of traditional wild vegetables, promoting indigenous agro-biodiversity and nutritious seasonal flora.", is_extra: 0 },
  { id: 3, day: "02", mon: "Aug 2026", tag: "Livelihoods & Training", title: "Fisheries Welfare & Training Camp", description: "Hands-on safety, gear maintenance, and livelihood capacity workshop for local coastal fishermen and aquaculture workers.", is_extra: 0 },
  { id: 4, day: "28", mon: "Jul 2026", tag: "Education", title: "Free Books & School Bags Distribution", description: "Annual distribution of brand-new school bags, notebooks, and learning essentials to deserving students across local schools.", is_extra: 0 },
  { id: 5, day: "20", mon: "Jul 2026", tag: "Community Outreach", title: "Grassroots Day Community Meeting", description: "Direct citizen consultation bringing village residents together to review local public welfare and development projects.", is_extra: 0 },
  { id: 6, day: "20", mon: "Aug 2026", tag: "Cultural Heritage", title: "Handi Cross Feast Community Gathering", description: "Traditional feast fellowship uniting village parishioners and community members in prayer and social harmony.", is_extra: 0 },
  { id: 7, day: "25", mon: "Jul 2026", tag: "Sports", title: "State Aquatic Championship Swimmers Honoured", description: "Local swimmers felicitated for their performance at the 37th State Aquatic Championship.", is_extra: 1 },
  { id: 8, day: "12", mon: "Jul 2026", tag: "Clean & Green", title: "1,000 Saplings Distributed Free", description: "Fruit-bearing, coconut and shade saplings handed out free to households, farmers and schools across Curtorim.", is_extra: 1 },
  { id: 9, day: "01", mon: "Jul 2026", tag: "Clean & Green Curtorim", title: "Van Mahotsav Tree Conservation Drive", description: "A conservation awareness programme marking the national festival of trees, run with schools and local groups.", is_extra: 1 }
];

const TIMELINE_DATA = [
  {
    num: 1,
    img: "/images/raan-baji-1.webp",
    alt: "Raan Baji traditional wild vegetables and agricultural produce exhibition",
    icon: "agriculture",
    title: "Agriculture & Farming Support",
    shortTitle: "Agriculture",
    desc: "Machinery, seeds & land revival",
    points: [
      "Free use of tractors, power tillers, power trailers and harvesters for local farming families.",
      "Free seeds, fruit-bearing and coconut saplings, fertilisers and grass-cutting machines.",
      "Helps farmers bring fallow land back into cultivation to raise crop production.",
      "Promotes self-developed organic fertilisers, land protection and waste recycling.",
      "Rice mill and farmers' melas supporting the local paddy economy."
    ]
  },
  {
    num: 2,
    img: "/images/books-bags-1.webp",
    alt: "Children receiving free school books and bags from the Trust",
    icon: "school",
    title: "Education & Skill Development",
    shortTitle: "Education",
    desc: "Scholarships & digital tools",
    points: [
      "Scholarships for deserving students, with recognition for toppers and rank holders.",
      "Free laptops, computers, printers, photocopiers, projectors and power backup for schools and students.",
      "A dedicated centre helping students with project work and assignments.",
      "Skill development and youth programmes, technical courses, and career-building workshops.",
      "Cyber hygiene and data protection workshops for students and families."
    ]
  },
  {
    num: 3,
    img: "/images/h1.webp",
    alt: "Trust volunteers visiting elderly residents",
    icon: "medical_services",
    title: "Medical & Health Services",
    shortTitle: "Medical",
    desc: "Camps, equipment & ambulances",
    points: [
      "Dental, eye care, general health check-up and blood donation camps.",
      "Free wheelchairs, walkers, water beds, air beds and diabetes kit bags for those who need them.",
      "Free 24/7 ambulance service, hearse van and moveable morgue.",
      "Free physiotherapy clinic, including physiotherapy for local sportspeople.",
      "Runs dispensaries and medical centres, and supported the community throughout Covid."
    ]
  },
  {
    num: 4,
    img: "/images/civic-action-1.webp",
    alt: "Trust team and residents reviewing civic and environmental initiatives",
    icon: "recycling",
    title: "Clean & Green Curtorim",
    shortTitle: "Clean & Green",
    desc: "Saplings & waste management",
    points: [
      "Free fruit-bearing, coconut and shade sapling distribution and tree-planting drives.",
      "Door-to-door waste collection and public dustbins across the village.",
      "Removal of illegally dumped, plastic and hazardous waste from roadsides, fields and drains.",
      "Seasonal drainage clearing and roadside tree-branch grooming before the monsoon.",
      "Organic fertiliser promotion and public awareness against illegal dumping."
    ]
  },
  {
    num: 5,
    img: "/images/house-inaug-2.webp",
    alt: "Handing over restored home to family in Curtorim",
    icon: "volunteer_activism",
    title: "Social Empowerment & House Restoration",
    shortTitle: "Empowerment",
    desc: "Job fairs & career guidance",
    points: [
      "House restoration work for families who cannot afford essential home repairs.",
      "Fisheries and coastal livelihood training camps supporting local workers.",
      "Job fairs and employment camps connecting local youth to industry work.",
      "Career guidance workshops covering courses, schemes and interview preparation.",
      "Sports training camps, equipment and first aid and safety camps."
    ]
  },
  {
    num: 6,
    img: "/images/fisheries-camp-1.webp",
    alt: "Fisheries training and community support camp",
    icon: "local_shipping",
    title: "Transport & Public Safety",
    shortTitle: "Transport",
    desc: "Utility vehicles & road safety",
    points: [
      "Utility vehicles and crane available free to the community.",
      "Clears fallen tree branches and overgrowth using JCB and trained teams.",
      "Temporary road repairs where no government works are scheduled.",
      "Improves road visibility and pedestrian safety across the village.",
      "Emergency clearance support when the community needs it."
    ]
  }
];

export default function OurWork() {
  const [timelineIndex, setTimelineIndex] = useState(0);
  const [showAllEvents, setShowAllEvents] = useState(false);
  const [eventsList, setEventsList] = useState(FALLBACK_EVENTS);
  const [sectionsData, setSectionsData] = useState({});

  useEffect(() => {
    let isMounted = true;
    eventsService.getAll()
      .then(res => {
        if (isMounted && res && res.data && res.data.length > 0) {
          setEventsList(res.data);
        }
      })
      .catch(err => {
        console.warn('Using fallback events due to API error:', err);
      });

    sectionsService.getByPage('ourwork')
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

  const activeTimeline = TIMELINE_DATA[timelineIndex] || TIMELINE_DATA[0];

  return (
    <main id="main-content">
<section className="relative py-20 md:py-28 pt-28 md:pt-36 flex items-center justify-center text-center overflow-hidden">
  {/* Background Image */}
  <div className="absolute inset-0">
    <img src="/images/donate.webp" alt="Trust volunteers distributing free ration to families in need" width="1600" height="900" className="w-full h-full object-cover" fetchpriority="high" decoding="async" />
  </div>
  {/* Overlay */}
  <div className="absolute inset-0 bg-gradient-to-b from-surface/90 via-surface/75 to-surface/90 md:bg-surface/80"></div>
  {/* Content */}
  <div className="relative z-10 flex flex-col items-center max-w-3xl mx-auto px-6">
    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-4 backdrop-blur-sm shadow-sm">
      <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
      <span>Registered Public Charitable Trust • Goa</span>
    </div>
    <h1 className="font-display-lg text-[28px] sm:text-5xl md:text-7xl font-bold text-primary animated-heading leading-tight max-w-4xl mx-auto text-center justify-center">
      {sectionsData.hero?.title || "Our Work"}
    </h1>
    <p className="mt-4 text-primary text-base sm:text-xl md:text-2xl font-semibold reveal-on-scroll text-center"> 
      {sectionsData.hero?.subtitle || "Empowering Communities Through Service & Support"}
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
<section className="py-12 md:py-16 px-6 max-w-6xl mx-auto">

  {/* Section Header ON TOP */}
  <div className="flex flex-col items-center text-center mb-8 md:mb-12 reveal-on-scroll">
    <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-primary/10 border border-primary/20 text-primary uppercase tracking-wider mb-3 shadow-xs">
      <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
      <span>{sectionsData.what_we_do?.subtitle || "Our Mission"}</span>
    </div>
    <h2 className="font-display-lg text-2xl sm:text-headline-lg md:text-5xl text-primary font-bold tracking-tight">{sectionsData.what_we_do?.title || "What We Do"}</h2>
    <div className="w-16 h-1 bg-primary mx-auto mt-4 rounded-full"></div>
  </div>

  <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">

    {/* Image */}
    <div className="w-full max-w-md mx-auto md:max-w-none">
      <div className="aspect-[4/3] sm:aspect-square md:aspect-[4/3] bg-surface-container rounded-2xl overflow-hidden shadow-xl image-reveal">
        <img src={sectionsData.what_we_do?.content?.image || "/images/h2.webp"} alt="Children receiving free school books and stationery from the Trust" width="600" height="420" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" loading="lazy" decoding="async" />
      </div>
    </div>

    {/* Text */}
    <div className="space-y-4 sm:space-y-5 text-gray-700 text-base md:text-lg slide-right text-reveal">
      <p>
        {sectionsData.what_we_do?.content?.narrative_1 || "Reginaldo Trust works towards uplifting poor, deserving and needy individuals through agriculture, education, healthcare, environmental protection and skill development programs."}
      </p>
      <p>
        {sectionsData.what_we_do?.content?.narrative_2 ? (
          sectionsData.what_we_do.content.narrative_2
        ) : (
          <>We have been actively serving the needy community of Curtorim village and surrounding areas, providing a wide range of <strong className="text-primary">completely free services</strong> to those who need it most — without discrimination of caste, creed or religion.</>
        )}
      </p>
      <p className="pt-2">
        <a href="/services" className="inline-flex items-center gap-2 bg-primary text-on-primary px-6 py-2.5 rounded font-label-md text-label-md btn-hover active:scale-95">
          See the Full List of Services
          <span className="material-symbols-outlined text-base">arrow_forward</span>
        </a>
      </p>
    </div>

  </div>
</section>
<section className="py-12 md:py-16 bg-[#faf9f6] text-on-surface">
  <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop">

    {/* Header ON TOP */}
    <div className="flex flex-col items-center text-center mb-8 md:mb-12 reveal-on-scroll">
      <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-primary/10 border border-primary/20 text-primary uppercase tracking-wider mb-3 shadow-xs">
        <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
        <span>{sectionsData.interactive_directory?.subtitle || "Service Focus"}</span>
      </div>
      <h2 className="font-display-lg text-2xl sm:text-headline-lg md:text-4xl text-primary font-bold tracking-tight">{sectionsData.interactive_directory?.title || "Interactive Program Directory"}</h2>
      <div className="w-16 h-1 bg-primary mx-auto mt-4 rounded-full"></div>
    </div>

{/* SERVICE SWITCHER (mobile) */}
<div className="md:hidden mb-6">
  <div className="grid grid-cols-2 gap-2">
    {TIMELINE_DATA.map((item, idx) => (
      <button
        key={idx}
        type="button"
        onClick={() => setTimelineIndex(idx)}
        className={`timeline-btn p-3 rounded-lg border text-sm font-medium transition text-center ${
          timelineIndex === idx
            ? 'bg-primary text-white border-primary font-bold shadow-xs'
            : 'bg-white text-on-surface border-gray-200 hover:bg-primary hover:text-white'
        }`}
      >
        {item.shortTitle}
      </button>
    ))}
  </div>
</div>

{/* MEDIA + DESCRIPTION WRAPPER */}
<div className="space-y-6">

  {/* SPLIT VIEW (IMAGE LEFT + TEXT RIGHT) */}
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
    {/* IMAGE SIDE */}
    <div className="relative aspect-[16/10] sm:aspect-auto h-64 sm:h-72 md:h-[360px] rounded-2xl overflow-hidden shadow-lg border border-gray-200 bg-gray-100">
      <img
        id="timeline-media"
        src={activeTimeline.img}
        alt={activeTimeline.alt}
        className="w-full h-full object-cover object-center transition-all duration-700"
      />
      <div id="timeline-scrim" className="absolute inset-0 bg-black/20"></div>
    </div>

    {/* TEXT SIDE */}
    <div className="h-auto min-h-[300px] md:min-h-[360px] flex flex-col justify-center bg-white rounded-2xl p-5 sm:p-6 md:p-7 shadow-sm border border-gray-100 transition-all duration-500">
      <h3 id="timeline-title" className="text-xl md:text-2xl font-bold text-primary mb-3">
        {activeTimeline.title}
      </h3>
      <ul id="timeline-points" className="space-y-2.5 text-gray-600 text-sm leading-relaxed list-disc pl-5">
        {activeTimeline.points.map((pt, idx) => (
          <li key={idx}>{pt}</li>
        ))}
      </ul>
    </div>
  </div>

</div>

    {/* TIMELINE (DESKTOP) */}
    <div className="mt-8 relative">
      <div className="hidden lg:block absolute top-5 left-0 right-0 h-[2px] bg-gray-200"></div>

      <div className="hidden md:grid grid-cols-3 lg:grid-cols-6 gap-x-6 gap-y-8 lg:gap-y-6 relative">
        {TIMELINE_DATA.map((item, idx) => (
          <div
            key={idx}
            onClick={() => setTimelineIndex(idx)}
            className="timeline-item text-center cursor-pointer group p-2 rounded-xl transition-all"
          >
            <div
              className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center font-bold relative z-10 transition-colors duration-300 ${
                timelineIndex === idx
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-gray-200 text-gray-700 group-hover:bg-primary/70 group-hover:text-white'
              }`}
            >
              {item.num}
            </div>
            <h3
              className={`mt-3 font-bold text-sm sm:text-base transition-colors duration-300 ${
                timelineIndex === idx ? 'text-primary' : 'text-gray-700 group-hover:text-primary'
              }`}
            >
              {item.shortTitle}
            </h3>
            <p className="text-xs text-gray-600 mt-1 leading-normal">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </div>

  </div>
</section>
<section className="py-12 md:py-16 px-margin-mobile md:px-margin-desktop bg-surface" id="past-events">
  <div className="max-w-7xl mx-auto">

    <div className="flex flex-col items-center text-center mb-8 md:mb-12 reveal-on-scroll">
      <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-primary/10 border border-primary/20 text-primary uppercase tracking-wider mb-3 shadow-xs">
        <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
        <span>{sectionsData.events_hosted?.subtitle || "On The Ground"}</span>
      </div>
      <h2 className="font-display-lg text-2xl sm:text-headline-lg md:text-5xl text-primary font-bold tracking-tight">{sectionsData.events_hosted?.title || "Events We've Hosted"}</h2>
      <div className="w-16 h-1 bg-primary mx-auto mt-4 rounded-full"></div>
      <p className="font-body-lg text-body-lg text-on-surface/70 max-w-2xl mx-auto mt-4 leading-relaxed">
        {sectionsData.events_hosted?.content?.narrative_1 || "A record of recent drives, camps and community programmes run across Curtorim and the surrounding villages."}
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6" id="events-grid">
      {eventsList.map((ev, index) => {
        const isExtra = ev.is_extra === 1 || ev.is_extra === true || index >= 6;
        return (
          <article
            key={ev.id || index}
            className={`event-card ${isExtra ? `event-extra ${showAllEvents ? 'event-revealed' : ''}` : 'reveal-on-scroll'}`}
            style={{
              transitionDelay: `${((index % 6) + 1) * 60}ms`,
              display: isExtra ? (showAllEvents ? 'flex' : 'none') : 'flex'
            }}
          >
            <div className="event-date">
              <span className="event-day">{ev.day}</span>
              <span className="event-mon">{ev.mon}</span>
            </div>
            <div className="event-body">
              <span className="event-tag">{ev.tag}</span>
              <h3 className="event-title">{ev.title}</h3>
              <p className="event-desc">{ev.description}</p>
            </div>
          </article>
        );
      })}
    </div>

    <div className="text-center mt-8 md:mt-10">
      <button
        type="button"
        id="events-more-btn"
        className="bg-primary text-on-primary px-8 py-3 rounded font-label-md text-label-md btn-hover active:scale-95 inline-flex items-center gap-2"
        aria-expanded={showAllEvents}
        aria-controls="events-grid"
        onClick={() => setShowAllEvents(!showAllEvents)}
      >
        <span id="events-more-label">{showAllEvents ? 'Show Fewer Events' : 'View More Events'}</span>
        <span
          className="material-symbols-outlined text-base transition-transform duration-300"
          id="events-more-icon"
          style={{ transform: showAllEvents ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >
          expand_more
        </span>
      </button>
    </div>

  </div>
</section>


    </main>
  );
}
