import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { db, initDatabase } from './db.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.join(__dirname, '..', 'dist');
const PUBLIC_DIR = path.join(__dirname, '..', 'public');

// Initialize Database on server start
initDatabase();

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

// Helper to send JSON responses
function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  });
  res.end(JSON.stringify(data));
}

// Helper to parse JSON request body
function parseJSONBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > 1e6) {
        req.socket.destroy();
        reject(new Error('Request body too large'));
      }
    });
    req.on('end', () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(new Error('Invalid JSON'));
      }
    });
    req.on('error', reject);
  });
}

// Order ID generator
function generateOrderId() {
  const lastOrder = db.prepare('SELECT id FROM orders ORDER BY ROWID DESC LIMIT 1').get();
  if (lastOrder && lastOrder.id.startsWith('#GW-')) {
    const num = parseInt(lastOrder.id.replace('#GW-', ''), 10);
    if (!isNaN(num)) {
      return `#GW-${num + 1}`;
    }
  }
  return `#GW-${Math.floor(1000 + Math.random() * 9000)}`;
}

// HTTP Server
export const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = url.pathname;
  const method = req.method;

  // Handle CORS preflight
  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    });
    return res.end();
  }

  // -------------------------------------------------------------
  // REST API ROUTES (/api/*)
  // -------------------------------------------------------------
  if (pathname.startsWith('/api')) {
    try {
      // 1. Health Check
      if (pathname === '/api/health' && method === 'GET') {
        return sendJSON(res, 200, {
          status: 'ok',
          restaurant: 'Greenwood Café & Restaurant',
          hub: 'Narela, Delhi',
          pure_veg: true,
          server_time: new Date().toISOString(),
        });
      }

      // 2. Settings (Operational toggles)
      if (pathname === '/api/settings') {
        if (method === 'GET') {
          const rows = db.prepare('SELECT key, value FROM settings').all();
          const settingsObj = {};
          for (const row of rows) {
            if (row.value === 'true') settingsObj[row.key] = true;
            else if (row.value === 'false') settingsObj[row.key] = false;
            else settingsObj[row.key] = row.value;
          }
          return sendJSON(res, 200, settingsObj);
        }

        if (method === 'PATCH' || method === 'PUT') {
          const body = await parseJSONBody(req);
          const updateStmt = db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');
          for (const [key, value] of Object.entries(body)) {
            updateStmt.run(key, String(value));
          }
          const rows = db.prepare('SELECT key, value FROM settings').all();
          const settingsObj = {};
          for (const row of rows) {
            if (row.value === 'true') settingsObj[row.key] = true;
            else if (row.value === 'false') settingsObj[row.key] = false;
            else settingsObj[row.key] = row.value;
          }
          return sendJSON(res, 200, { success: true, settings: settingsObj });
        }
      }

      // 3. Dishes (Catalog & Stock Management)
      if (pathname === '/api/dishes') {
        if (method === 'GET') {
          const rows = db.prepare('SELECT * FROM dishes ORDER BY category, price ASC').all();
          const dishes = rows.map((r) => ({
            ...r,
            inStock: Boolean(r.in_stock),
            isVeg: Boolean(r.is_veg),
          }));
          return sendJSON(res, 200, dishes);
        }

        if (method === 'POST') {
          const body = await parseJSONBody(req);
          if (!body.name || !body.price || !body.category) {
            return sendJSON(res, 400, { error: 'Name, price, and category are required' });
          }
          const id = `dish-${Date.now()}`;
          const inStock = body.inStock === false ? 0 : 1;
          const image = body.image || '/images/dish-detail/rec-dal-makhani.jpg';
          db.prepare(`
            INSERT INTO dishes (id, name, category, subcategory, price, description, in_stock, image, rating, reviews_count, is_veg)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
          `).run(id, body.name.trim(), body.category, body.subcategory || 'Special', Number(body.price), body.description || '', inStock, image, 4.8, 25);

          const created = db.prepare('SELECT * FROM dishes WHERE id = ?').get(id);
          return sendJSON(res, 201, { success: true, dish: { ...created, inStock: Boolean(created.in_stock), isVeg: true } });
        }
      }

      // 3b. Update Single Dish (Stock toggle or editing)
      if (pathname.startsWith('/api/dishes/') && (method === 'PATCH' || method === 'PUT')) {
        const dishId = pathname.replace('/api/dishes/', '');
        const body = await parseJSONBody(req);

        const current = db.prepare('SELECT * FROM dishes WHERE id = ?').get(dishId);
        if (!current) {
          return sendJSON(res, 404, { error: 'Dish not found' });
        }

        const updatedName = body.name !== undefined ? body.name : current.name;
        const updatedPrice = body.price !== undefined ? Number(body.price) : current.price;
        const updatedCategory = body.category !== undefined ? body.category : current.category;
        const updatedInStock = body.inStock !== undefined ? (body.inStock ? 1 : 0) : current.in_stock;

        db.prepare(`
          UPDATE dishes
          SET name = ?, price = ?, category = ?, in_stock = ?
          WHERE id = ?
        `).run(updatedName, updatedPrice, updatedCategory, updatedInStock, dishId);

        const updated = db.prepare('SELECT * FROM dishes WHERE id = ?').get(dishId);
        return sendJSON(res, 200, { success: true, dish: { ...updated, inStock: Boolean(updated.in_stock) } });
      }

      // 4. Orders: List all orders with items
      if (pathname === '/api/orders' && method === 'GET') {
        const statusFilter = url.searchParams.get('status');
        const searchQuery = url.searchParams.get('search');

        let query = 'SELECT * FROM orders';
        const params = [];
        const conditions = [];

        if (statusFilter && statusFilter !== 'All') {
          conditions.push('status = ?');
          params.push(statusFilter);
        }

        if (searchQuery) {
          conditions.push('(id LIKE ? OR customer_name LIKE ? OR customer_phone LIKE ?)');
          params.push(`%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`);
        }

        if (conditions.length > 0) {
          query += ' WHERE ' + conditions.join(' AND ');
        }
        query += ' ORDER BY ROWID DESC';

        const orderRows = db.prepare(query).all(...params);
        const getItemsStmt = db.prepare('SELECT name, price, quantity, image FROM order_items WHERE order_id = ?');

        const orders = orderRows.map((o) => {
          const items = getItemsStmt.all(o.id);
          return {
            id: o.id,
            status: o.status,
            placedTime: o.placed_at,
            prepTime: o.prep_time,
            completedTime: o.completed_at,
            orderType: o.order_type,
            paymentMode: o.payment_mode,
            customerName: o.customer_name,
            customerPhone: o.customer_phone,
            customerAddressOrTable: o.customer_address,
            specialInstruction: o.special_instruction,
            subtotal: o.subtotal,
            deliveryFee: o.delivery_fee,
            total: o.total,
            declineReason: o.decline_reason,
            items,
          };
        });

        return sendJSON(res, 200, orders);
      }

      // 4b. Latest Live Order (for customer tracking)
      if (pathname === '/api/orders/latest' && method === 'GET') {
        const latestOrder = db.prepare("SELECT * FROM orders WHERE status != 'Completed' AND status != 'Declined' ORDER BY ROWID DESC LIMIT 1").get();
        if (!latestOrder) {
          // If no active, return latest completed
          const recent = db.prepare('SELECT * FROM orders ORDER BY ROWID DESC LIMIT 1').get();
          if (!recent) return sendJSON(res, 200, null);
          const items = db.prepare('SELECT name, price, quantity, image FROM order_items WHERE order_id = ?').all(recent.id);
          return sendJSON(res, 200, { ...recent, items });
        }
        const items = db.prepare('SELECT name, price, quantity, image FROM order_items WHERE order_id = ?').all(latestOrder.id);
        return sendJSON(res, 200, { ...latestOrder, items });
      }

      // 4c. Create New Order (Customer Checkout)
      if (pathname === '/api/orders' && method === 'POST') {
        const body = await parseJSONBody(req);
        const { customerName, customerPhone, customerAddress, orderType, paymentMode, specialInstruction, items } = body;

        if (!customerName || !customerPhone || !items || !Array.isArray(items) || items.length === 0) {
          return sendJSON(res, 400, { error: 'Customer details and at least one item are required' });
        }

        // Server-side recalculation of subtotal to guarantee data integrity
        let calculatedSubtotal = 0;
        const validatedItems = [];

        const getDishStmt = db.prepare('SELECT id, name, price, image, in_stock FROM dishes WHERE id = ? OR name = ? LIMIT 1');

        for (const item of items) {
          const dishRecord = getDishStmt.get(item.dishId || '', item.name || '');
          const itemPrice = dishRecord ? dishRecord.price : Number(item.price || 0);
          const itemName = dishRecord ? dishRecord.name : item.name;
          const itemImage = dishRecord ? dishRecord.image : (item.image || '/images/dish-detail/rec-dal-makhani.jpg');
          const qty = Math.max(1, parseInt(item.quantity, 10) || 1);

          calculatedSubtotal += itemPrice * qty;
          validatedItems.push({
            dish_id: dishRecord ? dishRecord.id : `custom-${Date.now()}`,
            name: itemName,
            price: itemPrice,
            quantity: qty,
            image: itemImage,
          });
        }

        const isTakeaway = orderType === 'takeaway' || orderType === 'Takeaway';
        const deliveryFee = isTakeaway || calculatedSubtotal >= 500 ? 0 : 49;
        const grandTotal = calculatedSubtotal + deliveryFee;

        const newId = generateOrderId();
        const now = new Date();
        const timeFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const placedAtText = `Placed at ${timeFormatted}`;

        // Insert into database
        db.prepare(`
          INSERT INTO orders (id, customer_name, customer_phone, customer_address, order_type, payment_mode, special_instruction, subtotal, delivery_fee, total, status, placed_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'New', ?)
        `).run(
          newId,
          customerName.trim(),
          customerPhone.trim(),
          customerAddress ? customerAddress.trim() : 'Narela Hub Hub (Takeaway)',
          isTakeaway ? 'Takeaway' : 'Home Delivery',
          paymentMode || 'Cash on Delivery',
          specialInstruction ? specialInstruction.trim() : '',
          calculatedSubtotal,
          deliveryFee,
          grandTotal,
          placedAtText
        );

        const insertItemStmt = db.prepare(`
          INSERT INTO order_items (order_id, dish_id, name, price, quantity, image)
          VALUES (?, ?, ?, ?, ?, ?)
        `);

        for (const item of validatedItems) {
          insertItemStmt.run(newId, item.dish_id, item.name, item.price, item.quantity, item.image);
        }

        const createdOrder = {
          id: newId,
          status: 'New',
          placedTime: placedAtText,
          orderType: isTakeaway ? 'Takeaway' : 'Home Delivery',
          paymentMode: paymentMode || 'Cash on Delivery',
          customerName: customerName.trim(),
          customerPhone: customerPhone.trim(),
          customerAddressOrTable: customerAddress || 'Narela Hub',
          specialInstruction: specialInstruction || '',
          subtotal: calculatedSubtotal,
          deliveryFee,
          total: grandTotal,
          items: validatedItems,
        };

        return sendJSON(res, 201, { success: true, order: createdOrder });
      }

      // 4d. Update Order Status (Admin action: Accept, Mark Ready, Dispatch, Complete, Decline)
      if (pathname.match(/^\/api\/orders\/[^/]+\/status$/) && (method === 'PATCH' || method === 'PUT')) {
        const orderId = decodeURIComponent(pathname.split('/')[3]);
        const body = await parseJSONBody(req);
        const { status, declineReason, prepTime } = body;

        const existing = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId);
        if (!existing) {
          return sendJSON(res, 404, { error: 'Order not found' });
        }

        let completedAt = existing.completed_at;
        if (status === 'Completed') {
          const now = new Date();
          completedAt = `Completed at ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        }

        db.prepare(`
          UPDATE orders
          SET status = ?, decline_reason = COALESCE(?, decline_reason), prep_time = COALESCE(?, prep_time), completed_at = ?
          WHERE id = ?
        `).run(status, declineReason || null, prepTime || null, completedAt, orderId);

        const updated = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId);
        const items = db.prepare('SELECT name, price, quantity, image FROM order_items WHERE order_id = ?').all(orderId);

        return sendJSON(res, 200, { success: true, order: { ...updated, items } });
      }

      // 5. Customer Profile
      if (pathname === '/api/profile') {
        if (method === 'GET') {
          const profile = db.prepare('SELECT * FROM customer_profile LIMIT 1').get();
          return sendJSON(res, 200, profile || { name: 'Guest User', phone: '+91 98765 43210', email: '', membership: 'Dining Club' });
        }

        if (method === 'PUT' || method === 'PATCH') {
          const body = await parseJSONBody(req);
          db.prepare(`
            INSERT OR REPLACE INTO customer_profile (phone, name, email, membership)
            VALUES (?, ?, ?, COALESCE(?, 'Pure Veg Dining Club Member'))
          `).run(body.phone, body.name, body.email || '', body.membership);

          const updated = db.prepare('SELECT * FROM customer_profile WHERE phone = ?').get(body.phone);
          return sendJSON(res, 200, { success: true, profile: updated });
        }
      }

      // 6. Saved Addresses
      if (pathname === '/api/addresses') {
        if (method === 'GET') {
          const addresses = db.prepare('SELECT * FROM customer_addresses ORDER BY is_default DESC, id DESC').all();
          return sendJSON(res, 200, addresses.map((a) => ({ ...a, isDefault: Boolean(a.is_default), addressLine: a.address_line })));
        }

        if (method === 'POST') {
          const body = await parseJSONBody(req);
          const id = `addr-${Date.now()}`;
          const isDefault = body.isDefault ? 1 : 0;

          if (isDefault) {
            db.prepare('UPDATE customer_addresses SET is_default = 0').run();
          }

          db.prepare(`
            INSERT INTO customer_addresses (id, customer_phone, type, address_line, phone, is_default)
            VALUES (?, ?, ?, ?, ?, ?)
          `).run(id, body.phone || '+91 98765 43210', body.type || 'Home', body.addressLine, body.phone || '+91 98765 43210', isDefault);

          const created = db.prepare('SELECT * FROM customer_addresses WHERE id = ?').get(id);
          return sendJSON(res, 201, { success: true, address: { ...created, isDefault: Boolean(created.is_default), addressLine: created.address_line } });
        }
      }

      if (pathname.startsWith('/api/addresses/') && method === 'DELETE') {
        const addrId = pathname.replace('/api/addresses/', '');
        db.prepare('DELETE FROM customer_addresses WHERE id = ?').run(addrId);
        return sendJSON(res, 200, { success: true });
      }

      // Fallback for unknown /api route
      return sendJSON(res, 404, { error: 'API endpoint not found' });
    } catch (err) {
      console.error('API Error:', err);
      return sendJSON(res, 500, { error: 'Internal server error', message: err.message });
    }
  }

  // -------------------------------------------------------------
  // STATIC ASSETS & SPA SERVING (Production Unified Server)
  // -------------------------------------------------------------
  if (fs.existsSync(DIST_DIR)) {
    let filePath = path.join(DIST_DIR, pathname === '/' ? 'index.html' : pathname);

    // Fallback to public folder for static assets if needed
    if (!fs.existsSync(filePath) && fs.existsSync(PUBLIC_DIR)) {
      const publicPath = path.join(PUBLIC_DIR, pathname);
      if (fs.existsSync(publicPath) && !fs.statSync(publicPath).isDirectory()) {
        filePath = publicPath;
      }
    }

    // If file has an extension and does not exist, return 404
    const ext = path.extname(filePath).toLowerCase();
    if (!fs.existsSync(filePath) && ext) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('Asset not found');
    }

    // If file doesn't exist or is directory, fallback to index.html for SPA routing
    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      filePath = path.join(DIST_DIR, 'index.html');
    }

    if (fs.existsSync(filePath)) {
      const fileExt = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[fileExt] || 'application/octet-stream';

      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': fileExt === '.html' ? 'no-cache' : 'public, max-age=31536000, immutable',
      });
      return fs.createReadStream(filePath).pipe(res);
    }
  }

  // If not built yet or not found
  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Greenwood Backend Server Running. (Build frontend with `npm run build` to serve UI here)');
});

// Start Server if run directly
const PORT = process.env.PORT || 3001;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`[Greenwood API Server] Listening on http://0.0.0.0:${PORT}`);
});
