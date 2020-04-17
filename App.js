/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useRef, useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Platform,
  PermissionsAndroid,
  BackHandler,
  TouchableWithoutFeedback,
  FlatList,
} from 'react-native';

import BarcodeSettings from './barcode.settings';

import {
  BarcodePicker,
  ScanditModule,
  Barcode,
  ScanSettings,
  ScanOverlay
} from 'scandit-react-native';

import Config from 'react-native-config';

ScanditModule.setAppKey(Config.API_KEY);

const App = () => {
  const [disableButton, setDisableButton] = useState(true);
  const [codes, setCodes] = useState([]);
  const scannerRef = useRef(null);


  const cameraPermissionGranted = () => {
    let settings = new ScanSettings();
    initSettings(settings);
    scannerRef.current.setVibrateEnabled(false);
    scannerRef.current.applySettings(settings);
    scannerRef.current.setGuiStyle(ScanOverlay.GuiStyle.LASER);
    scannerRef.current.startScanning();
  }

  const isAndroidMarshmallowOrNewer = () => {
    return Platform.OS === 'android' && Platform.Version >= 23;
  }
  
  const hasCameraPermission = async () => {
    if (isAndroidMarshmallowOrNewer()) {
      const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA);
      return granted;
    } else {
      return true;
    }
  }
  
  const cameraPermissionDenied = () => {
    BackHandler.exitApp()
  }
  
  const requestCameraPermission = async () => {
    if (isAndroidMarshmallowOrNewer()) {
      try {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          cameraPermissionGranted();
        } else {
          cameraPermissionDenied();
        }
      } catch (err) {
        console.warn(err);
      }
    } else {
      cameraPermissionGranted();
    }
  }

  const initSettings = (settings) => {
    for (const [key, value] of Object.entries(BarcodeSettings)) {
      settings.setSymbologyEnabled(Barcode.Symbology[key], value);
    }
  }

  const initApp = async () => {
    const hasPermission = await hasCameraPermission();
    if (hasPermission) {
      cameraPermissionGranted();
    } else {
      await requestCameraPermission();
    }
  }

  useEffect(() => {
    initApp();
  }, [])

  const onScan = (session) => {
    session.pauseScanning();
    let newCodes = [...codes, `${session.newlyRecognizedCodes[0].data} ${session.newlyRecognizedCodes[0].symbology}`]
    setCodes(newCodes);
    setDisableButton(false);
  }

  const resumeScanning = () => {
    scannerRef.current.resumeScanning();
    setDisableButton(true);
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 50 }}>
        <BarcodePicker
          ref={scannerRef}
          scanSettings={settings}
          onScan={(session) => { onScan(session) }}
          style={{ flex: 1 }} />
        {!disableButton && (
          <View style={styles.overlay}>
            <TouchableWithoutFeedback
              style={{ width: '100%', height: '100%' }}
              onPress={resumeScanning}>
              <View style={{ width: '100%', height: '100%' }}>
                <Text style={styles.tapText}>
                  Tap here to scan again
                  </Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        )}
      </View>
      <View style={{ margin: 10, flex: 50 }}>
        <FlatList style={{ flex: 1 }}
          data={codes}
          renderItem={({ item }) => <Text style={styles.item}>{item}</Text>}
          keyExtractor={(item, index) => index.toString()}
          showsHorizontalScrollIndicator />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    padding: 0,
    fontSize: 18,
    height: 38,
  },
  overlay: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    left: 0,
    top: 0,
    backgroundColor: '#000000E0'
  },
  tapText: {
    flex: 1,
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
    textAlignVertical: 'center'
  }
});

export default App;
