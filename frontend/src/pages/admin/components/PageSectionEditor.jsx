import React, { useState, useEffect, useCallback } from 'react';
import { sectionsService, pagesService } from '../../../services/index.js';
import { useToast } from '../../../context/ToastContext.jsx';
import ImageUploader from './ImageUploader.jsx';

// Human-friendly section name mapping
const SECTION_LABELS = {
  hero:                  { label: '📸 Banner / Hero',             hint: 'The large banner at the top of the page that visitors see first.' },
  journey:               { label: '📖 Our Journey',               hint: 'The story section describing the trust\'s history and growth over the years.' },
  initiatives:           { label: '🌟 Core Initiatives',          hint: 'The 4 initiative cards shown on the home page.' },
  key_areas:             { label: '📊 Key Areas of Support',      hint: 'Statistics and focus areas displayed on the home page.' },
  support_mission:       { label: '🤝 Support Our Mission',       hint: 'The donation/support call-to-action section at the bottom of home page.' },
  who_we_are:            { label: '👥 Who We Are',                hint: 'Introduction to the trust — shown at the top of the About page.' },
  mission_vision:        { label: '🎯 Mission & Vision',          hint: 'The trust\'s core mission and vision statements.' },
  decades_service:       { label: '🏛️ Decades of Service',       hint: 'The history and legacy section on the About page.' },
  leadership:            { label: '👤 Leadership / Founder',      hint: 'Founder biography, photo, and quote.' },
  services_overview:     { label: '🏥 Services Overview',         hint: 'The intro section at the top of the Services page.' },
  clean_green:           { label: '🌿 Clean & Green',             hint: 'The Clean & Green Curtorim program section.' },
  house_restoration:     { label: '🏠 House Restoration',         hint: 'The house rebuilding program details.' },
  social_empowerment:    { label: '🌱 Social Empowerment',        hint: 'Social empowerment initiatives section.' },
  agricultural_support:  { label: '🌾 Agricultural Support',      hint: 'Farmers and agricultural support program section.' },
  emergency_helpline:    { label: '🚑 Emergency Helpline',        hint: 'The 24/7 ambulance & emergency helpline displayed on Services.' },
  services_six_areas:    { label: '📋 Six Areas of Service',      hint: 'Grid of 6 service categories shown on the Services page.' },
  what_we_do:            { label: '💼 What We Do',                hint: 'Program overview section on the Our Work page.' },
  interactive_directory: { label: '📂 Program Directory',         hint: 'The interactive listing of programs and initiatives.' },
  events_hosted:         { label: '📅 Events Hosted',             hint: 'Past events and community drives section.' },
  capturing_journey:     { label: '🖼️ Gallery Headline',         hint: 'The heading and intro text shown at the top of the Gallery page.' },
  gallery_intro:         { label: '🖼️ Gallery Intro',            hint: 'Introduction paragraph for the photo gallery.' },
  contact_info:          { label: '📞 Contact Information',       hint: 'Office address, phone numbers, and working hours.' },
  contact_form:          { label: '📬 Contact Form',              hint: 'The message form visitors use to contact the trust.' },
};

function getSectionMeta(key) {
  return SECTION_LABELS[key] || { label: `✏️ ${key.replace(/_/g, ' ')}`, hint: 'Edit this section\'s content.' };
}

// Reusable field components with hints
function Field({ label, hint, children }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-800 mb-1">{label}</label>
      {children}
      {hint && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
    </div>
  );
}

