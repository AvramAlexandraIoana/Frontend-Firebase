// firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth, Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyDEIrLSFC3NmuNWXrvyrF1Hs7ekgHZkRp8",
    authDomain: "travelapp-fd464.firebaseapp.com",
    projectId: "travelapp-fd464",
    storageBucket: "travelapp-fd464.appspot.com",
    messagingSenderId: "598407549637",
    appId: "1:598407549637:web:797f3d867e71fa242756ac",
    measurementId: "G-ZYXZ8FSH2H"
};
  

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get the authentication instance
export const auth: Auth = getAuth(app);

export { createUserWithEmailAndPassword, signInWithEmailAndPassword }; // Export the methods explicitly

export default app;
