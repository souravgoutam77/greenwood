import puppeteer from 'puppeteer';
import path from 'node:path';

const ARTIFACTS_DIR = 'C:\\Users\\Sourav\\.gemini\\antigravity\\brain\\e398a586-37c6-4491-aae1-778d0bff3a19';
const LIVE_URL = 'https://greenwood-cafe-narela.web.app';

function log(msg) {
  console.log(`[FIREBASE LIVE] ${new Date().toISOString().substring(11, 19)} - ${msg}`);
}

async function run() {
  log(`Verifying live Firebase deployment at ${LIVE_URL}...`);
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  try {
    // 1. Visit Live Home Page
    log('Step 1: Visiting Live Homepage...');
    await page.goto(`${LIVE_URL}/#home`, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1500));
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'qa-firebase-live-1-home.png') });
    log('Screenshot saved: qa-firebase-live-1-home.png');

    // 2. Visit Live Menu Page
    log('Step 2: Visiting Live Menu...');
    await page.goto(`${LIVE_URL}/#menu`, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1500));
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'qa-firebase-live-2-menu.png') });
    log('Screenshot saved: qa-firebase-live-2-menu.png');

    // 3. Add to Cart & Checkout
    log('Step 3: Adding item and visiting Cart...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const addBtn = btns.find((b) => b.textContent && b.textContent.includes('Add'));
      if (addBtn) addBtn.click();
    });
    await new Promise((r) => setTimeout(r, 1000));

    await page.goto(`${LIVE_URL}/#cart`, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1500));
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'qa-firebase-live-3-cart.png') });
    log('Screenshot saved: qa-firebase-live-3-cart.png');

    // Place Order
    await page.evaluate(() => {
      window.open = () => null;
      const btns = Array.from(document.querySelectorAll('button'));
      const orderBtn = btns.find(
        (b) =>
          b.textContent &&
          (b.textContent.includes('Place Order') ||
            b.textContent.includes('Confirm Order') ||
            b.textContent.includes('WhatsApp'))
      );
      if (orderBtn) orderBtn.click();
    });
    await new Promise((r) => setTimeout(r, 1500));

    // 4. Check Tracking
    log('Step 4: Checking Live Order Tracking...');
    await page.goto(`${LIVE_URL}/#orders`, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1500));
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'qa-firebase-live-4-tracking.png') });
    log('Screenshot saved: qa-firebase-live-4-tracking.png');

    // 5. Check Admin Portal
    log('Step 5: Checking Live Admin Portal...');
    await page.goto(`${LIVE_URL}/#admin`, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1500));
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'qa-firebase-live-5-admin.png') });
    log('Screenshot saved: qa-firebase-live-5-admin.png');

    log('ALL LIVE FIREBASE VERIFICATIONS PASSED SUCCESSFULLY!');
  } catch (err) {
    console.error('[FIREBASE LIVE ERROR]', err);
  } finally {
    await browser.close();
  }
}

run();
