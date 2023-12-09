import {createStackNavigator} from '@react-navigation/stack'
import { Pressable, StyleSheet, Image } from 'react-native'
import { Wallet } from '../screens'
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

const WalletStack = () => {
  const dispatch = useDispatch()
  return (
  <Stack.Navigator
    initialRouteName="Wallet"
    screenOptions={{
      headerTintColor: 'blue',
      headerTitleStyle: styles.headerTitleStyle,
      headerMode: 'float',
    }}>
    <Stack.Screen
      name="Wallet"
      component={Wallet}
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

export default WalletStack