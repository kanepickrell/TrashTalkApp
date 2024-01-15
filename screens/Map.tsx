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

// San Antonio coordinates as a fallback
const MANHATTEN_KS_COORDS = {latitude: 39.1836, longitude: 96.5717};

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
  const collectionRef = collection(db, 'locations');
  const snapshot = await getDocs(collectionRef);
  const coordinates = snapshot.docs.map(doc => doc.data());
  console.log(coordinates);
  return coordinates;
};

// const coordinates = fetchCoordinates();

const MapScreen = () => {
  // const trashPickups = [
  //   {id: 1, latitude: 29.495778, longitude: -98.4464974},
  //   {id: 2, latitude: 29.495798, longitude: -98.4464984},
  //   {id: 3, latitude: 29.495779, longitude: -98.4464944},
  //   {id: 4, latitude: 29.495768, longitude: -98.4464992},
  //   {id: 5, latitude: 29.495758, longitude: -98.4464932},
  // ];

  const defaultRegion = {
    latitude: 0,
    longitude: 0,
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
        setCurrentRegion({
          ...defaultRegion,
          latitude: MANHATTEN_KS_COORDS.latitude,
          longitude: MANHATTEN_KS_COORDS.longitude,
        });
      }

      // Fetch coordinates from Firestore irrespective of permission status
      const fetchedCoordinates = await fetchCoordinates();
      setLocations(fetchedCoordinates);
    };

    requestAndLoadLocation();
  }, []);

  const fetchCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        console.log('Current Position:', position);
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
        // Use San Antonio as fallback
        setCurrentRegion({
          ...defaultRegion,
          latitude: MANHATTEN_KS_COORDS.latitude,
          longitude: MANHATTEN_KS_COORDS.longitude,
        });
      },
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );
  };

  return (
    <View style={styles.container}>
      <MapView style={styles.map} region={currentRegion}>
        {locations.map((location, index) => (
          <Marker
            key={location.id || index} // Use Firestore document ID or index as a fallback
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title={`Location ${location.id || index}`} // Adjust title as needed
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
