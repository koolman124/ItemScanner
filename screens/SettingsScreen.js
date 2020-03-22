import React from 'react';
import { StyleSheet, Text, View, Alert, Button } from "react-native";
import firebase from 'firebase';

class SettingsScreen extends React.Component{
  signoutUser = async () => {
    await firebase
    .auth()
    .signOut()
    .then (
      () => {
        Alert.alert("You successfully logged out")
        this.props.navigation.navigate ("Login");
      },
      error => {
        Alert.alert(error.message)
      }
    );
};
 render() {
   return (
     <View style = {StyleSheet.Container}>
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