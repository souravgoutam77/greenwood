import fs from 'fs';
import path from 'path';

const outDir = path.resolve('public/images');

// Better, authentic photos specifically matching the Greenwood reference image
const curatedImages = [
  {
    name: 'hero-banner.jpg',
    // Arched wooden gazebo / greenhouse garden restaurant with warm lights
    url: 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=1600&q=85'
  },
  {
    name: 'hero-banner-mobile.jpg',
    url: 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=800&q=85'
  },
  {
    name: 'butter-chicken.jpg',
    // Rich Indian butter chicken in copper/brass handi with cream swirl
    url: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=800&q=85'
  },
  {
    name: 'farmhouse-pizza.jpg',
    // Loaded farmhouse pizza with veggies and cheese pull
    url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=85'
  },
  {
    name: 'tandoori-tikka.jpg',
    // Authentic spicy grilled tandoori paneer/chicken tikka skewers
    url: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=800&q=85'
  },
  {
    name: 'gallery-1.jpg',
    // Botanical restaurant dining area with hanging plants
    url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=85'
  },
  {
    name: 'gallery-2.jpg',
    // Wooden gazebo booth dining with greenery
    url: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=900&q=85'
  },
  {
    name: 'gallery-3.jpg',
    // Lush dining hall with natural light
    url: 'https://images.unsplash.com/photo-1525610553991-2bede1a236e2?auto=format&fit=crop&w=900&q=85'
  },
  {
    name: 'gallery-4.jpg',
    // Long elegant dining table setup with greenery
    url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=85'
  },
  {
    name: 'gallery-5.jpg',
    // Illuminated wooden bar with amber backlights
    url: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&w=900&q=85'
  },
  {
    name: 'gallery-6.jpg',
    // Candlelit dining table with warm atmosphere
    url: 'https://images.unsplash.com/photo-1578474846511-04ba529f0b88?auto=format&fit=crop&w=900&q=85'
  },
  {
    name: 'social-1.jpg',
    // Latte art coffee
    url: 'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'social-2.jpg',
    // Delicious Indian biryani / clay pot dish
    url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'social-3.jpg',
    // Guests dining in lush green restaurant
    url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'social-4.jpg',
    // Freshly baked pizza with basil
    url: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'social-5.jpg',
    // Dining ambience under fairy lights
    url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=600&q=80'
  }
];

async function updateImages() {
  for (const item of curatedImages) {
    const dest = path.join(outDir, item.name);
    try {
      const res = await fetch(item.url);
      if (res.ok) {
        const buffer = await res.arrayBuffer();
        fs.writeFileSync(dest, Buffer.from(buffer));
        console.log(`Updated ${item.name}`);
      }
    } catch (e) {
      console.error(`Error updating ${item.name}:`, e.message);
    }
  }
}

updateImages();
