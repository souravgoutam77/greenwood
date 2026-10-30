import puppeteer from 'puppeteer';

async function main() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 412, height: 915, isMobile: true, hasTouch: true });
  
  console.log('Navigating to Netlify...');
  await page.goto('https://greenwood-cafe-narela.netlify.app', { waitUntil: 'networkidle2', timeout: 30000 });
  
  // Scroll down to the gallery section
  await page.evaluate(() => {
    const el = document.getElementById('gallery');
    if (el) {
      el.scrollIntoView({ behavior: 'instant', block: 'start' });
    }
  });

  await new Promise(r => setTimeout(r, 1500));

  const textContent = await page.evaluate(() => {
    const section = document.getElementById('gallery');
    return section ? section.innerText : '';
  });

  console.log('Section innerText snippet:\n', textContent.substring(0, 500));

  // Take screenshot of the gallery on mobile
  await page.screenshot({
    path: 'C:/Users/Sourav/.gemini/antigravity/brain/e398a586-37c6-4491-aae1-778d0bff3a19/qa-gallery-clean-mobile.png',
    fullPage: false
  });

  // Click on the first image to test single-photo lightbox
  await page.evaluate(() => {
    const firstImg = document.querySelector('#gallery img');
    if (firstImg) {
      firstImg.parentElement.click();
    }
  });

  await new Promise(r => setTimeout(r, 1200));

  // Take screenshot of lightbox modal
  await page.screenshot({
    path: 'C:/Users/Sourav/.gemini/antigravity/brain/e398a586-37c6-4491-aae1-778d0bff3a19/qa-lightbox-modal.png',
    fullPage: false
  });

  await browser.close();
  console.log('QA completed successfully!');
}

main().catch(err => {
  console.error('Error in QA script:', err);
  process.exit(1);
});
