import { Tabs } from 'expo-router';
import React from 'react';
import { Image } from 'react-native';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="input" options={{ 
        title: 'Input',
        tabBarIcon: () => (
            <Image
                source={require('../../assets/images/add_icon.png')}
            />
        )}} />
      <Tabs.Screen name="leaderboard" options={{ title: 'Leaderboard' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}