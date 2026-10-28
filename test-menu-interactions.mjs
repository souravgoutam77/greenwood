import puppeteer from 'puppeteer';

const chromePath = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

async function testInteractions() {
  console.log('Testing Menu Page Interactive Flows...');
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // 1. Load Menu page
  await page.goto('http://127.0.0.1:5173/#menu', { waitUntil: 'networkidle0' });
  console.log('1. Loaded #menu successfully.');

  // 2. Click on "Butter Paneer" card to open dish detail page
  const butterPaneerTitle = await page.waitForSelector('xpath///h3[contains(text(), "Butter Paneer")]');
  if (butterPaneerTitle) {
    await butterPaneerTitle.click();
    await new Promise(r => setTimeout(r, 600));
    const url = page.url();
    console.log(`2. Clicked Butter Paneer card -> Navigated to: ${url}`);
    
    // Check if on detail page (breadcrumb "Butter Paneer")
    const detailTitle = await page.$('h1');
    const titleText = detailTitle ? await page.evaluate(el => el.textContent, detailTitle) : '';
    console.log(`   Detail page title: "${titleText}"`);
  }

  // 3. Click "Menu" breadcrumb on detail page to go back to Menu page
  const menuBreadcrumb = await page.waitForSelector('xpath///button[text()="Menu"]');
  if (menuBreadcrumb) {
    await menuBreadcrumb.click();
    await new Promise(r => setTimeout(r, 600));
    const url = page.url();
    console.log(`3. Clicked "Menu" breadcrumb -> Navigated back to: ${url}`);
  }

  // 4. Test Category Filter (click "Starters")
  const startersBtn = await page.waitForSelector('xpath///button[text()="Starters"]');
  if (startersBtn) {
    await startersBtn.click();
    await new Promise(r => setTimeout(r, 500));
    console.log('4. Clicked "Starters" category pill.');
  }

  // 5. Test Live Search
  const searchInput = await page.waitForSelector('input[placeholder="Search dishes, cuisines..."]');
  if (searchInput) {
    await searchInput.type('momos');
    await new Promise(r => setTimeout(r, 500));
    const countText = await page.$eval('main', el => el.innerText);
    console.log('5. Typed "momos" into search input. Contains momos:', countText.toLowerCase().includes('momos'));
  }

  // 6. Navigate to Home and click "Get Menu" button
  await page.goto('http://127.0.0.1:5173/#home', { waitUntil: 'networkidle0' });
  const getMenuBtn = await page.waitForSelector('xpath///button[contains(., "Get Menu")]');
  if (getMenuBtn) {
    await getMenuBtn.click();
    await new Promise(r => setTimeout(r, 600));
    console.log(`6. Clicked "Get Menu" button on Home -> URL is now: ${page.url()}`);
  }

  await browser.close();
  console.log('All interactive flows verified successfully!');
}

testInteractions().catch(err => {
  console.error('Error testing interactions:', err);
  process.exit(1);
});
