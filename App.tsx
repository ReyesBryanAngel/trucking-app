import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TripProvider } from './src/context/TripContext';
import { RootStackParamList } from './src/types';
import TripListScreen from './src/screens/TripListScreen';
import TripDetailScreen from './src/screens/TripDetailScreen';
import PreTripInspectionScreen from './src/screens/PreTripInspectionScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <TripProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="TripList"
          screenOptions={{
            headerStyle: { backgroundColor: '#1A3C5E' },
            headerTintColor: '#FFFFFF',
            headerTitleStyle: { fontWeight: '700', fontSize: 16 },
            contentStyle: { backgroundColor: '#F5F7FA' },
          }}
        >
          <Stack.Screen
            name="TripList"
            component={TripListScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="TripDetail"
            component={TripDetailScreen}
            options={{ title: 'Trip Details' }}
          />
          <Stack.Screen
            name="PreTripInspection"
            component={PreTripInspectionScreen}
            options={{ title: 'Pre-Trip Inspection' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </TripProvider>
  );
}
