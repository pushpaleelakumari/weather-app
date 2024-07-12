// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore, addDoc, collection } from 'firebase/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyChcv45TyE7jVzR3C9f4M0-MrSo9fzyXyA",
  authDomain: "weather-app-d519a.firebaseapp.com",
  projectId: "weather-app-d519a",
  storageBucket: "weather-app-d519a.appspot.com",
  messagingSenderId: "208058473038",
  appId: "1:208058473038:web:b416a2c5b25e68895dc11f",
  measurementId: "G-F4S8FF9WFY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, addDoc, collection };