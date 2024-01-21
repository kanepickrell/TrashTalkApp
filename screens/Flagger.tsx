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

const Flagger = () => {
  const [isTracking, setIsTracking] = useState(false);
  const [position, setPosition] = useState({latitude: null, longitude: null});
  const [tempCoordinates, setTempCoordinates] = useState([]);
  const [TotalFlagsPlaced, setTotalFlagsPlaced] = useState(0); // Updated state variable name
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

  const addCoordToFlags = async () => {
    const collectionRef = collection(db, 'flags');
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
      console.log('All flag coordinates uploaded');
    } catch (error) {
      console.error('Error uploading coordinates:', error);
    }
  };

  const add2TotalFlagsPlaced = async () => {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('Username', '==', currentUser));

    try {
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userDocRef = userDoc.ref;

        await updateDoc(userDocRef, {
          TotalFlagsPlaced: increment(tempCoordinates.length),
        });
      } else {
        console.log('User not found');
      }
    } catch (error) {
      console.error('Error updating user total flags placed:', error);
    }
  };

  const fetchTotalFlagsPlaced = async () => {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('Username', '==', currentUser));

    try {
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userDocData = userDoc.data();
        const totalFlagsPlaced = userDocData.TotalFlagsPlaced;

        setTotalFlagsPlaced(totalFlagsPlaced);
      } else {
        console.log('Creating new user document');
        const newUserRef = doc(collection(db, 'users'));
        await setDoc(newUserRef, {
          Username: currentUser,
          TotalFlagsPlaced: 0,
          userId: auth().currentUser?.uid,
        });
        setTotalFlagsPlaced(0);
      }
    } catch (error) {
      console.error('Error fetching user total flags placed:', error);
    }
  };

  useEffect(() => {
    fetchTotalFlagsPlaced();
  }, []);

  useEffect(() => {
    const updateFirestore = async () => {
      if (tempCoordinates.length > 0) {
        await addCoordToFlags();
        await add2TotalFlagsPlaced();
        await fetchTotalFlagsPlaced();
        setTempCoordinates([]);
      }
    };

    updateFirestore();
  }, [tempCoordinates]);

  return (
    <View style={styles.container}>
      <Text style={styles.textdisplay}>Today's Total: {TotalFlagsPlaced} </Text>
      <Button
        title={isTracking ? 'Placing...' : 'Place'}
        onPress={trackLocation}
        disabled={isTracking}
        color="red"
      />
      <Button
        title="Tracker"
        color="blue"
        onPress={() => navigation.navigate('Tracker')}
      />
      {position.latitude && position.longitude && (
        <Text>
          Current Position: {'\n'}
          Latitude: {position.latitude} {'\n'}
          Longitude: {position.longitude}
        </Text>
      )}
    </View>
  ); // Added closing parenthesis
};

const styles = StyleSheet.create({
  // Corrected syntax
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  textdisplay: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'black',
  },
}); // Added closing parenthesis

export default Flagger;
