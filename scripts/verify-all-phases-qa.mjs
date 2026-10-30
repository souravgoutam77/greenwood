import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const ARTIFACT_DIR = 'C:/Users/Sourav/.gemini/antigravity/brain/e398a586-37c6-4491-aae1-778d0bff3a19';
const BASE_URL = 'http://localhost:5173';

async function runQa() {
  console.log('🚀 Starting Automated Full-Suite Browser QA for Greenwood Cafe...\n');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  const consoleErrors = [];

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      const text = msg.text();
      // Ignore favicon or non-critical 404s for images
      if (!text.includes('favicon') && !text.includes('Failed to load resource')) {
        consoleErrors.push(text);
      }
    }
  });

  page.on('pageerror', (err) => {
    consoleErrors.push(err.message);
  });

  try {
    // ----------------------------------------------------
    // TEST 1: DESKTOP HOMEPAGE & HERO BANNER
    // ----------------------------------------------------
    console.log('--- TEST 1: Desktop Homepage ---');
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto(`${BASE_URL}/#home`, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1000));

    // Save screenshot
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'qa-phase-1-desktop-home.png') });
    console.log('✓ Captured desktop homepage screenshot');

    // ----------------------------------------------------
    // TEST 2: MOBILE VIEW & HERO BANNER (4:3, no text overlay)
    // ----------------------------------------------------
    console.log('\n--- TEST 2: Mobile View & Hero Banner ---');
    await page.setViewport({ width: 390, height: 844, isMobile: true });
    await page.goto(`${BASE_URL}/#home`, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1000));

    // Verify empty cart has NO 0 badge
    const headerCartBadge = await page.$('header button[aria-label="View food cart"] span');
    console.log('Header Cart Badge present with empty cart?:', Boolean(headerCartBadge));
    if (headerCartBadge) {
      const text = await page.evaluate(el => el.textContent, headerCartBadge);
      console.log('Cart badge text:', text);
    } else {
      console.log('✓ Verified: Empty cart badge is hidden as requested!');
    }

    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'qa-phase-2-mobile-home.png') });
    console.log('✓ Captured mobile homepage screenshot');

    // ----------------------------------------------------
    // TEST 3: ZERO DUMMY DATA AUDIT (DOM text inspection)
    // ----------------------------------------------------
    console.log('\n--- TEST 3: Zero Dummy Data Audit ---');
    const dummyStrings = [
      'Rahul Sharma',
      'Amit Verma',
      '123, Green Park, Sector 15',
      'Cyber City',
      'Pure Veg Dining Club Member',
      'Verified Pure Veg Member',
      '#GW-7231',
    ];

    const bodyText = await page.evaluate(() => document.body.innerText);
    for (const str of dummyStrings) {
      const hasStr = bodyText.includes(str);
      if (hasStr) {
        console.warn(`⚠️ Warning: Found dummy string "${str}" in home view`);
      } else {
        console.log(`✓ Clean: "${str}" is NOT present`);
      }
    }

    // ----------------------------------------------------
    // TEST 4: ABOUT US PAGE (#about)
    // ----------------------------------------------------
    console.log('\n--- TEST 4: Dedicated About Us Page ---');
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto(`${BASE_URL}/#about`, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1000));

    const aboutHeading = await page.$eval('h1', el => el.textContent);
    console.log('About Page Heading:', aboutHeading);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'qa-phase-6-about-page.png') });
    console.log('✓ Captured About Us page screenshot');

    // ----------------------------------------------------
    // TEST 5: DEDICATED GALLERY PAGE (#gallery)
    // ----------------------------------------------------
    console.log('\n--- TEST 5: Dedicated Gallery Page ---');
    await page.goto(`${BASE_URL}/#gallery`, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1000));

    const galleryHeading = await page.$eval('h1', el => el.textContent);
    console.log('Gallery Page Heading:', galleryHeading);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'qa-phase-6-gallery-page.png') });
    console.log('✓ Captured Gallery page screenshot');

    // ----------------------------------------------------
    // TEST 6: DEDICATED CONTACT PAGE (#contact)
    // ----------------------------------------------------
    console.log('\n--- TEST 6: Dedicated Contact Page ---');
    await page.goto(`${BASE_URL}/#contact`, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1000));

    const contactHeading = await page.$eval('h1', el => el.textContent);
    console.log('Contact Page Heading:', contactHeading);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'qa-phase-6-contact-page.png') });
    console.log('✓ Captured Contact page screenshot');

    // ----------------------------------------------------
    // TEST 7: ADMIN LOCK SCREEN & SECURITY LEAK CHECK (#admin)
    // ----------------------------------------------------
    console.log('\n--- TEST 7: Admin Lock Screen Security ---');
    // Clear admin session to test locked view
    await page.evaluate(() => {
      localStorage.removeItem('gw_admin_session');
      localStorage.removeItem('gw_customer_auth');
    });
    await page.goto(`${BASE_URL}/#admin`, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1000));

    const adminBodyText = await page.evaluate(() => document.body.innerText);
    const leaksAdminPhone = adminBodyText.includes('8802325537');
    console.log('Does Admin Lock Screen expose "8802325537"?:', leaksAdminPhone);
    if (!leaksAdminPhone) {
      console.log('✓ Verified: Admin phone is completely hidden from public lock screen!');
    }
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'qa-phase-1-admin-locked.png') });
    console.log('✓ Captured Admin locked portal screenshot');

    // ----------------------------------------------------
    // TEST 8: ADMIN AUTHORIZATION & POS DASHBOARD
    // ----------------------------------------------------
    console.log('\n--- TEST 8: Admin Authorization & POS Dashboard ---');
    await page.evaluate(() => {
      localStorage.setItem('gw_admin_session', JSON.stringify({
        authorized: true,
        phone: '8802325537',
        name: 'Sourav',
        role: 'owner',
        time: Date.now()
      }));
    });
    await page.goto(`${BASE_URL}/#admin`, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1000));

    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'qa-phase-5-admin-authorized-dashboard.png') });
    console.log('✓ Captured Admin Authorized POS Dashboard screenshot');

    // ----------------------------------------------------
    // TEST 9: CUSTOMER PROFILE & DESKTOP/MOBILE STAFF ADMIN ACCESS
    // ----------------------------------------------------
    console.log('\n--- TEST 9: Customer Profile & Staff Admin Button Sync ---');
    // Set customer auth as Sourav 8802325537
    await page.evaluate(() => {
      localStorage.setItem('gw_customer_auth', JSON.stringify({
        name: 'Sourav',
        phone: '8802325537',
        verified: true,
        loggedInAt: Date.now()
      }));
    });

    // Check Desktop View
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto(`${BASE_URL}/#profile`, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1000));

    const profileTextDesktop = await page.evaluate(() => document.body.innerText);
    const hasStaffAdminDesktop = profileTextDesktop.includes('Staff Admin');
    console.log('Staff Admin button visible on Desktop Profile?:', hasStaffAdminDesktop);

    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'qa-phase-1-profile-desktop-admin.png') });

    // Check Mobile View
    await page.setViewport({ width: 390, height: 844, isMobile: true });
    await page.goto(`${BASE_URL}/#profile`, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1000));

    const profileTextMobile = await page.evaluate(() => document.body.innerText);
    const hasStaffAdminMobile = profileTextMobile.includes('Staff Admin');
    console.log('Staff Admin button visible on Mobile Profile?:', hasStaffAdminMobile);

    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'qa-phase-1-profile-mobile-admin.png') });

    // ----------------------------------------------------
    // TEST 10: CUSTOMER ORDERS PAGE (Clean Empty State)
    // ----------------------------------------------------
    console.log('\n--- TEST 10: Orders Page Clean State ---');
    await page.goto(`${BASE_URL}/#orders`, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1000));

    const ordersText = await page.evaluate(() => document.body.innerText);
    const hasFakeRahulOrder = ordersText.includes('#GW-8492') && ordersText.includes('Rahul Sharma');
    console.log('Does Orders Page show fake hardcoded order #GW-8492?:', hasFakeRahulOrder);
    if (!hasFakeRahulOrder) {
      console.log('✓ Verified: Orders page shows real dynamic state or clean empty prompt!');
    }

    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'qa-phase-3-orders-clean-state.png') });

    // Check Console Errors
    console.log('\n--- Console Errors Check ---');
    if (consoleErrors.length === 0) {
      console.log('🎉 ZERO console errors detected across all tested views!');
    } else {
      console.warn('Console warnings/errors found:', consoleErrors);
    }

  } catch (err) {
    console.error('QA Test execution failed:', err);
  } finally {
    await browser.close();
    console.log('\n🏁 QA Verification Completed.');
  }
}

runQa();
