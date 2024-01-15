import React, {useState} from 'react';
import {View, Text, StyleSheet, Button, Alert} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import db from '../firebaseConfig';

const Tracker = () => {
  const [isTracking, setIsTracking] = useState(false);
  const [position, setPosition] = useState({latitude: null, longitude: null});

  const trackLocation = () => {
    setIsTracking(true);
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        setPosition({latitude, longitude});

        const trackLocationInFirestore = async (latitude, longitude) => {
          try {
            const timestamp = serverTimestamp();
            const collectionRef = collection(db, 'locations');

            // Update these fields as per your requirement
            const userId = 'DvoLe0z9Q3Ir2l5gW8rh'; // Example user ID
            const name = 'John Doe'; // Example user name

            const docRef = await addDoc(collectionRef, {
              latitude,
              longitude,
              timestamp,
              userId, // Save user ID
              name, // Save user name
            });

            console.log('Location Tracked:', docRef.id);
            Alert.alert(
              'Location Tracked',
              `Latitude: ${latitude}, Longitude: ${longitude}, User: ${name}`,
            );
          } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to track location');
          }
        };

        trackLocationInFirestore(latitude, longitude);
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
