import React, {Component} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import CheckBox from 'react-native-check-box'

export default class MedFilters extends React.Component {
    constructor(props){
        super(props);
        this.state={
          isChecked:false,
          allergy2:false
        }
      }
      render() {
        return (    
          <View style={styles.container}>
              <Text style={styles.welcome}>Select the filters you would like to apply:</Text>
            <CheckBox
                style={{flex: 1, padding: 10}}
                onClick={()=>{
                  this.setState({
                      isChecked:!this.state.isChecked
                  })
                }}    
                isChecked={this.state.isChecked}
            />
            <Text style={styles.CheckBoxTxt}>Peanuts</Text>
            <CheckBox
                style={{flex: 1, padding: 10}}
                onClick={()=>{
                  this.setState({
                      allergy2:!this.state.allergy2
                  })
                }}    
                allergy2={this.state.allergy2}
            />
            <Text style={styles.CheckBoxTxt}>Chocolate</Text>
          </View>
        );
      }
    }
    
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
    CheckBoxTxt: {
        alignItems: 'flex-start',
        flex: 1,
        marginLeft: 50
    }
})