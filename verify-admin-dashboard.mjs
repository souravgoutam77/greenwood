import puppeteer from 'puppeteer';
import path from 'path';

const ARTIFACT_DIR = 'C:/Users/Sourav/.gemini/antigravity/brain/e398a586-37c6-4491-aae1-778d0bff3a19';
const chromePath = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

async function runAdminQA() {
  console.log('Launching browser for Admin Kitchen & Order Management Dashboard QA...');
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
    await page.goto('http://127.0.0.1:5173/#admin', { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 1200));

    // Verify footer is NOT present
    const footerPresent = await page.evaluate(() => {
      const footer = document.querySelector('footer');
      return !!footer;
    });
    console.log('Footer present on Admin Page (should be false):', footerPresent);

    // Verify customer mobile bottom nav is NOT present
    const bottomNavPresent = await page.evaluate(() => {
      const nav = document.querySelector('nav[aria-label="Mobile Bottom Navigation"]');
      return !!nav;
    });
    console.log('Customer bottom nav on Admin Page (should be false):', bottomNavPresent);

    // Capture desktop viewport
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'qa-admin-desktop-1440.png'),
    });

    // Capture desktop full page
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'qa-admin-desktop-full.png'),
      fullPage: true,
    });

    // Test KOT print modal interaction
    console.log('Testing KOT print modal...');
    const clickedKot = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const kotBtn = btns.find((b) => b.textContent && b.textContent.includes('Print KOT'));
      if (kotBtn) {
        kotBtn.click();
        return true;
      }
      return false;
    });
    if (clickedKot) {
      await new Promise((r) => setTimeout(r, 600));
      await page.screenshot({
        path: path.join(ARTIFACT_DIR, 'qa-admin-kot-modal.png'),
      });
      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const closeBtn = btns.find((b) => b.textContent && (b.textContent.includes('Close') || b.textContent.includes('✕')));
        if (closeBtn) closeBtn.click();
      });
      await new Promise((r) => setTimeout(r, 400));
    }

    // Test Order Details modal interaction
    console.log('Testing Order Details modal...');
    const detailsClicked = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const detailsBtn = btns.find((b) => b.textContent && b.textContent.includes('Details'));
      if (detailsBtn) {
        detailsBtn.click();
        return true;
      }
      return false;
    });
    if (detailsClicked) {
      await new Promise((r) => setTimeout(r, 600));
      await page.screenshot({
        path: path.join(ARTIFACT_DIR, 'qa-admin-details-modal.png'),
      });
      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const closeBtn = btns.find((b) => b.textContent && (b.textContent.includes('Close') || b.textContent.includes('✕')));
        if (closeBtn) closeBtn.click();
      });
      await new Promise((r) => setTimeout(r, 400));
    }

    // Test Decline modal interaction
    console.log('Testing Decline modal...');
    const declineClicked = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const declineBtn = btns.find((b) => b.textContent && b.textContent.includes('Decline'));
      if (declineBtn) {
        declineBtn.click();
        return true;
      }
      return false;
    });
    if (declineClicked) {
      await new Promise((r) => setTimeout(r, 600));
      await page.screenshot({
        path: path.join(ARTIFACT_DIR, 'qa-admin-decline-modal.png'),
      });
      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const closeBtn = btns.find((b) => b.textContent && (b.textContent.includes('Close') || b.textContent.includes('✕')));
        if (closeBtn) closeBtn.click();
      });
      await new Promise((r) => setTimeout(r, 400));
    }

    // 2. Tablet Viewport (768 x 1024)
    console.log('Testing Tablet 768px...');
    await page.setViewport({ width: 768, height: 1024, deviceScaleFactor: 2 });
    await page.goto('about:blank');
    await page.goto('http://127.0.0.1:5173/#admin', { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 800));
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'qa-admin-tablet-768.png'),
    });

    // 3. Mobile Viewport (390 x 844) iPhone 14
    console.log('Testing Mobile 390px...');
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
    await page.goto('http://127.0.0.1:5173/#admin', { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 800));
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'qa-admin-mobile-390.png'),
    });
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'qa-admin-mobile-full.png'),
      fullPage: true,
    });

    // 4. Narrow Mobile (360 x 780)
    console.log('Testing Narrow Mobile 360px...');
    await page.setViewport({ width: 360, height: 780, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
    await page.goto('http://127.0.0.1:5173/#admin', { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 800));
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'qa-admin-mobile-360.png'),
    });

    console.log('Admin Dashboard QA completed successfully!');
  } catch (err) {
    console.error('QA Test error:', err);
  } finally {
    await browser.close();
  }
}

runAdminQA();
