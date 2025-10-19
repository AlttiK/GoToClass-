import { Stack } from 'expo-router';
import React from 'react';

export default function HomeStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true, // show header for stack screens (adjust per your design)
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Home' }} />
      <Stack.Screen name="activityDetail" options={{ title: 'Activity' }} />
      {/* add other Home stack screens here */}
    </Stack>
  );
}