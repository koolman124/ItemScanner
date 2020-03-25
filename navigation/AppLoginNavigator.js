import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Loading from '../screens/Loading';
import Login from '../screens/Login';
import SignUp from '../screens/SignUp';

const AppLoginStack = createStackNavigator();

export default function AppLoginNavigator() {
  return (
      <AppLoginStack.Navigator
        initialRouteName="Login">
        <AppLoginStack.Screen name="Login" component={Login} />
        <AppLoginStack.Screen name="SignUp" component={SignUp} />
        <AppLoginStack.Screen name="Loading" component={Loading} />
      </AppLoginStack.Navigator>    
  );
}