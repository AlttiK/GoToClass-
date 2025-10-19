import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
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

export default function CreateAccount() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const createProfile = async (uid: string, emailValue: string) => {
    await database()
      .ref(`users/${uid}`)
      .set({
        email: emailValue,
        createdAt: database.ServerValue.TIMESTAMP,
      });
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

    const emailTrim = email.trim();

    setSaving(true);
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(
        email,
        password
      );
      const uid = userCredential.user.uid;
      await createProfile(uid, emailTrim);

      setEmail('');
      setPassword('');
      setConfirm('');
      Alert.alert('Success', 'Account created.');
    } catch (e: any) {
      // Map common Firebase errors to friendlier messages
      const code = e?.code || '';
      if (code === 'auth/email-already-in-use') {
        setError('That email address is already in use.');
      } else if (code === 'auth/invalid-email') {
        setError('That email address is invalid.');
      } else if (code === 'auth/weak-password') {
        setError('Password is too weak (min 6 characters).');
      } else {
        setError(e?.message ?? 'Failed to create account.');
      }
      console.error('createUser error', e);
    } finally {
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