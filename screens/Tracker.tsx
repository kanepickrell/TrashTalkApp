import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  Alert,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  getDocs,
  updateDoc,
  setDoc,
  query,
  where,
  increment,
} from 'firebase/firestore';
import db from '../firebaseConfig';
import auth from '@react-native-firebase/auth';
import {GeoPoint, Timestamp} from 'firebase/firestore';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {useNavigation} from '@react-navigation/native';
import MyToggle from './MyToggle';

const Tracker = () => {
  const [isTracking, setIsTracking] = useState(false);
  const [position, setPosition] = useState({latitude: null, longitude: null});
  const [tempCoordinates, setTempCoordinates] = useState([]);
  const [TotalTrashPickedUp, setTotalTrashPickedUp] = useState(0);
  const currentUser = auth().currentUser?.displayName;
  const navigation = useNavigation();
  const [progress, setProgress] = useState(0.5); // 50% progress

  const trackLocation = () => {
    if (isTracking) {
      return; // Prevents the function from running if it's already in progress
    }

    setIsTracking(true);
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        setPosition({latitude, longitude});
        const newCoord = {latitude, longitude, timestamp: new Date()};
        setTempCoordinates(prevCoords => [...prevCoords, newCoord]);
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

  const addCoordToCaptures = async () => {
    const collectionRef = collection(db, 'captures');
    const currentUser = auth().currentUser;
    if (!currentUser) {
      console.error('No user is signed in');
      return;
    }

    const userId = currentUser.uid;
    const name = currentUser.displayName || 'Anonymous';

    try {
      for (const coord of tempCoordinates) {
        const geoPoint = new GeoPoint(coord.latitude, coord.longitude);
        const timestamp = Timestamp.fromDate(new Date(coord.timestamp));

        await addDoc(collectionRef, {
          Coordinates: geoPoint,
          PickedUpBy: name,
          Timestamp: timestamp,
          userId,
        });
      }
      console.log('All capture coordinates uploaded');
    } catch (error) {
      console.error('Error uploading coordinates:', error);
    }
  };

  const add2TotalTrashPickedUp = async () => {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('Username', '==', currentUser));

    try {
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userDocRef = userDoc.ref;

        await updateDoc(userDocRef, {
          TotalTrashPickedUp: increment(tempCoordinates.length),
        });
      } else {
        console.log('User not found');
      }
    } catch (error) {
      console.error('Error updating user total trash picked up:', error);
    }
  };

  const fetchTotalTrashPickedUp = async () => {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('Username', '==', currentUser));

    try {
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userDocData = userDoc.data();

        setTotalTrashPickedUp(userDocData.TotalTrashPickedUp);

        console.log(
          'User total trash picked up:',
          userDocData.TotalTrashPickedUp,
        );
      } else {
        console.log('Creating new user document');
        const newUserRef = doc(collection(db, 'users'));
        await setDoc(newUserRef, {
          Username: currentUser,
          TotalTrashPickedUp: 0,
          userId: auth().currentUser?.uid,
        });
        setTotalTrashPickedUp(0);
      }
    } catch (error) {
      console.error('Error fetching user total trash picked up:', error);
    }
  };

  useEffect(() => {
    fetchTotalTrashPickedUp();
  }, []);

  useEffect(() => {
    const updateFirestore = async () => {
      if (tempCoordinates.length > 0) {
        await addCoordToCaptures();
        await add2TotalTrashPickedUp();
        await fetchTotalTrashPickedUp();
        setTempCoordinates([]);
      }
    };

    updateFirestore();

    return () => {
      // Cleanup if necessary
    };
  }, [tempCoordinates]);

  return (
    // <View style={styles.container}>
    //   <Text style={styles.textdisplay}>
    //     Today's Total: {TotalTrashPickedUp}{' '}
    //   </Text>
    //   <Button
    //     title={isTracking ? 'Tracking...' : 'Track'}
    //     onPress={trackLocation}
    //     disabled={isTracking}
    //     color="green"
    //   />
    //   <Button
    //     title="Flagger"
    //     onPress={() => navigation.navigate('Flagger')} // Make sure the Tracker screen is defined in your navigator
    //     color="blue"
    //   />
    // </View>

    <View style={styles.container}>
      <View style={styles.topSection}></View>

      <View style={styles.performanceContainer}>
        <Text style={styles.status}>Captures: {TotalTrashPickedUp}</Text>
        <View style={styles.progressBarBackground}>
          <View
            style={[
              styles.progressBarForeground,
              {width: `${progress * 100}%`},
            ]}
          />
        </View>
        <Text style={styles.status}>Flags: {TotalTrashPickedUp}</Text>
        <View style={styles.progressBarBackground}>
          <View
            style={[
              styles.progressBarForeground,
              {width: `${progress * 100}%`},
            ]}
          />
        </View>
      </View>

      <View style={styles.toolContainer}>
        <View style={styles.toggleButtonContainer}>
          <MyToggle />
        </View>

        <View>
          <TouchableOpacity
            style={styles.circleButton}
            onPress={trackLocation}
            disabled={isTracking}>
            <Text style={styles.buttonText}>{isTracking ? '🗑️' : 'Track'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Map"
          color={'#2e5248'}
          onPress={() => navigation.navigate('Map')}
        />
        <Button
          title="Home"
          color={'#2e5248'}
          onPress={() => navigation.navigate('Home')}
        />
        <Button
          title="Leaders"
          color={'#2e5248'}
          onPress={() => navigation.navigate('Leaderboard')}
        />
      </View>
    </View>
  );
};

const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    // padding: 20,
    backgroundColor: '#2D6E5D',
  },

  circleButton: {
    height: 100,
    width: 100,
    borderRadius: 50,
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    marginHorizontal: 150,
    borderWidth: 1,
    borderColor: 'white',
  },

  buttonText: {
    color: 'white', // Text color
    fontSize: 16, // Adjust font size as needed
    textAlign: 'center',
    fontWeight: 'bold',
  },

  textdisplay: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'black',
  },
  flaggerButton: {
    // Your existing styles...
    marginBottom: 20, // Add space at the bottom of the Flagger button
  },

  trackButton: {
    // Your existing styles...
    marginTop: 20, // Add space at the top of the Track button
  },
  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  welcome: {
    fontSize: 25,
    color: '#FFFFFF',
    fontFamily: 'RobotoCondensed-Bold',
    paddingRight: 10,
    marginLeft: 10,
    paddingBottom: 30,
  },
  performanceContainer: {
    height: windowHeight / 3, // Half of the screen height
    alignSelf: 'stretch',
    padding: 20,
    backgroundColor: '#1F4F40',
    borderRadius: 8,
    marginHorizontal: 30,
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
  },

  progressBarBackground: {
    backgroundColor: '#ddd',
    width: '100%',
    height: 20,
    borderRadius: 10,
    marginTop: 5,
    marginBottom: 20,
  },

  progressBarForeground: {
    backgroundColor: '#76AD3B',
    height: '100%',
    borderRadius: 10,
  },

  toolContainer: {
    flex: 1, // Take up all remaining space
    width: '100%',
  },
  toggleButtonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingLeft: 265,
  },

  status: {
    fontSize: 16,
    fontWeight: '300',
    color: '#FFFFFF',
    textAlign: 'left',
    alignSelf: 'flex-start',
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center', // Align items vertically in the center
    width: '100%', // Use 100% width for full width
    paddingTop: 20,
    paddingBottom: 20, // Add padding at the bottom
    backgroundColor: '#1F4F40',
    borderTopWidth: 1,
    borderTopColor: '#FFFFFF',
  },
});

export default Tracker;
