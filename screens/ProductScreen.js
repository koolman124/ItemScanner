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
      <View style={{ marginTop: 22 }}>
          {this.createImage()}
          {this.createProductName()}
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
    )
  }

  createProductName() {
    const productName = this.props.navigation.getParam("productName", null);
    return (
        <Text>{productName}</Text>
    )
  }
}

const styles = StyleSheet.create({

});

export default ProductScreen;