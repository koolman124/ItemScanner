import React from 'react'
import { StyleSheet, Text, TextInput, View, Button, Alert } from 'react-native'
import firebase from 'firebase'

export default class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      passwordConfirm: ""
    };
  }
  onSignupPress = () => {
    if (this.state.password !== this.state.passwordConfirm) {
      Alert.alert(
        "Password:" +
          this.state.password +
          " does not match password confirmation: " +
          this.state.passwordConfirm
      );
      return;
    } 
    else {
      firebase
      .auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(
        res => {
          res.user.updateProfile({
            displayName: this.state.firstName + " " + this.state.lastName,
            photoURL: "https://i.stack.imgur.com/l60Hf.png"
          });
          firebase
            .database()
            .ref("users/" + res.user.uid)
            .set({
              firstName: this.state.firstName,
              lastName: this.state.lastName,
            });
            firebase
            .database()
            .ref("users/" + res.user.uid + '/Filters')
            .set({
              Peanuts: false,
              Chocolate: false,
              Cinnamon: false,
              Soy: false,
              Wheat: false,
              Milk: false
            });
            this.props.navigation.navigate("Login");
        },
        error => {
          Alert.alert(error.message);
        });
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Text>Sign Up</Text>
        {this.state.errorMessage &&
          <Text style={{ color: 'red' }}>
            {this.state.errorMessage}
          </Text>}
          <TextInput
          placeholder="First Name"
          autoCapitalize="none"
          style={styles.textInput}
          onChangeText={firstName => this.setState({ firstName })}
          value={this.state.firstName}
        />
        <TextInput
          placeholder="Last Name"
          autoCapitalize="none"
          style={styles.textInput}
          onChangeText={lastName => this.setState({ lastName })}
          value={this.state.lastName}
        />
        <TextInput
          placeholder="Email"
          autoCapitalize="none"
          style={styles.textInput}
          onChangeText={email => this.setState({ email })}
          value={this.state.email}
        />
        <TextInput
          secureTextEntry
          placeholder="Password"
          autoCapitalize="none"
          style={styles.textInput}
          onChangeText={password => this.setState({ password })}
          value={this.state.password}
        />
        <TextInput
        secureTextEntry
          placeholder="Password Confirm"
          autoCapitalize="none"
          style={styles.textInput}
          onChangeText={passwordConfirm => this.setState({ passwordConfirm })}
          value={this.state.passwordConfirm}
        />
        <Button title="Sign Up" onPress={this.onSignupPress} />
        <Button
          title="Already have an account? Login"
          onPress={() => this.props.navigation.navigate('Login')}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  textInput: {
    height: 40,
    width: '90%',
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 8
  }
})