import puppeteer from 'puppeteer';

async function checkLive() {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844 });
  await page.goto('https://greenwood-cafe-narela.web.app/#home', { waitUntil: 'networkidle2' });
  const text = await page.evaluate(() => document.body.innerText);
  console.log('Does live homepage contain "Store Closed" text?', text.includes('Store Closed'));
  await browser.close();
  console.log('Verified on live production domain!');
}

checkLive().catch(console.error);
