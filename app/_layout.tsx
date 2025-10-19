import auth from '@react-native-firebase/auth';
import { Slot, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function RootLayout() {
  const router = useRouter();
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const sub = auth().onAuthStateChanged(user => {
      // route groups used in your project: /(auth) and /(tabs)
      if (user) {
        // signed in -> show tabs home
        router.replace('/(tabs)/home');
      } else {
        // not signed in -> show auth screens
        router.replace('/(auth)/Welcome');
      }
      if (initializing) setInitializing(false);
    });

    return () => sub();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (initializing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  // expo-router will render the matched route/group here
  return <Slot />;
}