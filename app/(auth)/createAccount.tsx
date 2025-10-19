import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';

const generateJoinCode = () => {
    return Math.random().toString(36).substring(4, 10).toUpperCase();
}

export default function CreateAccount() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [joinCode, setJoinCode] = useState('');

  const createProfile = async (uid: string, emailValue: string, groupId?: string, group?: string, code?: string, points?: number) => {
    const update: any = {
        email: emailValue,
        createdAt: database.ServerValue.TIMESTAMP,
        points: 0,
    };
    if (groupId) 
        update.groupId = groupId;
    if (group) 
        update.groupName = group;
    if (code)
        update.joinCode = code;
    await database()
      .ref(`users/${uid}`)
      .set({
        email: emailValue,
        createdAt: database.ServerValue.TIMESTAMP,
        points: 0,
      });
  };

  const createGroupInDatabase = async (ownerUid: string) => {
    let code = generateJoinCode();
    for (let i = 0; i < 5; i++) {
        const exists = await database().ref('groups').orderByChild('joinCode').equalTo(code).once('value');
        if (!exists.exists()) 
            break;
        code = generateJoinCode();
    }
    const groupRef = await database().ref('groups').push();
    const groupId = groupRef.key!;
    await groupRef.set({
      name: groupName,
      joinCode: code,
      owner: ownerUid,
      createdAt: database.ServerValue.TIMESTAMP,
      points: 0,
    });

    await database().ref(`groups/${groupId}/members/${ownerUid}`).set(true);
    return { groupId, code };
  }

  const joinGroupInDatabase = async (ownerUid: string, code: string) => {
    const group = await database().ref('groups').orderByChild('joinCode').equalTo(code).once('value');
    if (!group.exists()) {
        return null;
    }
    let foundId: string | null = null;
    let foundName: string | null = null;
    group.forEach(child => {
      foundId = child.key!;
      const val = child.val();
      foundName = val?.name ?? null;
      return true
    });
    if (!foundId) return null;
    await database().ref(`groups/${foundId}/members/${ownerUid}`).set(true);
    return { groupId: foundId, groupName: foundName };
  };

  const handleCreate = async () => {
    setError(null);
    
    if (!email.trim() || !password) {
        setError('Username and password are required.');
        return;
    }
    if (password !== confirm) {
        setError('Passwords do not match.');
        return;
    }
    if (!groupName && !joinCode) {
        setError('Create or Join a Group to Create an Account.');
        return;
    }
    if (groupName && joinCode) {
        setError('Can not create and join a group');
        return;
    }
    

    const emailTrim = email.trim();

    setSaving(true);
    try {
        const userCredential = await auth().createUserWithEmailAndPassword(
            email,
            password
        );
        const uid = userCredential.user.uid;

        let finalGroupId: string | undefined;
        let finalGroupName: string | undefined;
        let finalJoinCode: string | undefined;

        if (groupName) {
          const { groupId, code } = await createGroupInDatabase(uid);
          finalGroupId = groupId;
          finalGroupName = groupName;
          finalJoinCode = code;
        } else if (joinCode) {
          const res = await joinGroupInDatabase(uid, joinCode.trim().toUpperCase());
          if (!res) {
          setError('Join code not found.');
          await createProfile(uid, emailTrim);
          return;
          }
          finalGroupId = res.groupId;
          finalGroupName = res.groupName ?? undefined;
          finalJoinCode = joinCode.trim().toUpperCase();
        }

        await createProfile(uid, emailTrim);

        setEmail('');
        setPassword('');
        setConfirm('');
        setGroupName('');
        setJoinCode('');
        Alert.alert('Success', 'Account created.');
    } 
    catch (error: any) {
        const code = error?.code || '';
        if (code === 'auth/email-already-in-use') {
            setError('That email address is already in use.');
        } else if (code === 'auth/invalid-email') {
            setError('That email address is invalid.');
        } else if (code === 'auth/weak-password') {
            setError('Password is too weak (min 6 characters).');
        } else {
            setError(error?.message ?? 'Failed to create account.');
        }
    } 
    finally {
        setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Username or email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />
      <TextInput
        placeholder="Confirm password"
        value={confirm}
        onChangeText={setConfirm}
        style={styles.input}
        secureTextEntry
      />
      <Text>Create a Group</Text>
      <TextInput
        placeholder='Group Name'
        value={groupName}
        onChangeText={setGroupName}
        style={styles.input}
      />
      <Text>Or</Text>
      <Text>Join a Group</Text>
      <TextInput
        placeholder='Join Code'
        value={joinCode}
        onChangeText={setJoinCode}
        style={styles.input}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {saving ? (
        <ActivityIndicator />
      ) : (
        <Button title="Create account" onPress={handleCreate} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    width: 300,
    alignSelf: 'center'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 10,
    borderRadius: 4
  },
  error: {
    color: 'red',
    marginBottom: 8
  }
});