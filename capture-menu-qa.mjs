import puppeteer from 'puppeteer';
import path from 'path';

const brainDir = 'C:/Users/Sourav/.gemini/antigravity/brain/e398a586-37c6-4491-aae1-778d0bff3a19';
const chromePath = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

async function capture() {
  console.log('Launching browser for Menu Page Visual QA...');
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // 1. DESKTOP VIEWPORT (1440px)
  console.log('Capturing Menu Page Desktop (1440px)...');
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await page.goto('http://127.0.0.1:5173/#menu', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1200));

  await page.screenshot({
    path: path.join(brainDir, 'qa-menu-desktop-1440.png'),
    fullPage: false
  });
  console.log('Saved qa-menu-desktop-1440.png');

  // Full page desktop
  await page.screenshot({
    path: path.join(brainDir, 'qa-menu-desktop-full.png'),
    fullPage: true
  });
  console.log('Saved qa-menu-desktop-full.png');

  // 2. TABLET VIEWPORT (768px)
  console.log('Capturing Menu Page Tablet (768px)...');
  await page.setViewport({ width: 768, height: 1024, deviceScaleFactor: 1 });
  await page.goto('http://127.0.0.1:5173/#menu', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));

  await page.screenshot({
    path: path.join(brainDir, 'qa-menu-tablet-768.png'),
    fullPage: false
  });
  console.log('Saved qa-menu-tablet-768.png');

  // 3. MOBILE VIEWPORT (390px - iPhone 14 / standard)
  console.log('Capturing Menu Page Mobile (390px)...');
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await page.goto('http://127.0.0.1:5173/#menu', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));

  await page.screenshot({
    path: path.join(brainDir, 'qa-menu-mobile-390.png'),
    fullPage: false
  });
  console.log('Saved qa-menu-mobile-390.png');

  await page.screenshot({
    path: path.join(brainDir, 'qa-menu-mobile-full.png'),
    fullPage: true
  });
  console.log('Saved qa-menu-mobile-full.png');

  // 4. NARROW MOBILE (360px - small Android)
  console.log('Capturing Menu Page Narrow Mobile (360px)...');
  await page.setViewport({ width: 360, height: 740, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await page.goto('http://127.0.0.1:5173/#menu', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 800));

  await page.screenshot({
    path: path.join(brainDir, 'qa-menu-narrow-360.png'),
    fullPage: false
  });
  console.log('Saved qa-menu-narrow-360.png');

  await browser.close();
  console.log('All Menu Page QA screenshots successfully captured!');
}

capture().catch(err => {
  console.error('Error during capture:', err);
  process.exit(1);
});
