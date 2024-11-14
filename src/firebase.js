// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCpakKCsD5fer-DAOBAIrl4ZfNnyTg0VZc",
    authDomain: "grow-space-app.firebaseapp.com",
    projectId: "grow-space-app",
    storageBucket: "grow-space-app.appspot.com",
    messagingSenderId: "263197662345",
    appId: "1:263197662345:web:1e2e7e7ba70adca72c3a58",
    measurementId: "G-9JMX14PJF8"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
