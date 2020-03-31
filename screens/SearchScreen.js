import * as React from 'react';
import { Searchbar, Button } from 'react-native-paper';
import { View, Text, StyleSheet } from 'react-native';

export default class SearchScreen extends React.Component {
  state = {
    firstQuery: '',
  };

  render() {
    const { firstQuery } = this.state;
    return (
        <View style={styles.container}>
            <View style={styles.searchContent}>
                <Searchbar
                    style={styles.searchbar}
                    placeholder="Search"
                    onChangeText={query => { this.setState({ firstQuery: query }); }}
                    value={firstQuery}
                    onIconPress = {getProductFromQuery(query,{navigation})}
                />
            </View>
        </View>
      
    );
  }
}

function getProductFromQuery(query, { navigation }) {
  return fetch("https://item-finder-app.herokuapp.com/api/v1/productdetails?upc=".concat(query), {
    method: "GET",
    headers: {
      'Accept': 'application/json, text/plain, */*',  // It can be used to overcome cors errors
      'Content-Type': 'application/json'
    },
  })
    .then(response => response.json())
    .then(responseJson => {
      console.log(responseJson);
      navigation.navigate("ProductList", {
            productName: responseJson['productTitle'],
            productImage: responseJson['productPic'],
            productUpc: responseJson['productUpc']
      });
    })
    .catch(error => {
      console.log("Error finding");
      console.error(error);
    });
}

// SearchScreen.navigationOptions = {
//   header: null,
// };

const styles = StyleSheet.create({
    search_container: {
      flex: 1,
      flexDirection: 'column'
    },

    searchbar: {
      width: '95%',
    },
    searchContent: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
    },
    button: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: 175
    }
  });
  