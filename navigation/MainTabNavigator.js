import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import ProductList from '../screens/ProductList';
import ProductScreen from '../screens/ProductScreen';
import BarcodeScanner from '../screens/BarcodeScanner';
import SettingsScreen from '../screens/SettingsScreen';
import MapScreen from '../screens/MapScreen';
import MedFilters from '../screens/MedFilters';
import TestMapScreen from '../screens/TestMapScreen';
import BrowseHistory from '../screens/BrowseHistory';
import AllergiesScreen from '../screens/AllergiesScreen';

const HomeStack = createStackNavigator();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }}/>
      <HomeStack.Screen name="SearchScreen" component={SearchScreen} />
      <HomeStack.Screen name="BarcodeScanner" component={BarcodeScanner} />
      <HomeStack.Screen name="Product" component={ProductScreen} />
      <HomeStack.Screen name="TestMapScreen" component={TestMapScreen} />
      <HomeStack.Screen name="ProductList" component= {ProductList}/>
      <HomeStack.Screen name="MapScreen" component={MapScreen} />
    </HomeStack.Navigator>
  )
}

const SettingsStack = createStackNavigator();

function SettingsStackScreen() {
  return (
    <SettingsStack.Navigator>
      <SettingsStack.Screen name="Settings" component={SettingsScreen} />
      <SettingsStack.Screen name="AllergiesScreen" component={AllergiesScreen} />
      {/* <SettingsStack.Screen name="BrowseHitory" component={BrowseHistory}/> */}
    </SettingsStack.Navigator>
  )
}

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused
                ? 'md-home'
                : 'md-home';
            } else if (route.name === 'Scan') {
              iconName = focused ? 'ios-search' : 'ios-search';
            } else if (route.name === 'Settings') {
              iconName = focused ? 'ios-list-box' : 'ios-list';
            }

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
        tabBarOptions={{
          activeTintColor: '#00BFFF',
          inactiveTintColor: 'gray',
        }}
        initialRouteName="Home" >
        <Tab.Screen name="Home" component={HomeStackScreen} />
        <Tab.Screen name="Settings" component={SettingsStackScreen} />
      </Tab.Navigator>
  );
}