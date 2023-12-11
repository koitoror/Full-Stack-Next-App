import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore/lite';
import type { Firestore } from 'firebase/firestore/lite';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

console.log('firebaseConfig  → ', firebaseConfig)


const app = initializeApp(firebaseConfig);
export default app;

// export const db: Firestore = getFirestore(app);
const db: Firestore = getFirestore(app);

export { db };