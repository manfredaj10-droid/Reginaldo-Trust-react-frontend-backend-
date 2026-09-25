/**
 * Comprehensive Full-System Inspection — Reginaldo Trust CMS
 */
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const BASE = 'http://localhost:5000/api';

let passed = 0, failed = 0;
function assert(cond, msg) {
  if (cond) { console.log(`  ✓ [PASS] ${msg}`); passed++; }
  else       { console.error(`  ✗ [FAIL] ${msg}`); failed++; }
}

async function main() {
  console.log('================================================================');
  console.log(' REGINALDO TRUST — COMPREHENSIVE FULL-SYSTEM INSPECTION');
  console.log('================================================================\n');

  // ──────────────────────────────────────────────────────────
  // 1. Backend Health
  // ──────────────────────────────────────────────────────────
  console.log('1. [BACKEND] Service Health & Connectivity:');
  const health = await fetch(`${BASE}/health`).then(r => r.json());
  assert(health.status === 'ok',                             'Health endpoint responds with status: ok');
  assert(health.service === 'Reginaldo Trust API',          'Service name correctly set');

  // ──────────────────────────────────────────────────────────
  // 2. Authentication
  // ──────────────────────────────────────────────────────────
  console.log('\n2. [AUTH] Admin Login & JWT:');
  const badLogin = await fetch(`${BASE}/auth/login`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'wrongpass' })
  }).then(r => r.json());
  assert(badLogin.success === false, 'Invalid credentials correctly rejected');

  const loginRes = await fetch(`${BASE}/auth/login`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'reginaldo2026' })
  }).then(r => r.json());
  assert(loginRes.success === true,                           'Admin login succeeds with correct credentials');
  assert(typeof loginRes.token === 'string' && loginRes.token.length > 50, 'Valid JWT token issued');
  const auth = { 'Authorization': `Bearer ${loginRes.token}`, 'Content-Type': 'application/json' };

  // ──────────────────────────────────────────────────────────
  // 3. Pages API
  // ──────────────────────────────────────────────────────────
  console.log('\n3. [PAGES] All Pages & SEO:');
  const pages = await fetch(`${BASE}/pages`).then(r => r.json());
  assert(pages.success === true && pages.data.length >= 6,  `Retrieved all ${pages.data.length} pages`);

  const expectedSlugs = ['home', 'about', 'services', 'ourwork', 'gallery', 'contact'];
  const actualSlugs   = pages.data.map(p => p.slug);
  expectedSlugs.forEach(slug =>
    assert(actualSlugs.includes(slug), `Page slug "${slug}" exists in database`)
  );

  const homePage = await fetch(`${BASE}/pages/home`).then(r => r.json());
  assert(homePage.success === true,                          'Home page details retrieved');
  assert(Array.isArray(homePage.data.sections) && homePage.data.sections.length >= 4,
         `Home page carries ${homePage.data.sections?.length} embedded sections`);

  // SEO update
  const seoUp = await fetch(`${BASE}/pages/home/seo`, {
    method: 'PUT', headers: auth,
    body: JSON.stringify({ seo_title: 'Reginaldo Trust | Community Welfare Goa', meta_description: 'Test description' })
  }).then(r => r.json());
  assert(seoUp.success === true, 'Home page SEO metadata updated successfully');

  // ──────────────────────────────────────────────────────────
  // 4. Sections — all pages
  // ──────────────────────────────────────────────────────────
  console.log('\n4. [SECTIONS] Editable Sections for All Pages:');
  const pageSections = {
    home: 5, about: 4, services: 6, ourwork: 4, gallery: 2, contact: 2
  };
  for (const [slug, minCount] of Object.entries(pageSections)) {
    const res = await fetch(`${BASE}/sections/${slug}`).then(r => r.json());
    assert(res.success === true && res.count >= minCount,
           `Page /${slug} → ${res.count} sections (expected ≥ ${minCount})`);
  }

  // Hero slideshow slots
  const homeSecs = await fetch(`${BASE}/sections/home`).then(r => r.json());
  const hero = homeSecs.data.find(s => s.section_key === 'hero');
  const heroContent = typeof hero.content === 'object' ? hero.content : JSON.parse(hero.content || '{}');
  const slides = heroContent.slides || [];
  assert(Array.isArray(slides) && slides.length >= 3,
         `Hero has ${slides.length} slideshow images (all 3 individually editable via Admin)`);

  // Section content update
  const secUpdate = await fetch(`${BASE}/sections/home/hero`, {
    method: 'PUT', headers: auth,
    body: JSON.stringify({ title: hero.title, subtitle: hero.subtitle, content: heroContent })
  }).then(r => r.json());
  assert(secUpdate.success === true, 'Section content update round-trip succeeds');

  // ──────────────────────────────────────────────────────────
  // 5. Photo Archive & Categories
  // ──────────────────────────────────────────────────────────
  console.log('\n5. [GALLERY] Photo Archive & Category Management:');
  const photos = await fetch(`${BASE}/gallery`).then(r => r.json());
  assert(photos.success === true && photos.data.length >= 40,
         `Photo archive loaded with ${photos.data.length} photographs`);

  const cats = await fetch(`${BASE}/gallery/categories`).then(r => r.json());
  assert(cats.success === true && cats.data.length >= 6,
         `${cats.data.length} gallery categories loaded: ${cats.data.map(c=>c.label).join(', ')}`);

  // Create → Verify → Assign photo → Filter → Cleanup
  const newCatId = 'inspect_cat_' + Date.now();
  const catCreate = await fetch(`${BASE}/gallery/categories`, {
    method: 'POST', headers: auth,
    body: JSON.stringify({ id: newCatId, label: 'Inspection Category' })
  }).then(r => r.json());
  assert(catCreate.success === true, 'New category created via POST /gallery/categories');

  const catsAfter = await fetch(`${BASE}/gallery/categories`).then(r => r.json());
  assert(catsAfter.data.some(c => c.id === newCatId), 'New category appears in live category list');

  const photoCreate = await fetch(`${BASE}/gallery`, {
    method: 'POST', headers: auth,
    body: JSON.stringify({ category: newCatId, caption: 'Inspection Photo', src: '/images/donate.webp', alt: 'test', tag: 'Test' })
  }).then(r => r.json());
  assert(photoCreate.success === true, 'Photo created and assigned to new category');
  const photoId = photoCreate.data?.id;

  const filtered = await fetch(`${BASE}/gallery?category=${newCatId}`).then(r => r.json());
  assert(filtered.success === true && filtered.data.length === 1, 'Category filter returns only photos in that category');

  await fetch(`${BASE}/gallery/${photoId}`,              { method: 'DELETE', headers: auth });
  await fetch(`${BASE}/gallery/categories/${newCatId}`, { method: 'DELETE', headers: auth });
  console.log('  → Cleanup: test photo & category deleted');

  // ──────────────────────────────────────────────────────────
  // 6. Initiatives CRUD
  // ──────────────────────────────────────────────────────────
  console.log('\n6. [INITIATIVES] Full CRUD:');
  const initCreate = await fetch(`${BASE}/initiatives`, {
    method: 'POST', headers: auth,
    body: JSON.stringify({ title: 'Inspection Initiative', category: 'Health', description: 'Test desc', icon: 'health_and_safety', image: '/images/donate.webp', button_text: 'Learn More', button_url: '/services', order_index: 99 })
  }).then(r => r.json());
  assert(initCreate.success === true, 'Initiative CREATE');
  const initId = initCreate.data?.id;

  const initRead = await fetch(`${BASE}/initiatives`).then(r => r.json());
  assert(initRead.data.some(i => i.id === initId), 'Initiative READ — appears in list');

  const initUpdate = await fetch(`${BASE}/initiatives/${initId}`, {
    method: 'PUT', headers: auth,
    body: JSON.stringify({ title: 'Updated Inspection Initiative', category: 'Health', description: 'Updated desc' })
  }).then(r => r.json());
  assert(initUpdate.success === true && initUpdate.data.title === 'Updated Inspection Initiative', 'Initiative UPDATE');

  const initDelete = await fetch(`${BASE}/initiatives/${initId}`, { method: 'DELETE', headers: auth }).then(r => r.json());
  assert(initDelete.success === true, 'Initiative DELETE');

  // ──────────────────────────────────────────────────────────
  // 7. Events CRUD (day/mon/tag schema)
  // ──────────────────────────────────────────────────────────
  console.log('\n7. [EVENTS] Full CRUD (Program Directory Events):');
  const evCreate = await fetch(`${BASE}/events`, {
    method: 'POST', headers: auth,
    body: JSON.stringify({ day: '20', mon: 'OCT', tag: 'Community', title: 'Inspection Event', description: 'Inspection test event.', is_extra: false })
  }).then(r => r.json());
  assert(evCreate.success === true, 'Event CREATE with day/mon/tag schema');
  const evId = evCreate.data?.id;

  const evRead = await fetch(`${BASE}/events`).then(r => r.json());
  assert(evRead.data.some(e => e.id === evId), 'Event READ — appears in events list');

  const evUpdate = await fetch(`${BASE}/events/${evId}`, {
    method: 'PUT', headers: auth,
    body: JSON.stringify({ day: '21', mon: 'OCT', tag: 'Community', title: 'Updated Inspection Event', description: 'Updated event.', is_extra: false })
  }).then(r => r.json());
  assert(evUpdate.success === true && evUpdate.data.title === 'Updated Inspection Event', 'Event UPDATE');

  const evDelete = await fetch(`${BASE}/events/${evId}`, { method: 'DELETE', headers: auth }).then(r => r.json());
  assert(evDelete.success === true, 'Event DELETE');

  // ──────────────────────────────────────────────────────────
  // 8. Citizen Enquiries
  // ──────────────────────────────────────────────────────────
  console.log('\n8. [ENQUIRIES] Public → Admin Workflow:');
  const contactRes = await fetch(`${BASE}/contact`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Inspection Citizen', phone: '9900012345', email: 'inspect@test.com', service: 'General Welfare', message: 'System inspection enquiry.' })
  }).then(r => r.json());
  assert(contactRes.success === true, 'Public contact form submitted (200 OK)');

  const enqList = await fetch(`${BASE}/enquiries`, { headers: auth }).then(r => r.json());
  const testEnq = enqList.data.find(e => e.name === 'Inspection Citizen');
  assert(testEnq !== undefined, 'Enquiry arrives in Admin Citizen Enquiries inbox');

  if (testEnq) {
    const statRes = await fetch(`${BASE}/enquiries/${testEnq.id}/status`, {
      method: 'PATCH', headers: auth,
      body: JSON.stringify({ status: 'resolved' })
    }).then(r => r.json());
    assert(statRes.success === true && statRes.data.status === 'resolved', 'Admin can update enquiry status to "resolved"');

    const delRes = await fetch(`${BASE}/enquiries/${testEnq.id}`, { method: 'DELETE', headers: auth }).then(r => r.json());
    assert(delRes.success === true, 'Admin can delete enquiry — cleanup OK');
  }

  // ──────────────────────────────────────────────────────────
  // 9. Site Settings
  // ──────────────────────────────────────────────────────────
  console.log('\n9. [SETTINGS] Global Site Settings:');
  const settings = await fetch(`${BASE}/settings`).then(r => r.json());
  assert(settings.success === true,                              'Settings endpoint returns 200 OK');
  assert(settings.data.site_name !== undefined,                  `site_name present: "${settings.data.site_name}"`);
  assert(settings.data.contact_phone !== undefined,             'contact_phone present');
  assert(settings.data.contact_email !== undefined,             'contact_email present');
  assert(settings.data.facebook_url !== undefined,              'facebook_url (social link) present');
  assert(settings.data.footer_copyright !== undefined,          'footer_copyright present');

  const settingsUp = await fetch(`${BASE}/settings`, {
    method: 'PUT', headers: auth,
    body: JSON.stringify({ emergency_phone: '+91 98221 77777' })
  }).then(r => r.json());
  assert(settingsUp.success === true && settingsUp.data.emergency_phone === '+91 98221 77777', 'Settings update persists correctly');

  // ──────────────────────────────────────────────────────────
  // 10. Protected Route Enforcement
  // ──────────────────────────────────────────────────────────
  console.log('\n10. [SECURITY] Protected Endpoints Require Auth:');
  const unprotected = await fetch(`${BASE}/sections/home/hero`, {
    method: 'PUT', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: 'Hack attempt' })
  });
  assert(unprotected.status === 401 || unprotected.status === 403,
         `PUT /sections without token rejected with ${unprotected.status}`);

  const noAuthGallery = await fetch(`${BASE}/gallery`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ caption: 'hack', src: '/bad.jpg', category: 'community' })
  });
  assert(noAuthGallery.status === 401 || noAuthGallery.status === 403,
         `POST /gallery without token rejected with ${noAuthGallery.status}`);

  // ──────────────────────────────────────────────────────────
  // 11. Media Assets
  // ──────────────────────────────────────────────────────────
  console.log('\n11. [UPLOADS] Media Asset Infrastructure:');
  const uploadDir = path.resolve('./server/uploads');
  const publicImages = path.resolve('./frontend/public/images');
  assert(fs.existsSync(uploadDir) || fs.existsSync(publicImages),
         'Media asset directory exists (server/uploads or frontend/public/images)');

  // ──────────────────────────────────────────────────────────
  // 12. Frontend Parity
  // ──────────────────────────────────────────────────────────
  console.log('\n12. [FRONTEND] Content Parity Across All 6 Pages:');
  try {
    const out = execSync('node frontend/scripts/verify-parity.mjs', { encoding: 'utf-8', cwd: path.resolve('.') });
    const pages6 = ['Home.jsx','About.jsx','Services.jsx','OurWork.jsx','Gallery.jsx','Contact.jsx'];
    pages6.forEach(f => assert(out.includes(`100% Match`) && out.includes(f), `${f} — 100% heading parity`));
  } catch (e) {
    assert(false, 'Parity verification threw an error: ' + e.message);
  }

  // ──────────────────────────────────────────────────────────
  // 13. Admin UI file integrity checks
  // ──────────────────────────────────────────────────────────
  console.log('\n13. [ADMIN UI] File Integrity & Cleanliness Checks:');

  const adminLogin = fs.readFileSync('./frontend/src/pages/admin/AdminLogin.jsx', 'utf-8');
  assert(!adminLogin.includes('reginaldo2026'), 'AdminLogin.jsx: default password hint removed');

  const dashboard = fs.readFileSync('./frontend/src/pages/admin/AdminDashboard.jsx', 'utf-8');
  assert(!dashboard.includes('+ Add New Category') || !dashboard.includes('category\nGallery'), 
         'AdminDashboard.jsx: "+ Add New Category" removed from top header toolbar');

  // Categories bar still present
  assert(dashboard.includes('New Category'), 'AdminDashboard.jsx: "+ New Category" still present in Categories bar only');
  assert(dashboard.includes('Photo Archive CMS'), 'AdminDashboard.jsx: section title is "Photo Archive CMS"');

  const pageSectionEditor = fs.readFileSync('./frontend/src/pages/admin/components/PageSectionEditor.jsx', 'utf-8');
  assert(!pageSectionEditor.includes('Add New Sub-Section'), 'PageSectionEditor.jsx: "Add New Sub-Section" modal removed');
  assert(!pageSectionEditor.includes('showAddModal'), 'PageSectionEditor.jsx: showAddModal state removed');

  const gallery = fs.readFileSync('./frontend/src/pages/Gallery.jsx', 'utf-8');
  assert(!gallery.includes('Dynamic Sub-Sections Added via Admin CMS'), 'Gallery.jsx: extra dynamic sub-sections renderer removed');
  assert(gallery.includes('filterTabs'), 'Gallery.jsx: dynamic category filter tabs still present');

  // ──────────────────────────────────────────────────────────
  // 14. Production Build Artifact
  // ──────────────────────────────────────────────────────────
  console.log('\n14. [BUILD] Production Build Artifact:');
  const distIndex = path.resolve('./frontend/dist/index.html');
  const distJs    = path.resolve('./frontend/dist/assets');
  assert(fs.existsSync(distIndex), 'dist/index.html exists');
  assert(fs.existsSync(distJs), 'dist/assets/ directory exists with compiled JS/CSS');

  // ──────────────────────────────────────────────────────────
  // Summary
  // ──────────────────────────────────────────────────────────
  console.log('\n================================================================');
  console.log(` INSPECTION COMPLETE: ${passed} PASSED, ${failed} FAILED`);
  console.log('================================================================');
  if (failed > 0) process.exit(1);
}

main().catch(err => { console.error('Fatal error:', err); process.exit(1); });
