import auth from '@react-native-firebase/auth';
import { Slot, useRouter, useSegments } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const sub = auth().onAuthStateChanged(user => {
      if (user) {
        if (!segments.some(s => s === '(tabs)')) {
          router.replace('/(tabs)/input');
        }
      } else {
        if (!segments.some(s => s === '(auth)')) {
          router.replace('/(auth)');
        }
      }
      setReady(true);
    });
    return () => sub();
  }, [segments, router]);


  if (!ready) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  return <Slot />;
}