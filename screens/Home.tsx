import React from 'react';
import {View, Text, Button, StyleSheet, Dimensions} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import Svg, {Path} from 'react-native-svg';

const Home = () => {
  const navigation = useNavigation();

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

  const {width} = Dimensions.get('window');
  const cardSize = width / 3.5 - 10;

  const cards = [
    {front: 'INSPIRE', color: '#FFA500', completed: true},
    {front: 'INSIGHT', color: '#008080', completed: false},
    {front: 'PROTECT', color: '#228B22', completed: true},
    {front: 'DILLIGENCE', color: '#008080', completed: false},
    {front: 'STREAK', color: '#228B22', completed: false},
    {front: 'SPEEDSTER', color: '#87CEEB', completed: false},
    {front: 'RECRUIT', color: '#FFA500', completed: false},
    {front: 'MILESTONE', color: '#87CEEB', completed: true},
    {front: 'CURIOUSITY', color: '#008080', completed: false},
  ];

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <Text style={styles.welcome}>
          Welcome back, {'\n'}
          {currentUser}!
        </Text>
        <Button title="Logout" color={'#2e5248'} onPress={signOut} />
      </View>

      <View style={styles.statusTextContainer}>
        <Text style={styles.status}>STATUS: Eco-Friendly</Text>
      </View>

      <View style={styles.gridContainer}>
        {cards.map((card, index) => (
          <View
            key={index}
            style={[
              styles.tile,
              {backgroundColor: card.color, opacity: card.completed ? 1 : 0.25},
            ]}>
            <Text style={styles.tileText}>{card.front}</Text>
          </View>
        ))}
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Map"
          color={'#2e5248'}
          onPress={() => navigation.navigate('Map')}
        />
        <Button
          title="Tracker"
          color={'#2e5248'}
          onPress={() => navigation.navigate('Tracker')}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    // padding: 20,
    backgroundColor: '#2D6E5D',
  },
  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start', // Align items to the top
    width: '100%',
    marginBottom: 20,
    paddingTop: 20, // Adjust padding as needed
    paddingHorizontal: 20, // Add horizontal padding
  },
  welcome: {
    fontSize: 25,
    color: '#FFFFFF',
    fontFamily: 'RobotoCondensed-Bold',
    paddingRight: 10,
    marginLeft: 10,
    paddingBottom: 30,
  },
  statusTextContainer: {
    alignSelf: 'flex-start',
    paddingLeft: 10,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginLeft: 30,
  },
  status: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: 'RobotoCondensed-Bold',
    textAlign: 'center',
    paddingRight: 10,
  },

  gridContainer: {
    paddingTop: 20,
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  tile: {
    // width: cardSize,
    // height: cardSize,
    width: 112,
    height: 112,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  tileText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    borderWidth: 2.5,
    borderColor: '#FFFFFF',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    textAlign: 'center',
    textAlignVertical: 'center',
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

export default Home;
