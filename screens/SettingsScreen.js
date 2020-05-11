import React from 'react';
import { StyleSheet, Text, View, Alert, Button } from "react-native";
import { List } from 'react-native-paper';
import firebase from 'firebase';

class SettingsScreen extends React.Component{
  signoutUser = async () => {
    await firebase
    .auth()
    .signOut()
    .then (
      () => {
        Alert.alert("You successfully logged out")
        this.props.navigation.navigate ('Login');
      },
      error => {
        Alert.alert(error.message)
      }
    );
};
 render() {
   return (
     <View style = {StyleSheet.Container}>
      <List.Item
        title="User Allergies"
        description="View/Set your allergies"
        left={props => <List.Icon {...props} icon="medical-bag" />}
        onPress={() => this.props.navigation.navigate('Allergies')}
      />
      <List.Item
        title="Item History"
        description="View your item history"
        left={props => <List.Icon {...props} icon="history" />}
        onPress={() => this.props.navigation.navigate('Browse History')}
      />
       <Button
       title = "Sign Out"
       onPress={this.signoutUser}
       style={{ padding: "10%", alignSelf: "center" }}
      >
      </Button>
     </View>
   )
 }
}

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});