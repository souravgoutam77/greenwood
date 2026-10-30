import puppeteer from 'puppeteer';
import path from 'path';

const ARTIFACT_DIR = 'C:/Users/Sourav/.gemini/antigravity/brain/e398a586-37c6-4491-aae1-778d0bff3a19';

async function testLoadingState() {
  console.log('Testing "Going Live..." loading indicator in Admin Panel...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 900 });

    await page.goto('http://localhost:5173/#admin', { waitUntil: 'domcontentloaded' });
    await new Promise((r) => setTimeout(r, 1000));

    // Unlock Admin Panel
    const isLocked = await page.evaluate(() => !!document.querySelector('input[type="tel"]'));
    if (isLocked) {
      console.log('Unlocking admin panel with 8802325537...');
      await page.type('input[type="tel"]', '8802325537');
      await page.click('button[type="submit"]');
      await new Promise((r) => setTimeout(r, 1200));
    }

    // Navigate to Menu Items
    console.log('Opening Menu Items...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const menuBtn = btns.find(b => b.innerText.includes('Menu Items') || b.innerText.includes('Manage Menu'));
      if (menuBtn) menuBtn.click();
    });
    await new Promise((r) => setTimeout(r, 800));

    // Find the toggle button on row 1
    console.log('Clicking toggle button and checking for immediate loading spinner / Going Live...');
    const clickPromise = page.evaluate(() => {
      const rows = document.querySelectorAll('tbody tr');
      const targetRow = rows[0];
      const toggleBtn = targetRow?.querySelectorAll('td')[4]?.querySelector('button');
      if (toggleBtn) toggleBtn.click();
    });

    // Check DOM within 100ms of clicking to observe loading state
    await new Promise((r) => setTimeout(r, 80));
    const loadingState = await page.evaluate(() => {
      const rows = document.querySelectorAll('tbody tr');
      const targetRow = rows[0];
      const toggleBtn = targetRow?.querySelectorAll('td')[4]?.querySelector('button');
      const text = toggleBtn?.innerText?.trim();
      const hasSpinner = !!toggleBtn?.querySelector('svg.animate-spin');
      const isDisabled = toggleBtn?.disabled;
      return { text, hasSpinner, isDisabled };
    });

    console.log('Observed Loading State:', loadingState);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'qa-admin-going-live-indicator.png'), fullPage: false });

    // Wait for Firestore sync to complete
    await new Promise((r) => setTimeout(r, 3000));

    const finalState = await page.evaluate(() => {
      const rows = document.querySelectorAll('tbody tr');
      const targetRow = rows[0];
      const toggleBtn = targetRow?.querySelectorAll('td')[4]?.querySelector('button');
      const text = toggleBtn?.innerText?.trim();
      const hasSpinner = !!toggleBtn?.querySelector('svg.animate-spin');
      const isDisabled = toggleBtn?.disabled;
      return { text, hasSpinner, isDisabled };
    });

    console.log('Final State after Firestore sync:', finalState);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'qa-admin-synced-state.png'), fullPage: false });

    console.log('✅ LOADING STATE TEST PASSED!');
  } finally {
    await browser.close();
  }
}

testLoadingState().catch((err) => {
  console.error('❌ Loading state test failed:', err);
  process.exit(1);
});
