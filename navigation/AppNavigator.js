import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';
import Loading from '../screens/Loading';
import Login from '../screens/Login';
import SignUp from '../screens/SignUp';

export default createAppContainer(
  createSwitchNavigator({
    Loading,
    Login,
    SignUp,
    // You could add another route here for authentication.
    // Read more at https://reactnavigation.org/docs/en/auth-flow.html
    Main: MainTabNavigator,
  },
  {
    initialRouteName: 'Loading'
  })
);
