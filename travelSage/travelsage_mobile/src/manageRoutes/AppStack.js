import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { useAuth } from '../contexts/Auth';
import { AuthContext } from '../contexts/Auth';
import InterestsScreen from '../components/InterestsScreen';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { Icon } from '@rneui/base';
import AddNewBlogNavigator from '../manageRoutes/AddNewBlogNavigator';
import SearchBlogs from '../screens/appFlow/SearchBlogs';
import ViewBlogsNavigator from '../manageRoutes/ViewBlogsNavigator';
import SageAINavigator from './SageAiRoutes';

const Stack = createNativeStackNavigator();
const Tab = createMaterialBottomTabNavigator();

export const AppStack = () => {
  // const { authData } = useAuth();

  const { authData } = useContext(AuthContext)

  return (
    <>
      {authData?.user?.interest?.length === 0 ? (
        <Stack.Navigator>
          <Stack.Screen options={{ headerShown: false }} name="InterestsScreen" component={InterestsScreen} />
        </Stack.Navigator>
      ) : (
        <Tab.Navigator
          initialRouteName="Home"
          activeColor="#8CCFCB"
          inactiveColor="#0D1314"
          activeIndicatorStyle={{ backgroundColor: '#8CCFCB' }}
          barStyle={{ backgroundColor: '#008080' }}
          labeled={false}
        >
          <Tab.Screen
            options={{
              headerShown: false,
              tabBarIcon: () => <Icon name="home" color="black" size={24} />
            }}
            name="Home"
            component={ViewBlogsNavigator}
          />
          <Tab.Screen
            options={{
              headerShown: false,
              tabBarIcon: () => <Icon name="search" color="black" size={24} />
            }}
            name="Search"
            component={SearchBlogs}
          />
          <Tab.Screen
            options={{
              headerShown: false,
              tabBarIcon: () => <Icon name="add" color="black" size={24} />
            }}
            name="New Blog"
            component={AddNewBlogNavigator}
          />
          <Tab.Screen
            options={{
              headerShown: false,
              tabBarIcon: () => <Icon name="home" color="black" size={24} />
            }}
            name="Profile"
            component={SageAINavigator}
          />
        </Tab.Navigator>
      )}
    </>
  );
};
