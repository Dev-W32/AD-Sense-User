// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getDatabase } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCJIHg5uH0CRiliBWd5xpQMeIGi5IFihwo",
  authDomain: "ad-sense-9a2e4.firebaseapp.com",
  projectId: "ad-sense-9a2e4",
  storageBucket: "ad-sense-9a2e4.appspot.com",
  messagingSenderId: "74047843069",
  appId: "1:74047843069:web:42402b48d5fbbd26edac94",
  measurementId: "G-K37PD8W1QM",
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);

const db = getDatabase(app);

export { db };
