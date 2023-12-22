import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

//const firebaseConfig = {
//  apiKey: import.meta.env.VITE_FIREBASE_APIKEY as string,
//  authDomain: "quizly-0.firebaseapp.com",
//  projectId: "quizly-0",
//  storageBucket: "quizly-0.appspot.com",
//  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_ID as string,
//  appId: import.meta.env.VITE_FIREBASE_APP_ID as string,
//};
const firebaseConfig = {
  apiKey: "AIzaSyDVr_qmV-zq5G5IlcCLB6XH4p6IoFqtNFA",
  authDomain: "quizly-0.firebaseapp.com",
  projectId: "quizly-0",
  storageBucket: "quizly-0.appspot.com",
  messagingSenderId: "834236119439",
  appId: "1:834236119439:web:373c7d3858a4709335f3fa",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
