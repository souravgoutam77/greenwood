import fs from 'fs';

// 1. Update src/App.tsx
let appTsx = fs.readFileSync('src/App.tsx', 'utf8');

if (!appTsx.includes('LogoLoader')) {
  appTsx = "import { LogoLoader } from './components/LogoLoader';\n" + appTsx;
  appTsx = appTsx.replace(
    /<React\.Suspense fallback=\{<div className="min-h-\[50vh\][^>]*>[\s\S]*?<\/div>\}>/,
    '<React.Suspense fallback={<LogoLoader />}>'
  );
  fs.writeFileSync('src/App.tsx', appTsx, 'utf8');
  console.log('Added LogoLoader to src/App.tsx');
}

// 2. Update index.html
const indexHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/png" href="/greenwood-leaf-gold.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Greenwood Café &amp; Restaurant — 100% Pure Veg Fine Dine, Narela, Delhi</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Inter:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,400;1,600&display=swap" rel="stylesheet">
    <style>
      @keyframes init-logo-shine {
        0% { transform: translateX(-160%) skewX(-25deg); opacity: 0; }
        10% { opacity: 1; }
        45% { transform: translateX(300%) skewX(-25deg); opacity: 1; }
        50%, 100% { transform: translateX(300%) skewX(-25deg); opacity: 0; }
      }
      .initial-logo-shine {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 60%;
        left: -60%;
        background: linear-gradient(105deg, transparent 0%, rgba(255, 255, 255, 0.1) 20%, rgba(255, 255, 255, 0.95) 50%, rgba(235, 205, 130, 0.8) 65%, transparent 100%);
        filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.8));
        animation: init-logo-shine 2.6s cubic-bezier(0.25, 1, 0.5, 1) infinite;
      }
    </style>
  </head>
  <body class="bg-[#FAF6EE] text-[#4B5149] antialiased selection:bg-[#163E26] selection:text-[#FAF6EE]">
    <div id="root">
      <div style="min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; background-color: #FAF6EE; padding: 1.5rem; text-align: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <div style="position: relative; width: 104px; height: 104px; border-radius: 1.5rem; overflow: hidden; box-shadow: 0 8px 32px -4px rgba(18, 43, 30, 0.4), 0 0 24px rgba(201, 164, 92, 0.4); border: 1px solid rgba(201, 164, 92, 0.6); background: #0F2418; display: flex; align-items: center; justify-content: center;">
          <img src="/greenwood-leaf-gold.png" alt="Greenwood Logo" style="width: 100%; height: 100%; object-fit: cover;" />
          <div style="position: absolute; inset: 0; pointer-events: none; overflow: hidden;">
            <div class="initial-logo-shine"></div>
          </div>
        </div>
        <div style="margin-top: 1.5rem;">
          <div style="font-family: serif; font-size: 15px; font-weight: 700; letter-spacing: 0.25em; color: #163E26; text-transform: uppercase;">Greenwood Café</div>
          <div style="font-style: italic; font-size: 12px; color: #8F5D2C; margin-top: 2px;">Good Food. Greener Moods.</div>
        </div>
      </div>
    </div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`;

fs.writeFileSync('index.html', indexHtml, 'utf8');
console.log('Updated index.html with initial logo loader');
