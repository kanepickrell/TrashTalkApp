import React, {useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import {StyleSheet, Dimensions} from 'react-native';
import Geolocation from 'react-native-geolocation-service';

const MapScreen = () => {
  // Example coordinates for trash pickup locations
  const trashPickups = [
    {id: 1, latitude: 37.78825, longitude: -122.4324},
    {id: 2, latitude: 37.78925, longitude: -122.4334},
    // Add more coordinates as needed
  ];

  const [currentRegion, setCurrentRegion] = useState(null);

  useEffect(() => {
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        setCurrentRegion({
          latitude,
          longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      },
      error => console.log(error),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );
  }, []);

  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={currentRegion}>
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
