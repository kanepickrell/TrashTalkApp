import {initializeApp} from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  // ...
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get a reference to the Firestore service
const db = getFirestore(app);

// Get a reference to the 'locations' collection
const locationsCollection = collection(db, 'locations');

// Add a new document to the 'locations' collection
const trackLocation = async (latitude, longitude) => {
  try {
    await addDoc(locationsCollection, {
      latitude,
      longitude,
      timestamp: serverTimestamp(),
    });
    // ...
  } catch (error) {
    // Handle the error
  }
};
