import puppeteer from 'puppeteer';
import path from 'path';

const ARTIFACT_DIR = 'C:/Users/Sourav/.gemini/antigravity/brain/e398a586-37c6-4491-aae1-778d0bff3a19';
const chromePath = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

async function runQA() {
  console.log('Launching browser to verify 8 improvements...');
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();

    // 1. Verify Price Font on Signature Dishes (Home page desktop)
    console.log('1. Checking home page prices and mobile footer...');
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
    await page.goto('http://127.0.0.1:5173/#home', { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 800));

    // Scroll to mobile footer
    await page.evaluate(() => {
      const footer = document.querySelector('footer');
      if (footer) footer.scrollIntoView();
    });
    await new Promise((r) => setTimeout(r, 500));
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'qa-mobile-footer-compact.png'),
    });

    // 2. Verify 3-line Hamburger Menu with WhatsApp
    console.log('2. Checking 3-line hamburger menu with WhatsApp...');
    await page.goto('http://127.0.0.1:5173/#home', { waitUntil: 'networkidle0' });
    await page.evaluate(() => window.scrollTo(0, 0));
    await new Promise((r) => setTimeout(r, 400));
    const hamburgerBtn = await page.$('button[aria-label="Toggle navigation menu"]');
    if (hamburgerBtn) {
      await hamburgerBtn.click();
      await new Promise((r) => setTimeout(r, 500));
      await page.screenshot({
        path: path.join(ARTIFACT_DIR, 'qa-mobile-menu-whatsapp.png'),
      });
    }

    // 3. Verify Contact Modal when clicking Contact from Menu page
    console.log('3. Checking Contact trigger from Menu page...');
    await page.goto('http://127.0.0.1:5173/#menu', { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 600));
    // Click hamburger on menu page
    const menuHamburger = await page.$('button[aria-label="Toggle navigation menu"]');
    if (menuHamburger) {
      await menuHamburger.click();
      await new Promise((r) => setTimeout(r, 400));
      // Click Contact link
      await page.evaluate(() => {
        const links = Array.from(document.querySelectorAll('a'));
        const contactLink = links.find((l) => l.textContent && l.textContent.trim() === 'Contact');
        if (contactLink) contactLink.click();
      });
      await new Promise((r) => setTimeout(r, 600));
      await page.screenshot({
        path: path.join(ARTIFACT_DIR, 'qa-contact-modal.png'),
      });
      // Close modal
      await page.evaluate(() => {
        const closeBtn = document.querySelector('button[aria-label="Close modal"]');
        if (closeBtn) closeBtn.click();
      });
      await new Promise((r) => setTimeout(r, 300));
    }

    // 4. Verify Legal Policy Modal (Terms, Refund, Privacy)
    console.log('4. Checking Legal Policy Modal...');
    await page.goto('http://127.0.0.1:5173/#terms', { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 800));
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'qa-policy-modal.png'),
    });

    // 5. Verify Profile Page without Dining Preferences and with compact Quick Actions
    console.log('5. Checking Profile Page (Desktop and Mobile)...');
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
    await page.goto('http://127.0.0.1:5173/#profile', { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 800));
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'qa-profile-cleaned-desktop.png'),
      fullPage: true,
    });

    // Mobile Profile Page
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
    await page.goto('http://127.0.0.1:5173/#profile', { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 800));
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'qa-profile-cleaned-mobile.png'),
      fullPage: true,
    });

    // 6. Verify Price font in Admin Dashboard
    console.log('6. Checking Admin Dashboard prices font...');
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
    await page.goto('http://127.0.0.1:5173/#admin', { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 800));
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'qa-admin-prices-font.png'),
    });

    console.log('All QA screenshots captured successfully!');
  } catch (err) {
    console.error('QA Test error:', err);
  } finally {
    await browser.close();
  }
}

runQA();
