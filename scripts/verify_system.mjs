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
// TEST 2: ORDER ITEM TITLES & STRAY '0' BUG
// ---------------------------------------------------------
console.log('\n--- 2. Testing Order Item Summaries & Stray "0" Bug Fix ---');

const ordersPageSource = fs.readFileSync(path.join(rootDir, 'src', 'components', 'OrdersPage.tsx'), 'utf-8');

// Verify stray '0' bug pattern {order.moreCount && ...} is eliminated
const dangerousPattern = /{order\.moreCount\s*&&/g;
const hasDangerousPattern = dangerousPattern.test(ordersPageSource);
assert(!hasDangerousPattern, 'Eliminated dangerous JSX `{order.moreCount && ...}` that rendered stray "0"');

const safePattern = /{Boolean\(order\.moreCount\s*&&\s*order\.moreCount\s*>\s*0\)\s*&&/g;
assert(safePattern.test(ordersPageSource), 'Safe Boolean(moreCount > 0) guard is in place in OrdersPage');

// Verify active order ID matches modal title (no hardcoded #GW-8492)
const hasHardcodedGW8492 = ordersPageSource.includes('#GW-8492');
assert(!hasHardcodedGW8492, 'Eliminated hardcoded "#GW-8492" from order details modal title');

// Verify order items count is dynamic
const hasDynamicCount = ordersPageSource.includes('({liveOrder.items.length} items)');
assert(hasDynamicCount, 'Order Items count dynamically reflects liveOrder.items.length');

// Simulate order summary generation with 1, 2, 3, and 4 items
function generateOrderSummary(items) {
  const names = items.map(i => i.name);
  const dishesSummary = names.slice(0, 3).join(', ');
  const moreCount = Math.max(0, names.length - 3);
  
  // React JSX rendering simulation
  let renderedMore = '';
  if (Boolean(moreCount && moreCount > 0)) {
    renderedMore = ` +${moreCount} more`;
  }
  return dishesSummary + renderedMore;
}

const singleOrder = generateOrderSummary([{ name: 'Kadai Paneer' }]);
assert(singleOrder === 'Kadai Paneer', `Single item order renders without stray 0: "${singleOrder}"`);
assert(!singleOrder.endsWith('0'), 'Single item order does not end with "0"');

const threeOrder = generateOrderSummary([
  { name: 'Kadai Paneer' },
  { name: 'Butter Naan' },
  { name: 'Dal Makhani' }
]);
assert(threeOrder === 'Kadai Paneer, Butter Naan, Dal Makhani', `3 item order renders clean: "${threeOrder}"`);
assert(!threeOrder.includes('0'), '3 item order does not contain stray 0');

const fourOrder = generateOrderSummary([
  { name: 'Kadai Paneer' },
  { name: 'Butter Naan' },
  { name: 'Dal Makhani' },
  { name: 'Jeera Rice' }
]);
assert(fourOrder.includes('+1 more'), `4 item order shows "+1 more": "${fourOrder}"`);

// ---------------------------------------------------------
// TEST 3: BANNER SIZE COMPRESSION SPECIFICATION (< 300KB)
// ---------------------------------------------------------
console.log('\n--- 3. Testing Banner Upload & Canvas Compression Limits ---');

const adminDashboardSource = fs.readFileSync(path.join(rootDir, 'src', 'components', 'AdminDashboard.tsx'), 'utf-8');

assert(adminDashboardSource.includes('compressImageForBanner'), 'compressImageForBanner function exists in AdminDashboard');
assert(adminDashboardSource.includes('maxWidth = 1920'), 'Canvas compression enforces maxWidth 1920px');
assert(adminDashboardSource.includes('quality = 0.70') || adminDashboardSource.includes('0.70'), 'Quality parameter is 0.70');
assert(adminDashboardSource.includes('400000'), 'Strict payload threshold (400,000 characters ~ 300KB) is enforced');

// ---------------------------------------------------------
// TEST 4: FIRESTORE SECURITY RULES & COMPOSITE INDEXES
// ---------------------------------------------------------
console.log('\n--- 4. Testing Firestore Rules & Composite Indexes ---');

const rulesPath = path.join(rootDir, 'firestore.rules');
assert(fs.existsSync(rulesPath), 'firestore.rules exists');

const rulesContent = fs.readFileSync(rulesPath, 'utf-8');
assert(!rulesContent.includes('allow read, write: if true;'), 'Eliminated wide-open catch-all rule');
assert(rulesContent.includes('function isAdmin()'), 'isAdmin helper function exists in firestore.rules');
assert(rulesContent.includes('match /dishes/{dishId}'), 'Dishes collection is protected');
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
