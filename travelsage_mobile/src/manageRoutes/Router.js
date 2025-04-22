import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../contexts/Auth';
import { AuthStack } from './AuthStack';
import { AppStack } from './AppStack';
import { Loading } from '../components/LoadingScreen';
import Toast from 'react-native-toast-message'; // Don't forget this import

export const Router = () => {
  const { authData, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <NavigationContainer>
        {authData ? <AppStack /> : <AuthStack />}
      </NavigationContainer>
      <Toast />
    </>
  );
};
