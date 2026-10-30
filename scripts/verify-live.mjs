import puppeteer from 'puppeteer';

async function main() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 412, height: 915, isMobile: true, hasTouch: true });
  
  console.log('Navigating to #about on live Netlify...');
  await page.goto('https://greenwood-cafe-narela.netlify.app/#about', { waitUntil: 'networkidle2' });
  await page.waitForSelector('h1', { timeout: 10000 });
  await new Promise(r => setTimeout(r, 1000));
  
  await page.screenshot({
    path: 'C:/Users/Sourav/.gemini/antigravity/brain/e398a586-37c6-4491-aae1-778d0bff3a19/qa-live-about-clean.png',
    fullPage: false
  });

  const aboutText = await page.evaluate(() => document.body.innerText);
  console.log('Does About have "WELCOME TO GREENWOOD"?:', aboutText.includes('WELCOME TO GREENWOOD'));
  console.log('Does About have "100% Desi Ghee" badge pill?:', aboutText.includes('🥕'));

  // Test #gallery redirect
  console.log('Testing #gallery link...');
  await page.goto('https://greenwood-cafe-narela.netlify.app/#gallery', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));
  
  const currentUrl = page.url();
  console.log('Current URL after #gallery:', currentUrl);

  await page.screenshot({
    path: 'C:/Users/Sourav/.gemini/antigravity/brain/e398a586-37c6-4491-aae1-778d0bff3a19/qa-live-home-gallery-scrolled.png',
    fullPage: false
  });

  await browser.close();
  console.log('QA completed successfully!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
