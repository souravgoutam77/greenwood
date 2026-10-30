import fs from 'fs';

const overviewData = JSON.parse(fs.readFileSync('scripts/parsed-overview-data.json', 'utf-8'));
const photosData = JSON.parse(fs.readFileSync('scripts/parsed-photos-data.json', 'utf-8'));
const orderData = JSON.parse(fs.readFileSync('scripts/parsed-order-data.json', 'utf-8'));

const allImages = new Map();

function collect(obj) {
  if (!obj) return;
  if (obj.entities && obj.entities.IMAGES) {
    for (const [k, v] of Object.entries(obj.entities.IMAGES)) {
      if (v && v.url) {
        allImages.set(k, {
          id: k,
          url: v.url.split('?')[0],
          thumbUrl: v.thumbUrl,
          uploaderName: v.uploaderName,
          timestamp: v.timestamp
        });
      }
    }
  }
}

collect(overviewData);
collect(photosData);
collect(orderData);

console.log('Total entity images collected:', allImages.size);
for (const [k, v] of allImages.entries()) {
  console.log(`[${k}] (${v.uploaderName || 'Zomato'} - ${v.timestamp || ''}) -> ${v.url}`);
}
