import React, { Component } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import CheckboxFormX from 'react-native-checkbox-form';
import firebase from 'firebase'

const allergies = [
    {
        label: 'Peanuts',
        value: 'Peanuts',
        checked: false
    },
    {
        label: 'Chocolate',
        value: 'Chocolate',
        checked: false
    },
    {
        label: 'Cinnamon',
        value: 'Cinnamon',
        checked: false
    },
];

export default class MedFilters extends Component {
    _onSelect = ( item ) => {
      console.log(item);
    };

    constructor(props) {
      super(props);
      this.state = {
        Peanuts:false,
        Chocolate:false,
        Cinnamon:false
      };
    }
    onFilter = () => {
            firebase
              .database()
              .ref("users/" + firebase.auth().currentUser.uid + '/Filters')
              .set({
                Peanuts: this.state.Peanuts,
                Chocolate: this.state.Chocolate,
                Cinnamon: this.state.Cinnamon
              });
    };

  render() {
    return (
      <View style={styles.container}>
        <Text style= {styles.welcome}>Select all the filters that apply: </Text>
              <CheckboxFormX
                  style= {styles.form}
                  dataSource={allergies}
                  itemShowKey="label"
                  itemCheckedKey="checked"
                  iconSize={40}
                  formHorizontal={false}
                  labelHorizontal={true}
                  onChecked={(item) => this._onSelect(item)}
              />
        <Button title="Submit" onPress={this.onFilter} />
     </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  form: {
    flex: 1,
    padding: 10,
    fontSize: 20,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
})