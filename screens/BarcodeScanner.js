import * as React from "react";
import { Text, View, StyleSheet, Button } from "react-native";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";

import { BarCodeScanner } from "expo-barcode-scanner";

export default class BarcodeScanner extends React.Component {
  state = {
    hasCameraPermission: null,
    scanned: false
  };

  async componentDidMount() {
    this.getPermissionsAsync();
  }

  getPermissionsAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === "granted" });
  };

  scanThroughAPIs(data) {
    this.getProductFromTargetAPI(data);
    this.getProductFromWalmartAPI(data);
  }

  getProductFromTargetAPI(data) {
    return fetch("https://redsky.target.com/v4/products/pdp/BARCODE/".concat(data).concat("/3284?key=3f015bca9bce7dbb2b377638fa5de0f229713c78&pricing_context=digital&pricing_store_id=3284"), {
        method: "GET",
        headers: {
          "user-agent": "Popspedia/28 CFNetwork/978.0.7 Darwin/18.7.0",
          "content-type": "application/json",
          "cache-control": "no-cache",
          "accept-encoding": "gzip, deflate, br",
          "accept-language": "en-US"
        }
      })
        .then(response => response.json())
        .then(responseJson => {
          console.log(responseJson);
          if(responseJson.message == "no products found")
          {
            console.log('cant find in target')
          }
          else
          { 
            console.log(responseJson.products)
          }
        //   this.props.navigation.navigate("Products", {
        //     product_array: responseJson.products
        //   });
        })
        .catch(error => {
          console.log("Error finding");
          console.error(error);
        });
  }

  getProductFromWalmartAPI(data) {
    return fetch("https://search.mobile.walmart.com/v1/products-by-code/UPC/".concat(data).concat("?storeId=3520"), {
        method: "GET",
        headers: {
          "user-agent": "Popspedia/28 CFNetwork/978.0.7 Darwin/18.7.0",
          "content-type": "application/json",
          "cache-control": "no-cache",
          "accept-encoding": "gzip, deflate, br",
          "accept-language": "en-US"
        }
      })
        .then(response => response.json())
        .then(responseJson => {
          if(responseJson.error != null)
          {
            console.log('Cant find in Walmart')
          }
          else
          {
            console.log(responseJson.data.common.name)
            console.log(responseJson.data.common.productImageUrl)
          }
        //   this.props.navigation.navigate("Products", {
        //     product_array: responseJson.products
        //   });
        })
        .catch(error => {
          console.log("Error finding");
          console.error(error);
        });
  }

  render() {
    const { hasCameraPermission, scanned } = this.state;

    if (hasCameraPermission === null) {
      return <Text>Requesting for camera permission</Text>;
    }
    if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    }
    return (
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          justifyContent: "flex-end"
        }}
      >
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />

        {scanned && (
          <Button
            title={"Tap to Scan Again"}
            onPress={() => this.setState({ scanned: false })}
          />
        )}
      </View>
    );
  }

  handleBarCodeScanned = ({ type, data }) => {
    this.setState({ scanned: true });
    // console.log(data)
    // console.log(parseInt(data, 10))
    // this.getProductFromTargetAPI(parseInt(data, 10));
    this.scanThroughAPIs(data);
  };
}