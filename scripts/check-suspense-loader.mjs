import puppeteer from 'puppeteer';

async function main() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 412, height: 915 });

  // Delay the JS chunk request to capture the loader
  await page.setRequestInterception(true);
  page.on('request', req => {
    if (req.url().includes('AboutPage')) {
      setTimeout(() => req.continue(), 2500);
    } else {
      req.continue();
    }
  });

  console.log('Navigating to Netlify home...');
  await page.goto('https://greenwood-cafe-narela.netlify.app', { waitUntil: 'networkidle2' });
  
  console.log('Clicking About Us in nav...');
  await page.evaluate(() => {
    window.location.hash = '#about';
  });

  await new Promise(r => setTimeout(r, 600));

  await page.screenshot({
    path: 'C:/Users/Sourav/.gemini/antigravity/brain/e398a586-37c6-4491-aae1-778d0bff3a19/qa-live-suspense-golden-patti.png'
  });

  console.log('Captured loader on live site!');
  await browser.close();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
