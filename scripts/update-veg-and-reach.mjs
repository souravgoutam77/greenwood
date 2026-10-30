import fs from 'fs';

// 1. Update src/components/AboutPage.tsx
let aboutTsx = fs.readFileSync('src/components/AboutPage.tsx', 'utf8');
aboutTsx = aboutTsx.replace(
  'src="/images/dish-detail/butter-paneer-thumb-4.jpg"',
  'src="/images/dish-detail/real-butter-paneer-hero.jpg"'
);
fs.writeFileSync('src/components/AboutPage.tsx', aboutTsx, 'utf8');
console.log('Updated AboutPage.tsx with pure veg butter paneer hero image');

// 2. Update src/components/ContactPage.tsx (remove Section 3: How to Reach Greenwood Café)
let contactTsx = fs.readFileSync('src/components/ContactPage.tsx', 'utf8');
const section3Pattern = /\{\/\* ========================================================= \*\/\}\r?\n\s*\{\/\* 3\. GOOGLE MAPS EMBED \/ DIRECTIONS GUIDE[\s\S]*?<\/section>/;

if (section3Pattern.test(contactTsx)) {
  contactTsx = contactTsx.replace(section3Pattern, '');
  fs.writeFileSync('src/components/ContactPage.tsx', contactTsx, 'utf8');
  console.log('Removed "How to Reach Greenwood Café" section from ContactPage.tsx');
} else {
  console.warn('Could not find Section 3 pattern in ContactPage.tsx');
}
