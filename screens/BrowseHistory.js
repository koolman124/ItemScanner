import {StyleSheet, Text, View, Image, TouchableOpacity,SafeAreaView,FlatList,CheckBox,Button} from "react-native";
import firebase from 'firebase';
import React, { useState,useEffect} from 'react';
import { List } from 'react-native-paper';
import Loader from '../components/Loader';



export default function BrowseHistory ({navigation}){  
const [aList,setList] = useState([]);
const [loading_status, setLoading] = useState(false);
const [user_allergies, setAllergies] = useState([])
useEffect(() => {
    getData();
    getAllergies();
  },[]);

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
function getData()
{
  var listRef  = firebase.database().ref("users/"+ firebase.auth().currentUser.uid + "/scanHistory/productList").once('value').then(function(snapshot) {
    if (snapshot.exists()) {
      let theList = snapshot.val();
      let listRef = [];
      var theProductList = Object.keys(theList);
        for (var i = 0; i < theProductList.length;i++)
        {
          var theKey = theProductList[i] ; 
          listRef.push({"Key":theKey,"Image" : theList[theKey].Image,
          "UPC": theKey, 
          "ProductName": theList[theKey].ProductName});
        }
      console.log(listRef);
      setList(listRef);
      }  
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

function createHistory(){
  if (aList.length == 0)
    return(
      <View>
        <Text>You have not searched or scanned any item.</Text>
      </View>
    )
  else {
    return(
      <View>
            <FlatList
                data = {aList}
                renderItem={({item}) => 
                  <TouchableOpacity 
                      style={styles.card}
                      onPress={_ => getProductFromAPI(item.UPC, user_allergies, { navigation })}
                    >
                      <Image
                        source={{uri: item.Image}}
                        style={{width:100, height:100, margin: 5}}
                      />
                      <View 
                        style={{flex: 1,  flexDirection: 'column', height: 100}}
                      >
                        <Text>{item.ProductName}</Text>
                        <Text> {"UPC Number: " + item.UPC}</Text>
                      </View>
                    </TouchableOpacity>
              }
              keyExtractor={item => item.productUpc}
            />
      </View>
    )
  }
}

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}> 
      <Loader loading={loading_status} />
        {createHistory()}
        </SafeAreaView>    
        )  
};
   
const styles = StyleSheet.create({
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
  }
});
     

