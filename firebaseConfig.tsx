// Import the functions you need from the SDKs you need
import {initializeApp, FirebaseApp} from 'firebase/app';
import {getFirestore, Firestore} from 'firebase/firestore';

// Define the structure of your Firebase configuration object
interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

// Your web app's Firebase configuration
const firebaseConfig: FirebaseConfig = {
  apiKey: 'AIzaSyCbvfCNMcPP5_AsB9ZFkO1_2eL8A2fKl2s',
  authDomain: 'trashtalkapp-d4f12.firebaseapp.com',
  projectId: 'trashtalkapp-d4f12',
  storageBucket: 'trashtalkapp-d4f12.appspot.com',
  messagingSenderId: '792835698338',
  appId: '1:792835698338:android:1d5d39135528c465e971fb',
};

// Initialize Firebase
const app: FirebaseApp = initializeApp(firebaseConfig);

// Get a reference to the Firestore service
const db: Firestore = getFirestore(app);

export default db;
