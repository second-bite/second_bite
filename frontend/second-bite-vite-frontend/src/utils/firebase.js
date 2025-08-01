// Firebase imports from relevant SDKs
import { initializeApp } from "firebase/app";
import { getStorage, ref } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const env = import.meta.env
const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
  measurementId: env.VITE_FIREBASE_MEASUREMENT_ID
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Create a root storage reference
const storage = getStorage(app)

// Create an images directory to store restaurant images
export const images_ref = ref(storage, 'images')