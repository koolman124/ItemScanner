import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';
import AppLoginNavigator from './AppLoginNavigator';
import Loading from '../screens/Loading';

export default createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: Loading,
      App: MainTabNavigator,
      Auth: AppLoginNavigator,
    },
    {
      initialRouteName: 'AuthLoading',
    }
  )
);
