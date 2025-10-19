import Slider from '@react-native-community/slider';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import { Alert, Button, StyleSheet, Text, View } from "react-native";


const styles= StyleSheet.create({
  center:{
    alignItems: 'center',
  },
  container:{
    flex:1,
    padding:25,
  },
  buttonStyle: {
    flexDirection: 'row',
    justifyContent: 'space-around',
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

    const submitPress = async () => {
        user = auth().currentUser;
        setUid(user.uid);

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
        <View style={styles.container}>
            <Text>
                Completed:
            </Text>
            {log.map((entry, index) => (
                <Text key={index}>{entry}</Text>
            ))}
            <Text>
                Choose the activity you participated in:
            </Text>
            <Picker
                selectedValue={activity}
                onValueChange={(chosenActivity) => setActivity(chosenActivity)}> 
                <Picker.Item label="Class" value="Class"/>
                <Picker.Item label="Studying" value="Studying"/>
            </Picker>
            <Text>
                How much time did you spend? 
            </Text>
            <Slider
                step={0.25}
                minimumValue={0}
                maximumValue={12}
                value={time}
                onValueChange={(chosenTime) => setTime(chosenTime)}>

            </Slider>
            <Text>
                {time} hours
            </Text>
            <Button
                title="Submit"
                onPress={submitPress}/>

            {/* <View style={styles.buttonStyle}>
                <Button title="Home" onPress={() => navigation.navigate('Home')}/>
                <Button title="Input" onPress={() => navigation.navigate('Input')}/>
                <Button title="Leaderboard" onPress={() => navigation.navigate('Leader')}/>
                <Button title="Profile" onPress={() => navigation.navigate('Profile')}/>
            </View> */}
        </View>
    );

    // let onPressReturn = (
    //     <View style={styles.center}>
    //         {log.map((entry, index) => (
    //             <Text key={index}>{entry}</Text>
    //         ))}
    //     </View>
    // );
}