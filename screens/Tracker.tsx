import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Button, Alert} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {getFirestore, collection, addDoc} from 'firebase/firestore';
import db from '../firebaseConfig';
import auth from '@react-native-firebase/auth';
import {GeoPoint, Timestamp} from 'firebase/firestore';

const Tracker = () => {
  const [isTracking, setIsTracking] = useState(false);
  const [position, setPosition] = useState({latitude: null, longitude: null});
  const [tempCoordinates, setTempCoordinates] = useState([]);

  useEffect(() => {
    return () => {
      if (tempCoordinates.length > 0) {
        uploadCoordinatesToFirestore();
      }
    };
  }, [tempCoordinates]);

  const trackLocation = () => {
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

  const uploadCoordinatesToFirestore = async () => {
    const collectionRef = collection(db, 'captures');
    const currentUser = auth().currentUser;
    if (!currentUser) {
      console.error('No user is signed in');
      return;
    }

    const userId = currentUser.uid;
    const name = currentUser.displayName || 'Anonymous'; // Use 'Anonymous' if displayName is null

    try {
      for (const coord of tempCoordinates) {
        const geoPoint = new GeoPoint(coord.latitude, coord.longitude); // Create GeoPoint
        const timestamp = Timestamp.fromDate(new Date(coord.timestamp)); // Convert Date to Timestamp

        await addDoc(collectionRef, {
          Coordinates: geoPoint,
          PickedUpBy: name,
          Timestamp: timestamp,
          userId,
        });
      }
      console.log('All coordinates uploaded');
    } catch (error) {
      console.error('Error uploading coordinates:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Tracker</Text>
      <Button
        title={isTracking ? 'Tracking...' : 'Track'}
        onPress={trackLocation}
        disabled={isTracking}
      />
      {position.latitude && position.longitude && (
        <Text>
          Current Position: {'\n'}
          Latitude: {position.latitude} {'\n'}
          Longitude: {position.longitude}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default Tracker;
