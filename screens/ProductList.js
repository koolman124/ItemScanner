import * as WebBrowser from 'expo-web-browser';
import React, { useState } from 'react';
import {
  TouchableOpacity,
  Text,
  FlatList,
  View,
  StyleSheet,
  Image,
  SafeAreaView
} from "react-native";

export default function ProductList({ route, navigation }) {
  const {productName} = route.params;
  const {productImage} = route.params;
  const {productUpc} = route.params;

  const [product_name, setProductName] = useState(productName);
  const [product_image, setProductImage] = useState(productImage);
  const [product_links, setProductUpc] = useState(productUpc);


  function fetchItemSku(store, sku) {
    // console.log("https://item-finder-app.herokuapp.com/api/v1/productinfo?store=".concat(store).concat("&sku=").concat(sku))
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
        setProductUpc(responseJson['productUpc']);
      })
      .catch(error => {
        console.log("Error finding");
        console.error(error);
      });
  }

  return (
<SafeAreaView style={{flex: 1}}>   
  <FlatList
    data = {product_name}
    renderItem={({item}) => 
      <TouchableOpacity 
        style={styles.buttonShape}
        onPress={_ => handleBuyNowPress(item.link)}
      >
        <Text> {item.productName>} </Text>
        <Text>{item.productUpc}</Text>
        <Image 
            source={{uri: item.productImage}}
            style={{width:100, height:100, margin: 5}}
        />
        <Text style={styles.textStyle}>{item.store}</Text>
      </TouchableOpacity>
  }
  keyExtractor={(item, index) => index.toString()}
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
    width:250,
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
