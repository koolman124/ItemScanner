import React, { Component } from "react";
import {StyleSheet, Text, View, Image, TouchableOpacity,SafeAreaView } from "react-native";
import firebase from 'firebase';

const productList = firebase
.database()
.ref("users/"+ firebase.auth().currentUser.uid + "/Scan History/Product List/")
.once('value').
then(function(snapshot) {
    productList = (snapshot.val());    
});


export default class ScanHistory extends Component {


    /* render() {
        return (
        <SafeAreaView style={{flex: 1}}>
        <FlatList

        </SafeAreaView>)
*/
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

