import React from 'react';
import {View, Text, Button, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import FlipCard from 'react-native-flip-card'; // Make sure to install this package

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

  // Grid data (replace with your own data)
  const gridData = [
    {id: 1, description: 'Tile 1'},
    {id: 2, description: 'Tile 2'},
    {id: 3, description: 'Tile 3'},
    {id: 4, description: 'Tile 4'},
    {id: 5, description: 'Tile 5'},
    {id: 6, description: 'Tile 6'},
    {id: 7, description: 'Tile 7'},
    {id: 8, description: 'Tile 8'},
    {id: 9, description: 'Tile 9'},
  ];

  // Render a single grid tile
  const renderGridTile = tile => (
    <FlipCard
      key={tile.id}
      style={styles.flipCard}
      flipHorizontal={true}
      flipVertical={false}>
      {/* Front of the card */}
      <View style={styles.frontCard}>
        <Text>{tile.id}</Text>
      </View>
      {/* Back of the card */}
      <View style={styles.backCard}>
        <Text>{tile.description}</Text>
      </View>
    </FlipCard>
  );

  return (
    <View style={styles.container}>
      {/* Top Section */}
      <View style={styles.topSection}>
        <Text style={styles.welcome}>Welcome back, {currentUser}!</Text>
        <Button title="Logout" color={'#2e5248'} onPress={signOut} />
      </View>

      {/* Middle Section - Grid */}
      <View style={styles.gridContainer}>{gridData.map(renderGridTile)}</View>

      {/* Bottom Section - Buttons */}
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
    padding: 20,
    backgroundColor: '#2D6E5D',
  },
  welcome: {
    fontSize: 20,
    color: '#FFFFFF',
    fontFamily: 'RobotoCondensed-Bold',
  },
  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  gridContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around', // Distribute items evenly along the row
    width: '100%',
  },
  flipCard: {
    width: '33%',
    height: 100, // Adjust as needed
    margin: '1.5%',
  },
  frontCard: {
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'red',
  },
  backCard: {
    backgroundColor: 'gray',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'red',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
});

export default Home;
