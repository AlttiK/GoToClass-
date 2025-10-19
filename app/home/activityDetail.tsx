import { View, Button } from "react-native";
import Index from './index';
import App from '../routes/homestack';

export default function RootLayout() {
  return (
    <View>
      <Index/>
      <View>
        <Button title="Home" onPress={()}/>
        <Button title="Input"/>
        <Button title="Leaderboard"/>
        <Button title="Profile"/>
      </View>
    </View>
  );
}