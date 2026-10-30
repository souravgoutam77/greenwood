import puppeteer from 'puppeteer';

async function main() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 412, height: 915, isMobile: true, hasTouch: true });
  
  // Intercept and delay scripts briefly to capture the pre-rendered initial shine loader
  console.log('Navigating to Netlify...');
  await page.goto('https://greenwood-cafe-narela.netlify.app', { waitUntil: 'domcontentloaded' });
  
  // Wait a fraction of a second to let the shine animation sweep
  await new Promise(r => setTimeout(r, 600));

  await page.screenshot({
    path: 'C:/Users/Sourav/.gemini/antigravity/brain/e398a586-37c6-4491-aae1-778d0bff3a19/qa-logo-shining-loader.png'
  });

  console.log('Screenshot saved!');
  await browser.close();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
