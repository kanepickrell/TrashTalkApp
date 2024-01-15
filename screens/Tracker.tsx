import React, {useState} from 'react';
import {View, Text, StyleSheet, Button, Alert} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
// import firebase from 'firebase/compat/app';
// import 'firebase/compat/firestore'; // Import Firestore from compat
// import db from '../firebaseConfig';

const Tracker = () => {
  const [isTracking, setIsTracking] = useState(false);
  const [position, setPosition] = useState({latitude: null, longitude: null});

  const trackLocation = () => {
    setIsTracking(true);
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        setPosition({latitude, longitude}); // Save position to state
        Alert.alert(
          'Location Tracked',
          `Latitude: ${latitude}, Longitude: ${longitude}`,
        );
        setIsTracking(false);

        // Firebase code is commented out
        // try {
        //   await db.collection('locations').add({
        //     latitude,
        //     longitude,
        //     timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        //   });
        // } catch (error) {
        //   console.error(error);
        //   Alert.alert('Error', 'Failed to track location');
        // }
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
