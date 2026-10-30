import fs from 'fs';

const orderData = JSON.parse(fs.readFileSync('scripts/parsed-order-data.json', 'utf-8'));
const resPage = orderData.pages.restaurant['20648277'];

console.log('--- BASIC INFO ---');
console.log(JSON.stringify(resPage.sections.SECTION_BASIC_INFO, null, 2));

console.log('--- RES CONTACT ---');
console.log(JSON.stringify(resPage.sections.SECTION_RES_CONTACT, null, 2));

console.log('--- MENU LIST SAMPLE ---');
const menuList = resPage.order?.menuList;
if (menuList) {
  console.log('menuList type:', typeof menuList, Array.isArray(menuList) ? `Array length ${menuList.length}` : Object.keys(menuList));
  if (menuList.menus) {
    console.log('menus count:', menuList.menus.length);
    for (const m of menuList.menus) {
      console.log(`Menu Category: ${m.menu?.name} (${m.menu?.categories?.length || 0} subcategories)`);
      if (m.menu?.categories) {
        for (const cat of m.menu.categories) {
          console.log(`  Subcategory: ${cat.category?.name} (${cat.category?.items?.length || 0} items)`);
        }
      }
    }
  }
}

console.log('--- IMAGE CAROUSEL ---');
console.log(JSON.stringify(resPage.sections.SECTION_IMAGE_CAROUSEL, null, 2));

console.log('--- ENTITIES IMAGES COUNT ---');
console.log(Object.keys(orderData.entities?.IMAGES || {}).length);
