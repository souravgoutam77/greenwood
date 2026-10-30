import puppeteer from 'puppeteer';

async function verifyLiveSite() {
  console.log('🌐 Verifying Live Deployed Site with Admin Mobile View...');

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  
  // Set to mobile viewport (like user's device)
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });

  await page.goto('https://greenwood-cafe-narela.web.app/#admin', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));

  // If login form is present, fill and submit
  const input = await page.$('input[placeholder="Enter 10-digit mobile"]');
  if (input) {
    console.log('Logging in as Admin on mobile...');
    await page.type('input[placeholder="Enter 10-digit mobile"]', '8802325537');
    await page.click('button[type="submit"]');
    await new Promise(r => setTimeout(r, 2000));
  }

  // Click on "Menu Items" navigation button
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const menuBtn = btns.find(b => b.innerText.includes('Menu Items'));
    if (menuBtn) menuBtn.click();
  });
  await new Promise(r => setTimeout(r, 1500));

  // Inspect the mobile cards for Trending buttons and labels
  const filterPills = await page.$$eval('button', btns => 
    btns.map(b => b.innerText.trim()).filter(t => t.includes('Items') || t.includes('Trending') || t.includes('Stock'))
  );
  console.log('Live Mobile Filter Pills:', filterPills);

  const cardButtons = await page.$$eval('div.sm\\:hidden button', btns => 
    btns.map(b => b.innerText.trim()).filter(t => t.includes('Signature') || t.includes('Normal') || t.includes('Live'))
  );
  console.log('Live Mobile Dish Card Action Buttons (first 10):', cardButtons.slice(0, 10));

  // Take screenshot of mobile admin
  await page.screenshot({ path: 'C:/Users/Sourav/.gemini/antigravity/brain/e398a586-37c6-4491-aae1-778d0bff3a19/qa-live-deployed-admin-mobile.png' });
  console.log('📸 Captured qa-live-deployed-admin-mobile.png');

  // Verify Homepage Mobile View with Signature & Trending Slider
  await page.goto('https://greenwood-cafe-narela.web.app/#home', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: 'C:/Users/Sourav/.gemini/antigravity/brain/e398a586-37c6-4491-aae1-778d0bff3a19/qa-live-deployed-home-mobile.png' });
  console.log('📸 Captured qa-live-deployed-home-mobile.png');

  await browser.close();
  console.log('✅ All live mobile checks completed successfully!');
}

verifyLiveSite().catch(err => {
  console.error(err);
  process.exit(1);
});
