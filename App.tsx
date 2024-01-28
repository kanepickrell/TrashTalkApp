import React from 'react';
import {StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';

import {StyleSheet, ViewStyle} from 'react-native';

import Home from './screens/Home';
import Map from './screens/Map';
import Tracker from './screens/Tracker.tsx';
import Login from './screens/Login.tsx';
import Leaderboard from './screens/Leaderboard.tsx';

type RootStackParamList = {
  Home: undefined;
  Map: undefined;
  Tracker: undefined;
  Login: undefined;
  Leaderboard: undefined;
  MyCamera: undefined;
};

type AppNavigationProps = NativeStackNavigationProp<RootStackParamList>;

const Stack = createNativeStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Home"
          component={Home}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Map"
          component={Map}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Tracker"
          component={Tracker}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Leaderboard"
          component={Leaderboard}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
      <StatusBar />
    </NavigationContainer>
  );
};

// Define styles with TypeScript type
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
