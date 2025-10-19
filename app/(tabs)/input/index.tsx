import Slider from '@react-native-community/slider';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";


const styles= StyleSheet.create({
  center:{
    alignItems: 'center',
  },
  box: {
    width: '100%',
    height: 50,
    backgroundColor: '#cadafa', 
    borderRadius: 5,
  },
  container:{
    flex:1,
    padding:25,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#0454F1',
    height: 40,
    borderRadius: 5,
  },
  buttonText: {
    color: '#cadafa',
    textAlign: 'center', 
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 6,
  },
  header: {
    fontSize: 24,
    color: '#0a1e45',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
}, 
component: {
    marginTop: 5,
},
slider: {
    height: 7
}, 
spacer: {
    marginTop: 5,
}, 
smallbox: { 
    backgroundColor: '#cadafa', 
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#0454F1',
    flexDirection: 'column',
    padding: 10,
    marginTop: 2,
}, 
tiny: {
    fontSize: 12,
    color: '0a1e45',
}
  
});


export default function Index({ navigation }: any, user: any) {
    const [activity, setActivity] = useState('Class');
    const [time, setTime] = useState(0);
    const [log, setLog] = useState<string[]>([]);
    const [points, setPoints] = useState(0);
    // const [pointsEarned, setPointsEarned] = useState(0);
    const [uid, setUid] = useState<string | null>(null); 
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const user = auth().currentUser;
        if (user) {
        setUid(user.uid);
        }
    }, []);

    const submitPress = async () => {

        if(time === 0) {
            Alert.alert('Error', 'Please set a time greater than 0');
            return;
        }
        const pointsToAdd = time/2;
        // setPointsEarned(pointsToAdd);
        const newEntry = `Activity: ${activity}, Time Spent: ${time} hours, Points Earned: ${pointsToAdd}`;
        setPoints(points + pointsToAdd);
        setLog((prevLog) => [...prevLog, newEntry]);
        // setPoints((points) => points + 1);

        // get the user's points, then update with new points
        setError(null);
        setLoading(true);
        try {
            await database().ref(`users/${uid}/points`).transaction((points) => {
                return (points || 0 ) + pointsToAdd;
            });
            // setLog((prevLog) => [...prevLog, newEntry]);
            // setPoints(points + pointsToAdd);
        }
        catch(e) {
            setError('Failed to submit activity. Please try again.');
        } finally {
            setLoading(false);
        }

        

        // await database().ref(`users/${user}`).update({points: points + 1});

    };
    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Input log</Text>
            <Text style={styles.container}>
                Choose the activity you participated in:
            </Text>
            <Picker
                style={styles.box}
                selectedValue={activity}
                onValueChange={(chosenActivity) => setActivity(chosenActivity)}> 
                <Picker.Item label="Class" value="Class"/>
                <Picker.Item label="Studying" value="Studying"/>
            </Picker>
            <Text style={styles.container}>
                How much time did you spend? 
            </Text>
            <Slider
                style={styles.slider}
                step={0.25}
                minimumValue={0}
                maximumValue={12}
                value={time}
                onValueChange={(chosenTime) => setTime(chosenTime)}
                minimumTrackTintColor='#0a1e45'
                maximumTrackTintColor='#0a1e45'
                thumbTintColor='#0a1e45'>

            </Slider>
            <Text style={styles.spacer}>
                {time} hours
            </Text>
            {/* <Button
                title="Submit"
                onPress={submitPress}
                /> */}
            <TouchableOpacity style={styles.button} onPress={submitPress}>
                <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
            <Text style={styles.container}>
                Completed:
            </Text>
            {log.map((entry, index) => (
                <View style={styles.smallbox}>
                    <Text key={index} style={styles.tiny}>{entry}</Text>
                </View>
            ))}

            {/* <View style={styles.buttonStyle}>
                <Button title="Home" onPress={() => navigation.navigate('Home')}/>
                <Button title="Input" onPress={() => navigation.navigate('Input')}/>
                <Button title="Leaderboard" onPress={() => navigation.navigate('Leader')}/>
                <Button title="Profile" onPress={() => navigation.navigate('Profile')}/>
            </View> */}
        </ScrollView>
    );

    // let onPressReturn = (
    //     <View style={styles.center}>
    //         {log.map((entry, index) => (
    //             <Text key={index}>{entry}</Text>
    //         ))}
    //     </View>
    // );
}