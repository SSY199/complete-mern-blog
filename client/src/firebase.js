// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mernblog1-7457d.firebaseapp.com",
  projectId: "mernblog1-7457d",
  storageBucket: "mernblog1-7457d.firebasestorage.app",
  messagingSenderId: "220202279772",
  appId: "1:220202279772:web:621e276df27d97abe41799",
  measurementId: "G-PHMV5412J6"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default { analytics };