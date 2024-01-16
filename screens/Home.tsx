import React from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native'; // Import useNavigation
import {Image} from 'react-native';
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

const Home = () => {
  const navigation = useNavigation(); // Use the useNavigation hook

  const signOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      await auth().signOut();
      navigation.navigate('Login');
    } catch (error) {
      console.error('Sign-Out Error:', error);
    }
  };

  const currentUser = auth().currentUser?.displayName;

  return (
    <View style={styles.container}>
      {/* Display the user's name */}
      <Text style={styles.text}>Welcome {currentUser}!</Text>

      {/* Logo */}
      <Image source={require('../assets/trashtalk.png')} style={styles.logo} />

      {/* Buttons at the bottom */}
      <View style={styles.buttonContainer}>
        <Button
          title="Map"
          color={'#2e5248'}
          onPress={() => navigation.navigate('Map')}
        />
        <Button
          title="Tracker"
          color={'#2e5248'}
          onPress={() => navigation.navigate('Tracker')} // Make sure the Tracker screen is defined in your navigator
        />
        <Button
          title="Logout"
          color={'#2e5248'}
          onPress={signOut} // Make sure the Login screen is defined in your navigator
        />
      </View>
    </View>
  );
};

// Add styles for the buttons
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff', // White background
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
    color: 'black',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 50,
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },

  logo: {
    width: 400, // Adjust the width as needed
    height: 400, // Adjust the height as needed
    marginBottom: 20, // Adjust the spacing as needed
  },
});

export default Home;
