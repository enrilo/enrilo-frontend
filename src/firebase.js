// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// Import the functions you need from the SDKs you need

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD2UFFlexh4MRQT8M56wwL0mQEf9cE2suQ",
  authDomain: "enrilo-68d02.firebaseapp.com",
  projectId: "enrilo-68d02",
  storageBucket: "enrilo-68d02.firebasestorage.app",
  messagingSenderId: "1080090488407",
  appId: "1:1080090488407:web:d11b7263147b1a0a733d12"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
// const analytics = getAnalytics(app);