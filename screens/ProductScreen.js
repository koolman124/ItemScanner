import * as WebBrowser from 'expo-web-browser';
import React, { Component } from "react";
import {
  Modal,
  Text,
  TouchableHighlight,
  View,
  StyleSheet,
  Image,
  ScrollView
} from "react-native";

class ProductScreen extends Component {
  state = {

  };

  render() {
    return (
      <View style={styles.bodyContent}>
          <View style={styles.imageContent}>
            {this.createImage()}
            {this.createProductName()}
          </View>
          <View style = {styles.lineStyle} />
          {this.createBuyLinks()}

      </View>
    );
  }

  createImage() {
    const productImage = this.props.navigation.getParam("productImage", null);
    return (
        <Image
            style={{ width: 180, height: 130 }}
            source={{ uri: productImage }}
        />
    );
  }

  createProductName() {
    const productName = this.props.navigation.getParam("productName", null);
    return (
        <Text style={styles.name}>{productName}</Text>
    );
  }

  createBuyLinks() {
    const images = {
      target: {
        uri: require('../assets/images/target-logo.png')
      },
      walmart: { 
        uri: require('../assets/images/walmart-logo.png')
      }
    }
    const productlinks_array = this.props.navigation.getParam("productLinks", "[]");
    let links = [];
    productlinks_array.map((u, i) => {
      if (u.link != "") 
      links.push(
        <View key={i} style={styles.buyRow}>
          <Image
              style={{ width: 50, height: 50 }}
              source={images[u.store].uri}
          />
          <Text onPress={_ => handleBuyNowPress(u.link)} style={styles.buyNowText}>
            Buy Now
          </Text>
        </View>
      );
    });
    return links
  }
}

function handleBuyNowPress(url) {
  WebBrowser.openBrowserAsync(url);
}

const styles = StyleSheet.create({
  bodyContent: {
    flex: 1,
  },
  imageContent: {
    alignItems: "center",
    padding: 15
  },
  name: {
    fontSize: 28,
    color: "#696969",
    fontWeight: "600",
    padding: 15
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
  }
});

export default ProductScreen;