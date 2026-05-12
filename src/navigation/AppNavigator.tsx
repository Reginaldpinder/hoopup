import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import MyGamesScreen from '../screens/games/MyGamesScreen';
import GymHomeScreen from '../screens/home/GymHomeScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={GymHomeScreen} />
      <Tab.Screen name="My Games" component={MyGamesScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}