function TextInput({ value, onChange, placeholder, className = '' }) {
  return (
    <input
      type="text"
      value={value || ''}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition ${className}`}
    />
  );
}

function TextArea({ value, onChange, placeholder, rows = 3 }) {
  return (
    <textarea
      rows={rows}
      value={value || ''}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
    />
  );
}

export default function PageSectionEditor({ pageSlug, pageTitle }) {
  const [sections, setSections] = useState([]);
  const [pageSEO, setPageSEO] = useState({ seo_title: '', meta_description: '', og_image: '' });
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState(null);
  const [showSeoModal, setShowSeoModal] = useState(false);
  const { showToast } = useToast();

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [secRes, pageRes] = await Promise.all([
        sectionsService.getByPage(pageSlug).catch(() => []),
        pagesService.getBySlug(pageSlug).catch(() => null)
      ]);
      setSections(secRes || []);
      if (pageRes) {
        setPageSEO({
          seo_title: pageRes.seo_title || '',
          meta_description: pageRes.meta_description || '',
          og_image: pageRes.og_image || ''
        });
      }
    } catch (err) {
      console.error('[PageSectionEditor] Load error:', err);
    } finally {
      setLoading(false);
    }
  }, [pageSlug]);

  useEffect(() => { loadData(); }, [loadData]);

  const updateField = (sectionKey, field, value) => {
    setSections(prev => prev.map(sec =>
      sec.section_key === sectionKey ? { ...sec, [field]: value } : sec
    ));
  };

  const updateContent = (sectionKey, contentKey, value) => {
    setSections(prev => prev.map(sec => {
      if (sec.section_key !== sectionKey) return sec;
      const cur = typeof sec.content === 'object' && sec.content !== null ? sec.content : {};
      return { ...sec, content: { ...cur, [contentKey]: value } };
    }));
  };

  const updateSlide = (sectionKey, slideIndex, field, value) => {
    setSections(prev => prev.map(sec => {
      if (sec.section_key !== sectionKey) return sec;
      const cur = typeof sec.content === 'object' && sec.content !== null ? { ...sec.content } : {};
      const slides = Array.isArray(cur.slides)
        ? [...cur.slides]
        : [
            { image: cur.bg_image || '/images/h1.webp', alt: 'Community service photo 1' },
            { image: '/images/h2.webp', alt: 'Community service photo 2' },
            { image: '/images/donate.webp', alt: 'Community service photo 3' }
          ];
      while (slides.length <= slideIndex) slides.push({ image: '', alt: '' });
      slides[slideIndex] = { ...slides[slideIndex], [field]: value };
      return { ...sec, content: { ...cur, slides, bg_image: slides[0]?.image || cur.bg_image || '' } };
    }));
  };

  const addSlide = (sectionKey) => {
    setSections(prev => prev.map(sec => {
      if (sec.section_key !== sectionKey) return sec;
      const cur = typeof sec.content === 'object' && sec.content !== null ? { ...sec.content } : {};
      const slides = Array.isArray(cur.slides)
        ? [...cur.slides, { image: '/images/h1.webp', alt: 'New slide image' }]
        : [
            { image: cur.bg_image || '/images/h1.webp', alt: 'Slide 1' },
            { image: '/images/h2.webp', alt: 'Slide 2' },
            { image: '/images/donate.webp', alt: 'Slide 3' },
            { image: '/images/h1.webp', alt: 'New slide' }
          ];
      return { ...sec, content: { ...cur, slides } };
    }));
  };

  const removeSlide = (sectionKey, idx) => {
    setSections(prev => prev.map(sec => {
      if (sec.section_key !== sectionKey) return sec;
      const cur = typeof sec.content === 'object' && sec.content !== null ? { ...sec.content } : {};
      const slides = Array.isArray(cur.slides) ? [...cur.slides] : [];
      if (slides.length <= 1) return sec;
      slides.splice(idx, 1);
      return { ...sec, content: { ...cur, slides, bg_image: slides[0]?.image || '' } };
    }));
  };

  const moveSlide = (sectionKey, idx, dir) => {
    setSections(prev => prev.map(sec => {
      if (sec.section_key !== sectionKey) return sec;
      const cur = typeof sec.content === 'object' && sec.content !== null ? { ...sec.content } : {};
      const slides = Array.isArray(cur.slides) ? [...cur.slides] : [];
      const target = idx + dir;
      if (target < 0 || target >= slides.length) return sec;
      [slides[idx], slides[target]] = [slides[target], slides[idx]];
      return { ...sec, content: { ...cur, slides, bg_image: slides[0]?.image || '' } };
    }));
  };

  const saveSection = async (sec) => {
    setSavingKey(sec.section_key);
    try {
      await sectionsService.update(pageSlug, sec.section_key, {
        title: sec.title,
        subtitle: sec.subtitle,
        content: sec.content,
        is_published: sec.is_published !== 0,
        order_index: sec.order_index || 0
      });
      showToast(`✓ "${sec.title || sec.section_key}" saved!`);
    } catch (err) {
      showToast(err.message || 'Could not save. Please try again.');
    } finally {
      setSavingKey(null);
    }
  };

  const saveSEO = async (e) => {
    e.preventDefault();
    try {
      await pagesService.updateSEO(pageSlug, pageSEO);
      showToast('Google search settings saved!');
      setShowSeoModal(false);
    } catch (err) {
      showToast(err.message || 'Could not save.');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-500">Loading {pageTitle}...</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Editing: {pageTitle}</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Changes are saved section by section. Click <strong>"Save Changes"</strong> on each section after editing.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowSeoModal(true)}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-semibold inline-flex items-center gap-1.5 transition cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">manage_search</span>
            <span>Google Search Settings</span>
          </button>
          <a
            href={pageSlug === 'home' ? '/' : `/${pageSlug === 'ourwork' ? 'ourwork' : pageSlug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl text-sm font-semibold inline-flex items-center gap-1.5 transition"
          >
            <span className="material-symbols-outlined text-base">open_in_new</span>
            <span>View Live Page</span>
          </a>
        </div>
      </div>

      {/* Sections — flat visible cards */}
      {sections.map((sec, idx) => {
        const meta = getSectionMeta(sec.section_key);
        const content = typeof sec.content === 'object' && sec.content !== null ? sec.content : {};
        const isSaving = savingKey === sec.section_key;

        return (
          <div key={sec.section_key || idx} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Card header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <div>
                <h3 className="font-bold text-gray-900 text-base">{meta.label}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{meta.hint}</p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <label className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold select-none">
                  <input
                    type="checkbox"
                    checked={sec.is_published !== 0}
                    onChange={e => updateField(sec.section_key, 'is_published', e.target.checked ? 1 : 0)}
                    className="rounded accent-primary w-4 h-4"
                  />
                  <span className={sec.is_published !== 0 ? 'text-emerald-600' : 'text-gray-400'}>
                    {sec.is_published !== 0 ? 'Visible' : 'Hidden'}
                  </span>
                </label>
              </div>
            </div>

            {/* Card body */}
            <div className="px-6 py-6 space-y-5">

              {/* Main heading & tagline (always shown) */}
              <div className="grid md:grid-cols-2 gap-4">
                <Field label="Section Heading" hint="The main title text shown at the top of this section.">
                  <TextInput
                    value={sec.title}
                    onChange={val => updateField(sec.section_key, 'title', val)}
                    placeholder="e.g. Our Journey of Upliftment"
                  />
                </Field>
                <Field label="Tagline / Sub-heading" hint="Smaller text shown just below the main heading.">
                  <TextArea
                    rows={2}
                    value={sec.subtitle}
                    onChange={val => updateField(sec.section_key, 'subtitle', val)}
                    placeholder="e.g. Serving families with compassion since 1990"
                  />
                </Field>
              </div>

              {/* ── HERO SLIDESHOW ── */}
              {(sec.section_key === 'hero' && (pageSlug === 'home' || Array.isArray(content.slides))) && (
                <div className="border border-gray-100 rounded-2xl p-5 bg-slate-50 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-gray-800 text-sm flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-xl">view_carousel</span>
                        Rotating Banner Images
                      </h4>
                      <p className="text-xs text-gray-500 mt-0.5">These images slide automatically on the home page banner.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => addSlide(sec.section_key)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary/90 transition cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">add</span>
                      Add Image
                    </button>
                  </div>
                  <div className="space-y-3">
                    {(Array.isArray(content.slides)
                      ? content.slides
                      : [
                          { image: content.bg_image || '/images/h1.webp', alt: 'Banner image 1' },
                          { image: '/images/h2.webp', alt: 'Banner image 2' },
                          { image: '/images/donate.webp', alt: 'Banner image 3' }
                        ]
                    ).map((slide, sidx, arr) => (
                      <div key={sidx} className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-sm text-gray-700">
                            Image {sidx + 1} {sidx === 0 && <span className="ml-1 text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">First to show</span>}
                          </span>
                          <div className="flex items-center gap-1">
                            <button type="button" disabled={sidx === 0} onClick={() => moveSlide(sec.section_key, sidx, -1)} className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 cursor-pointer" title="Move up">
                              <span className="material-symbols-outlined text-sm text-gray-500">arrow_upward</span>
                            </button>
                            <button type="button" disabled={sidx === arr.length - 1} onClick={() => moveSlide(sec.section_key, sidx, 1)} className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 cursor-pointer" title="Move down">
                              <span className="material-symbols-outlined text-sm text-gray-500">arrow_downward</span>
                            </button>
                            {arr.length > 1 && (
                              <button type="button" onClick={() => removeSlide(sec.section_key, sidx)} className="p-1 rounded hover:bg-red-50 cursor-pointer ml-1" title="Remove">
                                <span className="material-symbols-outlined text-sm text-red-400">delete</span>
                              </button>
                            )}
                          </div>
                        </div>
                        <ImageUploader
                          label={`Banner Image ${sidx + 1}`}
                          value={slide.image || ''}
                          onChange={val => updateSlide(sec.section_key, sidx, 'image', val)}
                        />
                        <Field label="Image description (for accessibility)" hint="A brief description of the photo — helps visually impaired users and search engines.">
                          <TextInput
                            value={slide.alt}
                            onChange={val => updateSlide(sec.section_key, sidx, 'alt', val)}
                            placeholder="e.g. Trust volunteers distributing ration kits to families"
                          />
                        </Field>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── FEATURED / BACKGROUND IMAGE (non-hero) ── */}
              {sec.section_key !== 'hero' && (
                (content.bg_image !== undefined || content.image !== undefined || content.banner_image !== undefined) && (
                  <Field label="Section Image" hint="The main photo displayed in this section.">
                    <ImageUploader
                      label=""
                      value={content.bg_image ?? content.image ?? content.banner_image ?? ''}
                      onChange={val => {
                        const key = content.bg_image !== undefined ? 'bg_image' : content.image !== undefined ? 'image' : 'banner_image';
                        updateContent(sec.section_key, key, val);
                      }}
                    />
                  </Field>
                )
              )}

              {/* ── BADGE TEXT ── */}
              {content.badge !== undefined && (
                <Field label="Small Badge Label" hint="The small coloured pill text shown above the heading (e.g. 'Registered Trust • Goa').">
                  <TextInput value={content.badge} onChange={val => updateContent(sec.section_key, 'badge', val)} placeholder="e.g. Registered Public Charitable Trust" />
                </Field>
              )}

              {/* ── INTRO PARAGRAPH ── */}
              {content.intro_paragraph !== undefined && (
                <Field label="Introduction Paragraph" hint="The opening paragraph text for this section.">
                  <TextArea rows={3} value={content.intro_paragraph} onChange={val => updateContent(sec.section_key, 'intro_paragraph', val)} />
                </Field>
              )}

              {/* ── DESCRIPTION ── */}
              {content.description !== undefined && (
                <Field label="Description" hint="A short summary or description paragraph shown in this section.">
                  <TextArea rows={3} value={content.description} onChange={val => updateContent(sec.section_key, 'description', val)} />
                </Field>
              )}

              {/* ── STORY PARAGRAPHS ── */}
              {content.narrative_1 !== undefined && (
                <div className="space-y-4">
                  <Field label="Story Paragraph 1" hint="First paragraph of the story or narrative shown in this section.">
                    <TextArea rows={3} value={content.narrative_1} onChange={val => updateContent(sec.section_key, 'narrative_1', val)} />
                  </Field>
                  {content.narrative_2 !== undefined && (
                    <Field label="Story Paragraph 2" hint="Second paragraph continuing the narrative.">
                      <TextArea rows={3} value={content.narrative_2} onChange={val => updateContent(sec.section_key, 'narrative_2', val)} />
                    </Field>
                  )}
                </div>
              )}

              {/* ── VISION & MISSION ── */}
              {content.vision_text !== undefined && (
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Vision Statement" hint="What the trust aspires to achieve in the long run.">
                    <TextArea rows={3} value={content.vision_text} onChange={val => updateContent(sec.section_key, 'vision_text', val)} />
                  </Field>
                  <Field label="Mission Statement" hint="The day-to-day purpose and actions of the trust.">
                    <TextArea rows={3} value={content.mission_text} onChange={val => updateContent(sec.section_key, 'mission_text', val)} />
                  </Field>
                </div>
              )}

              {/* ── IMPACT STATS (counters) ── */}
              {content.counter_years !== undefined && (
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Impact Numbers</label>
                  <p className="text-xs text-gray-400 mb-3">The 3 statistics shown in the journey section (e.g. "30+ Years", "5000+ Families Served").</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { valKey: 'counter_years',      labelKey: 'counter_years_label',      title: 'Years Active' },
                      { valKey: 'counter_lives',      labelKey: 'counter_lives_label',      title: 'Lives Touched' },
                      { valKey: 'counter_activities', labelKey: 'counter_activities_label', title: 'Activities Held' },
                    ].map(({ valKey, labelKey, title }) => (
                      <div key={valKey} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                        <p className="text-[11px] text-gray-400 font-bold uppercase mb-2">{title}</p>
                        <input
                          type="text"
                          value={content[valKey] || ''}
                          onChange={e => updateContent(sec.section_key, valKey, e.target.value)}
                          placeholder="e.g. 30+"
                          className="w-full px-2.5 py-2 border border-gray-200 rounded-lg text-sm font-bold text-primary focus:outline-none focus:border-primary mb-1.5"
                        />
                        <input
                          type="text"
                          value={content[labelKey] || ''}
                          onChange={e => updateContent(sec.section_key, labelKey, e.target.value)}
                          placeholder="Label text"
                          className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-primary"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── BULLET POINTS ── */}
              {Array.isArray(content.points) && (
                <Field label="List of Points / Bullet Items" hint="Each line becomes one bullet point on the website. Press Enter to start a new point.">
                  <TextArea
                    rows={5}
                    value={content.points.join('\n')}
                    onChange={val => updateContent(sec.section_key, 'points', val.split('\n').filter(Boolean))}
                    placeholder={"Point 1\nPoint 2\nPoint 3"}
                  />
                </Field>
              )}

              {/* ── QUOTE & AUTHOR ── */}
              {content.quote !== undefined && (
                <div className="space-y-4">
                  <Field label="Inspirational Quote" hint="A meaningful quote displayed in this section (usually from the founder or a leader).">
                    <TextArea rows={3} value={content.quote} onChange={val => updateContent(sec.section_key, 'quote', val)} />
                  </Field>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label="Person's Name" hint="The name of the person who said the quote.">
                      <TextInput
                        value={content.author_name || content.founder_name || ''}
                        onChange={val => updateContent(sec.section_key, content.author_name !== undefined ? 'author_name' : 'founder_name', val)}
                        placeholder="e.g. Reginaldo Mascarenhas"
                      />
                    </Field>
                    <Field label="Their Title / Role" hint="e.g. Founder & Trustee">
                      <TextInput
                        value={content.author_title || content.founder_title || ''}
                        onChange={val => updateContent(sec.section_key, content.author_title !== undefined ? 'author_title' : 'founder_title', val)}
                        placeholder="e.g. Founder & Trustee"
                      />
                    </Field>
                  </div>
                  {(content.author_bio !== undefined || content.founder_bio !== undefined) && (
                    <Field label="Biography" hint="A short paragraph about this person shown on the About page.">
                      <TextArea rows={4} value={content.author_bio || content.founder_bio || ''} onChange={val => updateContent(sec.section_key, content.author_bio !== undefined ? 'author_bio' : 'founder_bio', val)} />
                    </Field>
                  )}
                  {(content.author_image !== undefined || content.founder_image !== undefined) && (
                    <Field label="Their Photo" hint="Upload a portrait photo of the founder or leader.">
                      <ImageUploader
                        label=""
                        value={content.author_image || content.founder_image || ''}
                        onChange={val => updateContent(sec.section_key, content.author_image !== undefined ? 'author_image' : 'founder_image', val)}
                      />
                    </Field>
                  )}
                </div>
              )}

              {/* ── OFFICE / CONTACT DETAILS ── */}
              {content.phone_primary !== undefined && (
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Main Phone Number" hint="The primary office phone number shown on the contact page.">
                    <TextInput value={content.phone_primary} onChange={val => updateContent(sec.section_key, 'phone_primary', val)} placeholder="+91 98221 23456" />
                  </Field>
                  <Field label="Emergency / Ambulance Number" hint="The 24/7 emergency helpline number (shown in red).">
                    <TextInput value={content.emergency_phone} onChange={val => updateContent(sec.section_key, 'emergency_phone', val)} placeholder="+91 98221 99999" />
                  </Field>
                  {content.phone_whatsapp !== undefined && (
                    <Field label="WhatsApp Number" hint="Number visitors can message on WhatsApp (without the + sign).">
                      <TextInput value={content.phone_whatsapp} onChange={val => updateContent(sec.section_key, 'phone_whatsapp', val)} placeholder="919822123456" />
                    </Field>
                  )}
                  {content.email !== undefined && (
                    <Field label="Email Address" hint="The trust's official contact email address.">
                      <TextInput value={content.email} onChange={val => updateContent(sec.section_key, 'email', val)} placeholder="contact@reginaldotrust.org" />
                    </Field>
                  )}
                  {content.address !== undefined && (
                    <div className="sm:col-span-2">
                      <Field label="Office Address" hint="The full postal address of the trust's office.">
                        <TextInput value={content.address} onChange={val => updateContent(sec.section_key, 'address', val)} />
                      </Field>
                    </div>
                  )}
                </div>
              )}

              {/* ── BUTTONS ── */}
              {(content.primary_btn_text !== undefined || content.btn_text !== undefined) && (
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Button Text" hint="The text shown on the main button in this section.">
                    <TextInput
                      value={content.primary_btn_text ?? content.btn_text ?? ''}
                      onChange={val => updateContent(sec.section_key, content.primary_btn_text !== undefined ? 'primary_btn_text' : 'btn_text', val)}
                      placeholder="e.g. Learn More"
                    />
                  </Field>
                  <Field label="Button Link" hint="Where the button takes visitors when clicked (e.g. /contact or /services).">
                    <TextInput
                      value={content.primary_btn_url ?? content.btn_url ?? ''}
                      onChange={val => updateContent(sec.section_key, content.primary_btn_url !== undefined ? 'primary_btn_url' : 'btn_url', val)}
                      placeholder="e.g. /contact"
                    />
                  </Field>
                </div>
              )}
              {content.secondary_btn_text !== undefined && (
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Second Button Text" hint="Text for the secondary button (if there are two buttons).">
                    <TextInput value={content.secondary_btn_text} onChange={val => updateContent(sec.section_key, 'secondary_btn_text', val)} placeholder="e.g. View Gallery" />
                  </Field>
                  <Field label="Second Button Link" hint="Link for the secondary button.">
                    <TextInput value={content.secondary_btn_url} onChange={val => updateContent(sec.section_key, 'secondary_btn_url', val)} placeholder="e.g. /gallery" />
                  </Field>
                </div>
              )}

              {/* Save Button */}
              <div className="flex justify-end pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => saveSection(sec)}
                  disabled={isSaving}
                  className="px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition inline-flex items-center gap-2 shadow-sm cursor-pointer disabled:opacity-60"
                >
                  {isSaving ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-base">check_circle</span>
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        );
      })}

      {/* Google Search Settings Modal */}
      {showSeoModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-7 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-2xl">manage_search</span>
                  Google Search Settings
                </h3>
                <p className="text-sm text-gray-500 mt-0.5">Controls how this page looks in Google search results.</p>
              </div>
              <button onClick={() => setShowSeoModal(false)} className="text-gray-400 hover:text-gray-700 cursor-pointer">
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>
            <form onSubmit={saveSEO} className="space-y-5">
              <Field
                label="Page title shown in Google"
                hint="This is the blue clickable title users see in Google search results."
              >
                <TextInput
                  value={pageSEO.seo_title}
                  onChange={val => setPageSEO({ ...pageSEO, seo_title: val })}
                  placeholder="e.g. Home | Reginaldo Trust Curtorim Goa"
                />
              </Field>
              <Field
                label="Short description for Google"
                hint="The grey text under the title in search results. Keep it under 160 characters."
              >
                <TextArea
                  rows={3}
                  value={pageSEO.meta_description}
                  onChange={val => setPageSEO({ ...pageSEO, meta_description: val })}
                  placeholder="e.g. Reginaldo Trust provides free healthcare, farmer support, education aid and home restoration to families in Curtorim, Goa."
                />
              </Field>
              <Field
                label="Image shown when sharing on WhatsApp / Facebook"
                hint="When someone shares this page link, this image appears in the preview."
              >
                <ImageUploader label="" value={pageSEO.og_image} onChange={val => setPageSEO({ ...pageSEO, og_image: val })} />
              </Field>
              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button type="button" onClick={() => setShowSeoModal(false)} className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl cursor-pointer">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 text-sm font-bold text-white bg-primary hover:bg-primary/90 rounded-xl cursor-pointer shadow-sm">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
