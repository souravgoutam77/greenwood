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
        <style>
          body {
            margin: 0;
            background-color: #FAF6EE;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            font-family: 'Playfair Display', Georgia, serif;
          }

          /* Option 1: Elegant Botanical Golden Leaf (Patti) with Masked Shine */
          .leaf-container {
            position: relative;
            width: 110px;
            height: 110px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .gold-leaf-svg {
            width: 100%;
            height: 100%;
            filter: drop-shadow(0 8px 16px rgba(201, 164, 92, 0.45));
            animation: leaf-breathe 2.8s ease-in-out infinite;
          }

          @keyframes leaf-breathe {
            0%, 100% {
              transform: translateY(0px) scale(1) rotate(0deg);
              filter: drop-shadow(0 6px 12px rgba(201, 164, 92, 0.4));
            }
            50% {
              transform: translateY(-6px) scale(1.04) rotate(-1deg);
              filter: drop-shadow(0 12px 24px rgba(201, 164, 92, 0.65));
            }
          }

          /* Masked Specular Light Sweep across the Leaf */
          .shine-sweep-overlay {
            position: absolute;
            inset: 0;
            pointer-events: none;
            overflow: hidden;
            mask-image: url('data:image/svg+xml;utf8,<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M18 82 C18 82 24 50 48 26 C72 2 92 2 92 2 C92 2 88 26 66 50 C44 74 18 82 18 82 Z" fill="black"/></svg>');
            -webkit-mask-image: url('data:image/svg+xml;utf8,<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M18 82 C18 82 24 50 48 26 C72 2 92 2 92 2 C92 2 88 26 66 50 C44 74 18 82 18 82 Z" fill="black"/></svg>');
            mask-size: contain;
            -webkit-mask-size: contain;
            mask-repeat: no-repeat;
            -webkit-mask-repeat: no-repeat;
            mask-position: center;
            -webkit-mask-position: center;
          }

          .shine-beam {
            position: absolute;
            top: -20%;
            bottom: -20%;
            width: 45%;
            left: -50%;
            background: linear-gradient(
              110deg,
              transparent 0%,
              rgba(255, 255, 255, 0.2) 25%,
              rgba(255, 255, 255, 0.95) 50%,
              rgba(255, 235, 170, 0.8) 70%,
              transparent 100%
            );
            filter: drop-shadow(0 0 6px rgba(255, 255, 255, 0.9));
            animation: shine-sweep 2.8s cubic-bezier(0.25, 1, 0.5, 1) infinite;
          }

          @keyframes shine-sweep {
            0% {
              transform: translateX(-140%) skewX(-20deg);
              opacity: 0;
            }
            15% {
              opacity: 1;
            }
            50% {
              transform: translateX(360%) skewX(-20deg);
              opacity: 1;
            }
            55%, 100% {
              transform: translateX(360%) skewX(-20deg);
              opacity: 0;
            }
          }

          /* Star twinkle at leaf tip */
          .sparkle-tip {
            position: absolute;
            top: 2px;
            right: 6px;
            width: 14px;
            height: 14px;
            animation: twinkle 2.8s ease-in-out infinite;
          }

          @keyframes twinkle {
            0%, 40% {
              transform: scale(0) rotate(0deg);
              opacity: 0;
            }
            52% {
              transform: scale(1.3) rotate(45deg);
              opacity: 1;
            }
            65%, 100% {
              transform: scale(0) rotate(90deg);
              opacity: 0;
            }
          }

          .brand-title {
            margin-top: 22px;
            font-size: 15px;
            font-weight: 700;
            letter-spacing: 0.28em;
            color: #163E26;
            text-transform: uppercase;
          }

          .brand-subtitle {
            font-style: italic;
            font-size: 12px;
            color: #8F5D2C;
            margin-top: 3px;
          }

          .dots-progress {
            display: flex;
            gap: 6px;
            margin-top: 14px;
          }

          .dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: #C9A45C;
            animation: dot-pulse 1.2s infinite ease-in-out;
          }
          .dot:nth-child(2) {
            background: #163E26;
            animation-delay: 0.2s;
          }
          .dot:nth-child(3) {
            animation-delay: 0.4s;
          }

          @keyframes dot-pulse {
            0%, 80%, 100% { transform: scale(0.7); opacity: 0.4; }
            40% { transform: scale(1.2); opacity: 1; }
          }
        </style>
      </head>
      <body>
        <div class="leaf-container">
          <!-- Standalone Golden Leaf SVG (Pure Patti, No Box) -->
          <svg class="gold-leaf-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="goldGradFull" x1="15%" y1="85%" x2="85%" y2="15%">
                <stop offset="0%" stop-color="#8C5E1A" />
                <stop offset="25%" stop-color="#C9A45C" />
                <stop offset="45%" stop-color="#FFF0BE" />
                <stop offset="60%" stop-color="#DEB760" />
                <stop offset="85%" stop-color="#FCEAB0" />
                <stop offset="100%" stop-color="#9E6F22" />
              </linearGradient>

              <linearGradient id="veinGrad" x1="15%" y1="85%" x2="85%" y2="15%">
                <stop offset="0%" stop-color="#6E440D" />
                <stop offset="50%" stop-color="#94671F" />
                <stop offset="100%" stop-color="#6E440D" />
              </linearGradient>

              <!-- Radial glow backdrop -->
              <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            <!-- Soft background shadow path -->
            <path
              d="M18 82 C18 82 24 50 48 26 C72 2 92 2 92 2 C92 2 88 26 66 50 C44 74 18 82 18 82 Z"
              fill="rgba(201, 164, 92, 0.25)"
              transform="translate(0, 3)"
            />

            <!-- Main Golden Leaf Body -->
            <path
              d="M18 82 C18 82 24 50 48 26 C72 2 92 2 92 2 C92 2 88 26 66 50 C44 74 18 82 18 82 Z"
              fill="url(#goldGradFull)"
              stroke="#B3893C"
              stroke-width="1.2"
              stroke-linejoin="round"
            />

            <!-- Delicate Veins inside the Leaf -->
            <!-- Main Central Spine -->
            <path d="M18 82 C34 66 52 44 92 2" stroke="url(#veinGrad)" stroke-width="1.8" stroke-linecap="round" fill="none" />

            <!-- Right Branch Veins -->
            <path d="M34 66 C44 64 54 58 63 50" stroke="url(#veinGrad)" stroke-width="1.2" stroke-linecap="round" fill="none" />
            <path d="M47 52 C56 50 64 44 72 35" stroke="url(#veinGrad)" stroke-width="1.2" stroke-linecap="round" fill="none" />
            <path d="M60 38 C68 36 75 30 81 21" stroke="url(#veinGrad)" stroke-width="1.1" stroke-linecap="round" fill="none" />
            <path d="M73 24 C79 22 84 17 88 10" stroke="url(#veinGrad)" stroke-width="1" stroke-linecap="round" fill="none" />

            <!-- Left Branch Veins -->
            <path d="M38 48 C32 44 28 38 27 32" stroke="url(#veinGrad)" stroke-width="1.2" stroke-linecap="round" fill="none" />
            <path d="M51 34 C45 30 40 24 39 18" stroke="url(#veinGrad)" stroke-width="1.2" stroke-linecap="round" fill="none" />
            <path d="M64 21 C59 17 54 12 52 7" stroke="url(#veinGrad)" stroke-width="1.1" stroke-linecap="round" fill="none" />
          </svg>

          <!-- Specular Light Sweep (Shining effect) -->
          <div class="shine-sweep-overlay">
            <div class="shine-beam"></div>
          </div>

          <!-- Sparkle Star at Tip -->
          <div class="sparkle-tip">
            <svg viewBox="0 0 24 24" fill="#FFF9E6" style="filter: drop-shadow(0 0 4px #C9A45C); width: 100%; height: 100%;">
              <polygon points="12,0 15,9 24,12 15,15 12,24 9,15 0,12 9,9" />
            </svg>
          </div>
        </div>

        <div class="brand-title">Greenwood Café</div>
        <div class="brand-subtitle">Good Food. Greener Moods.</div>
        <div class="dots-progress">
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
        </div>
      </body>
    </html>
  `;

  await page.setContent(html);
  await new Promise(r => setTimeout(r, 1200));

  await page.screenshot({
    path: 'C:/Users/Sourav/.gemini/antigravity/brain/e398a586-37c6-4491-aae1-778d0bff3a19/qa-golden-patti-loader.png'
  });

  console.log('Golden patti screenshot saved!');
  await browser.close();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
