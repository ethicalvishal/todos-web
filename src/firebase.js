// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBOTUhk6GrWbORimWrTrtyrxtfoJ6jNu1w",
  authDomain: "todos-app-ec56f.firebaseapp.com",
  projectId: "todos-app-ec56f",
  storageBucket: "todos-app-ec56f.firebasestorage.app",
  messagingSenderId: "100213454986",
  appId: "1:100213454986:web:ac930ebdc9409ac96c9573",
  measurementId: "G-N4BZSE16CC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);