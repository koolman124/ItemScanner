import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, Alert } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

import * as firebase from "firebase";

export default function BarcodeScanner({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [user_allergies, setAllergies] = useState([])

  useEffect(() => {
    getAllergies();
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  function getAllergies() {
    const allergies = firebase.database().ref("users/" + firebase.auth().currentUser.uid + "/Filters").once('value').then(function(snapshot) {
      let items = snapshot.val();
      let allergies = [];
      var objectKeys = Object.keys(items);
      for (var i = 0; i < objectKeys.length; i++) {
        var allergy = objectKeys[i];
        if (items[allergy] == true) {
          allergies.push(allergy);
        }
      }
      setAllergies(allergies);
    });
  }

  function getProductFromAPI(upc, { navigation }) {
    return fetch("https://item-finder-app.herokuapp.com/api/v1/productdetails?upc=".concat(upc).concat("&userAllergies=").concat(user_allergies), {
      method: "GET",
      headers: {
        'Accept': 'application/json, text/plain, */*',  // It can be used to overcome cors errors
        'Content-Type': 'application/json'
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
        if(responseJson.hasOwnProperty('Error')){
          Alert.alert("Item scanned could not be found. Please try again or scan another item.")
        }
        else {
          navigation.navigate("Product", {
              productName: responseJson['productTitle'],
              productImage: responseJson['productPic'],
              productLinks: responseJson['productLinks'],
              productRelatedItems: responseJson['relatedItems'],
              userAllergies: responseJson['allergies'],
              productUPC: upc
          });
        }
      })
      .catch(error => {
        console.log("Error finding");
        console.error(error);
      });
  }

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    console.log(data);
    getProductFromAPI(data, { navigation })
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-end',
      }}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />

      {scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />}
    </View>
  );
}