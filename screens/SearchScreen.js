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
                />
            </View>
        </View>
      
    );
  }
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
  