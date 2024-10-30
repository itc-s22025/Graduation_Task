import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD22eTdZNz7vt9e1rtbvbo1sDBI5up-_wQ",
  authDomain: "ppg-for-graduation-task.firebaseapp.com",
  projectId: "ppg-for-graduation-task",
  storageBucket: "ppg-for-graduation-task",
  messagingSenderId: "760907629298",
  appId: "1:760907629298:web:0f1767788d03889f02866b",
  measurementId: "G-J85DJTWN8B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };