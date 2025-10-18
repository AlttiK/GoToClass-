import { Stack } from "expo-router";
import { View } from "react-native";
import HomeScreen from './homeScreen';

export default function RootLayout() {
  return (
    <View>
      <HomeScreen/>
    </View>
  );
}
