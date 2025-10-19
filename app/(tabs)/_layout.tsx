import { Tabs } from 'expo-router';
import React from 'react';
import { Image, Platform } from 'react-native';

const ICON_SIZE = 24;

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: Platform.select({ ios: 0, android: 4 }),
        },
        tabBarStyle: {
          height: 60,
          paddingBottom: Platform.select({ ios: 15, android: 8 }),
        },
      }}
    >
      <Tabs.Screen
        name="input/index"
        options={{
          title: 'Input',
          tabBarIcon: ({ focused, size = ICON_SIZE }) => (
            <Image
              source={require('../../assets/images/add_icon.png')}
              style={{ width: size, height: size, opacity: focused ? 1 : 0.6 }}
              resizeMode="contain"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="leaderboard/index"
        options={{
          title: 'Leaderboard',
          tabBarIcon: ({ focused, size = ICON_SIZE }) => (
            <Image
              source={require('../../assets/images/leaderboard_icon.png')}
              style={{ width: size, height: size, opacity: focused ? 1 : 0.6 }}
              resizeMode="contain"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile/index"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused, size = ICON_SIZE }) => (
            <Image
              source={require('../../assets/images/profile_icon.png')}
              style={{ width: size, height: size, opacity: focused ? 1 : 0.6 }}
              resizeMode="contain"
            />
          ),
        }}
      />
    </Tabs>
  );
}
