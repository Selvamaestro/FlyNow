import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";

import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDCBQD6OWdlL92grQ5P-z3mMgEEI4dRPBs",
  authDomain: "flynow-d1b09.firebaseapp.com",
  projectId: "flynow-d1b09",
  storageBucket: "flynow-d1b09.firebasestorage.app",
  messagingSenderId: "73494829766",
  appId: "1:73494829766:web:68dfca97b8ce0964db55c7"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);

export default app;