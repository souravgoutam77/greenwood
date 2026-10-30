import fs from 'fs';

const orderData = JSON.parse(fs.readFileSync('scripts/parsed-order-data.json', 'utf-8'));
const resPage = orderData.pages.restaurant['20648277'];
const menuList = resPage.order?.menuList;

let itemsWithMedia = [];
let entitiesImages = orderData.entities?.IMAGES || {};

console.log('Entities IMAGES count:', Object.keys(entitiesImages).length);
console.log('Sample entity image:', Object.entries(entitiesImages)[0]);

if (menuList && menuList.menus) {
  for (const m of menuList.menus) {
    for (const cat of (m.menu?.categories || [])) {
      for (const it of (cat.category?.items || [])) {
        const itemObj = it.item;
        if (itemObj?.media && itemObj.media.length > 0) {
          itemsWithMedia.push({
            name: itemObj.name,
            media: itemObj.media
          });
        }
      }
    }
  }
}

console.log(`Total items with media: ${itemsWithMedia.length}`);
if (itemsWithMedia.length > 0) {
  console.log('Sample item with media:');
  console.log(JSON.stringify(itemsWithMedia.slice(0, 5), null, 2));
}
