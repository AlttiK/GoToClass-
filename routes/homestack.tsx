import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Stack } from 'expo-router';
import LogIn from '../app/_layout';
import Home from '../app/home/activityDetail';
import Input from '../app/input/InputClass';
import Leaderboard from '../app/leaderboard/leaderboard';
import Profile from '../app/profile/profile';


const screens = {
    LogIn: {
        screen: LogIn
    },
    Home: {
        screen: Home
    }, 
    Input: {
        screen: Input
    },
    Leaderboard: {
        screen: Leaderboard
    },
    Profile: {
        screen: Profile
    }
}

const HomeStack = createNativeStackNavigator();

const App = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="LogIn" component={LogIn} />
                <Stack.Screen name="Home" component={Home} />
                <Stack.Screen name="Input" component={Input} />
                <Stack.Screen name="Leaderboard" component={Leaderboard} />
                <Stack.Screen name="Profile" component={Profile} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

// export default createAppContainer(HomeStack);