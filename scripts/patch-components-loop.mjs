import fs from 'node:fs';

// 1. Patch SignatureDishes.tsx
const sigPath = 'src/components/SignatureDishes.tsx';
let sigCode = fs.readFileSync(sigPath, 'utf8');

// Replace the listener logic with debounced, event-specific listener
const sigOld = `    // 3. Instant local & cross-tab events listener via CustomEvent, storage & BroadcastChannel
    const handleDishesChanged = () => loadDishes();
    window.addEventListener('gw_dishes_changed', handleDishesChanged);
    window.addEventListener('gw_dishes_updated', handleDishesChanged);
    window.addEventListener('storage', handleDishesChanged);

    let bc: BroadcastChannel | null = null;
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        bc = new BroadcastChannel('gw_sync_channel');
        bc.onmessage = (msg) => {
          if (msg.data?.key === 'dishes' || msg.data?.event === 'gw_dishes_changed') {
            loadDishes();
          }
        };
      } catch {}
    }`;

const sigNew = `    // 3. Instant local & cross-tab events listener via CustomEvent, storage & BroadcastChannel
    let debounceTimer: ReturnType<typeof setTimeout> | null = null;
    const handleDishesChanged = () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        if (isMounted) loadDishes();
      }, 300);
    };
    window.addEventListener('gw_dishes_changed', handleDishesChanged);
    window.addEventListener('storage', handleDishesChanged);

    let bc: BroadcastChannel | null = null;
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        bc = new BroadcastChannel('gw_sync_channel');
        bc.onmessage = (msg) => {
          if (msg.data?.event === 'gw_dishes_changed') {
            handleDishesChanged();
          }
        };
      } catch {}
    }`;

sigCode = sigCode.replace(/\r\n/g, '\n');
sigCode = sigCode.replace(sigOld.replace(/\r\n/g, '\n'), sigNew.replace(/\r\n/g, '\n'));

// Update cleanup in SignatureDishes
sigCode = sigCode.replace(
  "window.removeEventListener('gw_dishes_updated', handleDishesChanged);\n",
  ""
);

fs.writeFileSync(sigPath, sigCode, 'utf8');
console.log('Patched SignatureDishes.tsx successfully!');

// 2. Patch OrdersPage.tsx
const ordersPath = 'src/components/OrdersPage.tsx';
let ordersCode = fs.readFileSync(ordersPath, 'utf8');
ordersCode = ordersCode.replace(/\r\n/g, '\n');

const ordersOld = `    // 3. Instant local & cross-tab events listener + BroadcastChannel + polling fallback
    const handleOrdersChanged = () => loadApiOrders();
    window.addEventListener('gw_orders_changed', handleOrdersChanged);
    window.addEventListener('storage', handleOrdersChanged);

    let bc: BroadcastChannel | null = null;
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        bc = new BroadcastChannel('gw_sync_channel');
        bc.onmessage = () => handleOrdersChanged();
      } catch {}
    }`;

const ordersNew = `    // 3. Instant local & cross-tab events listener + BroadcastChannel + polling fallback
    let debounceTimer: ReturnType<typeof setTimeout> | null = null;
    const handleOrdersChanged = () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        if (isMounted) loadApiOrders();
      }, 300);
    };
    window.addEventListener('gw_orders_changed', handleOrdersChanged);
    window.addEventListener('storage', handleOrdersChanged);

    let bc: BroadcastChannel | null = null;
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        bc = new BroadcastChannel('gw_sync_channel');
        bc.onmessage = (msg) => {
          if (msg.data?.event === 'gw_orders_changed') {
            handleOrdersChanged();
          }
        };
      } catch {}
    }`;

ordersCode = ordersCode.replace(ordersOld.replace(/\r\n/g, '\n'), ordersNew.replace(/\r\n/g, '\n'));
fs.writeFileSync(ordersPath, ordersCode, 'utf8');
console.log('Patched OrdersPage.tsx successfully!');
