import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  ScrollView,
  Text,
} from 'react-native';
import db from '../firebaseConfig';
import {collection, getDocs} from 'firebase/firestore';

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]); // State to store leaderboard data

  // Function to fetch leaderboard data
  const fetchLeaderboardData = async () => {
    // Fetch data from Firestore or other sources and update leaderboardData state
    // hardcode data for now
    const data = [
      {name: 'John', score: 100},
      {name: 'Jane', score: 90},
      {name: 'Bob', score: 80},
      {name: 'Alice', score: 70},
      {name: 'Joe', score: 60},
      {name: 'Jill', score: 50},
      {name: 'Jack', score: 40},
      {name: 'Jenny', score: 30},
      {name: 'Jim', score: 20},
      {name: 'Jen', score: 10},
    ];
    setLeaderboardData(data);
  };

  useEffect(() => {
    fetchLeaderboardData();
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/leaderboard.png')}
        style={styles.imageStyle}
      />
      <View style={styles.cardOverlay}>
        <ScrollView style={styles.leaderboardContainer}>
          {leaderboardData.map((item, index) => (
            <View style={styles.card} key={index}>
              <Text style={styles.leaderboardText}>
                {index + 1}. {item.name} - {item.score}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imageStyle: {
    width: '100%',
    height: screenHeight / 2, // Set image height to half of the screen
    resizeMode: 'cover', // or 'contain' based on your preference
  },
  leaderboardContainer: {
    flex: 1, // Take up the remaining half of the screen
  },
  cardOverlay: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: screenHeight / 2, // Adjust as needed
    padding: 10,
    // opacity: 0.8,
  },
  card: {
    backgroundColor: '#e1f3d6', // Card background color
    elevation: 3, // Shadow for Android
    height: 75,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 3,
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    textAlign: 'center',
  },
  leaderboardText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
  },
});

export default Leaderboard;
