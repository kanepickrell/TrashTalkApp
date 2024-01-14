import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native"; // Import useNavigation
import { Image } from "react-native";

const Home = () => {
  const navigation = useNavigation(); // Use the useNavigation hook

  return (
    <View style={styles.container}>
      <Image source={require("../assets/trashtalk.png")} style={styles.logo} />

      {/* Buttons at the bottom */}
      <View style={styles.buttonContainer}>
        <Button
          title="Map"
          color={"#2e5248"}
          onPress={() => navigation.navigate("Map")}
        />
        <Button
          title="Tracker"
          color={"#2e5248"}
          onPress={() => navigation.navigate("Tracker")} // Make sure the Tracker screen is defined in your navigator
        />
      </View>
    </View>
  );
};

// Add styles for the buttons
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff", // White background
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 50,
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },

  logo: {
    width: 400, // Adjust the width as needed
    height: 400, // Adjust the height as needed
    marginBottom: 20, // Adjust the spacing as needed
  },
});

export default Home;
