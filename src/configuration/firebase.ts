// firebase.ts
import firebase from 'firebase/app';
import 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyC5qWlfe2Vgyrc-TAkBSpRDV-ydznolYlQ",
    authDomain: "proiectkitty.firebaseapp.com",
    projectId: "proiectkitty",
    storageBucket: "proiectkitty.appspot.com",
    messagingSenderId: "33640263790",
    appId: "1:33640263790:web:91edcb0632ca0f4464b67f",
    measurementId: "G-H7STYQBWWR"
};

firebase.initializeApp(firebaseConfig);

export default firebase;
