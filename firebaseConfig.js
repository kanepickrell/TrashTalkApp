// Import the functions you need from the SDKs you need
import {initializeApp} from 'firebase/app';
import {getFirestore} from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCbvfCNMcPP5_AsB9ZFkO1_2eL8A2fKl2s',
  authDomain: 'trashtalkapp-d4f12.firebaseapp.com',
  projectId: 'trashtalkapp-d4f12',
  storageBucket: 'trashtalkapp-d4f12.appspot.com',
  messagingSenderId: '792835698338',
  appId: '1:792835698338:android:1d5d39135528c465e971fb',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get a reference to the Firestore service
const db = getFirestore(app);

export default db;
