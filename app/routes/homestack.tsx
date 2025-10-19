import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import LogIn from '../_layout';
import Home from '../home/activityDetail';
import Input from '../input/InputClass';
import Leader from '../leaderboard/leaderboard';
import Profile from '../profile/profile';


const Stack = createNativeStackNavigator();

export default function Navigate() {
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
