import fs from 'fs';

async function fetchTab(category) {
  const url = `https://www.zomato.com/ncr/greenwood-cafe-4-narela-new-delhi/photos?category=${category}`;
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  });
  const html = await res.text();
  const matches = [...new Set(html.match(/https:\/\/b\.zmtcdn\.com\/data\/[^\s"'<>\\]+\.(?:jpg|jpeg|png|webp)/gi) || [])];
  console.log(`Category ${category}: found ${matches.length} image URLs`);
  return matches;
}

async function run() {
  const all = await fetchTab('all');
  const food = await fetchTab('food');
  const ambience = await fetchTab('ambience');
  const combined = [...new Set([...all, ...food, ...ambience])];
  console.log(`Total unique Zomato CDN images found: ${combined.length}`);
  fs.writeFileSync('scripts/all-zomato-images.json', JSON.stringify(combined, null, 2));
}

run();
