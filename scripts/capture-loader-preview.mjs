import puppeteer from 'puppeteer';

async function main() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 412, height: 915, isMobile: true, hasTouch: true });
  
  // Set up an isolated HTML page that renders the exact LogoLoader component and CSS
  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <head>
        <link rel="stylesheet" href="https://greenwood-cafe-narela.netlify.app/assets/index-bQeZjx-C.css">
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,400&family=Inter:wght@500;600&display=swap" rel="stylesheet">
        <style>
          body {
            margin: 0;
            background-color: #FAF6EE;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            font-family: 'Inter', sans-serif;
          }
        </style>
      </head>
      <body>
        <div class="flex flex-col items-center justify-center p-6 text-center select-none">
          <div class="relative group">
            <!-- Breathing Golden Radial Aura -->
            <div class="absolute -inset-4 rounded-full bg-gradient-to-r from-[#C9A45C]/30 via-[#E8D094]/40 to-[#C9A45C]/30 blur-xl opacity-75 animate-pulse"></div>

            <!-- Logo Container with Rounded Gold Rim -->
            <div class="relative w-28 h-28 rounded-3xl overflow-hidden shadow-2xl border border-[#C9A45C]/60 bg-[#0F2418] flex items-center justify-center" style="box-shadow: 0 8px 32px -4px rgba(18, 43, 30, 0.5), 0 0 24px rgba(201, 164, 92, 0.4);">
              <img src="https://greenwood-cafe-narela.netlify.app/greenwood-leaf-gold.png" alt="Greenwood Café Logo" class="w-full h-full object-cover" />
              <!-- Golden Specular Shine Sweep Effect -->
              <div class="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
                <div class="absolute top-0 bottom-0 w-[60%] -left-[60%] animate-logo-shine" style="background: linear-gradient(105deg, transparent 0%, rgba(255, 255, 255, 0.1) 20%, rgba(255, 255, 255, 0.95) 50%, rgba(235, 205, 130, 0.8) 65%, transparent 100%); filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.8));"></div>
              </div>
              <!-- Top-Right Glint Sparkle -->
              <div class="absolute top-2 right-2 w-3 h-3 pointer-events-none animate-twinkle">
                <svg viewBox="0 0 24 24" fill="#FFF8E7" class="w-full h-full drop-shadow-[0_0_4px_#C9A45C]"><polygon points="12,0 15,9 24,12 15,15 12,24 9,15 0,12 9,9"/></svg>
              </div>
              <!-- Bottom-Left Glint Sparkle -->
              <div class="absolute bottom-2 left-2 w-2.5 h-2.5 pointer-events-none animate-twinkle" style="animation-delay: 0.8s;">
                <svg viewBox="0 0 24 24" fill="#FFF8E7" class="w-full h-full drop-shadow-[0_0_3px_#C9A45C]"><polygon points="12,0 15,9 24,12 15,15 12,24 9,15 0,12 9,9"/></svg>
              </div>
            </div>
          </div>

          <!-- Brand Text & Shimmering Subtitle -->
          <div class="mt-6 flex flex-col items-center">
            <span class="font-serif text-base font-bold tracking-[0.25em] text-[#163E26] uppercase">Greenwood Café</span>
            <span class="font-serif italic text-xs text-[#8F5D2C] mt-0.5">Good Food. Greener Moods.</span>
            <!-- Elegant Animated Gold Dots Progress Bar -->
            <div class="flex items-center gap-1.5 mt-3">
              <span class="w-1.5 h-1.5 rounded-full bg-[#C9A45C] animate-bounce" style="animation-delay: 0s; animation-duration: 1s;"></span>
              <span class="w-1.5 h-1.5 rounded-full bg-[#163E26] animate-bounce" style="animation-delay: 0.2s; animation-duration: 1s;"></span>
              <span class="w-1.5 h-1.5 rounded-full bg-[#C9A45C] animate-bounce" style="animation-delay: 0.4s; animation-duration: 1s;"></span>
            </div>
          </div>
        </div>
      </body>
    </html>
  `);

  await new Promise(r => setTimeout(r, 1200));

  await page.screenshot({
    path: 'C:/Users/Sourav/.gemini/antigravity/brain/e398a586-37c6-4491-aae1-778d0bff3a19/qa-logo-loader-preview.png'
  });

  console.log('Loader preview captured!');
  await browser.close();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
