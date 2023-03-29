import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth/react-native";

const firebaseConfig = {
  apiKey: "AIzaSyBjumqmvJm1Ayh_wyIhQ0gGjSnWmf5se50",
  authDomain: "auth-exaple.firebaseapp.com",
  projectId: "auth-exaple",
  storageBucket: "auth-exaple.appspot.com",
  messagingSenderId: "1008134061025",
  appId: "1:1008134061025:web:1212d6ee1959385791b0a0",
  measurementId: "G-GV6YDYEVE0",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const storage = getStorage(app);
export const db = getFirestore(app);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
