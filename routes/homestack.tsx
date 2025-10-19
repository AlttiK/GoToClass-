import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import LogIn from '../app/_layout';
import Home from '../app/home/activityDetail';
import Input from '../app/input/InputClass';
import Leader from '../app/leaderboard/leaderboard';
import Profile from '../app/profile/profile';


const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen component={LogIn} name="LogIn"/>
                <Stack.Screen component={Home} name="Home"/>
                <Stack.Screen component={Input} name="Input"/>
                <Stack.Screen component={Leader} name="Leader"/>
                <Stack.Screen component={Profile} name="Profile"/>
            </Stack.Navigator>
        </NavigationContainer>
    );
}
