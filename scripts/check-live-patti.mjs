import puppeteer from 'puppeteer';

async function main() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 412, height: 915, isMobile: true, hasTouch: true });
  
  console.log('Navigating to live Netlify...');
  await page.goto('https://greenwood-cafe-narela.netlify.app', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 600));

  await page.screenshot({
    path: 'C:/Users/Sourav/.gemini/antigravity/brain/e398a586-37c6-4491-aae1-778d0bff3a19/qa-live-golden-patti-loader.png'
  });

  console.log('Live screenshot saved!');
  await browser.close();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
