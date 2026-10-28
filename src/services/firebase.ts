import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

export const firebaseConfig = {
  projectId: "greenwood-cafe-narela",
  appId: "1:473894440679:web:628d3bce794923d27d5c42",
  storageBucket: "greenwood-cafe-narela.firebasestorage.app",
  apiKey: "AIzaSyCn-JlWT6yHt2U4u1y4CpDLny174Lmq2hg",
  authDomain: "greenwood-cafe-narela.firebaseapp.com",
  messagingSenderId: "473894440679",
  projectNumber: "473894440679",
};

export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

let firestoreInstance = null;
try {
  firestoreInstance = getFirestore(app);
} catch (err) {
  console.warn('[Firebase] Firestore client init notice:', err);
}

let authInstance: any = null;
try {
  authInstance = getAuth(app);
} catch (err) {
  console.warn('[Firebase] Auth client init notice:', err);
}

export const firestore = firestoreInstance;
export const auth = authInstance;
export const googleProvider = new GoogleAuthProvider();
