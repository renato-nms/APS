// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDaUjus1vuJdBfwHYA51_9o8k_heD0LWLY",
  authDomain: "cdrbd-5e87c.firebaseapp.com",
  projectId: "cdrbd-5e87c",
  storageBucket: "cdrbd-5e87c.firebasestorage.app",
  messagingSenderId: "552743120779",
  appId: "1:552743120779:web:001df1492e4fb7f8a7898e",
  measurementId: "G-H74ND29CVB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);