import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: 'AIzaSyCz0xxP_jFMZI8o-ArnM5OAQiCUmdsFYFY',
    authDomain: 'nwitter-reloaded-f58e0.firebaseapp.com',
    projectId: 'nwitter-reloaded-f58e0',
    storageBucket: 'nwitter-reloaded-f58e0.appspot.com',
    messagingSenderId: '311985155047',
    appId: '1:311985155047:web:dbc2c529fbb513c3ee2b42',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const storage = getStorage(app);

export const db = getFirestore(app);
