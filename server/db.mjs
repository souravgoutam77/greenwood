import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, 'data', 'greenwood.db');

// Ensure data folder exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

export const db = new DatabaseSync(DB_PATH);

// Initialize Tables
export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS dishes (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      subcategory TEXT,
      price INTEGER NOT NULL,
      description TEXT,
      image TEXT,
      in_stock INTEGER DEFAULT 1,
      rating REAL DEFAULT 4.8,
      reviews_count INTEGER DEFAULT 30,
      is_veg INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      customer_name TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      customer_address TEXT NOT NULL,
      order_type TEXT NOT NULL,
      payment_mode TEXT NOT NULL,
      special_instruction TEXT,
      subtotal INTEGER NOT NULL,
      delivery_fee INTEGER NOT NULL,
      total INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'New',
      decline_reason TEXT,
      placed_at TEXT NOT NULL,
      prep_time TEXT,
      completed_at TEXT,
      delivery_partner_name TEXT,
      delivery_partner_phone TEXT
    );

    CREATE TABLE IF NOT EXISTS banners (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      subtitle TEXT,
      image_desktop TEXT NOT NULL,
      image_mobile TEXT,
      link_url TEXT,
      is_active INTEGER DEFAULT 1,
      display_order INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id TEXT NOT NULL,
      dish_id TEXT NOT NULL,
      name TEXT NOT NULL,
      price INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      image TEXT,
      FOREIGN KEY(order_id) REFERENCES orders(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS customer_profile (
      phone TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT,
      membership TEXT
    );

    CREATE TABLE IF NOT EXISTS customer_addresses (
      id TEXT PRIMARY KEY,
      customer_phone TEXT NOT NULL,
      type TEXT NOT NULL,
      address_line TEXT NOT NULL,
      phone TEXT NOT NULL,
      is_default INTEGER DEFAULT 0
    );
  `);

  // Migrations for existing database columns
  try {
    const orderCols = db.prepare('PRAGMA table_info(orders)').all();
    const hasRiderName = orderCols.some((c) => c.name === 'delivery_partner_name');
    if (!hasRiderName) {
      db.exec('ALTER TABLE orders ADD COLUMN delivery_partner_name TEXT;');
      db.exec('ALTER TABLE orders ADD COLUMN delivery_partner_phone TEXT;');
    }
    const dishCols = db.prepare('PRAGMA table_info(dishes)').all();
    const hasTrending = dishCols.some((c) => c.name === 'is_trending');
    if (!hasTrending) {
      db.exec('ALTER TABLE dishes ADD COLUMN is_trending INTEGER DEFAULT 0;');
    }
    db.exec("UPDATE dishes SET is_trending = 1 WHERE id IN ('item-1', 'item-2', 'item-3', 'item-7');");
  } catch (err) {
    console.warn('Migration note:', err.message);
  }

  // Ensure admin_phones setting exists with initial authorized admin 8802325537
  try {
    const adminCheck = db.prepare("SELECT value FROM settings WHERE key = 'admin_phones'").get();
    if (!adminCheck) {
      db.prepare("INSERT INTO settings (key, value) VALUES ('admin_phones', ?)").run(JSON.stringify(['8802325537']));
    }
  } catch {}

  // Seed default banners if not present
  try {
    const checkBanners = db.prepare('SELECT COUNT(*) as count FROM banners').get();
    if (!checkBanners || checkBanners.count === 0) {
      const defaultBanners = [
        {
          id: 'banner-1',
          title: 'Good Food. Greener Moods.',
          subtitle: '100% Pure Vegetarian Fine Dining in Narela',
          image_desktop: '/images/hero-bg-2400.jpg',
          image_mobile: '/images/hero-bg-mobile-1200.jpg',
          link_url: '#menu',
          is_active: 1,
          display_order: 1,
        },
        {
          id: 'banner-2',
          title: 'Signature North Indian Specials',
          subtitle: 'Slow simmered Dal Makhani & Tandoor Breads',
          image_desktop: '/images/gallery-1.jpg',
          image_mobile: '/images/gallery-1.jpg',
          link_url: '#menu',
          is_active: 1,
          display_order: 2,
        },
        {
          id: 'banner-3',
          title: 'Private Gazebo Pods & Ambience',
          subtitle: 'Botanical luxury dining experience for families',
          image_desktop: '/images/gallery-2.jpg',
          image_mobile: '/images/gallery-2.jpg',
          link_url: '#gallery',
          is_active: 1,
          display_order: 3,
        },
      ];
      const insertBanner = db.prepare(`
        INSERT INTO banners (id, title, subtitle, image_desktop, image_mobile, link_url, is_active, display_order)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);
      for (const b of defaultBanners) {
        insertBanner.run(b.id, b.title, b.subtitle, b.image_desktop, b.image_mobile, b.link_url, b.is_active, b.display_order);
      }
    }
  } catch {}

  // Seed Default Settings if not present
  const checkSettings = db.prepare('SELECT COUNT(*) as count FROM settings').get();
  if (!checkSettings || checkSettings.count === 0) {
    const defaultSettings = [
      ['is_kitchen_open', 'true'],
      ['home_delivery_enabled', 'true'],
      ['takeaway_enabled', 'true'],
      ['opening_hours', '11:00 AM – 11:00 PM'],
      ['avg_prep_time', '18 mins'],
      ['delivery_radius', '15 km'],
      ['restaurant_phone', '+91 98765 43210'],
      ['kitchen_phone', '+91 98123 45678'],
      ['audio_alerts', 'true'],
    ];

    const insertSetting = db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)');
    for (const [key, value] of defaultSettings) {
      insertSetting.run(key, value);
    }
  }

  // Seed Default Dishes if not present
  const checkDishes = db.prepare('SELECT COUNT(*) as count FROM dishes').get();
  if (!checkDishes || checkDishes.count === 0) {
    const defaultDishes = [
      { id: 'item-1', name: 'Paneer Butter Masala', category: 'North Indian', subcategory: 'Main Course', price: 349, description: 'Cottage cheese simmered in a velvety tomato-butter gravy with aromatic spices.', in_stock: 1, image: '/images/admin/dish_paneer.jpg' },
      { id: 'item-2', name: 'Farmhouse Pizza', category: 'Pizza & Pasta', subcategory: 'Specialty Pizza', price: 399, description: 'Hand-tossed crust topped with bell peppers, sweet corn, mushrooms, olives and mozzarella.', in_stock: 1, image: '/images/admin/dish_pizza.jpg' },
      { id: 'item-3', name: 'Dal Makhani', category: 'North Indian', subcategory: 'Lentils', price: 249, description: 'Slow-cooked whole black lentils cooked overnight with cream and churned butter.', in_stock: 1, image: '/images/admin/dish_dal.jpg' },
      { id: 'item-4', name: 'Mango Lassi', category: 'Beverages & Desserts', subcategory: 'Chilled Drinks', price: 129, description: 'Thick, creamy yogurt churned with real Alphonso mango pulp and cardamom.', in_stock: 0, image: '/images/admin/dish_lassi.jpg' },
      { id: 'item-5', name: 'Garlic Naan', category: 'Breads & Rice', subcategory: 'Tandoor Breads', price: 49, description: 'Leavened flatbread brushed with garlic butter and fresh coriander.', in_stock: 1, image: '/images/admin/dish_naan.jpg' },
      { id: 'item-6', name: 'Butter Naan', category: 'Breads & Rice', subcategory: 'Tandoor Breads', price: 59, description: 'Layered tandoori bread slathered with pure dairy butter.', in_stock: 1, image: '/images/dish-detail/pairing-butter-naan.jpg' },
      { id: 'item-7', name: 'Shahi Paneer Butter Masala', category: 'North Indian', subcategory: 'Chef Specials', price: 299, description: 'Royal cashew-onion base gravy delicately spiced with saffron and paneer.', in_stock: 1, image: '/images/dish-detail/rec-shahi-paneer.jpg' },
      { id: 'item-8', name: 'Veg Biryani', category: 'Breads & Rice', subcategory: 'Dum Rice', price: 180, description: 'Fragrant basmati rice layered with garden vegetables, saffron and mint.', in_stock: 1, image: '/images/dish-detail/pairing-jeera-rice.jpg' },
      { id: 'item-9', name: 'Paneer Tikka Masala', category: 'North Indian', subcategory: 'Clay Oven', price: 279, description: 'Smoky grilled paneer cubes infused in spicy tandoori masala gravy.', in_stock: 1, image: '/images/dish-detail/rec-paneer-tikka-masala.jpg' },
      { id: 'item-10', name: 'Tandoori Tikka Platter', category: 'Starters', subcategory: 'Appetizers', price: 299, description: 'Assortment of grilled tandoori paneer, soya chaap and mushrooms with mint dip.', in_stock: 1, image: '/images/menu/dish-tandoori-tikka.jpg' },
      { id: 'item-11', name: 'Steamed Veg Momos', category: 'Starters', subcategory: 'Himalayan', price: 199, description: 'Delicate dumplings filled with finely chopped cabbage, carrots and herbs.', in_stock: 1, image: '/images/menu/dish-veg-momos.jpg' },
      { id: 'item-12', name: 'Gulab Jamun (2 Pcs)', category: 'Beverages & Desserts', subcategory: 'Sweets', price: 99, description: 'Warm khoya dumplings soaked in rose and cardamom syrup.', in_stock: 1, image: '/images/offers/dessert_bowl.jpg' },
      { id: 'item-13', name: 'Kadhai Paneer', category: 'North Indian', subcategory: 'Main Course', price: 289, description: 'Paneer cooked with freshly ground coriander and red chilies in a traditional wok.', in_stock: 1, image: '/images/dish-detail/rec-kadai-paneer.jpg' },
      { id: 'item-14', name: 'Chole Bhature (2 Pcs)', category: 'North Indian', subcategory: 'Punjabi Classics', price: 199, description: 'Spiced chickpea curry served with golden puffed bhaturas, pickles and onions.', in_stock: 1, image: '/images/menu/dish-chole-bhature.jpg' },
    ];

    const insertDish = db.prepare(`
      INSERT INTO dishes (id, name, category, subcategory, price, description, in_stock, image, rating, reviews_count, is_veg)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const d of defaultDishes) {
      insertDish.run(d.id, d.name, d.category, d.subcategory, d.price, d.description, d.in_stock, d.image, 4.8, 45, 1);
    }
  }

  // Seed Default Orders if not present
  const checkOrders = db.prepare('SELECT COUNT(*) as count FROM orders').get();
  if (!checkOrders || checkOrders.count === 0) {
    const defaultOrders = [
      {
        id: '#GW-8495',
        customer_name: 'Amit Verma',
        customer_phone: '+91 98123 45678',
        customer_address: 'Sector 14, Noida, UP (Hub Delivery)',
        order_type: 'Home Delivery',
        payment_mode: 'Cash on Delivery',
        special_instruction: 'Less Spicy / No Extra Butter',
        subtotal: 540,
        delivery_fee: 0,
        total: 540,
        status: 'New',
        placed_at: '2 mins ago',
        items: [
          { dish_id: 'item-3', name: 'Dal Makhani', price: 249, quantity: 1, image: '/images/dish-detail/rec-dal-makhani.jpg' },
          { dish_id: 'item-6', name: 'Butter Naan', price: 59, quantity: 2, image: '/images/dish-detail/pairing-butter-naan.jpg' },
          { dish_id: 'item-8', name: 'Veg Biryani', price: 180, quantity: 1, image: '/images/dish-detail/pairing-jeera-rice.jpg' },
        ],
      },
      {
        id: '#GW-8492',
        customer_name: 'Rahul Sharma',
        customer_phone: '+91 98765 43210',
        customer_address: 'Table No. 4',
        order_type: 'Dine-in',
        payment_mode: 'Paid via UPI',
        special_instruction: 'Jain Food (No Onion/Garlic)',
        subtotal: 526,
        delivery_fee: 0,
        total: 526,
        status: 'Preparing',
        placed_at: '15 mins ago',
        prep_time: 'Prep: 18 mins',
        items: [
          { dish_id: 'item-7', name: 'Shahi Paneer Butter Masala', price: 299, quantity: 1, image: '/images/dish-detail/rec-shahi-paneer.jpg' },
          { dish_id: 'item-5', name: 'Garlic Naan', price: 49, quantity: 2, image: '/images/dish-detail/pairing-garlic-naan.jpg' },
          { dish_id: 'item-4', name: 'Mango Lassi', price: 129, quantity: 1, image: '/images/orders/item3_mango_lassi.jpg' },
        ],
      },
      {
        id: '#GW-8488',
        customer_name: 'Vikram Malhotra',
        customer_phone: '+91 98451 23456',
        customer_address: 'Pickup at Narela Counter',
        order_type: 'Takeaway',
        payment_mode: 'Paid via UPI',
        special_instruction: 'Pack extra oregano & chilli flakes',
        subtotal: 528,
        delivery_fee: 0,
        total: 528,
        status: 'New',
        placed_at: '5 mins ago',
        items: [
          { dish_id: 'item-2', name: 'Farmhouse Pizza', price: 399, quantity: 1, image: '/images/menu/dish-farmhouse-pizza.jpg' },
          { dish_id: 'item-4', name: 'Mango Lassi', price: 129, quantity: 1, image: '/images/orders/item3_mango_lassi.jpg' },
        ],
      },
      {
        id: '#GW-8481',
        customer_name: 'Priya Kapoor',
        customer_phone: '+91 99901 22334',
        customer_address: 'Pocket 3, Sector A6, Narela, Delhi',
        order_type: 'Home Delivery',
        payment_mode: 'Paid via Card',
        special_instruction: '',
        subtotal: 408,
        delivery_fee: 0,
        total: 408,
        status: 'Out for Delivery',
        placed_at: '28 mins ago',
        prep_time: 'ETA: 10-15 mins',
        items: [
          { dish_id: 'item-9', name: 'Paneer Tikka Masala', price: 279, quantity: 1, image: '/images/dish-detail/rec-paneer-tikka-masala.jpg' },
          { dish_id: 'item-8', name: 'Jeera Rice', price: 129, quantity: 1, image: '/images/dish-detail/pairing-jeera-rice.jpg' },
        ],
      },
      {
        id: '#GW-8468',
        customer_name: 'Sneha Singh',
        customer_phone: '+91 98711 44556',
        customer_address: 'Table No. 2',
        order_type: 'Dine-in',
        payment_mode: 'Paid via UPI',
        special_instruction: '',
        subtotal: 794,
        delivery_fee: 0,
        total: 794,
        status: 'Completed',
        placed_at: '45 mins ago',
        completed_at: 'Completed at 6:50 PM',
        items: [
          { dish_id: 'item-1', name: 'Paneer Butter Masala', price: 299, quantity: 2, image: '/images/dish-detail/rec-shahi-paneer.jpg' },
          { dish_id: 'item-5', name: 'Garlic Naan', price: 98, quantity: 2, image: '/images/dish-detail/pairing-garlic-naan.jpg' },
        ],
      },
      {
        id: '#GW-8455',
        customer_name: 'Rajesh Kumar',
        customer_phone: '+91 99100 88776',
        customer_address: 'Alipur Extension (Beyond 15km Limit)',
        order_type: 'Home Delivery',
        payment_mode: 'Cash on Delivery',
        special_instruction: '',
        subtotal: 399,
        delivery_fee: 0,
        total: 399,
        status: 'Declined',
        decline_reason: 'Address location falls outside maximum 15km delivery hub radius.',
        placed_at: '1 hr 15 mins ago',
        items: [
          { dish_id: 'item-2', name: 'Farmhouse Pizza', price: 399, quantity: 1, image: '/images/menu/dish-farmhouse-pizza.jpg' },
        ],
      },
    ];

    const insertOrder = db.prepare(`
      INSERT INTO orders (id, customer_name, customer_phone, customer_address, order_type, payment_mode, special_instruction, subtotal, delivery_fee, total, status, decline_reason, placed_at, prep_time, completed_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertOrderItem = db.prepare(`
      INSERT INTO order_items (order_id, dish_id, name, price, quantity, image)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    for (const o of defaultOrders) {
      insertOrder.run(
        o.id,
        o.customer_name,
        o.customer_phone,
        o.customer_address,
        o.order_type,
        o.payment_mode,
        o.special_instruction || '',
        o.subtotal,
        o.delivery_fee,
        o.total,
        o.status,
        o.decline_reason || null,
        o.placed_at,
        o.prep_time || null,
        o.completed_at || null
      );

      for (const item of o.items) {
        insertOrderItem.run(o.id, item.dish_id, item.name, item.price, item.quantity, item.image);
      }
    }
  }

  // Seed Customer Profile & Addresses if not present
  const checkProfile = db.prepare('SELECT COUNT(*) as count FROM customer_profile').get();
  if (!checkProfile || checkProfile.count === 0) {
    db.prepare(`
      INSERT INTO customer_profile (phone, name, email, membership)
      VALUES (?, ?, ?, ?)
    `).run('+91 98765 43210', 'Rahul Sharma', 'rahul.sharma@example.com', 'Pure Veg Dining Club Member');

    const insertAddr = db.prepare(`
      INSERT INTO customer_addresses (id, customer_phone, type, address_line, phone, is_default)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    insertAddr.run('addr-1', '+91 98765 43210', 'Home', '123, Green Park, Sector 15, Noida, Uttar Pradesh - 201301', '+91 98765 43210', 1);
    insertAddr.run('addr-2', '+91 98765 43210', 'Office', 'Tower B, Cyber City, Phase 2, Gurugram, Haryana - 122002', '+91 98765 43210', 0);
  }
}
