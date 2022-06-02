import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAuMrvLDKGS-HbTMEgHd2xHSb-wlwLjzik",
  authDomain: "beaming-gadget-351716.firebaseapp.com",
  projectId: "beaming-gadget-351716",
  storageBucket: "beaming-gadget-351716.appspot.com",
  messagingSenderId: "754962440375",
  appId: "1:754962440375:web:669a0acc316cb9f67bad32",
  measurementId: "G-F0PKQTZJ8T",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const database = getFirestore(app);
export const storage = getStorage(app);
