import { CheckBox, Text, Button, StyleSheet, View } from 'react-native';
import React, {Component} from 'react';
import firebase from 'firebase'

export default class MedFilters extends React.Component {
  constructor(props) {
    super(props)
    // this is the default state on page load
    this.state = {
      Peanuts: false,
      Chocolate: false,
      Cinnamon: false,
    }
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
      <View>
        <Text style = {styles.welcome}> Select all filters that apply:</Text>
        <CheckBox
          value={this.state.Peanuts}
          onChange={() => this.setState({ Peanuts: !this.state.Peanuts })}
        />
        <Text style = {styles.label}> Peanuts </Text>

        <CheckBox
          value={this.state.Chocolate}
          onChange={() => this.setState({ Chocolate: !this.state.Chocolate })}
        />
        <Text style = {styles.label}> Chocolate</Text>

        <CheckBox
          value={this.state.Cinnamon}
          onChange={() => this.setState({ Cinnamon: !this.state.Cinnamon })}
        />
        <Text style = {styles.label}> Cinnamon</Text>
        <Button title="Submit" onPress= {this.onFilter}/>
      </View>
    )
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  label: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 20
  }
});