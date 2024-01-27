import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  Alert,
  Dimensions,
  TouchableOpacity,
  Switch,
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
  GeoPoint,
  Timestamp,
} from 'firebase/firestore';
import db from '../firebaseConfig';
import auth from '@react-native-firebase/auth';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {useNavigation} from '@react-navigation/native';
import MyToggle from './MyToggle';
import * as Progress from 'react-native-progress';

const Tracker = () => {
  const [isTracking, setIsTracking] = useState(false);
  const [isFlagMode, setIsFlagMode] = useState(true);
  const [position, setPosition] = useState({latitude: null, longitude: null});
  const [tempCoordinates, setTempCoordinates] = useState([]);
  const [TotalTrashPickedUp, setTotalTrashPickedUp] = useState(0);
  const [TotalFlagsPlaced, setTotalFlagsPlaced] = useState(0); // Updated state variable name
  const currentUser = auth().currentUser?.displayName;
  const navigation = useNavigation();
  const [progress, setProgress] = useState(0.5); // 50% progress
  const [totalItemsPickedUp, setTotalItemsPickedUp] = useState(0); // Updated state variable name
  const [userTarget, setUserTarget] = useState(0); // Updated state variable name

  const [trashProgress, setTrashProgress] = useState(0);
  const [flagProgress, setFlagProgress] = useState(0);

  // const trashProgress = userTarget > 0 ? totalItemsPickedUp / userTarget : 0;
  // const flagProgress = userTarget > 0 ? totalItemsPickedUp / userTarget : 0;

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

  const addCoordToDatabase = async () => {
    const collectionName = isFlagMode ? 'flags' : 'captures';
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

        await addDoc(collection(db, collectionName), {
          Coordinates: geoPoint,
          PickedUpBy: name,
          Timestamp: timestamp,
          userId,
        });
      }
      console.log(`All ${collectionName} coordinates uploaded`);
    } catch (error) {
      console.error(`Error uploading coordinates to ${collectionName}:`, error);
    }
  };

  const updateTotalItemsPickedUp = async () => {
    const collectionName = isFlagMode ? 'flags' : 'captures';
    const counterField = isFlagMode ? 'TotalFlagsPlaced' : 'TotalTrashPickedUp';

    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('Username', '==', currentUser));

    try {
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userDocRef = userDoc.ref;

        await updateDoc(userDocRef, {
          [counterField]: increment(tempCoordinates.length),
        });
      } else {
        console.log('Creating new user document');
        const newUserRef = doc(collection(db, 'users'));
        await setDoc(newUserRef, {
          Username: currentUser,
          TotalTrashPickedUp: 0,
          TotalFlagsPlaced: 0,
          userId: auth().currentUser?.uid,
          userTarget: 15,
        });
        setTotalTrashPickedUp(0);
      }
    } catch (error) {
      console.error(
        `Error updating user total ${collectionName} picked up:`,
        error,
      );
    }
  };

  const pullFirebaseUserData = async () => {
    const userRef = query(
      collection(db, 'users'),
      where('Username', '==', currentUser),
    );

    try {
      const userSnapshot = await getDocs(userRef);
      if (!userSnapshot.empty) {
        const userData = userSnapshot.docs[0].data();
        const totalPickedUp = isFlagMode
          ? userData.TotalFlagsPlaced
          : userData.TotalTrashPickedUp;
        setTotalItemsPickedUp(totalPickedUp || 0);
        setTotalTrashPickedUp(userData.TotalTrashPickedUp || 0);
        setTotalFlagsPlaced(userData.TotalFlagsPlaced || 0);
        setUserTarget(userData.userTarget || 0); // Fetch and set the target
        calculateProgress(TotalTrashPickedUp, userTarget); // New function to calculate progress
      } else {
        console.log('Creating new user document');
        const newUserRef = doc(collection(db, 'users'));
        await setDoc(newUserRef, {
          Username: currentUser,
          TotalTrashPickedUp: 0,
          TotalFlagsPlaced: 0,
          userId: auth().currentUser?.uid,
          userTarget: 15,
        });
        setTotalTrashPickedUp(0);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };
  const handleToggleChange = isToggled => {
    setIsFlagMode(isToggled);
    // Optionally fetch new data based on the updated mode
    pullFirebaseUserData();
  };

  const calculateProgress = () => {
    // Ensure that userTarget is a number greater than zero to avoid division by zero
    const validUserTarget = userTarget > 0 ? userTarget : 1;

    const trashProg = TotalTrashPickedUp / validUserTarget;
    const flagProg = TotalFlagsPlaced / validUserTarget;

    setTrashProgress(trashProg);
    setFlagProgress(flagProg);
  };

  useEffect(() => {
    calculateProgress();
  }, [TotalTrashPickedUp, TotalFlagsPlaced, userTarget]);

  useEffect(() => {
    pullFirebaseUserData();
  }, [isFlagMode]);

  useEffect(() => {
    const updateFirestore = async () => {
      if (tempCoordinates.length > 0) {
        await addCoordToDatabase();
        await updateTotalItemsPickedUp();
        await pullFirebaseUserData();
        setTempCoordinates([]);
      }
    };

    updateFirestore();

    return () => {
      // Cleanup if necessary
    };
  }, [tempCoordinates]);

  return (
    <View style={styles.container}>
      <View style={styles.topSection}></View>

      <View style={styles.performanceContainer}>
        {/* <Text style={styles.targetText}>🎯 {userTarget}</Text> */}
        <Text style={styles.status}>Litter: {TotalTrashPickedUp}</Text>
        <Progress.Bar
          progress={trashProgress} // Example: half-filled
          width={315} // Fixed width for testing
          height={10} // Height of the bar
          borderWidth={1} // Border width
          borderRadius={10} // Border radius
          color={'green'} // Fill color
          useNativeDriver={false} // Disable native driver for testing
        />
        <Text style={styles.status}>Flags: {TotalFlagsPlaced}</Text>
        <Progress.Bar
          progress={flagProgress} // Example: half-filled
          width={315} // Fixed width for testing
          height={10} // Height of the bar
          borderWidth={1} // Border width
          borderRadius={10} // Border radius
          color={'green'} // Fill color
          useNativeDriver={false} // Disable native driver for testing
        />
      </View>

      <View style={styles.toolContainer}>
        <View style={styles.toggleButtonContainer}>
          <MyToggle onToggle={handleToggleChange} />
        </View>

        <View>
          <TouchableOpacity
            style={styles.circleButton}
            onPress={trackLocation}
            disabled={isTracking}>
            <Text style={styles.buttonText}>
              {isTracking ? (isFlagMode ? '🚩' : '🗑️') : 'Track'}
            </Text>
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

  progressBar: {
    alignSelf: 'stretch',
    height: 20,
    borderRadius: 10,
    backgroundColor: 'white',
    marginBottom: 10,
    borderColor: '#1F4F40',
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
  targetText: {
    position: 'absolute', // Position over the progress bar
    right: 10, // Adjust as needed for positioning
    color: 'black',
    fontSize: 16,
  },
});

export default Tracker;
