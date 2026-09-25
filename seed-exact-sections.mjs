import { db } from './server/src/config/db.js';

console.log('[Reseed] Updating sections table with exact user-requested page sections...');

// Clear existing sections table
db.exec('DELETE FROM sections');

const insertSection = db.prepare(`
  INSERT INTO sections (page_slug, section_key, title, subtitle, content, order_index, is_published)
  VALUES (?, ?, ?, ?, ?, ?, 1)
`);

const allSections = [
  // ================= HOME PAGE =================
  {
    page_slug: 'home',
    section_key: 'hero',
    title: 'Serving Humanity With Compassion',
    subtitle: 'Supporting communities for over 20 years. Dedicated to the upliftment of the poor, deserving, and needy without discrimination of caste, creed, or religion.',
    order_index: 1,
    content: JSON.stringify({
      badge: 'Registered Public Charitable Trust • Goa',
      primary_btn_text: 'Join Our Mission',
      primary_btn_url: '/contact',
      secondary_btn_text: 'Explore Services',
      secondary_btn_url: '/services',
      bg_image: '/images/h1.webp',
      highlight_note: '100% Free Public Services • 20+ Years Serving Goa'
    })
  },
  {
    page_slug: 'home',
    section_key: 'journey',
    title: 'Our Journey of Upliftment',
    subtitle: 'Two decades of unconditional grassroots support across Curtorim and South Goa.',
    order_index: 2,
    content: JSON.stringify({
      badge: 'Two Decades of Service',
      narrative_1: 'REGINALDO TRUST is a registered public charitable trust dedicated to the upliftment of the poor, deserving, and needy across Curtorim village and surrounding areas in Goa — without discrimination of caste, creed, or religion.',
      narrative_2: 'Founded on empathy and hands-on community service, every initiative we run — from free 24/7 ambulances and farmer machinery to student laptops and rebuilt homes — is delivered 100% free to beneficiaries.',
      image: '/images/h1.webp',
      counter_years: '20+',
      counter_years_label: 'Years of Service',
      counter_lives: '1000+',
      counter_lives_label: 'Lives Touched',
      counter_activities: '50+',
      counter_activities_label: 'Activities Held',
      btn_text: 'Read Our Full Story',
      btn_url: '/about'
    })
  },
  {
    page_slug: 'home',
    section_key: 'initiatives',
    title: 'Our Core Initiatives',
    subtitle: 'Direct, immediate, and 100% free welfare programs reaching every household in need.',
    order_index: 3,
    content: JSON.stringify({
      badge: 'Areas of Action',
      btn_text: 'Explore All Our Services',
      btn_url: '/services'
    })
  },
  {
    page_slug: 'home',
    section_key: 'support_areas',
    title: 'Key Areas of Support',
    subtitle: 'From immediate medical emergencies to seasonal agricultural assistance — see where our resources are directed.',
    order_index: 4,
    content: JSON.stringify({
      badge: 'Impact Spectrum',
      quote: 'True community leadership is not measured by promises made, but by lives touched, roofs repaired, and families supported in their hour of need.',
      author_name: 'Aleixo Reginaldo Lourenco',
      author_title: 'Founder & Managing Trustee',
      author_bio: 'Dedicated public servant and social reformer with over two decades of grassroots service in Curtorim and across Goa.',
      author_image: '/images/founder.webp'
    })
  },
  {
    page_slug: 'home',
    section_key: 'support_mission',
    title: 'Support Our Mission',
    subtitle: 'Join hands with Reginaldo Trust. Whether you need emergency assistance, want to volunteer, or support community welfare programs — we are here.',
    order_index: 5,
    content: JSON.stringify({
      badge: 'Community Solidarity',
      primary_btn_text: 'Connect With Our Office',
      primary_btn_url: '/contact',
      phone_primary: '+91 98224 85327',
      emergency_phone: '+91 98221 99999',
      ambulance_label: '24/7 Emergency Ambulance'
    })
  },

  // ================= ABOUT PAGE =================
  {
    page_slug: 'about',
    section_key: 'hero',
    title: 'About Reginaldo Trust',
    subtitle: 'Serving Humanity With Compassion & Dedication',
    order_index: 1,
    content: JSON.stringify({
      badge: 'Registered Public Charitable Trust • Goa',
      banner_image: '/images/h1.webp'
    })
  },
  {
    page_slug: 'about',
    section_key: 'who_we_are',
    title: 'Who We Are',
    subtitle: 'Founded on empathy and hands-on community service.',
    order_index: 2,
    content: JSON.stringify({
      badge: 'Our Identity',
      intro_paragraph: 'Reginaldo Trust is a registered public charitable trust founded by Aleixo Reginaldo Lourenco, dedicated to uplifting the poor, deserving, and needy across Curtorim and South Goa without discrimination.',
      founder_name: 'Aleixo Reginaldo Lourenco',
      founder_title: 'Founder & Managing Trustee',
      founder_bio: 'A tireless public servant who has dedicated his career to community empowerment, direct relief, and sustainable village development.',
      founder_image: '/images/founder.webp'
    })
  },
  {
    page_slug: 'about',
    section_key: 'vision_mission',
    title: 'What the Trust Sets Out to Do',
    subtitle: 'Core objectives guiding every welfare program and relief initiative.',
    order_index: 3,
    content: JSON.stringify({
      badge: 'Vision & Objectives',
      vision_title: 'Our Vision',
      vision_text: 'A compassionate, self-reliant Curtorim where no family lacks healthcare, safe shelter, educational access, or agricultural livelihood.',
      mission_title: 'Our Mission',
      mission_text: 'To provide direct, immediate, and 100% free welfare assistance to needy individuals and families across Curtorim and Goa, irrespective of caste, creed, or religious identity.'
    })
  },
  {
    page_slug: 'about',
    section_key: 'decades_service',
    title: 'Decades of Dedicated Service',
    subtitle: 'Over two decades of consistent ground presence and citizen support.',
    order_index: 4,
    content: JSON.stringify({
      badge: 'Our Legacy',
      description: 'From conducting medical camps and providing free 24/7 ambulance support to distributing school kits and modernizing farming equipment, the Trust has stood by Curtorim through every season and crisis.',
      highlight_years: '20+ Years Serving Goa'
    })
  },

  // ================= SERVICES PAGE =================
  {
    page_slug: 'services',
    section_key: 'hero',
    title: 'Our Services',
    subtitle: 'Machinery, medical equipment, transport, scholarships, restoration work and training — every service listed here is provided free of cost to the people of Curtorim village and the surrounding areas, without any reservation as to caste, creed or religion.',
    order_index: 1,
    content: JSON.stringify({
      badge: 'Free Of Cost, Always • Public Charity'
    })
  },
  {
    page_slug: 'services',
    section_key: 'six_areas',
    title: 'Six Areas of Service',
    subtitle: 'Comprehensive community welfare programs operating across Curtorim.',
    order_index: 2,
    content: JSON.stringify({
      badge: 'What We Provide'
    })
  },
  {
    page_slug: 'services',
    section_key: 'clean_green',
    title: 'Clean & Green Curtorim',
    subtitle: 'Preserving Goa\'s natural environment and maintaining clean village roads, drains, and public spaces.',
    order_index: 3,
    content: JSON.stringify({
      badge: 'Environmental Care',
      image: '/images/agriculture-saplings.webp',
      points: [
        'Sapling Distribution: Free fruit-bearing and shade saplings given to households.',
        'Waste Management: Door-to-door waste collection and public dustbins across Curtorim.',
        'Eco-Friendly Initiatives: Anti-plastic drives and environmental conservation workshops.'
      ]
    })
  },
  {
    page_slug: 'services',
    section_key: 'house_restoration',
    title: 'House Restoration',
    subtitle: 'Rebuilding and repairing roofs and structural walls for families unable to afford basic shelter maintenance.',
    order_index: 4,
    content: JSON.stringify({
      badge: 'Dignity & Shelter',
      image: '/images/house-inaug-2.webp',
      points: [
        'Roof Repair & Re-Roofing for monsoon safety',
        'Structural & Wall Repairs for safety and stability',
        'Monsoon Damage Restoration & emergency waterproofing',
        'Flooring, Electrical Safety & Sanitation Fittings'
      ]
    })
  },
  {
    page_slug: 'services',
    section_key: 'social_empowerment',
    title: 'Social Empowerment Initiatives',
    subtitle: 'Equipping village youth and workers with skills, career opportunities, and digital safety.',
    order_index: 5,
    content: JSON.stringify({
      badge: 'Youth & Careers',
      image: '/images/fisheries-camp-1.webp',
      points: [
        'Job Fairs & Employment Camps connecting youth with employers',
        'Career Guidance Workshops for students and graduates',
        'Cyber Hygiene & Data Protection awareness sessions',
        'Fisheries and coastal livelihood capacity building'
      ]
    })
  },
  {
    page_slug: 'services',
    section_key: 'agricultural_support',
    title: 'Agricultural Support',
    subtitle: 'Reviving agriculture and supporting Curtorim farmers with modern equipment and resources.',
    order_index: 6,
    content: JSON.stringify({
      badge: 'Backing Local Farmers',
      image: '/images/ricemill.webp',
      points: [
        'Free use of tractors, power tillers, and harvesters',
        'Free seeds, organic fertilisers, and saplings',
        'Local paddy processing rice mill facility',
        'Farmers\' melas and traditional produce festivals'
      ]
    })
  },

  // ================= PROGRAM (OUR WORK) PAGE =================
  {
    page_slug: 'ourwork',
    section_key: 'hero',
    title: 'Our Work',
    subtitle: 'Empowering Communities Through Service & Support',
    order_index: 1,
    content: JSON.stringify({
      badge: 'Registered Public Charitable Trust • Goa',
      banner_image: '/images/donate.webp'
    })
  },
  {
    page_slug: 'ourwork',
    section_key: 'what_we_do',
    title: 'What We Do',
    subtitle: 'A structured overview of ongoing charitable and community upliftment initiatives.',
    order_index: 2,
    content: JSON.stringify({
      badge: 'Welfare Mandate',
      description: 'From emergency medical transport and agricultural mechanization to youth education and home rebuilding, explore our core focus areas.'
    })
  },
  {
    page_slug: 'ourwork',
    section_key: 'interactive_directory',
    title: 'Interactive Program Directory',
    subtitle: 'Explore our detailed timeline, field methods, and program beneficiaries.',
    order_index: 3,
    content: JSON.stringify({
      badge: 'Deep Dive'
    })
  },
  {
    page_slug: 'ourwork',
    section_key: 'events_hosted',
    title: 'Events We\'ve Hosted',
    subtitle: 'Chronological record of community drives, home blessings, and relief distributions.',
    order_index: 4,
    content: JSON.stringify({
      badge: 'Timeline of Action'
    })
  },

  // ================= GALLERY PAGE =================
  {
    page_slug: 'gallery',
    section_key: 'hero',
    title: 'Our Gallery',
    subtitle: 'A visual record of our work, events, and the communities we serve — over 20 years of compassion in action.',
    order_index: 1,
    content: JSON.stringify({
      badge: 'Moments That Matter • Photo Archive'
    })
  },
  {
    page_slug: 'gallery',
    section_key: 'capturing_journey',
    title: 'Capturing Our Journey',
    subtitle: 'Browse photos from our programs, community events, outreach activities, and celebrations across Curtorim village and surrounding areas.',
    order_index: 2,
    content: JSON.stringify({
      badge: 'Photo Archive',
      intro: 'Browse photos from our programs, community events, outreach activities, and celebrations across Curtorim village and surrounding areas.'
    })
  },

  // ================= CONTACT PAGE =================
  {
    page_slug: 'contact',
    section_key: 'hero',
    title: 'Contact Us',
    subtitle: 'Reach out to our team for assistance, emergency ambulance support, or program details.',
    order_index: 1,
    content: JSON.stringify({
      badge: 'Always Accessible'
    })
  },
  {
    page_slug: 'contact',
    section_key: 'office_details',
    title: 'Registered Address & Contact Lines',
    subtitle: 'Our office is open to every citizen needing assistance.',
    order_index: 2,
    content: JSON.stringify({
      office_name: 'Reginaldo Trust Head Office',
      address: 'Reginaldo Trust, H No. 1088, St. Xavier, Raia, Salcete, Goa',
      phone_primary: '+91 98224 85327',
      phone_emergency: '+91 98221 99999',
      phone_whatsapp: '919822485327',
      email: 'contact@reginaldotrust.org',
      working_hours: 'Monday to Saturday: 9:00 AM – 6:00 PM (24/7 for Ambulance)'
    })
  }
];

for (const s of allSections) {
  insertSection.run(s.page_slug, s.section_key, s.title, s.subtitle, s.content, s.order_index);
}

const count = db.prepare('SELECT count(*) as count FROM sections').get().count;
console.log(`[Reseed] ✓ Seeded ${count} sections successfully matching user requirements!`);
