import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function Index() {
  const [name, setName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [uid, setUid] = useState<string | null>(null);
  const [groupName, setGroupName] = useState<string | null>(null);
  const [groupId, setGroupId] = useState<string | null>(null);
  const [points, setPoints] = useState<number | null>(null);
  const [joinCode, setJoinCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  const [joinNewGroup, setJoinNewGroup] = useState(false);
  const [createNewGroup, setCreateNewGroup] = useState(false);
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [newGroupNameInput, setNewGroupNameInput] = useState('');

  const styles = StyleSheet.create({
    center:{
      alignItems: 'center',
    },
    container: {
      flex: 1,
      padding: 25,
      backgroundColor: '#e3fafc', 
      // justifyContent: 'center',
      // alignItems: 'center',
    },
    button: {
        backgroundColor: '#ffd70d',
        height: 40,
        borderRadius: 5,
        margin: 4,
    },
    buttonText: {
      color: '#a55b00ff',
      textAlign: 'center',
      fontSize: 18,
      fontWeight: 'bold',
      marginTop: 6,
    },
    header: {
      fontSize: 24,
      color: '#a55b00ff',
      fontWeight: 'bold',
      textAlign: 'center',
      marginTop: 10,
    }
  });

  const generateJoinCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  useEffect(() => {
    let mounted = true;
    let pointsRef: any = null;
    const loadProfile = async () => {
      try {
        const user = auth().currentUser;
        if (!user) {
          if (mounted) setLoading(false);
          return;
        }
        
        setEmail(user.email);
        setUid(user.uid);

        const snap = await database().ref(`users/${user.uid}`).once('value');
        const profile = snap.val() || {};

        const userGroupId = profile.groupId;
        const userName = profile.name;
        setName(userName);
        setGroupId(userGroupId);
        
        pointsRef = database().ref(`users/${user.uid}/points`);
        pointsRef.on('value', (pointsSnap: any) => {
          if (mounted) {
            setPoints(pointsSnap.val() || 0);
          }
        });

        // If user has a groupId, fetch group details from groups/{groupId}
        if (userGroupId) {
          const groupSnap = await database().ref(`groups/${userGroupId}`).once('value');
          const groupData = groupSnap.val();
          
          if (groupData && mounted) {
            setGroupName(groupData.name ?? null);
            setJoinCode(groupData.joinCode ?? null);
          }
        }

      } catch (e) {
        console.error('Failed to load profile', e);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadProfile();
    return () => {
      mounted = false;
      if (pointsRef) {
        pointsRef.off('value');
      }
    };
  }, []);

  const handleLogOut = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: async () => {
            setLoggingOut(true);
            try {
              await auth().signOut();
            } catch (e) {
              console.error('Log out error', e);
              Alert.alert('Error', 'Failed to log out');
            } finally {
              setLoggingOut(false);
            }
          }
        }
      ]
    );
  };

  // const handleJoinNewGroup = () => {
  //   Alert.prompt('Join Group', 'Enter group join code:',
  //     [
  //       {text: 'Cancel', style: 'cancel'},
  //       {
  //         text: 'Join',
  //         onPress: async (code) => {
  //           setJoinNewGroup(true);
  //           if (!code || code.trim() === '') {
  //             Alert.alert('Error', 'Please enter a join code');
  //             return;
  //           }
  //           try {
  //             const user = auth().currentUser;
  //             if (!user) {
  //               return;
  //             }
  //             const codeToFind = code.trim().toUpperCase();

  //             const group = await database().ref('groups').orderByChild('joinCode').equalTo(codeToFind).once('value');

  //             if (!group.exists()) {
  //               Alert.alert('Error', 'Group not found');
  //               return;
  //             }

  //             const groupData = group.val();
  //             const newGroupId = Object.keys(groupData)[0];
  //             const newGroup = groupData[newGroupId];

  //             await database().ref(`groups/${groupId}/members/${user.uid}`).remove();
  //             await database().ref(`groups/${newGroupId}/members/${user.uid}`).set(true);
  //             await database().ref(`users/${user.uid}/groupId`).set(newGroupId);

  //             setGroupId(newGroupId);
  //             setGroupName(newGroup.name);
  //             setJoinCode(newGroup.joinCode);
  //             Alert.alert('Success', `You joined ${newGroup.name}!`);
  //           }
  //           catch(e) {
  //             console.error('Join group error', e);
  //             Alert.alert('Error', 'Failed to join group');
  //           }
  //           finally {
  //             setJoinNewGroup(false);
  //           }
  //         }
  //       }
  //     ], 'plain-text'
  //   );
  // };

  const handleJoinGroup = async () => {
    if (!joinCodeInput.trim()) {
      Alert.alert('Error', 'Please enter a join code');
      return;
    }

    setJoinNewGroup(true);
    try {
      const user = auth().currentUser;
      if (!user) {
        Alert.alert('Error', 'You must be signed in');
        return;
      }

      const codeToFind = joinCodeInput.trim().toUpperCase();

      const groupsSnap = await database()
        .ref('groups')
        .orderByChild('joinCode')
        .equalTo(codeToFind)
        .once('value');

      if (!groupsSnap.exists()) {
        Alert.alert('Error', 'Group not found with that code');
        return;
      }

      const groupData = groupsSnap.val();
      const foundGroupId = Object.keys(groupData)[0];
      const foundGroup = groupData[foundGroupId];

      if (groupId) {
      await database().ref(`groups/${groupId}/members/${user.uid}`).remove();
      }

      await database().ref(`groups/${foundGroupId}/members/${user.uid}`).set(true);
      await database().ref(`users/${user.uid}/groupId`).set(foundGroupId);
      await database().ref(`users/${user.uid}/points`).set(0);

      setGroupId(foundGroupId);
      setGroupName(foundGroup.name);
      setJoinCode(foundGroup.joinCode);
      setJoinCodeInput('');

      Alert.alert('Success', `You joined ${foundGroup.name}!`);
    } catch (e) {
      console.error('Join group error', e);
      Alert.alert('Error', 'Failed to join group');
    } finally {
      setJoinNewGroup(false);
    }
  };

  // const handleCreateNewGroup = () => {
  //   Alert.prompt(
  //     'Create Group',
  //     'Enter a name for your new group:',
  //     [
  //       { text: 'Cancel', style: 'cancel' },
  //       {
  //         text: 'Create',
  //         onPress: async (newGroupName: any) => {
  //           setCreateNewGroup(true);
  //           if (!newGroupName || newGroupName.trim() === '') {
  //             Alert.alert('Error', 'Please enter a group name');
  //             return;
  //           }

  //           try {
  //             const user = auth().currentUser;
  //             if (!user) {
  //               return;
  //             }

  //             const newJoinCode = generateJoinCode();
  //             const newGroupRef = database().ref('groups').push();
  //             const newGroupId = newGroupRef.key;

  //             if (!newGroupId) {
  //               return;
  //             }

  //             await database().ref(`groups/${groupId}/members/${user.uid}`).remove();

  //             await newGroupRef.set({
  //               name: newGroupName.trim(),
  //               joinCode: newJoinCode,
  //               owner: user.uid,
  //               createdAt: database.ServerValue.TIMESTAMP,
  //               members: {
  //                 [user.uid]: true
  //               }
  //             });

  //             await database().ref(`users/${user.uid}/groupId`).set(newGroupId);

  //             setGroupId(newGroupId);
  //             setGroupName(newGroupName.trim());
  //             setJoinCode(newJoinCode);

  //             Alert.alert(
  //               'Success',
  //               `Group "${newGroupName}" created!`
  //             );
  //           } 
  //           catch (e) {
  //             console.error('Create group error', e);
  //             Alert.alert('Error', 'Failed to create group');
  //           }
  //           finally {
  //             setCreateNewGroup(false);
  //           }
  //         }
  //       }
  //     ],
  //     'plain-text'
  //   );
  // };

  const handleCreateGroup = async () => {
    if (!newGroupNameInput.trim()) {
      Alert.alert('Error', 'Please enter a group name');
      return;
    }

    setCreateNewGroup(true);
    try {
      const user = auth().currentUser;
      if (!user) {
        Alert.alert('Error', 'You must be signed in');
        return;
      }

      const newJoinCode = generateJoinCode();
      const newGroupRef = database().ref('groups').push();
      const newGroupId = newGroupRef.key;

      if (!newGroupId) {
        Alert.alert('Error', 'Failed to generate group ID');
        return;
      }

      if (groupId) {
      await database().ref(`groups/${groupId}/members/${user.uid}`).remove();
      }
      
      await newGroupRef.set({
        name: newGroupNameInput.trim(),
        joinCode: newJoinCode,
        owner: user.uid,
        createdAt: database.ServerValue.TIMESTAMP,
        members: {
          [user.uid]: true
        }
      });

      await database().ref(`users/${user.uid}/groupId`).set(newGroupId);
      await database().ref(`users/${user.uid}/points`).set(0);

      setGroupId(newGroupId);
      setGroupName(newGroupNameInput.trim());
      setJoinCode(newJoinCode);
      setNewGroupNameInput('');

      Alert.alert(
        'Success',
        `Group "${newGroupNameInput.trim()}" created!`
      );
    } catch (e) {
      console.error('Create group error', e);
      Alert.alert('Error', 'Failed to create group');
    } finally {
      setCreateNewGroup(false);
    }
  };

  return (
   <View style={styles.container}>
        <Text style={styles.header}>Profile</Text>
        <Text>Name: {name ?? 'Not available'}</Text>
        <Text>Email: {email ?? 'Not available'}</Text>
        <Text>User ID: {uid ?? 'N/A'}</Text>
        <Text >Group: {groupName ?? 'None'}</Text>
        <Text>Join Code: {joinCode ?? 'None'}</Text>
        {/* include tasks accomplished later */}
        <Text>Points Earned: {points}</Text> 
        {/* include points earned later */}

        <View>
        <Text>Join a Group</Text>
        <TextInput
          placeholder="Enter join code"
          value={joinCodeInput}
          onChangeText={setJoinCodeInput}
          autoCapitalize="characters"
          maxLength={6}
        />
        {joinNewGroup ? (
          <ActivityIndicator />
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleJoinGroup}>
            <Text style={styles.buttonText}>Join Group</Text>
          </TouchableOpacity>
        )}
      </View>

      <View >
        <Text>Create a New Group</Text>
        <TextInput
          placeholder="Enter group name"
          value={newGroupNameInput}
          onChangeText={setNewGroupNameInput}
        />
        {createNewGroup ? (
          <ActivityIndicator />
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleCreateGroup}>
            <Text style={styles.buttonText}>Create Group</Text>
          </TouchableOpacity>
        )}
      </View>
        {loggingOut ? (
          <ActivityIndicator />
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleLogOut}>
            <Text style={styles.buttonText}>Log Out</Text>
          </TouchableOpacity>
        )}

        {/* <TouchableOpacity style={styles.button} onPress={handleJoinNewGroup}>
          <Text style={styles.buttonText}>Join New Group</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleCreateNewGroup}>
          <Text style={styles.buttonText}>Create New Group</Text>
        </TouchableOpacity> */}

        {/* <View style={styles.buttonStyle}>
              <Button title="Home" onPress={() => navigation.navigate('Home')}/>
              <Button title="Input" onPress={() => navigation.navigate('Input')}/>
              <Button title="Leaderboard" onPress={() => navigation.navigate('Leader')}/>
              <Button title="Profile" onPress={() => navigation.navigate('Profile')}/>
        </View> */}
   </View>
  );
}


// includes 
    // name
    // tasks accomplished
    // points earned
    // rank