import fs from 'fs';

const items = JSON.parse(fs.readFileSync('Greenwood_Zomato_Data/greenwood_items.json', 'utf-8'));

const groups = {};
for (const item of items) {
  if (!groups[item.categoryGroup]) groups[item.categoryGroup] = {};
  if (!groups[item.categoryGroup][item.subCategory]) groups[item.categoryGroup][item.subCategory] = [];
  groups[item.categoryGroup][item.subCategory].push(item);
}

for (const [cg, subs] of Object.entries(groups)) {
  console.log(`\n### ${cg}`);
  for (const [sub, list] of Object.entries(subs)) {
    console.log(`- **${sub}** (${list.length} items): ` + list.map(i => `${i.name} (₹${i.price})`).slice(0, 6).join(', ') + (list.length > 6 ? '...' : ''));
  }
}
