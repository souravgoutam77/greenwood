import fs from 'fs';
import path from 'path';

// Let's test image URLs directly and verify their headers
const testImages = [
  // Beautiful indoor restaurant with birdcage/dome gazebos and plants
  'https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=1600&q=85',
  // Authentic rich butter chicken in traditional copper handi with cream swirl
  'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=85',
  // Artisanal farmhouse pizza
  'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=85',
  // Tandoori paneer/chicken tikka on platter with chutney
  'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=85',
  // Fine dine table banquet
  'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=85',
  // Latte art
  'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=600&q=80',
  // Biryani pot
  'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=600&q=80',
  // Restaurant guests dining
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80',
  // Cheesy pizza slice
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80',
  // Evening fairy lights garden dining
  'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=600&q=80'
];

async function check() {
  for (const url of testImages) {
    try {
      const res = await fetch(url, { method: 'HEAD' });
      console.log(res.status, url.split('?')[0]);
    } catch (e) {
      console.log('FAIL', e.message);
    }
  }
}
check();
