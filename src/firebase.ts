import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDhpjvh42ire0KY7jmE0vwczxpX3MwMHfI",
  authDomain: "gamexfeed.firebaseapp.com",
  projectId: "gamexfeed",
  storageBucket: "gamexfeed.firebasestorage.app",
  messagingSenderId: "581144239471",
  appId: "1:581144239471:web:9e07dd19f7d09e242b9c9a"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();