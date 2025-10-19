import React from 'react';
import { Button, StyleSheet, Text, View } from "react-native";

export default function Index({ navigation, route }: { navigation: any; route: any }) {
    const params = route?.params ?? {};
    const uid = params.uid ?? null;
    const groupId = params.groupId ?? null;
    const groupName = params.groupName ?? null;

    return (
        <View>
            <Text>Signed in uid: {uid ?? 'N/A'}</Text>
            <Text>Group: {groupName ?? groupId ?? 'None'}</Text>
            <Text>Accomplishments:</Text>
            
            

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
