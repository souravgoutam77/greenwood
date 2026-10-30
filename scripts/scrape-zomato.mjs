import fs from 'fs';

async function main() {
  const url = 'https://www.zomato.com/ncr/greenwood-cafe-4-narela-new-delhi';
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9'
    }
  });

  const html = await res.text();
  fs.writeFileSync('scripts/zomato-overview.html', html, 'utf-8');
  console.log('Saved overview HTML, size:', html.length);

  // Check order online page
  const orderUrl = 'https://www.zomato.com/ncr/greenwood-cafe-4-narela-new-delhi/order';
  const orderRes = await fetch(orderUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9'
    }
  });
  const orderHtml = await orderRes.text();
  fs.writeFileSync('scripts/zomato-order.html', orderHtml, 'utf-8');
  console.log('Saved order HTML, size:', orderHtml.length);

  // Also check menu page
  const menuUrl = 'https://www.zomato.com/ncr/greenwood-cafe-4-narela-new-delhi/menu';
  const menuRes = await fetch(menuUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9'
    }
  });
  const menuHtml = await menuRes.text();
  fs.writeFileSync('scripts/zomato-menu.html', menuHtml, 'utf-8');
  console.log('Saved menu HTML, size:', menuHtml.length);

  // Also check photos page
  const photosUrl = 'https://www.zomato.com/ncr/greenwood-cafe-4-narela-new-delhi/photos';
  const photosRes = await fetch(photosUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9'
    }
  });
  const photosHtml = await photosRes.text();
  fs.writeFileSync('scripts/zomato-photos.html', photosHtml, 'utf-8');
  console.log('Saved photos HTML, size:', photosHtml.length);
}

main().catch(console.error);
