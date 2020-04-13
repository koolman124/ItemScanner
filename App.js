import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { AppLoading } from 'expo';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import React, { useState } from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ApiKeys from './constants/ApiKeys';
import * as firebase from 'firebase';
import Geocoder from 'react-native-geocoding';

import AppNavigator from './navigation/AppNavigator';

export default function App(props) {
  const [isLoadingComplete, setLoadingComplete] = useState(false);
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [isAuthenticationReady, setAuthenticationReady] = useState(false);

  if (!firebase.apps.length) { 
    firebase.initializeApp(ApiKeys.FirebaseConfig); 
  }
    

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      setAuthenticationReady(true);
      setAuthenticated(true);
    }
  });


  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return (
      <AppLoading
        startAsync={loadResourcesAsync}
        onError={handleLoadingError}
        onFinish={() => handleFinishLoading(setLoadingComplete)}
      />
    );
  } 
  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  )
}

async function loadResourcesAsync() {
  await Promise.all([
    Asset.loadAsync([
      require('./assets/images/robot-dev.png'),
      require('./assets/images/robot-prod.png'),
    ]),
    Font.loadAsync({
      // This is the font that we are using for our tab bar
      ...Ionicons.font,
      // We include SpaceMono because we use it in HomeScreen.js. Feel free to
      // remove this if you are not using it in your app
      'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
    }),
  ]);
  // Initialize the module (needs to be done only once)
  Geocoder.init("AIzaSyBCMdef0ei_Fg6Z7MLBcLxNW-EIZEDDJrA"); // use a valid API key
}

function handleLoadingError(error) {
  // In this case, you might want to report the error to your error reporting
  // service, for example Sentry
  console.warn(error);
}

function handleFinishLoading(setLoadingComplete) {
  setLoadingComplete(true);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});