import fs from 'fs';
import path from 'path';

const outDir = path.resolve('public/images');

const downloads = [
  { name: 'butter-chicken.jpg', url: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=85' },
  { name: 'farmhouse-pizza.jpg', url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=85' },
  { name: 'tandoori-tikka.jpg', url: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=85' },
  { name: 'gallery-4.jpg', url: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=900&q=85' },
  { name: 'social-1.jpg', url: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=600&q=80' },
  { name: 'social-2.jpg', url: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=600&q=80' },
  { name: 'social-3.jpg', url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80' },
  { name: 'social-4.jpg', url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80' },
  { name: 'social-5.jpg', url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=600&q=80' }
];

async function run() {
  for (const item of downloads) {
    const dest = path.join(outDir, item.name);
    try {
      const res = await fetch(item.url);
      if (res.ok) {
        const buf = await res.arrayBuffer();
        fs.writeFileSync(dest, Buffer.from(buf));
        console.log(`Saved ${item.name} (${buf.byteLength} bytes)`);
      }
    } catch (e) {
      console.error(`Error saving ${item.name}:`, e.message);
    }
  }
}
run();
