
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB3k-u7M7K8YPViZyH3Avod7I3nRk8ypdE",
  authDomain: "aps-prep.firebaseapp.com",
  projectId: "aps-prep",
  // 如遇 Storage 访问异常，可尝试改为 "aps-prep.appspot.com"
  storageBucket: "aps-prep.firebasestorage.app",
  messagingSenderId: "767702991428",
  appId: "1:767702991428:web:ddf9b7bfa50d6429fbf211",
  measurementId: "G-Z7MJ4NSR8G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

