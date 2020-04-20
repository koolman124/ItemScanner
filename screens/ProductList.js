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

import Loader from '../components/Loader';

export default function ProductList({ route, navigation }) {
  const {productLinks} = route.params;

  const [product_links, setProductLinks] = useState(productLinks);
  const [loading_status, setLoading] = useState(false);

  function getProductFromAPI(upc, { navigation }) {
    setLoading(true);
    return fetch("https://item-finder-app.herokuapp.com/api/v1/productdetails?upc=".concat(upc), {
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
        navigation.navigate("Product", {
              productName: responseJson['productTitle'],
              productImage: responseJson['productPic'],
              productLinks: responseJson['productLinks'],
              productRelatedItems: responseJson['relatedItems']
        });
      })
      .catch(error => {
        console.log("Error finding");
        console.error(error);
      });
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <Loader loading={loading_status} />   
      <FlatList
            data = {product_links}
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
                  onPress={_ => getProductFromAPI(item.productUpc, { navigation })}
                >
                  <Text>{item.productName}</Text>
                </TouchableOpacity>
              </View>
          }
          keyExtractor={item => item.productUpc}
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
