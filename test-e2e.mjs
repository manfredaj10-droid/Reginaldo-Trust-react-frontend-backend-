/**
 * Comprehensive End-to-End Test Suite for Reginaldo Trust CMS Backend
 */
import fs from 'fs';
import path from 'path';

const BASE_URL = 'http://localhost:5000/api';

async function runTests() {
  console.log('====================================================');
  console.log(' Reginaldo Trust Full-Stack CMS Verification Suite');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✓ [PASS] ${message}`);
      passed++;
    } else {
      console.error(`  ✗ [FAIL] ${message}`);
      failed++;
    }
  }

  // 1. Health check
  console.log('1. Testing System Health API:');
  const healthRes = await fetch(`${BASE_URL}/health`).then(r => r.json());
  assert(healthRes.status === 'ok', 'Health endpoint returns status: ok');
  assert(healthRes.service === 'Reginaldo Trust API', 'Service name is correctly identified');

  // 2. Authentication
  console.log('\n2. Testing Admin Authentication:');
  const loginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'reginaldo2026' })
  }).then(r => r.json());

  assert(loginRes.success === true, 'Admin login succeeds with credentials');
  assert(typeof loginRes.token === 'string' && loginRes.token.length > 50, 'JWT token issued');
  const token = loginRes.token;
  const authHeaders = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  // 3. Pages API
  console.log('\n3. Testing Pages API:');
  const pagesRes = await fetch(`${BASE_URL}/pages`).then(r => r.json());
  assert(pagesRes.success === true && pagesRes.data.length >= 6, `Retrieved ${pagesRes.data?.length} pages`);
  
  const homePageRes = await fetch(`${BASE_URL}/pages/home`).then(r => r.json());
  assert(homePageRes.success === true && homePageRes.data.slug === 'home', 'Retrieved /pages/home');
  assert(Array.isArray(homePageRes.data.sections) && homePageRes.data.sections.length >= 4, 'Home page sections embedded in response');

  // 4. Update Page SEO
  console.log('\n4. Testing SEO Updates:');
  const seoUpdateRes = await fetch(`${BASE_URL}/pages/home/seo`, {
    method: 'PUT',
    headers: authHeaders,
    body: JSON.stringify({
      seo_title: 'Reginaldo Trust | Community Welfare & Free Healthcare Goa',
      meta_description: 'Empowering Curtorim with 100% free healthcare, farmer machinery, scholarships and restored shelter.'
    })
  }).then(r => r.json());
  assert(seoUpdateRes.success === true, 'Updated Home page SEO metadata');

  // 5. Sections API
  console.log('\n5. Testing Modular Sections API:');
  const sectionsRes = await fetch(`${BASE_URL}/sections/home`).then(r => r.json());
  assert(sectionsRes.success === true && sectionsRes.count >= 4, `Retrieved ${sectionsRes.count} home sections`);
  
  const heroSection = sectionsRes.data.find(s => s.section_key === 'hero');
  assert(heroSection !== undefined, 'Found hero section on home page');

  // Update Section
  const updateSecRes = await fetch(`${BASE_URL}/sections/home/hero`, {
    method: 'PUT',
    headers: authHeaders,
    body: JSON.stringify({
      title: 'Dedicated to the Upliftment and Welfare of Our Community',
      subtitle: heroSection.subtitle,
      content: {
        ...heroSection.content,
        highlight_note: '100% Free Public Services • Verified Ground Action'
      }
    })
  }).then(r => r.json());
  assert(updateSecRes.success === true, 'Successfully updated hero section content');
  assert(updateSecRes.data.content.highlight_note === '100% Free Public Services • Verified Ground Action', 'Section content JSON updated and verified');

  // 6. Initiatives CRUD
  console.log('\n6. Testing Initiatives Full CRUD:');
  // CREATE
  const createInitRes = await fetch(`${BASE_URL}/initiatives`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      title: 'Test Clean Water Initiative',
      category: 'Environment',
      description: 'Providing clean drinking water filtration systems to rural village schools.',
      icon: 'water_drop',
      image: '/images/donate.webp',
      button_text: 'Learn More',
      button_url: '/services',
      order_index: 99
    })
  }).then(r => r.json());
  assert(createInitRes.success === true && createInitRes.data.id !== undefined, 'Created new initiative');
  const testInitId = createInitRes.data?.id;

  // READ
  const initsRes = await fetch(`${BASE_URL}/initiatives`).then(r => r.json());
  const foundInit = initsRes.data.find(i => i.id === testInitId);
  assert(foundInit !== undefined && foundInit.title === 'Test Clean Water Initiative', 'Read newly created initiative from database');

  // UPDATE
  const updateInitRes = await fetch(`${BASE_URL}/initiatives/${testInitId}`, {
    method: 'PUT',
    headers: authHeaders,
    body: JSON.stringify({
      title: 'Updated Clean Water Initiative',
      category: 'Environment',
      description: 'Updated description for clean drinking water drive.'
    })
  }).then(r => r.json());
  assert(updateInitRes.success === true && updateInitRes.data.title === 'Updated Clean Water Initiative', 'Updated initiative successfully');

  // DELETE
  const deleteInitRes = await fetch(`${BASE_URL}/initiatives/${testInitId}`, {
    method: 'DELETE',
    headers: authHeaders
  }).then(r => r.json());
  assert(deleteInitRes.success === true, 'Deleted test initiative');

  // 7. Site Settings
  console.log('\n7. Testing Site Settings:');
  const settingsRes = await fetch(`${BASE_URL}/settings`).then(r => r.json());
  assert(settingsRes.success === true && settingsRes.data.site_name !== undefined, 'Read site settings');

  const updateSettingsRes = await fetch(`${BASE_URL}/settings`, {
    method: 'PUT',
    headers: authHeaders,
    body: JSON.stringify({
      emergency_phone: '+91 98221 99999',
      whatsapp_number: '919822123456'
    })
  }).then(r => r.json());
  assert(updateSettingsRes.success === true && updateSettingsRes.data.emergency_phone === '+91 98221 99999', 'Updated hotline numbers in site settings');

  // 8. Citizen Enquiries & Contact Flow
  console.log('\n8. Testing Citizen Enquiries Workflow:');
  // Citizen submits form
  const submitInquiryRes = await fetch(`${BASE_URL}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Maria Fernandes',
      phone: '9822112233',
      email: 'maria@example.com',
      service: 'Medical & Health Services',
      message: 'Requesting wheelchair assistance for elderly parent in Curtorim.'
    })
  }).then(r => r.json());
  assert(submitInquiryRes.success === true, 'Citizen submitted contact form successfully');

  // Admin lists enquiries
  const enquiriesRes = await fetch(`${BASE_URL}/enquiries`, {
    headers: authHeaders
  }).then(r => r.json());
  assert(enquiriesRes.success === true && enquiriesRes.data.length > 0, `Admin retrieved ${enquiriesRes.data.length} inquiries`);

  const createdEnquiry = enquiriesRes.data.find(e => e.name === 'Maria Fernandes');
  assert(createdEnquiry !== undefined, 'Found newly submitted enquiry in admin inbox');

  if (createdEnquiry) {
    // Admin updates status
    const statusUpdateRes = await fetch(`${BASE_URL}/enquiries/${createdEnquiry.id}/status`, {
      method: 'PATCH',
      headers: authHeaders,
      body: JSON.stringify({ status: 'in-progress' })
    }).then(r => r.json());
    assert(statusUpdateRes.success === true && statusUpdateRes.data.status === 'in-progress', 'Updated inquiry status to in-progress');

    // Admin deletes test inquiry
    const deleteEnqRes = await fetch(`${BASE_URL}/enquiries/${createdEnquiry.id}`, {
      method: 'DELETE',
      headers: authHeaders
    }).then(r => r.json());
    assert(deleteEnqRes.success === true, 'Admin successfully cleaned up test enquiry');
  }

  // Summary
  console.log('\n====================================================');
  console.log(` Test Results: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================');

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
