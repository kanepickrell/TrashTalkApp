import React, {useState} from 'react';
import {View, Text, StyleSheet, Button, Alert} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
// import firebase from './firebase';
import firebase from 'firebase/compat/app';
import db from '../firebaseConfig';

const Tracker = () => {
  const [isTracking, setIsTracking] = useState(false);

  const trackLocation = () => {
    setIsTracking(true);
    Geolocation.getCurrentPosition(
      async position => {
        const {latitude, longitude} = position.coords;
        try {
          await db.collection('locations').add({
            latitude,
            longitude,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          });
          Alert.alert(
            'Location Tracked',
            `Latitude: ${latitude}, Longitude: ${longitude}`,
          );
        } catch (error) {
          console.error(error);
          Alert.alert('Error', 'Failed to track location');
        }
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
