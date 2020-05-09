import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, Alert } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as firebase from "firebase";

export default function BarcodeScanner({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

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

function getProductFromAPI(upc, { navigation }) {
  return fetch("https://item-finder-app.herokuapp.com/api/v1/productdetails?upc=".concat(upc), {
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
        firebase.database().ref("users/"+ firebase.auth().currentUser.uid + "/scanHistory/productList/" + upc).set({
          ProductName: responseJson['productTitle'],
          Image: responseJson['productPic'],
          UPC: upc
        });
        navigation.navigate("Product", {
            productName: responseJson['productTitle'],
            productImage: responseJson['productPic'],
            productLinks: responseJson['productLinks'],
            productRelatedItems: responseJson['relatedItems'],
            productUPC: upc
        });
      }
    })
    .catch(error => {
      console.log("Error finding");
      console.error(error);
    });
}