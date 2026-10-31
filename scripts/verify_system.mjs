// Comprehensive Production Verification Script for Greenwood Café & Restaurant
// Run: node scripts/verify_system.mjs

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('='.repeat(70));
console.log('GREENWOOD PRODUCTION SYSTEM VERIFICATION AUDIT');
console.log('='.repeat(70));

let failures = 0;

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    failures++;
  } else {
    console.log(`✅ PASSED: ${message}`);
  }
}

// ---------------------------------------------------------
// TEST 1: 166 DISHES & 5 CANONICAL CATEGORIES
// ---------------------------------------------------------
console.log('\n--- 1. Testing Menu Taxonomy & Dish Count (166 items) ---');

const searchableMenuPath = path.join(rootDir, 'src', 'data', 'searchableMenu.ts');
const categoriesPath = path.join(rootDir, 'src', 'data', 'categories.ts');

assert(fs.existsSync(searchableMenuPath), 'searchableMenu.ts exists');
assert(fs.existsSync(categoriesPath), 'categories.ts exists');

const { SEARCHABLE_MENU } = await import(`file://${searchableMenuPath}`);
const { CANONICAL_CATEGORIES, CANONICAL_CATEGORY_NAMES } = await import(`file://${categoriesPath}`);

assert(Array.isArray(SEARCHABLE_MENU), 'SEARCHABLE_MENU is an array');
assert(SEARCHABLE_MENU.length === 166, `SEARCHABLE_MENU has exactly 166 dishes (found: ${SEARCHABLE_MENU.length})`);

const expectedCategoryCounts = {
  'Chinese': 33,
  'Tandoori': 20,
  'Continental': 42,
  'North Indian': 49,
  'Cold Beverages & Shakes': 22
};

const actualCategoryCounts = {};
for (const dish of SEARCHABLE_MENU) {
  actualCategoryCounts[dish.category] = (actualCategoryCounts[dish.category] || 0) + 1;
}

for (const [catName, expectedCount] of Object.entries(expectedCategoryCounts)) {
  const count = actualCategoryCounts[catName] || 0;
  assert(count === expectedCount, `Category "${catName}" has ${expectedCount} dishes (actual: ${count})`);
}

// Verify no legacy mock dishes (dish-1 to dish-18)
const mockDishRegex = /^(?:item|dish)-(?:[1-9]|1[0-8])$/;
const foundMocks = SEARCHABLE_MENU.filter(d => mockDishRegex.test(d.id));
assert(foundMocks.length === 0, `No legacy mock dishes found in catalogue (found: ${foundMocks.length})`);

// ---------------------------------------------------------
// TEST 2: ORDER ACTIONS & POS CONTROLS
// ---------------------------------------------------------
console.log('\n--- 2. Testing Order Actions, Stray "0" Bug Fix & POS Controls ---');

const ordersPageSource = fs.readFileSync(path.join(rootDir, 'src', 'components', 'OrdersPage.tsx'), 'utf-8');

