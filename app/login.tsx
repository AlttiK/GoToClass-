import React from 'react';
import { TextInput, View } from 'react-native';


const LoginScreen = () => {
    return (
        <View>
            <TextInput placeholder="Username"/>
            <TextInput
                secureTextEntry={true}
                placeholder="Password"/>
        </View>
    );
    
};

export default LoginScreen;