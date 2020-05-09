import { CheckBox, Text, Button, StyleSheet, Alert, View } from 'react-native';
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
      Soy: false,
      Wheat: false,
      Milk: false
    }
  }
  onFilter = () => {
    firebase
      .database()
      .ref("users/" + firebase.auth().currentUser.uid + '/Filters')
      .set({
        Peanuts: this.state.Peanuts,
        Chocolate: this.state.Chocolate,
        Cinnamon: this.state.Cinnamon,
        Soy: this.state.Soy,
        Wheat: this.state.Wheat,
        Milk: this.state.Milk
      });
      Alert.alert("The selected have been applied");
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

        <CheckBox
          value={this.state.Soy}
          onChange={() => this.setState({ Soy: !this.state.Soy })}
        />
        <Text style = {styles.label}> Soy </Text>

        <CheckBox
          value={this.state.Wheat}
          onChange={() => this.setState({ Wheat: !this.state.Wheat })}
        />
        <Text style = {styles.label}> Wheat </Text>
        <CheckBox
          value={this.state.Milk}
          onChange={() => this.setState({ Milk: !this.state.Milk })}
        />
        <Text style = {styles.label}> Milk </Text>

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