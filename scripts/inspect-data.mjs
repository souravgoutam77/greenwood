import fs from 'fs';

function findJSON(html, filename) {
  console.log(`\n--- Inspecting ${filename} ---`);
  // Look for JSON.parse("...") or window.__PRELOADED_STATE__
  const preloadedMatch = html.match(/window\.__PRELOADED_STATE__\s*=\s*JSON\.parse\((["'])(.*?)\1\);/);
  if (preloadedMatch) {
    console.log('Found window.__PRELOADED_STATE__ with JSON.parse');
    try {
      const parsedStr = JSON.parse(preloadedMatch[1] + preloadedMatch[2] + preloadedMatch[1]);
      const data = JSON.parse(parsedStr);
      console.log('Parsed successfully! Keys:', Object.keys(data));
      return data;
    } catch (e) {
      console.log('JSON parse error 1:', e.message);
    }
  }

  // Look for other patterns like <script>window.__PRELOADED_STATE__ = { ... }
  const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  let idx = 0;
  while ((match = scriptRegex.exec(html)) !== null) {
    idx++;
    const content = match[1].trim();
    if (content.includes('PRELOADED_STATE')) {
      console.log(`Script ${idx} contains PRELOADED_STATE, length:`, content.length);
      // Let's see how PRELOADED_STATE is assigned
      const sub = content.slice(0, 200);
      console.log('Snippet:', sub);

      // Check if JSON.parse is used: JSON.parse("...")
      const jp = content.match(/JSON\.parse\((["'])([\s\S]*?)\1\);/);
      if (jp) {
        console.log('Found JSON.parse pattern, inner length:', jp[2].length);
        try {
          // Unescape JS string
          const unescaped = JSON.parse(jp[0].replace(/^JSON\.parse\(/, '').replace(/\);?$/, ''));
          const finalObj = JSON.parse(unescaped);
          console.log('Successfully extracted JSON! Top level keys:', Object.keys(finalObj));
          return finalObj;
        } catch (err) {
          console.log('Error parsing JSON.parse string:', err.message);
        }
      }
    }
  }
}

const orderHtml = fs.readFileSync('scripts/zomato-order.html', 'utf-8');
const orderData = findJSON(orderHtml, 'order.html');
if (orderData) {
  fs.writeFileSync('scripts/parsed-order-data.json', JSON.stringify(orderData, null, 2), 'utf-8');
  console.log('Saved parsed-order-data.json, size:', JSON.stringify(orderData).length);
}

const overviewHtml = fs.readFileSync('scripts/zomato-overview.html', 'utf-8');
const overviewData = findJSON(overviewHtml, 'overview.html');
if (overviewData) {
  fs.writeFileSync('scripts/parsed-overview-data.json', JSON.stringify(overviewData, null, 2), 'utf-8');
  console.log('Saved parsed-overview-data.json, size:', JSON.stringify(overviewData).length);
}

const photosHtml = fs.readFileSync('scripts/zomato-photos.html', 'utf-8');
const photosData = findJSON(photosHtml, 'photos.html');
if (photosData) {
  fs.writeFileSync('scripts/parsed-photos-data.json', JSON.stringify(photosData, null, 2), 'utf-8');
  console.log('Saved parsed-photos-data.json, size:', JSON.stringify(photosData).length);
}
