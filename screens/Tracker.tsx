import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native"; // Import useNavigation

const Tracker = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Tracker</Text>
      {/* Additional content will go here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff", // White background
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default Tracker;
