import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Button, StyleSheet, Text, View } from 'react-native';

export default function Index({ navigation }: any) {
  const [email, setEmail] = useState<string | null>(null);
  const [uid, setUid] = useState<string | null>(null);
  const [groupName, setGroupName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    let mounted = true;
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
        
        if (mounted) {
          setGroupName(profile.groupName ?? null);
        }
      } catch (e) {
        console.error('Failed to load profile', e);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadProfile();
    return () => { mounted = false; };
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
        <Text>Email:</Text>
        <Text>{email ?? 'Not available'}</Text>
      </View>

      <View>
        <Text>User ID:</Text>
        <Text>{uid ?? 'N/A'}</Text>
      </View>

      <View>
        <Text >Group:</Text>
        <Text>{groupName ?? 'None'}</Text>
      </View>
        {/* include tasks accomplished later */}
        <Text>Points Earned: </Text> 
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