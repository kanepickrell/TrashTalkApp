import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {
  Camera,
  useCameraDevices,
  CameraPermissionStatus,
  useCameraDevice,
  useCameraFormat,
} from 'react-native-vision-camera';

const NoCameraErrorView = () => (
  <View style={styles.container}>
    <Text style={styles.text}>No camera available</Text>
  </View>
);

const MyCamera = () => {
  const cameraPermission = Camera.getCameraPermissionStatus();
  const microphonePermission = Camera.getMicrophonePermissionStatus();
  const showPermissionsPage =
    cameraPermission !== 'granted' || microphonePermission === 'not-determined';

  const device = useCameraDevice('back');
  const format = useCameraFormat(device, [
    {videoResolution: {width: 3048, height: 2160}},
    {fps: 60},
  ]);

  if (device == null) return <NoCameraErrorView />;
  return (
    <View style={styles.cameraContainer}>
      <Camera
        device={device}
        format={format}
        isActive={true}
        style={styles.camera}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'tomato',
  },
  text: {
    color: 'white',
    fontSize: 20,
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },
});

export default MyCamera;
