import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Dimensions, PermissionsAndroid} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';

async function requestLocationPermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'TrashTalk Location Permission',
        message: 'TrashTalk needs access to your location',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can use the location');
    } else {
      console.log('Location permission denied');
    }
  } catch (err) {
    console.warn(err);
  }
}

const MapScreen = () => {
  const trashPickups = [
    {id: 1, latitude: 37.78825, longitude: -122.4324},
    {id: 2, latitude: 37.78925, longitude: -122.4334},
  ];

  const defaultRegion = {
    latitude: 1,
    longitude: 1,
    latitudeDelta: 0.05, // Adjusted for closer zoom to a neighborhood level
    longitudeDelta: 0.05, // Adjusted for closer zoom to a neighborhood level
  };

  const [currentRegion, setCurrentRegion] = useState(defaultRegion);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const requestAndLoadLocation = async () => {
      await requestLocationPermission();
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
