import puppeteer from 'puppeteer';

async function main() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 800, height: 600 });

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            margin: 0;
            background-color: #FAF6EE;
            display: flex;
            align-items: center;
            justify-content: space-around;
            min-height: 100vh;
            font-family: sans-serif;
          }
          .card {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 20px;
          }
          svg {
            width: 120px;
            height: 140px;
            filter: drop-shadow(0 10px 18px rgba(180, 135, 45, 0.45));
          }
        </style>
      </head>
      <body>
        <!-- Design A: Graceful Botanical Leaf (S-curve, delicate veins) -->
        <div class="card">
          <h3>Design A: Curved Botanical Leaf</h3>
          <svg viewBox="0 0 100 130">
            <defs>
              <linearGradient id="goldA" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#91651B"/>
                <stop offset="25%" stop-color="#CFA755"/>
                <stop offset="50%" stop-color="#FFF3C4"/>
                <stop offset="70%" stop-color="#D4AA50"/>
                <stop offset="100%" stop-color="#9A6E20"/>
              </linearGradient>
              <linearGradient id="goldSpine" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#6B4409"/>
                <stop offset="50%" stop-color="#8F6118"/>
                <stop offset="100%" stop-color="#6B4409"/>
              </linearGradient>
            </defs>
            <!-- Leaf body -->
            <path d="M50 118 C38 102 20 80 22 52 C24 24 45 10 52 8 C58 20 78 40 76 68 C74 94 56 112 50 118 Z" fill="url(#goldA)" stroke="#B3893C" stroke-width="1.2"/>
            <!-- Center spine -->
            <path d="M50 118 C48 90 46 55 52 8" stroke="url(#goldSpine)" stroke-width="2" stroke-linecap="round" fill="none"/>
            <!-- Left veins -->
            <path d="M49 96 C40 92 34 84 31 76" stroke="url(#goldSpine)" stroke-width="1.2" stroke-linecap="round" fill="none"/>
            <path d="M48 78 C38 72 32 64 30 54" stroke="url(#goldSpine)" stroke-width="1.2" stroke-linecap="round" fill="none"/>
            <path d="M48 60 C40 54 36 44 35 34" stroke="url(#goldSpine)" stroke-width="1.1" stroke-linecap="round" fill="none"/>
            <path d="M49 42 C44 36 42 28 43 20" stroke="url(#goldSpine)" stroke-width="1" stroke-linecap="round" fill="none"/>
            <!-- Right veins -->
            <path d="M50 94 C58 90 64 82 66 74" stroke="url(#goldSpine)" stroke-width="1.2" stroke-linecap="round" fill="none"/>
            <path d="M49 76 C59 70 65 62 67 52" stroke="url(#goldSpine)" stroke-width="1.2" stroke-linecap="round" fill="none"/>
            <path d="M49 58 C57 52 63 42 63 32" stroke="url(#goldSpine)" stroke-width="1.1" stroke-linecap="round" fill="none"/>
            <path d="M50 40 C56 34 58 26 57 18" stroke="url(#goldSpine)" stroke-width="1" stroke-linecap="round" fill="none"/>
          </svg>
        </div>

        <!-- Design B: Slender Royal Olive/Tea Leaf -->
        <div class="card">
          <h3>Design B: Royal Slender Leaf</h3>
          <svg viewBox="0 0 100 130">
            <defs>
              <linearGradient id="goldB" x1="20%" y1="90%" x2="80%" y2="10%">
                <stop offset="0%" stop-color="#805512"/>
                <stop offset="20%" stop-color="#C9A45C"/>
                <stop offset="45%" stop-color="#FFF7D6"/>
                <stop offset="65%" stop-color="#DDAF4D"/>
                <stop offset="90%" stop-color="#FFEBB0"/>
                <stop offset="100%" stop-color="#8C5F18"/>
              </linearGradient>
            </defs>
            <path d="M50 120 C34 98 22 72 26 44 C29 20 45 8 50 6 C55 8 71 20 74 44 C78 72 66 98 50 120 Z" fill="url(#goldB)" stroke="#B3893C" stroke-width="1.2"/>
            <path d="M50 120 L50 6" stroke="#75480C" stroke-width="2" stroke-linecap="round"/>
            <path d="M50 100 C40 94 34 86 33 78" stroke="#75480C" stroke-width="1.2" stroke-linecap="round"/>
            <path d="M50 82 C38 75 32 66 31 56" stroke="#75480C" stroke-width="1.2" stroke-linecap="round"/>
            <path d="M50 64 C40 56 36 46 36 36" stroke="#75480C" stroke-width="1.1" stroke-linecap="round"/>
            <path d="M50 46 C43 38 42 29 43 20" stroke="#75480C" stroke-width="1" stroke-linecap="round"/>
            <path d="M50 100 C60 94 66 86 67 78" stroke="#75480C" stroke-width="1.2" stroke-linecap="round"/>
            <path d="M50 82 C62 75 68 66 69 56" stroke="#75480C" stroke-width="1.2" stroke-linecap="round"/>
            <path d="M50 64 C60 56 64 46 64 36" stroke="#75480C" stroke-width="1.1" stroke-linecap="round"/>
            <path d="M50 46 C57 38 58 29 57 20" stroke="#75480C" stroke-width="1" stroke-linecap="round"/>
          </svg>
        </div>

        <!-- Design C: Modern Minimalist Split Golden Leaf -->
        <div class="card">
          <h3>Design C: Modern Duo-Tone Golden Leaf</h3>
          <svg viewBox="0 0 100 130">
            <defs>
              <linearGradient id="goldCLeft" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#9C6F1F"/>
                <stop offset="40%" stop-color="#D9AE55"/>
                <stop offset="70%" stop-color="#FFF0B3"/>
                <stop offset="100%" stop-color="#B88A2D"/>
              </linearGradient>
              <linearGradient id="goldCRight" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#7A4D0F"/>
                <stop offset="50%" stop-color="#B58933"/>
                <stop offset="85%" stop-color="#E8C372"/>
                <stop offset="100%" stop-color="#94651A"/>
              </linearGradient>
            </defs>
            <!-- Left half -->
            <path d="M50 120 C32 98 22 72 26 44 C29 20 45 8 50 6 Z" fill="url(#goldCLeft)"/>
            <!-- Right half -->
            <path d="M50 120 C68 98 78 72 74 44 C71 20 55 8 50 6 Z" fill="url(#goldCRight)"/>
            <!-- Stem line -->
            <line x1="50" y1="124" x2="50" y2="6" stroke="#FFF7D6" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </div>
      </body>
    </html>
  `;

  await page.setContent(html);
  await page.screenshot({ path: 'C:/Users/Sourav/.gemini/antigravity/brain/e398a586-37c6-4491-aae1-778d0bff3a19/qa-leaf-options.png' });
  await browser.close();
  console.log('Options captured!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
