import fs from 'fs';

const orderHtml = fs.readFileSync('scripts/zomato-order.html', 'utf-8');
const menuHtml = fs.readFileSync('scripts/zomato-menu.html', 'utf-8');
const overviewHtml = fs.readFileSync('scripts/zomato-overview.html', 'utf-8');
const photosHtml = fs.readFileSync('scripts/zomato-photos.html', 'utf-8');

const regex = /https:\/\/b\.zmtcdn\.com\/data\/[^\s"'<>\\]+\.(?:jpg|jpeg|png|webp)(?:\?[^\s"'<>\\]*)?/gi;

const allMatches = new Set();
for (const html of [orderHtml, menuHtml, overviewHtml, photosHtml]) {
  const matches = html.match(regex) || [];
  for (const m of matches) {
    allMatches.add(m);
  }
}

console.log('Total matches found across all Zomato pages:', allMatches.size);

// Group by type: dish_photos, menus, pictures, reviews_photos
const categorized = {
  dish_photos: [],
  menus: [],
  pictures: [],
  reviews_photos: [],
  others: []
};

for (const rawUrl of allMatches) {
  // Strip url query parameters to get high-res original
  const cleanUrl = rawUrl.split('?')[0];
  if (cleanUrl.includes('/dish_photos/')) {
    if (!categorized.dish_photos.includes(cleanUrl)) categorized.dish_photos.push(cleanUrl);
  } else if (cleanUrl.includes('/menus/')) {
    if (!categorized.menus.includes(cleanUrl)) categorized.menus.push(cleanUrl);
  } else if (cleanUrl.includes('/pictures/')) {
    if (!categorized.pictures.includes(cleanUrl)) categorized.pictures.push(cleanUrl);
  } else if (cleanUrl.includes('/reviews_photos/')) {
    if (!categorized.reviews_photos.includes(cleanUrl)) categorized.reviews_photos.push(cleanUrl);
  } else {
    if (!categorized.others.includes(cleanUrl)) categorized.others.push(cleanUrl);
  }
}

console.log('Categorized counts:');
console.log('Dish photos:', categorized.dish_photos.length);
console.log('Menus:', categorized.menus.length);
console.log('Pictures (Ambience/Restaurant):', categorized.pictures.length);
console.log('Review Photos (Customer food & dining):', categorized.reviews_photos.length);
console.log('Others:', categorized.others.length);

fs.writeFileSync('scripts/all-extracted-zomato-urls.json', JSON.stringify(categorized, null, 2));
