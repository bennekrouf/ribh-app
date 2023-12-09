import {createDrawerNavigator} from '@react-navigation/drawer';
import DrawerContainer from '../components/DrawerContainer';
import TabNavigator from './TabNavigator';

const Drawer = createDrawerNavigator();
const DrawerStack = () => (
  <Drawer.Navigator
    screenOptions={{
      drawerStyle: {outerWidth: 200},
      drawerPosition: 'left',
      headerShown: false,
    }}
    drawerContent={({navigation}) => (
      <DrawerContainer navigation={navigation} />
    )}>
    <Drawer.Screen name="Tab" component={TabNavigator} />
  </Drawer.Navigator>
);

export default DrawerStack