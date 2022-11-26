import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD243djxwnLoP4tSfW0CUqOlE-3z0UQGL4",
  authDomain: "test-6e6e8.firebaseapp.com",
  projectId: "test-6e6e8",
  storageBucket: "test-6e6e8.appspot.com",
  messagingSenderId: "541343843596",
  appId: "1:541343843596:web:7f5af8f2e7113d68a53529",
  measurementId: "G-35MBSYNCVH",
};

// Firebase storage reference
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
export default storage;
