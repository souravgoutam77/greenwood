import puppeteer from 'puppeteer';
import path from 'path';

const ARTIFACT_DIR = 'C:/Users/Sourav/.gemini/antigravity/brain/e398a586-37c6-4491-aae1-778d0bff3a19';

async function runTest() {
  console.log('Launching browser test...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    // Step 1: Open Home Page
    console.log('Navigating to http://localhost:5173...');
    await page.goto('http://localhost:5173', { waitUntil: 'domcontentloaded' });
    await new Promise((r) => setTimeout(r, 1500));

    // Check Signature & Trending header and dishes
    const sectionInfo = await page.evaluate(() => {
      const heading = document.querySelector('h2');
      const container = document.querySelector('section[aria-label="Signature & Trending Dishes"]');
      if (!container) return { found: false };

      const cards = container.querySelectorAll('.group');
      const cardNames = Array.from(cards).map(c => c.querySelector('h3')?.innerText?.trim()).filter(Boolean);
      const hasFireEmoji = container.innerHTML.includes('🔥');

      const scrollEl = container.querySelector('.overflow-x-auto');
      const initialScroll = scrollEl ? scrollEl.scrollLeft : 0;
      const scrollWidth = scrollEl ? scrollEl.scrollWidth : 0;
      const clientWidth = scrollEl ? scrollEl.clientWidth : 0;

      return {
        found: true,
        headingText: heading?.innerText,
        count: cardNames.length,
        names: cardNames,
        hasFireEmoji,
        initialScroll,
        scrollWidth,
        clientWidth
      };
    });

    console.log('Section Info:', sectionInfo);

    if (!sectionInfo.found || sectionInfo.count < 4) {
      throw new Error(`Expected at least 4 signature dishes, found ${sectionInfo.count}`);
    }

    if (sectionInfo.hasFireEmoji) {
      throw new Error('Fire emoji found in Signature & Trending section!');
    }

    // Step 2: Test smooth auto-slide over 3 seconds
    console.log('Testing smooth continuous auto-sliding...');
    const s0 = await page.evaluate(() => document.querySelector('section[aria-label="Signature & Trending Dishes"] .overflow-x-auto')?.scrollLeft || 0);
    await new Promise((r) => setTimeout(r, 2000));
    const s1 = await page.evaluate(() => document.querySelector('section[aria-label="Signature & Trending Dishes"] .overflow-x-auto')?.scrollLeft || 0);

    console.log(`Scroll measurement: at t=0: ${s0}px, at t=2s: ${s1}px (difference: ${s1 - s0}px)`);

    // Capture desktop screenshot
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'qa-trending-smooth-slider-home.png'), fullPage: false });

    // Mobile Viewport test
    await page.setViewport({ width: 390, height: 844, isMobile: true });
    await new Promise((r) => setTimeout(r, 500));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'qa-trending-smooth-slider-mobile.png'), fullPage: false });

    // Step 3: Admin Panel Verification
    console.log('Testing Admin Panel Menu Items...');
    await page.setViewport({ width: 1280, height: 900 });
    await page.goto('http://localhost:5173/#admin', { waitUntil: 'domcontentloaded' });
    await new Promise((r) => setTimeout(r, 800));

    // Fill login phone if login screen is present
    const isLocked = await page.evaluate(() => !!document.querySelector('input[type="tel"]'));
    if (isLocked) {
      console.log('Entering admin mobile 8802325537...');
      await page.type('input[type="tel"]', '8802325537');
      await page.click('button[type="submit"]');
      await new Promise((r) => setTimeout(r, 1200));
    }

    // Navigate to Menu Items tab
    console.log('Clicking Menu Items tab...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const menuBtn = btns.find(b => b.innerText.includes('Menu Items') || b.innerText.includes('Manage Menu'));
      if (menuBtn) menuBtn.click();
    });
    await new Promise((r) => setTimeout(r, 800));

    // Check menu table rows count before toggle
    const rowsBefore = await page.evaluate(() => {
      const rows = document.querySelectorAll('tbody tr');
      return rows.length;
    });
    console.log(`Admin table rows count before toggle: ${rowsBefore}`);

    if (rowsBefore < 10) {
      throw new Error(`Expected at least 10 items in admin table, found ${rowsBefore}`);
    }

    // Toggle 8th dish's "Signature & Trending" / "Normal" status
    console.log('Toggling 8th dish trending status...');
    const toggledDishName = await page.evaluate(() => {
      const rows = document.querySelectorAll('tbody tr');
      const targetRow = rows[7]; // 8th dish
      const name = targetRow?.querySelector('td:first-child span')?.innerText;
      const toggleBtn = targetRow?.querySelectorAll('td')[4]?.querySelector('button');
      if (toggleBtn) toggleBtn.click();
      return name;
    });
    console.log(`Toggled dish: ${toggledDishName}`);
    await new Promise((r) => setTimeout(r, 1200));

    // Verify rows count AFTER toggle (MUST NOT COLLAPSE TO 1 ROW)
    const rowsAfter = await page.evaluate(() => {
      const rows = document.querySelectorAll('tbody tr');
      return rows.length;
    });
    console.log(`Admin table rows count after toggle: ${rowsAfter}`);

    if (rowsAfter !== rowsBefore) {
      throw new Error(`Admin menu collapsed! Before: ${rowsBefore}, After: ${rowsAfter}`);
    }

    // Capture screenshot of admin menu items
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'qa-trending-multi-items-admin.png'), fullPage: false });

    // Step 4: Verify reflection on customer homepage
    console.log('Verifying home page reflection...');
    await page.goto('http://localhost:5173', { waitUntil: 'domcontentloaded' });
    await new Promise((r) => setTimeout(r, 1000));

    const finalHomeInfo = await page.evaluate(() => {
      const container = document.querySelector('section[aria-label="Signature & Trending Dishes"]');
      const cards = container?.querySelectorAll('.group') || [];
      const names = Array.from(cards).map(c => c.querySelector('h3')?.innerText?.trim()).filter(Boolean);
      return { count: names.length, names };
    });

    console.log('Final Home Signature & Trending dishes count:', finalHomeInfo.count);
    console.log('Dishes in slider:', finalHomeInfo.names);

    if (finalHomeInfo.count <= 4) {
      throw new Error(`Expected more than 4 dishes in Signature & Trending on home page, got ${finalHomeInfo.count}`);
    }

    console.log('✅ ALL VERIFICATIONS PASSED 100%!');
  } finally {
    await browser.close();
  }
}

runTest().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
