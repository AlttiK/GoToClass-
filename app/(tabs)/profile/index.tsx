import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Button, StyleSheet, Text, View } from 'react-native';

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

  return (
   <View>
        <Text>Profile</Text>
      <View>
         <Text>Name: {name ?? 'Not available'}</Text>
      </View>
      <View>
        <Text>Email: {email ?? 'Not available'}</Text>
      </View>

      <View>
        <Text>User ID: {uid ?? 'N/A'}</Text>
      </View>

      <View>
        <Text >Group: {groupName ?? 'None'}</Text>
        <Text>Join Code: {joinCode ?? 'None'}</Text>
      </View>

        {/* include tasks accomplished later */}
        <Text>Points Earned: {points}</Text> 
        {/* include points earned later */}
      <View>
        {loggingOut ? (
          <ActivityIndicator />
        ) : (
          <Button title="Log Out" onPress={handleLogOut} color="#dc3545" />
        )}
      </View>

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


// includes 
    // name
    // tasks accomplished
    // points earned
    // rank