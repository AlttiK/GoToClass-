import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Button, TextInput, View } from 'react-native';

const LoginScreen = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSignIn = async () => {
        setError(null);
        setLoading(true);
        try {
            const loginInfo = await auth().signInWithEmailAndPassword(email.trim(), password);
            const uid = loginInfo.user.uid;

            const snap = await database().ref(`users/${uid}`).once('value');
            const profile = snap.val() || {};
            const groupId = profile.groupId ?? null;
            const groupName = profile.groupName ?? null;
            
            router.replace({
                pathname: "/(tabs)/home/Home",
                params: { uid, groupId, groupName }
            });
        } catch (e: any) {
        const code = e?.code || '';
            if (code === 'auth/user-not-found' || code === 'auth/wrong-password') {
                setError('Invalid email or password.');
            } else if (code === 'auth/invalid-email') {
                setError('Invalid email address.');
            } else {
                setError(e?.message ?? 'Sign in failed.');
            }
            console.error('signIn error', e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View>
            <TextInput placeholder="Username" 
                value={email} 
                onChangeText={setEmail}/>
            <TextInput
                secureTextEntry={true}
                placeholder="Password"
                value={password} 
                onChangeText={setPassword}/>
            {loading ? <ActivityIndicator /> : <Button title="Sign in" onPress={handleSignIn} />}
        </View>
    );
};

export default LoginScreen;