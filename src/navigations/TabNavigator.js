import ListStack from './ListStack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import { AppStyles, AppIcon } from '../AppStyles';
import HomeStack from './HomeStack';
import { Image } from 'react-native';
import WalletStack from './WalletStack';

const BottomTab = createBottomTabNavigator();

const TabNavigator = () => (
  <BottomTab.Navigator
    initialRouteName="Home"
    screenOptions={{
      tabBarInactiveTintColor: 'grey',
      tabBarActiveTintColor: AppStyles.color.tint,
      tabBarIcon: ({focused}) => {
        return (
          <Image
            style={{
              tintColor: focused ? AppStyles.color.tint : AppStyles.color.grey,
            }}
            source={AppIcon.images.home}
          />
        );
      },
      headerShown: false,
    }}>
    <BottomTab.Screen
      options={{tabBarLabel: 'Home'}}
      name="HomeStack"
      component={HomeStack}
    />
    <BottomTab.Screen
      options={{tabBarLabel: 'List'}}
      name="ListStack"
      component={ListStack}
    />
    <BottomTab.Screen
      options={{tabBarLabel: 'Wallet'}}
      name="WalletStack"
      component={WalletStack}
    />
  </BottomTab.Navigator>
);

export default TabNavigator