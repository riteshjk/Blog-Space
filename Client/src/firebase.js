// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-51f70.firebaseapp.com",
  projectId: "mern-blog-51f70",
  storageBucket: "mern-blog-51f70.appspot.com",
  messagingSenderId: "670423849461",
  appId: "1:670423849461:web:858eeee3d48366f5c0e8bc"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);