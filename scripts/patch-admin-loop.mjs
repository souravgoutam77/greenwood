import fs from 'node:fs';

const adminPath = 'src/components/AdminDashboard.tsx';
let adminCode = fs.readFileSync(adminPath, 'utf8');
adminCode = adminCode.replace(/\r\n/g, '\n');

const adminOld = `    window.addEventListener('gw_orders_changed', handleLocalOrderChange);
    window.addEventListener('gw_dishes_changed', handleLocalDishesChange);
    window.addEventListener('gw_dishes_updated', handleLocalDishesChange);
    window.addEventListener('storage', handleLocalOrderChange);
    window.addEventListener('storage', handleLocalDishesChange);

    let bc: BroadcastChannel | null = null;
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        bc = new BroadcastChannel('gw_sync_channel');
        bc.onmessage = (ev) => {
          if (ev.data?.key === 'dishes' || ev.data?.event === 'gw_dishes_changed') {
            handleLocalDishesChange();
          } else {
            handleLocalOrderChange();
          }
        };
      } catch {}
    }

    // Backup polling
    const interval = setInterval(handleLocalOrderChange, 2000);`;

const adminNew = `    window.addEventListener('gw_orders_changed', handleLocalOrderChange);
    window.addEventListener('gw_dishes_changed', handleLocalDishesChange);
    window.addEventListener('storage', handleLocalOrderChange);
    window.addEventListener('storage', handleLocalDishesChange);

    let bc: BroadcastChannel | null = null;
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        bc = new BroadcastChannel('gw_sync_channel');
        bc.onmessage = (ev) => {
          if (ev.data?.event === 'gw_dishes_changed') {
            handleLocalDishesChange();
          } else if (ev.data?.event === 'gw_orders_changed') {
            handleLocalOrderChange();
          }
        };
      } catch {}
    }

    // Fallback polling (relaxed from aggressive 2s to 20s)
    const interval = setInterval(handleLocalOrderChange, 20000);`;

adminCode = adminCode.replace(adminOld, adminNew);

// Also remove gw_dishes_updated from cleanup
adminCode = adminCode.replace(
  "window.removeEventListener('gw_dishes_updated', handleLocalDishesChange);\n",
  ""
);

fs.writeFileSync(adminPath, adminCode, 'utf8');
console.log('Patched AdminDashboard.tsx successfully!');
