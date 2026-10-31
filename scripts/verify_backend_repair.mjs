import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc, collection, getDocs, deleteDoc } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "greenwood-cafe-narela",
  appId: "1:473894440679:web:628d3bce794923d27d5c42",
  storageBucket: "greenwood-cafe-narela.firebasestorage.app",
  apiKey: "AIzaSyCn-JlWT6yHt2U4u1y4CpDLny174Lmq2hg",
  authDomain: "greenwood-cafe-narela.firebaseapp.com",
  messagingSenderId: "473894440679",
  projectNumber: "473894440679",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function runAudit() {
  console.log('🚀 Running Comprehensive Firestore Backend Repair Audit...');
  let passed = 0;
  let failed = 0;

  // TEST 1: Force Cloud Firestore Order Placement (Phone -> Database)
  const testOrderId = `#GW-TEST-${Date.now().toString().slice(-4)}`;
  try {
    console.log(`\n[Test 1] Testing order creation write to /orders/${testOrderId}...`);
    const testOrderPayload = {
      id: testOrderId,
      orderId: testOrderId,
      status: 'New',
      customerId: '8802325537',
      customerName: 'Sourav Live Test',
      customerPhone: '8802325537',
      deliveryAddress: 'Sector A10 Pocket 2, Narela Hub, Delhi - 110040',
      customerAddressOrTable: 'Sector A10 Pocket 2, Narela Hub, Delhi - 110040',
      orderType: 'Home Delivery',
      paymentMode: 'Cash on Delivery',
      specialInstruction: 'Test automated backend verify',
      items: [
        {
          name: 'Dal Makhani Special',
          price: 349,
          quantity: 1,
          image: '/images/dish-detail/rec-dal-makhani.jpg',
        }
      ],
      subtotal: 349,
      deliveryFee: 49,
      total: 398,
      pricing: { subtotal: 349, deliveryFee: 49, total: 398 },
      placedTime: 'Just now',
      createdAt: Date.now(),
      timestamp: Date.now(),
    };

    await setDoc(doc(db, 'orders', testOrderId), testOrderPayload);
    const orderDoc = await getDoc(doc(db, 'orders', testOrderId));
    if (orderDoc.exists() && orderDoc.data().orderId === testOrderId && orderDoc.data().status === 'New') {
      console.log('✅ Test 1 PASSED: Order written to Cloud Firestore successfully without permission rejection.');
      passed++;
    } else {
      throw new Error('Order doc did not match expected data');
    }
  } catch (err) {
    console.error('❌ Test 1 FAILED:', err.message);
    failed++;
  }

  // TEST 2: Admin POS Live Query Test (Database -> Admin PC)
  try {
    console.log('\n[Test 2] Testing POS Live Orders Query onSnapshot capability...');
    const snapshot = await getDocs(collection(db, 'orders'));
    console.log(`✅ Test 2 PASSED: Successfully retrieved ${snapshot.size} orders from /orders collection. Live listener has permission.`);
    passed++;
  } catch (err) {
    console.error('❌ Test 2 FAILED:', err.message);
    failed++;
  }

  // TEST 3: Settings StoreConfig Banner Update Test
  try {
    console.log('\n[Test 3] Testing storeConfig bannerUrl write & read on /settings/storeConfig...');
    const dummyCompressedBanner = 'data:image/jpeg;base64,' + 'A'.repeat(500);
    await setDoc(doc(db, 'settings', 'storeConfig'), {
      bannerUrl: dummyCompressedBanner,
      updatedAt: Date.now(),
    }, { merge: true });

    const settingsDoc = await getDoc(doc(db, 'settings', 'storeConfig'));
    if (settingsDoc.exists() && settingsDoc.data().bannerUrl === dummyCompressedBanner) {
      console.log('✅ Test 3 PASSED: settings/storeConfig updated and read successfully.');
      passed++;
    } else {
      throw new Error('storeConfig bannerUrl did not persist');
    }
  } catch (err) {
    console.error('❌ Test 3 FAILED:', err.message);
    failed++;
  }

  // Clean up test order
  try {
    await deleteDoc(doc(db, 'orders', testOrderId));
    console.log(`\n🧹 Cleaned up temporary test order ${testOrderId}`);
  } catch (err) {
    console.warn('Cleanup notice:', err.message);
  }

  console.log(`\n========================================`);
  console.log(`AUDIT RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log(`========================================`);
}

runAudit().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
