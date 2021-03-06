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
import * as firebase from "firebase";
import { useFocusEffect } from '@react-navigation/native';

import Loader from '../components/Loader';

export default function ProductList({ route, navigation }) {
  const {productLinks} = route.params;

  const [product_links, setProductLinks] = useState(productLinks);
  const [loading_status, setLoading] = useState(false);
  const [user_allergies, setAllergies] = useState([])

  useFocusEffect(() => {
    getAllergies();
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

  function getProductFromAPI(upc, userAllergies, { navigation }) {
    setLoading(true);
    console.log("https://item-finder-app.herokuapp.com/api/v1/productdetails?upc=".concat(upc).concat("&userAllergies=").concat(userAllergies));
    return fetch("https://item-finder-app.herokuapp.com/api/v1/productdetails?upc=".concat(upc).concat("&userAllergies=").concat(userAllergies), {
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
        // console.log(responseJson['allergies'])
        navigation.navigate("Product", {
              productName: responseJson['productTitle'],
              productImage: responseJson['productPic'],
              productLinks: responseJson['productLinks'],
              productRelatedItems: responseJson['relatedItems'],
              userAllergies: responseJson['allergies'],
              productUPC : upc
        });
      })
      .catch(error => {
        console.log("Error finding");
        console.error(error);
      });
  }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <Loader loading={loading_status} />   
      <FlatList
            data = {product_links}
            renderItem={({item}) => 
              <TouchableOpacity 
                  style={styles.card}
                  onPress={_ => getProductFromAPI(item.productUpc, user_allergies, { navigation })}
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
          }
          keyExtractor={item => item.productName}
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
  card:{
    flex: 1,  
    flexDirection: 'row', 
    borderRadius: 6,  
    backgroundColor: '#fff', 
    margin: 2,
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
