import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';





export default function Index(navigation: any) {
    return (
        <View>
            <Text>Leaderboard</Text>

            <View style={styles.buttonStyle}>
                <Button title="Home" onPress={() => navigation.navigate('Home')}/>
                <Button title="Input" onPress={() => navigation.navigate('Input')}/>
                <Button title="Leaderboard" onPress={() => navigation.navigate('Leader')}/>
                <Button title="Profile" onPress={() => navigation.navigate('Profile')}/>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    buttonStyle: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    }
});