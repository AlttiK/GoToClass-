import database from '@react-native-firebase/database';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';



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
        let membersArray = members;
        for (let i: number = 0; i < membersArray.length; i++) {
            let smallestPoints = membersArray[i].points;
            let smallestMember = membersArray[i];
            for (let j: number = membersArray.length - (membersArray.length - i); j > 0; j++) {
                if (membersArray[j].points < smallestPoints) {
                    smallestPoints = membersArray[j].points;
                    smallestMember = membersArray[j];
                }   
            }
            members[i] = smallestMember;
        }
    };

    const prepared: any[] = [];

    const listOfMembers = () => {
        for (let i: number = 0; i < members.length; i++) {
            prepared.push(<Text>{i}. {members[i].name} with {members[i].points} points</Text>)
        }

    };


    return (
        <View>
            <Text>Leaderboard</Text>
            {prepared}

            {/* <View style={styles.buttonStyle}>
                <Button title="Home" onPress={() => navigation.navigate('Home')}/>
                <Button title="Input" onPress={() => navigation.navigate('Input')}/>
                <Button title="Leaderboard" onPress={() => navigation.navigate('Leader')}/>
                <Button title="Profile" onPress={() => navigation.navigate('Profile')}/>
            </View> */}
        </View>
    );
}

const styles = StyleSheet.create({
    buttonStyle: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    }
});