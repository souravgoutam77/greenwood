import puppeteer from 'puppeteer';

async function main() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 412, height: 915, isMobile: true, hasTouch: true });
  
  // Visit #gallery
  console.log('Navigating to #gallery...');
  await page.goto('https://greenwood-cafe-narela.netlify.app/#gallery', { waitUntil: 'networkidle2' });
  await page.screenshot({ path: 'C:/Users/Sourav/.gemini/antigravity/brain/e398a586-37c6-4491-aae1-778d0bff3a19/qa-page-gallery.png' });
  
  // Visit #about
  console.log('Navigating to #about...');
  await page.goto('https://greenwood-cafe-narela.netlify.app/#about', { waitUntil: 'networkidle2' });
  await page.screenshot({ path: 'C:/Users/Sourav/.gemini/antigravity/brain/e398a586-37c6-4491-aae1-778d0bff3a19/qa-page-about.png' });

  await browser.close();
  console.log('Screenshots captured!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
