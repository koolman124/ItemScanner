import React, { useState, useEffect } from 'react';
import { Searchbar, Button } from 'react-native-paper';
import { View, Text, StyleSheet } from 'react-native';

export default function SearchScreen({ navigation }) {
    const [firstQuery, setQuery] = useState(null);
    return (
        <View style={styles.container}>
            <View style={styles.searchContent}>
                <Searchbar
                    style={styles.searchbar}
                    placeholder="Search"
                    onChangeText={query => { setQuery(query); }}
                    value={firstQuery}
                    onSubmitEditing={(event) => getProductFromQuery(firstQuery, { navigation })}
                />
            </View>
        </View>
      
    );
}

function getProductFromQuery(query, { navigation }) {
  return fetch("https://item-finder-app.herokuapp.com/api/v1/products/list?searchTerm=".concat(query), {
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
          productLinks: responseJson
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
  