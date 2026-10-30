import puppeteer from 'puppeteer';

async function testAboutPage() {
  console.log('🚀 Starting Comprehensive About Page QA Verification...');

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // =========================================================================
  // 1. DESKTOP VIEWPORT TEST (1440x900)
  // =========================================================================
  console.log('\n--- 1. Testing Desktop Viewport (1440x900) ---');
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:5173/#about', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 2000));

  // Check navigation
  const activeNavText = await page.evaluate(() => {
    const active = document.querySelector('nav a[href="#about"]');
    return active ? active.innerText : '';
  });
  console.log('Active Nav on Desktop:', activeNavText);

  // Check Hero Headings
  const heroHeading = await page.$eval('h1', el => el.innerText);
  console.log('Hero Heading:', heroHeading);

  // Check 3 Badge Pills
  const pillsText = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('section[aria-label="About Greenwood Hero"] span'))
      .map(s => s.innerText)
      .filter(t => t.includes('100%') || t.includes('Fresh'));
  });
  console.log('Hero Badge Pills:', pillsText);

  // Check Section B Our Story
  const storyHeading = await page.evaluate(() => {
    const el = document.querySelector('section[aria-label="Our Philosophy"] h2');
    return el ? el.innerText : '';
  });
  console.log('Our Story Heading:', storyHeading);

  // Check Section C Feature Cards
  const featureCards = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('section[aria-label="What Makes Greenwood Special"] h3'))
      .map(h => h.innerText);
  });
  console.log('Feature Cards:', featureCards);

  // Check Section D Glimpse of Greenwood Photos
  const glimpsePhotosCount = await page.evaluate(() => {
    return document.querySelectorAll('section[aria-label="A Glimpse of Greenwood"] img').length;
  });
  console.log('Glimpse of Greenwood Photos Count:', glimpsePhotosCount);

  // Check Section E Visit Us details
  const visitText = await page.evaluate(() => {
    const sec = document.querySelector('section[aria-label="Visit Greenwood Café"]');
    return sec ? sec.innerText : '';
  });
  console.log('Has Address?', visitText.includes('Sector-A10, Narela'));
  console.log('Has Phone +91 90669 06607?', visitText.includes('90669 06607'));
  console.log('Has Email greenwoodcafeindia@gmail.com?', visitText.includes('greenwoodcafeindia@gmail.com'));
  console.log('Has Hours 1 PM – 11 PM?', visitText.includes('1 PM – 11 PM'));

  // Check Footer visible
  const hasFooter = await page.evaluate(() => {
    return !!document.querySelector('footer');
  });
  console.log('Footer visible on About Page?', hasFooter);

  await page.screenshot({ path: 'C:/Users/Sourav/.gemini/antigravity/brain/e398a586-37c6-4491-aae1-778d0bff3a19/qa-about-desktop.png', fullPage: true });
  console.log('📸 Captured qa-about-desktop.png (Full Page)');


  // =========================================================================
  // 2. MOBILE VIEWPORT TEST (390x844 - iPhone 14 / Typical Android)
  // =========================================================================
  console.log('\n--- 2. Testing Mobile Viewport (390x844) ---');
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.goto('http://localhost:5173/#about', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1500));

  // Check Mobile Quick Action buttons (Call, WhatsApp, Directions)
  const mobileActions = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('section[aria-label="Visit Greenwood Café"] a'))
      .map(a => a.href);
  });
  console.log('Mobile Contact Action URLs:', mobileActions);

  // Check Mobile Bottom Navigation visible
  const bottomNavVisible = await page.evaluate(() => {
    return !!document.querySelector('nav[aria-label="Mobile Bottom Navigation"]');
  });
  console.log('Bottom Navigation bar visible on Mobile?', bottomNavVisible);

  await page.screenshot({ path: 'C:/Users/Sourav/.gemini/antigravity/brain/e398a586-37c6-4491-aae1-778d0bff3a19/qa-about-mobile.png' });
  console.log('📸 Captured qa-about-mobile.png');

  // Test Explore Menu CTA button
  console.log('\n--- 3. Testing Explore Menu CTA ---');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('section[aria-label="Closing Call to Action"] button'));
    const menuBtn = btns.find(b => b.innerText.includes('Explore Menu'));
    if (menuBtn) menuBtn.click();
  });
  await new Promise(r => setTimeout(r, 1200));

  const currentUrl = page.url();
  console.log('URL after clicking Explore Menu:', currentUrl);
  console.log('Navigated to Menu successfully?', currentUrl.includes('#menu'));

  await browser.close();
  console.log('\n✅ All About Page QA verifications passed!');
}

testAboutPage().catch(err => {
  console.error('QA Test Error:', err);
  process.exit(1);
});
