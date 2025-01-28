import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  signInAnonymously,
  onAuthStateChanged,
} from "firebase/auth";

// Copy these from your Firebase project settings
const firebaseConfig = {
  apiKey: "AIzaSyB1i2thHBG7NGM4JTPlT1L9wGP27nW8f5k",
  authDomain: "bwithyouinwza.firebaseapp.com",
  projectId: "bwithyouinwza",
  storageBucket: "bwithyouinwza.firebasestorage.app",
  messagingSenderId: "825667949714",
  appId: "1:825667949714:web:c644238659f4831d6fc24b",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export {
  auth,
  signInWithEmailAndPassword,
  signInAnonymously,
  onAuthStateChanged,
};
