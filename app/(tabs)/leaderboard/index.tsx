import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import React, { useEffect, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#C074FF', 
        padding: 15, 
        margin: 10,
        flexDirection: 'column', 

    },
    text: {
        fontSize: 20,
        color: '#321d42',
    },
    buttonStyle: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    }
});

interface MemberData {
  uid: string;
  name: string,
  email: string;
  points: number;
  rank: number;
}

export default function Index() {
    const [groupName, setGroupName] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [members, setMembers] = useState<any[]>([]);
    const [currentUserUid, setCurrentUserUid] = useState<string | null>(null);



    useEffect(() => {
        let groupMembersRef: any = null;
        const memberListeners: Array<{uid: string, ref: any}> = [];
        const handleLeaderboard = async () => { 
            const user = auth().currentUser;
            if (!user) {
                return;
            }
            setCurrentUserUid(user.uid);
            setError(null);
            setLoading(true);
            try {
                const userProfile = await database().ref(`users/${user.uid}`).once('value');
                const userData = userProfile.val();
                const groupId = userData.groupId;

                if (!groupId) {
                    return;
                }
                const groupMembers = await database().ref(`groups/${groupId}`).once('value');
                const groupData = groupMembers.val();

                if (!groupId) {
                    return;
                }

                const groupRef = database().ref(`groups/${groupId}`);
                groupRef.on('value', (groupSnap) => {
                const groupData = groupSnap.val();

                if (!groupData) {
                    setError('Group not found');
                    setLoading(false);
                    return;
                }

                
                setGroupName(groupData.name);

                const membersObj = groupData.members || {};
                const memberUids = Object.keys(membersObj);

                memberListeners.forEach(({ uid, ref }) => {
                    ref.off('value');
                });
                memberListeners.length = 0;

                const membersDataTemp: { [uid: string]: MemberData } = {};

                memberUids.forEach((memberUid) => {
                    const memberRef = database().ref(`users/${memberUid}`);
                    
                    const listener = memberRef.on('value', (memberSnap) => {
                        const memberData = memberSnap.val() || {};
                        
                            membersDataTemp[memberUid] = {
                            uid: memberUid,
                            name: memberData.name,
                            email: memberData.email || 'Unknown',
                            points: memberData.points || 0,
                            rank: 0
                    };

                    const membersArray = Object.values(membersDataTemp);
                    
                    membersArray.sort((a, b) => b.points - a.points);

                    const rankedMembers = membersArray.map((member, index) => ({
                        ...member,
                        rank: index + 1
                    }));

                
                    setMembers(rankedMembers);
                    setLoading(false);
                    
                    });

                    memberListeners.push({ uid: memberUid, ref: memberRef });
                });
                });
            
                groupMembersRef = groupRef;

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

        handleLeaderboard();

        return () => {
            if (groupMembersRef) {
                groupMembersRef.off('value');
            }
            memberListeners.forEach(({ ref }) => {
                ref.off('value');
            });
        };

    }, []);


    const renderMember = ({ item }: { item: MemberData }) => {
        const isCurrentUser = item.uid === currentUserUid;
        return (
        <ScrollView>
            <View style={styles.container}>
            <Text style={styles.text}>#{item.rank} {item.name} {isCurrentUser ? '(You)' : ''} {item.points} pts</Text>
            </View>
        </ScrollView>
        );
    };

    return (
        <View>
            
            <Text>Leaderboard</Text>
            {groupName && <Text>{groupName}</Text>}

            {members.length === 0 ? (
                <View>
                <Text>No members in this group yet</Text>
                </View>
            ) : (
                <FlatList
                data={members}
                renderItem={renderMember}
                keyExtractor={(item) => item.uid}
                />
            )}
            {/* <View style={styles.buttonStyle}>
                <Button title="Home" onPress={() => navigation.navigate('Home')}/>
                <Button title="Input" onPress={() => navigation.navigate('Input')}/>
                <Button title="Leaderboard" onPress={() => navigation.navigate('Leader')}/>
                <Button title="Profile" onPress={() => navigation.navigate('Profile')}/>
            </View> */}
        </View>
    );
}