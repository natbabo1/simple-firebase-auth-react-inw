import { initializeApp, getApps } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  signInAnonymously,
  onAuthStateChanged,
} from "firebase/auth";

// Default Firebase config. Replace with your project's config if needed.
export const defaultConfig = {
  apiKey: "AIzaSyB1i2thHBG7NGM4JTPlT1L9wGP27nW8f5k",
  authDomain: "bwithyouinwza.firebaseapp.com",
  projectId: "bwithyouinwza",
  storageBucket: "bwithyouinwza.appspot.com",
  messagingSenderId: "825667949714",
  appId: "1:825667949714:web:c644238659f4831d6fc24b",
};

// Create or reuse a Firebase app and return its auth instance
export const createAuth = (config = defaultConfig) => {
  const name = config.projectId || `app-${getApps().length}`;
  const existing = getApps().find((a) => a.name === name);
  const app = existing || initializeApp(config, name);
  return getAuth(app);
};

export {
  signInWithEmailAndPassword,
  signInAnonymously,
  onAuthStateChanged,
};
