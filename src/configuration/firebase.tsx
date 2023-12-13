import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage"; // Add this import for Firebase Storage

const firebaseConfig = {
  apiKey: "AIzaSyDEIrLSFC3NmuNWXrvyrF1Hs7ekgHZkRp8",
  authDomain: "travelapp-fd464.firebaseapp.com",
  projectId: "travelapp-fd464",
  storageBucket: "travelapp-fd464.appspot.com",
  messagingSenderId: "598407549637",
  appId: "1:598407549637:web:797f3d867e71fa242756ac",
  measurementId: "G-ZYXZ8FSH2H",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get the authentication instance
const authInstance = getAuth(app);

// Get the Firestore instance
const firestoreInstance = getFirestore(app);

// Get the Realtime Database instance
const databaseInstance = getDatabase(app);

// Get the Storage instance
const storageInstance = getStorage(app);

// Subscribe to changes in authentication state
onAuthStateChanged(authInstance, (user) => {
  if (user) {
    // User is signed in, you can access user data
    const uid = user.uid;
    const email = user.email;
    // Add other user properties as needed
    console.log("Authenticated user:", user);
  } else {
    // User is signed out
    console.log("No user signed in.");
  }
});

export {
  authInstance as auth,
  firestoreInstance as firestore,
  databaseInstance as database,
  storageInstance as storage, // Export the Storage instance
  app as firebase,
};
