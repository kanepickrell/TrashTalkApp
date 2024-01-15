import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Dimensions, PermissionsAndroid} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';

// Function to get permission for location
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
    {id: 1, latitude: 37.78825, longitude: -122.4324},
    {id: 2, latitude: 37.78925, longitude: -122.4334},
  ];

  const defaultRegion = {
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  const [currentRegion, setCurrentRegion] = useState(defaultRegion);
  const [isLoading, setIsLoading] = useState(true);

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
      },
      error => {
        console.error(error);
      },
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );
  };

  useEffect(() => {
    const requestAndLoadLocation = async () => {
      const permissionGranted = await requestLocationPermission();
      if (permissionGranted) {
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
            console.log(error);
            setIsLoading(false);
            // Optionally set a fallback location or handle the error
          },
          {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
        );
      } else {
        setIsLoading(false);
        // Handle the case when permission is not granted
      }
    };

    requestAndLoadLocation();
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={
          currentRegion.latitude !== 0 ? currentRegion : undefined
        }>
        {trashPickups.map(pickup => (
          <Marker
            key={pickup.id}
            coordinate={{
              latitude: pickup.latitude,
              longitude: pickup.longitude,
            }}
            title={`Trash Pickup ${pickup.id}`}
            description={`Location: ${pickup.latitude}, ${pickup.longitude}`}
          />
        ))}
      </MapView>
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
});

export default MapScreen;
