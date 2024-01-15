import firebase from 'firebase/app';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCbvfCNMcPP5_AsB9ZFkO1_2eL8A2fKl2s', // From "api_key" -> "current_key"
  authDomain: 'trashtalkapp-d4f12.firebaseapp.com', // Usually projectId followed by '.firebaseapp.com'
  projectId: 'trashtalkapp-d4f12', // From "project_info" -> "project_id"
  storageBucket: 'trashtalkapp-d4f12.appspot.com', // From "project_info" -> "storage_bucket"
  messagingSenderId: '792835698338', // From "project_info" -> "project_number"
  appId: '1:792835698338:android:1d5d39135528c465e971fb', // From "client" -> "client_info" -> "mobilesdk_app_id"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); // if already initialized, use that one
}

export const db = firebase.firestore();
