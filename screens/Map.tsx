import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  PermissionsAndroid,
  Text,
} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import {getFirestore, collection, getDocs} from 'firebase/firestore';
import db from '../firebaseConfig';

async function requestLocationPermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Geolocation Permission',
        message: 'Can we access your location?',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can use the location');
      return true;
    } else {
      console.log('Location permission denied');
      return false;
    }
  } catch (err) {
    console.warn(err);
    return false;
  }
}

const fetchCoordinates = async () => {
  try {
    const collectionRef = collection(db, 'captures');
    const snapshot = await getDocs(collectionRef);
    // Ensure data has the correct structure and map it accordingly
    return snapshot.docs
      .map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          latitude: data.Coordinates.latitude,
          longitude: data.Coordinates.longitude,
        };
      })
      .filter(coord => coord.latitude && coord.longitude);
  } catch (error) {
    console.error('Error fetching coordinates:', error);
    return [];
  }
};

const MapScreen = () => {
  const defaultRegion = {
    latitude: 39.1836, // Manhatten, KS
    longitude: 96.5717,
    latitudeDelta: 0.0005,
    longitudeDelta: 0.0005,
  };

  const [currentRegion, setCurrentRegion] = useState(defaultRegion);
  const [isLoading, setIsLoading] = useState(true);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const requestAndLoadLocation = async () => {
      const permissionGranted = await requestLocationPermission();
      if (permissionGranted) {
        fetchCurrentLocation();
      } else {
        setIsLoading(false);
      }

      // Check if locations is already populated
      if (locations.length === 0) {
        const fetchedCoordinates = await fetchCoordinates();
        setLocations(fetchedCoordinates);
      }
    };

    requestAndLoadLocation();
  }, []); // Empty dependency array ensures this effect only runs once after the initial render

  const fetchCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        setCurrentRegion({
          ...currentRegion,
          latitude,
          longitude,
        });
        setIsLoading(false);
      },
      error => {
        console.error('Location Error:', error);
        setIsLoading(false);
      },
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );
  };

  return (
    <View style={styles.container}>
      <MapView style={styles.map} region={currentRegion}>
        {locations.map((location, index) => (
          <Marker
            key={location.id || index}
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title={`Location ${location.id || index}`}
            description={`Latitude: ${location.latitude}, Longitude: ${location.longitude}`}>
            <View style={styles.customMarker} />
          </Marker>
        ))}
      </MapView>
      {isLoading ? <Text>Loading...</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  customMarker: {
    height: 10,
    width: 10,
    backgroundColor: 'green',
    borderRadius: 5,
  },
});

export default MapScreen;
