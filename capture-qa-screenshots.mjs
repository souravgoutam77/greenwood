import puppeteer from 'puppeteer';
import path from 'path';

const brainDir = 'C:/Users/Sourav/.gemini/antigravity/brain/e398a586-37c6-4491-aae1-778d0bff3a19';
const chromePath = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

async function capture() {
  console.log('Launching browser for Dish Detail Visual QA...');
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // 1. DESKTOP CAPTURE (1440px)
  console.log('Capturing Dish Detail Desktop Screenshot (1440px)...');
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await page.goto('http://127.0.0.1:5173/#butter-paneer', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1200));

  await page.screenshot({
    path: path.join(brainDir, 'qa-dish-detail-desktop.png'),
    fullPage: true
  });
  console.log('Saved qa-dish-detail-desktop.png');

  // 2. MOBILE CAPTURE (390px)
  console.log('Capturing Dish Detail Mobile Screenshot (390px)...');
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await page.goto('http://127.0.0.1:5173/#butter-paneer', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1200));

  await page.screenshot({
    path: path.join(brainDir, 'qa-dish-detail-mobile.png'),
    fullPage: true
  });
  console.log('Saved qa-dish-detail-mobile.png');

  // 3. NARROW MOBILE CAPTURE (360px)
  console.log('Capturing Dish Detail Narrow Mobile Screenshot (360px)...');
  await page.setViewport({ width: 360, height: 740, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await page.goto('http://127.0.0.1:5173/#butter-paneer', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));

  await page.screenshot({
    path: path.join(brainDir, 'qa-dish-detail-mobile-360.png'),
    fullPage: true
  });
  console.log('Saved qa-dish-detail-mobile-360.png');

  await browser.close();
  console.log('All Dish Detail QA screenshots captured successfully!');
}

capture().catch(err => {
  console.error('Error during capture:', err);
  process.exit(1);
});
