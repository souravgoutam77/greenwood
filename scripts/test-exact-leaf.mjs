import puppeteer from 'puppeteer';
import fs from 'fs';

async function main() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 412, height: 915 });

  const logoBase64 = fs.readFileSync('public/greenwood-leaf-gold.png').toString('base64');
  const logoDataUri = 'data:image/png;base64,' + logoBase64;

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

          .loader-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            user-select: none;
          }

          .leaf-glow-aura {
            position: absolute;
            width: 150px;
            height: 150px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(201, 164, 92, 0.45) 0%, rgba(201, 164, 92, 0.15) 50%, transparent 75%);
            filter: blur(22px);
            animation: aura-pulse 2.6s ease-in-out infinite;
          }

          @keyframes aura-pulse {
            0%, 100% { transform: scale(0.95); opacity: 0.5; }
            50% { transform: scale(1.2); opacity: 0.85; }
          }

          .leaf-wrapper {
            position: relative;
            width: 120px;
            height: 120px;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: leaf-float 2.6s ease-in-out infinite;
          }

          @keyframes leaf-float {
            0%, 100% {
              transform: translateY(0px) rotate(0deg);
            }
            50% {
              transform: translateY(-6px) rotate(-1deg);
            }
          }

          .logo-img-base {
            width: 100%;
            height: 100%;
            object-fit: contain;
            filter: drop-shadow(0 10px 22px rgba(190, 145, 50, 0.45));
          }

          /* Masked Specular Light Sweep (Runs precisely inside the logo strokes) */
          .logo-shine-mask {
            position: absolute;
            inset: 0;
            pointer-events: none;
            overflow: hidden;
            mask-image: url('${logoDataUri}');
            -webkit-mask-image: url('${logoDataUri}');
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
            width: 50%;
            left: -60%;
            background: linear-gradient(
              110deg,
              transparent 0%,
              rgba(255, 255, 255, 0.2) 20%,
              rgba(255, 255, 255, 0.98) 50%,
              rgba(255, 235, 175, 0.9) 65%,
              transparent 100%
            );
            filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.95));
            animation: shine-sweep-anim 2.5s cubic-bezier(0.25, 1, 0.5, 1) infinite;
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

          /* Sparkle at the top curve */
          .sparkle-point {
            position: absolute;
            top: 4px;
            right: 8px;
            width: 16px;
            height: 16px;
            animation: sparkle-anim 2.5s ease-in-out infinite;
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
            <img src="${logoDataUri}" alt="Greenwood Logo" class="logo-img-base" />
            
            <!-- Masked Specular Light Sweep Overlay -->
            <div class="logo-shine-mask">
              <div class="shine-beam"></div>
            </div>

            <!-- Star Sparkle -->
            <div class="sparkle-point">
              <svg viewBox="0 0 24 24" fill="#FFF9E6" style="filter: drop-shadow(0 0 6px #FFD700); width: 100%; height: 100%;">
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
    path: 'C:/Users/Sourav/.gemini/antigravity/brain/e398a586-37c6-4491-aae1-778d0bff3a19/qa-exact-gold-leaf-shine.png'
  });

  console.log('Screenshot of exact gold leaf with shine captured!');
  await browser.close();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
