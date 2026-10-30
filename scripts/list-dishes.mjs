import fs from 'fs';

const orderData = JSON.parse(fs.readFileSync('scripts/parsed-order-data.json', 'utf-8'));
const resPage = orderData.pages.restaurant['20648277'];
const menuList = resPage.order?.menuList;

const dishesWithPhotos = [];
const allItems = [];

if (menuList && menuList.menus) {
  for (const m of menuList.menus) {
    const categoryGroup = m.menu?.name;
    for (const cat of (m.menu?.categories || [])) {
      const subCategory = cat.category?.name;
      for (const it of (cat.category?.items || [])) {
        const item = it.item;
        const imgUrl = item.media?.[0]?.image?.url ? item.media[0].image.url.split('?')[0] : null;
        const itemRecord = {
          id: item.id,
          name: item.name,
          categoryGroup,
          subCategory,
          price: item.price || item.display_price || item.default_price,
          displayPrice: `₹${item.price || item.display_price || item.default_price}`,
          description: item.desc || '',
          isVeg: (item.tag_slugs || []).includes('veg'),
          isSpicy: (item.tag_slugs || []).includes('sf-spicy'),
          rating: item.rating?.value ? Number(item.rating.value.toFixed(1)) : null,
          votes: item.rating?.total_rating_text || null,
          imageUrl: imgUrl
        };
        allItems.push(itemRecord);
        if (imgUrl) {
          dishesWithPhotos.push(itemRecord);
        }
      }
    }
  }
}

console.log(`Total dishes extracted: ${allItems.length}`);
console.log(`Dishes with real photos: ${dishesWithPhotos.length}`);
for (const d of dishesWithPhotos) {
  console.log(`- [${d.subCategory}] ${d.name} (₹${d.price}): ${d.imageUrl}`);
}
