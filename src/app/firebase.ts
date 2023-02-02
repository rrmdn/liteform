import firebase from "firebase/compat/app";
import { getFirestore } from "firebase/firestore";
import "firebase/compat/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC-zrdnJTVjTaHtM2iWpw_54s2xn4cWQV0",
  authDomain: "liteform-29024.firebaseapp.com",
  projectId: "liteform-29024",
  storageBucket: "liteform-29024.appspot.com",
  messagingSenderId: "861289022786",
  appId: "1:861289022786:web:169ed785c3f5354a1874db",
  measurementId: "G-50G20VWXGX",
};

export const app = firebase.initializeApp(firebaseConfig);

export const db = getFirestore(app);

export default firebase;
