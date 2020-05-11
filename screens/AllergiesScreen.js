import * as WebBrowser from 'expo-web-browser';
import React, { useState, useEffect } from 'react';
import {
  Alert,
  Text,
  Button,
  View,
  StyleSheet,
  CheckBox,
  SafeAreaView
} from "react-native";
import * as firebase from "firebase";

import Loader from '../components/Loader';

export default function AllergiesScreen() {
  const [user_allergies, setAllergies] = useState([])
  const [Chocolate, setChocolate] = useState(false);
  const [Cinnamon, setCinnamon] = useState(false);
  const [Milk, setMilk] = useState(false);
  const [Peanuts, setPeanuts] = useState(false);
  const [Soy, setSoy] = useState(false);
  const [Wheat, setWheat] = useState(false);

  useEffect(() => {
    getAllergies();
  }, []);

  function getAllergies() {
    const allergies = firebase.database().ref("users/" + firebase.auth().currentUser.uid + "/Filters").once('value').then(function(snapshot) {
      let items = snapshot.val();
      var objectKeys = Object.keys(items);
      for (var i = 0; i < objectKeys.length; i++) {
        var allergy_name = objectKeys[i];
        if (allergy_name == "Chocolate")
            setChocolate(items[allergy_name]);
        if (allergy_name == "Cinnamon")
            setCinnamon(items[allergy_name]);
        if (allergy_name == "Milk")
            setMilk(items[allergy_name]);
        if (allergy_name == "Peanuts")
            setPeanuts(items[allergy_name]);
        if (allergy_name == "Soy")
            setSoy(items[allergy_name]);
        if (allergy_name == "Wheat")
            setWheat(items[allergy_name]);
        //   setAllergies(user_allergies => [...user_allergies, {allergy: objectKeys[i], value: items[allergy_name]}]);
      }
    });
  }

  function onSubmit(){
    firebase
    .database()
    .ref("users/" + firebase.auth().currentUser.uid + '/Filters')
    .set({
        Peanuts: Peanuts,
        Chocolate: Chocolate,
        Cinnamon: Cinnamon,
        Soy: Soy,
        Wheat: Wheat,
        Milk: Milk
    });
    Alert.alert("The selected have been applied");
  }

  function createCheckboxes() {
    return user_allergies.map(function(allergy, i){
      return(
        <View key={i}>
          <Text>{allergy.allergy}</Text>
          <CheckBox
            value={allergy.value}
            onChange={() => onChange(allergy, i)}
            />
        </View>
      );
    });
  }

  return(
      <View>
          <Text style = {styles.welcome}> Select all filters that apply:</Text>
          <View style={styles.allergyRow}>
              <CheckBox
                value={Chocolate}
                onValueChange={() => setChocolate(!Chocolate)}
                />
            <Text>Chocolate</Text>
          </View>
          <View style={styles.allergyRow}>
              <CheckBox
                value={Cinnamon}
                onValueChange={() => setCinnamon(!Cinnamon)}
                />
            <Text>Cinnamon</Text>
          </View>
          <View style={styles.allergyRow}>
              <CheckBox
                value={Milk}
                onValueChange={() => setMilk(!Milk)}
                />
            <Text>Milk</Text>
          </View>
          <View style={styles.allergyRow}>
              <CheckBox
                value={Peanuts}
                onValueChange={() => setPeanuts(!Peanuts)}
                />
            <Text>Peanuts</Text>
          </View>
          <View style={styles.allergyRow}>
              <CheckBox
                value={Soy}
                onValueChange={() => setSoy(!Soy)}
                />
            <Text>Soy</Text>
          </View>
          <View style={styles.allergyRow}>
              <CheckBox
                value={Wheat}
                onValueChange={() => setWheat(!Wheat)}
                />
            <Text>Wheat</Text>
          </View>
          <Button title="Submit" onPress={_ => onSubmit()}/>
      </View>
  );
}

const styles = StyleSheet.create({
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
      },
    allergyRow: {
        padding: 5,
      flexDirection: "row"
    }
  });
  