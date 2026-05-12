import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import CreateGameScreen from '../screens/games/CreateGameScreen';
import GameDetailScreen from '../screens/games/GameDetailScreen';
import MyGamesScreen from '../screens/games/MyGamesScreen';
import CourtDetailScreen from '../screens/home/CourtDetailScreen';
import GymHomeScreen from '../screens/home/GymHomeScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';

const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();

function HomeStackNavigator() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="GymHome"
        component={GymHomeScreen}
        options={{ title: 'Home' }}
      />
      <HomeStack.Screen
        name="CourtDetail"
        component={CourtDetailScreen}
        options={{ title: 'Court' }}
      />
      <HomeStack.Screen
        name="CreateGame"
        component={CreateGameScreen}
        options={{ title: 'Create Game' }}
      />
      <HomeStack.Screen
        name="GameDetail"
        component={GameDetailScreen}
        options={{ title: 'Game Detail' }}
       />
    </HomeStack.Navigator>
  );
}


export default function AppNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={HomeStackNavigator}
        options={{ headerShown: false }}
      />
      <Tab.Screen name="My Games" component={MyGamesScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}