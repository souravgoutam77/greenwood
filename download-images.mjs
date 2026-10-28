import fs from 'fs';
import path from 'path';

const outDir = path.resolve('public/images');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Curated high quality photos matching the Greenwood reference
const images = [
  {
    name: 'hero-banner.jpg',
    url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=85'
  },
  {
    name: 'hero-banner-mobile.jpg',
    url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=85'
  },
  {
    name: 'butter-chicken.jpg',
    // Rich Indian chicken curry in copper bowl with cream
    url: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=85'
  },
  {
    name: 'farmhouse-pizza.jpg',
    // Fresh veggie pizza with cheese pull
    url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=85'
  },
  {
    name: 'tandoori-tikka.jpg',
    // Grilled spiced paneer/chicken tikka on skewers
    url: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=85'
  },
  {
    name: 'gallery-1.jpg',
    // Greenhouse restaurant interior with hanging plants
    url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=900&q=85'
  },
  {
    name: 'gallery-2.jpg',
    // Wooden gazebo/booth dining
    url: 'https://images.unsplash.com/photo-1578474846511-04ba529f0b88?auto=format&fit=crop&w=900&q=85'
  },
  {
    name: 'gallery-3.jpg',
    // Botanical restaurant ambience
    url: 'https://images.unsplash.com/photo-1525610553991-2bede1a236e2?auto=format&fit=crop&w=900&q=85'
  },
  {
    name: 'gallery-4.jpg',
    // Long elegant dining table with lights
    url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=85'
  },
  {
    name: 'gallery-5.jpg',
    // Amber lit wooden bar & shelves
    url: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&w=900&q=85'
  },
  {
    name: 'gallery-6.jpg',
    // Intimate dining table with warm candlelight
    url: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=900&q=85'
  },
  {
    name: 'social-1.jpg',
    // Latte art coffee
    url: 'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'social-2.jpg',
    // Sizzling pan / Indian delicacy
    url: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'social-3.jpg',
    // Cozy restaurant tables with greenery
    url: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'social-4.jpg',
    // Artisanal pizza
    url: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'social-5.jpg',
    // Guests dining under warm fairy lights
    url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=600&q=80'
  }
];

async function downloadAll() {
  console.log('Downloading images...');
  for (const item of images) {
    const dest = path.join(outDir, item.name);
    try {
      const res = await fetch(item.url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const arrayBuffer = await res.arrayBuffer();
      fs.writeFileSync(dest, Buffer.from(arrayBuffer));
      console.log(`Saved ${item.name}`);
    } catch (err) {
      console.error(`Failed ${item.name}:`, err.message);
    }
  }
  console.log('Finished downloading images.');
}

downloadAll();
