import * as WebBrowser from 'expo-web-browser';
import React, { Component } from "react";
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
  return (
      <SafeAreaView style={{flex: 1}}>
        <View style={styles.imageContent}>
        <Image
          style={{ width: 130, height: 130 }}
          source={{ uri: productImage }}
        />
        <Text style={styles.name}>{productName}</Text>
        </View>
        <View style={styles.bodyContent}>
        <FlatList
            data = {productLinks}
            renderItem={({item}) => 
              <TouchableOpacity 
              style={styles.buttonShape}
              onPress={_ => handleBuyNowPress(item.link)}
              >
                <Text style={styles.textStyle}>{item.store}</Text>
              </TouchableOpacity>
          }
          keyExtractor={(item, index) => index.toString()}
        />
        </View>
        <Text style={styles.categoryText}>Related Items</Text>
        <FlatList
            data = {productRelatedItems}
            renderItem={({item}) => 
              <View style={{flex:1, flexDirection: 'row'}}>
                <Image
                  source={{uri: item.productImage}}
                  style={{width:100, height:100, margin: 5}}
                />
                <View style={{flex: 1,  flexDirection: 'column', height: 100}}>
                  <Text>{item.productName}</Text>
                </View>
              </View>
          }
          keyExtractor={item => item.productSku}
        />
    </SafeAreaView>
  );
}

// function CreateImage() {
//   const productImage = this.props.navigation.getParam("productImage", null);
//   return (
//       <Image
//           style={{ width: 130, height: 130 }}
//           source={{ uri: productImage }}
//       />
//   );
// }

// function CreateProductName() {
//   const productName = this.props.navigation.getParam("productName", null);
//   return (
//       <Text style={styles.name}>{productName}</Text>
//   );
// }

// function CreateBuyLinks() {
//   const images = {
//     target: {
//       uri: require('../assets/images/target-logo.png')
//     },
//     walmart: { 
//       uri: require('../assets/images/walmart-logo.png')
//     }
//   }
//   let links = [];
//   links.push(<Text key='buynow' style={styles.categoryText}>Buy now</Text>);
//   productLinks.map((u, i) => {
//     if (u.link != "") 
//     links.push(
//       <View key={i} style={styles.buyRow}>
//         <TouchableOpacity 
//           style={styles.buttonShape}
//           onPress={_ => handleBuyNowPress(u.link)}
//           >
//             <Text style={styles.textStyle}>{u.store}</Text>
//           </TouchableOpacity>
//       </View>
//     );
//   });
//   return links;
// }

// function CreateRelatedLinks() {
//   const relatedlinks_array = this.props.navigation.getParam("productRelatedItems", "[]");
//   return <FlatList
//       data = {relatedlinks_array}
//       renderItem={({item}) => 
//         <View style={{flex:1, flexDirection: 'row'}}>
//           <Image
//             source={{uri: item.productImage}}
//             style={{width:100, height:100, margin: 5}}
//           />
//           <View style={{flex: 1,  flexDirection: 'column', height: 100}}>
//             <Text>{item.productName}</Text>
//           </View>
//         </View>
//     }
//     keyExtractor={item => item.productSku}
//   />
// }

// class ProductScreen extends Component {
//   state = {

//   };

//   render() {
//     return (
//       <SafeAreaView style={{flex: 1}}>
//           <View style={styles.imageContent}>
//             {this.createImage()}
//             {this.createProductName()}
//           </View>
//           <View style={styles.bodyContent}>
//             {this.createBuyLinks()}
//           </View>
//           <Text style={styles.categoryText}>Related Items</Text>
//           {this.createRelatedLinks()}
//       </SafeAreaView>
//     );
//   }

//   createImage() {
//     const productImage = this.props.navigation.getParam("productImage", null);
//     return (
//         <Image
//             style={{ width: 130, height: 130 }}
//             source={{ uri: productImage }}
//         />
//     );
//   }

//   createProductName() {
//     const productName = this.props.navigation.getParam("productName", null);
//     return (
//         <Text style={styles.name}>{productName}</Text>
//     );
//   }

//   createBuyLinks() {
//     const images = {
//       target: {
//         uri: require('../assets/images/target-logo.png')
//       },
//       walmart: { 
//         uri: require('../assets/images/walmart-logo.png')
//       }
//     }
//     const productlinks_array = this.props.navigation.getParam("productLinks", "[]");
//     let links = [];
//     links.push(<Text key='buynow' style={styles.categoryText}>Buy now</Text>);
//     productlinks_array.map((u, i) => {
//       if (u.link != "") 
//       links.push(
//         <View key={i} style={styles.buyRow}>
//           <TouchableOpacity 
//             style={styles.buttonShape}
//             onPress={_ => handleBuyNowPress(u.link)}
//             >
//               <Text style={styles.textStyle}>{u.store}</Text>
//             </TouchableOpacity>
//         </View>
//       );
//     });
//     return links;
//   }

//   createRelatedLinks() {
//     const relatedlinks_array = this.props.navigation.getParam("productRelatedItems", "[]");
//     return <FlatList
//         data = {relatedlinks_array}
//         renderItem={({item}) => 
//           <View style={{flex:1, flexDirection: 'row'}}>
//             <Image
//               source={{uri: item.productImage}}
//               style={{width:100, height:100, margin: 5}}
//             />
//             <View style={{flex: 1,  flexDirection: 'column', height: 100}}>
//               <Text>{item.productName}</Text>
//             </View>
//           </View>
//       }
//       keyExtractor={item => item.productSku}
//     />
//   }
// }

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
