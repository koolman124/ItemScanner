import React, { Component } from "react";
import {StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import firebase from 'firebase';

export default class HomeScreen extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}></View>
        <Image
          style={styles.avatar}
          source={{ uri: "https://bootdey.com/img/Content/avatar/avatar6.png" }}
        />
        <View style={styles.body}>
          <View style={styles.bodyContent}>
            <Text style={styles.name}>
              {firebase.auth().currentUser.displayName}
            </Text>
            <Text style={styles.info}>Welcome!</Text>
            <Text style={styles.description}>
              How would you like to search for today?
            </Text>

            <TouchableOpacity 
            style={styles.buttonShape}
            onPress={() => this.props.navigation.navigate('BarcodeScanner')}
            >
              <Text style={styles.textStyle}>Scan</Text>
            </TouchableOpacity>

            <TouchableOpacity 
            style={styles.buttonShape}
            onPress={() => this.props.navigation.navigate('SearchScreen')}
            >
              <Text style={styles.textStyle}>Search</Text>
            </TouchableOpacity>

            <TouchableOpacity 
            style={styles.buttonShape}
            onPress={() => this.props.navigation.navigate('BrowseHistory')}
            >
              <Text style={styles.textStyle}>Browse History</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
            style={styles.buttonShape}
            onPress={() => this.props.navigation.navigate('TestMapScreen')}
            >
              <Text style={styles.textStyle}>Map Screen</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

HomeScreen.navigationOptions = {
  header: null
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#00BFFF",
    height: 200
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: "white",
    marginBottom: 10,
    alignSelf: "center",
    position: "absolute",
    marginTop: 130
  },
  name: {
    fontSize: 22,
    color: "#FFFFFF",
    fontWeight: "600"
  },
  body: {
    marginTop: 40
  },
  bodyContent: {
    flex: 1,
    alignItems: "center",
    padding: 30
  },
  name: {
    fontSize: 28,
    color: "#696969",
    fontWeight: "600"
  },
  info: {
    fontSize: 16,
    color: "#00BFFF",
    marginTop: 10
  },
  description: {
    fontSize: 16,
    color: "#696969",
    marginTop: 10,
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
  }
});
