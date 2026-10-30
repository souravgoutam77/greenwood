import puppeteer from 'puppeteer';

async function main() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 412, height: 915, isMobile: true, hasTouch: true });
  
  // 1. Check About Page
  console.log('Navigating to #about...');
  await page.goto('https://greenwood-cafe-narela.netlify.app/#about', { waitUntil: 'networkidle2' });
  await page.waitForSelector('h1', { timeout: 10000 });
  await new Promise(r => setTimeout(r, 1000));
  
  // Scroll to the Our Story food photo
  await page.evaluate(() => {
    window.scrollTo(0, 600);
  });
  await new Promise(r => setTimeout(r, 800));

  await page.screenshot({
    path: 'C:/Users/Sourav/.gemini/antigravity/brain/e398a586-37c6-4491-aae1-778d0bff3a19/qa-about-pure-veg-dish.png',
    fullPage: false
  });

  const aboutFoodImgSrc = await page.evaluate(() => {
    const imgs = Array.from(document.querySelectorAll('img'));
    const foodImg = imgs.find(img => img.alt && img.alt.includes('Paneer Butter Masala'));
    return foodImg ? foodImg.src : null;
  });
  console.log('About page food image src:', aboutFoodImgSrc);

  // 2. Check Contact Page
  console.log('Navigating to #contact...');
  await page.goto('https://greenwood-cafe-narela.netlify.app/#contact', { waitUntil: 'networkidle2' });
  await page.waitForSelector('h1', { timeout: 10000 });
  await new Promise(r => setTimeout(r, 1000));

  const contactText = await page.evaluate(() => document.body.innerText);
  console.log('Does Contact have "How to Reach Greenwood Café"?:', contactText.includes('How to Reach Greenwood Café'));
  console.log('Does Contact have "GT Karnal Road"?:', contactText.includes('GT Karnal Road'));

  // Scroll to bottom of Contact page
  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight);
  });
  await new Promise(r => setTimeout(r, 800));

  await page.screenshot({
    path: 'C:/Users/Sourav/.gemini/antigravity/brain/e398a586-37c6-4491-aae1-778d0bff3a19/qa-contact-bottom-clean.png',
    fullPage: false
  });

  await browser.close();
  console.log('QA completed successfully!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
