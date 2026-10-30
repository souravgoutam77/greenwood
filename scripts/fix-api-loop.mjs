import fs from 'node:fs';

const filePath = 'src/services/api.ts';
let code = fs.readFileSync(filePath, 'utf8');

// Replace setStorageItem signature and implementation
const targetFunc = `function setStorageItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(\`gw_\${key}\`, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent(\`gw_\${key}_updated\`, { detail: value }));
    if ('BroadcastChannel' in window) {
      const bc = new BroadcastChannel('gw_sync_channel');
      bc.postMessage({ key, value });
      bc.close();
    }
  } catch (err) {
    console.warn(\`Storage error for gw_\${key}:\`, err);
  }
}`;

const replacementFunc = `function setStorageItem<T>(key: string, value: T, notify = false): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(\`gw_\${key}\`, JSON.stringify(value));
    if (notify) {
      window.dispatchEvent(new CustomEvent(\`gw_\${key}_updated\`, { detail: value }));
      if ('BroadcastChannel' in window) {
        const bc = new BroadcastChannel('gw_sync_channel');
        bc.postMessage({ key, value });
        bc.close();
      }
    }
  } catch (err) {
    console.warn(\`Storage error for gw_\${key}:\`, err);
  }
}`;

// Normalize line endings for replacement
code = code.replace(/\r\n/g, '\n');
const normalizedTarget = targetFunc.replace(/\r\n/g, '\n');
const normalizedReplacement = replacementFunc.replace(/\r\n/g, '\n');

if (code.includes(normalizedTarget)) {
  code = code.replace(normalizedTarget, normalizedReplacement);
  console.log('Replaced setStorageItem function successfully');
} else {
  console.warn('Could not find target function directly, applying fallback pattern');
  code = code.replace(
    /function setStorageItem<T>\(key: string, value: T\): void\s*\{[\s\S]*?window\.dispatchEvent[\s\S]*?bc\.close\(\);\s*\}\s*\}\s*catch\s*\(err\)\s*\{/m,
    `function setStorageItem<T>(key: string, value: T, notify = false): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(\`gw_\${key}\`, JSON.stringify(value));
    if (notify) {
      window.dispatchEvent(new CustomEvent(\`gw_\${key}_updated\`, { detail: value }));
      if ('BroadcastChannel' in window) {
        const bc = new BroadcastChannel('gw_sync_channel');
        bc.postMessage({ key, value });
        bc.close();
      }
    }
  } catch (err) {`
  );
}

// Update Getters to pass notify = false
code = code.replace("setStorageItem('settings', settings);", "setStorageItem('settings', settings, false);");
code = code.replace("setStorageItem('dishes', fullCatalogue);", "setStorageItem('dishes', fullCatalogue, false);");
code = code.replace("setStorageItem('orders', cloudOrders);", "setStorageItem('orders', cloudOrders, false);");
code = code.replace("setStorageItem('banners', cloudBanners);", "setStorageItem('banners', cloudBanners, false);");
code = code.replace("setStorageItem('admin_phones', phones);", "setStorageItem('admin_phones', phones, false);");

// Update Mutations to pass notify = true
code = code.replace("setStorageItem('settings', updated);", "setStorageItem('settings', updated, true);");
code = code.replace("setStorageItem('dishes', updated);", "setStorageItem('dishes', updated, true);");
code = code.replace("setStorageItem('dishes', nextList);", "setStorageItem('dishes', nextList, true);");
code = code.replace("setStorageItem('dishes', next);", "setStorageItem('dishes', next, true);");
code = code.replace("setStorageItem('orders', updatedList);", "setStorageItem('orders', updatedList, true);");
code = code.replace("setStorageItem('orders', nextList);", "setStorageItem('orders', nextList, true);");

fs.writeFileSync(filePath, code, 'utf8');
console.log('Updated src/services/api.ts successfully!');
