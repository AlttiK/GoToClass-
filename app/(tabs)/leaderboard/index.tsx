import database from '@react-native-firebase/database';
import React, { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';





export default function Index(navigation: any, user: any) {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [members, setMembers] = useState<any[]>([]);

    const handleLeaderboard = async () => { 
        setError(null);
        setLoading(true);
        try {
            const snap = await database().ref(`groups/${user.groupId}`).once('value');
            const groupData = snap.val();
            const members = groupData.members || {};
            setMembers(members);
        } catch (e: any) {
            const code = e?.code || '';
            if (code === 'auth/group-not-found') {
                setError('Invalid group');
            } else {
                setError(e?.message ?? 'Failed to get group');
            }
        } finally {
            setLoading(false);
        }
    };

    const organizeMembersByPoints = () => {
        
    };

    // useEffect(() => {
    //     const fetchUserData = async () => {
    //         try {
    //             const response = await fetch('https://api.example.com/userdata');
    //             if (!response.ok) {
    //                 throw new Error('Network response was not ok');
    //             }
    //             const data = await response.json();
    //             setUserData(data);
    //         } catch (error) {
    //             console.error('Error fetching user data:', error);
    //         }
    //     };
    
    // }
    
    // )




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