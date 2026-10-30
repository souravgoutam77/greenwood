import fs from 'fs';

const orderData = JSON.parse(fs.readFileSync('scripts/parsed-order-data.json', 'utf-8'));
const overviewData = JSON.parse(fs.readFileSync('scripts/parsed-overview-data.json', 'utf-8'));

console.log('--- Entities in orderData ---');
console.log('Entities keys:', Object.keys(orderData.entities || {}));

// Let's inspect pages
console.log('--- Pages in orderData ---');
console.log('Pages keys:', Object.keys(orderData.pages || {}));
if (orderData.pages.restaurant) {
  const resKey = Object.keys(orderData.pages.restaurant)[0];
  console.log('Restaurant page key:', resKey);
  const resPage = orderData.pages.restaurant[resKey];
  console.log('Restaurant page keys:', Object.keys(resPage || {}));
  if (resPage.sections) {
    console.log('Sections keys:', Object.keys(resPage.sections));
  }
  if (resPage.order) {
    console.log('Order section keys:', Object.keys(resPage.order));
  }
}

// Let's inspect pages in overviewData
if (overviewData.pages.restaurant) {
  const resKey = Object.keys(overviewData.pages.restaurant)[0];
  console.log('\nOverview Restaurant page key:', resKey);
  const resPage = overviewData.pages.restaurant[resKey];
  console.log('Overview sections keys:', Object.keys(resPage.sections || {}));
}
