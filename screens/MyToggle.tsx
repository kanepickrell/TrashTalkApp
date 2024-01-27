import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';

// Enable LayoutAnimation on Android
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const MyToggle = ({onToggle}) => {
  const onColor = '#1F4F40';
  const offColor = '#1F4F40';

  const [isToggled, setIsToggled] = useState(true);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button,
          {
            borderColor: isToggled ? onColor : offColor,
          },
        ]}
        onPress={() => {
          LayoutAnimation.easeInEaseOut();
          setIsToggled(!isToggled);
          onToggle(!isToggled);
        }}>
        <View
          style={[
            styles.toggle,
            {
              backgroundColor: '#1F4F40',
              top: isToggled ? '50%' : 0,
            },
          ]}></View>
        {/* Icon at the top */}
        <Text style={[styles.icon, styles.iconTop]}>🗑️</Text>
        {/* Icon at the bottom */}
        <Text style={[styles.icon, styles.iconBottom]}>🚩</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    height: 150,
    width: 60,
    borderRadius: 30, // Adjusted to make the corners of the button rounded
    borderWidth: 1,
    overflow: 'hidden',
    justifyContent: 'center',
    position: 'relative',
  },
  toggle: {
    position: 'absolute',
    height: '50%',
    width: '100%',
    borderRadius: 30, // Adjusted to make the toggle a perfect circle
    borderWidth: 1,
    borderColor: 'transparent',
    left: 0,
    zIndex: 1,
  },
  text: {
    color: 'white',
    fontSize: 40,
    fontWeight: '500',
    position: 'absolute',
    height: '100%',
    textAlign: 'center',
    zIndex: 0,
  },

  icon: {
    position: 'absolute',
    width: '100%',
    textAlign: 'center',
    zIndex: 2,
  },
  iconTop: {
    top: 25, // Adjust as needed
    fontSize: 15, // Adjust size as needed
  },
  iconBottom: {
    bottom: 30, // Adjust as needed
    fontSize: 15, // Adjust size as needed
  },
});

export default MyToggle;
