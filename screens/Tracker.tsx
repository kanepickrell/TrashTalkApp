import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Button, Alert} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  getDocs,
  updateDoc,
  setDoc,
  query,
  where,
  increment,
} from 'firebase/firestore';
import db from '../firebaseConfig';
import auth from '@react-native-firebase/auth';
import {GeoPoint, Timestamp} from 'firebase/firestore';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {useNavigation} from '@react-navigation/native';

const Tracker = () => {
  const [isTracking, setIsTracking] = useState(false);
  const [position, setPosition] = useState({latitude: null, longitude: null});
  const [tempCoordinates, setTempCoordinates] = useState([]);
  const [TotalTrashPickedUp, setTotalTrashPickedUp] = useState(0);
  const currentUser = auth().currentUser?.displayName;
  const navigation = useNavigation();

  const trackLocation = () => {
    if (isTracking) {
      return; // Prevents the function from running if it's already in progress
    }

    setIsTracking(true);
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        setPosition({latitude, longitude});
        const newCoord = {latitude, longitude, timestamp: new Date()};
        setTempCoordinates(prevCoords => [...prevCoords, newCoord]);
        setIsTracking(false);
      },
      error => {
        console.error(error);
        Alert.alert('Error', 'Unable to fetch location');
        setIsTracking(false);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  const addCoordToCaptures = async () => {
    const collectionRef = collection(db, 'captures');
    const currentUser = auth().currentUser;
    if (!currentUser) {
      console.error('No user is signed in');
      return;
    }

    const userId = currentUser.uid;
    const name = currentUser.displayName || 'Anonymous';

    try {
      for (const coord of tempCoordinates) {
        const geoPoint = new GeoPoint(coord.latitude, coord.longitude);
        const timestamp = Timestamp.fromDate(new Date(coord.timestamp));

        await addDoc(collectionRef, {
          Coordinates: geoPoint,
          PickedUpBy: name,
          Timestamp: timestamp,
          userId,
        });
      }
      console.log('All capture coordinates uploaded');
    } catch (error) {
      console.error('Error uploading coordinates:', error);
    }
  };

  const add2TotalTrashPickedUp = async () => {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('Username', '==', currentUser));

    try {
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userDocRef = userDoc.ref;

        await updateDoc(userDocRef, {
          TotalTrashPickedUp: increment(tempCoordinates.length),
        });
      } else {
        console.log('User not found');
      }
    } catch (error) {
      console.error('Error updating user total trash picked up:', error);
    }
  };

  const fetchTotalTrashPickedUp = async () => {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('Username', '==', currentUser));

    try {
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userDocData = userDoc.data();

        setTotalTrashPickedUp(userDocData.TotalTrashPickedUp);

        console.log(
          'User total trash picked up:',
          userDocData.TotalTrashPickedUp,
        );
      } else {
        console.log('Creating new user document');
        const newUserRef = doc(collection(db, 'users'));
        await setDoc(newUserRef, {
          Username: currentUser,
          TotalTrashPickedUp: 0,
          userId: auth().currentUser?.uid,
        });
        setTotalTrashPickedUp(0);
      }
    } catch (error) {
      console.error('Error fetching user total trash picked up:', error);
    }
  };

  useEffect(() => {
    fetchTotalTrashPickedUp();
  }, []);

  useEffect(() => {
    const updateFirestore = async () => {
      if (tempCoordinates.length > 0) {
        await addCoordToCaptures();
        await add2TotalTrashPickedUp();
        await fetchTotalTrashPickedUp();
        setTempCoordinates([]);
      }
    };

    updateFirestore();

    return () => {
      // Cleanup if necessary
    };
  }, [tempCoordinates]);

  return (
    <View style={styles.container}>
      <Text style={styles.textdisplay}>
        Today's Total: {TotalTrashPickedUp}{' '}
      </Text>
      <Button
        title={isTracking ? 'Tracking...' : 'Track'}
        onPress={trackLocation}
        disabled={isTracking}
        color="green"
      />
      <Button
        title="Flagger"
        onPress={() => navigation.navigate('Flagger')} // Make sure the Tracker screen is defined in your navigator
        color="blue"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2D6E5D',
    marginBottom: 20,
  },
  textdisplay: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'black',
  },
  flaggerButton: {
    // Your existing styles...
    marginBottom: 20, // Add space at the bottom of the Flagger button
  },

  trackButton: {
    // Your existing styles...
    marginTop: 20, // Add space at the top of the Track button
  },
});

export default Tracker;
