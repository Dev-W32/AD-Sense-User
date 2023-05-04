import firebase from "firebase/app";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCJIHg5uH0CRiliBWd5xpQMeIGi5IFihwo",
  authDomain: "ad-sense-9a2e4.firebaseapp.com",
  projectId: "ad-sense-9a2e4",
  storageBucket: "ad-sense-9a2e4.appspot.com",
  messagingSenderId: "74047843069",
  appId: "1:74047843069:web:42402b48d5fbbd26edac94",
  measurementId: "G-K37PD8W1QM",
};

const app = firebase.initializeApp(firebaseConfig);

const db = firebase.firestore(app);

export { db };
