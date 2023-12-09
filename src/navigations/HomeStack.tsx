import HomeScreen from '../screens/HomeScreen'
import {createStackNavigator} from '@react-navigation/stack'
import { Pressable, Image, StyleSheet } from 'react-native'
import { AppStyles, AppIcon } from '../AppStyles'
import { useDispatch } from 'react-redux'
import auther from '@react-native-firebase/auth'
import {logout} from '../reducers'

const Stack = createStackNavigator()

const styles = StyleSheet.create({
  headerTitleStyle: {
    fontWeight: 'bold',
    textAlign: 'center',
    alignSelf: 'center',
    color: 'black',
  },
  iconStyle: {tintColor: AppStyles.color.tint, width: 30, height: 30},
})

const HomeStack = () => {
  const dispatch = useDispatch()
  return (
  <Stack.Navigator
    initialRouteName='Home'
    screenOptions={{
      headerTintColor: 'red',
      headerTitleStyle: styles.headerTitleStyle,
      headerMode: 'float',
    }}>
    <Stack.Screen
      name="Home"
      component={HomeScreen}
      options={({navigation}) => ({
        headerLeft: () => (
          <Pressable onPress={() => {
            debugger
            auther()
              .signOut()
              .then(() => {
                dispatch(logout())
                navigation.navigate('LoginStack')
              })
          }}>
          <Image style={styles.iconStyle} source={AppIcon.images.logout} />
          </Pressable>
        ),
        headerLeftContainerStyle: {paddingLeft: 10},
      })}
    />
  </Stack.Navigator>
)}

export default HomeStack