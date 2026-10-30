import fs from 'fs';

const photosData = JSON.parse(fs.readFileSync('scripts/parsed-photos-data.json', 'utf-8'));
console.log('PhotosData keys:', Object.keys(photosData));
console.log('Entities in photosData:', Object.keys(photosData.entities || {}));

if (photosData.entities?.IMAGES) {
  console.log('Total IMAGES in photos entities:', Object.keys(photosData.entities.IMAGES).length);
  for (const [id, img] of Object.entries(photosData.entities.IMAGES).slice(0, 10)) {
    console.log(id, img.url, img.thumbUrl);
  }
}

// Let's check menu.html
const menuHtml = fs.readFileSync('scripts/zomato-menu.html', 'utf-8');
const menuMatches = menuHtml.match(/https:\/\/[^"'\s]+\.(?:jpeg|jpg|png|webp)/gi) || [];
console.log('Image URLs found in zomato-menu.html:', menuMatches.length);
const menuPages = menuMatches.filter(u => u.includes('menus') || u.includes('menu'));
console.log('Menu specific URLs in zomato-menu.html:', menuPages);
