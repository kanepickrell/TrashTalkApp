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

const MapScreen = () => {
  const trashPickups = [
    {id: 1, latitude: 29.495778, longitude: -98.4464974},
    {id: 2, latitude: 29.495798, longitude: -98.4464984},
    {id: 3, latitude: 29.495779, longitude: -98.4464944},
    {id: 4, latitude: 29.495768, longitude: -98.4464992},
    {id: 5, latitude: 29.495758, longitude: -98.4464932},
    {id: 6, latitude: 29.4963686, longitude: -98.4466652},
  ];

  const defaultRegion = {
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.0005,
    longitudeDelta: 0.0005,
  };

  const [currentRegion, setCurrentRegion] = useState(defaultRegion);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const requestAndLoadLocation = async () => {
      const permissionGranted = await requestLocationPermission();
      if (permissionGranted) {
        fetchCurrentLocation();
      } else {
        setIsLoading(false);
        // Optionally set a fallback location (San Antonio) or handle the error
        setCurrentRegion({
          ...defaultRegion,
          latitude: MANHATTEN_KS_COORDS.latitude,
          longitude: MANHATTEN_KS_COORDS.longitude,
        });
      }
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
        {trashPickups.map(pickup => (
          <Marker
            pinColor="blue"
            key={pickup.id}
            coordinate={{
              latitude: pickup.latitude,
              longitude: pickup.longitude,
            }}
            title={`Trash Pickup ${pickup.id}`}
            description={`Location: ${pickup.latitude}, ${pickup.longitude}`}>
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
