import fs from 'fs';

const orderData = JSON.parse(fs.readFileSync('scripts/parsed-order-data.json', 'utf-8'));
const resPage = orderData.pages.restaurant['20648277'];
const menuList = resPage.order?.menuList;

let totalItems = 0;
let itemsWithThumb = 0;
const sampleItems = [];

if (menuList && menuList.menus) {
  for (const m of menuList.menus) {
    const catGroup = m.menu?.name;
    for (const cat of (m.menu?.categories || [])) {
      const subCategory = cat.category?.name;
      for (const it of (cat.category?.items || [])) {
        totalItems++;
        const itemObj = it.item;
        if (itemObj?.thumb || itemObj?.item_image_url || itemObj?.display_image_url) {
          itemsWithThumb++;
        }
        if (sampleItems.length < 5) {
          sampleItems.push({
            catGroup,
            subCategory,
            name: itemObj?.name,
            price: itemObj?.price,
            display_price: itemObj?.display_price,
            desc: itemObj?.desc,
            thumb: itemObj?.thumb,
            item_image_url: itemObj?.item_image_url,
            item_type: itemObj?.item_type,
            tag_slugs: itemObj?.tag_slugs,
            rating: itemObj?.rating,
            keys: Object.keys(itemObj || {})
          });
        }
      }
    }
  }
}

console.log(`Total items found: ${totalItems}`);
console.log(`Items with thumbnails: ${itemsWithThumb}`);
console.log('Sample items:');
console.log(JSON.stringify(sampleItems, null, 2));
