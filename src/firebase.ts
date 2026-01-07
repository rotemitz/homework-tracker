import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBvjpD-YaKweeQx_QtiXnyhoavDNuCHjMA",
    authDomain: "homework-tracker-fcded.firebaseapp.com",
    projectId: "homework-tracker-fcded",
    storageBucket: "homework-tracker-fcded.firebasestorage.app",
    messagingSenderId: "204539353658",
    appId: "1:204539353658:web:bc84d7f84d765a47383303",
    measurementId: "G-Y8NK6P9DZR"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
