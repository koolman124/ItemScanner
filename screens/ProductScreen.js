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
  ScrollView
} from "react-native";
import { useFocusEffect } from '@react-navigation/native';

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

  useFocusEffect(() => {
    addtoFB();
  }, []);

  function addtoFB() {
    try {
      firebase.database().ref("users/"+ firebase.auth().currentUser.uid + "/scanHistory/productList/" + productUPC).set({
        ProductName: productName,
        Image: productImage,
        UPC: productUPC
      });
    }
    catch(err) {
      console.log(err)
    }
  }

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
          if (url.includes("barnesandnoble")){
            var str = url.split("=")
            sku = str[str.length-1]
          }
          console.log(sku)
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

  function displayAllergies(){
    return user_allergies.map(function(item, i){
      return(
        <View key={i}>
          <Text style={styles.warningText}>{item}</Text>
        </View>
      )
    })
  }

  function createWarning(){
    if (user_allergies === undefined || user_allergies.length === 0) {
      return;
    } else {
      return (
        <View style={styles.card}>
          <Text style={styles.warningText}>May contain an ingredient you are allergic to:</Text>
          {displayAllergies()}
        </View>
      )
    }
  }

  function createStoreButtons(){
    return product_links.map(function(item, i){
      return(
        <View key={i} style={styles.storeComponent}>
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
      );
    });
  }

  function createRelatedItems() {
    if (product_relatedItems === undefined || product_relatedItems.length === 0) {
      return(
        <View>
          <Text>No related products found</Text>
        </View>
      );
    } else {
      return product_relatedItems.map(function(item, i){
        return(
          <TouchableOpacity 
              key={i}
              style={styles.relatedCards}
                onPress={_ => fetchItemSku(item.store, item.productSku)}
                >
                  <Image
                    source={{uri: item.productImage}}
                    style={{width:100, height:100, margin: 5}}
                  />
                  <View 
                    style={{flex: 1,  flexDirection: 'column', height: 100}}
                  >
                    <Text>{item.productName}</Text>
                  </View>
                </TouchableOpacity>
        )
      })
    }
  }

  return (
      <ScrollView style={{flex: 1, backgroundColor: '#fff'}}>
        <Loader loading={loading_status} />
        <View style={styles.card}>
            <Image
              style={{ width: 250, height: 250 }}
              source={{ uri: product_image }}
            />
          <Text style={styles.name}>{product_name}</Text>
        </View>
        {createWarning()}
        <Text style={styles.categoryText}>Buy Now</Text>
        <View style={styles.bodyContent}>
          {createStoreButtons()}
        </View>
        <Text style={styles.categoryText}>Related Items</Text>
        {createRelatedItems()}
    </ScrollView>
  );
}

function handleBuyNowPress(url) {
  console.log(url);
  WebBrowser.openBrowserAsync(url);
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    padding: 10,
    borderRadius: 6,  
    backgroundColor: '#fff', 
    margin: 4,
    width: '98%',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 2
  },
  relatedCards:{
    flex: 1,  
    flexDirection: 'row',
    padding: 5,
    borderRadius: 6,  
    backgroundColor: '#fff', 
    margin: 4,
    width: '98%',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 2
  },
  name: {
    fontSize: 25,
    color: "#696969",
    fontWeight: "600",
    padding: 5,
    textAlign: "center"
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
    fontWeight: 'bold',
    marginLeft: 20,
    marginTop: 10
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
