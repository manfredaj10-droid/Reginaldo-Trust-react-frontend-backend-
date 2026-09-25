import React from 'react';

const MARQUEE_ITEMS = [
  'Hope', 'Compassion', 'Charity', 'Community Care', 'Elderly Support',
  'Free Healthcare', 'Farmer Machinery', 'House Restoration', 'Youth Scholarships',
  'Clean & Green', '100% Free Relief', 'Serving Goa 20+ Years'
];

export default function Marquee() {
  return (
    <div className="bg-primary py-2.5 overflow-hidden" role="region" aria-label="Values announcement">
      <div className="marquee-track">
        <div className="marquee-content text-on-primary font-semibold text-xs sm:text-sm">
          {MARQUEE_ITEMS.map((item, idx) => (
            <span key={idx} className="mx-3 inline-flex items-center gap-3">
              <span>{item}</span>
              <span className="text-primary-container/70 text-xs">✦</span>
            </span>
          ))}
        </div>
        <div aria-hidden="true" className="marquee-content text-on-primary font-semibold text-xs sm:text-sm">
          {MARQUEE_ITEMS.map((item, idx) => (
            <span key={'dup-' + idx} className="mx-3 inline-flex items-center gap-3">
              <span>{item}</span>
              <span className="text-primary-container/70 text-xs">✦</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
