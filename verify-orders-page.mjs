import puppeteer from 'puppeteer';
import path from 'path';

const ARTIFACT_DIR = 'C:/Users/Sourav/.gemini/antigravity/brain/e398a586-37c6-4491-aae1-778d0bff3a19';
const chromePath = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

async function runQA() {
  console.log('Launching browser for Orders Page QA...');
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();

    // 1. Desktop Viewport (1440 x 900)
    console.log('Testing Desktop 1440px...');
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
    await page.goto('http://127.0.0.1:5173/#orders', { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 1000));

    // Capture desktop viewport
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'qa-orders-desktop-1440.png'),
    });

    // Capture desktop full page
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'qa-orders-desktop-full.png'),
      fullPage: true,
    });

    // 2. Mobile Viewport (390 x 844) iPhone 14
    console.log('Testing Mobile 390px...');
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
    await page.goto('http://127.0.0.1:5173/#orders', { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 1000));

    // Verify Mobile Bottom Nav is visible and Footer is NOT visible
    const mobileBottomNavVisible = await page.evaluate(() => {
      const nav = document.querySelector('nav[aria-label="Mobile Bottom Navigation"]');
      if (!nav) return false;
      const rect = nav.getBoundingClientRect();
      return rect.height > 0 && rect.bottom <= window.innerHeight + 5;
    });

    const footerPresent = await page.evaluate(() => {
      const footer = document.querySelector('footer');
      return !!footer;
    });

    console.log('Mobile Bottom Nav visible:', mobileBottomNavVisible);
    console.log('Footer present on Orders Page:', footerPresent);

    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'qa-orders-mobile-390.png'),
    });

    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'qa-orders-mobile-full.png'),
      fullPage: true,
    });

    // 3. Narrow Mobile (360 x 780)
    console.log('Testing Narrow Mobile 360px...');
    await page.setViewport({ width: 360, height: 780, deviceScaleFactor: 2 });
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'qa-orders-mobile-360.png'),
    });

    // 4. Test Modal interaction (View Details)
    console.log('Testing View Details modal...');
    const viewDetailsBtn = await page.$('button');
    // Click View Details
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const target = btns.find((b) => b.textContent && b.textContent.includes('View Details'));
      if (target) target.click();
    });
    await new Promise((r) => setTimeout(r, 500));
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'qa-orders-modal-open.png'),
    });

    console.log('All QA screenshots captured successfully!');
  } catch (err) {
    console.error('QA Error:', err);
  } finally {
    await browser.close();
  }
}

runQA();
