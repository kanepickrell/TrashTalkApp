import React from 'react';
import {
  GoogleSignin,
  GoogleSigninButton,
} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import {View, StyleSheet, Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Home from './Home';

GoogleSignin.configure({
  webClientId:
    '792835698338-ab3s5kdrouauqq31afdo5thp2p9hsnc2.apps.googleusercontent.com',
});

type RootStackParamList = {
  TrashTalk: undefined;
  Map: undefined;
  Tracker: undefined;
  Login: undefined;
};

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
      console.error('Google Sign-In Error:', error);
      Alert.alert('Sign-In Error', 'Failed to sign in with Google.');
    }
  };

  return (
    <View style={styles.container}>
      <GoogleSigninButton
        onPress={googleSignIn}
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // No need for custom styles for the Google Signin Button as it uses its own styles
});

export default Login;
