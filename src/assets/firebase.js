// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "AIzaSyBuofcSxEVVETSdVPwfrwX1DmqzLPq41vU",
  authDomain: "grocery-list-54ddf.firebaseapp.com",
  databaseURL: "https://grocery-list-54ddf-default-rtdb.firebaseio.com",
  projectId: "grocery-list-54ddf",
  storageBucket: "grocery-list-54ddf.appspot.com",
  messagingSenderId: "844158994963",
  appId: "1:844158994963:web:78ed629b7fa3c00d0ecde6",
  measurementId: "G-BJVBNNNCCM",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const analytics =
  app.name && typeof window !== "undefined" ? getAnalytics(app) : null;

export const db = getDatabase();

export const storage = getStorage();
