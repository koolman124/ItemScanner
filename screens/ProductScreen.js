import * as WebBrowser from 'expo-web-browser';
import React, { useState, useEffect } from 'react';
import Geocoder from 'react-native-geocoding';
import {
  TouchableOpacity,
  Text,
  FlatList,
  View,
  StyleSheet,
  Image,
  SafeAreaView
} from "react-native";

export default function ProductScreen({ route, navigation }) {
  const {productName} = route.params;
  const {productImage} = route.params;
  const {productLinks} = route.params;
  const {productRelatedItems} = route.params;

  const [product_name, setProductName] = useState(productName);
  const [product_image, setProductImage] = useState(productImage);
  const [product_links, setProductLinks] = useState(productLinks);
  const [product_relatedItems, setRelatedItems] = useState(productRelatedItems);
  const [position, setPosition] = useState({latitude: 0, longitude: 0});
  const [error, setError] = useState("");
  const [postal_code, setPostal] = useState("")

  function fetchItemSku(store, sku) {
    return fetch("https://item-finder-app.herokuapp.com/api/v1/productinfo?store=".concat(store).concat("&sku=").concat(sku), {
      method: "GET",
      headers: {
        'Accept': 'application/json, text/plain, */*',  // It can be used to overcome cors errors
        'Content-Type': 'application/json'
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
        setProductName(responseJson['productTitle']);
        setProductImage(responseJson['productPic']);
        setProductLinks(responseJson['productLinks']);
        setRelatedItems(responseJson['relatedItems']);
      })
      .catch(error => {
        console.log("Error finding");
        console.error(error);
      });
  }

  function getStoresFromAPI(store, url, zip, { navigation }) {
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
          //  console.log(addressComponent[addressComponent.length - 1].short_name);
           setPostal(addressComponent[addressComponent.length - 1].short_name);
           var sku;
          if (url.includes("target")){
            var str = url.split("-")
            sku = str[str.length-1]
          }
          if (url.includes("walmart")){
            var str = url.split("/")
            sku = str[str.length-1]
          }
          return fetch("https://item-finder-app.herokuapp.com/api/v1/productinfo/nearby?store=".concat(store).concat("&sku=").concat(sku).concat("&postal_code=").concat(zip), {
            method: "GET",
            headers: {
              'Accept': 'application/json, text/plain, */*',  // It can be used to overcome cors errors
              'Content-Type': 'application/json'
            },
          })
            .then(response => response.json())
            .then(responseJson => {
              console.log(responseJson);
              // navigation.navigate("Stores", {
              //       stores: responseJson
              // });
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

  return (
      <SafeAreaView style={{flex: 1}}>
        <View style={styles.imageContent}>
        <Image
          style={{ width: 130, height: 130 }}
          source={{ uri: product_image }}
        />
        <Text style={styles.name}>{product_name}</Text>
        </View>
        <View style={styles.bodyContent}>
          <Text style={styles.categoryText}>Buy Now</Text>
          <FlatList
              data = {product_links}
              renderItem={({item}) => 
              <View>
                <TouchableOpacity 
                  style={styles.buttonShape}
                  onPress={_ => handleBuyNowPress(item.link)}
                >
                  <Text style={styles.textStyle}>{item.store}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.buttonShape}
                  onPress={_ => getStoresFromAPI(item.store, item.link, postal_code, { navigation })}
                >
                  <Text style={styles.textStyle}>Find near me</Text>
                </TouchableOpacity>
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
  buyNowText: {
    padding: 9,
    fontSize: 20,
    color: '#2e78b7',
  },
  buyRow: {
    flexDirection: "row"
  },
  categoryText: {
    textTransform: "uppercase",
    textAlign: "center"
  },
  buttonShape: {
    marginTop:10,
    paddingTop:15,
    paddingBottom:15,
    marginLeft:30,
    marginRight:30,
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