// Verify stray '0' bug pattern {order.moreCount && ...} is eliminated
const dangerousPattern = /{order\.moreCount\s*&&/g;
assert(!dangerousPattern.test(ordersPageSource), 'Eliminated dangerous JSX `{order.moreCount && ...}` that rendered stray "0"');

const safePattern = /{Boolean\(order\.moreCount\s*&&\s*order\.moreCount\s*>\s*0\)\s*&&/g;
assert(safePattern.test(ordersPageSource), 'Safe Boolean(moreCount > 0) guard is in place in OrdersPage');

// Verify active order ID matches modal title (no hardcoded #GW-8492)
assert(!ordersPageSource.includes('#GW-8492'), 'Eliminated hardcoded "#GW-8492" from order details modal title');

// Verify order items count is dynamic
assert(ordersPageSource.includes('({liveOrder.items.length} items)'), 'Order Items count dynamically reflects liveOrder.items.length');

const adminDashboardSource = fs.readFileSync(path.join(rootDir, 'src', 'components', 'AdminDashboard.tsx'), 'utf-8');

// Verify dynamic action buttons & delete order in Admin POS
assert(adminDashboardSource.includes('handleDeleteOrder'), 'handleDeleteOrder exists in AdminDashboard');
assert(adminDashboardSource.includes('handleCancelOrder'), 'handleCancelOrder exists in AdminDashboard');
assert(adminDashboardSource.includes('🗑 Delete Order'), 'Administrative Delete Order button rendered in POS');
assert(adminDashboardSource.includes('updateDoc(doc(firestore, \'orders\''), 'Authentic Firestore write updateDoc used in order status transitions');

// ---------------------------------------------------------
// TEST 3: HERO BANNER UPLOAD, DELETE & FALLBACK
// ---------------------------------------------------------
console.log('\n--- 3. Testing Hero Banner Fallback, Delete Option & Clean UI ---');

const heroBannerSource = fs.readFileSync(path.join(rootDir, 'src', 'components', 'HeroBanner.tsx'), 'utf-8');

assert(heroBannerSource.includes('onError'), 'HeroBanner has onError fallback handler on <img>');
assert(heroBannerSource.includes('/images/hero-bg-2400.jpg'), 'HeroBanner falls back to /images/hero-bg-2400.jpg');
assert(heroBannerSource.includes('aspect-[1920/800]'), 'HeroBanner uses aspect-[1920/800] for desktop height');
assert(heroBannerSource.includes('aspect-square'), 'HeroBanner uses aspect-square on mobile for 1:1 square assets');

assert(adminDashboardSource.includes('handleDeleteBanner'), 'handleDeleteBanner exists in AdminDashboard');
assert(adminDashboardSource.includes('🗑 Delete Banner'), 'Explicit [🗑 Delete Banner] button rendered');
assert(!adminDashboardSource.includes('Reset to Default'), 'Removed "Reset to Default" button from AdminDashboard');
assert(adminDashboardSource.includes('1920 × 800 px'), 'AdminDashboard displays 1920 × 800 px desktop guide');
assert(adminDashboardSource.includes('1080 × 1080 px'), 'AdminDashboard displays 1080 × 1080 px mobile guide');

// Verify technical text removed
assert(!adminDashboardSource.includes('⚡ Quick Hero Banner Upload (Live Cloud Firestore Sync)'), 'Technical upload text block removed from AdminDashboard');
assert(adminDashboardSource.includes('Compressing &amp; Uploading...') || adminDashboardSource.includes('Compressing & Uploading...'), 'Active loading spinner for banner upload present');

// ---------------------------------------------------------
// TEST 4: DESKTOP HEADER & HAMBURGER MENU HIDING
// ---------------------------------------------------------
console.log('\n--- 4. Testing Desktop Header & Hamburger Menu ---');

const headerSource = fs.readFileSync(path.join(rootDir, 'src', 'components', 'Header.tsx'), 'utf-8');

assert(headerSource.includes('block md:hidden p-2 text-[#FAF6EE]'), 'Hamburger 3-lines menu button is strictly hidden on desktop (md:hidden)');

// ---------------------------------------------------------
// TEST 5: SIGNATURE & TRENDING ZERO-FALLBACK BUG FIX
// ---------------------------------------------------------
console.log('\n--- 5. Testing Signature & Trending Zero-Fallback ---');

const signatureDishesSource = fs.readFileSync(path.join(rootDir, 'src', 'components', 'SignatureDishes.tsx'), 'utf-8');

assert(!signatureDishesSource.includes('inStock.slice(0, 6)'), 'Eliminated fallback that forced first 6 in-stock dishes into Trending');
assert(signatureDishesSource.includes('const listToDisplay = trending;'), 'Trending showcase strictly binds only to dishes with isTrending === true');
assert(signatureDishesSource.includes('Chef specials updating soon'), 'Clean empty message rendered when 0 dishes are trending');

// ---------------------------------------------------------
// TEST 6: FIRESTORE SECURITY RULES & COMPOSITE INDEXES
// ---------------------------------------------------------
console.log('\n--- 6. Testing Firestore Rules & Composite Indexes ---');

const rulesPath = path.join(rootDir, 'firestore.rules');
assert(fs.existsSync(rulesPath), 'firestore.rules exists');

const rulesContent = fs.readFileSync(rulesPath, 'utf-8');
assert(!rulesContent.includes('match /{document=**} {\n      allow read, write: if true;'), 'Default catch-all does not allow open read/write');
assert(rulesContent.includes('match /{document=**} {\n      allow read, write: if false;\n    }') || rulesContent.includes('match /{document=**} {\r\n      allow read, write: if false;\r\n    }'), 'Default catch-all is set to deny (allow read, write: if false)');
assert(rulesContent.includes('match /dishes/{dishId}'), 'Dishes collection rules defined');
assert(rulesContent.includes('match /orders/{orderId}'), 'Orders collection rules defined');
assert(rulesContent.includes('match /users/{userId}'), 'User profiles isolation defined');

const indexesPath = path.join(rootDir, 'firestore.indexes.json');
assert(fs.existsSync(indexesPath), 'firestore.indexes.json exists');

const indexesContent = JSON.parse(fs.readFileSync(indexesPath, 'utf-8'));
assert(Array.isArray(indexesContent.indexes), 'Indexes list is present in firestore.indexes.json');
const orderIndex = indexesContent.indexes.find(idx => idx.collectionGroup === 'orders');
assert(Boolean(orderIndex), 'Composite index for collectionGroup "orders" exists');
if (orderIndex) {
  const fields = orderIndex.fields.map(f => `${f.fieldPath}:${f.order}`);
  assert(fields.includes('status:ASCENDING') && fields.includes('createdAt:DESCENDING'),
    'Orders composite index fields match (status ASC, createdAt DESC)');
}

const firebaseJsonPath = path.join(rootDir, 'firebase.json');
const firebaseJson = JSON.parse(fs.readFileSync(firebaseJsonPath, 'utf-8'));
assert(firebaseJson.firestore && firebaseJson.firestore.indexes === 'firestore.indexes.json',
  'firebase.json points firestore.indexes to firestore.indexes.json');

// ---------------------------------------------------------
// SUMMARY
// ---------------------------------------------------------
console.log('\n' + '='.repeat(70));
if (failures === 0) {
  console.log('🎉 ALL SYSTEM AUDIT & ARCHITECTURE VERIFICATION CHECKS PASSED!');
  console.log('='.repeat(70));
  process.exit(0);
} else {
  console.error(`💥 VERIFICATION FAILED WITH ${failures} FAILURE(S)`);
  console.log('='.repeat(70));
  process.exit(1);
}
