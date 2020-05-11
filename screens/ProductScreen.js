import * as WebBrowser from 'expo-web-browser';
import React, { useState, useEffect } from 'react';
import Geocoder from 'react-native-geocoding';
import * as firebase from "firebase";
import {
  TouchableOpacity,
  Text,
  FlatList,
  View,
  StyleSheet,
  Image,
  SafeAreaView
} from "react-native";

import Loader from '../components/Loader';

export default function ProductScreen({ route, navigation }) {
  const {productName} = route.params;
  const {productImage} = route.params;
  const {productLinks} = route.params;
  const {productRelatedItems} = route.params;
  const {productUPC} = route.params;
  const {userAllergies} = route.params;
  
  const [product_name, setProductName] = useState(productName);
  const [product_image, setProductImage] = useState(productImage);
  const [product_links, setProductLinks] = useState(productLinks);
  const [product_relatedItems, setRelatedItems] = useState(productRelatedItems);
  const [user_allergies, setAllergies] = useState(userAllergies)
  const [user_position, setPosition] = useState({latitude: 0, longitude: 0});
  const [error, setError] = useState("");
  const [postal_code, setPostal] = useState("");
  const [loading_status, setLoading] = useState(false);

  firebase.database().ref("users/"+ firebase.auth().currentUser.uid + "/scanHistory/productList/" + productUPC).set({
    ProductName: productName,
    Image: productImage,
    UPC: productUPC
  });

  function fetchItemSku(store, sku) {
    setLoading(true);
    return fetch("https://item-finder-app.herokuapp.com/api/v1/productinfo?store=".concat(store).concat("&sku=").concat(sku).concat("&userAllergies=").concat(userAllergies), {
      method: "GET",
      headers: {
        'Accept': 'application/json, text/plain, */*',  // It can be used to overcome cors errors
        'Content-Type': 'application/json'
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        setLoading(false);
        console.log(responseJson);
        setProductName(responseJson['productTitle']);
        setProductImage(responseJson['productPic']);
        setProductLinks(responseJson['productLinks']);
        setRelatedItems(responseJson['relatedItems']);
        setAllergies(responseJson['allergies']);
      })
      .catch(error => {
        console.log("Error finding");
        console.error(error);
      });
  }

  function getStoresFromAPI(store, url, zip, { navigation }) {
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setPosition({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setError("");
        Geocoder.from(position.coords.latitude, position.coords.longitude).then(json => {
          var addressComponent = json.results[0].address_components;
          //  console.log(addressComponent);
          // console.log(addressComponent[addressComponent.length - 1].short_name);
          //  setPostal(addressComponent[addressComponent.length - 1].short_name);
           var sku;
          if (url.includes("target")){
            var str = url.split("-")
            sku = str[str.length-1]
          }
          if (url.includes("walmart")){
            var str = url.split("/")
            sku = str[str.length-1]
          }
          return fetch("https://item-finder-app.herokuapp.com/api/v1/productinfo/nearby?store=".concat(store).concat("&sku=").concat(sku).concat("&postal_code=").concat(addressComponent[addressComponent.length - 1].short_name), {
            method: "GET",
            headers: {
              'Accept': 'application/json, text/plain, */*',  // It can be used to overcome cors errors
              'Content-Type': 'application/json'
            },
          })
            .then(response => response.json())
            .then(responseJson => {
              setLoading(false);
              // console.log(responseJson);
              var user_coord = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
              }
              // console.log(user_position);
              // console.log(user_coord);
              navigation.navigate("MapScreen", {
                    stores: responseJson,
                    user_coords: user_coord
              });
            })
            .catch(error => {
              console.log("Error finding");
              console.error(error);
            });
         }).catch(error => console.warn(error));
      },
      e => setError(e.message),
      { enableHighAccuracy: false, timeout: 200000, maximumAge: 1000 },
    );
  }

  function createWarning(){
    if (user_allergies === undefined || user_allergies.length === 0) {
      return;
    } else {
      return (
        <View>
          <Text style={styles.warningText}>May contain an ingredient you are allergic to:</Text>
          <Text style={styles.warningText}>{user_allergies}</Text>
        </View>
      )
    }
  }

  return (
      <SafeAreaView style={{flex: 1}}>
        <Loader loading={loading_status} />
        <View style={styles.imageContent}>
        <Image
          style={{ width: 130, height: 130 }}
          source={{ uri: product_image }}
        />
        <Text style={styles.name}>{product_name}</Text>
        </View>
        {createWarning()}
        <View style={styles.bodyContent}>
          <Text style={styles.categoryText}>Buy Now</Text>
          <FlatList
              data = {product_links}
              renderItem={({item}) => 
              <View style={styles.storeComponent}>
                <Text style={styles.storeText}>{item.store}:</Text>
                <View style={styles.buyRow}>
                  <TouchableOpacity 
                    style={styles.buttonShape}
                    onPress={_ => handleBuyNowPress(item.link)}
                  >
                    <Text style={styles.textStyle}>Online</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.buttonShape}
                    onPress={_ => getStoresFromAPI(item.store, item.link, postal_code, { navigation })}
                  >
                    <Text style={styles.textStyle}>Find near me</Text>
                  </TouchableOpacity>
                </View>
              </View>
            }
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
        <Text style={styles.categoryText}>Related Items</Text>
        <FlatList
            data = {product_relatedItems}
            renderItem={({item}) => 
              <View 
                style={{flex:1, flexDirection: 'row'}}
              >
                <Image
                  source={{uri: item.productImage}}
                  style={{width:100, height:100, margin: 5}}
                />
                <TouchableOpacity 
                  style={{flex: 1,  flexDirection: 'column', height: 100}}
                  onPress={_ => fetchItemSku(item.store, item.productSku)}
                >
                  <Text>{item.productName}</Text>
                </TouchableOpacity>
              </View>
          }
          keyExtractor={item => item.productSku}
        />
    </SafeAreaView>
  );
}

function handleBuyNowPress(url) {
  WebBrowser.openBrowserAsync(url);
}

const styles = StyleSheet.create({
  imageContent: {
    alignItems: "center",
    padding: 5
  },
  name: {
    fontSize: 28,
    color: "#696969",
    fontWeight: "600",
    padding: 10
  },
  lineStyle:{
    borderWidth: 0.5,
    borderColor:"black",
    margin:5,
  },
  storeText: {
    textTransform: "uppercase",
  },
  buyNowText: {
    padding: 9,
    fontSize: 20,
    color: '#2e78b7',
  },
  storeComponent: {
    margin: 5
  },
  buyRow: {
    flexDirection: "row"
  },
  warningText: {
    textAlign: "center",
    color: "red"
  },
  categoryText: {
    textTransform: "uppercase",
    textAlign: "center",
    margin: 2
  },
  buttonShape: {
    marginTop:5,
    paddingTop:5,
    paddingBottom:5,
    marginLeft:5,
    marginRight:5,
    backgroundColor:'#00bfff',
    borderRadius:10,
    borderWidth: 1,
    borderColor: '#fff',
    width:150,
    height: 45
  },
  textStyle: {
    color: "#ffffff",
    textAlign: "center"
  },
  bodyContent: {
    alignItems: "center",
    padding: 20
  }
});
