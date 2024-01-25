import React from 'react';
import {
  GoogleSignin,
  GoogleSigninButton,
} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import {View, StyleSheet, Alert, Text, TextInput} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Button} from 'react-native';

GoogleSignin.configure({
  webClientId:
    '792835698338-ab3s5kdrouauqq31afdo5thp2p9hsnc2.apps.googleusercontent.com',
});

const Login = () => {
  const navigation = useNavigation();
  const googleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(
        userInfo.idToken,
      );
      await auth().signInWithCredential(googleCredential);

      // Navigates to home page
      navigation.navigate('Basecamp');

      //   Alert.alert('Success', 'You are signed in!');
    } catch (error) {
      //   console.error('Google Sign-In Error:', error);
      //   Alert.alert('Sign-In Error', 'Failed to sign in with Google.');
    }
  };

  const signOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      await auth().signOut();
      Alert.alert('Success', 'You are signed out!');
    } catch (error) {
      console.error('Sign-Out Error', error);
      Alert.alert('Sign-Out Error', 'Failed to sign out.');
    }
  };

  return (
    <View style={styles.container}>
      <OutlinedText
        text="Ready To Talk Trash?"
        style={styles.welcome}
        outlineStyle={styles.welcomeOutline}
      />
      <Text style={styles.instructions}>LOGIN</Text>
      <TextInput style={styles.input} placeholder="Email"></TextInput>
      <TextInput style={styles.input} placeholder="Password"></TextInput>

      <View style={styles.buttonContainer}>
        <Button
          title="Login"
          // onPress={() => navigation.navigate('Basecamp')}
          color={'#2e5248'}></Button>
      </View>

      <Text style={styles.instructions}>OR</Text>

      <View style={styles.buttonContainer}>
        <Button title="Sign Up" color={'#2e5248'} />
      </View>

      <GoogleSigninButton
        onPress={googleSignIn}
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        style={{marginTop: 10}}
      />
    </View>
  );
};

const OutlinedText = ({text, style, outlineStyle}) => {
  return (
    <View style={{position: 'relative'}}>
      {/* Outline Text */}
      <Text style={[style, outlineStyle, {position: 'absolute'}]}>{text}</Text>

      {/* Main Text */}
      <Text style={style}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2D6E5D',
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcome: {
    fontSize: 40,
    textAlign: 'center',
    color: '#FFFFFF',
    fontFamily: 'RobotoCondensed-Bold',
    marginBottom: 40,
  },
  welcomeOutline: {
    color: 'transparent',
    textShadowColor: '#1F4F40', // Outline color
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 1,
  },
  instructions: {
    textAlign: 'center',
    color: '#FFFFFF',
    fontSize: 15,
    letterSpacing: 2,
    fontFamily: 'RobotoCondensed-Light',
  },
  input: {
    height: 40,
    width: 300,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderColor: '#FFFFFF',
    borderRadius: 10,
    marginTop: 10,
  },
  buttonContainer: {
    margin: 10,
    overflow: 'hidden',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },
});

export default Login;
