// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
  // apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  apiKey: "AIzaSyBZLeWg3myoo0cPrM3rX-duchiCgOm63f0",
  authDomain: "mern-blog-95d9d.firebaseapp.com",
  projectId: "mern-blog-95d9d",
  storageBucket: "mern-blog-95d9d.appspot.com",
  messagingSenderId: "885786669911",
  appId: "1:885786669911:web:338be4ad29b75fb123c412"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);