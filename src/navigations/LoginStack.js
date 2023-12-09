import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import {createStackNavigator} from '@react-navigation/stack';
import { StyleSheet } from 'react-native';
import {AppIcon, AppStyles} from '../AppStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';

const Stack = createStackNavigator()
const styles = StyleSheet.create({
  headerTitleStyle: {
    fontWeight: 'bold',
    textAlign: 'center',
    alignSelf: 'center',
    color: 'black',
  },
  iconStyle: {tintColor: AppStyles.color.tint, width: 30, height: 30},
});
const LoginStack = () => {
  return (
        <Stack.Navigator
          initialRouteName='Welcome'
          screenOptions={{
            headerTintColor: 'red',
            headerTitleStyle: styles.headerTitleStyle,
            headerMode: 'float',
          }}>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
          
        </Stack.Navigator>
      )
  };

export default LoginStack