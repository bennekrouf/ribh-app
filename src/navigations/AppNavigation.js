// import React, { Component } from 'react'
import {Image, StyleSheet, ActivityIndicator} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import {AppIcon, AppStyles} from '../AppStyles';
import LoginStack from './LoginStack';
import DrawerStack from './DrawerStack';
const Stack = createStackNavigator()

const linking = {
  prefixes: ['mayo://']
}

// Manifest of possible screens
const RootNavigator = () => (
  <Stack.Navigator
    initialRouteName="LoginStack"
    screenOptions={{headerShown: false}}>
    <Stack.Screen name="LoginStack" component={LoginStack} />
    <Stack.Screen name="DrawerStack" component={DrawerStack} />
  </Stack.Navigator>
);

const AppNavigator = () => (
  <NavigationContainer
      linking={linking}
      fallback={<ActivityIndicator color="blue" size="large" />}
    >
    <RootNavigator />
  </NavigationContainer>
);

const styles = StyleSheet.create({
  headerTitleStyle: {
    fontWeight: 'bold',
    textAlign: 'center',
    alignSelf: 'center',
    color: 'black',
  },
  iconStyle: {tintColor: AppStyles.color.tint, width: 30, height: 30},
});

export default AppNavigator;
