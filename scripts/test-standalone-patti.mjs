import puppeteer from 'puppeteer';

async function main() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 412, height: 915 });

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,400&family=Inter:wght@500;600&display=swap" rel="stylesheet">
        <style>
          body {
            margin: 0;
            background-color: #FAF6EE;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            font-family: 'Inter', sans-serif;
            overflow: hidden;
          }

          /* Standalone Golden Leaf Loader (Pure Golden Patti) */
          .loader-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            user-select: none;
          }

          .leaf-glow-aura {
            position: absolute;
            width: 130px;
            height: 160px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(201, 164, 92, 0.35) 0%, rgba(201, 164, 92, 0.1) 50%, transparent 70%);
            filter: blur(16px);
            animation: aura-pulse 2.6s ease-in-out infinite;
          }

          @keyframes aura-pulse {
            0%, 100% { transform: scale(0.95); opacity: 0.5; }
            50% { transform: scale(1.15); opacity: 0.85; }
          }

          .leaf-wrapper {
            position: relative;
            width: 105px;
            height: 135px;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: leaf-float 2.6s ease-in-out infinite;
          }

          @keyframes leaf-float {
            0%, 100% {
              transform: translateY(0px) rotate(0deg);
              filter: drop-shadow(0 8px 16px rgba(180, 135, 45, 0.4));
            }
            50% {
              transform: translateY(-6px) rotate(-1.5deg);
              filter: drop-shadow(0 14px 24px rgba(201, 164, 92, 0.6));
            }
          }

          .golden-leaf-svg {
            width: 100%;
            height: 100%;
            display: block;
          }

          /* Masked Specular Light Sweep (The Shine) */
          .leaf-shine-mask {
            position: absolute;
            inset: 0;
            pointer-events: none;
            overflow: hidden;
            mask-image: url('data:image/svg+xml;utf8,<svg viewBox="0 0 100 130" xmlns="http://www.w3.org/2000/svg"><path d="M50 124 C49 122 48 116 50 114 C36 98 18 78 20 50 C22 22 44 8 52 6 C58 18 78 38 76 66 C74 92 56 110 50 114 C48 118 47 122 50 124 Z" fill="black"/></svg>');
            -webkit-mask-image: url('data:image/svg+xml;utf8,<svg viewBox="0 0 100 130" xmlns="http://www.w3.org/2000/svg"><path d="M50 124 C49 122 48 116 50 114 C36 98 18 78 20 50 C22 22 44 8 52 6 C58 18 78 38 76 66 C74 92 56 110 50 114 C48 118 47 122 50 124 Z" fill="black"/></svg>');
            mask-size: contain;
            -webkit-mask-size: contain;
            mask-repeat: no-repeat;
            -webkit-mask-repeat: no-repeat;
            mask-position: center;
            -webkit-mask-position: center;
          }

          .shine-beam-band {
            position: absolute;
            top: -20%;
            bottom: -20%;
            width: 50%;
            left: -60%;
            background: linear-gradient(
              105deg,
              transparent 0%,
              rgba(255, 255, 255, 0.15) 20%,
              rgba(255, 255, 255, 0.95) 50%,
              rgba(255, 235, 175, 0.85) 65%,
              transparent 100%
            );
            filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.9));
            animation: shine-sweep-anim 2.6s cubic-bezier(0.25, 1, 0.5, 1) infinite;
          }

          @keyframes shine-sweep-anim {
            0% {
              transform: translateX(-150%) skewX(-20deg);
              opacity: 0;
            }
            12% {
              opacity: 1;
            }
            45% {
              transform: translateX(340%) skewX(-20deg);
              opacity: 1;
            }
            50%, 100% {
              transform: translateX(340%) skewX(-20deg);
              opacity: 0;
            }
          }

          /* Diamond sparkle at leaf tip */
          .sparkle-diamond {
            position: absolute;
            top: 2px;
            right: 18px;
            width: 14px;
            height: 14px;
            animation: sparkle-anim 2.6s ease-in-out infinite;
          }

          @keyframes sparkle-anim {
            0%, 35% {
              transform: scale(0) rotate(0deg);
              opacity: 0;
            }
            48% {
              transform: scale(1.3) rotate(45deg);
              opacity: 1;
            }
            60%, 100% {
              transform: scale(0) rotate(90deg);
              opacity: 0;
            }
          }

          .brand-title {
            margin-top: 24px;
            font-family: 'Playfair Display', Georgia, serif;
            font-size: 16px;
            font-weight: 700;
            letter-spacing: 0.26em;
            color: #163E26;
            text-transform: uppercase;
          }

          .brand-tagline {
            font-family: 'Playfair Display', Georgia, serif;
            font-style: italic;
            font-size: 12px;
            color: #8F5D2C;
            margin-top: 3px;
          }

          .progress-beads {
            display: flex;
            align-items: center;
            gap: 6px;
            margin-top: 14px;
          }

          .bead {
            width: 5px;
            height: 5px;
            border-radius: 50%;
            background: #C9A45C;
            animation: bead-pulse 1.1s infinite ease-in-out;
          }
          .bead:nth-child(2) {
            background: #163E26;
            animation-delay: 0.2s;
          }
          .bead:nth-child(3) {
            animation-delay: 0.4s;
          }

          @keyframes bead-pulse {
            0%, 80%, 100% { transform: scale(0.7); opacity: 0.35; }
            40% { transform: scale(1.3); opacity: 1; }
          }
        </style>
      </head>
      <body>
        <div class="loader-container">
          <div class="leaf-glow-aura"></div>
          
          <div class="leaf-wrapper">
            <!-- Standalone Golden Leaf SVG (Pure Patti, No Box) -->
            <svg class="golden-leaf-svg" viewBox="0 0 100 130" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="pattiGold" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stop-color="#875B16" />
                  <stop offset="20%" stop-color="#C9A45C" />
                  <stop offset="42%" stop-color="#FFF2BF" />
                  <stop offset="60%" stop-color="#DEB75B" />
                  <stop offset="85%" stop-color="#FFE8A3" />
                  <stop offset="100%" stop-color="#94671D" />
                </linearGradient>

                <linearGradient id="pattiSpine" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stop-color="#6E440D" />
                  <stop offset="50%" stop-color="#8F6118" />
                  <stop offset="100%" stop-color="#6E440D" />
                </linearGradient>

                <filter id="pattiShadow" x="-15%" y="-15%" width="130%" height="130%">
                  <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="rgba(160, 115, 30, 0.45)" />
                </filter>
              </defs>

              <!-- Leaf Stem Base -->
              <path d="M50 114 C48 118 47 122 50 126" stroke="url(#pattiSpine)" stroke-width="2.2" stroke-linecap="round" fill="none" />

              <!-- Leaf Main Body -->
              <path
                d="M50 114 C36 98 18 78 20 50 C22 22 44 8 52 6 C58 18 78 38 76 66 C74 92 56 110 50 114 Z"
                fill="url(#pattiGold)"
                stroke="#C9A45C"
                stroke-width="1.2"
                stroke-linejoin="round"
                filter="url(#pattiShadow)"
              />

              <!-- Center Spine -->
              <path d="M50 114 C48 88 47 52 52 6" stroke="url(#pattiSpine)" stroke-width="2" stroke-linecap="round" fill="none" />

              <!-- Left Branch Veins -->
              <path d="M49 94 C41 90 34 82 30 74" stroke="url(#pattiSpine)" stroke-width="1.2" stroke-linecap="round" fill="none" />
              <path d="M48 76 C39 70 33 62 29 52" stroke="url(#pattiSpine)" stroke-width="1.2" stroke-linecap="round" fill="none" />
              <path d="M48 58 C41 52 36 43 35 34" stroke="url(#pattiSpine)" stroke-width="1.1" stroke-linecap="round" fill="none" />
              <path d="M49 41 C44 35 42 27 43 20" stroke="url(#pattiSpine)" stroke-width="1" stroke-linecap="round" fill="none" />

              <!-- Right Branch Veins -->
              <path d="M50 92 C58 88 64 80 66 72" stroke="url(#pattiSpine)" stroke-width="1.2" stroke-linecap="round" fill="none" />
              <path d="M49 74 C58 68 64 60 66 50" stroke="url(#pattiSpine)" stroke-width="1.2" stroke-linecap="round" fill="none" />
              <path d="M49 56 C57 50 62 41 62 31" stroke="url(#pattiSpine)" stroke-width="1.1" stroke-linecap="round" fill="none" />
              <path d="M50 39 C56 33 58 25 57 18" stroke="url(#pattiSpine)" stroke-width="1" stroke-linecap="round" fill="none" />
            </svg>

            <!-- Light Sweep (Shine Effect) Masked to Leaf Silhouette -->
            <div class="leaf-shine-mask">
              <div class="shine-beam-band"></div>
            </div>

            <!-- Sparkle Diamond at Tip -->
            <div class="sparkle-diamond">
              <svg viewBox="0 0 24 24" fill="#FFF9E6" style="filter: drop-shadow(0 0 5px #FFD700); width: 100%; height: 100%;">
                <polygon points="12,0 15,9 24,12 15,15 12,24 9,15 0,12 9,9" />
              </svg>
            </div>
          </div>

          <div class="brand-title">Greenwood Café</div>
          <div class="brand-tagline">Good Food. Greener Moods.</div>
          
          <div class="progress-beads">
            <div class="bead"></div>
            <div class="bead"></div>
            <div class="bead"></div>
          </div>
        </div>
      </body>
    </html>
  `;

  await page.setContent(html);
  await new Promise(r => setTimeout(r, 1100));

  await page.screenshot({
    path: 'C:/Users/Sourav/.gemini/antigravity/brain/e398a586-37c6-4491-aae1-778d0bff3a19/qa-standalone-golden-patti.png'
  });

  console.log('Standalone golden patti screenshot captured!');
  await browser.close();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
