import fs from 'fs';

// 1. Update src/data/restaurantData.ts
let restData = fs.readFileSync('src/data/restaurantData.ts', 'utf8');
restData = restData.replace(/\{\s*label:\s*"Gallery",\s*href:\s*"#gallery",\s*isActive:\s*false\s*\},?\r?\n?/g, '');
fs.writeFileSync('src/data/restaurantData.ts', restData, 'utf8');
console.log('Updated src/data/restaurantData.ts');

// 2. Update src/App.tsx
let appTsx = fs.readFileSync('src/App.tsx', 'utf8');

// Remove GalleryPage import
appTsx = appTsx.replace(/const GalleryPage = React\.lazy\(\(\) => import\('\.\/components\/GalleryPage'\)\.then\(m => \(\{ default: m\.GalleryPage \}\)\)\);\r?\n?/g, '');

// Update currentView type
appTsx = appTsx.replace(
  /'item-detail' \| 'home' \| 'menu' \| 'cart' \| 'orders' \| 'profile' \| 'admin' \| 'about' \| 'gallery' \| 'contact'/g,
  "'item-detail' | 'home' | 'menu' | 'cart' | 'orders' | 'profile' | 'admin' | 'about' | 'contact'"
);

// Hash handling on load
appTsx = appTsx.replace(
  /if \(window\.location\.hash === '#gallery'\) \{\s*return 'gallery';\s*\}/g,
  "if (window.location.hash === '#gallery') {\n        setTimeout(() => {\n          const el = document.getElementById('gallery');\n          if (el) el.scrollIntoView({ behavior: 'smooth' });\n        }, 300);\n        return 'home';\n      }"
);

// handleHashChange
appTsx = appTsx.replace(
  /\} else if \(window\.location\.hash === '#gallery'\) \{\s*setCurrentView\('gallery'\);/g,
  "} else if (window.location.hash === '#gallery') {\n        setCurrentView('home');\n        setTimeout(() => {\n          const el = document.getElementById('gallery');\n          if (el) el.scrollIntoView({ behavior: 'smooth' });\n        }, 300);"
);

// handleLinkClick / handleNavClick for '#gallery'
appTsx = appTsx.replace(
  /\} else if \(href === '#gallery'\) \{\s*setCurrentView\('gallery'\);\s*window\.location\.hash = '#gallery';\s*window\.scrollTo\(\{ top: 0, behavior: 'smooth' \}\);/g,
  "} else if (href === '#gallery') {\n      setCurrentView('home');\n      setTimeout(() => {\n        const el = document.getElementById('gallery');\n        if (el) el.scrollIntoView({ behavior: 'smooth' });\n      }, 100);"
);

// Remove activeNav check for '#gallery'
appTsx = appTsx.replace(/\s*: currentView === 'gallery'\s*\?\s*'#gallery'/g, '');

// Remove onNavigateToGallery prop in AboutPage
appTsx = appTsx.replace(
  /\s*onNavigateToGallery=\{\(\) => \{\s*setCurrentView\('gallery'\);\s*window\.location\.hash = '#gallery';\s*window\.scrollTo\(\{ top: 0, behavior: 'smooth' \}\);\s*\}\}/g,
  ''
);

// Remove GalleryPage route
const galleryPagePattern = /\s*\) : currentView === 'gallery' \? \(\s*<GalleryPage[\s\S]*?\/>\s*/;
appTsx = appTsx.replace(galleryPagePattern, '\n        ');

// Remove currentView === 'gallery' in footer
appTsx = appTsx.replace(/ \|\| currentView === 'gallery'/g, '');

fs.writeFileSync('src/App.tsx', appTsx, 'utf8');
console.log('Updated src/App.tsx');

// 3. Update src/components/AboutPage.tsx
let aboutTsx = fs.readFileSync('src/components/AboutPage.tsx', 'utf8');

// Remove onNavigateToGallery from interface
aboutTsx = aboutTsx.replace(/\s*onNavigateToGallery\?: \(\) => void;/g, '');

// Remove onNavigateToGallery from props
aboutTsx = aboutTsx.replace(/\s*onNavigateToGallery,?\r?\n?/g, '\n');

// Replace SECTION A with clean Header Hero
const sectionAPattern = /\{\/\* ========================================================= \*\/\}\r?\n\s*\{\/\* SECTION A — PAGE HERO[\s\S]*?<\/section>/;

const newSectionA = `{/* ========================================================= */}
      {/* 1. HEADER HERO (Clean & Elegant)                          */}
      {/* ========================================================= */}
      <section className="relative overflow-hidden pt-8 pb-8 sm:pb-10 bg-gradient-to-b from-[#FAF6EE] to-[#FFFDF8] border-b border-[#E8DDCA] text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="inline-flex items-center justify-center gap-2 text-[#163E26] mb-2">
            <LeafBranch flip={false} className="w-5 h-2.5" />
            <span className="font-serif text-xs sm:text-sm tracking-widest uppercase font-semibold text-[#163E26]">
              Our Story &amp; Ambience
            </span>
            <LeafBranch flip={true} className="w-5 h-2.5" />
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#17261D] tracking-tight mb-2">
            About Greenwood Café
          </h1>
          <p className="text-xs sm:text-sm text-[#77766D] max-w-xl mx-auto font-sans leading-relaxed">
            A fine-dine vegetarian family restaurant in Narela, Delhi, bringing people together over pure food, lush botanical ambience, and memorable moments.
          </p>
        </div>
      </section>`;

if (sectionAPattern.test(aboutTsx)) {
  aboutTsx = aboutTsx.replace(sectionAPattern, newSectionA);
  console.log('Replaced SECTION A in AboutPage.tsx');
} else {
  console.warn('Pattern for SECTION A not found in AboutPage.tsx');
}

// Remove "View More Photos" button in Section D
const viewMorePhotosBtnPattern = /\{onNavigateToGallery && \(\s*<button[\s\S]*?<\/button>\s*\)\}/;
aboutTsx = aboutTsx.replace(viewMorePhotosBtnPattern, '');

fs.writeFileSync('src/components/AboutPage.tsx', aboutTsx, 'utf8');
console.log('Updated src/components/AboutPage.tsx');

// 4. Update src/components/RestaurantGallery.tsx to ensure zero extra gap
let galleryTsx = fs.readFileSync('src/components/RestaurantGallery.tsx', 'utf8');
galleryTsx = galleryTsx.replace(
  /className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-5 content-auto"/g,
  'className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-3 content-auto"'
);
fs.writeFileSync('src/components/RestaurantGallery.tsx', galleryTsx, 'utf8');
console.log('Updated src/components/RestaurantGallery.tsx');
