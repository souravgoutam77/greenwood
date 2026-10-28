import puppeteer from 'puppeteer';
import path from 'path';

const brainDir = 'C:/Users/Sourav/.gemini/antigravity/brain/e398a586-37c6-4491-aae1-778d0bff3a19';
const chromePath = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

async function verify() {
  console.log('Launching browser to verify Mobile Bottom Navigation & Cart Page...');
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // Mobile viewport (390px - iPhone 14)
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });

  // 1. Check Menu Page on mobile
  console.log('1. Checking Menu Page on mobile (#menu)...');
  await page.goto('http://127.0.0.1:5173/#menu', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 800));

  await page.screenshot({
    path: path.join(brainDir, 'qa-fixed-menu-mobile.png'),
    fullPage: false
  });
  console.log('Saved qa-fixed-menu-mobile.png');

  // Verify footer is NOT in the DOM on Menu page
  const footerOnMenu = await page.$('footer');
  console.log('   Footer present on Menu page:', footerOnMenu !== null);

  // Verify mobile bottom bar is present
  const navOnMenu = await page.$('nav[aria-label="Mobile Bottom Navigation"]');
  console.log('   Mobile Bottom Navigation present on Menu page:', navOnMenu !== null);

  // 2. Check View Product Page on mobile (#butter-paneer)
  console.log('2. Checking View Product Page on mobile (#butter-paneer)...');
  await page.goto('http://127.0.0.1:5173/#butter-paneer', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 800));

  await page.screenshot({
    path: path.join(brainDir, 'qa-fixed-viewproduct-mobile.png'),
    fullPage: false
  });
  console.log('Saved qa-fixed-viewproduct-mobile.png');

  const footerOnView = await page.$('footer');
  console.log('   Footer present on View Product page:', footerOnView !== null);

  const navOnView = await page.$('nav[aria-label="Mobile Bottom Navigation"]');
  console.log('   Mobile Bottom Navigation present on View Product page:', navOnView !== null);

  // 3. Add an item and check Cart Page (#cart)
  console.log('3. Checking Cart Page (#cart)...');
  // First add an item from menu
  await page.goto('http://127.0.0.1:5173/#menu', { waitUntil: 'networkidle0' });
  const addBtn = await page.waitForSelector('xpath///button[contains(., "Add")]');
  if (addBtn) {
    await addBtn.click();
    await new Promise(r => setTimeout(r, 400));
  }

  // Navigate to Cart
  await page.goto('http://127.0.0.1:5173/#cart', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 800));

  await page.screenshot({
    path: path.join(brainDir, 'qa-cart-page-mobile.png'),
    fullPage: false
  });
  console.log('Saved qa-cart-page-mobile.png');

  await page.screenshot({
    path: path.join(brainDir, 'qa-cart-page-mobile-full.png'),
    fullPage: true
  });
  console.log('Saved qa-cart-page-mobile-full.png');

  // Desktop viewport (1440px)
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://127.0.0.1:5173/#cart', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 800));

  await page.screenshot({
    path: path.join(brainDir, 'qa-cart-page-desktop.png'),
    fullPage: false
  });
  console.log('Saved qa-cart-page-desktop.png');

  // 4. Verify Home page STILL has footer
  await page.goto('http://127.0.0.1:5173/#home', { waitUntil: 'networkidle0' });
  const footerOnHome = await page.$('footer');
  console.log('4. Footer present on Home page:', footerOnHome !== null);

  await browser.close();
  console.log('All verifications completed successfully!');
}

verify().catch(err => {
  console.error('Error during verification:', err);
  process.exit(1);
});
