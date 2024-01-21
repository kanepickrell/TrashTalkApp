import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  PermissionsAndroid,
  Text,
  Button,
} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import {collection, getDocs} from 'firebase/firestore';
import db from '../firebaseConfig';
import {Heatmap, PROVIDER_GOOGLE} from 'react-native-maps';

/////////////////////////////
/////////////////////////////

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
      console.log('Geolocation Permission Granted');
      return true;
    } else {
      console.log('Location Permission Denied');
      return false;
    }
  } catch (err) {
    console.warn(err);
    return false;
  }
}

const fetchCaptures = async () => {
  try {
    const collectionRef = collection(db, 'captures');
    const snapshot = await getDocs(collectionRef);
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

const fetchFlags = async () => {
  try {
    const collectionRef = collection(db, 'flags');
    const snapshot = await getDocs(collectionRef);
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
    console.error('Error fetching flags:', error);
    return [];
  }
};

/////////////////////////////
/////////////////////////////
const MapScreen = () => {
  const defaultRegion = {
    latitude: 39.1836,
    longitude: 96.5717,
    latitudeDelta: 0.0005,
    longitudeDelta: 0.0005,
  };

  const [currentRegion, setCurrentRegion] = useState(defaultRegion);
  const [isLoading, setIsLoading] = useState(true);
  const [locations, setLocations] = useState([]);
  const [flags, setFlags] = useState([]);
  const [showFlags, setShowFlags] = useState(false);
  const [locationSet, setLocationSet] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      const permissionGranted = await requestLocationPermission();
      if (permissionGranted && !locationSet) {
        fetchCurrentLocation();
      } else {
        setIsLoading(false);
      }

      const fetchedCoordinates = await fetchCaptures();
      setLocations(fetchedCoordinates);
    };

    fetchInitialData();
  }, []); // Empty dependency array for running only on mount

  useEffect(() => {
    const toggleFlagData = async () => {
      if (showFlags && flags.length === 0) {
        const fetchedFlags = await fetchFlags();
        setFlags(fetchedFlags);
      } else if (!showFlags) {
        setFlags([]);
      }
    };

    toggleFlagData();
  }, [showFlags]); // Dependency on showFlags

  const fetchCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        if (!locationSet) {
          setCurrentRegion({
            ...currentRegion,
            latitude,
            longitude,
          });
          setLocationSet(true); // Location is now set
        }
      },
      error => {
        console.error('Location Error:', error);
        if (!locationSet) {
          setCurrentRegion(defaultRegion); // Fallback to default region
          setLocationSet(true);
        }
      },
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );
  };

  const toggleFlags = () => {
    setShowFlags(!showFlags);
  };

  const handleRegionChangeComplete = (region, details) => {
    if (details && details.isGesture) {
      // Update the region only when the change is due to a user gesture
      setCurrentRegion(region);
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={currentRegion}
        onRegionChangeComplete={handleRegionChangeComplete}>
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
        {showFlags &&
          flags.map((flag, index) => (
            <Marker
              key={flag.id || index}
              coordinate={{
                latitude: flag.latitude,
                longitude: flag.longitude,
                latitudeDelta: 0.0005,
                longitudeDelta: 0.0005,
              }}
              title={`Flag ${flag.id || index}`}
              description={`Latitude: ${flag.latitude}, Longitude: ${flag.longitude}`}>
              <View style={styles.flagMarker} />
            </Marker>
          ))}
      </MapView>
      <View style={styles.buttonContainer}>
        <Button
          title={showFlags ? 'Hide Flags' : 'Show Flags'}
          onPress={toggleFlags}
        />
      </View>
      {isLoading ? <Text style={styles.loadingText}>Loading...</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  loadingText: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
  customMarker: {
    height: 10,
    width: 10,
    backgroundColor: 'green',
    borderRadius: 5,
  },
  flagMarker: {
    height: 10,
    width: 10,
    backgroundColor: 'red',
    borderRadius: 5,
  },
});

export default MapScreen;
